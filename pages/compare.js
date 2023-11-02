import { Trash3 } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import ImageLoader from "~/components/Image";
import { postData, stockInfo } from "~/lib/clientFunctions";
import { updateComparelist } from "~/redux/cart.slice";
import styles from "../styles/compare.module.css";
import { useTranslation } from "react-i18next";
import CompareTemplate from "~/components/CompareTemplate/CompareTemplate";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const ProductDetails = dynamic(() =>
  import("~/components/Shop/Product/productDetails")
);

const Compare = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { compare } = useSelector((state) => state.cart);
  const { settingsData } = useSelector((state) => state.settings);
  const [keys, setKeys] = useState({
  
  });

  useEffect(() => {
    const newKeys = {...keys};
    if (data.length > 0) {
      data.forEach((item) => {
        item.template.forEach((template) => { 
           newKeys[template.specificationName] = template.specificationName;

          template.specificationList.forEach((specification) => {
            if (!newKeys[specification.name]) {
              newKeys[specification.name] = specification.name;
            }
          });
        });
      });
    }
    setKeys(newKeys);
  },[data])

  const dispatch = useDispatch();
  const { t } = useTranslation();
  async function getData() {
    const url = `/api/home/compare`;
    const resp = await postData(url, { idList: compare });
    resp.success ? setData(resp.data) : null;
  }

  useEffect(() => {
    if (compare.length > 0) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compare]);

  //popup product viewer track
  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  //modal close handler
  const handleCloseModal = () => {
    router.push("/compare", undefined, { shallow: true });
    setIsOpen(false);
  };

  function removeItem(id) {
    const filtered = compare.filter((x) => x !== id);
    dispatch(updateComparelist(filtered));
    toast.success("Item has been removed from compare list");
  }

  const allKeys = Object.keys(keys);  

  return (
    <>
      <HeadData title="Compare" />
      <div className={styles.layout_top}>
        <h1 className={styles.heading}>{t("compare")}</h1>
        {compare && compare.length > 0 ? (
          <div className={styles.root}>
            <div className={styles.header}>
              <ul>
                <li className={styles.image}>{t("photo")}</li>
                <li>{t('name')}</li>
                <li>{t('phone')}</li>
                <li>{t('availability')}</li>
                <li>{t('color')}</li>

                {
                  allKeys.map((key, index) => (  <li>{t(key)}</li>))
                }
                <li>{t("action")}</li>
              </ul>
            </div>
            <div className={styles.table}>
              <div className={styles.content}>
                {data.map((item, idx) => (
                  <ul key={idx}>
                    <li className={styles.image}>
                      <ImageLoader
                        src={item.image[0]?.url}
                        width={125}
                        height={125}
                      />
                    </li>
                    <li>{item.name}</li>
                    
                    <li>
                      <span className={styles.price}>
                        {item.discount < item.price && (
                          <del>{item.price + settingsData.currency.symbol}</del>
                        )}
                        <b>{item.discount + settingsData.currency.symbol}</b>
                      </span>
                    </li>
                    <li>
                      {stockInfo(item) ? (
                        <span className="text-success fw-bold">In stock</span>
                      ) : (
                        <span className="text-danger fw-bold">
                          Out of stock
                        </span>
                      )}
                    </li>
                    <li>
                      {item.colors &&
                        item.colors.map((x, i) => (
                          <span
                            key={i}
                            style={{ backgroundColor: x.value }}
                            title={x.label}
                            className={styles.color}
                          ></span>
                        ))}
                    </li>
                    
                    {
                      Object.keys(keys).map((key, index) => (    <CompareTemplate item={item} _key={key} key={key} />))
                    }
                        

                    <li>
                      {stockInfo(item) && (
                        <Link
                          href={`/compare?slug=${item.slug}`}
                          as={`/product/${item.slug}`}
                          scroll={false}
                          shallow={true}
                          className={styles.button}
                        >
                          {t("add_to_cart")}
                        </Link>
                      )}
                      <button
                        className={styles.button}
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash3 width={20} height={20} />
                      </button>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-5 mt-3 mb-_5 fw-bold">
            {t("no_products_in_compare_list")}
          </p>
        )}
      </div>
      <GlobalModal
        small={false}
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
      >
        {router.query.slug && (
          <ProductDetails productSlug={router.query.slug} />
        )}
      </GlobalModal>
    </>
  );
};

export default Compare;
