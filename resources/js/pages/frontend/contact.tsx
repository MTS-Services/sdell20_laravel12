import React from 'react';

import { ContactConsultationSection } from '@/components/frontend/contact/contact-consultation-section';
import { ContactHeroSection } from '@/components/frontend/contact/contact-hero-section';
import { ContactMapSection } from '@/components/frontend/contact/contact-map-section';
import Feedback from '@/components/feedback';
import FrontendLayout from '@/layouts/frontend-layout';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';
import { SeoHead } from '@/components/seo-head';

export default function Contact() {
    return (
        <>
            <SeoHead
                fallbackTitle="Contact Us"
                fallbackDescription="Get in touch with Online-Will-Write. Contact our support team today for any questions, inquiries, or assistance with our online will writing services."
                fallbackKeywords="contact Online Will Write, contact us, customer support, help desk, will writing assistance UK, get in touch"
            />
            <FrontendLayout>
                <main className="bg-white">
                    <ContactHeroSection />
                    <ContactConsultationSection />
                    {/* <ContactMapSection /> */}
                    {/* <LpaFaqSection /> */}
                    <Feedback />
                </main>
            </FrontendLayout>
        </>
    );
}
