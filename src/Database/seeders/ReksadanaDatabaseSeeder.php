<?php

namespace Abdmandhan\Reksadana\Database\seeders;

use Abdmandhan\Reksadana\Models\Product;
use Abdmandhan\Reksadana\Models\ProductType;
use DateTime;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ReksadanaDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
    }
}
