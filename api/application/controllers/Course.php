<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Course extends MY_Controller  {
    public function __construct(){
        parent::__construct();
        header('Content-type: application/json');

        $this->load->model('CourseModel', 'course');
        $this->load->model('LectureModel', 'lecture');
        $this->load->model('AuthModel', 'auth');
    }

    public function getAllPublicCourses() {
        $courses = $this->course->getAllPublicCourses();

        if ($courses === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courses);
    }

    public function getAllCourses() {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $courses = $this->course->getAllCourses();

        if ($courses === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courses);
    }

    public function getCourseLectures($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }
        
        $courseLectures = $this->lecture->getAllLecturesByCourseId($courseId);

        if ($courseLectures === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courseLectures);
    }

    public function createCourse() {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $data = $this->input->post();

        $res = $this->course->createCourse($data);

        if ($res['status'] === false) {
            $this->setResponseError(200, $res['data']);
            return;
        }

        $this->setResponseSuccess($res['newlyCreatedCourseId']);
    }

    public function updateCourse($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $data = $this->input->post();

        $res = $this->course->updateCourse($courseId, $data);

        if ($res['status'] === false) {
            $this->setResponseError(200, $res['data']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function deleteCourse($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $status = $this->course->deleteCourse($courseId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function getCourseById($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $course = $this->course->getCourseById($courseId);

        if ($course === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($course);
    }

    public function getCourseBySlug($courseSlug) {
        $course = $this->course->getCourseBySlug($courseSlug);

        if ($course === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($course);
    }

    public function getCourseIdBySlug($courseSlug) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        $response = $this->course->getCourseIdBySlug($courseSlug);

        if (!$response['status']) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess($response['courseId']);
    }
}
