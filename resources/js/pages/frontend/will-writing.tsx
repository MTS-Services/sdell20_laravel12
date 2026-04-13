import React from 'react';

import Banner from '@/components/frontend/home/banner';
import { WillWritingAboutSection } from '@/components/frontend/will-writing/will-writing-about-section';
import { WillWritingCalloutsSection } from '@/components/frontend/will-writing/will-writing-callouts-section';
import { WillWritingProtectedSection } from '@/components/frontend/will-writing/will-writing-protected-section';
import { WillWritingPricingSection } from '@/components/frontend/will-writing/will-writing-pricing-section';
import { WillWritingProcessSection } from '@/components/frontend/will-writing/will-writing-process-section';
import Feedback from '@/components/feedback';
import FrontendLayout from '@/layouts/frontend-layout';
import { TeamSection } from '@/components/frontend/horizon-wills/team-section';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';
import { EstateApproachSection } from '@/components/frontend/home/estate-approach-section';
import { SeoHead } from '@/components/seo-head';

export default function WillWriting() {
    return (
        <>
            <SeoHead
                fallbackTitle="Make a Will Today Online"
                fallbackDescription="Make your will online with our step-by-step tool. Checked by a will specialist. Great for simple wills and estates."
                fallbackKeywords="Mirror Wills,Making a Will,  Online Will UK, Online Will Writing Service, Make a Will Online"
            />
            <FrontendLayout>
                <main className="bg-primary-50">
                    <Banner variant="will" />
                    {/* <WillWritingProtectedSection /> */}
                    <WillWritingPricingSection />
                    <WillWritingProcessSection />
                    <LpaFaqSection />
                    <WillWritingCalloutsSection />
                    <WillWritingAboutSection />
                    {/* <TeamSection /> */}
                    {/* <EstateApproachSection /> */}
                    <Feedback />
                </main>
            </FrontendLayout>
        </>

    );
}
