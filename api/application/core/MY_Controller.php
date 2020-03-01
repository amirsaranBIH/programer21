<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Controller extends CI_Controller {
    public function __construct() {
		parent::__construct();	
		$headers = new \Aidantwoods\SecureHeaders\SecureHeaders();
		$headers->hsts();
		$headers->csp('script-src', 'self');
		$headers->apply();
    }
	
	public function setResponseSuccess($data = array(), $flags = JSON_NUMERIC_CHECK) {
		$this->output->set_status_header(200);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode(array(
				'status' => true,
				'data' => $data
		), $flags));
	}
	
	public function setResponseError($statusCode = 200, $message = '') {
		$this->output->set_status_header($statusCode);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode(array(
				'status' => false,
				'message' => $message
		)));
	}
}
