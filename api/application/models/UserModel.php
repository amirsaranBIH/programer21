<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->database();
        $this->load->model('CourseModel', 'course');
        $this->load->model('AuthModel', 'auth');
    }

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
            return handleError($this->db->error()['message']);
        }

        $users = array();

        foreach ($query->result() as $user) {
            array_push($users, $user);
        }

        return handleSuccess($users);
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
                    (SELECT COUNT(1) FROM user_courses WHERE user_courses.userId = users.id AND user_courses.status = 'finished') AS finishedCourses,
                    IF(emailVerifiedAt IS NULL, 0, 1) AS verified
                FROM
                    users
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $user = $query->first_row();

        $enrolledCoursesResponse = $this->getCoursesUserIsEnrolledIn($userId);

        if (!$enrolledCoursesResponse['status']) {
            return handleError($enrolledCoursesResponse['message'], false);
        }

        $user->coursesEnrolledIn = $enrolledCoursesResponse['data'];

        return handleSuccess($user);
    }

    public function getUserTokenByEmail($email) {
        $sql = "SELECT
                    token
                FROM
                    users
                WHERE
                    email = ?";

        $query = $this->db->query($sql, $email);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $token = $query->first_row()->token;

        return handleSuccess($token);
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess($this->db->insert_id()); // Returns id of newly created user
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
            return handleError($this->db->error()['message']);
        }

        if ($userData['emailVerified'] === '1') {
            $verificationResponse = $this->verifyUserEmail($userId);
        } else {
            $verificationResponse = $this->unverifyUserEmail($userId);
        }

        if (!$verificationResponse['status']) {
            return handleError($verificationResponse['message'], false);
        }

        return handleSuccess(true);
    }

    public function updateUserAccountInfo($userId, $userData) {
        $this->db->trans_start();

        // $oldImage = $this->getUserById($userId)->image;
        $userResponse = $this->getUserById($userId);

        if (!$userResponse['status']) {
            return handleError($userResponse['message'], false);
        }

        $user = $userResponse['data'];
        $oldImage = $user->image;

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
            return handleError($this->db->error()['message']);
        }

        if (isset($_FILES['image'])) {
            $uploadResponse = $this->uploadUserImage('image');

            if (!$uploadResponse['status']) {
                return handleError($uploadResponse['message'], false, true);
            }
    
            $uploadedImagePath = '/uploads/user_images/'.$uploadResponse['data']['file_name'];
    
            $setUserImageResponse = $this->setUserImage($userId, $uploadedImagePath);

            if (!$setUserImageResponse['status']) {
                return handleError($setUserImageResponse['message'], false);
            }

            if (strpos($oldImage, 'user.png') !== false) {
                $deleteOldImageResponse = $this->deleteOldImage($oldImage);
    
                if (!$deleteOldImageResponse['status']) {
                    return handleError($deleteOldImageResponse['message'], false);
                }
            }
        }

        if ($user->email !== $userData['email']) {
            $updateUserEmailResponse = $this->updateUserEmail($userId, $userData['email']);

            if (!$updateUserEmailResponse['status']) {
                return handleError($updateUserEmailResponse['message'], false);
            }
        }

        if ($user->username !== $userData['username']) {
            $updateUserUsernameResponse = $this->updateUserUsername($userId, $user->username, $userData['username']);

            if (!$updateUserUsernameResponse['status']) {
                return handleError($updateUserUsernameResponse['message'], false);
            }
        }

        $this->db->trans_complete();

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function updateUserUsername($userId, $oldUsername, $newUsername) {
        $this->db->trans_start();

        $sql = "UPDATE
                    users
                SET
                    username = ?
                WHERE
                    id = ?";

        $query = $this->db->query($sql, array(
            $newUsername,
            $userId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $sql = "INSERT INTO
                    username_changes
                (
                    `userId`,
                    `oldUsername`,
                    `newUsername`
                ) VALUES (
                    ?, ?, ?
                )";

        $query = $this->db->query($sql, array(
            $userId,
            $oldUsername,
            $newUsername
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $this->db->trans_complete();

        return handleSuccess(true);
    }

    public function updateUserAdditionalInfo($userId, $userData) {
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function updateUserPassword($userId, $passwordData) {
        $sql = "SELECT
                    password
                FROM
                    users
                WHERE
                    id = ?";

        $query = $this->db->query($sql, $userId);

        $storedPassword = $query->first_row()->password;
        $isCorrectPassword = $this->auth->isCorrectPassword($passwordData['password'], $storedPassword);

        if (!$isCorrectPassword) {
            return handleError('Password not correct', false, true);
        }

        $sql = "UPDATE
                    users
                SET
                    password = ?
                WHERE
                    id = ?";

        $hashedPassword = $this->getHashedPassword($passwordData['newPassword']);

        $query = $this->db->query($sql, array(
            $hashedPassword,
            $userId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }
        
        $newTokenResponse = $this->setNewTokenForUser($userId);

        if (!$newTokenResponse['status']) {
            return handleError($newTokenResponse['message'], false);
        }

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function setUserImage($userId, $imagePath) {
        $sql = "UPDATE
                    users
                SET
                    image = ?
                WHERE
                    id = ?";


        $query = $this->db->query($sql, array(
            $imagePath,
            $userId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function getUserCourseBySlug($courseSlug, $userId) {
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
                    c.updatedAt,
                    (SELECT IF(SUM(ert) IS NULL, 0, SUM(ert)) FROM lectures WHERE lectures.course = c.id) AS totalErt,
                    l.slug AS currentLectureSlug,
                    uc.status AS userCourseStatus
                FROM
                    courses c
                LEFT JOIN
                    user_courses uc
                ON
                    uc.courseId = c.id
                AND
                    uc.userId = ?
                LEFT JOIN
                    lectures l
                ON
                    uc.currentLectureId = l.id
                WHERE
                    c.slug = ?";

        $query = $this->db->query($sql, array(
            $userId,
            $courseSlug
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $course = $query->first_row();

        $supportedLanguagesResponse = $this->course->getSupportedLanguages($course->id);

        if (!$supportedLanguagesResponse['status']) {
            return handleError($supportedLanguagesResponse['message'], false);
        }

        $course->supportedLanguages = $supportedLanguagesResponse['data'];


        $courseLecturesResponse = $this->lecture->getAllPublicLecturesForUserByCourseSlug($courseSlug, $userId);

        if (!$courseLecturesResponse['status']) {
            return handleError($courseLecturesResponse['message'], false);
        }

        $course->courseLectures = $courseLecturesResponse['data'];


        $coursePercentageFinishedResponse = $this->getUserCoursePercentageFinished($course->id, $userId);

        if (!$coursePercentageFinishedResponse['status']) {
            return handleError($coursePercentageFinishedResponse['message'], false);
        }

        $course->coursePercentageFinished = $coursePercentageFinishedResponse['data'];

        return handleSuccess($course);
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
            return handleError($this->db->error()['message']);
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course);
        }

        return handleSuccess($courses);
    }

    public function getUserCoursePercentageFinished($courseId, $userId) {
        $sql = "SELECT
                    TRUNCATE((COUNT(1) / (SELECT COUNT(1) FROM lectures WHERE course = ? AND lectures.`status` = 'public')) * 100, 0) AS coursePercentageFinished
                FROM
                    finished_lectures
                LEFT JOIN
                    lectures
                ON
                    lectures.id = finished_lectures.lectureId
                LEFT JOIN
                    courses
                ON
                    courses.id = lectures.course
                WHERE
                    courses.id = ?
                AND
                    finished_lectures.userId = ?";

        $query = $this->db->query($sql, array(
            $courseId,
            $courseId,
            $userId
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess($query->first_row()->coursePercentageFinished);
    }

    public function getAllFinishedLecturesByUserId($userId) {
        $sql = "SELECT
                    l.id,
                    l.title,
                    l.slug,
                    c.color AS courseColor,
                    fl.createdAt AS finishedAt
                FROM
                    finished_lectures fl
                INNER JOIN
                    lectures l
                ON
                    l.id = fl.lectureId
                INNER JOIN
                    courses c
                ON
                    c.id = l.course
                WHERE
                    userId = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return handleSuccess($lectures);
    }

    public function getAllLatestLecturesByUserId($userId) {
        $sql = "SELECT
                    l.id,
                    l.title,
                    l.slug,
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
            return handleError($this->db->error()['message']);
        }

        $lectures = array();

        foreach ($query->result() as $lecture) {
            array_push($lectures, $lecture);
        }

        return handleSuccess($lectures);
    }

    public function getMonthlyActivity($userId, $month) {
        $sql = "SELECT
                    COUNT(1) AS lecturesFinished,
                    DATE(createdAt) AS date
                FROM
                    finished_lectures
                WHERE
                    userId = ? AND skipped = 0 AND MONTH(createdAt) = ?
                GROUP BY
                    date";

        $query = $this->db->query($sql, array(
            $userId,
            $month
        ));

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $stats = array();

        foreach ($query->result() as $stat) {
            $stats[$stat->date] = $stat;
        }

        return handleSuccess($stats);
    }

    public function getCourseActivityPercentages($userId) {
        $sql = "SELECT
                    c.slug,
                    c.color,
                    c.shortName,
                    (COUNT(1) / 
                    (
                        SELECT 
                            COUNT(1)
                        FROM
                            finished_lectures
                        WHERE
                            fl.userId = ?
                    )) * 100 AS percentage
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
            return handleError($this->db->error()['message']);
        }

        $percentages = array();

        foreach ($query->result() as $percentage) {
            array_push($percentages, $percentage);
        }

        return handleSuccess($percentages);
    }

    public function enrollUserInCourse($userId, $courseId) {
        $isCoursePublicResponse = $this->course->isCoursePublic($courseId);

        if (!$isCoursePublicResponse['status']) {
            return handleError($isCoursePublicResponse['message'], false);
        }

        $isCoursePublic = $isCoursePublicResponse['data'];

        if (!$isCoursePublic) {
            return handleError("User $userId tried enrolling in private course");
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
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
            return handleError($this->db->error()['message']);
        }

        return handleSuccess(true);
    }

    public function nextUsernameChangeAvailableIn($userId) {
        $sql = "SELECT
                    IFNULL(
                        IF(
                            DATEDIFF(
                                DATE_ADD(MAX(createdAt), INTERVAL 30 DAY),
                                NOW()
                            ) <= 0,
                            0,
                            DATEDIFF(
                                DATE_ADD(MAX(createdAt), INTERVAL 30 DAY),
                                NOW()
                            )
                        ),
                        0
                    ) AS nextUsernameChangeAvailableIn
                FROM
                    username_changes
                WHERE
                    userId = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        return handleSuccess($query->first_row()->nextUsernameChangeAvailableIn);
    }

    public function getCoursesUserIsEnrolledIn($userId) {
        $sql = "SELECT
                    courseId
                FROM
                    user_courses
                WHERE
                    userId = ?";

        $query = $this->db->query($sql, $userId);

        if (!$query) {
            return handleError($this->db->error()['message']);
        }

        $courses = array();

        foreach ($query->result() as $course) {
            array_push($courses, $course->courseId);
        }

        return handleSuccess($courses);
    }

    public function uploadUserImage($fieldName) {
        $config['upload_path']      = './uploads/user_images';
        $config['allowed_types']    = 'gif|jpg|jpeg|png';
        $config['max_size']         = 500;
        $config['max_width']        = 512;
        $config['max_height']       = 512;
        $config['encrypt_name']     = true;
        $config['file_ext_tolower'] = true;
        
        $this->load->library('upload', $config);

        if ($this->upload->do_upload($fieldName)) {
            return handleSuccess($this->upload->data());
        } else {
            return handleError($this->upload->display_errors('', ''), true);
        }
    }

    public function getHashedPassword($plainPassword) {
        return password_hash($plainPassword, PASSWORD_DEFAULT);
    }

    public function generateUserToken() {
        return bin2hex(random_bytes(32)); // 64 character alphanumeric random string
    }

    public function deleteOldImage($imagePath) {
        $fullImagePath = FCPATH . ltrim($imagePath, '/'); 
        if (!file_exists($fullImagePath)) {
            return handleError('User image does not exist: ' . $fullImagePath);
        }

        $unlinkStatus = unlink($fullImagePath);

        return $unlinkStatus ? handleSuccess($unlinkStatus) : handleError('There was an error while deleting old user image');

    }
}
