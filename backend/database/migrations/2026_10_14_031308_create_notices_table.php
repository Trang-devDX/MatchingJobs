<?php

use App\Enums\CommonStatusEnum;
use App\Enums\NoticeTargetEnum;
use App\Enums\NoticeTypeEnum;
use App\Traits\HasAuthorColumns;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    use HasAuthorColumns;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->smallInteger('target')->default(NoticeTargetEnum::ALL_SYSTEMS)->comment('1:all_systems, 2:all_companies, 3:all_job_seekers');
            $table->smallInteger('type')->default(NoticeTypeEnum::NEWS)->comment('1:news, 2:announce');
            $table->text('content')->nullable();
            $table->smallInteger('notice_status')->default(CommonStatusEnum::ACTIVE);
            $table->timestamps();
            $table->softDeletes();
            $this->addAuthorColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
    }
};
