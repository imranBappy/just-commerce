import { Basket3, Cart, Trash } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import OutsideClickHandler from "~/components/ClickOutside";
import ImageLoader from "~/components/Image";
import { removeFromCart } from "~/redux/cart.slice";
import c from "./cartView.module.css";
import { useTranslation } from "react-i18next";

export default function CartView() {
  const [showCart, setShowCart] = useState(false);
  const cart = useSelector((state) => state.cart);
  const [cartData, setCartData] = useState(cart);
  const settings = useSelector((state) => state.settings);
  const { session } = useSelector((state) => state.localSession);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    setCartData(cart);
  }, [cart]);

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  // Getting the count of items
  const getItemsCount = () => {
    const p = cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty,
      0
    );
    return decimalBalance(p);
  };
  // Getting the total price of all items
  const getTotalPrice = () => {
    const p = cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    );
    return decimalBalance(p);
  };

  function gotoCheckout() {
    if (settings.settingsData.security.loginForPurchase && !session) {
      toast.info("Please Login To Continue");
      router.push("/signin");
    } else {
      router.push("/checkout");
    }
  }

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShowCart(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div onClick={() => setShowCart(true)}>
      <span>{getItemsCount()}</span>
      <p>{t("cart")}</p>
      <OutsideClickHandler
        show={showCart}
        onClickOutside={() => setShowCart(!showCart)}
      >
        <div className={c.card}>
          {cartData.items && cartData.items.length === 0 ? (
            <div className={c.empty}>
              <Basket3 width={30} height={30} />
              <span>Your Cart is empty</span>
            </div>
          ) : (
            <>
              <ul>
                {cartData.items.map((item, index) => (
                  <li key={index} className={c.item}>
                    <div className={c.image}>
                      <ImageLoader
                        src={item.image[0]?.url}
                        height={90}
                        width={90}
                        alt={item.name}
                      />
                    </div>
                    <div className={c.content}>
                      <p>{item.name} </p>
                      <b>
                        {`${
                          settings.settingsData.currency.symbol + item.price
                        } (X${item.qty})`}
                      </b>
                      {item.color.name && <span>Color: {item.color.name}</span>}
                      {item.attribute.name && (
                        <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                      )}
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.uid))}>
                      <Trash width={20} height={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={c.total}>
                <span>Total</span>
                <span>
                  {settings.settingsData.currency.symbol}
                  {getTotalPrice()}
                </span>
              </div>
              <div className={c.btn_container}>
                <Link href="/cart">{t("view_cart")}</Link>
                <button onClick={gotoCheckout}>{t("checkout")}</button>
              </div>
            </>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
