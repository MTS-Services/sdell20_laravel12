import * as React from 'react';

import { AdminPageHeader, type AdminPageHeaderProps } from '@/components/admin-page-header';
import { AdminHeader } from '@/layouts/partials/admin/header';
import { AdminSidebar } from '@/layouts/partials/admin/sidebar';

import { AdminFooter } from './partials/admin/footer';

interface AdminLayoutProps {
    children: React.ReactNode;
    pageHeader?: AdminPageHeaderProps;
    headerContainerClassName?: string;
}

export default function AdminLayout({ children, pageHeader, headerContainerClassName = 'mx-auto container px-4 py-6' }: AdminLayoutProps) {
    return (
        <div className="flex  flex-col bg-linear-to-tr from-[#fff9f5] via-white to-[#fef1ea] text-slate-900">
            <AdminHeader />
            <div className="flex flex-1 ">
                <AdminSidebar />
                <main className="flex-1 bg-transparent h-[89vh] overflow-y-auto">
                    {pageHeader && (
                        <div className={headerContainerClassName}>
                            <AdminPageHeader {...pageHeader} />
                        </div>
                    )}
                    {children}
                </main>
            </div>
            {/* <AdminFooter /> */}
        </div>
    );
}
