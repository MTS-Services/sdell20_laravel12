import React, { useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';

type FormState = {
    title: string;
    firstName: string;
    lastName: string;
    middleName: string;
    preferredName: string;
    otherKnownName: string;
    showOtherName: boolean;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
    addressLine1: string;
    addressLine2: string;
    town: string;
    county: string;
    country: string;
    postcode: string;
    mobileNumber: string;
    landlineNumber: string;
};

const initialState: FormState = {
    title: '',
    firstName: '',
    lastName: '',
    middleName: '',
    preferredName: '',
    otherKnownName: '',
    showOtherName: false,
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    addressLine1: '',
    addressLine2: '',
    town: '',
    county: '',
    country: '',
    postcode: '',
    mobileNumber: '',
    landlineNumber: '',
};

const titleOptions = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'];
const countryOptions = ['United Kingdom', 'United States', 'Canada', 'Australia', 'New Zealand'];

export default function UserForm() {
    const [formState, setFormState] = useState<FormState>(initialState);

    const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        router.visit(route('dashboard.user'));
    };

    return (
        <UserLayout showProfileMenu={false}>
            <div className="bg-primary-50 px-4 py-8">
                <div className="mx-auto w-full max-w-6xl rounded-3xl border border-primary-100 bg-white px-6 py-8 shadow-sm lg:px-10 lg:py-12">
                    <div className="space-y-3 text-center lg:text-left">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-500">Tell us a little about yourself</p>
                        <h1 className="text-2xl font-semibold text-primary-900 lg:text-3xl">Let&apos;s get your account set up</h1>
                        <p className="text-sm text-primary-600 lg:text-base">
                            First, please give us some information about yourself. You can use these details in any Lasting Power of Attorney documents you create using our service.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                        <section className="space-y-6">
                            <div className="grid gap-4 lg:grid-cols-2">
                                <SelectField
                                    id="title"
                                    label="Title"
                                    value={formState.title}
                                    onChange={handleChange('title') as (event: React.ChangeEvent<HTMLSelectElement>) => void}
                                    options={titleOptions}
                                    placeholder="Choose..."
                                />
                                <InputField id="firstName" label="First name" value={formState.firstName} onChange={handleChange('firstName')} required />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <InputField id="lastName" label="Last name" value={formState.lastName} onChange={handleChange('lastName')} required />
                                <InputField
                                    id="middleName"
                                    label="Middle names (if any)"
                                    value={formState.middleName}
                                    onChange={handleChange('middleName')}
                                    placeholder="Optional"
                                />
                            </div>

                            <button
                                type="button"
                                className="text-sm font-semibold text-primary-500 underline underline-offset-4"
                                onClick={() => setFormState((prev) => ({ ...prev, showOtherName: !prev.showOtherName }))}
                            >
                                Known by any other names? Click here
                            </button>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <InputField
                                    id="preferredName"
                                    label="Preferred name (optional)"
                                    value={formState.preferredName}
                                    onChange={handleChange('preferredName')}
                                    placeholder="Leave blank to use the first name"
                                />
                                {formState.showOtherName ? (
                                    <InputField
                                        id="otherKnownName"
                                        label="Other known name"
                                        value={formState.otherKnownName}
                                        onChange={handleChange('otherKnownName')}
                                        placeholder="Add the other name"
                                    />
                                ) : (
                                    <div className="hidden lg:block" />
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <Label className="text-base font-semibold text-primary-800">Date of birth</Label>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InputField id="dobDay" label="Day" value={formState.dobDay} onChange={handleChange('dobDay')} placeholder="DD" required />
                                    <InputField id="dobMonth" label="Month" value={formState.dobMonth} onChange={handleChange('dobMonth')} placeholder="MM" required />
                                </div>
                                <InputField id="dobYear" label="Year" value={formState.dobYear} onChange={handleChange('dobYear')} placeholder="YYYY" required />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <Label className="text-base font-semibold text-primary-800">What&apos;s your address?</Label>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <InputField id="addressLine1" label="Address line 1" value={formState.addressLine1} onChange={handleChange('addressLine1')} required />
                                <InputField id="addressLine2" label="Address line 2" value={formState.addressLine2} onChange={handleChange('addressLine2')} placeholder="Optional" />
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <InputField id="town" label="Town" value={formState.town} onChange={handleChange('town')} required />
                                <InputField id="county" label="County" value={formState.county} onChange={handleChange('county')} required />
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <SelectField
                                    id="country"
                                    label="Country"
                                    value={formState.country}
                                    onChange={handleChange('country') as (event: React.ChangeEvent<HTMLSelectElement>) => void}
                                    options={countryOptions}
                                    placeholder="Choose country..."
                                />
                                <InputField id="postcode" label="Postcode" value={formState.postcode} onChange={handleChange('postcode')} required />
                            </div>

                        </section>

                        <section className="space-y-4">
                            <Label className="text-base font-semibold text-primary-800">Contact number</Label>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <InputField
                                    id="mobileNumber"
                                    label="What&apos;s your mobile number?"
                                    value={formState.mobileNumber}
                                    onChange={handleChange('mobileNumber')}
                                    placeholder="01581808896"
                                    required
                                />
                                <InputField
                                    id="landlineNumber"
                                    label="What&apos;s your landline number?"
                                    value={formState.landlineNumber}
                                    onChange={handleChange('landlineNumber')}
                                    placeholder="Optional"
                                />
                            </div>
                        </section>

                        <div className="flex justify-end">
                            <Button type="submit" className="min-w-50 rounded-lg bg-primary-500 py-3 text-base font-semibold text-white hover:bg-primary-600">
                                Continue
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}

function SelectField({
    id,
    label,
    value,
    onChange,
    options,
    placeholder,
    required,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                className="h-12 w-full rounded border border-slate-200 px-3 text-sm text-primary-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
                {placeholder ? (
                    <option value="">{placeholder}</option>
                ) : null}
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function InputField({
    id,
    label,
    value,
    onChange,
    placeholder,
    required,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="h-12 rounded border border-slate-200 px-3 text-sm text-primary-800 focus:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-100"
            />
        </div>
    );
}
