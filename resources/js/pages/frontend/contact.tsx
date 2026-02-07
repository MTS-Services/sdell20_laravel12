import React from 'react';

import { ContactConsultationSection } from '@/components/frontend/contact/contact-consultation-section';
import { ContactHeroSection } from '@/components/frontend/contact/contact-hero-section';
import { ContactMapSection } from '@/components/frontend/contact/contact-map-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';

export default function Contact() {
    return (
        <FrontendLayout>
            <main className="bg-white">
                <ContactHeroSection />
                <ContactConsultationSection />
                <ContactMapSection />
                <LpaFaqSection />
            </main>
        </FrontendLayout>
    );
}
