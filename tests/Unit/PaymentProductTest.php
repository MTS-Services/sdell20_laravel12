<?php

use App\Enums\PaymentProduct;

describe('PaymentProduct', function () {
    describe('Single Will', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::SingleWill->baseAmountInPence())->toBe(6500);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::SingleWill->vatAmountInPence())->toBe(1300);
        });

        it('has no registrar fee', function () {
            expect(PaymentProduct::SingleWill->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT', function () {
            $total = PaymentProduct::SingleWill->amountInPence();
            expect($total)->toBe(7800);
        });
    });

    describe('Mirror Will', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::MirrorWill->baseAmountInPence())->toBe(7500);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::MirrorWill->vatAmountInPence())->toBe(1500);
        });

        it('has no registrar fee', function () {
            expect(PaymentProduct::MirrorWill->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT', function () {
            $total = PaymentProduct::MirrorWill->amountInPence();
            expect($total)->toBe(9000);
        });
    });

    describe('LPA Property', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::LpaProperty->baseAmountInPence())->toBe(9900);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::LpaProperty->vatAmountInPence())->toBe(1980);
        });

        it('does not collect the OPG registrar fee through checkout', function () {
            expect(PaymentProduct::LpaProperty->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT only', function () {
            $total = PaymentProduct::LpaProperty->amountInPence();
            expect($total)->toBe(11880);
        });
    });

    describe('LPA Health', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::LpaHealth->baseAmountInPence())->toBe(9900);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::LpaHealth->vatAmountInPence())->toBe(1980);
        });

        it('does not collect the OPG registrar fee through checkout', function () {
            expect(PaymentProduct::LpaHealth->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT only', function () {
            $total = PaymentProduct::LpaHealth->amountInPence();
            expect($total)->toBe(11880);
        });
    });

    describe('LPA Both', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::LpaBoth->baseAmountInPence())->toBe(19800);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::LpaBoth->vatAmountInPence())->toBe(3960);
        });

        it('does not collect the OPG registrar fee through checkout', function () {
            expect(PaymentProduct::LpaBoth->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT only', function () {
            $total = PaymentProduct::LpaBoth->amountInPence();
            expect($total)->toBe(23760);
        });
    });

    describe('Probate Referral', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::ProbateReferral->baseAmountInPence())->toBe(35000);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::ProbateReferral->vatAmountInPence())->toBe(7000);
        });

        it('has no registrar fee', function () {
            expect(PaymentProduct::ProbateReferral->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT', function () {
            $total = PaymentProduct::ProbateReferral->amountInPence();
            expect($total)->toBe(42000);
        });
    });

    describe('Helper methods', function () {
        it('identifies will products correctly', function () {
            expect(PaymentProduct::SingleWill->isWill())->toBeTrue();
            expect(PaymentProduct::MirrorWill->isWill())->toBeTrue();
            expect(PaymentProduct::LpaProperty->isWill())->toBeFalse();
            expect(PaymentProduct::LpaHealth->isWill())->toBeFalse();
            expect(PaymentProduct::ProbateReferral->isWill())->toBeFalse();
        });

        it('identifies LPA products correctly', function () {
            expect(PaymentProduct::LpaProperty->isLpa())->toBeTrue();
            expect(PaymentProduct::LpaHealth->isLpa())->toBeTrue();
            expect(PaymentProduct::SingleWill->isLpa())->toBeFalse();
            expect(PaymentProduct::MirrorWill->isLpa())->toBeFalse();
            expect(PaymentProduct::ProbateReferral->isLpa())->toBeFalse();
        });
    });
});
