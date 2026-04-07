<?php

namespace App\Services;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class BlogService
{
    /**
     * Get all blog categories.
     */
    public function getAllCategories(): array
    {
        return BlogCategory::orderBy('title', 'asc')->get()->toArray();
    }

    /**
     * Get all blogs with pagination.
     */
    public function getAllBlogs(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        return Blog::orderBy('created_at', 'desc')
            ->with('category')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->paginate($perPage);
    }

    /**
     * Get published blogs for frontend.
     */
    public function getPublishedBlogs(int $perPage = 15): LengthAwarePaginator
    {
        return Blog::where('status', 1)->with('category')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get published blogs grouped by category with 12 blogs per category and category-wise pagination.
     */
    public function getBlogsByCategory(int $perPage = 12): array
    {
        $categories = BlogCategory::with(['blogs' => function ($query) {
            $query->where('status', 1)
                ->orderBy('created_at', 'desc');
        }])->get();

        $result = [];

        foreach ($categories as $category) {
            $categoryBlogs = $category->blogs;

            if ($categoryBlogs->count() > 0) {
                $result[] = [
                    'category' => $category->title ?: 'Uncategorized',
                    'blogs'    => $categoryBlogs->values(),
                    'per_page' => $perPage,
                    'total'    => $categoryBlogs->count(),
                ];
            }
        }

        return $result;
    }

    /**
     * Get recent blogs from the same category (excluding current blog).
     */
    public function getRecentBlogsFromSameCategory(Blog $currentBlog, int $limit = 4): array
    {
        $blogs = Blog::where('status', 1)
            ->where('id', '!=', $currentBlog->id)
            ->where('category_id', $currentBlog->category_id)
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();

        $categoryTitle = $currentBlog->category?->title ?: 'Uncategorized';

        return [
            'category' => $categoryTitle,
            'blogs' => $blogs
        ];
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
        if (isset($data['image'])) {
            $imagePath = $data['image']->store('blogs', 'public');
            $data['image'] = $imagePath;
        }

        $blog = Blog::create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'],
            'image' => $data['image'] ?? null,
            'status' => $data['status'] ?? 1,
            'category_id' => $data['category_id'] ?? null,
            'meta_title' => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'meta_keywords' => $data['meta_keywords'] ?? null,
        ]);

        return $blog;
    }

    /**
     * Update existing blog.
     */
    public function updateBlog(Blog $blog, array $data): Blog
    {
        $shouldRemoveImage = filter_var($data['remove_image'] ?? false, FILTER_VALIDATE_BOOLEAN);

        if ($shouldRemoveImage) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            $blog->image = null;
        }

        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            $blog->image = $data['image']->store('blogs', 'public');
        }

        $blog->update([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'],
            'image' => $blog->image,
            'status' => $data['status'] ?? $blog->status,
            'category_id' => $data['category_id'] ?? $blog->category_id,
            'meta_title' => $data['meta_title'] ?? $blog->meta_title,
            'meta_description' => $data['meta_description'] ?? $blog->meta_description,
            'meta_keywords' => $data['meta_keywords'] ?? $blog->meta_keywords,
        ]);

        return $blog;
    }

    /**
     * Delete blog.
     */
    public function deleteBlog(Blog $blog): bool
    {
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
