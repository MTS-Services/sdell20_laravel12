<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private BlogService $blogService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $blogs = $this->blogService->getAllBlogs(15, $search);

        return Inertia::render('backend/Admin/Blog/Index', [
            'blogs' => $blogs,
            'totalBlogs' => $blogs->total(),
            'search' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = $this->blogService->getAllCategories();

        return Inertia::render('backend/Admin/Blog/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|boolean|in:0,1',
            'category_id' => 'nullable|exists:blog_categories,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:255',
            'meta_keywords' => 'nullable|string|max:255',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = $this->blogService->generateSlug($validated['title']);
        }

        $blog = $this->blogService->createBlog($validated);

        return redirect()
            ->route('blog.index')
            ->with('success', 'Blog created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug): Response
    {
        $blog = $this->blogService->getBlogBySlug($slug);

        if (!$blog) {
            abort(404, 'Blog not found');
        }

        return Inertia::render('backend/Admin/Blog/Show', [
            'blog' => $blog,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $slug): Response
    {
        $blog = $this->blogService->getBlogBySlug($slug);

        if (!$blog) {
            abort(404, 'Blog not found');
        }

        return Inertia::render('backend/Admin/Blog/Edit', [
            'blog' => $blog,
            'categories' => $this->blogService->getAllCategories(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug): RedirectResponse
    {
        $blog = $this->blogService->getBlogBySlug($slug);

        if (!$blog) {
            abort(404, 'Blog not found');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs,slug,' . $blog->id,
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|boolean|in:0,1',
            'category_id' => 'nullable|exists:blog_categories,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'remove_image' => 'nullable|boolean',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = $this->blogService->generateSlug($validated['title']);
        }

        $this->blogService->updateBlog($blog, $validated);

        return redirect()
            ->route('blog.index')
            ->with('success', 'Blog updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $slug): RedirectResponse
    {
        $blog = $this->blogService->getBlogBySlug($slug);

        if (!$blog) {
            abort(404, 'Blog not found');
        }

        $this->blogService->deleteBlog($blog);

        return redirect()
            ->route('blog.index')
            ->with('success', 'Blog deleted successfully!');
    }
}
