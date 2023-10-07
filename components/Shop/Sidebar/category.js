import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImageLoader from "~/components/Image";
import c from "./sidebar.module.css";

const SidebarCategoryList = (props) => {
  const [_c, setCatClicked] = useState("");
  const [subClicked, setSubClicked] = useState("");
  const router = useRouter();

  //toggle category category
  const htc = (name) => {
    setSubClicked("");
    props.updateSubCategory("");
    if (_c === name) {
      setCatClicked("");
      props.updateCategory("");
    } else {
      setCatClicked(name);
      props.updateCategory(name);
    }
  };

  //detect query change
  useEffect(() => {
    const { category, parent } = router.query;
    const query = category ? decodeURI(category) : "";
    const parentCategory = parent ? decodeURI(parent) : "";
    if (parentCategory.length > 1) {
      setCatClicked(parentCategory);
      setSubClicked(query);
      props.updateSubCategory(query);
      props.updateCategory(parentCategory);
    } else if (query.length > 1) {
      setCatClicked(query);
      props.updateCategory(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.category]);

  //handle click subCategory
  const hcs = (name) => {
    if (subClicked === name) {
      props.updateSubCategory("");
      return setSubClicked("");
    }
    setSubClicked(name);
    props.updateSubCategory(name);
  };

  return (
    <ul className="list-unstyled ps-0">
      {props.category.map((cat, i) => (
        <li className={c.list} key={cat._id + i}>
          <button
            className={`${
              _c === cat.slug ? c.parent_button_active : c.parent_button
            }`}
            onClick={() => htc(cat.slug)}
          >
            <ImageLoader
              src={cat.icon[0]?.url}
              alt={cat.name}
              width={22}
              height={22}
            />
            {cat.name}
          </button>

          <div className={_c === cat.slug ? c.show : c.collapse}>
            <ul className="list-unstyled ps-0 ms-0">
              {cat.subCategories.map((_sub, subIdx) => (
                <li key={_sub.slug + subIdx} className={c.sublist}>
                  <button
                    onClick={() => {
                      hcs(_sub.slug);
                    }}
                    className={`${
                      subClicked === _sub.slug ? c.subnav_active : c.subnav
                    }`}
                  >
                    {_sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default React.memo(SidebarCategoryList);
