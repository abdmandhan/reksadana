<?php

namespace Abdmandhan\Reksadana\Models;

class ReksadanaProduct extends ReksadanaBaseModel
{
    protected $fillable = [];

    protected $casts = [
        'yield'         => 'decimal:2',
        'yield_high'    => 'decimal:2',
        'yield_low'     => 'decimal:2',
    ];

    public function product_type()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id');
    }
}
