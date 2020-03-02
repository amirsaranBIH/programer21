<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Lecture extends MY_Controller  {
    public function __construct(){
        parent::__construct();
        header('Content-type: application/json');

        $this->load->model('LectureModel', 'lecture');
        $this->load->model('AuthModel', 'auth');
    }

    public function createLecture($courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        $newlyCreatedLectureResponse = $this->lecture->createLecture($courseId, $data);

        if (!$newlyCreatedLectureResponse['status']) {
            $this->setResponseError(200, $newlyCreatedLectureResponse['message']);
            return;
        }

        $this->setResponseSuccess($newlyCreatedLectureResponse['data']);
    }

    public function updateLecture($lectureId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        $updateLectureResponse = $this->lecture->updateLecture($lectureId, $data);

        if (!$updateLectureResponse['status']) {
            $this->setResponseError(200, $updateLectureResponse['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function deleteLecture($lectureId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $deleteLectureResponse = $this->lecture->deleteLecture($lectureId);

        if (!$deleteLectureResponse['status']) {
            $this->setResponseError(200, $deleteLectureResponse['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function getLectureById($lectureId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $getLectureResponse = $this->lecture->getLectureById($lectureId);

        if (!$getLectureResponse['status']) {
            $this->setResponseError(200, $getLectureResponse['message']);
            return;
        }

        $this->setResponseSuccess($getLectureResponse['data']);
    }

    public function getLectureBySlug($lectureSlug) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        $getLectureResponse = $this->lecture->getLectureBySlug($lectureSlug);

        if (!$getLectureResponse['status']) {
            $this->setResponseError(200, $getLectureResponse['message']);
            return;
        }

        $this->setResponseSuccess($getLectureResponse['data']);
    }

    public function getLectureHtmlBySlug($lectureSlug) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }
        
        $getLectureHtmlResponse = $this->lecture->getLectureHtmlBySlug($lectureSlug);

        if (!$getLectureHtmlResponse['status']) {
            $this->setResponseError(200, $getLectureHtmlResponse['message']);
            return;
        }

        $this->setResponseSuccess($getLectureHtmlResponse['data']);
    }

    public function finishLecture($lectureId, $finishedLectureCourseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        $finishLectureResponse = $this->lecture->finishLecture($lectureId, $finishedLectureCourseId);

        if (!$finishLectureResponse['status']) {
            $this->setResponseError(200, $finishLectureResponse['message']);
            return;
        }

        $this->setResponseSuccess($finishLectureResponse['data']);
    }
}
