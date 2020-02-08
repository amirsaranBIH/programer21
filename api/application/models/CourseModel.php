<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CourseModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('AuthModel', 'auth');
    }

    public function getAllCourses() {
        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    image,
                    status,
                    difficulty,
                    price,
                    shortName,
                    color,
                    createdAt,
                    updatedAt,
                    (SELECT COUNT(1) FROM course_lectures WHERE course_lectures.courseId = courses.id) AS numberOfLectures,
                    (SELECT SUM(ert) FROM lectures WHERE lectures.course = courses.id) AS totalErt
                FROM
                    courses";

        $query = $this->db->query($sql);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return $courses;
    }

    public function getAllPublicCourses() {
        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    image,
                    status,
                    difficulty,
                    price,
                    shortName,
                    color,
                    createdAt,
                    updatedAt,
                    (SELECT COUNT(1) FROM course_lectures WHERE course_lectures.courseId = courses.id) AS numberOfLectures,
                    (SELECT SUM(ert) FROM lectures WHERE lectures.course = courses.id) AS totalErt
                FROM
                    courses
                WHERE
                    status = 'public'";

        $query = $this->db->query($sql);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return $courses;
    }

    public function getCourseById($courseId) {
        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    image,
                    status,
                    difficulty,
                    price,
                    shortName,
                    color,
                    createdAt,
                    updatedAt
                FROM
                    courses
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $course = $query->first_row();

        $course->supportedLanguages = $this->getSupportedLanguages($courseId);

        return $course;
    }

    public function getCourseBySlug($courseSlug) {
        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    image,
                    status,
                    difficulty,
                    price,
                    shortName,
                    color,
                    createdAt,
                    updatedAt
                FROM
                    courses
                WHERE
                    slug = ?";

        $query = $this->db->query($sql, $courseSlug);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $course = $query->first_row();

        return $course;
    }

    public function searchCoursesByTitle($searchQuery) {
        $escapedSearchQuery = $this->db->escape_like_str($searchQuery);

        $sql = "SELECT
                    id,
                    title,
                    slug,
                    description,
                    image,
                    status,
                    difficulty,
                    price,
                    shortName,
                    color,
                    createdAt,
                    updatedAt
                FROM
                    courses
                WHERE
                    title LIKE '%$escapedSearchQuery%'";

        $query = $this->db->query($sql);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return $courses;
    }

    public function createCourse($courseData) {
        $sql = "INSERT INTO
                    courses
                (
                    `title`,
                    `slug`,
                    `description`,
                    `difficulty`,
                    `price`,
                    `shortName`,
                    `color`,
                    `creator`
                ) VALUES
                ( ?, ?, ?, ?, ?, ?, ?, ? )";

        $sessionUser = $this->auth->getUserSession();

        $query = $this->db->query($sql, array(
            $courseData['title'],
            $courseData['slug'],
            $courseData['description'],
            $courseData['difficulty'],
            $courseData['price'],
            $courseData['shortName'],
            $courseData['color'],
            $sessionUser->id
        ));

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $newlyCreatedCourseId = $this->db->insert_id();

        $status = $this->setCourseSupportedLanguages($newlyCreatedCourseId, json_decode($courseData['supportedLanguages']), false);

        if (!$status) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        return $newlyCreatedCourseId; // Returns ID of newly created course
    }

    public function updateCourse($courseId, $courseData) {
        $sql = "UPDATE
                    courses
                SET
                    title = ?,
                    slug = ?,
                    description = ?,
                    status = ?,
                    difficulty = ?,
                    price = ?,
                    shortName = ?,
                    color = ?,
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $courseData['title'],
            $courseData['slug'],
            $courseData['description'],
            $courseData['status'],
            $courseData['difficulty'],
            $courseData['price'],
            $courseData['shortName'],
            $courseData['color'],
            $courseId
        ));

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $status = $this->setCourseSupportedLanguages($courseId, $courseData['supportedLanguages']);

        if (!$status) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function deleteCourse($courseId) {
        $sql = "DELETE FROM
                    courses
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function setCourseImage($courseId, $imagePath) {
        $sql = "UPDATE
                    courses
                SET
                    image = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $imagePath,
            $courseId
        ));

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function setCourseSupportedLanguages($courseId, $supportedLanguages, $isUpdating = true) {
        $this->db->trans_start();
        
        if ($isUpdating) {
            $sql = "DELETE FROM
                        course_languages
                    WHERE
                        courseId = ?";
            
            $query = $this->db->query($sql, $courseId);
    
            if (!$query) {
                log_message(1, $this->db->error()['message']);
                return false;
            }
        }
        
        foreach ($supportedLanguages as $supportedLanguage) {
            $sql2 = "INSERT INTO
                        course_languages
                    (
                        `courseId`,
                        `language`
                    ) VALUES 
                    ( ?, ? )";

            $query2 = $this->db->query($sql2, array(
                $courseId,
                $supportedLanguage
            ));

            if (!$query2) {
                log_message(1, $this->db->error()['message']);
                return false;
            }
        }

        $this->db->trans_complete();

        return true;
    }

    public function getSupportedLanguages($courseId) {
        $sql = "SELECT
                language
            FROM
                course_languages
            WHERE
                courseId = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $supportedLanguages = array();

        foreach ($query->result() as $supportedLanguage) {
            array_push($supportedLanguages, $supportedLanguage->language);
        }

        return $supportedLanguages;
    }

    public function isCoursePublic($courseId) {
        $sql = "SELECT
                    status
                FROM
                    courses
                WHERE 
                    id = ?";


        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $courseStatus = $query->result()['status'];

        return $courseStatus === 'public';
    }
}
