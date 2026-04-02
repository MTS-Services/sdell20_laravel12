import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Head } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';
import { PAYMENT_AMOUNT_PENCE } from '@/lib/paymentAmounts';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY ?? '');

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function createPaymentIntent(
    amount: number,
    paymentId?: number | null,
): Promise<string> {
    const { url, method } = { url: '/payment/intent', method: 'POST' as const };
    const body: { amount: number; payment_id?: number } = { amount };
    if (paymentId) body.payment_id = paymentId;
    const response = await fetch(url, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? 'Failed to create payment intent');
    }

    const data = await response.json();
    return data.clientSecret;
}

async function confirmPaymentOnServer(paymentIntentId: string, redirectUrl?: string | null): Promise<{ redirect_url?: string }> {
    const body: { payment_intent_id: string; redirect_url?: string } = { payment_intent_id: paymentIntentId };
    if (redirectUrl) body.redirect_url = redirectUrl;

    const response = await fetch('/payment/confirm', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? 'Failed to confirm payment');
    }

    return response.json();
}

interface CheckoutFormInnerProps {
    amount: number;
    currency: string;
    redirectUrl?: string | null;
    onSuccess: (redirectUrl?: string) => void;
}

function CheckoutFormInner({ amount, currency, redirectUrl, onSuccess }: CheckoutFormInnerProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSaveInfo, setShowSaveInfo] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message ?? 'An error occurred.');
        } else if (paymentIntent?.status === 'succeeded') {
            try {
                const result = await confirmPaymentOnServer(paymentIntent.id, redirectUrl);
                onSuccess(result.redirect_url ?? redirectUrl ?? undefined);
            } catch {
                setMessage('Payment succeeded but confirmation failed. Please contact support.');
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="[&_.p-PaymentElement]:rounded-xl [&_.p-PaymentElement]:border [&_.p-PaymentElement]:border-border [&_.p-PaymentElement]:bg-card [&_.p-PaymentElement]:p-4">
                <PaymentElement />
            </div>
            <Button
                type="submit"
                disabled={!stripe || loading}
                className="h-12 w-full rounded-xl font-semibold"
                size="lg"
            >
                {loading ? 'Processing...' : `Pay £${(amount / 100).toFixed(2)}`}
            </Button>
            {message && (
                <p className="text-center text-sm text-destructive">{message}</p>
            )}
        </form>
    );
}

function PaymentSuccessScreen({ redirectUrl }: { redirectUrl?: string }) {
    useEffect(() => {
        if (redirectUrl) {
            const timer = setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [redirectUrl]);

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-chart-2 text-white">
                <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                Thanks for your order
            </h2>
            {redirectUrl && (
                <p className="mt-4 text-sm text-muted-foreground">
                    Redirecting you back to download your document...
                </p>
            )}
            <p className="mt-8 text-sm text-muted-foreground">
                Powered by Stripe
                <span className="mx-2">|</span>
                <a
                    href={route('terms')}
                    className="underline hover:text-primary-600"
                >
                    Terms
                </a>{' '}
                <a
                    href={route('privacy')}
                    className="underline hover:text-primary-600"
                >
                    Privacy
                </a>
            </p>
        </div>
    );
}

interface CheckoutProps {
    amount: number;
    currency?: string;
    paymentId?: number | null;
    product?: string | null;
    redirectUrl?: string | null;
}

function calculatePriceBreakdown(product: string | null, totalAmount: number) {
    const isLpa = product === 'lpa_property' || product === 'lpa_health' || product === 'lpa_both';
    const isWill = product === 'single_will' || product === 'mirror_will';
    const isProbate = product === 'probate_referral';

    if (!isLpa && !isWill && !isProbate) {
        return null;
    }

    const registrarFee = product === 'lpa_both' ? 18400 : (isLpa ? 9200 : 0);
    const amountBeforeVat = totalAmount - registrarFee;
    const baseAmount = Math.round(amountBeforeVat / 1.20);
    const vatAmount = amountBeforeVat - baseAmount;

    return {
        baseAmount,
        vatAmount,
        registrarFee,
        totalAmount,
        isLpa,
        isWill,
        isProbate,
    };
}

function PriceBreakdown({ product, amount }: { product: string | null; amount: number }) {
    const breakdown = calculatePriceBreakdown(product, amount);

    if (!breakdown) {
        return null;
    }

    const productLabel = product === 'single_will' ? 'Single Will'
        : product === 'mirror_will' ? 'Mirror Wills'
            : product === 'lpa_property' ? 'LPA - Property & Finance'
                : product === 'lpa_health' ? 'LPA - Health & Welfare'
                    : product === 'lpa_both' ? 'LPA - Health & Welfare + Property & Finance'
                        : product === 'probate_referral' ? 'Probate Referral Service'
                            : '';

    return (
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-primary-900">{productLabel}</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-primary-600">Base price</span>
                    <span className="font-medium text-primary-800">£{(breakdown.baseAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-primary-600">VAT (20%)</span>
                    <span className="font-medium text-primary-800">£{(breakdown.vatAmount / 100).toFixed(2)}</span>
                </div>
                {breakdown.isLpa && (
                    <div className="flex justify-between">
                        <span className="text-primary-600">Register fee (OPG)</span>
                        <span className="font-medium text-primary-800">£{(breakdown.registrarFee / 100).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between border-t border-slate-300 pt-2 font-semibold">
                    <span className="text-primary-900">Total</span>
                    <span className="text-primary-900">£{(breakdown.totalAmount / 100).toFixed(2)}</span>
                </div>
            </div>
            {breakdown.isLpa && (
                <p className="mt-3 text-xs text-primary-500">
                    The £92 register fee is mandatory for registration with the Office of Public Guardian.{' '}
                    <a
                        href="https://www.gov.uk/power-of-attorney/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary-700"
                    >
                        Learn more
                    </a>
                </p>
            )}
        </div>
    );
}

export default function Checkout({
    amount = PAYMENT_AMOUNT_PENCE.lpa,
    currency = 'gbp',
    paymentId = null,
    product = null,
    redirectUrl = null,
}: CheckoutProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const [successRedirectUrl, setSuccessRedirectUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const setupPayment = async () => {
            try {
                // If product is provided and no paymentId, create a plan selection first
                if (product && !paymentId) {
                    const selectResponse = await fetch('/payment/select-plan', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': getCsrfToken(),
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({ amount, product }),
                    });

                    if (selectResponse.ok) {
                        const selectData = await selectResponse.json();
                        const secret = await createPaymentIntent(amount, selectData.payment_id);
                        setClientSecret(secret);
                        return;
                    }
                }

                const secret = await createPaymentIntent(amount, paymentId);
                setClientSecret(secret);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load');
            }
        };

        setupPayment();
    }, [amount, paymentId, product]);

    useEffect(() => {
        const hideStripeBadge = () => {
            document.querySelectorAll('a[href*="stripe.com"]').forEach((el) => {
                (el as HTMLElement).style.setProperty('display', 'none', 'important');
            });
        };
        hideStripeBadge();
        const timer = setTimeout(hideStripeBadge, 1000);
        const observer = new MutationObserver(hideStripeBadge);
        observer.observe(document.body, { childList: true, subtree: true });
        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [clientSecret]);

    const stripeAppearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0f182e',
            colorBackground: '#ffffff',
            colorText: '#0f182e',
            colorDanger: '#D02738',
            fontFamily: 'Open Sans, ui-sans-serif, system-ui, sans-serif',
            borderRadius: '10px',
            spacingUnit: '4px',
        },
        rules: {
            '.Input': {
                border: '1px solid #F3F3F3',
                boxShadow: 'none',
            },
            '.Input:focus': {
                border: '1px solid #415385',
                boxShadow: '0 0 0 1px #415385',
            },
            '.Label': {
                fontWeight: '500',
            },
        },
    };

    return (
        <UserLayout>
            <Head title="Checkout" />
            <div className="bg-background py-8 sm:py-10">
                <div className="container mx-auto max-w-lg px-4 sm:px-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-(--shadow-card) sm:p-8">
                        {paymentSucceeded ? (
                            <PaymentSuccessScreen redirectUrl={successRedirectUrl} />
                        ) : (
                            <>
                                <h1 className="mb-6 text-xl font-semibold text-primary-700 dark:text-primary-200">
                                    Complete Your Purchase
                                </h1>
                                <PriceBreakdown product={product} amount={amount} />
                                {error && (
                                    <p className="mb-4 text-sm text-destructive">{error}</p>
                                )}
                                {clientSecret ? (
                                    <Elements
                                        stripe={stripePromise}
                                        options={{
                                            clientSecret,
                                            appearance: stripeAppearance,
                                        }}
                                    >
                                        <CheckoutFormInner
                                            amount={amount}
                                            currency={currency}
                                            redirectUrl={redirectUrl}
                                            onSuccess={(resolvedRedirectUrl) => {
                                                setSuccessRedirectUrl(resolvedRedirectUrl);
                                                setPaymentSucceeded(true);
                                            }}
                                        />
                                    </Elements>
                                ) : (
                                    !error && (
                                        <p className="text-muted-foreground">
                                            Loading payment form...
                                        </p>
                                    )
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
