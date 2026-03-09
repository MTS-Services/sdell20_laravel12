import React, { useCallback, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') ?? '';
}

interface PaymentStepProps {
    willType: 'Me' | 'Mirror';
    willData: Record<string, unknown>;
    onPaymentComplete: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ willType, willData, onPaymentComplete }) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);
    const page = usePage();
    const auth = (page.props as { auth?: { user?: { id: number } } }).auth;
    const isLoggedIn = Boolean(auth?.user?.id);

    const productType = willType === 'Mirror' ? 'mirror_will' : 'single_will';

    // Base prices in pence
    const baseAmount = willType === 'Mirror' ? 9999 : 6999;
    const vatAmount = Math.round(baseAmount * 0.20);
    const amount = baseAmount + vatAmount;

    // Display prices
    const basePrice = (baseAmount / 100).toFixed(2);
    const vatPrice = (vatAmount / 100).toFixed(2);
    const totalPrice = (amount / 100).toFixed(2);

    const checkPaymentStatus = useCallback(async () => {
        if (!isLoggedIn) {
            return false;
        }

        setIsCheckingPayment(true);
        try {
            const response = await fetch('/payment/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ product: productType }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.paid === true) {
                    setHasPaid(true);
                    return true;
                }
            }
        } catch {
            // Payment not verified
        } finally {
            setIsCheckingPayment(false);
        }
        return false;
    }, [isLoggedIn, productType]);

    // Check payment on mount
    React.useEffect(() => {
        void checkPaymentStatus().then((paid) => {
            if (paid) {
                onPaymentComplete();
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePayNow = useCallback(() => {
        setIsRedirecting(true);

        // Save will data so it survives the payment round-trip
        try {
            sessionStorage.setItem('will_draft_data', JSON.stringify(willData));
            sessionStorage.setItem('will_draft_type', willType);
        } catch { /* storage full — best effort */ }

        // Redirect to checkout with step=payment-complete so we land back after payment
        const baseUrl = window.location.origin + window.location.pathname;
        const redirectUrl = encodeURIComponent(`${baseUrl}?step=payment-complete`);
        window.location.href = `/checkout?amount=${amount}&product=${productType}&redirect_url=${redirectUrl}`;
    }, [willData, willType, amount, productType]);

    if (isCheckingPayment) {
        return (
            <div className="text-center py-16">
                <div className="animate-pulse">
                    <CreditCard className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                    <p className="text-primary-600 text-sm">Checking payment status...</p>
                </div>
            </div>
        );
    }

    if (hasPaid) {
        return (
            <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-primary-700 mb-2">Payment Complete!</h2>
                <p className="text-primary-600 mb-6">Your payment has been verified. Continuing to the next step...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">
                Complete Your Purchase
            </h2>
            <p className="text-sm md:text-base text-primary-600 mb-8">
                You&apos;re almost there! Complete your payment to finalise your Will and download the official document.
            </p>

            {/* Pricing Card */}
            <div className="max-w-lg mx-auto">
                <div className="bg-white border-2 border-secondary/30 rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-secondary/5 px-6 py-5 border-b border-secondary/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-primary-800">
                                    {willType === 'Mirror' ? 'Mirror Will (Couples)' : 'Single Will'}
                                </h3>
                                <p className="text-sm text-primary-500 mt-1">
                                    Legally sound &amp; ready to sign
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-bold text-primary-800">£{totalPrice}</span>
                                <p className="text-xs text-primary-400 mt-0.5">Inc. VAT</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-primary-600">Base price</span>
                            <span className="text-primary-800 font-medium">£{basePrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-primary-600">VAT (20%)</span>
                            <span className="text-primary-800 font-medium">£{vatPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                            <span className="text-primary-800">Total</span>
                            <span className="text-primary-800">£{totalPrice}</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="px-6 py-5 space-y-3">
                        {[
                            'Professionally formatted Will document',
                            'Legally compliant with UK law',
                            'Print and download instantly',
                            'Signing instructions included',
                            willType === 'Mirror' ? 'Covers both you and your partner' : 'Covers your individual wishes',
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="text-sm text-primary-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Security Badge */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-primary-400">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Secure payment powered by Stripe</span>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <div className="px-6 py-5 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handlePayNow}
                            disabled={isRedirecting}
                            className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <CreditCard className="w-4 h-4" />
                            {isRedirecting ? 'Redirecting to Payment...' : `Pay £${totalPrice} Now`}
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-primary-400 mt-4">
                    You&apos;ll be redirected to our secure Stripe checkout. After payment, you&apos;ll return here to complete your Will.
                </p>
            </div>
        </div>
    );
};

export default PaymentStep;
