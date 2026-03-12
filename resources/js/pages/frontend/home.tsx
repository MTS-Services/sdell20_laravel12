import React from 'react';

import Banner from '@/components/frontend/home/banner';
import { CTASection } from '@/components/frontend/home/cta-section';
import { DashboardPreviewSection } from '@/components/frontend/home/dashboard-preview-section';
import { EstateApproachSection } from '@/components/frontend/home/estate-approach-section';
import { FindingSupportSection } from '@/components/frontend/home/finding-support-section';
import { HowItWorksSection } from '@/components/frontend/home/how-it-works-section';
import { LoveOnesSection } from '@/components/frontend/home/love-ones-section';
import { ManagingAffairsSection } from '@/components/frontend/home/managing-affairs-section';
import { WhyCreateWillCardsGrid } from '@/components/frontend/home/why-create-will-cards-grid';
import { WhyCreateWillSection } from '@/components/frontend/home/why-create-will-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head>
                <title>Online Will Writing Service</title>
                <meta name="title" content="Online Will Writing Service" />
                <meta name="description" content="Write your will online with our step-by-step tool. Checked by a will specialist. Great for simple wills and estates." />
                <meta name="keywords" content="will, online will, will writing, estate planning, inheritance, legal documents" />
            </Head>
            <FrontendLayout>
                <Banner />
                {/* <CTASection /> */}
                <WhyCreateWillSection />
                <WhyCreateWillCardsGrid />
                <HowItWorksSection />
                {/* <DashboardPreviewSection /> */}
                <EstateApproachSection />
                <FindingSupportSection />
                <ManagingAffairsSection />
                <LoveOnesSection />

            </FrontendLayout>

        </>
    );
}
