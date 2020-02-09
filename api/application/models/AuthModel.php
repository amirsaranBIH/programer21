<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AuthModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('UserModel', 'user');
        $this->load->helper('url');
        $this->load->helper('file');
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $row = $query->first_row();

        $hashedPassword = $row->password;

        $isCorrectPassword = $this->isCorrectPassword($password, $hashedPassword);

        if ($isCorrectPassword) {  
            $userData = $this->user->getUserById($row->id);

            $privateKey = read_file(FCPATH . 'application/keys/private_key.pem');

            $userData->iss = base_url();
            $userData->aud = base_url();
            $userData->iat = strtotime('now');

            $jwt = \Firebase\JWT\JWT::encode($userData, $privateKey, 'RS256');
        }

        return array(
            'isCorrectPassword' => $isCorrectPassword,
            'token' => $jwt
        );
    }

    public function verifyJwtToken($token) {
        $publicKey = read_file(FCPATH . 'application/keys/public_key.pem');

        try {
            $payload = \Firebase\JWT\JWT::decode($token, $publicKey, array('RS256'));
        } catch(Exception $e) {
            return array(
                'status' => false,
                'message' => $e->getMessage()
            );

            log_message('error', $e->getMessage());
        }

        return array(
            'status' => true,
            'payload' => $payload
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
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $emailTaken = $query->first_row()->emailTaken;
        return array(
            'emailTaken' => $emailTaken > 0
        );
    }

    public function isEmailTakenWhileEditing($userId, $email) {
        $sql = "SELECT
                    COUNT(1) AS emailTaken
                FROM
                    users
                WHERE
                    email = ?
                AND
                    id != ?";

        $query = $this->db->query($sql, array(
            $email,
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
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
