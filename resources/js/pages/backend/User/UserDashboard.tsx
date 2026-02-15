import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, BookOpenText, CalendarDays, FileEdit, LifeBuoy, Mail, Phone, ScrollText } from 'lucide-react';

import UserLayout from '@/layouts/user-layout';
import { type User } from '@/types';

interface Props {
    user: User;
}

const dashboardActions = [
    {
        id: 'continue-lpa',
        title: 'Continue your Power of Attorney',
        icon: ScrollText,
    },
    {
        id: 'start-will',
        title: 'Start your Will',
        icon: FileEdit,
    },
    {
        id: 'help',
        title: 'Help',
        icon: LifeBuoy,
    },
];

export default function UserDashboard({ user }: Props) {
    const [helpOpen, setHelpOpen] = useState(false);

    const handleActionClick = (actionId: string) => {
        if (actionId === 'continue-lpa') {
            router.visit('/dashboard/lpa/create');
            return;
        }

        if (actionId === 'help') {
            setHelpOpen(true);
        }
    };

    return (
        <UserLayout>
            <div className="bg-slate-50 py-8 sm:py-10">
                <div className="container mx-auto grid max-w-6xl gap-8 lg:gap-10 px-4 sm:px-6 lg:grid-cols-2">
                    <section className="space-y-6">
                        <div>
                            <p className="text-lg font-semibold text-primary-700">Welcome <span className="text-primary-500">{user.name}</span></p>
                            <div className="mt-2 h-1 w-16 rounded-full bg-primary-400" />
                        </div>

                        <div className="space-y-4">
                            {dashboardActions.map((action) => (
                                <button
                                    key={action.title}
                                    type="button"
                                    className="flex w-full flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-6 text-left text-primary-700 shadow-lg transition hover:bg-primary-50 "
                                    onClick={() => handleActionClick(action.id)}
                                >
                                    <div className="flex flex-1 min-w-0 items-center gap-4">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-500">
                                            <action.icon className="h-5 w-5" />
                                        </span>
                                        <div className="text-base lg:text-xl font-semibold text-primary-800 wrap-break-word">{action.title}</div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-primary-400" />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="">
                        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-6">
                            <img
                                src="https://online.zenco.com/images/family1.png"
                                alt="Family illustration"
                                className="h-55 w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                        <p className="text-xl font-semibold text-primary-800">You&apos;re getting close...</p>
                        <p className="mt-2 text-sm text-primary-600">
                            You&apos;re close to getting your Lasting Power of Attorney in place, finish it now and get peace of mind.
                        </p>



                        <div className="mt-6 rounded-lg border border-slate-200 bg-white">
                            <button
                                type="button"
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-primary-500"
                                onClick={() => setHelpOpen((prev) => !prev)}
                                aria-expanded={helpOpen}
                            >
                                NEED HELP?
                                <span className={`text-primary-500 transition-transform ${helpOpen ? 'rotate-180' : ''}`}>
                                    &#9650;
                                </span>
                            </button>
                            <div
                                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${helpOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className={`border-t border-slate-200 px-5 py-6 text-sm text-primary-600 transition-all duration-500 ${helpOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="text-primary-500"><Phone className="h-5 w-5" /></span>
                                            <div>
                                                <p className="font-semibold text-primary-700">Call us</p>
                                                <a href="tel:08008886508" className="text-primary-500 underline">
                                                    0800 888 6508
                                                </a>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-start gap-3">
                                            <span className="text-primary-500"><CalendarDays className="h-5 w-5" /></span>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-primary-700">Opening hours</p>
                                                {[
                                                    ['Monday', '8:00am - 5:30pm'],
                                                    ['Tuesday', '8:00am - 5:30pm'],
                                                    ['Wednesday', '8:00am - 5:30pm'],
                                                    ['Thursday', '8:00am - 5:30pm'],
                                                    ['Friday', '8:00am - 5:00pm'],
                                                    ['Weekends', 'CLOSED'],
                                                ].map(([day, hours]) => (
                                                    <div key={day} className="flex justify-between gap-6 text-primary-600">
                                                        <span>{day}</span>
                                                        <span className="font-medium text-primary-800">{hours}</span>
                                                    </div>
                                                ))}
                                                <p className="pt-2 text-xs text-primary-500">(Bank holiday hours might differ)</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-start gap-3">
                                            <span className="text-primary-500"><Mail className="h-5 w-5" /></span>
                                            <div>
                                                <p className="font-semibold text-primary-700">Email us</p>
                                                <a href="mailto:enquiries@zenco.com" className="text-primary-500 underline">
                                                    enquiries@zenco.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </UserLayout>
    );
}
