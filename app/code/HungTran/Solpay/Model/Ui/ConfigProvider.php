<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace HungTran\Solpay\Model\Ui;

use Magento\Checkout\Model\ConfigProviderInterface;
use HungTran\Solpay\Gateway\Http\Client\ClientMock;

/**
 * Class ConfigProvider
 */
final class ConfigProvider implements ConfigProviderInterface
{
    const CODE = 'solpay';

    /**
     * Retrieve assoc array of checkout configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return [
            'payment' => [
                self::CODE => [
                    'transactionResults' => [
                        ClientMock::SUCCESS => __('Success'),
                        ClientMock::FAILURE => __('Fraud')
                    ],
                    'logoSrc' => 'https://raw.githubusercontent.com/phuhung273/static/main/logo.png',
                    'continueBtnSrc' => 'https://raw.githubusercontent.com/phuhung273/static/main/continue_button.png'
                ]
            ]
        ];
    }
}