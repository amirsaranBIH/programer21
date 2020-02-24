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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return $lectures;
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return $lectures;
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return $lectures;
    }

    public function getLectureById($lectureId) {
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $lecture = $query->first_row();

        return $lecture;
    }

    public function getLectureBySlug($lectureSlug) {
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $lecture = $query->first_row();

        return $lecture;
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $courseSlug = $query->first_row()->slug;

        $lectureHtml = file_get_contents(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $lectureSlug . '.php');

        return $lectureHtml;
    }

    public function createLecture($courseId, $lectureData) {
        $this->db->trans_start();

        $sql = "SELECT
                    IF(MAX(orderIndex) + 1 IS NULL, 1, MAX(orderIndex) + 1) AS nextIOrderIndex
                FROM
                    lectures
                WHERE
                    course = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $nextIOrderIndex = $query->first_row()->nextIOrderIndex;

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
        
        $userData = $this->auth->getCurrentUser();

        $query = $this->db->query($sql, array(
            $lectureData['title'],
            $lectureData['slug'],
            $lectureData['description'],
            $lectureData['difficulty'],
            $lectureData['skippable'],
            $userData['payload']->id,
            $courseId,
            $nextIOrderIndex
        ));

        $newlyCreatedLectureId = $this->db->insert_id();

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }    

        $sql = "INSERT INTO
                    course_lectures
                (
                    `courseId`,
                    `lectureId`
                ) VALUES
                ( 
                    ?, ?
                )";

        $query = $this->db->query($sql, array(
            $courseId,
            $newlyCreatedLectureId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $courseSlug = $this->course->getCourseById($courseId)->slug;

        $status = $this->makeLectureFile($courseSlug, $lectureData['slug']);

        if (!$status) {
            log_message('error', 'Could not create lecture file');
            return false;
        }

        $this->db->trans_complete();

        return $newlyCreatedLectureId; // Returns ID of newly created lecture
    }

    public function updateLecture($lectureId, $lectureData) {
        $lecture = $this->getLectureById($lectureId);

        $courseSlug = $this->course->getCourseById($lecture->course)->slug;

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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $status = $this->renameLectureFile($courseSlug, $lecture->slug, $lectureData['slug']);

        if (!$status) {
            log_message('error', 'Could not rename lecture file');
            return false;
        }


        return true;
    }

    public function deleteLecture($lectureId) {
        $sql = "DELETE FROM
                    lectures
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $lectureId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
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
                        INNER JOIN 
                            user_courses uc
                        ON 
                            uc.courseId = ? 
                        WHERE 
                            l.id = uc.currentLectureId
                    )
                AND
                    l.course = ?
                ORDER BY 
                    orderIndex
                LIMIT 1";

        $query = $this->db->query($sql, array(
            $finishedLectureCourseId,
            $finishedLectureCourseId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
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
                log_message('error', $this->db->error()['message']);
                return false;
            }

            $this->db->trans_complete();

            $response = $nextLecture->slug;
        } else {
            $status = $this->course->finishCourse($finishedLectureCourseId);

            if (!$status) {
                log_message('error', 'Could not finish course');
                return false;
            }

            $this->db->trans_complete();

            $response = -1;
        }

        $status = $this->addLectureToLatestFinishedLectures($lectureId);
    
        if (!$status) {
            log_message('error', 'Could not add lecture to latest finished lectures');
            return false;
        }

        $this->db->trans_complete();

        return $response;
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

        $userData = $this->auth->getCurrentUser();

        $query = $this->db->query($sql, array(
            $lectureId,
            $userData['payload']->id,
            $skipped
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function makeLectureFile($courseSlug, $lectureSlug) {
        return fopen(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $lectureSlug. '.php', 'w');
    }

    public function renameLectureFile($courseSlug, $oldLectureSlug, $newLectureSlug) {
        return rename(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $oldLectureSlug. '.php', 
                        FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug . DIRECTORY_SEPARATOR . $newLectureSlug. '.php');
    }
}
