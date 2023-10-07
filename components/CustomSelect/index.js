import { useEffect, useState } from "react";
import ImageLoader from "../Image";

export default function CustomSelect({
  list,
  preIndex,
  dataChange,
  rootIndex,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(preIndex || 0);
  useEffect(() => {
    const data = {
      target: {
        name: "imageIndex",
        value: index,
      },
    };
    dataChange(data, rootIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  return (
    <>
      <label className="form-label">Image</label>
      <div
        className={`custom_select ${isOpen ? "custom_select_open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && (
          <span>{list[index - 1] ? list[index - 1].name : "None"}</span>
        )}
        {isOpen && (
          <ul>
            <li
              className={index === 0 ? "custom_select_selected" : null}
              onClick={() => setIndex(0)}
            >
              None
            </li>
            {list.map((x, i) => (
              <li
                key={i}
                className={i + 1 === index ? "custom_select_selected" : null}
                onClick={() => setIndex(i + 1)}
              >
                <ImageLoader src={x.url} width={30} height={30} />
                &nbsp;{x.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
