import Link from "next/link";
import ImageLoader from "../Image";
import c from "./brandList.module.css";
import { useTranslation } from "react-i18next";

export default function BrandCardList({ items }) {
  const { t } = useTranslation();

  return (
    <div className="custom_container">
      <div className="content_heading">
        <h2>{t("top_brands")}</h2>
        <p>{t("top_brandss")}</p>
      </div>
      
      <div className="row row-cols-xxl-6 row-cols-xl-5 row-cols-lg-4 row-cols-md-4 row-cols-2 gutters-16 border-top border-start mx-0">
        {items.map((item, i) => (
          <Link
            href={`/gallery?brand=${item.slug}`}
            key={item._id + i}
            className="col text-center border-end border-bottom p-0"
          >
            <div className={c.card}>
              <ImageLoader
                src={item.image[0]?.url}
                alt={item.name}
                width={180}
                height={120}
                style={{ width: "auto", height: "70px" }}
              />
              <div className={c.name}>{item.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
