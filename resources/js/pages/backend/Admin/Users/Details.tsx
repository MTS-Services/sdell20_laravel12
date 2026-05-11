import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import {
    ArrowLeft,
    CreditCard,
    Download,
    Eye,
    FileText,
    LayoutList,
    ScrollText,
} from 'lucide-react';

interface UserResource {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    account_status?: string;
    created_at?: string | null;
    updated_at?: string | null;
}

interface ActivitySummary {
    payments_count: number;
    payments_succeeded_count: number;
    wills_count: number;
    lpas_count: number;
}

interface PaymentRow {
    id: number;
    amount: number;
    currency: string;
    status: string;
    status_label: string;
    product?: string | null;
    product_label?: string | null;
    stripe_payment_intent_id?: string | null;
    created_at?: string | null;
}

interface WillRow {
    id: number;
    will_type: string;
    status: string;
    is_draft: boolean;
    paid_at?: string | null;
    amount?: string | number | null;
    payment_reference?: string | null;
    created_at?: string | null;
}

interface LpaSummaryRow {
    label: string;
    value: string;
}

interface LpaSummarySection {
    title: string;
    rows: LpaSummaryRow[];
}

interface LpaRow {
    id: number;
    document_type?: string | null;
    who_for: string;
    status: string;
    is_draft: boolean;
    paid_at?: string | null;
    amount?: string | number | null;
    payment_reference?: string | null;
    created_at?: string | null;
    summary_sections: LpaSummarySection[];
}

interface Props {
    user: UserResource;
    activity: ActivitySummary;
    payments: PaymentRow[];
    wills: WillRow[];
    lpas: LpaRow[];
}

function formatPence(amount: number, currency: string): string {
    const value = amount / 100;
    try {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(value);
    } catch {
        return `${currency.toUpperCase()} ${value.toFixed(2)}`;
    }
}

function formatPounds(amount: string | number | null | undefined): string {
    if (amount === null || amount === undefined || amount === '') {
        return '—';
    }
    const n = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (Number.isNaN(n)) {
        return '—';
    }
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(n);
}

function formatDateTime(value?: string | null): string {
    if (!value) {
        return '—';
    }
    return new Date(value).toLocaleString();
}

function formatDocumentType(value?: string | null): string {
    if (value === 'property') {
        return 'Property & financial affairs';
    }

    if (value === 'health') {
        return 'Health & welfare';
    }

    if (value === 'both') {
        return 'Health & welfare + property & financial affairs';
    }

    return '—';
}

export default function Details({
    user,
    activity,
    payments,
    wills,
    lpas,
}: Props) {
    const [selectedLpa, setSelectedLpa] = useState<LpaRow | null>(null);

    const profileItems = [
        { label: 'User ID', value: `#${user.id}` },
        { label: 'Email', value: user.email },
        { label: 'Role', value: user.is_admin ? 'Administrator' : 'User' },
        {
            label: 'Account status',
            value: (user.account_status ?? '—').replace(/\b\w/g, (c) =>
                c.toUpperCase(),
            ),
        },
        { label: 'Joined', value: formatDateTime(user.created_at) },
        { label: 'Last updated', value: formatDateTime(user.updated_at) },
    ];

    const statCards = [
        {
            title: 'Payments',
            description: 'Stripe payment records',
            value: activity.payments_count,
            sub: `${activity.payments_succeeded_count} completed`,
            icon: CreditCard,
        },
        {
            title: 'Wills',
            description: 'Will documents (excludes soft-deleted)',
            value: activity.wills_count,
            sub: 'Created in app',
            icon: ScrollText,
        },
        {
            title: 'LPAs',
            description: 'LPA documents (excludes soft-deleted)',
            value: activity.lpas_count,
            sub: 'Created in app',
            icon: FileText,
        },
    ];

    return (
        <AdminLayout
            pageHeader={{
                title: `Activity • ${user.name}`,
                subtitle: 'Payments, wills, and LPAs for this account',
                breadcrumbs: [
                    {
                        label: 'Admin Dashboard',
                        href: route('admin.dashboard'),
                    },
                    { label: 'Users', href: route('admin.users.index') },
                    { label: 'Details' },
                ],
            }}
            headerContainerClassName="mx-auto my-8 container px-4"
        >
            <Head title={`User activity • ${user.name}`} />

            <div className="flex flex-1 items-start justify-center px-4 pb-10">
                <div className="container mx-auto w-full space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button asChild variant="outline">
                            <Link href={route('admin.users.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to list
                            </Link>
                        </Button>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="secondary">
                                <Link href={route('admin.users.show', user.id)}>
                                    Overview
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('admin.users.edit', user.id)}>
                                    Edit user
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <LayoutList className="h-5 w-5 text-primary" />
                                Profile
                            </CardTitle>
                            <CardDescription>
                                Core account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {profileItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border bg-muted/30 p-4 dark:bg-muted/20"
                                    >
                                        <dt className="text-xs tracking-wider text-muted-foreground uppercase">
                                            {item.label}
                                        </dt>
                                        <dd className="mt-1 font-semibold break-all text-foreground">
                                            {item.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        {statCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <Card key={card.title}>
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                {card.title}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {card.description}
                                            </CardDescription>
                                        </div>
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold tabular-nums">
                                            {card.value}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {card.sub}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payments</CardTitle>
                            <CardDescription>
                                Amounts are shown as charged (typically
                                including VAT / fees in pence)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {payments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No payment records for this user.
                                </p>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">
                                                    ID
                                                </TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Product</TableHead>
                                                <TableHead>
                                                    Stripe intent
                                                </TableHead>
                                                <TableHead className="w-44">
                                                    Created
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments.map((p) => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        #{p.id}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatPence(
                                                            p.amount,
                                                            p.currency,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                p.status ===
                                                                    'succeeded'
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                                                                    : p.status ===
                                                                        'canceled'
                                                                        ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'
                                                                        : ''
                                                            }
                                                        >
                                                            {p.status_label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {p.product_label ?? '—'}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                                                        {p.stripe_payment_intent_id ??
                                                            '—'}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDateTime(
                                                            p.created_at,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Wills</CardTitle>
                                <CardDescription>
                                    Each row is a will record owned by this user
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {wills.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No wills yet.
                                    </p>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-14">
                                                        ID
                                                    </TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>Paid</TableHead>
                                                    <TableHead>
                                                        Amount
                                                    </TableHead>
                                                    <TableHead className="min-w-40 text-right">
                                                        PDF
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {wills.map((w) => (
                                                    <TableRow key={w.id}>
                                                        <TableCell className="font-mono text-sm">
                                                            #{w.id}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {w.will_type}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs capitalize"
                                                                >
                                                                    {w.status.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                                </Badge>
                                                                {w.is_draft && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        Draft
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {formatDateTime(
                                                                w.paid_at,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {formatPounds(
                                                                w.amount,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex flex-col items-end gap-1 sm:flex-row sm:justify-end sm:gap-2">
                                                                <Button
                                                                    asChild
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="h-8 gap-1"
                                                                >
                                                                    <a
                                                                        href={route(
                                                                            'admin.users.wills.pdf.preview',
                                                                            {
                                                                                user: user.id,
                                                                                will: w.id,
                                                                            },
                                                                        )}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5" />
                                                                        Preview
                                                                    </a>
                                                                </Button>
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 gap-1"
                                                                >
                                                                    <a
                                                                        href={route(
                                                                            'admin.users.wills.pdf',
                                                                            {
                                                                                user: user.id,
                                                                                will: w.id,
                                                                            },
                                                                        )}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <Download className="h-3.5 w-3.5" />
                                                                        Download
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">LPAs</CardTitle>
                                <CardDescription>
                                    Each row is an LPA owned by this user. Click
                                    preview to see the full submitted answers.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {lpas.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No LPAs yet.
                                    </p>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-14">
                                                        ID
                                                    </TableHead>
                                                    <TableHead>
                                                        Document
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>Paid</TableHead>
                                                    <TableHead>
                                                        Amount
                                                    </TableHead>
                                                    <TableHead className="min-w-32 text-right">
                                                        Details
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {lpas.map((l) => (
                                                    <TableRow key={l.id}>
                                                        <TableCell className="font-mono text-sm">
                                                            #{l.id}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {formatDocumentType(
                                                                l.document_type,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs capitalize"
                                                                >
                                                                    {l.status.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                                </Badge>
                                                                {l.is_draft && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        Draft
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {formatDateTime(
                                                                l.paid_at,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {formatPounds(
                                                                l.amount,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                size="sm"
                                                                className="h-8 gap-1"
                                                                onClick={() =>
                                                                    setSelectedLpa(
                                                                        l,
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                Preview
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog
                open={selectedLpa !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedLpa(null);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-3xl">
                    {selectedLpa && (
                        <>
                            <DialogHeader className="space-y-2 border-b px-6 pt-6 pb-4">
                                <DialogTitle className="flex flex-wrap items-center gap-2 text-lg">
                                    <span className="font-mono text-sm text-muted-foreground">
                                        #{selectedLpa.id}
                                    </span>
                                    <span>
                                        {formatDocumentType(
                                            selectedLpa.document_type,
                                        )}
                                    </span>
                                </DialogTitle>
                                <DialogDescription>
                                    Full submitted LPA answers, in the same
                                    order the customer completed them.
                                </DialogDescription>
                                <div className="flex flex-wrap gap-1 pt-1">
                                    <Badge
                                        variant="outline"
                                        className="text-xs capitalize"
                                    >
                                        {selectedLpa.status.replace(/_/g, ' ')}
                                    </Badge>
                                    {selectedLpa.is_draft && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            Draft
                                        </Badge>
                                    )}
                                </div>
                            </DialogHeader>

                            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 pb-6">
                                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <dt className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Paid
                                        </dt>
                                        <dd className="mt-1 text-foreground">
                                            {formatDateTime(
                                                selectedLpa.paid_at,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <dt className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Amount
                                        </dt>
                                        <dd className="mt-1 text-foreground">
                                            {formatPounds(selectedLpa.amount)}
                                        </dd>
                                    </div>
                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <dt className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Created
                                        </dt>
                                        <dd className="mt-1 text-foreground">
                                            {formatDateTime(
                                                selectedLpa.created_at,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <dt className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Payment reference
                                        </dt>
                                        <dd className="mt-1 break-all text-foreground">
                                            {selectedLpa.payment_reference ??
                                                '—'}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="space-y-4">
                                    {selectedLpa.summary_sections.map(
                                        (section) => (
                                            <section
                                                key={`${selectedLpa.id}-${section.title}`}
                                                className="rounded-lg border bg-background p-4"
                                            >
                                                <h4 className="text-sm font-semibold text-foreground">
                                                    {section.title}
                                                </h4>
                                                <dl className="mt-3 space-y-3">
                                                    {section.rows.map((row) => (
                                                        <div
                                                            key={`${section.title}-${row.label}`}
                                                            className="grid gap-1 text-sm sm:grid-cols-[12rem_1fr]"
                                                        >
                                                            <dt className="font-medium text-muted-foreground">
                                                                {row.label}
                                                            </dt>
                                                            <dd className="wrap-break-word whitespace-pre-line text-foreground">
                                                                {row.value}
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </section>
                                        ),
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
