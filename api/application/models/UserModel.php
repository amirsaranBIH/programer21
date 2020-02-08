<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('CourseModel', 'course');
    }
    // finishedCourses: 1,
    // enrolledCourses: 3,
    // verified: true
    public function getAllUsers() {
        $sql = "SELECT
                    id,
                    firstName,
                    lastName,
                    CONCAT(firstName, ' ', lastName) AS name,
                    username,
                    email,
                    emailVerifiedAt,
                    role,
                    description,
                    city,
                    gender,
                    suspended,
                    createdAt,
                    updatedAt,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id) AS enrolledCourses,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id AND user_courses.status = 'finished') AS finishedCourses,
                    IF(emailVerifiedAt IS NULL, 0, 1) AS verified
                FROM
                    users";

        $query = $this->db->query($sql);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $users = array();

        foreach ($query->result() as $user) {
            array_push($users, $user);
        }

        return $users;
    }

    public function getUserById($userId) {
        $sql = "SELECT
                    id,
                    firstName,
                    lastName,
                    username,
                    email,
                    emailVerifiedAt,
                    image,
                    role,
                    description,
                    city,
                    gender,
                    suspended,
                    createdAt,
                    updatedAt,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id) AS enrolledCourses,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id AND user_courses.status = 'finished') AS finishedCourses,
                    IF(emailVerifiedAt IS NULL, 0, 1) AS verified
                FROM
                    users
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $user = $query->first_row();

        return $user;
    }

    public function getUserByUsername($username) {
        $sql = "SELECT
                    firstName,
                    lastName,
                    username,
                    email,
                    emailVerifiedAt,
                    role,
                    description,
                    city,
                    gender,
                    suspended,
                    createdAt,
                    updatedAt,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id) AS enrolledCourses,
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id AND user_courses.status = 'finished') AS finishedCourses,
                    IF(emailVerifiedAt IS NULL, 0, 1) AS verified
                FROM
                    users
                WHERE
                    username = ?";

        $query = $this->db->query($sql, $username);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $user = $query->first_row();

        return $user;
    }

    public function getUserTokenById($userId) {
        $sql = "SELECT
                    token
                FROM
                    users
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $token = $query->first_row()['token'];

        return $token;
    }

    public function createUser($userData) {
        $sql = "INSERT INTO
                    users
                (
                    `firstName`,
                    `lastName`,
                    `username`,
                    `email`,
                    `password`,
                    `token`
                ) VALUES 
                ( ?, ?, ?, ?, ?, ? )";

        $hashedPassword = $this->getHashedPassword($userData['password']);
        $userToken = $this->generateUserToken();

        $query = $this->db->query($sql, array(
            $userData['firstName'],
            $userData['lastName'],
            $userData['username'],
            $userData['email'],
            $hashedPassword,
            $userToken
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return $this->db->insert_id(); // Returns id of newly created user
    }

    public function updateUser($userId, $userData) {
        $sql = "UPDATE
                    users
                SET
                    firstName = ?,
                    lastName = ?,
                    username = ?,
                    email = ?,
                    role = ?,
                    description = ?,
                    city = ?,
                    gender = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $userData['firstName'],
            $userData['lastName'],
            $userData['username'],
            $userData['email'],
            $userData['role'],
            $userData['description'],
            $userData['city'],
            $userData['gender'],
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        if ($userData['emailVerified'] === '1') {
            $this->verifyUserEmail($userId);
        } else {
            $this->unverifyUserEmail($userId);
        }

        return true;
    }

    public function updateUserFirstAndLastName($userId, $userData) {
        $sql = "UPDATE
                    users
                SET
                    firstName = ?,
                    lastName = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $userData['firstName'],
            $userData['lastName'],
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function updateUserEmail($userId, $newEmail) {
        $sql = "UPDATE
                    users
                SET
                    email = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $newEmail,
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function updateUserAdditionalInformation($userId, $userData) {
        $sql = "UPDATE
                    users
                SET
                    description = ?,
                    city = ?,
                    gender = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $userData['description'],
            $userData['city'],
            $userData['gender'],
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function updateUserPassword($userId, $newPlainPassword) {
        $sql = "UPDATE
                    users
                SET
                    password = ?
                WHERE
                    id = ?";

        $hashedPassword = $this->getHashedPassword($newPlainPassword);

        $query = $this->db->query($sql, array(
            $hashedPassword,
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function verifyUserEmail($userId) {
        $sql = "UPDATE
                    users
                SET
                    emailVerifiedAt = NOW()
                WHERE
                    id = ?";


        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }
        
        $status = $this->setNewTokenForUser($userId);

        if (!$status) {
            return false;
        }

        return true;
    }

    public function unverifyUserEmail($userId) {
        $sql = "UPDATE
                    users
                SET
                    emailVerifiedAt = NULL
                WHERE
                    id = ?";


        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function suspendUser($userId) {
        $sql = "UPDATE
                    users
                SET
                    suspended = IF(users.suspended = 0, 1, 0)
                WHERE
                    id = ?";


        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function setUserImage($userId, $imagePath) {
        $sql = "UPDATE
                    users
                SET
                    image = ?
                WHERE
                    id = ?";


        $query = $this->db->query($sql, array(
            $userId,
            $imagePath
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function getUserEnrolledCourses($userId) {
        $sql = "SELECT
                    c.id,
                    c.title,
                    c.slug,
                    c.description,
                    c.image,
                    c.status,
                    c.difficulty,
                    c.price,
                    c.shortName,
                    c.color,
                    c.createdAt,
                    c.updatedAt
                FROM
                    courses c
                INNER JOIN
                    user_courses uc
                ON
                    c.id = uc.courseId
                WHERE
                    uc.userId = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return $courses;
    }

    public function getAllLatestLecturesByUserId($userId) {
        $sql = "SELECT
                    l.id,
                    l.title,
                    c.color AS courseColor,
                    fl.createdAt AS finishedAt
                FROM
                    lectures l
                LEFT JOIN
                    finished_lectures fl
                ON
                    l.id = fl.lectureId AND fl.userId = ?
                LEFT JOIN
                    courses c
                ON
                    l.course = c.id
                WHERE
                    fl.createdAt >= NOW() - INTERVAL 7 DAY 
                ORDER BY
                    fl.createdAt
                LIMIT 10";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return $lectures;
    }

    public function getMonthlyActivity($userId) {
        $sql = "SELECT
                    COUNT(1) AS lecturesFinished,
                    createdAt AS date
                FROM
                    finished_lectures
                WHERE
                    userId = ? AND skipped = 0 AND MONTH(createdAt) = MONTH(NOW())
                GROUP BY
                    createdAt";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $stats = array();

        foreach ($query->result() as $stat) {
            array_push($stats, $stat);
        }

        return $stats;
    }

    public function getCourseActivityPercentages($userId) {
        $sql = "SELECT
                    c.id,
                    c.color,
                    c.shortName,
                    COUNT(1) / 
                    (
                        SELECT 
                            COUNT(1)
                        FROM
                            finished_lectures
                        WHERE
                            fl.userId = ?
                    ) AS percentage
                FROM
                    finished_lectures fl
                LEFT JOIN
                    lectures l
                ON 
                    l.id = fl.lectureId
                LEFT JOIN
                    courses c
                ON 
                    c.id = l.course
                WHERE
                    fl.userId = ?
                GROUP BY l.course";

        $query = $this->db->query($sql, array(
            $userId,
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        $percentages = array();

        foreach ($query->result() as $percentage) {
            array_push($percentages, $percentage);
        }

        return $percentages;
    }

    public function enrollUserInCourse($userId, $courseId) {
        $isCoursePublic = $this->course->isCoursePublic($courseId);

        if (!$isCoursePublic) {
            $date = date('YYYY-MM-DD');
            log_message('error', "User $userId tried enrolling in private course [$date]");
            return false;
        }

        $sql = "INSERT INTO
                    user_courses
                (
                    `userId`,
                    `courseId`,
                    `currentLectureId`
                ) VALUES
                (
                    ?, ?,
                    (
                        SELECT
                            id
                        FROM
                            lectures
                        ORDER BY
                            orderIndex
                        LIMIT 1
                    )
                )";


        $query = $this->db->query($sql, array(
            $userId,
            $courseId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function setNewTokenForUser($userId) {
        $sql = "UPDATE
                    users
                SET
                    token = ?
                WHERE
                    id = ?";

        $userToken = $this->generateUserToken();

        $query = $this->db->query($sql, array(
            $userToken,
            $userId
        ));

        if (!$query) {
            log_message('error', $this->db->error()['message']);
            return false;
        }

        return true;
    }

    public function getHashedPassword($plainPassword) {
        return password_hash($plainPassword, PASSWORD_DEFAULT);
    }

    public function generateUserToken() {
        return bin2hex(random_bytes(32)); // 64 character alphanumeric random string
    }
}
