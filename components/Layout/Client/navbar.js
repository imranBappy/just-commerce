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

        <div>
          <div className={c.container}>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
              <div className={c.brand}>
                <Link href="/">
                  {std.logo[0] ? (
                    <ImageLoader
                      src={std.logo[0]?.url}
                      width={171}
                      height={28}
                      alt={std.name}
                      className="mr-2"
                    />
                  ) : (
                    <h3 className="text-white mr-2 mb-0">{std.name}</h3> // This will be displayed when the logo is not found.
                  )}
                </Link>
              </div>
                
                <SearchBar />
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-end">
              {session && (session.user.a || session.user.s.status) && (
                <li className={c.list}>
                  <div className={c.item}>
                    <Link className="text-white" href="/dashboard">{t("dashboard")}</Link>
                  </div>
                </li>
              )}
              <CategoryMenu />
              <Link href={"/compare"} passHref legacyBehavior>
                <div className={c.end}>
                  <div>
                    <span>{compare.length || 0}</span>
                    <p className="mb-0">{t("compare")}</p>
                  </div>
                </div>
              </Link>
              <div className={c.end} onClick={goToWishList}>
                <div>
                  <span>{wishlist || 0}</span>
                  <p className="mb-0">{t("wishlist")}</p>
                </div>
              </div>
              <div className={c.end}><CartView /></div>
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle text-white border-0"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Account
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {!session && (
                    <Link href="/signup">
                      <div
                        className={`${c.top_bar_content} ${c.top_bar_content_p_right} dropdown-item"`}
                      >
                        <PersonPlus width={16} height={16} />
                        {t("register")}
                      </div>
                    </Link>
                  )}

                  
                  {!session && (
                    <Link href="/signin">
                      <div
                        className={`${c.top_bar_content} ${c.top_bar_content_p_right} dropdown-item"`}
                      >
                        <PersonPlus width={16} height={16} />
                        <span>{t("signin")}</span>
                      </div>
                      
                    </Link>
                  )}

                  {session && (
                    <Link href="/profile" className="dropdown-item">
                      <Person width={16} height={16} />
                      <span>{session.user.name}</span>
                    </Link>
                  )}

                  {session && (
                    <div
                      className={`dropdown-item ${c.top_bar_content} ${c.top_bar_content_p_right}`}
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
            
          </div>
        </div>
      </nav>
    </>
  );
};

export default memo(NavBar);
