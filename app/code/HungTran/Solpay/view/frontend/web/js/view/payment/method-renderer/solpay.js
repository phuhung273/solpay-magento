/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*browser:true*/
/*global define*/
define(
    [
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Customer/js/customer-data',
        'ko',
        'solpay'
    ],
    function (Component, additionalValidators, customerData, ko) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'HungTran_Solpay/payment/form',
                transactionResult: '',
                wallet: ko.observable(null),
                payer: ko.observable(null),
            },

            initObservable: function () {
                this._super()
                    .observe([
                        'transactionResult',
                        'from',
                    ]);
                return this;
            },

            getCode: function () {
                return 'solpay';
            },

            /** Returns payment acceptance mark image path */
            getLogoSrc: function () {
                return window.checkoutConfig.payment.solpay.logoSrc;
            },

            getContinueBtnSrc: function () {
                return window.checkoutConfig.payment.solpay.continueBtnSrc;
            },

            getData: function () {
                return {
                    'method': this.item.method,
                    'additional_data': {
                        'transaction_result': this.transactionResult()
                    }
                };
            },

            getTransactionResults: function () {
                return _.map(window.checkoutConfig.payment.solpay.transactionResults, function (value, key) {
                    return {
                        'value': key,
                        'transaction_result': value
                    }
                });
            },

            getProvider: function () {
                if (this.payer()) {
                    return;
                }

                if ('phantom' in window) {
                    const provider = window.phantom?.solana;

                    if (provider?.isPhantom) {
                        return this.wallet(provider);
                    }
                }

                window.open('https://phantom.app/', '_blank');
            },

            continueToPhantom: async function () {
                if (additionalValidators.validate()) {
                    customerData.invalidate(['cart']);

                    this.getProvider();
                    const provider = this.wallet();

                    // TODO: Don't connect again
                    const resp = await provider.connect();
                    const from = resp.publicKey.toString();
                    this.payer(from);

                    solpay.signAndConfirmTransaction(this.wallet(), from, 'CwjFqyHh29QC9pSFJAF8ieQaTPX7MzhQV3oUQiAhyowj').catch(err => {
                        console.log('Error connecting Phantom: ', err);
                    })

                    return false;
                }
            }
        });
    }
);