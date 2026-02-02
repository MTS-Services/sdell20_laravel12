import React from 'react';

import { ContactConsultationSection } from '@/components/frontend/contact/contact-consultation-section';
import { ContactFaqSection } from '@/components/frontend/contact/contact-faq-section';
import { ContactHeroSection } from '@/components/frontend/contact/contact-hero-section';
import { ContactMapSection } from '@/components/frontend/contact/contact-map-section';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Contact() {
    return (
        <FrontendLayout>
            <main className="bg-white">
                <ContactHeroSection />
                <ContactConsultationSection />
                <ContactMapSection />
                <ContactFaqSection />
            </main>
        </FrontendLayout>
    );
}
