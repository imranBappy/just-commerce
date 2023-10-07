import Link from "next/link";
import classes from "./banner.module.css";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Banner = (props) => {
  const { t } = useTranslation();
  if (!props.banner) return null;

  return (
    <div className={`${classes.content_container} custom_container`}>
      <div className="col-12">
        <div className={classes.banner}>
          <div className={classes.bg}>
            <Image
              src={props.banner.image[0]?.url}
              alt={props.banner.image[0]?.name}
              fill={true}
              quality={100}
              priority={true}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className={classes.content}>
            <h2 className={classes.heading}>{props.banner.title}</h2>
            <h4 className={classes.subheading}>{props.banner.subTitle}</h4>
            <p className={classes.body}>{props.banner.description}</p>
            <Link href={props.banner.url} className={classes.button}>
              {t("shop_now")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
