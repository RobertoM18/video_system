<?php

use App\Http\Controllers\Admin\AdminMovieController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\User\UserMovieController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('movies', [UserMovieController::class, 'store'])->name('movies.store');
    Route::get('movies', [UserMovieController::class, 'search'])->name('movies.search');
    Route::get('movies/{movieId}/{movieTitle}', [UserMovieController::class, 'findMovie'])->name('movie.info');
    Route::post('movies/{movieId}', [UserMovieController::class, 'addToFavorites'])->name('movie.addToFavorites');
    Route::get('favorites', [UserMovieController::class, 'showFavorites'])->name('users.favorites');
    Route::delete('favorites/{movieID}', [UserMovieController::class, 'removeFavorite'])->name('movie.removeFavorite');
});
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');
    Route::get('users', [AdminUserController::class, 'usersTable'])->name('admin.users');
    Route::post('users', [AdminUserController::class, 'addUser'])->name('admin.users.add');
    Route::delete('users/{userID}', [AdminUserController::class, 'deleteUser'])->name('admin.users.delete');
    Route::patch('users/{userID}', [AdminUserController::class, 'updateUser'])->name('admin.users.update');
    Route::get('movies', [AdminMovieController::class, 'moviesTable'])->name('admin.movies');
    Route::put('movies', [AdminMovieController::class, 'updateMovieTable'])->name('admin.movies.update');
    Route::delete('movies/{movieID}', [AdminMovieController::class, 'deleteMovieTable'])->name('admin.movies.delete');
    Route::post('movies', [AdminMovieController::class, 'addMovie'])->name('admin.movies.add');
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
