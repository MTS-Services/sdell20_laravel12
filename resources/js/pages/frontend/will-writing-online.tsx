import React from 'react';

import { HorizonHeroSection } from '@/components/frontend/horizon-wills/hero-section';
import { JobSection } from '@/components/frontend/horizon-wills/job-section';
import { MissionSection } from '@/components/frontend/horizon-wills/mission-section';
import { TeamSection } from '@/components/frontend/horizon-wills/team-section';
import FrontendLayout from '@/layouts/frontend-layout';

export default function WillWritingOnline() {
    return (
        <FrontendLayout>
            <main className="flex flex-col">
                <HorizonHeroSection />
                <MissionSection />
                <JobSection />
                <TeamSection />
            </main>
        </FrontendLayout>
    );
}
