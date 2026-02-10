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

export default function Home() {
    return (
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
    );
}
