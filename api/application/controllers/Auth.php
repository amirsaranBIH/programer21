<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Auth extends MY_Controller  {
    public function __construct(){
        parent::__construct();

        $this->load->model('UserModel', 'user');
        $this->load->model('AuthModel', 'auth');
    }

    public function signup() {
        $userData = json_decode(file_get_contents('php://input'), true);

        $createdUserId = $this->user->createUser($userData);

        if ($createdUserId === false) {
            $this->setResponseError();
            return;
        }

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        if ($loginResponse['isCorrectPassword'] === false) {
            $this->setResponseError();
            return;
        }

        $loginResponse['createdUserId'] = $createdUserId;

        $this->setResponseSuccess($loginResponse);
    }

    public function login() {
        $userData = json_decode(file_get_contents('php://input'), true);

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        if ($loginResponse['isCorrectPassword'] === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($loginResponse);
    }

    public function isEmailTaken() {
        $data = json_decode(file_get_contents('php://input'), true);

        $response = $this->auth->isEmailTaken($data['email']);

        if ($response === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($response['emailTaken']);
    }

    public function isEmailTakenWhileEditing($userId) {
        $data = json_decode(file_get_contents('php://input'), true);

        $response = $this->auth->isEmailTakenWhileEditing($userId, $data['email']);

        if ($response === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($response['emailTaken']);
    }

    public function verifyJwtToken() {
        $response = $this->auth->verifyJwtToken();

        if ($response['status'] === false) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess($response['payload']);
    }
}
