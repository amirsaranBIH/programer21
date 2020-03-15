<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller  {
    public function __construct(){
        parent::__construct();
        header('Content-type: application/json');

        $this->load->model('UserModel', 'user');
    }

    public function updateUser($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator' && $authResponse['data']->role !== 'moderator') {
            return $this->setResponseError(200, 'You must have administrative permissions to update other user accounts');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $res = $this->user->updateUser($userId, $data);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserAccountInfo($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only update your own account');
        }

        $data = $this->input->post();
        $res = $this->user->updateUserAccountInfo($userId, $data);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserAdditionalInfo($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only update your own account');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $res = $this->user->updateUserAdditionalInfo($userId, $data);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserPassword($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only update password for your own account');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $res = $this->user->updateUserPassword($userId, $data);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function suspendUser($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $res = $this->user->suspendUser($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function getUserEnrolledCourses($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access courses that you enrolled in');
        }

        $res = $this->user->getUserEnrolledCourses($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['status']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getUserCourseBySlug($courseSlug, $userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access a course that you enrolled in');
        }

        $res = $this->user->getUserCourseBySlug($courseSlug, $userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getAllUsers() {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator' && $authResponse['data']->role !== 'moderator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $res = $this->user->getAllUsers();

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getUserById($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->role !== 'administrator' && $authResponse['data']->role !== 'moderator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $res = $this->user->getUserById($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getCourseActivityPercentages($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access course activity for your own account');
        }

        $res = $this->user->getCourseActivityPercentages($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getAllFinishedLecturesByUserId($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access finished lectures for your own account');
        }

        $res = $this->user->getAllFinishedLecturesByUserId($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getAllLatestLecturesByUserId($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access latest lectures for your own account');
        }

        $res = $this->user->getAllLatestLecturesByUserId($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function getMonthlyActivity($userId, $month) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access monthly activity for your own account');
        }

        $res = $this->user->getMonthlyActivity($userId, $month);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function nextUsernameChangeAvailableIn($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access next username change information for your own account');
        }

        $res = $this->user->nextUsernameChangeAvailableIn($userId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess($res['data']);
    }

    public function enrollUserInCourse($userId, $courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['data']->id !== $userId) {
            return $this->setResponseError(200, 'You can only enroll in a course for your own account');
        }

        $res = $this->user->getUserEnrolledCourses($authResponse['data']->id);

        if (!$res['status']) {
            $this->setResponseError(200, $res['status']);
            return;
        }

        foreach ($res['data'] as $course) {
            if ($course->id == $courseId) {
                $this->setResponseError(200, 'Already enrolled in that course');
                return;
            }
        }

        $res = $this->user->enrollUserInCourse($userId, $courseId);

        if (!$res['status']) {
            $this->setResponseError(200, $res['message']);
            return;
        }

        $this->setResponseSuccess();
    }
}
