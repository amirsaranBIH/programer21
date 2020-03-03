<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LectureModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('AuthModel', 'auth');
        $this->load->model('CourseModel', 'course');
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
                    `skippable`,
                    `creator`,
                    `course`,
                    `orderIndex`
                ) VALUES
                ( 
                    ?, ?, ?, ?, ?, ?, ?, ?
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
            $lectureData['skippable'],
            $userData->id,
            $courseId,
            $nextOrderIndex
        ));
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }  

        $newlyCreatedLectureId = $this->db->insert_id();

        $courseResponse = $this->course->getCourseById($courseId);

        if (!$courseResponse['status']) {
            return handleError($courseResponse['message']);
        }

        $courseSlug = $courseResponse['data']->slug;

        $makeLectureFileResponse = $this->makeLectureFile($courseSlug, $lectureData['slug']);

        if (!$makeLectureFileResponse['status']) {
            return handleError($makeLectureFileResponse['message'], false);
        }

        return handleSuccess($newlyCreatedLectureId); // Returns ID of newly created lecture
    }

    public function updateLecture($lectureId, $lectureData) {
        $lectureReponse = $this->getLectureById($lectureId);

        if (!$lectureReponse['status']) {
            return handleError($lectureReponse['message'], false);
        }

        $lecture = $lectureReponse['data'];

        $courseResponse = $this->course->getCourseById($lecture->course);

        if (!$courseResponse['status']) {
            return handleError($courseResponse['message'], false);
        }

        $courseSlug = $courseResponse['data']->slug;

        $sql = "UPDATE
                    lectures
                SET
                    title = ?,
                    slug = ?,
                    description = ?,
                    difficulty = ?,
                    status = ?,
                    skippable = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $lectureData['title'],
            $lectureData['slug'],
            $lectureData['description'],
            $lectureData['difficulty'],
            $lectureData['status'],
            $lectureData['skippable'],
            $lectureId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $renameLectureFileResponse = $this->renameLectureFile($courseSlug, $lecture->slug, $lectureData['slug']);

        if (!$renameLectureFileResponse['status']) {
            return handleError($renameLectureFileResponse['message'], false);
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

        $deleteLectureFileResponse = $this->deleteLectureFile($lecture->courseSlug, $lecture->lectureSlug);

        if (!$deleteLectureFileResponse['status']) {
            return handleError($deleteLectureFileResponse['message'], false);
        }

        return handleSuccess(true);
    }

    public function finishLecture($lectureId, $finishedLectureCourseId) {
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
                        currentLectureId = ?
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

    public function makeLectureFile($courseSlug, $lectureSlug) {
        if (!file_exists(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug)) {
            return handleError('Trying to create lecture file, but course folder does not exist: ' . $courseSlug);
        }

        $response = fopen(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $lectureSlug. '.html', 'w');

        return $response ? handleSuccess($response) : handleError($response);
    }

    public function renameLectureFile($courseSlug, $oldLectureSlug, $newLectureSlug) {
        $oldFilePath = FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $oldLectureSlug. '.html';
        $newFilePath = FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $newLectureSlug. '.html';

        if (!file_exists(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug)) {
            return handleError('Trying to rename lecture file, but course folder does not exist: ' . $courseSlug);
        }

        if (!file_exists($oldFilePath)) {
            return handleError('Trying to rename lecture file that does not exist: ' . $oldFilePath);
        }

        $response = rename($oldFilePath, $newFilePath);

        return $response ? handleSuccess($response) : handleError($response);
    }

    public function deleteLectureFile($courseSlug, $lectureSlug) {
        $filePath = FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $lectureSlug. '.html';
        if (file_exists($filePath)) {
            $response = unlink($filePath);
            return $response ? handleSuccess($response) : handleError('There was an error while deleting lecture file: ' . $filePath);
        } else {
            return handleError('Trying to delete lecture file that does not exist: ' . $filePath);
        }
    }
}
