import React from 'react';

import { WillWritingAboutSection } from '@/components/frontend/will-writing/will-writing-about-section';
import { WillWritingCalloutsSection } from '@/components/frontend/will-writing/will-writing-callouts-section';
import { WillWritingHeroSection } from '@/components/frontend/will-writing/will-writing-hero-section';
import { WillWritingProtectedSection } from '@/components/frontend/will-writing/will-writing-protected-section';
import { WillWritingPricingSection } from '@/components/frontend/will-writing/will-writing-pricing-section';
import { WillWritingProcessSection } from '@/components/frontend/will-writing/will-writing-process-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { TeamSection } from '@/components/frontend/horizon-wills/team-section';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';

export default function WillWriting() {
    return (
        <FrontendLayout>
            <main className="bg-primary-50">
                <WillWritingHeroSection />
                {/* <WillWritingProtectedSection /> */}
                <WillWritingPricingSection />
                <WillWritingProcessSection />
                <LpaFaqSection />
                <WillWritingCalloutsSection />
                <WillWritingAboutSection />
                <TeamSection />
            </main>
        </FrontendLayout>
    );
}