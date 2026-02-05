import React from 'react';

import { QuoteSection } from '@/components/frontend/horizon-wills/team-section';
import { LpaCtaSection } from '@/components/frontend/lpa/lpa-cta-section';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';
import { LpaFeaturedLogosSection } from '@/components/frontend/lpa/lpa-featured-logos-section';
import { LpaHeroSection } from '@/components/frontend/lpa/lpa-hero-section';
import { LpaPlanningSection } from '@/components/frontend/lpa/lpa-planning-section';
import { LpaPricingSection } from '@/components/frontend/lpa/lpa-pricing-section';
import { LpaSupportSection } from '@/components/frontend/lpa/lpa-support-section';
import { WillWritingAboutSection } from '@/components/frontend/will-writing/will-writing-about-section';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Lpa() {
    return (
        <FrontendLayout>
            <main >
                <LpaHeroSection />
                <LpaFeaturedLogosSection />
                <LpaCtaSection />
                <LpaPlanningSection />
                <LpaPricingSection />
                <LpaSupportSection />
                <WillWritingAboutSection />
                <QuoteSection />
                <LpaFaqSection />
            </main>
        </FrontendLayout>
    );
}
