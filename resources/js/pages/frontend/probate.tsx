import React from 'react';

import { HeroSection } from '@/components/frontend/probate/hero-section';
import { HowWeHelpSection } from '@/components/frontend/probate/how-we-help-section';
import { PreferToTalkSection } from '@/components/frontend/probate/prefer-to-talk-section';
import { SpecialistSupportSection } from '@/components/frontend/probate/specialist-support-section';
import { WhatIsProbateSection } from '@/components/frontend/probate/what-is-probate-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';

export default function Probate() {
    return (
        <>
            <Head>
                <title>Probate Fee</title>
                <meta name="title" content="Probate Fee" />
                <meta name="description" content="Apply for probate online and get a free quote" />
                <meta name="keywords" content="Probate application, Probate on line, Get probate online, Solicitor fees probate, probate costs" />
            </Head>
            <FrontendLayout>
                <main>
                    <HeroSection />
                    <SpecialistSupportSection />
                    <WhatIsProbateSection />
                    <HowWeHelpSection />
                    <PreferToTalkSection />
                </main>
            </FrontendLayout>
        </>
    );
}
