import { Basket3 } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import {
  applyCoupon,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "~/redux/cart.slice";
import ImageLoader from "../Image";
import classes from "./cartPage.module.css";
import { useTranslation } from "react-i18next";


const CartPage = () => {
  const couponCode = useRef("");
  const cart = useSelector((state) => state.cart);

  // Calculate total delivery cost for each item and overall total
  const totalDeliveryCosts = cart.items.map((item) => item.deliveryPrice * item.qty);
  const overallTotalDeliveryCost = totalDeliveryCosts.reduce((acc, cost) => acc + cost, 0);

  const totalPricePerItem = cart.items.map((item) => item.price * item.qty );
  const overallTotalPrice = totalPricePerItem.reduce((acc, price) => acc + price, 0);

  



  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSelector((state) => state.localSession);
  const { t } = useTranslation();
  const decimalBalance = (num) => Math.round(num * 10) / 10;
  const getTotalPrice = decimalBalance(
    cart.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    )
  );

  const discountPrice = decimalBalance(
    getTotalPrice - (cart.coupon.discount / 100) * getTotalPrice
  );

  const checkMaxQty = (uid) => {
    const product = cart.items.find((item) => item.uid === uid);
    if (product && product.quantity === -1) {
      return true;
    }
    return product && product.quantity >= product.qty + 1;
  };

  const increaseQty = (uid) => {
    if (checkMaxQty(uid)) {
      dispatch(incrementQuantity(uid));
    } else {
      toast.error("This item is out of stock!");
    }
  };

  const decreaseQty = (uid) => {
    dispatch(decrementQuantity(uid));
  };

  const validateCoupon = (data) => {
    const coupon = {
      code: data.code,
      discount: data.discount,
    };
    dispatch(applyCoupon(coupon));
  };

  const checkCoupon = async () => {
    try {
      const data = await postData("/api/order/coupon", {
        code: couponCode.current.value.trim(),
      });
      data && data.success
        ? (toast.success(data.message), validateCoupon(data))
        : toast.error(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
    }
  };

  const checkoutProcess = () => {
    if (settings.settingsData.security.loginForPurchase && !session) {
      toast.info("Please Login To Continue");
      router.push("/signin");
    } else {
      router.push("/checkout");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className={classes.empty}>
        <Basket3 width={50} height={50} />
        <h1>{t("your_cart_is_empty")}</h1>
        <Link href="/gallery">{t("back_to_shopping")}</Link>
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <h1>{t("your_cart")}</h1>
      <div className={classes.header}>
        <p>{t("image")}</p>
        <p>{t("name")}</p>
        <p>{t("price")}</p>
        
        <p>{t("quantity")}</p>
        <p>{t("actions")}</p>
        <p>{t("total")}</p>
      </div>
      {cart.items?.map((item, index) => {


      

        return (
          <div key={index} className={classes.body}>
            <div className={classes.image} data-name="Image">
              <ImageLoader
                src={item.image[0]?.url}
                height={90}
                width={90}
                alt={item.name}
              />
            </div>
            <div data-name="Name">
              {item.name}
              {item.color.name && <span>Color: {item.color.name}</span>}
              {item.attribute.name && (
                <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
              )}
            </div>
            <div data-name="Price">
              {settings.settingsData.currency.symbol}
              {item.price}
            </div>
           


            <div data-name="Quantity">{item.qty}</div>
            <div className={classes.buttons} data-name="Actions">
              <button onClick={() => increaseQty(item.uid)}>+</button>
              <button onClick={() => decreaseQty(item.uid)}>-</button>
              <button onClick={() => dispatch(removeFromCart(item.uid))}>
                x
              </button>
            </div>
            <div data-name="Total Price">
              {settings.settingsData.currency.symbol}
              {decimalBalance(item.qty * item.price.toFixed(2))}
            </div>
          </div>
        )
      })}
      <div className={classes.card_container}>
        {/* <div className={classes.card}>
          <p>{t("delivery")}</p>
          <b>{settings.settingsData.currency.symbol} {overallTotalDeliveryCost} </b>
        </div> */}
        <div className={classes.card}>
          <p>{t("sub_total")}</p>
          <b>
            {settings.settingsData.currency.symbol}
            {/* {getTotalPrice} */}
            {overallTotalPrice.toFixed(2)}
          </b>
        </div>
        <div className={classes.card}>
          <p>{t("discount")}</p>
          <b>
            {settings.settingsData.currency.symbol}
            {decimalBalance(getTotalPrice - discountPrice)}
          </b>
        </div>
        <div className={classes.card}>
          <p>{t("total_incl_vat")}</p>
          <b>
            {settings.settingsData.currency.symbol}
            {/* {discountPrice} */}
            {overallTotalPrice.toFixed(2)}
          </b>
        </div>
      </div>
      <div className={classes.checkout_container}>
        <div className={classes.coupon}>
          <input
            type="text"
            ref={couponCode}
            defaultValue={cart.coupon.code}
            placeholder={t("please_enter_promo_code")}
          />
          <button onClick={checkCoupon}>{t("apply_discount")}</button>
        </div>
        <div className={classes.checkout}>
          <button onClick={checkoutProcess}>{t("checkout")}</button>
          <Link href="/gallery">{t("back_to_shopping")}</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
