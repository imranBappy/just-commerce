import { List, Search, XSquare } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ImageLoader from "~/components/Image";
import c from "./mobileNav.module.css";
import SearchBar from "./searchbar";
import Sidebar from "./sidebar";

export default function MobileNav() {
  const [show, setShow] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const settings = useSelector((state) => state.settings);
  const toggleSidebar = () => setShow(!show);
  const toggleSearchbar = () => setShowSearch(!showSearch);
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShow(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav className={c.nav}>
        <div className={c.start}>
          <button
            className={c.sidebar_button}
            onClick={() => toggleSidebar()}
            title="Menu"
          >
            <List width={51} height={35} />
          </button>
          <div className={c.brand}>
            <Link href="/">
              {settings.settingsData.logo[0] ? (
                    <ImageLoader
                      src={settings.settingsData.logo[0]?.url}
                      width={250}
                      height={70}
                      quality={100}
                      alt={settings.settingsData.name}
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : (
                    <h3 className="text-white mr-2 mb-0">{settings.settingsData.name}</h3> // This will be displayed when the logo is not found.
                  )}
            </Link>
          </div>
          <div className={c.end}>
            <Search width={25} height={25} onClick={toggleSearchbar} />
          </div>
        </div>
      </nav>
      {showSearch && (
        <div className={c.searchbar}>
          <SearchBar />
          <XSquare width={25} height={25} onClick={toggleSearchbar} />
        </div>
      )}
      <Sidebar show={show} toggle={toggleSidebar} />
    </>
  );
}
