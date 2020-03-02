<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MailModel extends CI_model {
    public function __construct(){
        parent::__construct();

        $this->load->library('email');
        $this->load->helper('url');
        $this->load->model('UserModel', 'user');
    }

    private function formatEmailMessage($message, $stringsToFormat) {
        foreach($stringsToFormat as $stringToFormat => $newStringToReplaceWith) {
            $message = str_replace($stringToFormat, $newStringToReplaceWith, $message);
        }

        return $message;
    }
    
    private function sendMail($to, $subject, $message, $config = array()) {
        $dotenv = \Dotenv\Dotenv::createImmutable(FCPATH);
        $dotenv->load();
        
        $config['protocol'] = 'smtp';
        $config['smtp_host'] = 'smtp.sendgrid.net';
        $config['smtp_user'] = 'apikey';
        $config['smtp_pass'] = getenv('SENDGRID_API_KEY');
        $config['smtp_port'] = 587;

        $config['mailtype'] = 'html';

        $this->email->initialize($config);

        $this->email->from('noreply@programer21.com', 'Programer21');
        $this->email->to($to);

        $this->email->subject($subject);
        $this->email->message($message);

        $emailResponse = $this->email->send();

        if (!$emailResponse) {
            return handleError($this->email->print_debugger());
        }

        return true;
    }

    public function sendForgotPasswordMail($email) {
        $subject = "Programer21 Reset Password Instructions";

        $htmlTemplateFile = FCPATH . 'mail-templates' . DIRECTORY_SEPARATOR . 'forgot-password.html';

        $message = file_get_contents($htmlTemplateFile);

        if (!$message) {
            return handleError('Could not find ' . $htmlTemplateFile);
        }

        $token = $this->user->getUserTokenByEmail($email);

        $message = $this->formatEmailMessage($message, array(
            '{%link_url%}' => $this->config->item('host') . 'new-password/' . $token
        ));

        $mailResponse = $this->sendMail($email, $subject, $message);

        if (!$mailResponse) {
            return handleError('There was an error while trying to send mail', false, true);
        }

        return handleSuccess(true);
    }

    public function sendEmailVerificationMail($email) {
        $subject = "Programer21 Email Verification Request";

        $htmlTemplateFile = FCPATH . 'mail-templates' . DIRECTORY_SEPARATOR . 'verify-email.html';

        $message = file_get_contents($htmlTemplateFile);

        if (!$message) {
            return handleError('Could not find ' . $htmlTemplateFile);
        }

        $token = $this->user->getUserTokenByEmail($email);

        $message = $this->formatEmailMessage($message, array(
            '{%link_url%}' => $this->config->item('host') . 'verify-email/' . $token
        ));

        $mailResponse = $this->sendMail($email, $subject, $message);

        if (!$mailResponse) {
            return handleError('There was an error while trying to send mail', false, true);
        }

        return handleSuccess(true);
    }
}
