import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CheckoutForm from "~/components/Checkout/stripe";
import Spinner from "~/components/Ui/Spinner";
import { postData } from "~/lib/clientFunctions";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState("");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(true);
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const exchangeRate = Number(settings.settingsData.currency.exchangeRate);

  useEffect(() => {
    if (cartData.items.length > 0 && exchangeRate > 0) {
      async function getClientSecret() {
        try {
          const { clientSecret, price, error } = await postData(
            `/api/checkout/stripe`,
            { cartData, exchangeRate },
          );
          if (error) {
            toast.error(error);
          } else {
            setClientSecret(clientSecret);
            setPrice(price);
          }
        } catch (err) {
          console.log(err);
          toast.error(err.message);
        }
        setLoading(false);
      }
      getClientSecret();
    }
  }, [cartData, exchangeRate, settings]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <div className="layout_top">
        <div className="App text-center">
          {loading && (
            <div style={{ height: "70vh" }}>
              <Spinner />
            </div>
          )}
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                price={price}
                currency={settings.settingsData.currency}
              />
            </Elements>
          )}
        </div>
      </div>
    </>
  );
}

Stripe.footer = false;
