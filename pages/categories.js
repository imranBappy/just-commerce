import { ChevronDown } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import ImageLoader from "~/components/Image";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import c from "~/styles/categoryPage.module.css";

const CategoriesPage = ({ data, error }) => {
  const { t } = useTranslation();
  function toggleItem(evt, id) {
    try {
      evt.target.toggleAttribute("aria-expanded");
      document.getElementById(`cat__${id}`).toggleAttribute("aria-expanded");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="All Categories" />
          <h1 className={c.heading}>{t("all_categories")}</h1>
          <div className="custom_container">
            <div className={c.spc}>
              <div className={c.card}>
                <div className="card-body">
                  <div className={c.category}>
                    <div className="row">
                      {data &&
                        data.category.map((cat) => (
                          <div
                            className="col-lg-4 col-sm-6 col text-left"
                            key={cat.categoryId}
                          >
                            <div className={c.img_con}>
                              <ImageLoader
                                src={cat.icon[0]?.url}
                                alt={cat.name}
                                width={50}
                                height={50}
                              />
                              <h5>
                                <Link href={`/gallery?category=${cat.slug}`}>
                                  {cat.name}
                                </Link>
                              </h5>
                            </div>
                            <div
                              className={c.sub}
                              id={`cat__${cat.slug}`}
                              aria-expanded={
                                cat.subCategories &&
                                cat.subCategories.length > 4
                              }
                            >
                              {cat.subCategories &&
                                cat.subCategories.map((sub, idx) => (
                                  <div key={sub.slug + idx}>
                                    <h6>
                                      <Link
                                        href={`/gallery?category=${sub.slug}&parent=${cat.slug}`}
                                      >
                                        {sub.name}
                                      </Link>
                                    </h6>
                                  </div>
                                ))}
                            </div>
                            {cat.subCategories &&
                              cat.subCategories.length > 4 && (
                                <div
                                  className={c.btn}
                                  onClick={(e) => toggleItem(e, cat.slug)}
                                  aria-expanded
                                />
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

CategoriesPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    try {
      const { origin } = appUrl(context.req);
      const url = `${origin}/api/home/categories`;
      const data = await fetchData(url);
      setSettingsData(store, data);
      return {
        data,
        error: false,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error,
      };
    }
  }
);

export default CategoriesPage;
