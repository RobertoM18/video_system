<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function usersTable(Request $request): Response
    {
        $search = $request->input('query');
        $users = User::query()
            ->select('id', 'name', 'email', 'is_admin')
            ->whereAny(['name', 'email'], 'like', "%$search%")
            ->orderBy('id', 'desc')->paginate($request->input('perPage', 10), ['*'], 'page', $request->input('page', 1));
        return Inertia::render('admin/users/users', [
            'users' => $users,
        ]);
    }

    public function addUser(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'is_admin' => 'required|boolean',
        ]);
        try {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'is_admin' => $request->boolean('is_admin'),
            ]);
        } catch (Exception $e) {
            return redirect()->route('admin.users')->with('error', 'Failed to add user ' . $e->getMessage());
        }
        return redirect()->route('admin.users')->with('success', 'User added successfully');
    }

    public function updateUser(Request $request, $userID)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $userID,
            'is_admin' => 'required|boolean',
        ]);
        try {
            $user = User::findOrFail($userID);
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->is_admin = $request->boolean('is_admin');
            $user->save();
        } catch (Exception $e) {
            return redirect()->route('admin.users')->with('error', 'Failed to update user ' . $e->getMessage());
        }
        return redirect()->route('admin.users')->with('success', 'User updated successfully');
    }

    public function deleteUser($userID): RedirectResponse
    {
        try {
            $user = User::findOrFail($userID);
            $user->delete();
            return redirect()->route('admin.users')->with('success', 'User deleted successfully');
        } catch (Exception $e) {
            return redirect()->route('admin.users')->with('error', 'Failed to delete user ' . $e->getMessage());
        }
    }
}
