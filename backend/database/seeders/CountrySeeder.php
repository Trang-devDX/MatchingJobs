<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Japan', 'United States', 'Vietnam'] as $name) {
            Country::query()->firstOrCreate(['name' => $name]);
        }
    }
}
