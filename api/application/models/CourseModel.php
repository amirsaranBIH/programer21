<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CourseModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('AuthModel', 'auth');
        $this->load->model('LectureModel', 'lecture');
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
                    (SELECT IF(SUM(ert) IS NULL, 0, SUM(ert)) FROM lectures WHERE lectures.course = courses.id) AS totalErt
                FROM
                    courses";

        $query = $this->db->query($sql);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
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
                    (SELECT IF(SUM(ert) IS NULL, 0, SUM(ert)) FROM lectures WHERE lectures.course = courses.id) AS totalErt
                FROM
                    courses
                WHERE
                    status = 'public'";

        $query = $this->db->query($sql);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
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
            log_message('error', $this->db->error()['message']);
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
                    updatedAt,
                    (SELECT IF(SUM(ert) IS NULL, 0, SUM(ert)) FROM lectures WHERE lectures.course = courses.id) AS totalErt,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.courseId = courses.id) AS enrolledStudents
                FROM
                    courses
                WHERE
                    slug = ?";

        $query = $this->db->query($sql, $courseSlug);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $course = $query->first_row();

        $course->supportedLanguages = $this->getSupportedLanguages($course->id);
        $course->courseLectures = $this->lecture->getAllPublicLecturesByCourseId($course->id);

        return $course;
    }

    public function createCourse($courseData) {
        $this->db->trans_start();

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

        $userData = $this->auth->getCurrentUser();

        $query = $this->db->query($sql, array(
            $courseData['title'],
            $courseData['slug'],
            $courseData['description'],
            $courseData['difficulty'],
            $courseData['price'],
            $courseData['shortName'],
            $courseData['color'],
            $userData['payload']->id
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $newlyCreatedCourseId = $this->db->insert_id();

        $status = $this->setCourseSupportedLanguages($newlyCreatedCourseId, json_decode($courseData['supportedLanguages']), false);

        if (!$status) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        if (isset($_FILES['image'])) {
            $res = $this->uploadCourseImage('image');
    
            if (!$res['status']) {
                log_message('error', 'There was an error while uploading course image');

                return $res;
            }
    
            $uploadedImagePath = '/uploads/course_images/'.$res['data']['file_name'];
    
            $this->setCourseImage($newlyCreatedCourseId, $uploadedImagePath);
        }

        $status = $this->makeCourseFolder($courseData['slug']);

        if (!$status) {
            log_message('error', 'Could not create lecture folder of course');
            return false;
        }

        $this->db->trans_complete();

        return array(
            'status' => true,
            'newlyCreatedCourseId' => $newlyCreatedCourseId // Returns ID of newly created course
        );
    }

    public function updateCourse($courseId, $courseData) {
        $this->db->trans_start();

        $oldCourseSlug = $this->getCourseById($courseId)->slug;

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
                    color = ?
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $status = $this->setCourseSupportedLanguages($courseId, json_decode($courseData['supportedLanguages']));

        if (!$status) {
            log_message('error', 'There was an error while setting course supported languages');
            return false;
        }

        if (isset($_FILES['image'])) {
            $res = $this->uploadCourseImage('image');
    
            if (!$res['status']) {
                log_message('error', 'There was an error while uploading course image');

                return $res;
            }
    
            $uploadedImagePath = '/uploads/course_images/'.$res['data']['file_name'];
    
            $this->setCourseImage($courseId, $uploadedImagePath);
        }

        $status = $this->renameCourseFolder($oldCourseSlug, $courseData['slug']);

        if (!$status) {
            log_message('error', 'Could not rename lecture folder of course');
            return false;
        }

        $this->db->trans_complete();

        return array(
            'status' => true
        );
    }

    public function deleteCourse($courseId) {
        $sql = "DELETE FROM
                    courses
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
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
            log_message('error', $this->db->error()['message']);
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
                log_message('error', $this->db->error()['message']);
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
                log_message('error', $this->db->error()['message']);
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $supportedLanguages = array();

        foreach ($query->result() as $supportedLanguage) {
            array_push($supportedLanguages, $supportedLanguage->language);
        }

        return $supportedLanguages;
    }

    public function finishCourse($courseId) {
        $sql = "UPDATE
                    user_courses
                SET
                    status = 'finished'
                WHERE
                    courseId = ?
                AND
                    userId = ?";

        $userData = $this->auth->getCurrentUser();

        $query = $this->db->query($sql, array(
            $courseId,
            $userData['payload']->id
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function uploadCourseImage($fieldName) {
        $config['upload_path']      = './uploads/course_images';
        $config['allowed_types']    = 'gif|jpg|jpeg|png';
        $config['max_size']         = 500;
        $config['max_width']        = 1920;
        $config['max_height']       = 1080;
        $config['encrypt_name']     = true;
        $config['file_ext_tolower'] = true;
        
        $this->load->library('upload', $config);

        if ($this->upload->do_upload($fieldName)) {
            return array(
                'status' => true,
                'data' => $this->upload->data()
            );
        } else {
            log_message('error', $this->upload->display_errors());
            return array(
                'status' => false,
                'data' => $this->upload->display_errors('', '')
            );
        }
    }

    public function makeCourseFolder($courseSlug) {
        return mkdir(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $courseSlug);
    }

    public function renameCourseFolder($oldCourseSlug, $newCourseSlug) {
        return rename(FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $oldCourseSlug, 
                        FCPATH . 'lectures' . DIRECTORY_SEPARATOR . $newCourseSlug);
    }
}
