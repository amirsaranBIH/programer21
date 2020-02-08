<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LectureModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('AuthModel', 'auth');
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

    public function getAllPublicLecturesForUserByCourseId($courseId, $userId) {
        $sql = "SELECT
                    l.id,
                    l.title,
                    l.slug,
                    l.description,
                    l.status,
                    l.difficulty,
                    l.skippable,
                    l.creator,
                    l.course,
                    l.orderIndex,
                    l.createdAt,
                    l.updatedAt,
                    IF(fl.id IS NULL, 0, 1) AS finished,
                    fl.skipped
                FROM
                    lectures l
                LEFT JOIN
                    finished_lectures fl
                ON
                    l.id = fl.lectureId AND fl.userId = ?
                WHERE
                    l.course = ? AND l.status = 'public'
                ORDER BY
                    l.orderIndex";

        $query = $this->db->query($sql, array(
            $userId,
            $courseId
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

        $lecture = $query->result();

        return $lecture;
    }

    public function searchLecturesByTitle($searchQuery) {
        $escapedSearchQuery = $this->db->escape_like_str($searchQuery);

        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    status,
                    difficulty,
                    skippable,
                    creator,
                    course,
                    orderIndex,
                    createdAt,
                    updatedAt
                FROM
                    lectures
                WHERE
                    title LIKE '%$escapedSearchQuery%'
                ORDER BY
                    orderIndex";

        $query = $this->db->query($sql);

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
        
        $sessionUser = $this->auth->getUserSession();

        $query = $this->db->query($sql, array(
            $lectureData['title'],
            $lectureData['slug'],
            $lectureData['description'],
            $lectureData['difficulty'],
            $lectureData['skippable'],
            $sessionUser->id,
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

        $this->db->trans_complete();

        return $newlyCreatedLectureId; // Returns ID of newly created lecture
    }

    public function updateLecture($lectureId, $lectureData) {
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
}
