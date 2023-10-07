import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { discountPrice, postData } from "~/lib/clientFunctions";
import { resetCart } from "~/redux/cart.slice";
import classes from "~/styles/payment.module.css";

const CheckoutProcess = () => {
  const router = useRouter();
  const cartData = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const payAmount = discountPrice(cartData) + cartData.deliveryInfo.cost;
  const [payData, setPayData] = useState({});
  const [isValid, setIsValid] = useState(false);

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
          method: paymentData.method,
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
          router.push(`/checkout/success/${response.createdOrder._id}`))
        : toast.error("Something Went Wrong (500)");
    } catch (err) {
      toast.error(`Something Went Wrong ${err}`);
      console.log(err);
    }
  };

  useEffect(() => {
    if (router.query.trn_id) {
      const transactionId = router.query.trn_id;
      const gateway = router.query.gateway;
      const receivedPrice = Number(router.query.am);
      const paymentData = {
        method: gateway,
        id: transactionId,
      };
      if (
        transactionId.length == 17 &&
        gateway.length > 0 &&
        receivedPrice === payAmount
      ) {
        setPayData(paymentData);
        setIsValid(true);
      } else {
        toast.error("Invalid Request");
      }
    }
  }, [payAmount, router]);

  useEffect(() => {
    if (isValid) {
      processOrder(payData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payData, isValid]);

  if (cartData && cartData.items.length > 0) {
    return (
      <>
        <div className="layout_top">
          <div className={classes.container}>
            <h2 className={classes.h2}>Processing Order...</h2>
          </div>
        </div>
      </>
    );
  }
  return null;
};

CheckoutProcess.footer = false;

export default CheckoutProcess;
