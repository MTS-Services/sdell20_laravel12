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
    const [isMobile, setIsMobile] = useState(false);
    const tickingRef = useRef(false);
    const activeIndexRef = useRef(0);

    // Detect mobile/tablet for adjusted scroll behavior
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            
            // Adjust progress calculation for mobile to make it easier to scroll through
            const progressMultiplier = isMobile ? 1.2 : 1;
            const progress = heroHeight ? Math.min((relativeScroll / heroHeight) * progressMultiplier, 1) : 0;
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
        window.addEventListener('resize', requestTick);
        return () => {
            window.removeEventListener('scroll', requestTick);
            window.removeEventListener('resize', requestTick);
        };
    }, [isMobile]);

    return (
        <section
            ref={heroRef}
            style={{ backgroundColor: bgColor }}
            className="relative min-h-[50vh] xs:min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] xl:min-h-[95vh] overflow-hidden py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28 transition-colors duration-700"
        >
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="mx-auto max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-8 xs:space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16">
                    {heroMessages.map((message, index) => {
                        const status =
                            index === activeIndex ? 'active' : index < activeIndex ? 'above' : 'below';

                        return (
                            <div
                                key={message}
                                className={`hero-text-item text-center md:text-left transition-all duration-700 ease-out ${
                                    status === 'active'
                                        ? 'opacity-100 translate-y-0 scale-100'
                                        : status === 'above'
                                        ? 'opacity-30 md:opacity-50 -translate-y-3 md:-translate-y-4 scale-95 md:scale-100'
                                        : 'opacity-30 md:opacity-50 translate-y-3 md:translate-y-4 scale-95 md:scale-100'
                                }`}
                            >
                                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light leading-tight xs:leading-snug sm:leading-tight md:leading-tight lg:leading-tight text-primary-900 px-2 xs:px-0">
                                    {message}
                                </h1>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Optional: Add scroll indicator for mobile */}
            {isMobile && activeIndex === 0 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg
                        className="w-6 h-6 text-primary-700 opacity-50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            )}
        </section>
    );
}