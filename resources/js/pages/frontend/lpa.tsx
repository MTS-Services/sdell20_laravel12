import React from 'react';

import { LpaStartApplicationSection } from '@/components/frontend/lpa/lpa-start-application-section';
import { LpaWatchVideoSection } from '@/components/frontend/lpa/lpa-watch-video-section';
import Feedback from '@/components/feedback';
import { SeoHead } from '@/components/seo-head';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Lpa() {
    return (
        <>
            <SeoHead
                fallbackTitle="Start Application — Lasting Power of Attorney"
                fallbackDescription="Before you start your LPA, have names, dates of birth and addresses ready. Understand the £99 service fee and £92 OPG registration fee, then create your LPA online."
                fallbackKeywords="LPA application, start LPA, lasting power of attorney UK, LPA fees, OPG registration fee"
            />
            <FrontendLayout>
                <main className="bg-white">
                    <LpaStartApplicationSection />
                    <Feedback />
                    <LpaWatchVideoSection />
                </main>
            </FrontendLayout>
        </>
    );
}
