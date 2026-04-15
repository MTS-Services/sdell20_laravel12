import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export function ContactConsultationSection() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/contact/submit', formData, {
            onSuccess: () => {
                setSuccess(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: '',
                });
            },
            onError: () => {
                // Handle errors if needed
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <section id="contact-form" className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div className="space-y-4 animate-fadeInUp">
                    <h2 className="text-3xl font-semibold text-primary-600">
                        Talk to Clara about
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-primary-600">
                        Interested in the Will Writing Online platform? Clara will walk you through the details and answer any questions about running your own legal document service.
                    </p>
                    <div className="rounded-2xl border border-primary-200/60 bg-primary-50/60 p-4 text-sm text-primary-700">
                        <p className="font-semibold text-primary-900">What happens next</p>
                        <p className="mt-1 text-primary-700">
                            Share your details and Clara will contact you within 24 hours to discuss the platform, pricing, and how to get started.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 animate-fadeInUp delay-200">
                    {success ? (
                        <div className="p-6 md:p-7 text-center">
                            <div className="mb-4 text-green-600">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary-900 mb-2">Thank you for your message!</h3>
                            <p className="text-primary-600">Clara will get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 md:p-7 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    id="firstName"
                                    name="firstName"
                                    label="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <FormField
                                    id="lastName"
                                    name="lastName"
                                    label="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <FormField
                                    id="phone"
                                    name="phone"
                                    label="Phone number"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-primary-700" htmlFor="message">
                                    Message (optional)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                    placeholder="Tell Clara a bit about your interest..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message to Clara'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

type FormFieldProps = {
    id: string;
    name: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

function FormField({ id, name, label, type = 'text', value, onChange, required = false }: FormFieldProps) {
    return (
        <div>
            <label className="text-xs font-semibold text-primary-700" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
        </div>
    );
}
