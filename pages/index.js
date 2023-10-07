import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadData from "~/components/Head";
import Header1 from "~/components/Header/header1";
import Header2 from "~/components/Header/header2";
import Header3 from "~/components/Header/header3";
import Header4 from "~/components/Header/header4";
import Header5 from "~/components/Header/header5";
import Header6 from "~/components/Header/header6";
import { setSettingsData } from "~/lib/clientFunctions";
import homePageData from "~/lib/dataLoader/home";
import { wrapper } from "~/redux/store";

const Error500 = dynamic(() => import("~/components/error/500"));
const Header = dynamic(() => import("~/components/Header/header"));
const Banner = dynamic(() => import("~/components/Banner/banner"));
const CategoryList = dynamic(() =>
  import("~/components/Categories/categoriesList")
);
const Collection = dynamic(() => import("~/components/Collection/collection"));
const BrandCardList = dynamic(() => import("~/components/Brand/brandList"));
const ProductDetails = dynamic(() =>
  import("~/components/Shop/Product/productDetails")
);
const ProductList = dynamic(() => import("~/components/ProductListView"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

function HomePage({ data, error }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const handleCloseModal = () => {
    router.push("/", undefined, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData />
          <div className="custom_container">
            <div className="row mb-4 px-2">
              <div className="col-12 col-md-8 ph-5">
                <Collection
                  data={data.additional && data.additional.homePage.collection}
                />
              </div>
              <div className="col-12 col-md-4 p-0">
              <Header1
                carousel={data.additional && data.additional.homePage.carousel}
              />
              </div>
            </div>
          </div>
          
          <Header2
            carousel={data.additional && data.additional.homePage.carousel}
          />
          
          <CategoryList categoryList={data.category} />

          <Header3
            carousel={data.additional && data.additional.homePage.carousel}
          />

          <ProductList title={t("new_products")} sub={t("new_productss")} type="new" />
          <Header4
            carousel={data.additional && data.additional.homePage.carousel}
          />
          <ProductList title={t("trending_products")} sub={t("trending_productss")} type="trending" />
          <Header5
            carousel={data.additional && data.additional.homePage.carousel}
          />
          <ProductList title={t("best_selling")} sub={t("best_sellings")} type="bestselling" />
          <Header6
            carousel={data.additional && data.additional.homePage.carousel}
          />
          <BrandCardList items={data.brand || []} />
        </>
      )}
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, locale, ...etc }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await homePageData();
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

export default HomePage;
