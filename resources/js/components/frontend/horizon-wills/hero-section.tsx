import React, { useEffect, useRef, useState } from 'react';

const heroMessages = [
    'Death can feel like the full stop at the end of our lives.',
    'But what if we treated it more like an invitation?',
    'For more words, more conversations',
    'And more meaning in every moment.',
];

function interpolateColor(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }, progress: number) {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * progress),
        g: Math.round(color1.g + (color2.g - color1.g) * progress),
        b: Math.round(color1.b + (color2.b - color1.b) * progress),
    };
}

export function HorizonHeroSection() {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [bgColor, setBgColor] = useState('rgb(200, 220, 255)');
    const tickingRef = useRef(false);
    const activeIndexRef = useRef(0);

    useEffect(() => {
        function updateTextAnimation() {
            const heroEl = heroRef.current;
            if (!heroEl) {
                tickingRef.current = false;
                return;
            }

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroTop = heroEl.offsetTop;
            const heroHeight = heroEl.offsetHeight;
            const relativeScroll = Math.min(Math.max(scrollTop - heroTop, 0), heroHeight);
            const progress = heroHeight ? relativeScroll / heroHeight : 0;
            const newIndex = Math.min(Math.floor(progress * heroMessages.length), heroMessages.length - 1);

            if (newIndex !== activeIndexRef.current) {
                activeIndexRef.current = newIndex;
                setActiveIndex(newIndex);
            }

            let color;
            if (progress < 0.33) {
                color = interpolateColor(
                    { r: 200, g: 220, b: 255 },
                    { r: 230, g: 240, b: 255 },
                    progress / 0.33,
                );
            } else if (progress < 0.66) {
                color = interpolateColor(
                    { r: 230, g: 240, b: 255 },
                    { r: 255, g: 220, b: 180 },
                    (progress - 0.33) / 0.33,
                );
            } else {
                color = interpolateColor(
                    { r: 255, g: 220, b: 180 },
                    { r: 255, g: 255, b: 255 },
                    (progress - 0.66) / 0.34,
                );
            }

            setBgColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
            tickingRef.current = false;
        }

        function requestTick() {
            if (!tickingRef.current) {
                requestAnimationFrame(updateTextAnimation);
                tickingRef.current = true;
            }
        }

        updateTextAnimation();
        window.addEventListener('scroll', requestTick);
        return () => window.removeEventListener('scroll', requestTick);
    }, []);

    return (
        <section ref={heroRef} style={{ backgroundColor: bgColor }} className="relative min-h-[90vh] overflow-hidden py-24 transition-colors duration-700">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-5xl space-y-12">
                    {heroMessages.map((message, index) => {
                        const status =
                            index === activeIndex ? 'active' : index < activeIndex ? 'above' : 'below';

                        return (
                            <div
                                key={message}
                                className={`hero-text-item transition-all duration-700 ease-out ${status === 'active'
                                    ? 'opacity-100 translate-y-0'
                                    : status === 'above'
                                        ? 'opacity-50 -translate-y-4'
                                        : 'opacity-50 translate-y-4'
                                    }`}
                            >
                                <h1 className="text-3xl font-light leading-tight text-primary-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                                    {message}
                                </h1>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
