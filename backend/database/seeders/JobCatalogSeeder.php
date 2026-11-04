<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\EducationLevel;
use App\Models\Island;
use App\Models\JobCategory;
use App\Models\JobIndustry;
use App\Models\JobType;
use App\Models\Town;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class JobCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->names(JobIndustry::class, ['Technology', 'Hospitality', 'Education']);
        $this->names(JobCategory::class, ['Engineering', 'Design', 'Operations']);
        $this->names(JobType::class, ['Full-time', 'Part-time', 'Contract']);
        $this->names(EducationLevel::class, ['High school', 'Bachelor', 'Master']);

        $vietnam = Country::query()->firstOrCreate(['name' => 'Vietnam']);
        $central = Island::query()->firstOrCreate(
            ['name' => 'Central', 'country_id' => $vietnam->id],
        );
        Town::query()->firstOrCreate(
            ['name' => 'Da Nang', 'island_id' => $central->id],
            ['country_id' => $vietnam->id],
        );

        $japan = Country::query()->firstOrCreate(['name' => 'Japan']);
        $honshu = Island::query()->firstOrCreate(
            ['name' => 'Honshu', 'country_id' => $japan->id],
        );
        Town::query()->firstOrCreate(
            ['name' => 'Tokyo', 'island_id' => $honshu->id],
            ['country_id' => $japan->id],
        );
    }

    /**
     * @param  class-string<Model>  $model
     * @param  list<string>  $names
     */
    private function names(string $model, array $names): void
    {
        foreach ($names as $index => $name) {
            $model::query()->firstOrCreate(['name' => $name], ['sort' => $index + 1]);
        }
    }
}
