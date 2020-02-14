<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller  {
    public function __construct(){
        parent::__construct();
        header('Content-type: application/json');

        $this->load->model('UserModel', 'user');
    }

    public function createUser() {
        $data = $this->input->post();

        $createdUserId = $this->user->createUser($data);

        if ($createdUserId === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($createdUserId);
    }

    public function updateUser($userId) {
        $data = json_decode(file_get_contents('php://input'), true);

        $status = $this->user->updateUser($userId, $data);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserAccountInfo($userId) {
        $data = $this->input->post();
        $res = $this->user->updateUserAccountInfo($userId, $data);

        if ($res === false) {
            $this->setResponseError(200, $res['data']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserAdditionalInfo($userId) {
        $data = json_decode(file_get_contents('php://input'), true);

        $status = $this->user->updateUserAdditionalInfo($userId, $data);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserPassword($userId) {
        $data = json_decode(file_get_contents('php://input'), true);

        $res = $this->user->updateUserPassword($userId, $data);

        if ($res['status'] === false) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function suspendUser($userId) {
        $status = $this->user->suspendUser($userId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function getUserEnrolledCourses($userId) {
        $courses = $this->user->getUserEnrolledCourses($userId);

        if ($courses === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courses);
    }

    public function getUserCourseBySlug($courseSlug, $userId) {
        $course = $this->user->getUserCourseBySlug($courseSlug, $userId);

        if ($course === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($course);
    }

    public function getAllUsers() {
        $users = $this->user->getAllUsers();

        if ($users === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($users);
    }

    public function getUserById($userId) {
        $user = $this->user->getUserById($userId);

        if ($user === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($user);
    }

    public function getCourseActivityPercentages($userId) {
        $percentages = $this->user->getCourseActivityPercentages($userId);

        if ($percentages === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($percentages);
    }

    public function getAllLatestLecturesByUserId($userId) {
        $lectures = $this->user->getAllLatestLecturesByUserId($userId);

        if ($lectures === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($lectures);
    }

    public function getMonthlyActivity($userId) {
        $montlyActivity = $this->user->getMonthlyActivity($userId);

        if ($montlyActivity === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($montlyActivity);
    }

    public function nextUsernameChangeAvailableIn($userId) {
        $nextUsernameChangeAvailableIn = $this->user->nextUsernameChangeAvailableIn($userId);

        if ($nextUsernameChangeAvailableIn === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($nextUsernameChangeAvailableIn);
    }

    public function enrollUserInCourse($userId, $courseId) {
        $status = $this->user->enrollUserInCourse($userId, $courseId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }
}
