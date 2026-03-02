import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

import { toUrl } from '@/lib/utils';

export function useActiveUrl() {
    const page = usePage();
    const currentUrlPath = new URL(page.url, window?.location.origin).pathname;

    function urlIsActive(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
    ) {
        const urlToCompare = currentUrl ?? currentUrlPath;
        const normalizedUrl = new URL(toUrl(urlToCheck), window?.location.origin).pathname;

        return normalizedUrl === urlToCompare;
    }

    return {
        currentUrl: currentUrlPath,
        urlIsActive,
    };
}
