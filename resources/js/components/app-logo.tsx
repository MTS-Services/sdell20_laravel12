import { cn } from '@/lib/utils';

/** Uses `/logo.svg`. Site chrome colours are defined in `resources/css/app.css` (`--logo-*`). */

interface AppLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    /**
     * White panel behind the mark so blue gradient artwork stays readable on brand-blue bars.
     */
    variant?: 'default' | 'onBrand';
}

export default function AppLogo({ className, variant = 'default', ...props }: AppLogoProps) {
    const img = (
        <img
            src="/logo.svg"
            alt="App Logo"
            className={cn('h-auto w-auto max-w-[200px] object-contain object-left', className)}
            {...props}
        />
    );

    if (variant === 'onBrand') {
        return (
            <span
                className={cn(
                    'inline-flex max-w-full items-center justify-center rounded-xl bg-white px-2 py-1.5 shadow-md ring-2 ring-white/95 ring-offset-0',
                    'sm:rounded-2xl sm:px-3 sm:py-2 sm:shadow-lg sm:shadow-black/20',
                )}
            >
                {img}
            </span>
        );
    }

    return img;
}