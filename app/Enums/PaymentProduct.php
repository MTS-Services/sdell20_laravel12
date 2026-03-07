<?php

namespace App\Enums;

enum PaymentProduct: string
{
    case SingleWill = 'single_will';

    case MirrorWill = 'mirror_will';

    case LpaProperty = 'lpa_property';

    case LpaHealth = 'lpa_health';

    case WillWritingPlatform = 'will_writing_platform';

    public function label(): string
    {
        return match ($this) {
            self::SingleWill => 'Single Will',
            self::MirrorWill => 'Mirror Wills',
            self::LpaProperty => 'LPA - Property & Finance',
            self::LpaHealth => 'LPA - Health & Welfare',
            self::WillWritingPlatform => 'Will Writing Online Platform',
        };
    }

    /**
     * Amount in pence for Stripe.
     */
    public function amountInPence(): int
    {
        return match ($this) {
            self::SingleWill => 6999,
            self::MirrorWill => 9999,
            self::LpaProperty => 13999,
            self::LpaHealth => 13999,
            self::WillWritingPlatform => 99500,
        };
    }

    public function isWill(): bool
    {
        return in_array($this, [self::SingleWill, self::MirrorWill]);
    }

    public function isLpa(): bool
    {
        return in_array($this, [self::LpaProperty, self::LpaHealth]);
    }

    /**
     * Determine the product from Will selection type ('Me' = single, 'Mirror' = mirror).
     */
    public static function fromWillType(string $whoFor): self
    {
        return $whoFor === 'Mirror' ? self::MirrorWill : self::SingleWill;
    }

    /**
     * Determine the product from LPA document type.
     */
    public static function fromLpaType(string $documentType): self
    {
        return $documentType === 'property' ? self::LpaProperty : self::LpaHealth;
    }
}
