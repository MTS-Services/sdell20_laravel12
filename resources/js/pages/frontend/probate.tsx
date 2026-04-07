import React from 'react';

import { HeroSection } from '@/components/frontend/probate/hero-section';
import { HowWeHelpSection } from '@/components/frontend/probate/how-we-help-section';
import { WhatIsProbateSection } from '@/components/frontend/probate/what-is-probate-section';
import { ReferralFeeSection } from '@/components/frontend/probate/referral-fee-section';
import Feedback from '@/components/feedback';
import FrontendLayout from '@/layouts/frontend-layout';
import { SeoHead } from '@/components/seo-head';
import { SpecialistSupportSection } from '@/components/frontend/probate/specialist-support-section';
import { PreferToTalkSection } from '@/components/frontend/probate/prefer-to-talk-section';

export default function Probate() {
    return (
        <>
            <SeoHead
                fallbackTitle="Probate Fee"
                fallbackDescription="Apply for probate online and get a free quote"
                fallbackKeywords="Probate application, Probate on line, Get probate online, Solicitor fees probate, probate costs"
            />
            <FrontendLayout>
                <main>
                    <HeroSection />
                    {/* <SpecialistSupportSection /> */}
                    <ReferralFeeSection />
                    <WhatIsProbateSection />
                    <HowWeHelpSection />
                    <PreferToTalkSection />
                    <Feedback />
                </main>
            </FrontendLayout>
        </>
    );
}
