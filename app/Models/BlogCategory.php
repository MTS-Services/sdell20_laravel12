<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogCategory extends Model
{
    protected $fillable = [
        'id',
        'title',
        'slug',
        'status',
        'created_at',
        'updated_at',
    ];

    public function blogs()
    {
        return $this->hasMany(Blog::class, 'category_id', 'id');
    }
}
