import React from 'react';

export function ContactMapSection() {
    return (
        <section className="pb-20">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
                <div className="h-80 w-full md:h-120">
                    <iframe
                        title="Office location map"
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=120%20Bishopsgate%20London%20EC2N&output=embed"
                    />
                </div>
            </div>
        </section>
    );
}
