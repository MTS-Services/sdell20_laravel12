<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class BlogService
{
    /**
     * Get all blogs with pagination.
     */
    public function getAllBlogs(int $perPage = 10): LengthAwarePaginator
    {
        return Blog::orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get blog by slug.
     */
    public function getBlogBySlug(string $slug): ?Blog
    {
        return Blog::where('slug', $slug)->first();
    }

    /**
     * Create new blog.
     */
    public function createBlog(array $data): Blog
    {
        // Handle image upload
        if (isset($data['image'])) {
            $imagePath = $data['image']->store('blogs', 'public');
            $data['image'] = $imagePath;
        }

        $blog = Blog::create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'],
            'image' => $data['image'] ?? null,
        ]);

        return $blog;
    }

    /**
     * Update existing blog.
     */
    public function updateBlog(Blog $blog, array $data): Blog
    {
        // Handle image removal
        if (isset($data['remove_image']) && $data['remove_image']) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            // Set image to null in database
            $blog->image = null;
        }

        // Handle new image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old image if exists
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }

            $imagePath = $data['image']->store('blogs', 'public');
            $blog->image = $imagePath;
        }

        // Update blog with all data
        $blog->update([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'],
            'image' => $blog->image, // This will be null if image was removed
        ]);

        return $blog;
    }

    /**
     * Delete blog.
     */
    public function deleteBlog(Blog $blog): bool
    {
        // Delete image if exists
        if ($blog->image) {
            Storage::disk('public')->delete($blog->image);
        }

        return $blog->delete();
    }

    /**
     * Generate unique slug from title.
     */
    public function generateSlug(string $title): string
    {
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        return trim($slug, '-');
    }
}
