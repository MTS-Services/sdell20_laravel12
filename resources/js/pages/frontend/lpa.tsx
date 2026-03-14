import React from 'react';

import { LpaCtaSection } from '@/components/frontend/lpa/lpa-cta-section';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';
import { LpaFeaturedLogosSection } from '@/components/frontend/lpa/lpa-featured-logos-section';
import { LpaHeroSection } from '@/components/frontend/lpa/lpa-hero-section';
import { LpaPackageOptionsSection } from '@/components/frontend/lpa/lpa-package-options-section';
import { LpaPlanningSection } from '@/components/frontend/lpa/lpa-planning-section';
import { LpaPricingSection } from '@/components/frontend/lpa/lpa-pricing-section';
import { LpaSupportSection } from '@/components/frontend/lpa/lpa-support-section';
import { LpaVideoSection } from '@/components/frontend/lpa/lpa-video-section';
import { WillWritingAboutSection } from '@/components/frontend/will-writing/will-writing-about-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';

export default function Lpa() {
    return (
        <>
            <Head>
                <title>Online Power of Attorney Service</title>
                <meta name="title" content="Online Power of Attorney Service" />
                <meta name="description" content="Make your Lasting Power of Attorney Online with our step-by-step tool. Checked by a LPA expert. LPA forms  will be sent to Office for Public Guardian." />
                <meta name="keywords" content="Power of Attorney Cost, Online Power of Attorney, Power of Attorney Online, Create Lasting Power of Attorney Online, Lasting Power of Attorney Online" />
            </Head>
            <FrontendLayout>
                <main >
                    <LpaHeroSection />
                    <LpaPackageOptionsSection />
                    <LpaFeaturedLogosSection />
                    <LpaCtaSection />
                    <LpaPlanningSection />
                    <LpaPricingSection />
                    <LpaSupportSection />
                    <WillWritingAboutSection />
                    <LpaFaqSection />
                </main>
            </FrontendLayout>
        </>

    );
}
