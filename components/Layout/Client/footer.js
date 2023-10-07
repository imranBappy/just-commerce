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
          <div className="custom_container hidden-sm">
            <div className="row m-0">
              <div className="col-md-6 pl-0 py-4 pr-4">
                <Link href="/">
                  <div className={classes.logo}>
                    {settings.settingsData.logo[0] && (
                      <ImageLoader
                        src={settings.settingsData.logo[0]?.url}
                        width={233}
                        height={38}
                        alt={settings.settingsData.name}
                      />
                    )}
                  </div>
                </Link>
                <div className="text-white py-4 pr-2 font-weight-normal">
                  {settings.settingsData.description}
                </div>
              </div>
              <div className="col-md-6 px-0 py-4">
                <div className={classes.address}>
                  <div className="d-flex align-items-center my-2">
                    <label className="mr-2 text-white">{t("address")}:</label>
                    <p
                      className="text-white"
                      dangerouslySetInnerHTML={{
                        __html: settings.settingsData.address,
                      }}
                    />
                  </div>
                  <div className="d-flex align-items-center my-2">
                    <label className="mr-2 text-white">{t("email")}:</label>
                    <p
                      className="text-white"
                      dangerouslySetInnerHTML={{
                        __html: settings.settingsData.email,
                      }}
                    />
                  </div>
                  <div className="d-flex align-items-center my-2">
                    <label className="mr-2 text-white">{t("phone")}:</label>
                    <p
                      className="text-white"
                      dangerouslySetInnerHTML={{
                        __html: settings.settingsData.phoneFooter,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="custom_container">
            <div className="row m-0">
              <div className="col-md-5 p-2">
                <p className="text-white mb-0">
                  {settings.settingsData.copyright}
                </p>
              </div>
              <div className="col-md-3 p-2">
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
              <div className="col-md-4 p-2">
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
        {settings.settingsData.footerBanner.support.title ? (
          <a
            href={`https://api.whatsapp.com/send?phone=${settings.settingsData.footerBanner.support.title}`}
            className="wasu"
            target="_blank"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              t="1569683925316"
              viewBox="0 0 1024 1024"
              version="1.1"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <path d="M713.5 599.9c-10.9-5.6-65.2-32.2-75.3-35.8-10.1-3.8-17.5-5.6-24.8 5.6-7.4 11.1-28.4 35.8-35 43.3-6.4 7.4-12.9 8.3-23.8 2.8-64.8-32.4-107.3-57.8-150-131.1-11.3-19.5 11.3-18.1 32.4-60.2 3.6-7.4 1.8-13.7-1-19.3-2.8-5.6-24.8-59.8-34-81.9-8.9-21.5-18.1-18.5-24.8-18.9-6.4-0.4-13.7-0.4-21.1-0.4-7.4 0-19.3 2.8-29.4 13.7-10.1 11.1-38.6 37.8-38.6 92s39.5 106.7 44.9 114.1c5.6 7.4 77.7 118.6 188.4 166.5 70 30.2 97.4 32.8 132.4 27.6 21.3-3.2 65.2-26.6 74.3-52.5 9.1-25.8 9.1-47.9 6.4-52.5-2.7-4.9-10.1-7.7-21-13z"></path>
              <path d="M925.2 338.4c-22.6-53.7-55-101.9-96.3-143.3-41.3-41.3-89.5-73.8-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6 0.3-119.3 12.3-174.5 35.9-53.3 22.8-101.1 55.2-142 96.5-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9 0.3 69.4 16.9 138.3 48 199.9v152c0 25.4 20.6 46 46 46h152.1c61.6 31.1 130.5 47.7 199.9 48h2.1c59.9 0 118-11.6 172.7-34.3 53.5-22.3 101.6-54.3 142.8-95.2 41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5 0.3-60.9-11.5-120-34.8-175.6z m-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-0.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-0.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-0.6 99.6-39.7 192.9-110.1 262.7z"></path>
            </svg>
          </a>
        ) : null}
        {settings.settingsData.footerBanner.support.description ? (
          <a
            href={`https://t.me/${settings.settingsData.footerBanner.support.description}`}
            className="tasu"
            target="_blank"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 256 256"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M234.27,29.22a5,5,0,0,0-5.1-.87L26.51,107.66a10.22,10.22,0,0,0,1.75,19.56L84,138.16V200a12,12,0,0,0,7.51,11.13A12.1,12.1,0,0,0,96,212a12,12,0,0,0,8.62-3.68l28-29,43,37.71a12,12,0,0,0,7.89,3,12.47,12.47,0,0,0,3.74-.59,11.87,11.87,0,0,0,8-8.72L235.87,34.12A5,5,0,0,0,234.27,29.22ZM28,117.38a2.13,2.13,0,0,1,1.42-2.27L204.07,46.76l-117,83.85L29.81,119.37A2.12,2.12,0,0,1,28,117.38Zm70.87,85.38A4,4,0,0,1,92,200V143.7L126.58,174Zm88.58,6.14a4,4,0,0,1-6.57,2.09L94.43,135.18,226.13,40.8Z"></path>
            </svg>
          </a>
        ) : null}
      </>
    );

  return null;
};

export default React.memo(Footer);
