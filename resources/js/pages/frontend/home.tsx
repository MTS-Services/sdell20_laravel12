import Banner from '@/components/frontend/home/banner';
import { CTASection } from '@/components/frontend/home/cta-section';
import { DashboardPreviewSection } from '@/components/frontend/home/dashboard-preview-section';
import { FindingSupportSection } from '@/components/frontend/home/finding-support-section';
import { HowItWorksSection } from '@/components/frontend/home/how-it-works-section';
import { LoveOnesSection } from '@/components/frontend/home/love-ones-section';
import { ManagingAffairsSection } from '@/components/frontend/home/managing-affairs-section';
import { WhyCreateWillSection } from '@/components/frontend/home/why-create-will-section';
import FrontendLayout from '@/layouts/frontend-layout';
import React from 'react';

export default function Home() {
    return (
        <FrontendLayout>
            <Banner />
            <WhyCreateWillSection />
            <HowItWorksSection />
            <DashboardPreviewSection />
            <ManagingAffairsSection />
            <LoveOnesSection />
            <FindingSupportSection />
            <CTASection />
        </FrontendLayout>
    );
}
