import { Form, Head, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { SharedData } from '@/types';

export default function Login() {
    const { features } = usePage<SharedData>().props;

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your credentials to access your account"
            context="login"
        >
            <Head title="Log in" />

            <div className="w-full space-y-10 py-4">
                <div className="animate-fadeInDown rounded-3xl border border-primary-50/40 bg-primary-50/20 px-5 py-4 text-sm text-primary-600">
                    <p className="text-xs uppercase tracking-[0.35em] text-primary-600">Trusted access</p>
                    <p className="mt-1 text-base font-medium text-primary-600">
                        Sign in with your Horizon credentials or approved hardware key.
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                <div className="rounded-3xl border border-primary-50/40 bg-primary-50/20 p-5 text-foreground shadow-(--shadow-card) animate-fadeInUp">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        placeholder="name@company.com"
                                        className="mt-2 h-12 rounded-2xl border border-muted/60 bg-white text-base text-slate-500 placeholder:text-slate-50 focus:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-200"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="rounded-3xl border border-primary-50/40 bg-primary-50/20 p-5 text-foreground shadow-(--shadow-card) animate-fadeInUp delay-100">
                                    <div className="mb-2 flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-900"
                                        >
                                            Password
                                        </Label>
                                        {features.canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-xs font-semibold text-primary-600"
                                            >
                                                Forgot?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        className="h-12 rounded-2xl border border-muted/60 bg-white text-base text-slate-900 placeholder:text-slate-50 focus:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-200"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-primary-50/40 bg-primary-50/20 px-4 py-3 text-xs text-primary-500/80 animate-fadeInUp delay-200">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-lg">
                                        🔐
                                    </span>
                                    End-to-end encrypted · Adaptive multi-factor · SOC2 compliant
                                </div>

                                <Button
                                    type="submit"
                                    className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-r from-primary-500 via-primary-400 to-primary-600 py-5 text-base font-semibold tracking-wide text-white shadow-lg transition hover:brightness-110"
                                    disabled={processing}
                                >
                                    <span className="relative flex items-center justify-center gap-2">
                                        {processing ? (
                                            <Spinner className="h-4 w-4" />
                                        ) : (
                                            <>
                                                <span>Log in securely</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="h-5 w-5 transition group-hover:translate-x-1"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 4.5 21 12l-7.5 7.5M21 12H3"
                                                    />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-xs uppercase tracking-[0.3em] text-primary-500">
                    Ready to join us?{' '}
                    <TextLink href={register()} className="font-semibold text-primary-500 border-none hover:text-primary-200">
                        Create your account
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}