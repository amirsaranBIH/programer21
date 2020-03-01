<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Auth extends MY_Controller  {
    public function __construct(){
        parent::__construct();

        $this->load->model('UserModel', 'user');
        $this->load->model('AuthModel', 'auth');
        $this->load->model('MailModel', 'mail');
    }

    public function signup() {
        $userData = json_decode(file_get_contents('php://input'), true);

        $createdUserId = $this->user->createUser($userData);

        if ($createdUserId === false) {
            $this->setResponseError();
            return;
        }

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        if (!$loginResponse['status']) {
            $this->setResponseError(200, $loginResponse['message']);
            return;
        }

        $loginResponse['createdUserId'] = $createdUserId;

        $sendVerificationEmailResponse = $this->mail->sendEmailVerificationMail($userData['email']);

        if (!$sendVerificationEmailResponse['status']) {
            $this->setResponseError(200, $sendVerificationEmailResponse['message']);
            return;
        }

        $this->setResponseSuccess($loginResponse);
    }

    public function login() {
        $userData = json_decode(file_get_contents('php://input'), true);

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        if ($loginResponse['status'] === false) {
            $this->setResponseError(200, $loginResponse['message']);
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
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $response = $this->auth->isEmailTakenWhileEditing($userId, $data['email']);

        if ($response === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($response['emailTaken']);
    }

    public function getCurrentUser() {
        $response = $this->auth->getCurrentUser();

        if ($response['status'] === false) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess($response['payload']);
    }

    public function forgotPassword() {
        $data = json_decode(file_get_contents('php://input'), true);

        $isEmailTaken = $this->auth->isEmailTaken($data['email']);

        if (!$isEmailTaken) {
            $this->setResponseError(200, 'Account with email of ' . $data['email'] . ' is not registered!');
            return;
        }

        $response = $this->mail->sendForgotPasswordMail($data['email']);

        if (!$response['status']) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function newPassword() {
        $data = json_decode(file_get_contents('php://input'), true);

        $response = $this->auth->changePassword($data['newPassword'], $data['token']);

        if (!$response['status']) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess();
    }

    public function verifyEmail($token) {
        $response = $this->auth->verifyEmail($token);

        if (!$response['status']) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess();
    }
}
