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
                    (SELECT COUNT(1) FROM lectures WHERE course = courses.id) AS numberOfLectures,
                    (SELECT IF(SUM(ert) IS NULL, 0, SUM(ert)) FROM lectures WHERE lectures.course = courses.id) AS totalErt
                FROM
                    courses";

        $query = $this->db->query($sql);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return handleSuccess($courses);
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
                    (SELECT COUNT(1) FROM lectures WHERE course = courses.id) AS numberOfLectures,
                    (SELECT IF(SUM(ert) IS NULL, 0, SUM(ert)) FROM lectures WHERE lectures.course = courses.id) AS totalErt
                FROM
                    courses
                WHERE
                    status = 'public'";

        $query = $this->db->query($sql);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return handleSuccess($courses);
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
            return handleError($this->db->error()['message']);
        }

        $course = $query->first_row();

        if (!$course) {
            return handleError('There is no course with the id: ' . $courseId, true, true);
        }

        $supportedLanguagesResponse = $this->getSupportedLanguages($courseId);

        if (!$supportedLanguagesResponse['status']) {
            return handleError($supportedLanguagesResponse['message'], false);
        }

        $course->supportedLanguages = $supportedLanguagesResponse['data'];

        return handleSuccess($course);
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
            return handleError($this->db->error()['message']);
        }

        $course = $query->first_row();

        if (!$course) {
            return handleError('There is no course with the slug: ' . $courseSlug, true, true);
        }

        $supportedLanguagesResponse = $this->getSupportedLanguages($course->id);

        if (!$supportedLanguagesResponse['status']) {
            return handleError($supportedLanguagesResponse['message'], false);
        }

        $course->supportedLanguages = $supportedLanguagesResponse['data'];

        $courseLecturesResponse = $this->lecture->getAllPublicLecturesByCourseId($course->id);

        if (!$courseLecturesResponse['status']) {
            return handleError($courseLecturesResponse['message'], false);
        }

        $course->courseLectures = $courseLecturesResponse['data'];

        return handleSuccess($course);
    }

    public function getCourseIdBySlug($courseSlug) {
        $sql = "SELECT
                    id
                FROM
                    courses
                WHERE
                    slug = ?";

        $query = $this->db->query($sql, $courseSlug);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $course = $query->first_row();

        if (!$course) {
            return handleError('Tried to get course with slug that does not exist: ' . $courseSlug, true, true);
        }

        return handleSuccess($course->id);
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

        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message']);
        }

        $userData = $userDataResponse['data'];

        $query = $this->db->query($sql, array(
            $courseData['title'],
            $courseData['slug'],
            $courseData['description'],
            $courseData['difficulty'],
            $courseData['price'],
            $courseData['shortName'],
            $courseData['color'],
            $userData->id
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $newlyCreatedCourseId = $this->db->insert_id();

        $setCourseSupportedLanguagesResponse = $this->setCourseSupportedLanguages($newlyCreatedCourseId, json_decode($courseData['supportedLanguages']), false);

        if (!$setCourseSupportedLanguagesResponse['status']) {
            return handleError($setCourseSupportedLanguagesResponse['message'], false);
        }

        if (isset($_FILES['image'])) {
            $res = $this->uploadCourseImage('image');
    
            if (!$res['status']) {
                return handleError($res['message'], false);
            }
    
            $uploadedImagePath = '/uploads/course_images/'.$res['data']['file_name'];
    
            $setCourseImageResponse = $this->setCourseImage($newlyCreatedCourseId, $uploadedImagePath);

            if (!$setCourseImageResponse['status']) {
                return handleError($setCourseImageResponse['message'], false);
            }
        }

        $this->db->trans_complete();

        return handleSuccess($newlyCreatedCourseId); // Returns ID of newly created course
    }

    public function updateCourse($courseId, $courseData) {
        $this->db->trans_start();

        $oldCourseResponse = $this->getCourseById($courseId);

        if (!$oldCourseResponse['status']) {
            return handleError($oldCourseResponse['message'], false);
        }

        $oldCourse = $oldCourseResponse['data'];

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
            return handleError($this->db->error()['message']);
        }

        $setCourseSupportedLanguagesResponse = $this->setCourseSupportedLanguages($courseId, json_decode($courseData['supportedLanguages']));

        if (!$setCourseSupportedLanguagesResponse['status']) {
            return handleError($setCourseSupportedLanguagesResponse['message'], false);
        }

        if (isset($_FILES['image'])) {
            $uploadCourseImageResponse = $this->uploadCourseImage('image');
    
            if (!$uploadCourseImageResponse['status']) {
                return handleError($uploadCourseImageResponse['message'], false);
            }
    
            $uploadedImagePath = '/uploads/course_images/'.$uploadCourseImageResponse['data']['file_name'];

            $setCourseImageResponse = $this->setCourseImage($courseId, $uploadedImagePath);

            if (!$setCourseImageResponse['status']) {
                return handleError($setCourseImageResponse['message'], false);
            }

            $deleteOldImageResponse = $this->deleteOldImage($oldCourse->image);

            if (!$deleteOldImageResponse['status']) {
                return handleError($deleteOldImageResponse['message'], false);
            }
        }

        $this->db->trans_complete();

        return handleSuccess(true);
    }

    public function deleteCourse($courseId) {
        $this->db->trans_start();

        $sql = "SELECT
                    slug,
                    image
                FROM
                    courses
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $course = $query->first_row();

        if (!$course) {
            return handleError('Trying to get course slug with invalid course id: ' . $courseId);
        }

        $sql = "DELETE FROM
                    courses
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $courseId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $deleteOldImageResponse = $this->deleteOldImage($course->image);

        if (!$deleteOldImageResponse['status']) {
            return handleError($deleteOldImageResponse['message'], false);
        }

        $this->db->trans_complete();

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
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
                return handleError($this->db->error()['message']);
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
                return handleError($this->db->error()['message']);
            }
        }

        $this->db->trans_complete();

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }

        $supportedLanguages = array();

        foreach ($query->result() as $supportedLanguage) {
            array_push($supportedLanguages, $supportedLanguage->language);
        }

        return handleSuccess($supportedLanguages);
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

        $userDataResponse = $this->auth->getCurrentUser();

        if (!$userDataResponse['status']) {
            return handleError($userDataResponse['message']);
        }

        $userData = $userDataResponse['data'];

        $query = $this->db->query($sql, array(
            $courseId,
            $userData->id
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }
        
        $row = $query->first_row();

        if (!$row) {
            return handleError('Trying to access course that does not exist: ' . $courseId);
        }

        $courseStatus = $row->status;

        return handleSuccess($courseStatus === 'public');
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
            return handleSuccess($this->upload->data());
        } else {
            return handleError($this->upload->display_errors('', ''));
        }
    }

    public function deleteOldImage($imagePath) {
        $fullImagePath = FCPATH . ltrim($imagePath, '/'); 

        if (!file_exists($fullImagePath)) {
            return handleError('Course image does not exist: ' . $fullImagePath);
        }

        $response = unlink($fullImagePath);

        return $response ? handleSuccess($response) : handleError($response);
    }
}
