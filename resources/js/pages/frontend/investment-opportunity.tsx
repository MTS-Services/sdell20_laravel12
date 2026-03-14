import React from 'react';

import { HorizonHeroSection } from '@/components/frontend/horizon-wills/hero-section';
import { JobSection } from '@/components/frontend/horizon-wills/job-section';
import { MissionSection } from '@/components/frontend/horizon-wills/mission-section';
import { TeamSection } from '@/components/frontend/horizon-wills/team-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';

export default function InvestmentOpportunity() {
    return (
        <>
            <Head>
                <title>Business Opportunity Investment</title>
                <meta name="title" content="Business Opportunity Investment" />
                <meta name="description" content="Looking for a lucrative business opportunity in the UK. Explore our Professional Will Writing  business opportunity, low risk high return investment." />
                <meta name="keywords" content=" Shopify business for sale, Shopify store for sale, Low cost franchise opportunities uk,  shopify stores for sale,  Ecommerce Opportunity" />
            </Head>
            <FrontendLayout>
                <main className="flex flex-col">
                    <HorizonHeroSection />
                    <MissionSection />
                    <JobSection />
                    <TeamSection />
                </main>
            </FrontendLayout>
        </>
    );
}
