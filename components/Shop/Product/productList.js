import InfiniteScroll from "react-infinite-scroll-component";
import Product from "./product";
import c from "./productList.module.css";
import { useTranslation } from "react-i18next";

function ProductList({ items, data_length, loadMore }) {
  const { t } = useTranslation();

  return (
    <div className={c.list}>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={items.length >= data_length ? false : true}
        loader={<h6 className={c.endMessage}>{t("loading")}</h6>}
        endMessage={
          <h6 className={c.endMessage}>{t("nothing_more_to_show")}</h6>
        }
      >
        {items.map((data) => (
          <Product key={data._id} product={data} button={true} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ProductList;
