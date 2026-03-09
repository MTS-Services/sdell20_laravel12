import React from 'react';

import { HeroSection } from '@/components/frontend/probate/hero-section';
import { HowWeHelpSection } from '@/components/frontend/probate/how-we-help-section';
import { WhatIsProbateSection } from '@/components/frontend/probate/what-is-probate-section';
import { ReferralFeeSection } from '@/components/frontend/probate/referral-fee-section';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Probate() {
    return (
        <FrontendLayout>
            <main>
                <HeroSection />
                <ReferralFeeSection />
                <WhatIsProbateSection />
                <HowWeHelpSection />
            </main>
        </FrontendLayout>
    );
}
