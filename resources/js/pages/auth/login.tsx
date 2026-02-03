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

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({ status }: LoginProps) {
    const { features } = usePage<SharedData>().props;

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your credentials to access your account"
        >
            <Head title="Log in" />

            <div className="w-full space-y-6">
                {features.canRegister && (
                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-600">New to Horizon?</span>
                        <TextLink
                            href={register()}
                            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                        >
                            Create account
                        </TextLink>
                    </div>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                <div className="group rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 transition hover:border-slate-400">
                                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        placeholder="name@company.com"
                                        className="mt-1 h-12 border-none bg-transparent text-slate-50 focus-visible:ring-0"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="group rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 transition hover:border-slate-400">
                                    <div className="mb-1 flex items-center justify-between">
                                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            Password
                                        </Label>
                                        {features.canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-xs font-semibold text-slate-50"
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
                                        className="h-12 border-none bg-transparent text-slate-50 focus-visible:ring-0"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">🔐</span>
                                    Encrypted single sign-on powered by When I Work
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full rounded-2xl bg-slate-600 py-5 text-base font-semibold tracking-wide text-white transition hover:bg-slate-700"
                                    disabled={processing}
                                >
                                    {processing ? <Spinner className="h-4 w-4" /> : 'Log in'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {features.canRegister && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        New here? <TextLink href={register()} className="text-violet-600 font-semibold hover:text-violet-500 underline-offset-4 hover:underline">Create an account</TextLink>
                    </p>
                )}


                {status && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
                        {status}
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}