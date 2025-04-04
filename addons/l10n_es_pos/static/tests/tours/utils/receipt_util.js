import * as ProductScreen from "@point_of_sale/../tests/pos/tours/utils/product_screen_util";
import * as PaymentScreen from "@point_of_sale/../tests/pos/tours/utils/payment_screen_util";

export function checkSimplifiedInvoiceNumber(number) {
    return [
        {
            content: "verify that the simplified invoice number appears correctly on the receipt",
            trigger: `.receipt-screen .simplified-invoice-number:contains('${number}')`,
        },
    ];
}

export function pay() {
    return [
        ...ProductScreen.clickPayButton(),
        ...PaymentScreen.clickPaymentMethod("Bank"),
        ...PaymentScreen.clickValidate(),
    ];
}
