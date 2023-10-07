import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import c from "./brandlist.module.css";

export default function BrandList({ brand, updateBrand }) {
  const [clicked, setClicked] = useState([]);
  const router = useRouter();

  //handle brand selection
  function brandSelected(slug) {
    if (clicked.find((x) => x === slug)) {
      const filtered = clicked.filter((x) => x !== slug);
      setClicked(filtered);
      updateBrand(filtered);
    } else {
      const newList = [...clicked, slug];
      setClicked(newList);
      updateBrand(newList);
    }
  }

  //detect query change
  useEffect(() => {
    const { brand } = router.query;
    if (brand && brand.length > 1) {
      const query = decodeURI(brand);
      setClicked([query]);
      updateBrand([query]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.brand]);

  return (
    <ul className={`list-unstyled ps-0 ${c.brand}`}>
      {brand &&
        brand.map((item, index) => (
          <li
            key={index}
            // id={brand}
            className={`${c.brand_item} ${
              clicked.find((x) => x === item.slug)
                ? c.brand_item_selected
                : null
            }`}
            onClick={() => brandSelected(item.slug)}
          >
            {item.name}
          </li>
        ))}
    </ul>
  );
}
