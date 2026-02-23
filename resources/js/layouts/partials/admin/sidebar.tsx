import React from 'react';

import { Link, usePage } from '@inertiajs/react';
import { BarChart3, CalendarClock, ChevronDown, MessageSquare, ShieldCheck, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type SharedData } from '@/types';

type SidebarSharedData = SharedData & {
    currentFilter?: string | null;
};

interface NavLink {
    label: string;
    description?: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    badge?: string;
    patterns?: string[];
}

interface NavSection {
    title: string;
    links: NavLink[];
}

const matchRoute = (current: string | null, patterns?: string[]): boolean => {
    if (!current || !patterns) {
        return false;
    }

    return patterns.some((pattern) =>
        pattern.endsWith('*') ? current.startsWith(pattern.slice(0, -1)) : current === pattern
    );
};

export function AdminSidebar(): React.ReactElement {
    const { props, component } = usePage<SidebarSharedData>();
    const currentRoute = route().current();
    const authUser = props.auth?.user;
    const pageSlug = component;
    const currentFilter = props.currentFilter ?? null;

    const sections: NavSection[] = [
        {
            title: 'Overview',
            links: [
                {
                    label: 'Dashboard',
                    description: 'Mission control',
                    href: route('admin.dashboard'),
                    icon: BarChart3,
                    patterns: ['admin.dashboard'],
                },
            ],
        },
        {
            title: 'Messaging',
            links: [
                {
                    label: 'Bulk SMS',
                    description: 'Broadcast sends & uploads',
                    href: route('admin.bulk-sms.index'),
                    icon: MessageSquare,
                    patterns: ['admin.bulk-sms.*', 'admin.bulk-sms.index', 'admin.bulk-sms.create'],
                },
                {
                    label: 'Campaigns',
                    description: 'One-off & recurring flows',
                    href: route('admin.campaigns.index'),
                    icon: CalendarClock,
                    patterns: ['admin.campaigns.*', 'admin.campaigns.index', 'admin.campaigns.create'],
                },
            ],
        },
    ];

    const userMenuOpen = React.useMemo(() => pageSlug?.includes('Admin/Users'), [pageSlug]);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(userMenuOpen);

    React.useEffect(() => {
        setIsUserMenuOpen(userMenuOpen);
    }, [userMenuOpen]);

    return (
        <aside className="hidden h-[83.5vh] w-67.5 flex-col overflow-hidden border-r border-white/50 bg-white/80 text-sm shadow-[0_25px_80px_-45px_rgba(15,24,46,0.4)] backdrop-blur-xl lg:flex">

            <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">
                {sections.map((section) => (
                    <div key={section.title} className="mb-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-muted-foreground/80">
                            {section.title}
                        </p>
                        <div className="mt-3 space-y-2">
                            {section.links.map((link) => {
                                const active = matchRoute(currentRoute, link.patterns);
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={cn(
                                            'flex items-start gap-3 rounded-2xl border px-4 py-2 text-sm transition-all',
                                            'border-transparent bg-white/60 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white',
                                            active && 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/20'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-600',
                                                active && 'bg-primary text-white'
                                            )}
                                        >
                                            <link.icon className="h-4 w-4" />
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">{link.label}</span>
                                                {link.badge && (
                                                    <span className="rounded-full bg-primary/10 px-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-600">
                                                        {link.badge}
                                                    </span>
                                                )}
                                            </div>
                                            {link.description && (
                                                <p className="text-xs text-muted-foreground">{link.description}</p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="mb-8">
                    <button
                        type="button"
                        className={cn(
                            'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold',
                            'border-white/60 bg-white/70 text-slate-900 hover:border-primary/40',
                            pageSlug?.includes('Admin/Users') && 'border-primary/60 bg-primary/5 text-primary-700 shadow-sm'
                        )}
                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    >
                        <span>User Management</span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-primary-600 transition-transform',
                                isUserMenuOpen ? 'rotate-180' : 'rotate-0'
                            )}
                        />
                    </button>
                    {isUserMenuOpen && (
                        <div className="mt-3 space-y-2 pl-2">
                            {[
                                {
                                    label: 'Admins',
                                    href: route('admin.users.index', { role: 'admin' }),
                                    description: 'Only administrators',
                                    icon: ShieldCheck,
                                    role: 'admin',
                                },
                                {
                                    label: 'Users',
                                    href: route('admin.users.index', { role: 'user' }),
                                    description: 'Customers & staff',
                                    icon: Users,
                                    role: 'user',
                                },
                            ].map((item) => {
                                const active = pageSlug?.includes('Admin/Users') && currentFilter === item.role;
                                return (
                                    <Link
                                        key={item.role}
                                        href={item.href}
                                        className={cn(
                                            'flex items-start gap-3 rounded-2xl border px-4 py-2 text-sm transition-all',
                                            'border-transparent bg-white/60 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white',
                                            active && 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/20'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-600',
                                                active && 'bg-primary text-white'
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">{item.label}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            <div className="border-t border-white/60 px-5 py-5">
                <div className="rounded-3xl border border-white/70 bg-primary/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Signed in</p>
                    <p className="mt-1 text-sm font-semibold text-primary-700">{authUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{authUser?.email}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{authUser?.is_admin ? 'Admin controls enabled' : 'User mode'}</span>
                        <Link href="mailto:ops@sms.local" className="font-semibold text-primary-600 hover:underline">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

AdminSidebar.displayName = 'AdminSidebar';