import {
  Facebook,
  Instagram,
  PinterestAlt,
  Twitter,
  Youtube,
} from "@styled-icons/boxicons-logos";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ImageLoader from "~/components/Image";
import classes from "./footer.module.css";
import Newsletter from "./newsletter";
import { Headset, ShieldCheck, Truck } from "@styled-icons/bootstrap";
import { useTranslation } from "react-i18next";

const Footer = (props) => {
  // Selecting settings from global state
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const footer_link = {
    company: [
      {
        name: t("about_us"),
        link: "/about",
      },
    ],
    shop: [
      {
        name: t("faq"),
        link: "/faq",
      },
      {
        name: t("privacy_policy"),
        link: "/privacy",
      },
      {
        name: t("terms_and_conditions"),
        link: "/terms",
      },
      {
        name: t("return_policy"),
        link: "/return",
      },
    ],
    account: [
      {
        name: t("signin"),
        link: "/signin",
      },
      {
        name: t("profile"),
        link: "/profile",
      },
      {
        name: t("track_order"),
        link: "/order-track",
      },
    ],
  };

  if (props.visibility)
    return (
      <>
      
        <footer className={classes.footer_container}>
          <div className="custom_container">
            <div className="row m-0">
              <div className="col-md-4 px-0 py-4">
                <div className={classes.icon_container}>
                  <ShieldCheck className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.security.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.security.description}
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-0 py-4">
                <div className={classes.icon_container}>
                  <Headset className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.support.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.support.description}
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-0 py-4">
                <div className={classes.icon_container}>
                  <Truck className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.delivery.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.delivery.description}
                  </p>
                </div>
              </div>
            </div>
            <hr className="mx-0" />
            <Newsletter />
            <div className="row">
              <div className="col-md-3 px-3 py-2">
                <Link href="/">
                  <div className={classes.logo}>
                    {settings.settingsData.logo[0] && (
                      <ImageLoader
                        src={settings.settingsData.logo[0]?.url}
                        width={145}
                        height={45}
                        alt={settings.settingsData.name}
                      />
                    )}
                  </div>
                </Link>
                <div className={classes.address}>
                  <h1>{settings.settingsData.description}</h1>
                </div>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>{t("contact_info")}</h3>
                <div className={classes.address}>
                  <div>
                    <label>{t("address")}:</label>
                    <p>{settings.settingsData.address}</p>
                  </div>
                  <div>
                    <label>{t("email")}:</label>
                    <a
                      className={classes.address_content}
                      href={`mailto:${settings.settingsData.email}`}
                    >
                      {settings.settingsData.email}
                    </a>
                  </div>
                  <div>
                    <label>{t("phone")}:</label>
                    <a
                      className={classes.address_content}
                      href={`tel:${settings.settingsData.phoneFooter}`}
                    >
                      {settings.settingsData.phoneFooter}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>{t("quick_links")}</h3>
                <ul className={classes.list}>
                  {footer_link.shop.map((link) => (
                    <li className={classes.list_item} key={link.name}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>{t("my_account")}</h3>
                <ul className={classes.list}>
                  {footer_link.account.map((link) => (
                    <li className={classes.list_item} key={link.name}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <hr />
            <div className="row m-0">
              <div className="col-md-3 p-2">
                <p className={classes.copyright}>
                  {settings.settingsData.copyright}
                </p>
              </div>
              <div className="col-md-6 p-2">
                <div className={classes.gateway}>
                  {settings.settingsData.gatewayImage[0] && (
                    <ImageLoader
                      src={settings.settingsData.gatewayImage[0]?.url}
                      alt={settings.settingsData.gatewayImage[0]?.name}
                      width={565}
                      height={37}
                      style={{
                        width: "auto",
                        height: "100%",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-3 p-2">
                <div className={classes.social}>
                  <a
                    href={settings.settingsData.social.facebook}
                    className={classes.social_icon}
                    aria-label="Facebook"
                  >
                    <Facebook width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.instagram}
                    className={classes.social_icon}
                    aria-label="Instagram"
                  >
                    <Instagram width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.twitter}
                    className={classes.social_icon}
                    aria-label="Twitter"
                  >
                    <Twitter width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.youtube}
                    className={classes.social_icon}
                    aria-label="Youtube"
                  >
                    <Youtube width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.pinterest}
                    className={classes.social_icon}
                    aria-label="Pinterest"
                  >
                    <PinterestAlt width={30} height={30} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );

  return null;
};

export default React.memo(Footer);
