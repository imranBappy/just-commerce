import { ArrowRepeat, Search } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import OutsideClickHandler from "~/components/ClickOutside";
import ImageLoader from "~/components/Image";
import { fetchData } from "~/lib/clientFunctions";
import classes from "./searchbar.module.css";
import { useTranslation } from "react-i18next";

export default function SearchBar() {
  const [searchData, setSearchData] = useState([]);
  const [searching, setSearching] = useState(false);
  const search = useRef("");
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const hideSearchBar = () => {
    search.current.value = "";
    setSearchData([]);
  };
  const searchItem = async () => {
    setSearching(true);
    try {
      const options = {
        threshold: 0.3,
        keys: ["name"],
      };
      const product = await fetchData(`/api/home/product_search`);
      const Fuse = (await import("fuse.js")).default;
      const fuse = new Fuse(product.product, options);
      setSearchData(fuse.search(search.current.value));
    } catch (err) {
      console.log(err);
    }
    setSearching(false);
  };

  return (
    <div className={classes.searchBar_def}>
      <input
        type="text"
        ref={search}
        className={classes.searchInput_def}
        onInput={searchItem}
        placeholder={t("search_your_product")}
      />
      {searching && (
        <span className={classes.spinner_def}>
          <ArrowRepeat width={17} height={17} />
        </span>
      )}
      <span className={classes.search_icon_def}>
        <Search width={15} height={15} />
      </span>
      <OutsideClickHandler
        show={searchData.length > 0}
        onClickOutside={hideSearchBar}
      >
        <ul className={classes.searchData_def}>
          {searchData.map((product, index) => (
            <li key={index}>
              <Link
                href={`/product/${product.item.slug}`}
                onClick={hideSearchBar}
              >
                <div className={classes.thumb}>
                  <ImageLoader
                    src={product.item.image[0]?.url}
                    alt={product.item.name}
                    width={80}
                    height={80}
                  />
                </div>
                <div className={classes.content}>
                  <p>{product.item.name}</p>
                  <div
                    className={classes.unit}
                  >{`${product.item.unitValue} ${product.item.unit}`}</div>
                  <span>
                    {settings.settingsData.currency.symbol +
                      product.item.discount}
                    {product.item.discount < product.item.price && (
                      <del>
                        {settings.settingsData.currency.symbol +
                          product.item.price}
                      </del>
                    )}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </OutsideClickHandler>
    </div>
  );
}
