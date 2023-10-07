import Link from "next/link";
import { useSelector } from "react-redux";
import ImageLoader from "../Image";
import classes from "./productList.module.css";

function ProductCard(props) {
  const settings = useSelector((state) => state.settings);

  // test 


  // test 
  return (
    <div className={classes.page_wrapper}>
      <div className={classes.page_inner}>
        <div className={classes.row}>
          <div className={classes.el_wrapper}>
            <Link href={`/product/${props.data.slug}`}>
              <div className={classes.box_up}>
                <div className={classes.img}>
                  <ImageLoader
                    className={classes.image}
                    src={props.data.image[0]?.url}
                    alt={props.data.name}
                    width={250}
                    height={250}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
                <div className={classes.img_info}>
                  <div className={classes.info_inner}>
                    <span className={classes.p_name}>{props.data.name}</span>
                    <span
                      className={classes.p_company}
                    >{`${props.data.unitValue} ${props.data.unit}`}</span>
                  </div>
                  <div className={classes.a_size}>
                    <span className={classes.size}>{priceDetails()}</span>
                  </div>
                </div>
              </div>
            </Link>
            <div className={classes.box_down}>
              <div className={classes.h_bg}>
                <div className={classes.h_bg_inner}></div>
              </div>
              <Link
                href={`/?slug=${props.data.slug}`}
                as={`/product/${props.data.slug}`}
                scroll={false}
              >
                <div className={classes.cart}>
                  <div className={classes.price}>{priceDetails()}</div>
                  <span className={classes.add_to_cart}>
                    <span className={classes.txt}>Add to cart</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function priceDetails() {
    return (
      <>
        <p
          className={
            props.data.discount < props.data.price
              ? classes.price_ori
              : classes.price_a
          }
        >
          {settings.settingsData.currency.symbol}
          {props.data.price}
        </p>
        {props.data.discount < props.data.price && (
          <p className={classes.price_a}>
            {settings.settingsData.currency.symbol}
            {props.data.discount}
          </p>
        )}
      </>
    );
  }
}

export default ProductCard;
