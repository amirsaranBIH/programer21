<?php
defined('BASEPATH') OR exit('No direct script access allowed');


if (!function_exists('handleError')) {
    function handleError($errorMessage) {
        log_message('error', $errorMessage);
        return array(
            'status' => false,
            'message' => 'There was an error while trying to do that. Please try again later.'
        );
    }
}