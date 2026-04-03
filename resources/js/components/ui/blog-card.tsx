import { Link } from "@inertiajs/react";

export default function BlogCard() {
    return (
        <Link href={route('blog.details')}>
           <div className="bg-white rounded-lg">
            <div className="w-full h-52 overflow-hidden">
                <img 
                    src="/assets/images/blog/POAO_img34-1536x806.jpg" 
                    alt="Legal Signature Requirements" 
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">04th March 2026</p>
                <h2 className="text-xl font-semibold text-gray-900">Legal Signature Requirements UK</h2>
            </div>
        </div>
        </Link>
    );
}