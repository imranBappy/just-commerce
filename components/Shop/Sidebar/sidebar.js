import React, { useState } from "react";
import ImageLoader from "~/components/Image";
import classes from "./sidebar.module.css";

const Sidebar = (props) => {
  const [clicked, setClicked] = useState("0");

  const handleClick = (index) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
  };

  const toggleCategory = (name) => {
    setClicked("0");
    props.onToggle(name);
  };

  return (
    <li className={classes.list}>
      <button
        className={`${
          props.active ? classes.parent_button_active : classes.parent_button
        }`}
        onClick={() => toggleCategory(props.slug)}
      >
        <ImageLoader
          src={props.image}
          alt={props.name}
          width={22}
          height={22}
        />
        {props.name}
      </button>
      <div className={props.active ? classes.show : classes.collapse}>
        <ul className="list-unstyled ps-0 ms-0">
          {props.sub
            ? props.sub.map((subCategory, index) => (
                <li key={subCategory.slug + index} className={classes.sublist}>
                  <button
                    onClick={() => {
                      props.update(subCategory.slug, "category");
                      handleClick(index);
                    }}
                    className={`${
                      clicked === index ? classes.subnav_active : classes.subnav
                    }`}
                  >
                    {subCategory.name}
                  </button>
                </li>
              ))
            : null}
        </ul>
      </div>
    </li>
  );
};

export default React.memo(Sidebar);
