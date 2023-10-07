import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  currencyConvert,
  discountPrice,
  postData,
} from "~/lib/clientFunctions";
import { resetCart } from "~/redux/cart.slice";
import classes from "~/styles/payment.module.css";

const PaypalCheckout = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const paypalRef = useRef();
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const exchangeRate = settings.settingsData.currency.exchangeRate;
  const payAmount = discountPrice(cartData) + cartData.deliveryInfo.cost;
  const payAmountUsd = currencyConvert(payAmount, exchangeRate);

  const processOrder = async (paymentData) => {
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
          method: "Paypal",
          id: paymentData.id,
        },
      };
      const url = `/api/order/new`;
      const formData = new FormData();
      formData.append("checkoutData", JSON.stringify(data));
      const response = await postData(url, formData);
      response && response.success
        ? (dispatch(resetCart()),
          toast.success("Order successfully placed"),
          setTimeout(() => {
            router.push(`/checkout/success/${response.createdOrder._id}`);
          }, 700))
        : toast.error("Something Went Wrong (500)");
    } catch (err) {
      toast.error(`Something Went Wrong ${err}`);
      console.log(err);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (loaded && payAmount > 0 && exchangeRate > 0) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: "",
                  amount: {
                    currency_code: "USD",
                    value: payAmountUsd,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            toast.info("Processing Order");
            await processOrder(order);
          },
          onError: (err) => {
            toast.error(err);
            console.error(err);
          },
        })
        .render(paypalRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, payAmount, exchangeRate]);

  if (cartData && cartData.items.length > 0) {
    return (
      <>
        <div className="layout_top">
          <div className={classes.container}>
            <h2 className={classes.h2}>Pay Now</h2>
            <div ref={paypalRef} />
          </div>
        </div>
      </>
    );
  }

  return null;
};

PaypalCheckout.footer = false;

export default PaypalCheckout;
