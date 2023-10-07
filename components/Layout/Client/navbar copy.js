import {
  BoxArrowInRight,
  GeoAlt,
  Heart,
  Person,
  PersonPlus,
  Repeat,
  Telephone,
} from "@styled-icons/bootstrap";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageLoader from "~/components/Image";
import c from "./navbar.module.css";
import SearchBar from "./searchbar";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const CartView = dynamic(() => import("./cartView"), { ssr: false });
const CategoryMenu = dynamic(() => import("./categoryMenu"), { ssr: false });

const NavBar = () => {
  const [hideTopBar, setHideTopBar] = useState(false);
  // Selecting session from global state
  const { session } = useSelector((state) => state.localSession);
  // Selecting settings from global state
  const { settingsData } = useSelector((state) => state.settings);
  const { wishlist, compare } = useSelector((state) => state.cart);
  const [std, setStd] = useState(settingsData);
  const { t } = useTranslation();
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setStd(settingsData);
  }, [settingsData]);

  const router = useRouter();

  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position > 110) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  };

  const goToWishList = () => {
    if (session) {
      router.push("/profile?tab=1");
    } else {
      toast.warning("You need to login to create a Wishlist");
    }
  };

  const navItem = [
    {
      id: 1,
      name: t("home"),
      to: "/",
    },
    {
      id: 2,
      name: t("shop"),
      to: "/gallery",
    },
    {
      id: 3,
      name: t("all_categories"),
      to: "/categories",
    },
    {
      id: 4,
      name: t("faq"),
      to: "/faq",
    },
    {
      id: 5,
      name: t("about"),
      to: "/about",
    },
  ];

  return (
    <>
      <nav
        className={`${c.nav} ${hideTopBar ? c.hide_top_bar : c.show_top_bar}`}
      >
        <div className={c.top_bar}>
          <div>
            <div className={c.top_bar_left}>
              <div
                className={`${c.top_bar_content} ${c.top_bar_content_p_left}`}
              >
                <GeoAlt width={15} height={15} />
                {std.shortAddress}
              </div>
              <div
                className={`${c.top_bar_content} ${c.top_bar_content_p_left}`}
              >
                <Telephone width={15} height={15} />
                {std.phoneHeader}
              </div>
            </div>
            <div className={c.top_bar_right}>
              <LanguageSwitcher />
              {!session && (
                <Link href="/signup">
                  <div
                    className={`${c.top_bar_content} ${c.top_bar_content_p_right}`}
                  >
                    <PersonPlus width={16} height={16} />
                    {t("register")}
                  </div>
                </Link>
              )}
              <div
                className={`${c.top_bar_content} ${c.top_bar_content_p_right}`}
              >
                <Person width={16} height={16} />
                {!session && (
                  <Link href="/signin">
                    <span>{t("signin")}</span>
                  </Link>
                )}
                {session && (
                  <Link href="/profile">
                    <span>{session.user.name}</span>
                  </Link>
                )}
              </div>
              {session && (
                <div
                  className={`${c.top_bar_content} ${c.top_bar_content_p_right}`}
                >
                  <BoxArrowInRight width={16} height={16} />
                  <span onClick={() => signOut({ callbackUrl: "/" })}>
                    {t("signout")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr />
        <div className={c.container}>
          <div className={c.start}>
            <div className={c.brand}>
              <Link href="/">
                {std.logo[0] && (
                  <ImageLoader
                    src={std.logo[0]?.url}
                    width={155}
                    height={44}
                    alt={std.name}
                  />
                )}
              </Link>
            </div>
          </div>
          <div className={c.center}>
            <SearchBar />
          </div>
          <div className={c.end}>
            <Link href={"/compare"} passHref legacyBehavior>
              <div>
                <Repeat width={24} height={24} />
                <span>{compare.length || 0}</span>
                <p>{t("compare")}</p>
              </div>
            </Link>
            <div onClick={goToWishList}>
              <Heart width={24} height={24} />
              <span>{wishlist || 0}</span>
              <p>{t("wishlist")}</p>
            </div>
            <CartView />
          </div>
        </div>
        <hr />
        <div className={c.bottom_bar}>
          <CategoryMenu />
          <div className={c.nav_link}>
            <ul className={c.ul}>
              {navItem.map((item, index) => (
                <li className={c.list} key={index}>
                  <div className={c.item}>
                    <Link href={item.to}>{item.name}</Link>
                  </div>
                </li>
              ))}
              {session && (session.user.a || session.user.s.status) && (
                <li className={c.list}>
                  <div className={c.item}>
                    <Link href="/dashboard">{t("dashboard")}</Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className={c.track}>
            <Link href="/order-track">
              <GeoAlt width={18} height={18} />
              {t("track_order")}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default memo(NavBar);
