import * as React from 'react';

import { AdminHeader } from '@/layouts/partials/admin/header';
import { AdminSidebar } from '@/layouts/partials/admin/sidebar';

import { AdminFooter } from './partials/admin/footer';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex  flex-col bg-linear-to-tr from-[#fff9f5] via-white to-[#fef1ea] text-slate-900">
            <AdminHeader />
            <div className="flex flex-1 ">
                <AdminSidebar />
                <main className="flex-1 bg-transparent h-[83.5vh] overflow-y-auto">{children}</main>
            </div>
            <AdminFooter />
        </div>
    );
}
