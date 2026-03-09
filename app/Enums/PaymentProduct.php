<?php

namespace App\Enums;

enum PaymentProduct: string
{
    case SingleWill = 'single_will';

    case MirrorWill = 'mirror_will';

    case LpaProperty = 'lpa_property';

    case LpaHealth = 'lpa_health';

    case WillWritingPlatform = 'will_writing_platform';

    case ProbateReferral = 'probate_referral';

    public function label(): string
    {
        return match ($this) {
            self::SingleWill => 'Single Will',
            self::MirrorWill => 'Mirror Wills',
            self::LpaProperty => 'LPA - Property & Finance',
            self::LpaHealth => 'LPA - Health & Welfare',
            self::WillWritingPlatform => 'Will Writing Online Platform',
            self::ProbateReferral => 'Probate Referral Service',
        };
    }

    /**
     * Base amount in pence (before VAT and registrar fees).
     */
    public function baseAmountInPence(): int
    {
        return match ($this) {
            self::SingleWill => 6999,
            self::MirrorWill => 9999,
            self::LpaProperty => 13999,
            self::LpaHealth => 13999,
            self::WillWritingPlatform => 99500,
            self::ProbateReferral => 35000,
        };
    }

    /**
     * VAT amount in pence (20% for Wills and LPAs).
     */
    public function vatAmountInPence(): int
    {
        if ($this->isWill() || $this->isLpa() || $this === self::ProbateReferral) {
            return (int) round($this->baseAmountInPence() * 0.20);
        }

        return 0;
    }

    /**
     * Registrar fee in pence (£92 per LPA for Office of Public Guardian).
     */
    public function registrarFeeInPence(): int
    {
        if ($this->isLpa()) {
            return 9200;
        }

        return 0;
    }

    /**
     * Total amount in pence for Stripe (base + VAT + registrar fee).
     */
    public function amountInPence(): int
    {
        return $this->baseAmountInPence() + $this->vatAmountInPence() + $this->registrarFeeInPence();
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
