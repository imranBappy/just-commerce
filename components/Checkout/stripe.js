import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import { resetCart } from "../../redux/cart.slice";
import classes from "./stripe.module.css";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const cartData = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const processOrder = async () => {
    try {
      const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
        cartData;
      const data = {
        coupon,
        products: items,
        billingInfo,
        shippingInfo,
        deliveryInfo,
        paymentData: {
          method: "Stripe",
          id: null,
        },
      };
      const url = `/api/order/new`;
      const formData = new FormData();
      formData.append("checkoutData", JSON.stringify(data));
      const responseData = await postData(url, formData);
      if (responseData && responseData.success) {
        dispatch(resetCart());
        toast.success("Order successfully placed");
        setTimeout(() => {
          router.push(`/checkout/success/${responseData.createdOrder._id}`);
        }, 2300);
      } else {
        toast.error("Something Went Wrong (500)");
      }
    } catch (err) {
      toast.error(`Something Went Wrong ${err}`);
      console.log(err);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          processOrder();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/stripe`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  return (
    <div className={classes.body}>
      <form id="payment-form" onSubmit={handleSubmit} className={classes.form}>
        <PaymentElement
          id="payment-element"
          className={classes.payment_element}
        />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className={classes.spinner} id="spinner"></div>
            ) : (
              `Pay ${props.price} USD`
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && (
          <div id="payment-message" className={classes.payment_message}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
