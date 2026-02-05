import React from 'react';

import { HeroSection } from '@/components/frontend/probate/hero-section';
import { HowWeHelpSection } from '@/components/frontend/probate/how-we-help-section';
import { PreferToTalkSection } from '@/components/frontend/probate/prefer-to-talk-section';
import { SpecialistSupportSection } from '@/components/frontend/probate/specialist-support-section';
import { WhatIsProbateSection } from '@/components/frontend/probate/what-is-probate-section';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Probate() {
    return (
        <FrontendLayout>
            <main>
                <HeroSection />
                <SpecialistSupportSection />
                <WhatIsProbateSection />
                <HowWeHelpSection />
                <PreferToTalkSection />
            </main>
        </FrontendLayout>
    );
}
