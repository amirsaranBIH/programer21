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
        $coursesResponse = $this->course->getAllPublicCourses();

        if (!$coursesResponse['status']) {
            $this->setResponseError(200, $coursesResponse['message']);
            return;
        }

        $this->setResponseSuccess($coursesResponse['data']);
    }

    public function getAllCourses() {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $coursesResponse = $this->course->getAllCourses();

        if (!$coursesResponse['status']) {
            $this->setResponseError(200, $coursesResponse['message']);
            return;
        }

        $this->setResponseSuccess($coursesResponse['data']);
    }

    public function getCourseLectures($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }
        
        $courseLecturesResponse = $this->lecture->getAllLecturesByCourseId($courseId);

        if (!$courseLecturesResponse['status']) {
            $this->setResponseError(200, $courseLecturesResponse['message']);
            return;
        }

        $this->setResponseSuccess($courseLecturesResponse['data']);
    }

    public function createCourse() {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $data = $this->input->post();

        $createCourseResponse = $this->course->createCourse($data);

        if (!$createCourseResponse['status']) {
            $this->setResponseError(200, $createCourseResponse['message']);
            return;
        }

        $this->setResponseSuccess($createCourseResponse['data']);
    }

    public function updateCourse($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $data = $this->input->post();

        $updateCourseResponse = $this->course->updateCourse($courseId, $data);

        if (!$updateCourseResponse['status']) {
            $this->setResponseError(200, $updateCourseResponse['message']);
            return;
        }

        $this->setResponseSuccess($updateCourseResponse['data']);
    }

    public function deleteCourse($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $deleteCourseResponse = $this->course->deleteCourse($courseId);

        if (!$deleteCourseResponse['status']) {
            $this->setResponseError(200, $deleteCourseResponse['message']);
            return;
        }

        $this->setResponseSuccess($deleteCourseResponse['data']);
    }

    public function getCourseById($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $getCourseResponse = $this->course->getCourseById($courseId);

        if (!$getCourseResponse['status']) {
            $this->setResponseError(200, $getCourseResponse['message']);
            return;
        }

        $this->setResponseSuccess($getCourseResponse['data']);
    }

    public function getCourseBySlug($courseSlug) {
        $getCourseResponse = $this->course->getCourseBySlug($courseSlug);

        if (!$getCourseResponse) {
            $this->setResponseError(200, $getCourseResponse['message']);
            return;
        }

        $this->setResponseSuccess($getCourseResponse['data']);
    }

    public function getCourseIdBySlug($courseSlug) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        $getCourseIdResponse = $this->course->getCourseIdBySlug($courseSlug);

        if (!$getCourseIdResponse['status']) {
            $this->setResponseError(200, $getCourseIdResponse['message']);
            return;
        }

        $this->setResponseSuccess($getCourseIdResponse['data']);
    }
}
