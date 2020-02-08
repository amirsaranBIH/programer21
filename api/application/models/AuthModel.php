<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AuthModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('UserModel', 'user');
    }

    public function login($email, $password) {
        $sql = "SELECT
                    id,
                    password
                FROM
                    users
                WHERE
                    email = ?";

        $query = $this->db->query($sql, $email);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $row = $query->first_row();

        $hashedPassword = $row->password;

        $isCorrectPassword = $this->isCorrectPassword($password, $hashedPassword);

        if ($isCorrectPassword) {
            $userData = $this->user->getUserById($row->id);

            $this->setUserSession($userData);
        }

        return array(
            'isCorrectPassword' => $isCorrectPassword
        );
    }

    public function isEmailTaken($email) {
        $sql = "SELECT
                    COUNT(1) AS emailTaken
                FROM
                    users
                WHERE
                    email = ?";

        $query = $this->db->query($sql, $email);

        if (!$query) {
            log_message(1, $this->db->error()['message']);
            return false;
        }

        $emailTaken = $query->first_row()->emailTaken;
        return array(
            'emailTaken' => $emailTaken > 0
        );
    }

    private function isCorrectPassword($inputedPassword, $storedPassword) {
        return password_verify($inputedPassword, $storedPassword);
    }

    public function getUserSession() {
        session_start();
        return isset($_SESSION['userData']) ? $_SESSION['userData'] : null;
    }

    public function setUserSession($userData) {
        if (!isset($_SESSION)) session_start();

        $_SESSION['userData'] = $userData;
    }
}
