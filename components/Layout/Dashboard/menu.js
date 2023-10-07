import {
  BagCheck,
  BoxSeam,
  CardText,
  Palette,
  PeopleFill,
  Star,
  UiChecksGrid,
} from "@styled-icons/bootstrap";
import {
  Dashboard,
  Email,
  LocalShipping,
  Settings,
  SettingsSuggest,
} from "@styled-icons/material";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { filterPermission } from "~/lib/clientFunctions";
import classes from "./menu.module.css";
import { useTranslation } from "react-i18next";

const DashboardMenu = (props) => {
  const { session } = useSelector((state) => state.localSession);
  const { t } = useTranslation();
  const isOpen = props.menuState;
  const menuData = [
    {
      name: t("dashboard"),
      icon: <Dashboard width={20} height={20} />,
      target: "yes",
      subMenu: [
        {
          name: t("dashboard"),
          url: "/dashboard",
        },
      ],
    },
    {
      name: t("products"),
      icon: <BoxSeam width={20} height={20} />,
      target: "product",
      subMenu: [
        {
          name: t("all_products"),
          url: "/dashboard/product",
        },
        {
          name: t("add_new_product"),
          url: "/dashboard/product/create",
          create: true,
        },
      ],
    },
    {
      name: t("orders"),
      icon: <BagCheck width={20} height={20} />,
      target: "order",
      subMenu: [
        {
          name: t("all_orders"),
          url: "/dashboard/orders",
        },
      ],
    },
    {
      name: t("categories"),
      icon: <UiChecksGrid width={20} height={20} />,
      target: "category",
      subMenu: [
        {
          name: t("category_list"),
          url: "/dashboard/categories",
        },
        {
          name: t("Add New Category"),
          url: "/dashboard/categories/create",
          create: true,
        },
        {
          name: t("Subcategory List"),
          url: "/dashboard/categories/subcategories",
        },
        {
          name: t("Add New Subcategory"),
          url: "/dashboard/categories/subcategories/create",
          create: true,
        },
      ],
    },
    {
      name: t("Coupons"),
      icon: <CardText width={20} height={20} />,
      target: "coupon",
      subMenu: [
        {
          name: t("All Coupons"),
          url: "/dashboard/coupons",
        },
        {
          name: t("Add New Coupon"),
          url: "/dashboard/coupons/create",
          create: true,
        },
      ],
    },
    {
      name: t("Colors"),
      icon: <Palette width={20} height={20} />,
      target: "color",
      subMenu: [
        {
          name: t("All Colors"),
          url: "/dashboard/colors",
        },
        {
          name: t("Add New Color"),
          url: "/dashboard/colors/create",
          create: true,
        },
      ],
    },
    {
      name: t("Attributes"),
      icon: <SettingsSuggest width={20} height={20} />,
      target: "attribute",
      subMenu: [
        {
          name: t("All Attributes"),
          url: "/dashboard/attributes",
        },
        {
          name: t("Add New Attribute"),
          url: "/dashboard/attributes/create",
          create: true,
        },
      ],
    },
    {
      name: t("Brands"),
      icon: <Star width={20} height={20} />,
      target: "brand",
      subMenu: [
        {
          name: t("All Brands"),
          url: "/dashboard/brand",
        },
        {
          name: t("Add New Brand"),
          url: "/dashboard/brand/create",
          create: true,
        },
      ],
    },
    {
      name: t("Shipping Charges"),
      icon: <LocalShipping width={20} height={20} />,
      target: "shippingCharges",
      subMenu: [
        {
          name: t("Modify Shipping Charges"),
          url: "/dashboard/shipping",
        },
      ],
    },
    {
      name: t("Subscribers"),
      icon: <Email width={20} height={20} />,
      target: "subscriber",
      subMenu: [
        {
          name: t("Subscriber List"),
          url: "/dashboard/subscribers",
        },
      ],
    },
    {
      name: t("Customers"),
      icon: <PeopleFill width={20} height={20} />,
      target: "customers",
      subMenu: [
        {
          name: t("Customer List"),
          url: "/dashboard/users",
        },
      ],
    },
    {
      name: t("Manager"),
      icon: <PeopleFill width={20} height={20} />,
      target: "no",
      subMenu: [
        {
          name: t("Staff List"),
          url: "/dashboard/staffs",
        },
        {
          name: t("Create New Staff"),
          url: "/dashboard/staffs/create",
        },
      ],
    },
    {
      name: t("Settings"),
      icon: <Settings width={20} height={20} />,
      target: "settings",
      subMenu: [
        {
          name: t("General Settings"),
          url: "/dashboard/settings",
        },
        {
          name: t("Layout Settings"),
          url: "/dashboard/settings/layout",
        },
        {
          name: t("Graphics Content"),
          url: "/dashboard/settings/graphics",
        },
        {
          name: t("Seo"),
          url: "/dashboard/settings/seo",
        },
        {
          name: t("Script"),
          url: "/dashboard/settings/script",
        },
        {
          name: t("Payment Gateway"),
          url: "/dashboard/settings/gateway",
        },
        {
          name: t("Social Media Login"),
          url: "/dashboard/settings/login",
        },
        {
          name: t("Security"),
          url: "/dashboard/settings/security",
        },
      ],
    },
    {
      name: t("Page Settings"),
      icon: <Settings width={20} height={20} />,
      target: "pageSettings",
      subMenu: [
        {
          name: t("Home Page"),
          url: "/dashboard/page/home",
        },
        {
          name: t("about_us"),
          url: "/dashboard/page/about",
        },
        {
          name: t("privacy_policy"),
          url: "/dashboard/page/privacy",
        },
        {
          name: t("terms_and_conditions"),
          url: "/dashboard/page/terms",
        },
        {
          name: t("return_policy"),
          url: "/dashboard/page/return",
        },
        {
          name: t("faq"),
          url: "/dashboard/page/faq",
        },
      ],
    },
  ];

  const [clicked, setClicked] = useState("0");

  const handleClick = (index) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
  };

  return (
    <div className={`${classes.menu} ${isOpen ? classes.show : classes.hide}`}>
      <div className={classes.sidebar_inner}>
        <div className="flex-shrink-0">
          <ul className={classes.list_auto}>
            {session && session.user.s.status
              ? filterPermission(session, menuData).map((menu, index) => (
                  <Item menu={menu} index={index} key={index} />
                ))
              : menuData.map((menu, index) => (
                  <Item menu={menu} index={index} key={index} />
                ))}
          </ul>
        </div>
      </div>
    </div>
  );

  function Item({ menu, index }) {
    return (
      <li className={classes.menu_list}>
        <button
          className={clicked === index ? classes.button_active : ""}
          onClick={() => handleClick(index)}
        >
          {menu.icon} {menu.name}
        </button>
        <div className={clicked === index ? classes.expand : classes.collapse}>
          <ul className={classes.collapse_item}>
            {menu.subMenu.map((subMenu, i) => (
              <li key={i} className={classes.sublist}>
                <Link href={subMenu.url} className="link-dark category-btn-ind">
                  {subMenu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }
};

export default React.memo(DashboardMenu);
