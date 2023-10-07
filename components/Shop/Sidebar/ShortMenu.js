import { CaretDownFill } from "@styled-icons/bootstrap";
import { useState } from "react";
import c from "./shortMenu.module.css";

export default function ShortMenu({ update }) {
  const [show, setShow] = useState(false);
  const data = [
    { name: "Default", id: "db" },
    { name: "Newest", id: "db" },
    { name: "Oldest", id: "da" },
    { name: "Price: low to high", id: "pa" },
    { name: "Price: high to low", id: "pb" },
    { name: "Name: A-Z", id: "na" },
    { name: "Name: Z-A", id: "nb" },
  ];
  const [selected, setSelected] = useState(data[0]);

  function changeItem(item) {
    setShow(false);
    setSelected(item);
    update(item.id);
  }

  return (
    <div className={c.menu} onClick={() => setShow(!show)}>
      <div>{selected.name}</div>
      <CaretDownFill width={10} height={10} />
      {show && (
        <ul>
          {data.map((item, idx) => (
            <li key={idx} onClick={() => changeItem(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
