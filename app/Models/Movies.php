<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movies extends Model
{
    protected $fillable = ['movie_poster', 'title', 'year', 'summary', 'genres', 'runtime', 'director', 'cast', 'rating', 'trailer'];

    public function userFavorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }
}
