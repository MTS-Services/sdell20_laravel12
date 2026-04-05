import { Star } from 'lucide-react';

export default function FeedbackCard() {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            {/* Header with profile and rating */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                        <img
                            src="/assets/images/blog/google.png"
                            alt="Helen Baines"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            Helen Baines
                        </h3>
                        <p className="text-sm text-gray-500">2 months ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-6 w-6 overflow-hidden rounded-full">
                        <img
                            src="/assets/images/blog/google.png"
                            alt="Helen Baines"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Star rating */}
            <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                ))}
            </div>

            {/* Review text */}
            <div className="feedback-scroll max-h-24 overflow-y-auto">
                <p className="leading-relaxed text-gray-700">
                    This is so simple to use. The company assists you with
                    everything, they let you know if you have made a mistake so
                    it can be corrected. 1st class service. Using the online
                    forms gave me peace of mind and eased pressure from me
                    ensuring everything was correct. I can not praise them
                    enough.
                </p>
            </div>
        </div>
    );
}
