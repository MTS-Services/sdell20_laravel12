import React from 'react';

import { WillWritingAboutSection } from '@/components/frontend/will-writing/will-writing-about-section';
import { WillWritingCalloutsSection } from '@/components/frontend/will-writing/will-writing-callouts-section';
import { WillWritingFaqSection } from '@/components/frontend/will-writing/will-writing-faq-section';
import { WillWritingHeroSection } from '@/components/frontend/will-writing/will-writing-hero-section';
import { WillWritingPricingSection } from '@/components/frontend/will-writing/will-writing-pricing-section';
import { WillWritingProcessSection } from '@/components/frontend/will-writing/will-writing-process-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { QuoteSection } from '@/components/frontend/horizon-wills/team-section';

export default function WillWriting() {
    return (
        <FrontendLayout>
            <main className="bg-primary-50">
                <WillWritingHeroSection />
                <WillWritingPricingSection />
                <WillWritingProcessSection />
                <WillWritingFaqSection />
                <WillWritingCalloutsSection />
                <WillWritingAboutSection />
                <QuoteSection />
            </main>
        </FrontendLayout>
    );
}