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
import { WillChoiceSection } from '@/components/frontend/home/will-choice-section';
import Feedback from '@/components/feedback';
import { SeoHead } from '@/components/seo-head';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Home() {
    return (
        <>
            <SeoHead
                fallbackTitle="Online Will Writing Service"
                fallbackDescription="Write your will online with our step-by-step tool. Checked by a will specialist. Great for simple wills and estates."
                fallbackKeywords="will, online will, will writing, estate planning, inheritance, legal documents"
            />
            <FrontendLayout>
                <Banner />
                {/* <CTASection /> */}
                <WillChoiceSection />
                <WhyCreateWillSection />
                <WhyCreateWillCardsGrid />
                <HowItWorksSection />
                {/* <DashboardPreviewSection /> */}
                <EstateApproachSection />
                <FindingSupportSection />
                <ManagingAffairsSection />
                <LoveOnesSection />
                <section>
                    <Feedback />
                </section>

            </FrontendLayout>

        </>
    );
}
