import { useSyncLanguage } from "ni18n";
import { useEffect, useState } from "react";
import c from "./languageSwitcher.module.css";
import ImageLoader from "../Image";
import OutsideClickHandler from "../ClickOutside";
import { useSelector } from "react-redux";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState(0);
  const [show, setShow] = useState(false);
  const settings = useSelector((state) => state.settings);
  const defaultLanguage = settings.settingsData.language;
  const lists = [
    { name: "English", id: "en", flag: "/images/flags/us.svg" },
    { name: "বাংলা", id: "bn", flag: "/images/flags/bd.svg" },
    { name: "العربية", id: "ar", flag: "/images/flags/ar.svg" },
    { name: "Français", id: "fr", flag: "/images/flags/fr.svg" },
  ];
  useSyncLanguage(lists[lang]?.id);

  function handleClick(idx) {
    try {
      setLang(idx);
      setShow(false);
      const language = lists[idx]?.id || "en";
      document.documentElement.lang = language;
      // const body = document.getElementsByTagName("BODY")[0];
      // body.dir = language === ("ar" || "he") ? "rtl" : "ltr";
      window?.localStorage.setItem("LANGUAGE", language);
    } catch (err) {
      console.log(err.message);
    }
  }

  function findId(code) {
    return lists.findIndex((x) => x.id === code);
  }

  useEffect(() => {
    try {
      const lang = window?.localStorage.getItem("LANGUAGE");
      if (lang && lang.length > 0) {
        const id = findId(lang);
        if (id > -1) {
          setLang(id);
          document.documentElement.lang = lists[id].id;
        }
      } else {
        const id = findId(defaultLanguage);
        if (id > -1) {
          setLang(id);
          document.documentElement.lang = lists[id].id;
        }
      }
    } catch (err) {
      console.log(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OutsideClickHandler show={true} onClickOutside={() => setShow(false)}>
      <div className={c.lang}>
        <div className={c.disp} onClick={() => setShow(!show)}>
          <ImageLoader
            width={18}
            height={14}
            alt={lists[lang]?.name}
            src={lists[lang]?.flag}
          />
          <span>{lists[lang]?.name}</span>
        </div>
        <ul className={show ? c.show : undefined}>
          {lists.map((data, idx) => (
            <li key={idx} onClick={() => handleClick(idx)}>
              <ImageLoader
                width={18}
                height={14}
                alt={data.name}
                src={data.flag}
              />
              <span>{data.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </OutsideClickHandler>
  );
}
