<?php

use Abdmandhan\Reksadana\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix'    => 'api/reksadana',
], function () {
    Route::get('product', [ProductController::class, 'index']);
});
