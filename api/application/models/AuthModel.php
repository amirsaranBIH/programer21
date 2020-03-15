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
            return handleError($this->db->error()['message']);
        }

        $row = $query->first_row();

        $hashedPassword = $row->password;

        $isCorrectPassword = $this->isCorrectPassword($password, $hashedPassword);

        if ($isCorrectPassword) {  
            $jwt = $this->generateNewJwtToken($row->id);
            $weekFromNow = strtotime('+1 week');
            header("Set-Cookie: PROGRAMER21_JWT={$jwt}; Max-Age={$weekFromNow}; Path=/; HttpOnly; SameSite=Lax");

            return handleSuccess(true);
        } else {
            return handleError('Password wrong', false, true);
        }
    }

    public function getCurrentUser() {
        if (!isset($_COOKIE['PROGRAMER21_JWT'])) {
            return handleSuccess(false);
        }

        $token = $_COOKIE['PROGRAMER21_JWT'];

        $publicKey = read_file(FCPATH . 'application/keys/public_key.pem');

        try {
            $payload = \Firebase\JWT\JWT::decode($token, $publicKey, array('RS256'));

            $userPayloadResponse = $this->user->getUserById($payload->id);

            if (!$userPayloadResponse['status']) {
                return handleError($userPayloadResponse['message'], false);
            }
        } catch(Exception $e) {
            return handleError($e->getMessage());
        }

        return handleSuccess($userPayloadResponse['data']);
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
            return handleError($this->db->error()['message']);
        }

        $emailTaken = $query->first_row()->emailTaken;

        return handleSuccess($emailTaken > 0);
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
            return handleError($this->db->error()['message']);
        }

        $emailTaken = $query->first_row()->emailTaken;

        return handleSuccess($emailTaken > 0);
    }

    public function isCorrectPassword($inputedPassword, $storedPassword) {
        return password_verify($inputedPassword, $storedPassword);
    }

    private function generateNewJwtToken($userId) {
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

    public function changePassword($newPassword, $token) {
        $sql = "SELECT
                    id
                FROM
                    users
                WHERE
                    token = ?";

        $query = $this->db->query($sql, $token);

        $user = $query->first_row();

        if (!$user) {
            return handleError('Trying to reset password with invalid token');
        }

        $sql = "UPDATE
                    users
                SET
                    password = ?
                WHERE
                    id = ?";

        $hashedPassowrd = $this->user->getHashedPassword($newPassword);

        $query = $this->db->query($sql, array(
            $hashedPassowrd,
            $user->id
        ));
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $newTokenResponse = $this->user->setNewTokenForUser($user->id);

        if (!$newTokenResponse['status']) {
            return handleError($newTokenResponse['message'], false);
        }

        return handleSuccess(true);
    }

    public function verifyEmail($token) {
        $sql = "SELECT
                    id
                FROM
                    users
                WHERE
                    token = ?";

        $query = $this->db->query($sql, $token);

        $user = $query->first_row();

        if (!$user) {
            return handleError('Trying to reset password with invalid token');
        }

        $sql = "UPDATE
                    users
                SET
                    emailVerifiedAt = NOW()
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $user->id);
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $newTokenResponse = $this->user->setNewTokenForUser($user->id);

        if (!$newTokenResponse['status']) {
            return handleError($newTokenResponse['message'], false);
        }

        return handleSuccess(true);
    }

    public function logLogin($clientIp, $email, $isSuccessful) {
        $sql = "INSERT INTO
                    login_logs
                (
                    `clientIp`,
                    `email`,
                    `isSuccessful`
                ) VALUES (
                    ?, ?, ?
                )";

        $query = $this->db->query($sql, array(
            $clientIp,
            $email,
            $isSuccessful
        ));
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function logSignup($clientIp, $email, $isSuccessful) {
        $sql = "INSERT INTO
                    signup_logs
                (
                    `clientIp`,
                    `email`,
                    `isSuccessful`
                ) VALUES (
                    ?, ?, ?
                )";

        $query = $this->db->query($sql, array(
            $clientIp,
            $email,
            $isSuccessful
        ));
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function logForgotPassword($clientIp, $email, $isSuccessful) {
        $sql = "INSERT INTO
                    forgot_password_logs
                (
                    `clientIp`,
                    `email`,
                    `isSuccessful`
                ) VALUES (
                    ?, ?, ?
                )";

        $query = $this->db->query($sql, array(
            $clientIp,
            $email,
            $isSuccessful
        ));
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function checkIfCanSignup($clientIp) {
        $sql = "SELECT
                    COUNT(1) AS signupsInLast10Minutes
                FROM
                    signup_logs
                WHERE
                    clientIp = ?
                AND 
                    createdAt > (NOW() - INTERVAL 10 MINUTE)";

        $query = $this->db->query($sql, $clientIp);
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $signupsInLast10Minutes = (int)$query->first_row()->signupsInLast10Minutes;

        return handleSuccess($signupsInLast10Minutes < 1);
    }

    public function checkIfCanLogin($clientIp) {
        $sql = "SELECT
                    COUNT(1) AS loginsInLast5Minutes
                FROM
                    login_logs
                WHERE
                    clientIp = ?
                AND 
                    createdAt > (NOW() - INTERVAL 5 MINUTE)";

        $query = $this->db->query($sql, $clientIp);
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $loginsInLast5Minutes = (int)$query->first_row()->loginsInLast5Minutes;

        return handleSuccess($loginsInLast5Minutes <= 3);
    }

    public function checkIfCanResetPassword($clientIp) {
        $sql = "SELECT
                    COUNT(1) AS resetPasswordsInLast10Minutes
                FROM
                    forgot_password_logs
                WHERE
                    clientIp = ?
                AND 
                    createdAt > (NOW() - INTERVAL 10 MINUTE)";

        $query = $this->db->query($sql, $clientIp);
        
        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $resetPasswordsInLast10Minutes = (int)$query->first_row()->resetPasswordsInLast10Minutes;

        return handleSuccess($resetPasswordsInLast10Minutes <= 3);
    }
}
