<?php

namespace App\Enums;

enum PaymentProduct: string
{
    case SingleWill = 'single_will';

    case MirrorWill = 'mirror_will';

    case LpaProperty = 'lpa_property';

    case LpaHealth = 'lpa_health';

    case LpaBoth = 'lpa_both';

    case WillWritingPlatform = 'will_writing_platform';

    case ProbateReferral = 'probate_referral';

    public function label(): string
    {
        return match ($this) {
            self::SingleWill => 'Single Will',
            self::MirrorWill => 'Mirror Wills',
            self::LpaProperty => 'LPA - Property & Finance',
            self::LpaHealth => 'LPA - Health & Welfare',
            self::LpaBoth => 'LPA - Health & Welfare + Property & Finance',
            self::WillWritingPlatform => 'Will Writing Online Platform',
            self::ProbateReferral => 'Probate Referral Service',
        };
    }

    /**
     * Base amount in pence (before VAT and registrar fees).
     *
     * Client pricing (ex VAT): single will £65, mirror £75, each LPA £99 (£198 for both types combined).
     * The £92 OPG registration fee is paid by the client directly to the Office of the Public Guardian and is not collected here.
     */
    public function baseAmountInPence(): int
    {
        return match ($this) {
            self::SingleWill => 6500,
            self::MirrorWill => 7500,
            self::LpaProperty => 9900,
            self::LpaHealth => 9900,
            self::LpaBoth => 19800,
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
     * Registrar fee in pence collected through this checkout.
     *
     * The Office of the Public Guardian's £92 registration fee is paid by the client directly to the OPG, so it is not collected here.
     */
    public function registrarFeeInPence(): int
    {
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
        return in_array($this, [self::LpaProperty, self::LpaHealth, self::LpaBoth], true);
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
        return match ($documentType) {
            'property' => self::LpaProperty,
            'both' => self::LpaBoth,
            default => self::LpaHealth,
        };
    }
}
