import React, { useId, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';

import type { GoogleReview } from '@/components/feedback-card';
import { RevealMotion, REVEAL_STAGGER, revealStagger } from '@/components/frontend/reveal-motion';
import { useReveal } from '@/hooks/use-reveal';

const STAR_PATH =
    'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

type GoogleReviewPageProps = {
    reviews?: GoogleReview[];
    googlePlaceRating?: number | null;
    googleUserRatingsTotal?: number | null;
    googleWriteReviewUrl?: string | null;
};

function clampRating(value: number): number {
    return Math.min(5, Math.max(0, value));
}

/** Same average/count rules as Feedback: when `reviews` is non-empty, use its mean (1 d.p.) and length; else Places summary. */
function averageFromReviewsLikeFeedback(reviews: GoogleReview[]): number | null {
    if (!reviews.length) {
        return null;
    }
    const raw =
        Math.round((reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length) * 10) / 10;
    return clampRating(raw);
}

function resolveDisplayRating(placeRating: number | null | undefined, reviews: GoogleReview[]): number | null {
    if (reviews.length > 0) {
        return averageFromReviewsLikeFeedback(reviews);
    }
    if (typeof placeRating === 'number' && placeRating > 0) {
        return clampRating(placeRating);
    }
    return null;
}

function resolveReviewCount(total: number | null | undefined, reviews: GoogleReview[]): number {
    if (reviews.length > 0) {
        return reviews.length;
    }
    if (typeof total === 'number' && total > 0) {
        return total;
    }
    return 0;
}

function formatRatingLabel(rating: number): string {
    const rounded = Math.round(rating * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function RatingStars({ rating, idBase }: { rating: number; idBase: string }) {
    return (
        <div className="flex" role="img" aria-label={`${formatRatingLabel(rating)} out of 5 stars`}>
            {[0, 1, 2, 3, 4].map((index) => {
                const fill = Math.min(1, Math.max(0, rating - index));
                const gradId = `${idBase}-s${index}`;

                if (fill >= 1) {
                    return (
                        <svg key={index} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                            <path d={STAR_PATH} />
                        </svg>
                    );
                }

                if (fill <= 0) {
                    return (
                        <svg key={index} className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                            <path d={STAR_PATH} />
                        </svg>
                    );
                }

                const pct = `${fill * 100}%`;

                return (
                    <svg key={index} className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" aria-hidden>
                        <defs>
                            <linearGradient id={gradId}>
                                <stop offset={pct} stopColor="var(--accent-yellow)" />
                                <stop offset={pct} stopColor="var(--slate-400)" />
                            </linearGradient>
                        </defs>
                        <path fill={`url(#${gradId})`} d={STAR_PATH} />
                    </svg>
                );
            })}
        </div>
    );
}

const heroCtaClassName =
    'inline-flex items-center justify-center rounded-full border border-brand-navy bg-brand-cta px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-brand-cta-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40';

export type BannerVariant = 'lpa' | 'will';

type StatBlock = {
    value: string;
    title: string;
    lead: string;
    paragraphs: string[];
};

type BannerContent = {
    heroImage: string;
    heroSrcSet?: string;
    heroSizes?: string;
    imageAlt: string;
    h1: string;
    h2: string;
    bodyParagraphs: string[];
    ctaRoute: 'lpa' | 'will-writing';
    ctaLabel: string;
    stats: StatBlock[];
};

const LPA_HERO_IMG = '/Lpa.jpg';

const WILL_HERO_IMG = '/will.jpg';

const lpaStats: StatBlock[] = [
    {
        value: '35,000+',
        title: 'Every year, LPAs contain errors',
        lead: 'Why do so many LPA applications fail?',
        paragraphs: [
            'Many people try to complete LPA applications themselves, but the UK government guidance can feel complex.',
            'Small mistakes, like signing in the wrong order or writing unclear instructions, can lead to rejections or delays.',
            'Our professional guidance helps you avoid common LPA mistakes so your application is accurate and processed quickly.',
        ],
    },
    {
        value: '6X',
        title: 'Quicker than hiring a solicitor',
        lead: 'Ignore the paperwork and appointments',
        paragraphs: [
            'Conventional legal services can involve weeks of waiting, meetings, and correspondence.',
            'With Power of Attorney support, you can complete your LPA paperwork from home in around fifteen minutes, at your own pace.',
            'No office appointments or home visits required.',
        ],
    },
    {
        value: '80%',
        title: 'Cheaper than attorneys',
        lead: 'Professional guidance without high expenses',
        paragraphs: [
            'Solicitors often charge up to £1000 for preparing Lasting Powers of Attorney.',
            'Power of Attorney support can save you up to 80% while still guiding you through the same legal documents.',
            'Clear pricing means you always know exactly what you are paying for.',
        ],
    },
    {
        value: '24/7',
        title: 'Customer care whenever you need it',
        lead: 'Start now and finish when it suits you',
        paragraphs: [
            'Your LPA application can be completed at any time.',
            'Power of Attorney support is available around the clock.',
            'There are no office hours or appointments. Start, pause, and return whenever you like.',
        ],
    },
];

const willStats: StatBlock[] = [
    {
        value: '2 in 3',
        title: 'UK adults still need a valid Will',
        lead: 'Why does having an up-to-date Will matter?',
        paragraphs: [
            'Without a Will, intestacy rules decide how your estate is divided, which may not reflect your wishes.',
            'That uncertainty can cause delays, extra cost, and stress for the people you care about most.',
            'Putting a proper Will in place keeps you in control and makes your intentions clear.',
        ],
    },
    {
        value: 'Guided',
        title: 'Guided questions you can finish at home',
        lead: 'No waiting room required to get started',
        paragraphs: [
            'Work through plain-English prompts on your own schedule from a secure connection.',
            'Save progress if you need a break and pick up exactly where you left off.',
            'The process is designed to be straightforward whether you are on a laptop or tablet.',
        ],
    },
    {
        value: 'Checked',
        title: 'Specialist review before you sign',
        lead: 'Confidence that your Will says what you mean',
        paragraphs: [
            'Experienced reviewers look for common issues so you are not left guessing.',
            'You receive clear guidance on signing and witnessing so the document can be relied on.',
            'Executors get unambiguous instructions, which makes administration smoother later on.',
        ],
    },
    {
        value: 'Flexible',
        title: 'New Will or refresh an existing one',
        lead: 'Life events should be reflected in your documents',
        paragraphs: [
            'Marriages, children, property moves, and changes to who you want to benefit all matter.',
            'Refreshing an older Will avoids outdated gifts, appointments, or addresses.',
            'Whether it is your first Will or an update, the same guided path keeps everything consistent.',
        ],
    },
];

const bannerContent: Record<BannerVariant, BannerContent> = {
    lpa: {
        heroImage: LPA_HERO_IMG,
        imageAlt:
            'UK Power of Attorney helping people create LPAs quickly, affordably and correctly, with a clear and jargon free process.',
        h1: 'LPA Application Online',
        h2: 'State your wishes are clear. Ensure your family & loved ones are protected.',
        bodyParagraphs: [
            'Faster than a solicitor. We make it easier than the forms on GOV.UK.',
            'Designed to help you avoid mistakes.',
            'Our support helps you create your legal LPA document in 15 minutes without any stress or confusion.',
        ],
        ctaRoute: 'lpa',
        ctaLabel: 'Create your LPA now',
        stats: lpaStats,
    },
    will: {
        heroImage: WILL_HERO_IMG,
        imageAlt: 'Customer planning their Will at home',
        h1: 'Make a Will Online',
        h2: 'Keep your wishes legally clear when life changes.',
        bodyParagraphs: [
            'Need a new Will or an update? Create or refresh yours quickly and securely with step-by-step guidance.',
            'Births, marriages, divorce, a new home, changing assets, or different executors and beneficiaries can all affect how your estate is handled.',
            'An up-to-date Will helps your family avoid unnecessary disputes and ensures your assets are distributed as you intend.',
            'If you are writing your first Will, you gain peace of mind and certainty for the future—with professional support throughout.',
        ],
        ctaRoute: 'will-writing',
        ctaLabel: "Let's get started",
        stats: willStats,
    },
};

function GoogleRatingBadge({
    rating,
    reviewCount,
    writeReviewUrl,
}: {
    rating: number | null;
    reviewCount: number;
    writeReviewUrl: string | null;
}) {
    const idBase = useId().replace(/:/g, '');

    if (reviewCount <= 0 && rating === null) {
        return null;
    }

    const showReviewLine = reviewCount > 0;

    const body = (
        <div className="flex items-start gap-2">
            <svg className="h-8 w-8 shrink-0" viewBox="0 0 48 48" aria-hidden>
                <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
            </svg>
            <div>
                <p className="text-xs text-white/80">Google Rating</p>
                {rating !== null ? (
                    <div className="mt-0.5 flex flex-wrap items-center gap-1">
                        <span className="text-lg font-bold text-white">{formatRatingLabel(rating)}</span>
                        <RatingStars rating={rating} idBase={idBase} />
                    </div>
                ) : null}
                {showReviewLine ? (
                    <p className="mt-0.5 text-xs text-white/60">
                        Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                    </p>
                ) : null}
            </div>
        </div>
    );

    if (writeReviewUrl) {
        return (
            <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="-m-2 block rounded-lg p-2 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50"
            >
                {body}
            </a>
        );
    }

    return body;
}

function bodyParagraphClass(index: number, total: number): string {
    const base = 'text-base font-light leading-8 text-white sm:text-xl ';
    if (index === 0) {
        return base + 'mb-0 mt-0';
    }
    if (index === 1) {
        return base + 'mb-3 mt-0';
    }
    if (index === total - 1) {
        return base + 'mb-4 pb-3';
    }
    return base + 'mb-3';
}

function paragraphStaggerClass(i: number): string {
    return REVEAL_STAGGER[Math.min(3 + i, REVEAL_STAGGER.length - 1)];
}

type BannerProps = {
    variant?: BannerVariant;
    fullWidth?: boolean;
};

export default function Banner({ variant = 'lpa', fullWidth = false }: BannerProps) {
    const copy = bannerContent[variant];

    const { props } = usePage<GoogleReviewPageProps>();
    const reviews = useMemo(() => (Array.isArray(props.reviews) ? props.reviews : []), [props.reviews]);
    const placeRating = props.googlePlaceRating ?? null;
    const userRatingsTotal = props.googleUserRatingsTotal ?? null;
    const writeReviewUrl = typeof props.googleWriteReviewUrl === 'string' ? props.googleWriteReviewUrl : null;

    const displayRating = useMemo(
        () => resolveDisplayRating(placeRating, reviews),
        [placeRating, reviews],
    );
    const reviewCount = useMemo(() => resolveReviewCount(userRatingsTotal, reviews), [userRatingsTotal, reviews]);

    const [leftRef, leftVisible] = useReveal<HTMLDivElement>();
    const [rightRef, rightVisible] = useReveal<HTMLDivElement>(0.08);
    const [statsRef, statsVisible] = useReveal<HTMLDivElement>(0.06);

    const ctaHref = route(copy.ctaRoute);

    const heroImgProps = copy.heroSrcSet
        ? { srcSet: copy.heroSrcSet, sizes: copy.heroSizes ?? '(max-width: 1350px) 100vw, 1350px' }
        : {};

    const isWillVariant = variant === 'will';

    return (
        <section className={isWillVariant ? 'bg-primary-50 py-8 md:py-12 text-white' : 'bg-primary-700 py-12 text-white'}>
            <div className={fullWidth ? 'w-full px-4 md:px-6 lg:px-8 container mx-auto' : 'container mx-auto max-w-8xl px-4 md:px-6 lg:px-8'}>
                <div className={isWillVariant ? 'rounded-3xl bg-primary-700 p-3 md:p-6' : ''}>
                    <div className="flex flex-col gap-4 lg:flex-row">
                        <div className="mb-4 w-full lg:mb-0 lg:w-[58.333%]">
                            <div
                                ref={leftRef}
                                className="h-full rounded-3xl  px-4 pb-6 pt-2 md:rounded-3xl md:pl-0 md:pr-2 md:pt-12 "
                            >
                                <RevealMotion show={leftVisible} mode="fade-up" delayClass="delay-100">
                                    <GoogleRatingBadge
                                        rating={displayRating}
                                        reviewCount={reviewCount}
                                        writeReviewUrl={writeReviewUrl}
                                    />
                                </RevealMotion>

                                <RevealMotion show={leftVisible} mode="fade-up" delayClass="delay-200">
                                    <h1 className="mb-3 mt-0 pt-3 text-2xl font-semibold leading-tight text-white text-balance sm:text-3xl md:text-4xl">
                                        {copy.h1}
                                    </h1>
                                </RevealMotion>

                                <RevealMotion show={leftVisible} mode="fade-up" delayClass="delay-300">
                                    <h2 className="mb-0 mt-3 text-base font-light leading-8 text-white sm:text-xl">{copy.h2}</h2>
                                </RevealMotion>

                                {copy.bodyParagraphs.map((text, i) => (
                                    <RevealMotion
                                        key={i}
                                        show={leftVisible}
                                        mode="fade-up"
                                        delayClass={paragraphStaggerClass(i)}
                                    >
                                        <p className={bodyParagraphClass(i, copy.bodyParagraphs.length)}>{text}</p>
                                    </RevealMotion>
                                ))}

                                <RevealMotion show={leftVisible} mode="scale-up" delayClass="delay-700" className="mt-4 mb-8 lg:hidden">
                                    <Link href={ctaHref} className={`${heroCtaClassName} w-full sm:w-auto`}>
                                        {copy.ctaLabel}
                                    </Link>
                                </RevealMotion>
                            </div>
                        </div>

                        <div className="w-full lg:w-[41.667%]">
                            <div ref={rightRef} className="px-4 pb-1">
                                <RevealMotion show={rightVisible} mode="fade-right" delayClass="delay-200">
                                    <>
                                        <img
                                            width={variant === 'lpa' ? 1350 : 1200}
                                            height={variant === 'lpa' ? 970 : 800}
                                            src={copy.heroImage}
                                            alt={copy.imageAlt}
                                            className="hidden w-full rounded-3xl object-cover lg:block"
                                            decoding="async"
                                            {...(variant === 'lpa' ? { fetchPriority: 'high' as const } : {})}
                                            {...heroImgProps}
                                        />
                                        <img
                                            width={variant === 'lpa' ? 1350 : 1200}
                                            height={variant === 'lpa' ? 970 : 800}
                                            src={copy.heroImage}
                                            alt={copy.imageAlt}
                                            className="w-full rounded-2xl object-cover lg:hidden"
                                            decoding="async"
                                            {...heroImgProps}
                                        />
                                    </>
                                </RevealMotion>
                                <RevealMotion show={rightVisible} mode="scale-up" delayClass="delay-500" className="mt-4 hidden text-center lg:block">
                                    <Link href={ctaHref} className={heroCtaClassName}>
                                        {copy.ctaLabel}
                                    </Link>
                                </RevealMotion>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={statsRef}
                        className="grid grid-cols-2 gap-0 px-3 pb-4 pt-10 lg:grid-cols-4 lg:px-0"
                    >
                        {copy.stats.map((block, index) => (
                            <RevealMotion
                                key={`${variant}-${block.value}-${index}`}
                                show={statsVisible}
                                mode="fade-up"
                                delayClass={revealStagger(index)}
                                className={index < 3 ? 'lg:border-e lg:border-white/20 lg:pe-2' : ''}
                            >
                                <div>
                                    <div className="px-2">
                                        <h3 className="text-3xl font-medium text-white sm:text-4xl">{block.value}</h3>
                                        <h5 className="mb-2 min-h-16 pb-2 text-base font-medium leading-snug text-white sm:text-xl">{block.title}</h5>
                                    </div>
                                    <div className="mt-3 mb-4 min-h-80 space-y-2 rounded-2xl border border-white/10 bg-primary-50/15 p-3 text-sm font-light text-primary-50 md:mb-0">
                                        <p className="border-l-4 border-secondary pl-3 text-lg font-normal leading-7 text-white">
                                            {block.lead}
                                        </p>
                                        {block.paragraphs.map((p, i) => (
                                            <p key={`${block.value}-${i}`} className="leading-relaxed">
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </RevealMotion>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
