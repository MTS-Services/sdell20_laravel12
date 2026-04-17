import { Star } from 'lucide-react';

export type GoogleReview = {
    author_name?: string;
    profile_photo_url?: string;
    rating?: number;
    relative_time_description?: string;
    text?: string;
};

export default function FeedbackCard({ review }: { review: GoogleReview }) {
    const rating = Math.max(0, Math.min(5, Math.round(review.rating ?? 0)));

    return (
        <div className="flex h-full min-h-[250px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            {/* Header with profile and rating */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                        <img
                            src={review.profile_photo_url || "/assets/images/blog/google.png"}
                            alt={review.author_name || "Google review author"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {review.author_name || 'Anonymous'}
                        </h3>
                        {review.relative_time_description ? (
                            <p className="text-sm text-gray-500">{review.relative_time_description}</p>
                        ) : null}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-6 w-6 overflow-hidden rounded-full">
                        <img
                            src="/assets/images/blog/google.png"
                            alt="Google"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            {/* Star rating */}
            <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={[
                            "h-5 w-5",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300",
                        ].join(" ")}
                    />
                ))}
            </div>

            {/* Review text */}
            <div className="feedback-scroll h-24 overflow-y-auto">
                <p className="leading-relaxed text-gray-700">{review.text || ''}</p>
            </div>
        </div>
    );
}
