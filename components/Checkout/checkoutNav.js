import {
  BagCheck,
  CreditCard,
  InfoCircle,
  Truck,
  ViewList,
} from "@styled-icons/bootstrap";
import classes from "./checkout.module.css";
import { useTranslation } from "react-i18next";

const CheckoutNav = ({ tab, setTab, changeTab }) => {
  const { t } = useTranslation();

  function select(id) {
    if (changeTab) {
      setTab(id);
    }
  }

  return (
    <div className={classes.nav}>
      <div
        className={tab === 1 ? classes.active : null}
        onClick={() => select(1)}
        aria-disabled={!changeTab}
      >
        <Truck width={30} height={30} />
        <span>{t("delivery_info")}</span>
      </div>
      <div
        className={tab === 2 ? classes.active : null}
        onClick={() => select(2)}
        aria-disabled={!changeTab}
      >
        <InfoCircle width={30} height={30} />
        <span>{t("billing_info")}</span>
      </div>
      <div
        className={tab === 3 ? classes.active : null}
        onClick={() => select(3)}
        aria-disabled={!changeTab}
      >
        <Truck width={30} height={30} />
        <span>{t("shipping_info")}</span>
      </div>
      <div
        className={tab === 4 ? classes.active : null}
        onClick={() => select(4)}
        aria-disabled={!changeTab}
      >
        <ViewList width={30} height={30} />
        <span>{t("review_order")}</span>
      </div>
      <div
        className={tab === 5 ? classes.active : null}
        onClick={() => select(5)}
        aria-disabled={!changeTab}
      >
        <CreditCard width={30} height={30} />
        <span>{t("payment")}</span>
      </div>
      <div
        className={tab === 6 ? classes.active : null}
        // onClick={() => setTab(6)}
        aria-disabled={!changeTab}
      >
        <BagCheck width={30} height={30} />
        <span>{t("confirmation")}</span>
      </div>
    </div>
  );
};

export default CheckoutNav;
