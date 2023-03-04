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
        'solpay'
    ],
    function (Component, additionalValidators, customerData) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'HungTran_Solpay/payment/form',
                transactionResult: ''
            },

            initObservable: function () {
                this._super()
                    .observe([
                        'transactionResult'
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

            continueToPhantom: function () {
                if (additionalValidators.validate()) {
                    customerData.invalidate(['cart']);

                    solpay.callSolana();

                    return false;
                }
            }
        });
    }
);