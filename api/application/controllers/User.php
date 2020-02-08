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

    public function searchUsersByUsernameAndFullname($searchQuery) {
        $users = $this->user->searchUsersByUsernameAndFullname($searchQuery);

        if ($users === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($users);
    }
}
