import Link from "next/dist/client/link";
import ImageLoader from "../Image";
import classes from "./category.module.css";

function Category(props) {
  return (
    <Link href={`/gallery/?category=${props.slug}`}>
      <div className={classes.category_root}>
        <div className={classes.container}>
          <figure>
            <div className={classes.img}>
              <ImageLoader
                src={props.img}
                alt={props.name}
                width={80}
                height={80}
              />
            </div>
          </figure>
          <div className={classes.name}>{props.name}</div>
        </div>
      </div>
    </Link>
  );
}

export default Category;
