import c from "./review.module.css";

export default function ReviewCount({ reviews, showCount }) {
  const _count = (num) =>
    reviews.filter((r) => r.rating === num).length;
  const r1 = _count(1);
  const r2 = _count(2);
  const r3 = _count(3);
  const r4 = _count(4);
  const r5 = _count(5);
  const average =
    (r1 + r2 * 2 + r3 * 3 + r4 * 4 + r5 * 5) / (r1 + r2 + r3 + r4 + r5);
  let star = "";
  for (let i = 0; i < average; i++) {
    star = star + "★";
  }
  return (
    <div className={c._rev_con}>
      <span className={c.rating}>{star}</span>
      {showCount && (<span className={c.count}>({reviews.length})</span>)}
    </div>
  );
}