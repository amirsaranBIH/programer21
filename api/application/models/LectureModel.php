<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LectureModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('AuthModel', 'auth');
        $this->load->model('CourseModel', 'course');
        $this->load->model('ContentfulModel', 'contentful');
    }

    public function getAllLecturesByCourseId($courseId) {
        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    status,
                    difficulty,
                    skippable,
                    ert,
                    creator,
                    course,
                    orderIndex,
                    createdAt,
                    updatedAt
                FROM
                    lectures
                WHERE
                    course = ?
                ORDER BY
                    orderIndex";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return handleSuccess($lectures);
    }

    public function getAllPublicLecturesByCourseId($courseId) {
        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    status,
                    difficulty,
                    skippable,
                    ert,
                    creator,
                    course,
                    orderIndex,
                    createdAt,
                    updatedAt
                FROM
                    lectures
                WHERE
                    course = ? AND status = 'public'
                ORDER BY
                    orderIndex";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return handleSuccess($lectures);
    }

    public function getAllPublicLecturesForUserByCourseSlug($courseSlug, $userId) {
        $sql = "SELECT
                    l.id,
                    l.title,
                    l.slug,
                    l.description,
                    l.status,
                    l.difficulty,
                    l.skippable,
                    l.ert,
                    l.creator,
                    l.course,
                    l.orderIndex,
                    l.createdAt,
                    l.updatedAt,
                    IF(fl.id IS NULL, 0, 1) AS finished,
                    fl.skipped,
                    IF (l.id = uc.currentLectureId, 1, 0) as isCurrentLecture,
                    IF(l.orderIndex <= (SELECT orderIndex FROM lectures WHERE lectures.id = uc.currentLectureId), 1, 0) AS isUnlocked
                FROM
                    lectures l
                LEFT JOIN
                    finished_lectures fl
                ON
                    l.id = fl.lectureId AND fl.userId = ?
                LEFT JOIN
                    courses c
                ON
                    c.id = l.course
                LEFT JOIN
                    user_courses uc
                ON
                    uc.courseId = c.id
                AND
                    uc.userId = ?
                WHERE
                    c.slug = ? AND l.status = 'public'
                ORDER BY
                    l.orderIndex";

        $query = $this->db->query($sql, array(
            $userId,
            $userId,
            $courseSlug
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return handleSuccess($lectures);
    }

    public function getLectureById($lectureId) {
        $isLectureUnlockedResponse = $this->isLectureUnlockedForCurrentUserById($lectureId);

        if (!$isLectureUnlockedResponse['status']) {
            return handleError($isLectureUnlockedResponse['message'], false);
        }

        if (!$isLectureUnlockedResponse['data']) {
            return handleError('Lecture not unlocked', false, true);
        }

        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    status,
                    difficulty,
                    skippable,
                    ert,
                    creator,
                    course,
                    orderIndex,
                    createdAt,
                    updatedAt
                FROM
                    lectures
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $lectureId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lecture = $query->first_row();

        if (!$lecture) {
            return handleError('There is no lecture with id: ' . $lectureId);
        }

        return handleSuccess($lecture);
    }

    public function getLectureBySlug($lectureSlug) {
        $isLectureUnlockedResponse = $this->isLectureUnlockedForCurrentUserBySlug($lectureSlug);

        if (!$isLectureUnlockedResponse['status']) {
            return handleError($isLectureUnlockedResponse['message'], false);
        }

        if (!$isLectureUnlockedResponse['data']) {
            return handleError('Lecture not unlocked', false, true);
        }

        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    status,
                    difficulty,
                    skippable,
                    ert,
                    creator,
                    course,
                    orderIndex,
                    contentfulEntryId,
                    createdAt,
                    updatedAt
                FROM
                    lectures
                WHERE
                    slug = ?";

        $query = $this->db->query($sql, $lectureSlug);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lecture = $query->first_row();

        if (!$lecture) {
            return handleError('There is no lecture with slug: ' . $lectureSlug);
        }

        $isLectureFinishedResponse = $this->isLectureFinishedForCurrentUserById($lecture->id);

        if (!$isLectureFinishedResponse['status']) {
            return handleError($isLectureFinishedResponse['message'], false);
        }

        $lecture->finished = $isLectureFinishedResponse['data'];

        $getEntryBodyResponse = $this->contentful->getEntryBody($lecture->contentfulEntryId);

        if (!$getEntryBodyResponse['status']) {
            return handleError($getEntryBodyResponse['message']);
        }

        $lecture->body = $getEntryBodyResponse['data'];

        return handleSuccess($lecture);
    }

    public function getLectureHtmlBySlug($lectureSlug) {
        $sql = "SELECT
                    courses.slug
                FROM
                    lectures
                INNER JOIN
                    courses
                ON
                    courses.id = lectures.course
                WHERE
                    lectures.slug = ?";

        $query = $this->db->query($sql, $lectureSlug);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $row = $query->first_row();

        if (!$row) {
            return handleError('There is no lecture with slug: ' . $lectureSlug);
        }

        $courseSlug = $row->slug;

        $filePath = FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $lectureSlug . '.html';
        
        $lectureHtml = file_get_contents($filePath);

        if (!$lectureHtml) {
            return handleError('Tried to get file, but does not exist: ' . $filePath);
        }

        return handleSuccess($lectureHtml);
    }

    public function createLecture($courseId, $lectureData) {
        $this->db->trans_start();

        $sql = "SELECT
                    IF(MAX(orderIndex) + 1 IS NULL, 1, MAX(orderIndex) + 1) AS nextOrderIndex
                FROM
                    lectures
                WHERE
                    course = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $row = $query->first_row();

        if (!$row) {
            return handleError('There is no lecture with course: ' . $courseId);
        }

        $nextOrderIndex = $row->nextOrderIndex;

        $sql = "INSERT INTO
                    lectures
                (
                    `title`,
                    `slug`,
                    `description`,
                    `difficulty`,
                    `ert`,
                    `skippable`,
                    `creator`,
                    `course`,
                    `orderIndex`
                ) VALUES
                ( 
                    ?, ?, ?, ?, ?, ?, ?, ?, ?
                )";
        
        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message'], false);
        }

        $userData = $userDataResponse['data'];

        $query = $this->db->query($sql, array(
            $lectureData['title'],
            $lectureData['slug'],
            $lectureData['description'],
            $lectureData['difficulty'],
            $lectureData['ert'],
            $lectureData['skippable'],
            $userData->id,
            $courseId,
            $nextOrderIndex
        ));
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }  

        $newlyCreatedLectureId = $this->db->insert_id();

        $createLectureQuizQuestionsResponse = $this->createLectureQuizQuestions($lectureData['quizQuestions'], $newlyCreatedLectureId);

        if (!$createLectureQuizQuestionsResponse['status']) {
            return handleError($createLectureQuizQuestionsResponse['message'], false);
        }

        $createContentfulEntryResponse = $this->contentful->createEntry($lectureData['title']);

        if (!$createContentfulEntryResponse['status']) {
            return handleError($createContentfulEntryResponse['message'], false);
        }

        $setLectureContentfulEntryIdResponse = $this->setLectureContentfulEntryId($newlyCreatedLectureId, $createContentfulEntryResponse['data']);

        if (!$setLectureContentfulEntryIdResponse['status']) {
            return handleError($setLectureContentfulEntryIdResponse['message'], false);
        }

        $this->db->trans_complete();

        return handleSuccess($newlyCreatedLectureId); // Returns ID of newly created lecture
    }

    public function updateLecture($lectureId, $lectureData) {
        $sql = "UPDATE
                    lectures
                SET
                    title = ?,
                    slug = ?,
                    description = ?,
                    difficulty = ?,
                    ert = ?,
                    status = ?,
                    skippable = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $lectureData['title'],
            $lectureData['slug'],
            $lectureData['description'],
            $lectureData['difficulty'],
            $lectureData['ert'],
            $lectureData['status'],
            $lectureData['skippable'],
            $lectureId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $updateLectureQuizQuestionsResponse = $this->updateLectureQuizQuestions($lectureData['quizQuestions'], $lectureData['deletedQuizQuestions'], $lectureData['deletedQuizAnswers'], $lectureId);

        if (!$updateLectureQuizQuestionsResponse['status']) {
            return handleError($updateLectureQuizQuestionsResponse['message'], false);
        }

        return handleSuccess(true);
    }

    public function deleteLecture($lectureId) {
        $sql = "SELECT
                    l.slug AS lectureSlug,
                    c.slug AS courseSlug
                FROM
                    lectures l
                LEFT JOIN
                    courses c
                ON
                    c.id = l.course
                WHERE
                    l.id = ?";

        $query = $this->db->query($sql, $lectureId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lecture = $query->first_row();

        if (!$lecture) {
            return handleError('Trying to delete lecture but there is no lecture with id: ' . $lectureId);
        }

        $sql = "DELETE FROM
                    lectures
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $lectureId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function finishLecture($lectureId, $finishedLectureCourseId) {
        $isQuizAnsweredResponse = $this->isQuizAnswered($lectureId);
        
        if (!$isQuizAnsweredResponse['status']) {
            return handleError($isQuizAnsweredResponse['message'], false);
        }
        
        if (!$isQuizAnsweredResponse['data']) {
            return handleError('Quiz questions not answered', false, true);
        }

        $this->db->trans_start();

        $sql = "SELECT
                    l.id,
                    l.slug
                FROM
                    lectures l
                LEFT JOIN
                    user_courses uc
                ON
                    l.id = uc.currentLectureId
                WHERE 
                    l.orderIndex > (
                        SELECT 
                            l.orderIndex 
                        FROM 
                            lectures l
                        WHERE 
                            l.id = ?
                    )
                AND
                    l.course = ?
                AND
                    l.status = 'public'
                ORDER BY 
                    orderIndex
                LIMIT 1";

        $query = $this->db->query($sql, array(
            $lectureId,
            $finishedLectureCourseId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $nextLecture = $query->first_row();

        $response = null;

        if ($nextLecture) {
            $nextLectureId = $nextLecture->id;
    
            $sql = "UPDATE
                        user_courses
                    SET
                        currentLectureId = ?,
                        quizAnswered = 0
                    WHERE
                        courseId = ?";
    
            $query = $this->db->query($sql, array(
                $nextLectureId,
                $finishedLectureCourseId
            ));
    
            if (!$query) {
                return handleError($this->db->error()['message']);
            }

            $this->db->trans_complete();

            $response = $nextLecture->slug;
        } else {
            $finishCourseResponse = $this->course->finishCourse($finishedLectureCourseId);

            if (!$finishCourseResponse['status']) {
                return handleError($finishCourseResponse['message'], false);
            }

            $this->db->trans_complete();

            $response = -1;
        }

        $addLectureResponse = $this->addLectureToLatestFinishedLectures($lectureId);
    
        if (!$addLectureResponse['status']) {
            return handleError($addLectureResponse['message'], false);
        }

        $this->db->trans_complete();

        return handleSuccess($response);
    }

    public function verifyQuizAnswers($lectureSlug, $quizAnswers) {
        $isLectureUnlockedResponse = $this->isLectureUnlockedForCurrentUserBySlug($lectureSlug);
        
        if (!$isLectureUnlockedResponse['status']) {
            return handleError($isLectureUnlockedResponse['message'], false);
        }
        
        if (!$isLectureUnlockedResponse['data']) {
            return handleError('Lecture not unlocked', false, true);
        }

        $this->db->trans_start();

        $allCorrect = true;

        foreach ($quizAnswers as &$answer) {
            if (!isset($answer['answer'])) {
                $answer['wrongAnswer'] = true;
                $answer['error'] = 'Not answered!';
                $allCorrect = false;
            } else {
                $sql = "SELECT
                            COUNT(1) AS isCorrectAnswer
                        FROM
                            quiz_questions
                        WHERE
                            question = ?
                        AND
                            answer = ?";
    
                $query = $this->db->query($sql, array(
                    $answer['question'],
                    $answer['answer']
                ));
    
                if (!$query) {
                    return handleError($this->db->error()['message']);
                }

                $isAnswerCorrect = (int)$query->first_row()->isCorrectAnswer;

                if ($isAnswerCorrect) {
                    $answer['wrongAnswer'] = false;

                    if (isset($answer['error'])) {
                        unset($answer['error']);
                    }
                } else {
                    $answer['wrongAnswer'] = true;
                    $answer['error'] = 'Wrong answer!';
                    $allCorrect = false;
                }
            }
        }

        if ($allCorrect) {
            $sql = "UPDATE
                        user_courses uc
                    INNER JOIN
                        lectures l
                    ON
                        l.id = uc.currentLectureId
                    SET
                        uc.quizAnswered = 1
                    WHERE
                        l.slug = ?
                    AND
                        uc.userId = ?";
            
            $userDataResponse = $this->auth->getCurrentUser();

            if (!$userDataResponse['status']) {
                return handleError($userDataResponse['message'], false);
            }

            $userData = $userDataResponse['data'];
    
            $query = $this->db->query($sql, array(
                $lectureSlug,
                $userData->id
            ));

            if (!$query) {
                return handleError($this->db->error()['message']);
            }
        }

        $this->db->trans_complete();

        return handleSuccess($quizAnswers);
    }

    public function addLectureToLatestFinishedLectures($lectureId, $skipped = false) {
        $sql = "INSERT INTO
                    finished_lectures
                (
                    `lectureId`,
                    `userId`,
                    `skipped`
                ) VALUES 
                (
                    ?, ?, ?
                )";

        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message'], false);
        }

        $userData = $userDataResponse['data'];

        $query = $this->db->query($sql, array(
            $lectureId,
            $userData->id,
            $skipped
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function isLectureUnlockedForCurrentUserById($lectureId) {
        $sql = "SELECT 
                    lectureId AS isCourseUnlocked
                FROM 
                    finished_lectures
                WHERE
                    lectureId = ?
                AND
                    userId = ?
                UNION
                SELECT 
                    currentLectureId AS isCourseUnlocked
                FROM
                    user_courses
                WHERE
                    currentLectureId = ?
                AND
                    userId = ?";

        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message'], false);
        }

        $userData = $userDataResponse['data'];

        if ($userData->role === 'administrator') {
            return handleSuccess(true);
        }

        $query = $this->db->query($sql, array(
            $lectureId,
            $userData->id,
            $lectureId,
            $userData->id
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $isCourseUnlocked = (bool)$query->first_row();

        return handleSuccess($isCourseUnlocked);
    }

    public function isLectureFinishedForCurrentUserById($lectureId) {
        $sql = "SELECT 
                    lectureId AS isCourseUnlocked
                FROM 
                    finished_lectures
                WHERE
                    lectureId = ?
                AND
                    userId = ?";

        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message'], false);
        }

        $userData = $userDataResponse['data'];

        if ($userData->role === 'administrator') {
            return handleSuccess(true);
        }

        $query = $this->db->query($sql, array(
            $lectureId,
            $userData->id
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $isCourseUnlocked = (bool)$query->first_row();

        return handleSuccess($isCourseUnlocked);
    }

    public function isLectureUnlockedForCurrentUserBySlug($lectureSlug) {
        $sql = "SELECT 
                    lectureId AS isCourseUnlocked
                FROM 
                    finished_lectures fl
                LEFT JOIN
                    lectures l
                ON
                l.id = fl.lectureId
                WHERE
                    l.slug = ?
                AND
                    userId = ?
                UNION
                SELECT 
                    currentLectureId AS isCourseUnlocked
                FROM
                    user_courses uc
                LEFT JOIN
                    lectures l
                ON
                l.id = uc.currentLectureId
                WHERE
                    l.slug = ?
                AND
                    userId = ?";

        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message'], false);
        }

        $userData = $userDataResponse['data'];

        if ($userData->role === 'administrator' || $userData->role === 'moderator') {
            return handleSuccess(true);
        }

        $query = $this->db->query($sql, array(
            $lectureSlug,
            $userData->id,
            $lectureSlug,
            $userData->id
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $isCourseUnlocked = (bool)$query->first_row();

        return handleSuccess($isCourseUnlocked);
    }

    public function createLectureQuizQuestions($quizQuestions, $lectureId) {
        $this->db->trans_start();

        foreach ($quizQuestions as $question) {
            $sql = "INSERT INTO
                        quiz_questions
                    (
                        `lectureId`,
                        `question`,
                        `answer`
                    ) VALUES (
                        ?, ?, ?
                    )";

            $query = $this->db->query($sql, array(
                $lectureId,
                $question['question'],
                $question['answer']
            ));
    
            if (!$query) {
                return handleError($this->db->error()['message']);
            }

            $newQuizQuestionId = $this->db->insert_id();

            foreach ($question['answers'] as $answer) {
                $sql = "INSERT INTO
                            quiz_question_answers
                        (
                            `quizQuestionId`,
                            `answer`
                        ) VALUES (
                            ?, ?
                        )";

                $query = $this->db->query($sql, array(
                    $newQuizQuestionId,
                    $answer['answer']
                ));
        
                if (!$query) {
                    return handleError($this->db->error()['message']);
                }
            }
        }

        $this->db->trans_complete();

        return handleSuccess(true);
    }

    public function updateLectureQuizQuestions($quizQuestions, $deletedQuizQuestions, $deletedQuizAnswers, $lectureId) {
        $this->db->trans_start();

        foreach ($quizQuestions as $question) {
            if (isset($question['id'])) {

                $sql = "UPDATE
                            quiz_questions
                        SET
                            `question` = ?,
                            `answer` = ?
                        WHERE
                            id = ?";
    
                $query = $this->db->query($sql, array(
                    $question['question'],
                    $question['answer'],
                    $question['id']
                ));

                if (!$query) {
                    return handleError($this->db->error()['message']);
                }

                $questionId = $question['id'];
            } else {
                $sql = "INSERT INTO
                            quiz_questions
                        (
                            `lectureId`,
                            `question`,
                            `answer`
                        ) VALUES (
                            ?, ?, ?
                        )";
    
                $query = $this->db->query($sql, array(
                    $lectureId,
                    $question['question'],
                    $question['answer']
                ));
        
                if (!$query) {
                    return handleError($this->db->error()['message']);
                }
    
                $questionId = $this->db->insert_id();
            }

            foreach ($question['answers'] as $answer) {
                if (isset($answer['id'])) {
                    $sql = "UPDATE
                                quiz_question_answers
                            SET
                                `quizQuestionId` = ?,
                                `answer` = ?
                            WHERE
                                id = ?";

                    $query = $this->db->query($sql, array(
                        $questionId,
                        $answer['answer'],
                        $answer['id']
                    ));

                    if (!$query) {
                        return handleError($this->db->error()['message']);
                    }
                } else {
                    $sql = "INSERT INTO
                                quiz_question_answers
                            (
                                `quizQuestionId`,
                                `answer`
                            ) VALUES (
                                ?, ?
                            )";
    
                    $query = $this->db->query($sql, array(
                        $questionId,
                        $answer['answer']
                    ));
            
                    if (!$query) {
                        return handleError($this->db->error()['message']);
                    }
                }
            }
        }

        foreach ($deletedQuizQuestions as $deletedQuestionId) {
            $sql = "DELETE FROM
                        quiz_questions
                    WHERE
                        id = ?";
            
            $query = $this->db->query($sql, $deletedQuestionId);
    
            if (!$query) {
                return handleError($this->db->error()['message']);
            }
        }

        foreach ($deletedQuizAnswers as $deletedAnswerId) {
            $sql = "DELETE FROM
                        quiz_question_answers
                    WHERE
                        id = ?";
            
            $query = $this->db->query($sql, $deletedAnswerId);
    
            if (!$query) {
                return handleError($this->db->error()['message']);
            }
        }

        $this->db->trans_complete();

        return handleSuccess(true);
    }

    public function getLectureQuizQuestionById($lectureId) {
        $this->db->trans_start();

        $sql = "SELECT
                    id,
                    question,
                    answer
                FROM
                    quiz_questions
                WHERE
                    lectureId = ?";

        $query = $this->db->query($sql, $lectureId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $quizQuestions = array();

        foreach ($query->result() as $question) {
            $sql = "SELECT
                        id,
                        answer
                    FROM
                        quiz_question_answers
                    WHERE
                        quizQuestionId = ?";

            $query = $this->db->query($sql, $question->id);

            if (!$query) {
                return handleError($this->db->error()['message']);
            }

            $question->answers = array();

            foreach ($query->result() as $answer) {
                array_push($question->answers, $answer);
            }

            array_push($quizQuestions, $question);
        }

        $this->db->trans_complete();

        return handleSuccess($quizQuestions);
    }

    public function getLectureQuizQuestionBySlug($lectureSlug) {
        $isLectureUnlockedResponse = $this->isLectureUnlockedForCurrentUserBySlug($lectureSlug);

        if (!$isLectureUnlockedResponse['status']) {
            return handleError($isLectureUnlockedResponse['message'], false);
        }

        if (!$isLectureUnlockedResponse['data']) {
            return handleError('Lecture not unlocked', false, true);
        }

        $this->db->trans_start();

        $sql = "SELECT
                    qq.id,
                    qq.question
                FROM
                    quiz_questions qq
                INNER JOIN
                    lectures l
                ON
                    qq.lectureId = l.id
                WHERE
                    l.slug = ?";

        $query = $this->db->query($sql, $lectureSlug);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $quizQuestions = array();

        foreach ($query->result() as $question) {
            $sql = "SELECT
                        id,
                        answer
                    FROM
                        quiz_question_answers
                    WHERE
                        quizQuestionId = ?";

            $query = $this->db->query($sql, $question->id);

            if (!$query) {
                return handleError($this->db->error()['message']);
            }

            $question->answers = array();

            foreach ($query->result() as $answer) {
                array_push($question->answers, $answer);
            }

            array_push($quizQuestions, $question);
        }

        $this->db->trans_complete();

        return handleSuccess($quizQuestions);
    }

    public function isQuizAnswered($lectureId) {
        $isLectureUnlockedResponse = $this->isLectureUnlockedForCurrentUserById($lectureId);

        if (!$isLectureUnlockedResponse['status']) {
            return handleError($isLectureUnlockedResponse['message'], false);
        }

        if (!$isLectureUnlockedResponse['data']) {
            return handleError('Lecture not unlocked', false, true);
        }

        $sql = "SELECT
                    quizAnswered
                FROM
                    user_courses
                WHERE
                    currentLectureId = ?
                AND
                    userId = ?";
        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message'], false);
        }

        $userData = $userDataResponse['data'];

        $query = $this->db->query($sql, array(
            $lectureId,
            $userData->id
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $res = $query->first_row();
        if (!$res) {
            return handleSuccess(false);
        }   

        return handleSuccess((int)$res->quizAnswered);
    }

    public function toggleLectureStatus($lectureId, $newStatus) {
        $sql = "UPDATE
                    lectures
                SET
                    status = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $newStatus,
            $lectureId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function setLectureContentfulEntryId($lectureId, $entryId) {
        $sql = "UPDATE
                    lectures
                SET
                    contentfulEntryId = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $entryId,
            $lectureId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }
}
