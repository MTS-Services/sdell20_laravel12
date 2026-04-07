import React from 'react';

import { HorizonHeroSection } from '@/components/frontend/horizon-wills/hero-section';
import { JobSection } from '@/components/frontend/horizon-wills/job-section';
import { MissionSection } from '@/components/frontend/horizon-wills/mission-section';
import { TeamSection } from '@/components/frontend/horizon-wills/team-section';
import Feedback from '@/components/feedback';
import { SeoHead } from '@/components/seo-head';
import FrontendLayout from '@/layouts/frontend-layout';

export default function InvestmentOpportunity() {
    return (
        <>
            <SeoHead
                fallbackTitle="Business Opportunity Investment"
                fallbackDescription="Looking for a lucrative business opportunity in the UK. Explore our Professional Will Writing  business opportunity, low risk high return investment."
                fallbackKeywords=" Shopify business for sale, Shopify store for sale, Low cost franchise opportunities uk,  shopify stores for sale,  Ecommerce Opportunity"
            />
            <FrontendLayout>
                <main className="flex flex-col">
                    <HorizonHeroSection />
                    <MissionSection />
                    <JobSection />
                    <TeamSection />
                    <Feedback />
                </main>
            </FrontendLayout>
        </>
    );
}
