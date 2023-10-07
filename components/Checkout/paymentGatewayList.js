import { useTranslation } from "react-i18next";
import ImageLoader from "../Image";
import classes from "./checkout.module.css";

const PaymentGatewayList = ({ selectPaymentMethod, submitOrder, settings }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h6>{t("select_a_payment_method")} :</h6>
      <div className={classes.payment_list}>
        {settings.cod && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="cod"
              defaultChecked
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <ImageLoader
                src="/images/cash-on-del-logo.png"
                width={100}
                height={50}
                alt="Cash On Delivery"
              />
              <span>Cash On Delivery</span>
            </div>
          </label>
        )}
        {settings.paypal && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="paypal"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <ImageLoader
                src="/images/paypal-logo.png"
                width={100}
                height={50}
                alt="Paypal"
              />
              <span>Paypal</span>
            </div>
          </label>
        )}
        {settings.stripe && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="stripe"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <ImageLoader
                src="/images/stripe-logo.png"
                width={100}
                height={50}
                alt="Stripe"
              />
              <span>Stripe</span>
            </div>
          </label>
        )}
        {settings.sslCommerz && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="sslcommerz"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <ImageLoader
                src="/images/ssl-logo.png"
                width={100}
                height={50}
                alt="Sslcommerz"
              />
              <span>Sslcommerz</span>
            </div>
          </label>
        )}
        <button className="my-3" onClick={submitOrder}>
          {t("complete_order")}
        </button>
      </div>
    </div>
  );
};

export default PaymentGatewayList;
