import React from 'react';
import { Head, usePage } from '@inertiajs/react';

type SeoProps = {
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
};

export function SeoHead({
    fallbackTitle,
    fallbackDescription,
    fallbackKeywords,
}: {
    fallbackTitle: string;
    fallbackDescription?: string;
    fallbackKeywords?: string;
}) {
    const { props } = usePage<{ seo?: SeoProps | null }>();
    const seo = props.seo ?? null;

    const title = (seo?.meta_title || fallbackTitle).trim();
    const description = (seo?.meta_description || fallbackDescription || '').trim();
    const keywords = (seo?.meta_keywords || fallbackKeywords || '').trim();

    return (
        <Head>
            <title>{title}</title>
            <meta name="title" content={title} />
            {description ? <meta name="description" content={description} /> : null}
            {keywords ? <meta name="keywords" content={keywords} /> : null}
        </Head>
    );
}

