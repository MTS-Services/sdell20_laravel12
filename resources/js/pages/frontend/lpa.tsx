import React from 'react';

import { LpaAdditionalContentSection } from '@/components/frontend/lpa/lpa-additional-content-section';
import { LpaStartApplicationSection } from '@/components/frontend/lpa/lpa-start-application-section';
import { LpaWatchVideoSection } from '@/components/frontend/lpa/lpa-watch-video-section';
import { RevealMotion } from '@/components/frontend/reveal-motion';
import Feedback from '@/components/feedback';
import { SeoHead } from '@/components/seo-head';
import { useReveal } from '@/hooks/use-reveal';
import FrontendLayout from '@/layouts/frontend-layout';

function LpaFeedbackSection() {
    const [ref, visible] = useReveal<HTMLDivElement>(0.06);

    return (
        <div ref={ref}>
            <RevealMotion show={visible} mode="fade-up" delayClass="delay-100">
                <Feedback />
            </RevealMotion>
        </div>
    );
}

export default function Lpa() {
    return (
        <>
            <SeoHead
                fallbackTitle="LPA Application Online"
                fallbackDescription="Before you start your LPA, have names, dates of birth and addresses ready. Understand the £99 service fee and £92 OPG registration fee, then create your LPA online."
                fallbackKeywords="LPA application, start LPA, lasting power of attorney UK, LPA fees, OPG registration fee"
            />
            <FrontendLayout>
                <main className="bg-white">
                    <LpaStartApplicationSection />
                    <LpaFeedbackSection />
                    <LpaAdditionalContentSection />
                    <LpaWatchVideoSection />
                </main>
            </FrontendLayout>
        </>
    );
}
