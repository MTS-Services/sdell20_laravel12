<?php

use App\Enums\PaymentProduct;

describe('PaymentProduct', function () {
    describe('Single Will', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::SingleWill->baseAmountInPence())->toBe(6999);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::SingleWill->vatAmountInPence())->toBe(1400);
        });

        it('has no registrar fee', function () {
            expect(PaymentProduct::SingleWill->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT', function () {
            $total = PaymentProduct::SingleWill->amountInPence();
            expect($total)->toBe(8399); // £69.99 + £14.00 VAT = £83.99
        });
    });

    describe('Mirror Will', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::MirrorWill->baseAmountInPence())->toBe(9999);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::MirrorWill->vatAmountInPence())->toBe(2000);
        });

        it('has no registrar fee', function () {
            expect(PaymentProduct::MirrorWill->registrarFeeInPence())->toBe(0);
        });

        it('calculates total amount including VAT', function () {
            $total = PaymentProduct::MirrorWill->amountInPence();
            expect($total)->toBe(11999); // £99.99 + £20.00 VAT = £119.99
        });
    });

    describe('LPA Property', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::LpaProperty->baseAmountInPence())->toBe(9900);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::LpaProperty->vatAmountInPence())->toBe(1980);
        });

        it('has £92 registrar fee', function () {
            expect(PaymentProduct::LpaProperty->registrarFeeInPence())->toBe(9200);
        });

        it('calculates total amount including VAT and registrar fee', function () {
            $total = PaymentProduct::LpaProperty->amountInPence();
            expect($total)->toBe(21080); // £99.00 + £19.80 VAT + £92.00 OPG = £210.80
        });
    });

    describe('LPA Health', function () {
        it('calculates base amount correctly', function () {
            expect(PaymentProduct::LpaHealth->baseAmountInPence())->toBe(9900);
        });

        it('calculates VAT at 20%', function () {
            expect(PaymentProduct::LpaHealth->vatAmountInPence())->toBe(1980);
        });

        it('has £92 registrar fee', function () {
            expect(PaymentProduct::LpaHealth->registrarFeeInPence())->toBe(9200);
        });

        it('calculates total amount including VAT and registrar fee', function () {
            $total = PaymentProduct::LpaHealth->amountInPence();
            expect($total)->toBe(21080); // £99.00 + £19.80 VAT + £92.00 OPG = £210.80
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
            expect($total)->toBe(42000); // £350.00 + £70.00 VAT = £420.00
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
