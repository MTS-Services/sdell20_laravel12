<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         BlogCategory::insert([
            [
                'id' => 1,
                'title' => 'Online Power of Attorney',
                'slug' => 'online-power-of-attorney',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => 'Online Will Writing',
                'slug' => 'online-will-writing',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'title' => 'Mirror Wills',
                'slug' => 'mirror-wills',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

    }
}
