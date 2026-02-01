import Banner from '@/components/frontend/home/banner';
import FrontendLayout from '@/layouts/frontend-layout';
import React from 'react'

export default function home() {
    return <FrontendLayout>
        <section >
            <Banner />
        </section>
    </FrontendLayout>;
}
