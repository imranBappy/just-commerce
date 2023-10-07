import { useEffect, useState } from "react";
import Classes from "./scrollToTop.module.css";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  function scrollCheck() {
    if (window.pageYOffset > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollCheck);
    return () => {
      window.removeEventListener("scroll", scrollCheck);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button onClick={scrollToTop} className={Classes.button}>
          &#8679;
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
