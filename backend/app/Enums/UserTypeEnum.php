<?php

namespace App\Enums;

enum UserTypeEnum: int
{
    case JOB_SEEKER = 1;
    case STAFF = 2;
    case ADMINISTRATOR = 9;
}
