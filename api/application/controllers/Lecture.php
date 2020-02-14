<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Lecture extends MY_Controller  {
    public function __construct(){
        parent::__construct();
        header('Content-type: application/json');

        $this->load->model('LectureModel', 'lecture');
    }

    public function createLecture($courseId) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $newlyCreatedLectureId = $this->lecture->createLecture($courseId, $data);

        if ($newlyCreatedLectureId === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($newlyCreatedLectureId);
    }

    public function updateLecture($lectureId) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $status = $this->lecture->updateLecture($lectureId, $data);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function deleteLecture($lectureId) {
        $status = $this->lecture->deleteLecture($lectureId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function getLectureById($lectureId) {
        $lecture = $this->lecture->getLectureById($lectureId);

        if ($lecture === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($lecture);
    }

    public function getLectureBySlug($lectureSlug) {
        $lecture = $this->lecture->getLectureBySlug($lectureSlug);

        if ($lecture === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($lecture);
    }

    public function getLectureHtmlBySlug($lectureSlug) {
        $lecture = $this->lecture->getLectureHtmlBySlug($lectureSlug);

        if ($lecture === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($lecture);
    }
}
