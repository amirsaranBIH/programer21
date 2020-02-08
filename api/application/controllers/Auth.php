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

        $correctLogin = $this->auth->login($userData['email'], $userData['password']);

        if ($correctLogin === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($createdUserId);
    }

    public function login() {
        $userData = json_decode(file_get_contents('php://input'), true);

        $loginResponse = $this->auth->login($userData['email'], $userData['password']);

        if ($loginResponse === false) {
            $this->setResponseError();
            return;
        }

        $this->setResponseSuccess($loginResponse['isCorrectPassword']);
    }

    public function logout() {
        session_start();

        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time()-3600, '/');
        }

        $_SESSION = array();

        session_destroy();

        $this->setResponseSuccess(true);
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
    
    public function fetchUserSessionData() {
        session_start();
        $response = isset($_SESSION['userData']) ? $_SESSION['userData'] : null;

        $this->setResponseSuccess($response);
    }
}
