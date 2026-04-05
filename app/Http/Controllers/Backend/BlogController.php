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
    public function __construct(private BlogService $blogService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $blogs = $this->blogService->getAllBlogs();
        
        return Inertia::render('backend/Admin/Blog/Index', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('backend/Admin/Blog/Create');
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
