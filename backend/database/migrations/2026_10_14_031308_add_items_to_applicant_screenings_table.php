<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applicant_screenings', function (Blueprint $table) {
            $table->boolean('is_male')->nullable();
            $table->boolean('is_female')->nullable();
            $table->smallInteger('min_age')->nullable();
            $table->smallInteger('max_age')->nullable();
            $table->foreignUuid('country_id')->nullable();
            $table->foreignUuid('island_id')->nullable();
            $table->foreignUuid('town_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicant_screenings', function (Blueprint $table) {
            $table->dropColumn('is_male');
            $table->dropColumn('is_female');
            $table->dropColumn('min_age');
            $table->dropColumn('max_age');
            $table->dropColumn('country_id');
            $table->dropColumn('island_id');
            $table->dropColumn('town_id');
        });
    }
};
