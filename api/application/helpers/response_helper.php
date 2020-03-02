<?php
defined('BASEPATH') OR exit('No direct script access allowed');


if (!function_exists('handleError')) {
    function handleError($errorMessage, $logMessage = true, $sendSameErrorMessageToUser = false) {
        if ($logMessage) {
            log_message('error', $errorMessage);
        }

        return array(
            'status' => false,
            'message' => $sendSameErrorMessageToUser ? $errorMessage : 'There was an error while trying to do that. Please try again later.'
        );
    }
}

if (!function_exists('handleSuccess')) {
    function handleSuccess($data) {
        return array(
            'status' => true,
            'data' => $data
        );
    }
}
