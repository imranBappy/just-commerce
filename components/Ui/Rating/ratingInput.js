import { useState } from "react";
import cls from "./ratingInput.module.css";

export default function StarRating({ rate }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  function setRatingVal(v) {
    setRating(v);
    rate(v);
  }
  return (
    <div className={cls.star_rating}>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? cls.on : cls.off}
            onClick={() => setRatingVal(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
}
