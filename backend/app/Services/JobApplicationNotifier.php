<?php

namespace App\Services;

use App\Models\JobApplication;
use App\Models\Staff;
use App\Notifications\JobApplicationNotification;

class JobApplicationNotifier
{
    public function applied(JobApplication $application): void
    {
        $application->loadMissing(['jobListing.company', 'jobSeeker']);
        $listing = $application->jobListing;
        $seeker = $application->jobSeeker;
        $company = $listing->company->name;
        $title = $listing->title;

        if ($seeker) {
            $seeker->notify(new JobApplicationNotification(
                $application,
                "You applied for {$title} at {$company}.",
                'application_created',
                '/app/applications/'.$application->id,
            ));
        }

        $applicant = $seeker?->name ?: 'A job seeker';
        Staff::query()
            ->where('company_id', $listing->company_id)
            ->each(function (Staff $staff) use ($application, $applicant, $title) {
                $staff->notify(new JobApplicationNotification(
                    $application,
                    "{$applicant} applied for {$title}.",
                    'application_applied',
                    '/applications/'.$application->id,
                ));
            });
    }

    public function statusChanged(JobApplication $application): void
    {
        $application->loadMissing(['jobListing.company', 'jobSeeker']);
        $seeker = $application->jobSeeker;
        if (! $seeker) {
            return;
        }

        $listing = $application->jobListing;
        $seeker->notify(new JobApplicationNotification(
            $application,
            $application->job_application_status->seekerMessage($listing->title, $listing->company->name),
            'application_'.strtolower($application->job_application_status->name),
            '/app/applications/'.$application->id,
        ));
    }
}
