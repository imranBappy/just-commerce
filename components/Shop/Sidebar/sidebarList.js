import { Filter } from "@styled-icons/bootstrap/Filter";
import React, { useEffect, useState } from "react";
import BrandList from "./brand";
import ShortMenu from "./ShortMenu";
import SidebarCategoryList from "./category";
import c from "./sidebarList.module.css";
import { XLg } from "@styled-icons/bootstrap";
import { useTranslation } from "react-i18next";

function SidebarList(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const position = window.pageYOffset;
    const width = window.innerWidth;
    if (width < 992) {
      setHideTopBar(true);
    } else if (position > 110) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  };

  const toggleFilter = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Sidebar Button */}
      <div
        className={`${c.filter_btn} ${sidebarOpen ? c.b_left : ""}`}
        onClick={toggleFilter}
      >
        <Filter width={33} height={33} />
        <span>{t("filter")}</span>
      </div>
      {/* Sidebar */}
      <div className={`${c.header} ${sidebarOpen ? c.s_left : ""}`}>
        <h4>{t("filter")}</h4>
        <XLg width={25} height={25} onClick={toggleFilter} />
      </div>
      <div
        className={`${c.sidebar} ${sidebarOpen ? c.s_left : ""} ${
          hideTopBar ? c.sidebar_top_scroll : c.sidebar_top_normal
        }`}
      >
        <div className={c.sidebar_inner}>
          <label>{t("sort_by")}</label>
          <ShortMenu update={props.sort} />
          {/* category menu */}
          <div className={c.category_item}>
            <label>{t("categories")}</label>
            <SidebarCategoryList
              category={props.category}
              updateCategory={props.updateCategory}
              updateSubCategory={props.updateSubCategory}
            />
          </div>
          {/* brand menu */}
          <div className={c.category_item}>
            <label>{t("brands")}</label>
            <BrandList brand={props.brand} updateBrand={props.updateBrand} />
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(SidebarList);
