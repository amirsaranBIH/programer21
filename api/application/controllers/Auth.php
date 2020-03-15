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

        $checkIfCanSignupResponse = $this->auth->checkIfCanSignup($_SERVER['REMOTE_ADDR']);

        if (!$checkIfCanSignupResponse['status']) {
            $this->setResponseError(200, $checkIfCanSignupResponse['message']);
            return;
        }

        if ($checkIfCanSignupResponse['status'] && !$checkIfCanSignupResponse['data']) {
            $this->setResponseError(200, 'You can only create one account every 10 minutes');
            return;
        }

        $createUserResponse = $this->user->createUser($userData);

        $logSignupResponse = $this->auth->logSignup($_SERVER['REMOTE_ADDR'], $userData['email'], $createUserResponse['status']);

        if (!$createUserResponse['status']) {
            $this->setResponseError(200, $createUserResponse['message']);
            return;
        }

        if (!$logSignupResponse['status']) {
            $this->setResponseError(200, $logSignupResponse['message']);
            return;
        }

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        $logLoginResponse = $this->auth->logLogin($_SERVER['REMOTE_ADDR'], $userData['email'], $loginResponse['status']);

        if (!$loginResponse['status']) {
            $this->setResponseError(200, $loginResponse['message']);
            return;
        }

        if (!$logLoginResponse['status']) {
            $this->setResponseError(200, $logLoginResponse['message']);
            return;
        }

        $sendVerificationEmailResponse = $this->mail->sendEmailVerificationMail($userData['email']);

        if (!$sendVerificationEmailResponse['status']) {
            $this->setResponseError(200, $sendVerificationEmailResponse['message']);
            return;
        }

        $this->setResponseSuccess($loginResponse);
    }

    public function login() {
        $userData = json_decode(file_get_contents('php://input'), true);

        $checkIfCanLoginResponse = $this->auth->checkIfCanLogin($_SERVER['REMOTE_ADDR']);

        if (!$checkIfCanLoginResponse['status']) {
            $this->setResponseError(200, $checkIfCanLoginResponse['message']);
            return;
        }

        if ($checkIfCanLoginResponse['status'] && !$checkIfCanLoginResponse['data']) {
            $this->setResponseError(200, 'You only have 3 login attempts per 5 minutes');
            return;
        }

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        $logLoginResponse = $this->auth->logLogin($_SERVER['REMOTE_ADDR'], $userData['email'], $loginResponse['status']);

        if (!$loginResponse['status']) {
            $this->setResponseError(200, $loginResponse['message']);
            return;
        }

        if (!$logLoginResponse['status']) {
            $this->setResponseError(200, $logLoginResponse['message']);
            return;
        }

        $this->setResponseSuccess($loginResponse['data']);
    }

    public function logout() {    
        setcookie('PROGRAMER21_JWT', '', time() - 3600, '/');

        if (isset($_COOKIE['PROGRAMER21_JWT'])) {
            unset($_COOKIE['PROGRAMER21_JWT']);
        }

        $this->setResponseSuccess(true);
    }

    public function isEmailTaken() {
        $data = json_decode(file_get_contents('php://input'), true);

        $emailTakenResponse = $this->auth->isEmailTaken($data['email']);

        if (!$emailTakenResponse['status']) {
            $this->setResponseError(200, $emailTakenResponse['message']);
            return;
        }

        $this->setResponseSuccess($emailTakenResponse['data']);
    }

    public function isEmailTakenWhileEditing($userId) {
        $authResponse = $this->auth->getCurrentUser();
        if (!$authResponse['status']) {
            return $this->setResponseError(200, $authResponse['message']);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $emailTakenResponse = $this->auth->isEmailTakenWhileEditing($userId, $data['email']);

        if (!$emailTakenResponse['status']) {
            $this->setResponseError(200, $emailTakenResponse['message']);
            return;
        }

        $this->setResponseSuccess($emailTakenResponse['data']);
    }

    public function getCurrentUser() {
        $response = $this->auth->getCurrentUser();

        if (!$response['status']) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        $this->setResponseSuccess($response['data']);
    }

    public function forgotPassword() {
        $data = json_decode(file_get_contents('php://input'), true);

        $isEmailTakenResponse = $this->auth->isEmailTaken($data['email']);

        if (!$isEmailTakenResponse['status']) {
            $this->setResponseError(200, $isEmailTakenResponse['message']);

            $logForgotPasswordResponse = $this->auth->logForgotPassword($_SERVER['REMOTE_ADDR'], $data['email'], false);

            if (!$logForgotPasswordResponse['status']) {
                $this->setResponseError(200, $logForgotPasswordResponse['message']);
                return;
            }

            return;
        }

        if ((int)$isEmailTakenResponse['data'] < 1) {
            $this->setResponseError(200, 'Account with email of ' . $data['email'] . ' is not registered!');

            $logForgotPasswordResponse = $this->auth->logForgotPassword($_SERVER['REMOTE_ADDR'], $data['email'], false);

            if (!$logForgotPasswordResponse['status']) {
                $this->setResponseError(200, $logForgotPasswordResponse['message']);
                return;
            }
            
            return;
        }

        $checkIfCanResetPasswordResponse = $this->auth->checkIfCanResetPassword($_SERVER['REMOTE_ADDR']);

        if (!$checkIfCanResetPasswordResponse['status']) {
            $this->setResponseError(200, $checkIfCanResetPasswordResponse['message']);
            return;
        }

        if ($checkIfCanResetPasswordResponse['status'] && !$checkIfCanResetPasswordResponse['data']) {
            $this->setResponseError(200, 'You only have 3 reset password requests per 10 minutes');
            return;
        }

        $response = $this->mail->sendForgotPasswordMail($data['email']);

        $logForgotPasswordResponse = $this->auth->logForgotPassword($_SERVER['REMOTE_ADDR'], $data['email'], $response['status']);

        if (!$response['status']) {
            $this->setResponseError(200, $response['message']);
            return;
        }

        if (!$logForgotPasswordResponse['status']) {
            $this->setResponseError(200, $logForgotPasswordResponse['message']);
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
