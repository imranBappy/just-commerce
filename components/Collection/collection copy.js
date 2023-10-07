import Link from "next/link";
import classes from "./collection.module.css";
import ImageLoader from "../Image";
import { ArrowRight } from "@styled-icons/bootstrap";
import { useTranslation } from "react-i18next";

const Collection = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.banner) return null;

  return (
    <div className="custom_container">
      <div className="row">
      <div className="col-md-2 col-6">

      </div>
      <div className="col-md-2 col-6">
        
      </div>
      <div className="col-md-2 col-6">
        
      </div>
      <div className="col-md-2 col-6">
        
      </div>
        <div className="col-md-5">
          {data.scopeA.image[0] && (
            <div className={classes.content_lg}>
              <div className={classes.img}>
                <ImageLoader
                  src={data.scopeA.image[0]?.url}
                  alt={data.scopeA.title}
                  width={525}
                  height={525}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className={`${classes.content} ${classes.content_center}`}>
                <h3 className={classes.heading}>{data.scopeA.title}</h3>
                <Link href={data.scopeA.url} className={classes.link}>
                  {t("shop_now")}
                  <ArrowRight width={15} height={15} />
                </Link>
              </div>
              <span />
            </div>
          )}
        </div>
        <div className="col-md-7">
          {data.scopeB.image[0] && (
            <div className={classes.content_md}>
              <div className={classes.img}>
                <ImageLoader
                  src={data.scopeB.image[0]?.url}
                  alt={data.scopeB.title}
                  width={750}
                  height={250}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className={`${classes.content} ${classes.content_center}`}>
                <h3 className={classes.heading}>{data.scopeB.title}</h3>
                <Link href={data.scopeB.url} className={classes.link}>
                  {t("shop_now")}
                  <ArrowRight width={15} height={15} />
                </Link>
              </div>
              <span />
            </div>
          )}
          <div className="row">
            <div className="col-sm-6">
              {data.scopeC.image[0] && (
                <div className={classes.content_sm}>
                  <div className={classes.img}>
                    <ImageLoader
                      src={data.scopeC.image[0]?.url}
                      alt={data.scopeC.title}
                      width={360}
                      height={250}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className={classes.content}>
                    <h3 className={classes.heading}>{data.scopeC.title}</h3>
                    <Link href={data.scopeC.url} className={classes.link}>
                      {t("shop_now")}
                      <ArrowRight width={15} height={15} />
                    </Link>
                  </div>
                  <span />
                </div>
              )}
            </div>
            <div className="col-sm-6">
              {data.scopeD.image[0] && (
                <div className={classes.content_sm}>
                  <div className={classes.img}>
                    <ImageLoader
                      src={data.scopeD.image[0]?.url}
                      alt={data.scopeD.title}
                      width={360}
                      height={250}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className={classes.content}>
                    <h3 className={classes.heading}>{data.scopeD.title}</h3>
                    <Link href={data.scopeD.url} className={classes.link}>
                      {t("shop_now")}
                      <ArrowRight width={15} height={15} />
                    </Link>
                  </div>
                  <span />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
