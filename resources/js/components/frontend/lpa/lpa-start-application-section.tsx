import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    HeartHandshake,
    ScanEye,
    Scroll,
    UserCheck,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

const readyItems: { title: string; icon: LucideIcon }[] = [
    { title: 'You (the Donor)', icon: UserCheck },
    { title: 'Your Attorney(s) & Replacement Attorney(s)', icon: HeartHandshake },
    { title: 'Your Certificate Provider', icon: Scroll },
    { title: 'Any Witnesses', icon: ScanEye },
];

export function CreateLpaCta({
    className,
    children = 'Create Your LPA Now',
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <Link
            href={route('lpa.start')}
            className={cn(
                'group inline-flex items-center gap-3 rounded-full bg-blue-600 py-2.5 pl-6 pr-2 text-sm font-bold tracking-wide text-white transition-all hover:bg-blue-700 hover:shadow-lg md:text-base',
                className,
            )}
        >
            {children}
            <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30 md:h-9 md:w-9"
                aria-hidden
            >
                <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5 md:h-5 md:w-5" strokeWidth={2.5} />
            </span>
        </Link>
    );
}

export function LpaStartApplicationSection() {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-10">
            <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-primary-900/40">
                <div className="bg-primary-700">
                    <div className="px-5 pb-10 pt-10 sm:px-8 md:px-12 md:pb-12 md:pt-12">
                        <div className="mb-10 text-center md:mb-12">
                            <h1 className="font-montserrat text-3xl  tracking-tight text-white md:text-4xl lg:text-5xl">
                                Be Ready Before You Begin
                            </h1>
                            <p className="mx-auto mt-4 max-w-5xl text-base sm:text-lg xl:text-xl leading-relaxed text-primary-100">
                                To keep things smooth and stress-free, before you start your LPA, have this information ready:
                            </p>
                            <div className="mt-8 flex justify-center">
                                <CreateLpaCta />
                            </div>
                        </div>

                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
                            <div className="lg:pr-8 xl:pr-14">
                                <p className="mb-4 text-lg  leading-snug text-white md:text-xl">
                                    Full legal names, dates of birth &amp; postal addresses for:
                                </p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:gap-5">
                                    {readyItems.map(({ title, icon: Icon }) => (
                                        <div
                                            key={title}
                                            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-primary-50/10 p-5 md:p-6"
                                        >
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-primary-800/90 text-white">
                                                <Icon className="h-6 w-6" strokeWidth={1.65} />
                                            </span>
                                            <p className="font-montserrat text-base font-bold leading-snug text-white md:text-lg">
                                                {title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:border-l lg:border-slate-400/35 lg:pl-8 xl:pl-14">
                                <p className="mb-5 text-lg  leading-snug text-white md:text-xl">
                                    There are two separate costs when creating a Lasting Power of Attorney.
                                </p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                                    <div className="rounded-xl border border-primary-600/60 bg-primary-50/20 p-5 md:p-6">
                                        <p className="text-base font-bold leading-snug text-white md:text-lg">
                                            Power of Attorney Online service fee
                                        </p>
                                        <p className="mt-4 text-sm leading-relaxed text-primary-100 md:text-base">
                                            This is the £99 payment per LPA application you make today for us to prepare your LPA
                                            documents and guide you through the process.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-primary-600/60 bg-primary-50/20 p-5 md:p-6">
                                        <p className="text-base font-bold leading-snug text-white md:text-lg">
                                            £92 registration fee per LPA
                                        </p>
                                        <p className="mt-4 text-sm leading-relaxed text-primary-100 md:text-base">
                                            This is a government fee paid directly to the Office of the Public Guardian when you send
                                            your forms for registration.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 rounded-xl border border-primary-600/60 bg-primary-50/20 px-5 py-4 text-center text-sm leading-relaxed text-primary-100 md:mt-5 md:px-6 md:py-5 md:text-base">
                                    You can pay the OPG fee by including a cheque with your forms or by card when they contact you
                                    after receiving your application.
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-primary-600/40 pt-10 text-center md:mt-12 md:pt-12">
                            <p className="text-base text-primary-100 md:text-lg">
                                Your preferences &amp; instructions are recommended but optional.
                            </p>
                            <p className="mt-2 text-base font-semibold text-white md:text-lg">
                                We guide you every step and you can pause and come back anytime.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <CreateLpaCta />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
