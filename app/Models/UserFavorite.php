<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UserFavorite extends Model
{
    protected $fillable = [
        'user_id',
        'movie_id',
    ];

    public function movie(): BelongsTo{
        return $this->belongsTo(Movies::class);
    }
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
