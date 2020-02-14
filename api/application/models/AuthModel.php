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
            $jwt = $this->generateNewJwtToken($row->id);
        } else {
            $jwt = null;
        }

        return array(
            'isCorrectPassword' => $isCorrectPassword,
            'token' => $jwt
        );
    }

    public function verifyJwtToken() {
        $tokenHeader = $this->input->get_request_header('Authorization');

        if (!$tokenHeader) {
            return array(
                'status' => false,
                'message' => 'No Authentication header'
            );
        }

        $token = substr($tokenHeader, 7);

        $publicKey = read_file(FCPATH . 'application/keys/public_key.pem');

        try {
            $payload = \Firebase\JWT\JWT::decode($token, $publicKey, array('RS256'));

            $userPayload = $this->user->getUserById($payload->id);
        } catch(Exception $e) {
            return array(
                'status' => false,
                'message' => $e->getMessage()
            );

            log_message('error', $e->getMessage());
        }

        return array(
            'status' => true,
            'payload' => $userPayload
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

    public function isCorrectPassword($inputedPassword, $storedPassword) {
        return password_verify($inputedPassword, $storedPassword);
    }

    public function generateNewJwtToken($userId) {
        $privateKey = read_file(FCPATH . 'application/keys/private_key.pem');

        $payload = array(
            'iss' => base_url(),
            'aud' => base_url(),
            'iat' => strtotime('now'),
            'jti' => md5(uniqid($userId, true)),
            'id' => $userId
        );

        return \Firebase\JWT\JWT::encode($payload, $privateKey, 'RS256');
    }
}
