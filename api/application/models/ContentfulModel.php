<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ContentfulModel extends CI_model {
    private $environment;

    public function __construct(){
        parent::__construct();

        $dotenv = \Dotenv\Dotenv::createImmutable(FCPATH);
        $dotenv->load();
        
        $client = new \Contentful\Management\Client(getenv('CONTENTFUL_CMS_TOKEN'));
        $this->environment = $client->getEnvironmentProxy(getenv('CONTENTFUL_SPACE_ID'), getenv('CONTENTFUL_ENV'));
    }

    public function getEntryBody($entryId) {
        $entry = $this->environment->getEntry($entryId);

        if (!$entry) {
            return handleError('Could not get entry with id:' . $entryId);
        }
        
        $md = $entry->getField('body', 'en-US');

        $body = \Michelf\MarkdownExtra::defaultTransform($md);

        return handleSuccess($body);
    }

    public function createEntry($title) {
        $entry = new \Contentful\Management\Resource\Entry('lecture');
        $entry->setField('title', 'en-US', $title);
        $this->environment->create($entry);

        $createdEntryId = $entry->getSystemProperties()->getId();

        if ($createdEntryId) {
            return handleSuccess($createdEntryId);
        } else {
            return handleError('There was an error while creating lecture on contentful');
        }
    }
}
