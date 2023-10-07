import { XLg } from "@styled-icons/bootstrap";
import { useEffect, useState } from "react";
import classes from "./cookieContest.module.css";

function CookieContest() {
  const [visible, setVisible] = useState(false);
  function hideCookieContest() {
    setVisible(false);
  }

  function setCookie(name, value, extend) {
    let dt = new Date();
    dt.setTime(dt.getTime() + extend * 24 * 60 * 60 * 1000);
    if (document) {
      document.cookie = `${name}=${value};expires=${dt.toUTCString()};path=/;`;
    }
  }
  function getCookie(name) {
    const n = `${name}=`;
    if (document) {
      const dc = decodeURIComponent(document.cookie);
      const accepted = dc.split(";");
      for (var i = 0; i < accepted.length; i++) {
        var c = accepted[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(n) === 0) {
          return c.substring(n.length, c.length);
        }
      }
      return "";
    }
  }
  function acceptCookie() {
    if (!getCookie("cookie_contest")) {
      setCookie("cookie_contest", true, 30);
      setVisible(false);
    }
  }

  useEffect(() => {
    if (!getCookie("cookie_contest")) {
      setVisible(true);
    }
  }, []);

  return (
    <>
      {visible && (
        <div className={classes.wrapper}>
          <div className={classes.card}>
            <XLg width={14} height={14} onClick={hideCookieContest} />
            <div className={classes.content}>
              <div className={classes.text}>
                <p className="cookies-popup-text-top">
                  We use cookies to ensure that we give you the best experience
                  on our website.
                </p>
                <span>For more info read</span>
                <span>&nbsp;</span>
                <a href="/privacy" target="_blank">
                  Privacy policy
                </a>
              </div>
            </div>
            <div className={classes.button_container}>
              <button className={classes.accept_button} onClick={acceptCookie}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CookieContest;
