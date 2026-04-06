import React from 'react';

import { WillWritingAboutSection } from '@/components/frontend/will-writing/will-writing-about-section';
import { WillWritingCalloutsSection } from '@/components/frontend/will-writing/will-writing-callouts-section';
import { WillWritingHeroSection } from '@/components/frontend/will-writing/will-writing-hero-section';
import { WillWritingProtectedSection } from '@/components/frontend/will-writing/will-writing-protected-section';
import { WillWritingPricingSection } from '@/components/frontend/will-writing/will-writing-pricing-section';
import { WillWritingProcessSection } from '@/components/frontend/will-writing/will-writing-process-section';
import Feedback from '@/components/feedback';
import FrontendLayout from '@/layouts/frontend-layout';
import { TeamSection } from '@/components/frontend/horizon-wills/team-section';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';
import { EstateApproachSection } from '@/components/frontend/home/estate-approach-section';
import { Head } from '@inertiajs/react';

export default function WillWriting() {
    return (
        <>
            <Head>
                <title>Make a Will Today Online</title>
                <meta name="title" content="Make a Will Today Online" />
                <meta name="description" content="Make your will online with our step-by-step tool. Checked by a will specialist. Great for simple wills and estates." />
                <meta name="keywords" content="Mirror Wills,Making a Will,  Online Will UK, Online Will Writing Service, Make a Will Online" />
            </Head>
            <FrontendLayout>
                <main className="bg-primary-50">
                    <WillWritingHeroSection />
                    {/* <WillWritingProtectedSection /> */}
                    <WillWritingPricingSection />
                    <WillWritingProcessSection />
                    <LpaFaqSection />
                    <WillWritingCalloutsSection />
                    <WillWritingAboutSection />
                    {/* <TeamSection /> */}
                    <EstateApproachSection />
                    <Feedback />
                </main>
            </FrontendLayout>
        </>

    );
}
