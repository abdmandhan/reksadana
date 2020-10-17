<?php

namespace Abdmandhan\Reksadana;

use Illuminate\Support\ServiceProvider;

class ReksadanaServiceProvider extends ServiceProvider
{

    public function register()
    {
    }

    public function boot()
    {
        $this->loadRoutesFrom(__DIR__ . '/Routes/api.php');
        $this->loadMigrationsFrom(__DIR__ . '/Database/migrations');
    }
}
