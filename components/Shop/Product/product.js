import { Eye, Repeat, SuitHeart } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageLoader from "~/components/Image";
import ReviewCount from "~/components/Review/count";
import { postData, stockInfo } from "~/lib/clientFunctions";
import { updateComparelist, updateWishlist } from "~/redux/cart.slice";
import c from "./product.module.css";
import { useTranslation } from "react-i18next";

const Product = ({
  product,
  button,
  link,
  deleteButton,
  layout,
  border,
  hideLink,
  cssClass,
}) => {
  const { session } = useSelector((state) => state.localSession);
  const settings = useSelector((state) => state.settings);
  const { wishlist: wishlistState, compare: compareState } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const discountInPercent =
    Math.round((100 - (product.discount * 100) / product.price) * 10) / 10;

  function updateWishlistCount() {
    const __data = wishlistState ? wishlistState + 1 : 1;
    dispatch(updateWishlist(__data));
  }

  const addToWishList = async () => {
    try {
      if (!session) {
        return toast.warning("You need to login to create a Wishlist");
      }
      const data = {
        pid: product._id,
        id: session.user.id,
      };
      const response = await postData(`/api/wishlist`, data);
      response.success
        ? (toast.success("Item has been added to wishlist"),
          updateWishlistCount())
        : response.exists
        ? toast.warning("This Item already exists on your wishlist")
        : toast.error("Something went wrong (500)");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const addToCompareList = () => {
    const pid = product._id;
    const exists = compareState.find((x) => x === pid);
    if (exists) {
      toast.warning("This Item already exists on your compare list");
    } else {
      const __data = [...compareState, product._id];
      dispatch(updateComparelist(__data));
      toast.success("Item has been added to compare list");
    }
  };

  const itemLink = link ? link : `/gallery?slug=${product.slug}`;
  const ItemLayout = layout ? layout : "col-lg-3 col-md-4 col-6";

  return (
    <div className={`${c.item} ${ItemLayout}`}>
      <div
        className={`${c.card} ${border ? c.border : ""} ${
          cssClass ? cssClass : ""
        }`}
      >
        <div className={c.hover_buttons}>
          <button onClick={addToWishList}>
            <SuitHeart width={15} height={15} />
          </button>
          <button onClick={addToCompareList}>
            <Repeat width={15} height={15} />
          </button>
          {!hideLink && (
            <Link
              href={itemLink}
              as={`/product/${product.slug}`}
              scroll={false}
              shallow={true}
            >
              <button>
                <Eye width={15} height={15} />
              </button>
            </Link>
          )}
          {deleteButton && deleteButton}
        </div>
        <div>
          <Link href={`/product/${product.slug}`}>
            <div className={c.container}>
              <ImageLoader
                src={product.image[0]?.url}
                alt={product.name}
                width={200}
                height={200}
                style={{ width: "100%", height: "auto" }}
                quality={100}
              />
            </div>
          </Link>
          {product.discount < product.price && (
            <div className={c.discount}>-{discountInPercent}%</div>
          )}
          <div className={c.nameContainer}>
            <ReviewCount reviews={product.review || []} showCount />
            <div className={c.name}>
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </div>
            <p className={c.unit}>{`${product.unitValue} ${product.unit}`}</p>
            <div className={c.price_con}>
              {product.discount < product.price && (
                <p className={c.price}>
                  {settings.settingsData.currency.symbol}
                  <span className="mb-0 pl-1">{product.discount}</span>
                </p>
              )}
              <p
                className={
                  product.discount < product.price ? c.price_ori : c.price
                }
              >
                {settings.settingsData.currency.symbol}
                <span className="mb-0 pl-1">{product.price}</span>
              </p>
            </div>
          </div>
          {button && (
            <div className={c.buttonContainer}>
              {stockInfo(product) ? (
                <Link
                  href={itemLink}
                  as={`/product/${product.slug}`}
                  scroll={false}
                  shallow={true}
                  className={c.button}
                >
                  {t("buy_now")}
                </Link>
              ) : (
                <button className={c.button} disabled>
                  {t("out_of_stock")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
