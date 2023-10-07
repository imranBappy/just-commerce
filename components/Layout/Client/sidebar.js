import { XLg } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useSelector } from "react-redux";
import c from "./sidebar.module.css";
import { signOut } from "next-auth/react";
import LanguageSwitcher from "~/components/LanguageSwitcher";

const navItem = [
  {
    id: 1,
    name: "Home",
    to: "/",
  },
  {
    id: 2,
    name: "Shop",
    to: "/gallery",
  },
  {
    id: 3,
    name: "All Categories",
    to: "/categories",
  },
  {
    id: 4,
    name: "Compare",
    to: "/compare",
  },
  {
    id: 5,
    name: "Faq",
    to: "/faq",
  },
  {
    id: 6,
    name: "About",
    to: "/about",
  },
];

export default function Sidebar({ show, toggle }) {
  const { session } = useSelector((state) => state.localSession);
  return (
    <div className={show ? `${c.sidebar} ${c.show}` : `${c.sidebar} ${c.hide}`}>
      <div className={c.header}>
        <h4>Menu</h4>
        <XLg width={25} height={25} onClick={toggle} />
      </div>
      <div className={c.sidebar_link}>
        <ul className={c.sidebar_ul}>
          {navItem.map((item, index) => (
            <li className={c.sidebar_list} key={index}>
              <div className={c.sidebar_item}>
                <Link href={item.to}>{item.name}</Link>
              </div>
            </li>
          ))}
          {!session && (
            <>
              <li className={c.sidebar_list}>
                <div className={c.sidebar_item}>
                  <Link href="/signup">Register</Link>
                </div>
              </li>
              <li className={c.sidebar_list}>
                <div className={c.sidebar_item}>
                  <Link href="/signin">Sign in</Link>
                </div>
              </li>
            </>
          )}
          {session && (
            <>
              <li className={c.sidebar_list}>
                <div className={c.sidebar_item}>
                  <Link href="/">{session.user.name}</Link>
                </div>
              </li>
              <li className={c.sidebar_list}>
                <div className={c.sidebar_item}>
                  <span onClick={() => signOut({ callbackUrl: "/" })}>
                    Logout
                  </span>
                </div>
              </li>
            </>
          )}
          {session && (session.user.a || session.user.s.status) && (
            <li className={c.sidebar_list}>
              <div className={c.sidebar_item}>
                <Link href="/dashboard">Dashboard</Link>
              </div>
            </li>
          )}
          <li className={c.sidebar_list}>
            <div className={c.sidebar_item}>
              <LanguageSwitcher />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
