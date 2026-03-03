import { Link, router, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { dashboard } from '@/routes';
import { type SharedData } from '@/types';

interface UserHeaderProps {
    showProfileMenu?: boolean;
}

export function UserHeader({ showProfileMenu = true }: UserHeaderProps) {
    const { auth } = usePage<SharedData>().props;

    const handleLogout = (): void => {
        router.post(route('logout'));
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Top Announcement Banner */}
            <div className="bg-slate-500 py-2 text-center">
                <p className="px-4 font-serif tracking-wide text-white text-base lg:text-xl">
                    <span>
                        Trusted by families across England &amp; Wales. Complete your LPA in as little as 15 minutes.
                    </span>
                </p>
            </div>

            {/* Main Navigation */}
            <nav className="w-full bg-primary-700">
                <div className="mx-auto flex container items-center justify-between px-4 lg:px-6">
                    {/* Logo */}
                    <Link href={route('dashboard.user')} className="flex shrink-0 items-center py-3">
                        <AppLogo className="h-20 sm:h-24" />
                    </Link>

                    {showProfileMenu ? (
                        <>
                            <div className='hidden md:flex items-center gap-4'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 text-white hover:bg-white/10 hover:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0">
                                            <UserInfo user={auth.user} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 p-2 shadow-sm border-none" align="end" sideOffset={8}>
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className='md:hidden'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-md text-white hover:bg-white/10 transition-all">
                                            <Menu className="size-6" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 p-2 shadow-sm border-none" align="end" sideOffset={8}>
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    ) : (
                        <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={handleLogout}>
                            Log out
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
}
