<?php

namespace App\Traits;

use Illuminate\Database\Schema\Blueprint;

trait HasAuthorColumns
{
    /**
     * Add author tracking columns to the table.
     */
    public function addAuthorColumns(Blueprint $table): void
    {
        $table->uuid('created_by')->nullable();
        $table->uuid('updated_by')->nullable();
        $table->uuid('deleted_by')->nullable();

        $table->foreign('created_by')
            ->references('id')
            ->on('users')
            ->nullOnDelete();

        $table->foreign('updated_by')
            ->references('id')
            ->on('users')
            ->nullOnDelete();

        $table->foreign('deleted_by')
            ->references('id')
            ->on('users')
            ->nullOnDelete();
    }

    /**
     * Drop author tracking columns from the table.
     */
    public function dropAuthorColumns(Blueprint $table): void
    {
        $table->dropForeign(['created_by']);
        $table->dropForeign(['updated_by']);
        $table->dropForeign(['deleted_by']);

        $table->dropColumn(['created_by', 'updated_by', 'deleted_by']);
    }
}
