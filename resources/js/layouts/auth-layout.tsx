import { Head, Link } from '@inertiajs/react';
import * as React from 'react';

import { login } from '@/routes';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    showHeader?: boolean;
    showFooter?: boolean;
}

export default function AuthLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-400 text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/40 blur-[150px]" />
                <div className="absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-cyan-500/30 blur-[170px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(300deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '120px 120px' }} />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <main className="relative w-full max-w-6xl overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                    <Head title={title} />

                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-fuchsia-400 to-amber-300" />

                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl bg-white/5 p-8 text-white">
                            <div className="mt-10 space-y-5">
                                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{title ? 'Welcome back' : 'Secure access'}</p>
                                <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                                    {title || 'Availability Scheduler'}
                                </h1>
                                <p className="text-base text-white/80">
                                    {description || 'Sign in to manage shifts, authorize requests, and keep your team coordinated from any device.'}
                                </p>
                            </div>

                            <div className="mt-10 grid gap-5 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-3xl font-semibold">24/7</p>
                                    <p className="text-sm text-white/70">Scheduling visibility</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-3xl font-semibold">99.9%</p>
                                    <p className="text-sm text-white/70">Platform uptime</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-8 shadow-xl">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}