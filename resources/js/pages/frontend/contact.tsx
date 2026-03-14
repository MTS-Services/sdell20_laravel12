import React from 'react';

import { ContactConsultationSection } from '@/components/frontend/contact/contact-consultation-section';
import { ContactHeroSection } from '@/components/frontend/contact/contact-hero-section';
import { ContactMapSection } from '@/components/frontend/contact/contact-map-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { LpaFaqSection } from '@/components/frontend/lpa/lpa-faq-section';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact Us</title>
                <meta name="title" content="Contact Us" />
                <meta name="description" content="Get in touch with Online-Will-Write. Contact our support team today for any questions, inquiries, or assistance with our online will writing services." />
                <meta name="keywords" content="contact Online Will Write, contact us, customer support, help desk, will writing assistance UK, get in touch" />
            </Head>
            <FrontendLayout>
                <main className="bg-white">
                    <ContactHeroSection />
                    <ContactConsultationSection />
                    <ContactMapSection />
                    <LpaFaqSection />
                </main>
            </FrontendLayout>
        </>
    );
}
