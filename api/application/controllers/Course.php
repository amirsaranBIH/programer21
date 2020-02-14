<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Course extends MY_Controller  {
    public function __construct(){
        parent::__construct();
        header('Content-type: application/json');

        $this->load->model('CourseModel', 'course');
        $this->load->model('LectureModel', 'lecture');
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
        $courses = $this->course->getAllCourses();

        if ($courses === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courses);
    }

    public function getCourseLectures($courseId) {
        $courseLectures = $this->lecture->getAllLecturesByCourseId($courseId);

        if ($courseLectures === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courseLectures);
    }

    public function createCourse() {
        $data = $this->input->post();

        $res = $this->course->createCourse($data);

        if ($res['status'] === false) {
            $this->setResponseError(200, $res['data']);
            return;
        }

        $this->setResponseSuccess($res['newlyCreatedCourseId']);
    }

    public function updateCourse($courseId) {
        $data = $this->input->post();

        $res = $this->course->updateCourse($courseId, $data);

        if ($res['status'] === false) {
            $this->setResponseError(200, $res['data']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function deleteCourse($courseId) {
        $status = $this->course->deleteCourse($courseId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function getCourseById($courseId) {
        $data = $this->input->post();

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
}
