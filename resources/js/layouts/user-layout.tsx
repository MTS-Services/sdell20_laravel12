import * as React from 'react';
import { type ReactNode } from 'react';

import { Toaster } from "@/components/ui/sonner"
import { type BreadcrumbItem } from '@/types';
import { UserHeader } from '@/layouts/partials/user/header';
import { UserFooter } from '@/layouts/partials/user/footer';

interface UserLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function UserLayout({ children }: UserLayoutProps) {

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <UserHeader />
            <main className="flex-1">{children}</main>
            <UserFooter />
            <Toaster position="top-right" richColors />
        </div>
    );
}
