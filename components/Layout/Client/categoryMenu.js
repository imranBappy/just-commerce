import { ArrowRepeat, TextLeft } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OutsideClickHandler from "~/components/ClickOutside";
import ImageLoader from "~/components/Image";
import { fetchData } from "~/lib/clientFunctions";
import c from "./categoryMenu.module.css";
import { useTranslation } from "react-i18next";

export default function CategoryMenu() {
  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  async function GetData() {
    const url = `/api/home/categories?only_category=true`;
    const data = await fetchData(url);
    data.success ? setCat(data.category) : setCat(null);
    setLoading(false);
  }
  useEffect(() => {
    GetData();
  }, []);

  const toggleCategory = () => setShowCategory(!showCategory);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShowCategory(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c.category_container}>
      <button className="text-white bg-transparent border-0" onClick={() => toggleCategory()}>
        {t("categories")}
      </button>
      <OutsideClickHandler
        show={showCategory}
        onClickOutside={() => setShowCategory(false)}
      >
        <div className={c.menu}>
          {loading ? (
            <div className={c.loader}>
              <ArrowRepeat width={30} height={30} />
            </div>
          ) : !cat ? (
            <div>Something Went Wrong</div>
          ) : (
            <ul>
              {cat.map((item, idx) => (
                <li key={idx} className={c.item}>
                  <Link
                    href={`/gallery?category=${item.slug}`}
                    className={c.link}
                    shallow={true}
                  >
                    <ImageLoader
                      src={item.icon[0]?.url}
                      width={20}
                      height={20}
                      alt={item.name}
                    />
                    <span>{item.name}</span>
                  </Link>
                  {item.subCategories && item.subCategories.length > 0 && (
                    <div className={c.subMenu}>
                      <ul>
                        {item.subCategories.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              href={`/gallery?category=${subItem.slug}&parent=${item.slug}`}
                              shallow={true}
                            >
                              <span>{subItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
              <li className={c.item}>
                <Link
                  href={`/categories`}
                  className="justify-content-center fw-bold"
                >
                  {t("see_all")}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
