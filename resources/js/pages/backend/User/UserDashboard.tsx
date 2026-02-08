import { ArrowRight, BookOpenText, FileEdit, LifeBuoy, ScrollText } from 'lucide-react';

import UserLayout from '@/layouts/user-layout';
import { type User } from '@/types';

interface Props {
    user: User;
}

const dashboardActions = [
    {
        title: 'Continue your Power of Attorney',
        icon: ScrollText,
    },
    {
        title: 'Start your Will',
        icon: FileEdit,
    },
    {
        title: 'Power of Attorney',
        icon: BookOpenText,
    },
    {
        title: 'Help',
        icon: LifeBuoy,
    },
];

export default function UserDashboard({ user }: Props) {
    return (
        <UserLayout>
            <div className="bg-slate-50 py-10">
                <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
                    <section className="space-y-6">
                        <div>
                            <p className="text-lg font-semibold text-slate-700">Welcome <span className="text-primary-500">{user.name}</span></p>
                            <div className="mt-2 h-1 w-16 rounded-full bg-primary-400" />
                        </div>

                        <div className="space-y-4">
                            {dashboardActions.map((action) => (
                                <button
                                    key={action.title}
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4 text-left text-slate-700 shadow-sm transition hover:border-primary-200 hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-500">
                                            <action.icon className="h-5 w-5" />
                                        </span>
                                        <div className="text-base font-semibold text-slate-800">{action.title}</div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="">
                        <div className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-6">
                            <img
                                src="https://online.zenco.com/images/family1.png"
                                alt="Family illustration"
                                className="h-45 w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                        <p className="text-xl font-semibold text-slate-800">You&apos;re getting close...</p>
                        <p className="mt-2 text-sm text-slate-600">
                            You&apos;re close to getting your Lasting Power of Attorney in place, finish it now and get peace of mind.
                        </p>



                        <div className="mt-6">
                            <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-primary-500">
                                Need help?
                                <span>&#9662;</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </UserLayout>
    );
}
