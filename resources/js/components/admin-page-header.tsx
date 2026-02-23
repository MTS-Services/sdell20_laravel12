import React from 'react';

import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Menu } from 'lucide-react';

import { type SharedData } from '@/types';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export function AdminPageHeader({ title, subtitle, breadcrumbs = [] }: AdminPageHeaderProps): React.ReactElement {
    const { props } = usePage<SharedData>();
    const currentUser = props.auth?.user;
    const avatarInitials = currentUser?.name?.slice(0, 2).toUpperCase() ?? 'AD';

    return (
        <div className="rounded-4xl border border-[#f4d9c8] bg-[#fff8f4] px-6 py-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    {/* <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f4ccb4] bg-white text-[#c4683f] shadow-inner"
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button> */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                        <p className="text-sm text-muted-foreground">
                            {subtitle ?? "Here's what's happening this morning"}
                        </p>
                    </div>
                </div>
                {/* <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/80 px-4 py-2 text-right">
                        <p className="text-xs font-medium text-muted-foreground">Signed in</p>
                        <p className="text-sm font-semibold text-slate-900">{currentUser?.name ?? 'Admin'}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f4ccb4] bg-white text-sm font-semibold text-slate-900">
                        {avatarInitials}
                    </div>
                </div> */}
            </div>
            {breadcrumbs.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#c4683f]">
                    {breadcrumbs.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="flex items-center gap-1">
                            {item.href ? (
                                <Link href={item.href} className="text-[#bc5f3c] hover:text-[#a74c2c]">
                                    {item.label}
                                </Link>
                            ) : (
                                <span>{item.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

AdminPageHeader.displayName = 'AdminPageHeader';
