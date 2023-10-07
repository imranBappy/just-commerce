import { Basket, Cart, Person, UiChecksGrid } from "@styled-icons/bootstrap";
import { House } from "@styled-icons/bootstrap/House";
import Link from "next/link";
import { useEffect, useState } from "react";
import c from "./footerMobile.module.css";
import { useSelector } from "react-redux";
import { decimalBalance } from "~/lib/clientFunctions";
import { useTranslation } from "react-i18next";

export default function FooterMobile() {
  const { session } = useSelector((state) => state.localSession);
  const cart = useSelector((state) => state.cart);
  const { t } = useTranslation();
  // Getting the count of items
  const getItemsCount = () => {
    const p = cart.items.reduce(
      (accumulator, item) => accumulator + item.qty,
      0
    );
    return decimalBalance(p);
  };
  return (
    <div className={c.menu}>
      <ul>
        <li>
          <Link href="/">
            <House width={20} height={20} />
            <span>{t("home")}</span>
          </Link>
        </li>
        <li>
          <Link href="/categories">
            <UiChecksGrid width={20} height={20} />
            <span>{t("categories")}</span>
          </Link>
        </li>
        <li>
          <Link href="/gallery">
            <Basket width={20} height={20} />
            <span>{t("shop")}</span>
          </Link>
        </li>
        <li>
          <Link href="/cart">
            <Cart width={20} height={20} />
            <span>
              {t("cart")} ({getItemsCount()})
            </span>
          </Link>
        </li>
        <li>
          <Link href={session && session.user ? `/profile` : `/signin`}>
            <Person width={20} height={20} />
            <span>{t("account")}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
