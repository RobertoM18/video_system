<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Movies;
use App\Models\UserFavorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserMovieController extends Controller
{
    public function search(Request $request): Response
    {
        $page = $request->input('page', 1);
        $allowPerPage = [20, 50, 75, 100];
        $perPage = $request->input('perPage', 20);
        if (!in_array($perPage, $allowPerPage)) {
            $perPage = 20;
        }

        $query = \App\Models\Movies::query();

        if ($request->filled('title')) {
            $query->where('title', 'ILIKE', '%' . $request->input('title') . '%');
        }
        if ($request->filled('genre')) {
            $query->where('genres', 'like', '%' . $request->input('genre') . '%');
        }
        $movies = $query->orderBy('year', 'desc')->orderBy('id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return Inertia::render('movies', [
            'movies' => $movies,
            'perPage' => $perPage,
        ]);
    }

    public function findMovie($movieId): Response
    {
        $movie = Movies::findOrFail($movieId);
        $user = auth()->user();
        $isFavorite = false;
        if ($user) {
            $isFavorite = $user->favorites()->where('movie_id', $movieId)->exists();
        }
        return Inertia::render('movies/movieInfo', [
            'movie' => $movie,
            'isFavorite' => $isFavorite
        ]);
    }

    public function store(Request $request): Response
    {
        $request->validate([
            'movie_poster' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'year' => 'required|integer|min:1888|max:',
            'summary' => 'required|string|max:1000',
            'genres' => 'required|string|max:255',
            'runtime' => 'required|string|max:50',
            'director' => 'required|string|max:255',
            'cast' => 'required|string|max:500',
            'rating' => 'required|string|max:10',
        ]);
        $movie = Movies::create([
            'movie_poster' => $request->movie_poster,
            'title' => $request->title,
            'year' => $request->year,
            'summary' => $request->summary,
            'genres' => $request->genres,
            'runtime' => $request->runtime,
            'director' => $request->director,
            'cast' => $request->cast,
            'rating' => $request->rating,
        ]);
        return Inertia::render('Movie/Create', []);
    }

    public function addToFavorites($movieID)
    {
        $user = auth()->user();
        $exist = $user->favorites()->where('movie_id', $movieID)->exists();
        if (!$exist) {
            UserFavorite::create([
                'user_id' => $user->id,
                'movie_id' => $movieID
            ]);
        }
    }

    public function showFavorites(): Response
    {
        $user = auth()->user();
        $favorites = $user->favorites()->with('movie')->get();
        return Inertia::render('movies/favorites', [
            'favorites' => $favorites
        ]);
    }

    public function removeFavorite($movieID)
    {
        $user = auth()->user();
        $favorite = UserFavorite::where('user_id', $user->id)->where('movie_id', $movieID)->first();
        if ($favorite) {
            $favorite->delete();
        }
    }
}
