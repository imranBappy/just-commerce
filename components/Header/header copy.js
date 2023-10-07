import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageLoader from "../Image";
import classes from "./header.module.css";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function Header(props) {
  const { t } = useTranslation();
  if (!props.carousel) return null;

  return (
    <div className="col-12 custom-carousel">
      <div className={classes.header}>
        <div className={classes.bg}>
          <Image
            src={props.carousel.background[0]?.url}
            alt={props.carousel.background[0]?.url}
            fill={true}
            quality={100}
            priority={true}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <Carousel
          showArrows={false}
          showThumbs={false}
          showIndicators={true}
          emulateTouch={true}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          stopOnHover={true}
          interval={9000}
          transitionTime={900}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
        >
          {props.carousel.carouselData &&
            props.carousel.carouselData.map((item) => (
              <div className={classes.Header_container} key={item.id}>
                <div className={classes.img_content}>
                  <div className={classes.img_container}>
                    <ImageLoader
                      src={item.image[0]?.url}
                      width={750}
                      height={750}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </div>
                </div>
                <div className={classes.content}>
                  <div className={classes.body}>
                    <h2>{item.title}</h2>
                    <h4>{item.subTitle}</h4>
                    <p>{item.description}</p>
                    <Link href={item.url}>{t("shop_now")}</Link>
                  </div>
                </div>
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Header;