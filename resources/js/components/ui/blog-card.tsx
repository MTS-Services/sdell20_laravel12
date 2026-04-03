import { Link } from "@inertiajs/react";

interface Blog {
    id: number;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    created_at: string;
}

interface BlogCardProps {
    blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
    return (
        <Link href={route('blog.detail', { slug: blog.slug })}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-52 overflow-hidden">
                    {blog.image ? (
                        <img 
                            src={`/storage/${blog.image}`} 
                            alt={blog.title} 
                            className="w-full h-full object-cover rounded-t-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">
                            {new Date(blog.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                    </h2>
                     <div 
                            dangerouslySetInnerHTML={{ 
                                __html: blog.description 
                            }} 
                            className="text-lg text-gray-600 line-clamp-1"
                        />
                </div>
            </div>
        </Link>
    );
}