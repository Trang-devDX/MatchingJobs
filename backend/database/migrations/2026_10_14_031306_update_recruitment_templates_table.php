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
        Schema::table('recruitment_templates', function (Blueprint $table) {
            $table->boolean('is_sample_template')->default(true)->after('recruitment_template_status');
            $table->foreignUuid('company_id')->nullable()->constrained('companies')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recruitment_templates', function (Blueprint $table) {
            $table->dropColumn('is_sample_template');
            $table->dropColumn('company_id');
        });
    }
};
