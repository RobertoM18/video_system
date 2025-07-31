<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movies;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminMovieController extends Controller
{
    public function moviesTable(Request $request): Response
    {
        $search = $request->input('query');
        $column = $request->input('column', 'id');
        $direction = $request->input('direction', 'desc');
        $movies = Movies::query()
            ->select(['*'])
            ->whereAny([
                    'title',
                    'director',
                    'cast',
                ], 'like', "%{$search}%"
            )
            ->orderBy($column, $direction)->paginate($request->input('perPage', 10), ['*'], 'page', $request->input('page', 1));
        return Inertia::render('admin/movies/movies', [
            'movies' => $movies,
            'column' => $column,
            'direction' => $direction,
        ]);
    }

    public function updateMovieTable(Request $request): RedirectResponse
    {
        $request->validate([
            'id' => 'required|integer|exists:movies,id',
            'movie_poster' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'year' => 'required|integer|min:1888|max:2100',
            'summary' => 'required|string|max:1000',
            'genres' => 'required|string|max:255',
            'runtime' => 'nullable|string|max:50',
            'director' => 'required|string|max:255',
            'cast' => 'required|string|max:500',
            'rating' => 'nullable|string|max:10',
            'trailer' => 'nullable|string|max:255',
        ]);
        try {
            $movie = Movies::findOrFail($request->input('id'));
            if ($movie) {
                $movie->movie_poster = $request->input('movie_poster');
                $movie->title = $request->input('title');
                $movie->year = $request->input('year');
                $movie->summary = $request->input('summary');
                $movie->genres = $request->input('genres');
                $movie->runtime = $request->input('runtime');
                $movie->director = $request->input('director');
                $movie->cast = $request->input('cast');
                $movie->rating = $request->input('rating');
                $movie->trailer = $request->input('trailer');
                $movie->save();
            }
            return redirect()->route('admin.movies')->with('success', 'Movie updated successfully');
        } catch (Exception $e) {
            Log::error('Error updating movie: ' . $e->getMessage());
            return redirect()->route('admin.movies')->with('error', 'Failed to update movie');
        }
    }

    public function deleteMovieTable($movieID): RedirectResponse
    {
        $movies = Movies::all();
        $movies->findOrFail($movieID)->delete();
        return redirect()->route('admin.movies')->with('success', 'Movie deleted successfully');
    }

    public function addMovie(Request $request): RedirectResponse
    {
        $request->validate([
            'movie_poster' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'year' => 'required|integer|min:1888|max:2100',
            'summary' => 'required|string|max:1000',
            'genres' => 'required|string|max:255',
            'runtime' => 'nullable|string|max:50',
            'director' => 'required|string|max:255',
            'cast' => 'required|string|max:500',
            'rating' => 'nullable|string|max:10',
        ]);
        Movies::create([
            'movie_poster' => $request->input('movie_poster'),
            'title' => $request->input('title'),
            'year' => $request->input('year'),
            'summary' => $request->input('summary'),
            'genres' => $request->input('genres'),
            'runtime' => $request->input('runtime'),
            'director' => $request->input('director'),
            'cast' => $request->input('cast'),
            'rating' => $request->input('rating'),
        ]);
        return redirect()->route('admin.movies')->with('success', 'Movie added successfully');
    }
}
