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

    public function searchUsersByUsernameAndFullname($searchQuery) {
        $users = $this->user->searchUsersByUsernameAndFullname($searchQuery);

        if ($users === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($users);
    }
}
