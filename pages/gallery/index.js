import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import Error500 from "~/components/error/500";
import { compareData, fetchData, setSettingsData } from "~/lib/clientFunctions";
import galleryPageData from "~/lib/dataLoader/gallery";
import { wrapper } from "~/redux/store";
import classes from "~/styles/gallery.module.css";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const SidebarList = dynamic(() =>
  import("~/components/Shop/Sidebar/sidebarList")
);
const ProductList = dynamic(() =>
  import("~/components/Shop/Product/productList")
);
const ProductDetails = dynamic(() =>
  import("~/components/Shop/Product/productDetails")
);

function GalleryPage({ data, error }) {
  const router = useRouter();
  const _items = data.product || [];
  const [_productList, _setProductList] = useState(_items);
  const [sortedItemList, setSortedItemList] = useState(_items);
  const [loading, setLoading] = useState(false);
  const [productLength, setProductLength] = useState(data.product_length || 0);
  const [isOpen, setIsOpen] = useState(false);
  const [sortKey, setSortKey] = useState("db");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState([]);
  const isInitialMount = useRef(true);
  const { t } = useTranslation();
  //update filter
  async function updateFilteredProduct() {
    try {
      setLoading(true);
      let brandArr = "&";
      selectedBrand.forEach((el) => {
        brandArr = brandArr + `brands=${el}&`;
      });
      const cat = `category=${
        selectedCategory.length > 0 ? selectedCategory : ""
      }`;
      const sub = `&subcategory=${
        selectedSubCategory.length > 0 ? selectedSubCategory : ""
      }`;
      const prefix = `${cat}${sub}${brandArr}`;
      const response = await fetchData(`/api/gallery?${prefix}`);
      _setProductList(response.product);
      setProductLength(response.product_length);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateFilteredProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedSubCategory, selectedBrand]);

  //Global Data Sorting function
  function sortDataHandler(key) {
    setLoading(true);
    const sortedData = compareData(_productList, key);
    const __sdt = sortedData ? sortedData : _productList;
    setSortedItemList([...__sdt]);
    setLoading(false);
  }

  //Item sorting event handler
  const sortItems = (key) => {
    setSortKey(key);
    sortDataHandler(key);
  };

  //modal close handler
  const handleCloseModal = () => {
    router.push("/gallery", undefined, { shallow: true });
    setIsOpen(false);
  };

  //popup product viewer track
  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  //Load more items
  const moreProduct = async () => {
    await fetchData(
      `/api/gallery/more-product?product_length=${_productList.length}`
    )
      .then((data) => {
        _setProductList([..._productList, ...data]);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Something went wrong...(${err.message})`);
      });
  };

  //on data change sort data
  useEffect(() => {
    sortDataHandler(sortKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_productList]);

  return (
    <>
      <HeadData />
      <div style={{ height: "100vh" }}>
        {error ? (
          <Error500 />
        ) : !data ? (
          <Spinner />
        ) : (
          <div className="row">
            <SidebarList
              category={data.category}
              brand={data.brand}
              sort={sortItems}
              updateCategory={setSelectedCategory}
              updateSubCategory={setSelectedSubCategory}
              updateBrand={setSelectedBrand}
            />
            <div className={classes.gallery_container}>
              {!loading && sortedItemList.length === 0 ? (
                <div className="m-5 p-5">
                  <p className="text-center">{t("no_product_found")}</p>
                </div>
              ) : !loading ? (
                <ProductList
                  items={sortedItemList}
                  data_length={productLength}
                  loadMore={moreProduct}
                />
               
              ) : (
                <div style={{ height: "80vh" }}>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
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
}

GalleryPage.footer = false;

export default GalleryPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, query }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const { category: Qc, brand: Qb } = query;
      let type = null;
      let _query = null;
      if ((Qc && Qc.length > 0) || (Qb && Qb.length > 0)) {
        type = true;
        _query = true;
      }
      const _data = await galleryPageData(type, _query);
      const data = JSON.parse(JSON.stringify(_data));
      if (data.success) {
        setSettingsData(store, data);
      }
      return {
        props: {
          data,
          error: !data.success,
        },
      };
    }
);
