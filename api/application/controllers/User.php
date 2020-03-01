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

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to update other user accounts');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $status = $this->user->updateUser($userId, $data);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserAccountInfo($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only update your own account');
        }

        $data = $this->input->post();
        $res = $this->user->updateUserAccountInfo($userId, $data);

        if ($res === false) {
            $this->setResponseError(200, $res['data']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserAdditionalInfo($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only update your own account');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $status = $this->user->updateUserAdditionalInfo($userId, $data);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function updateUserPassword($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only update password for your own account');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $res = $this->user->updateUserPassword($userId, $data);

        if ($res['status'] === false) {
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

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $status = $this->user->suspendUser($userId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }

    public function getUserEnrolledCourses($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access courses that you enrolled in');
        }

        $courses = $this->user->getUserEnrolledCourses($userId);

        if ($courses === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($courses);
    }

    public function getUserCourseBySlug($courseSlug, $userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access a course that you enrolled in');
        }

        $course = $this->user->getUserCourseBySlug($courseSlug, $userId);

        if ($course === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($course);
    }

    public function getAllUsers() {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $users = $this->user->getAllUsers();

        if ($users === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($users);
    }

    public function getUserById($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->role !== 'administrator') {
            return $this->setResponseError(200, 'You must have administrative permissions to do that');
        }

        $user = $this->user->getUserById($userId);

        if ($user === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($user);
    }

    public function getCourseActivityPercentages($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access course activity for your own account');
        }

        $percentages = $this->user->getCourseActivityPercentages($userId);

        if ($percentages === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($percentages);
    }

    public function getAllLatestLecturesByUserId($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access latest lectures for your own account');
        }

        $lectures = $this->user->getAllLatestLecturesByUserId($userId);

        if ($lectures === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($lectures);
    }

    public function getMonthlyActivity($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access monthly activity for your own account');
        }

        $montlyActivity = $this->user->getMonthlyActivity($userId);

        if ($montlyActivity === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($montlyActivity);
    }

    public function nextUsernameChangeAvailableIn($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only access next username change information for your own account');
        }

        $nextUsernameChangeAvailableIn = $this->user->nextUsernameChangeAvailableIn($userId);

        if ($nextUsernameChangeAvailableIn === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($nextUsernameChangeAvailableIn);
    }

    public function enrollUserInCourse($userId, $courseId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        if ($authResponse['payload']->id !== $userId) {
            return $this->setResponseError(200, 'You can only enroll in a course for your own account');
        }

        $status = $this->user->enrollUserInCourse($userId, $courseId);

        if ($status === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess();
    }
}
