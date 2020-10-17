<?php

namespace Abdmandhan\Reksadana\Controllers;

use Abdmandhan\Reksadana\Models\ReksadanaProduct;

class ProductController extends BaseController
{
    public function index()
    {
        $data = ReksadanaProduct::paginate();
        return $this->reSuccess($data);
    }
}
