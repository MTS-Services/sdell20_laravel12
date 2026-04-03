import BlogCard from '@/components/ui/blog-card';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';
import { Star } from 'lucide-react';

export default function BlogDetails() {
    return (
        <>
            <Head>
                <title>Blog Details</title>
                <meta name="title" content="Blog Details" />
                <meta name="description" content="Blog Details" />
                <meta name="keywords" content="Blog Details" />
            </Head>
            <FrontendLayout>
                <main className="bg-white">
                    <section className="bg-[#f8f6f0]">
                        <div className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
                            <div className="flex items-start gap-10">
                                <div className="w-full lg:w-2/2">
                                    <div className="mb-10">
                                        <h2 className="text-5xl font-normal text-primary-600">
                                            Martin Lewis on Power of Attorney:
                                            Why It Can Matter More Than a Will
                                        </h2>
                                        <p className="mt-2 text-lg text-gray-600">
                                            02nd March 2026
                                        </p>
                                    </div>
                                    <div className="">
                                        <img
                                            src="/assets/images/blog/POAO_img34-1536x806.jpg"
                                            alt="Blog Image"
                                            className="h-auto w-full"
                                        />
                                    </div>
                                    <div className="mt-10">
                                        <p className="text-lg text-gray-600">
                                            Martin Lewis on Power of Attorney is
                                            a topic that often surprises people.
                                            The well known money expert Martin
                                            Lewis has repeatedly stressed that,
                                            for many families, setting up a
                                            lasting power of attorney can be
                                            even more urgent than writing a
                                            will. That is not because wills are
                                            unimportant. It is because a power
                                            of attorney protects you while you
                                            are alive. Understanding why this
                                            matters can change how you
                                            prioritise your planning. Why Does
                                            Martin Lewis Say a Power of Attorney
                                            Can Be More Crucial Than a Will? A
                                            will only takes effect after death.
                                            A lasting power of attorney works
                                            during your lifetime. If you lose
                                            mental capacity through illness,
                                            accident or dementia, no one
                                            automatically has the legal right to
                                            manage your finances or make
                                            decisions about your care. Not your
                                            spouse. Not your children. Without
                                            an LPA, your family must apply to
                                            the Court of Protection for a
                                            deputyship order. That process can
                                            be slow, costly and stressful. This
                                            is the gap Martin Lewis highlights.
                                            A will cannot help if you are still
                                            alive but unable to make decisions.
                                            What Problems Can Happen Without a
                                            Lasting Power of Attorney? If there
                                            is no registered LPA in place, banks
                                            may freeze accounts. Bills can go
                                            unpaid. Property sales can be
                                            delayed. Care decisions can be
                                            harder to organise. Even joint
                                            accounts do not guarantee full
                                            access. Families are often shocked
                                            to discover how limited their
                                            authority is. The financial and
                                            emotional strain can be significant
                                            at an already difficult time. How Is
                                            a Lasting Power of Attorney
                                            Different From a Will? A will deals
                                            with your estate after death. A
                                            lasting power of attorney covers
                                            decisions while you are alive but
                                            lack mental capacity. There are two
                                            types of LPA in England and Wales:
                                            Property and Financial Affairs LPA
                                            Health and Welfare LPA Together,
                                            they protect both your money and
                                            your personal wellbeing. A will and
                                            an LPA do different jobs. They are
                                            not alternatives. They are
                                            complementary. Is a Power of
                                            Attorney Only for Older People? No.
                                            Loss of capacity can happen at any
                                            age. Serious accidents, strokes or
                                            unexpected illness can affect
                                            younger adults too. That is why
                                            Martin Lewis often says it is not
                                            just about later life planning. It
                                            is about being prepared. Many people
                                            sort out insurance and pensions but
                                            delay making an LPA. Yet an LPA can
                                            be just as important. Why Do So Many
                                            People Delay Setting Up an LPA? Some
                                            believe their spouse can
                                            automatically step in. Others think
                                            it is complicated or expensive. In
                                            reality, applying for a lasting
                                            power of attorney online is
                                            straightforward when you understand
                                            the process. The key is getting the
                                            details right and registering it
                                            with the Office of the Public
                                            Guardian. Once registered, it sits
                                            there quietly, ready if ever needed.
                                            What Is the Takeaway From Martin
                                            Lewis’ Advice? The core message is
                                            simple. A will protects your wishes
                                            after death. A lasting power of
                                            attorney protects your control
                                            during life. For many families, the
                                            financial and practical consequences
                                            of not having an LPA can be felt
                                            immediately. That is why it is often
                                            described as more urgent. If you are
                                            planning responsibly, you should
                                            strongly consider both. Sorting out
                                            a power of attorney using a service
                                            like Power of Attorney Online is not
                                            about fear. It is about making sure
                                            the people you trust can act quickly
                                            and legally if life takes an
                                            unexpected turn.
                                        </p>
                                    </div>
                                </div>
                                <div className="sticky top-60 mt-8 w-full lg:w-1/2">
                                    <div className="rounded-2xl bg-primary-700 p-8 text-white">
                                        <div className="mb-6">
                                            <div className="mb-2 flex items-center gap-2">
                                                <img
                                                    src="/assets/images/blog/google.png"
                                                    alt="Google"
                                                    className="h-20 w-20 object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm">
                                                        Google Rating
                                                    </p>
                                                    <div className="flex items-center gap-0.5">
                                                        <span className="text-base font-bold">
                                                            4.4
                                                        </span>
                                                        <div className="flex">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h2 className="mb-6 text-xl font-normal">
                                            Get your Lasting Power of Attorney
                                            sorted for{' '}
                                            <span className="font-bold">
                                                £99 per document
                                            </span>
                                        </h2>

                                        <ul className="mb-8 space-y-3">
                                            <li className="flex items-start gap-3">
                                                <svg
                                                    className="mt-1 h-5 w-5 shrink-0 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    Fixed fee guarantee
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg
                                                    className="mt-1 h-5 w-5 shrink-0 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    Expert legal support
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg
                                                    className="mt-1 h-5 w-5 shrink-0 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    Simple online process
                                                </span>
                                            </li>
                                        </ul>

                                        <button className="w-full rounded-full bg-slate-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-600">
                                            Create your LPA now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
                        <div className="mt-5">
                            <h2 className="mb-6 text-2xl font-bold text-slate-900">
                                Recent blog articles
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            <BlogCard />
                            <BlogCard />
                            <BlogCard />
                            <BlogCard />
                        </div>
                    </section>
                </main>
            </FrontendLayout>
        </>
    );
}
