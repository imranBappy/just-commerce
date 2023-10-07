import Link from "next/link";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Header(props) {
  const { t } = useTranslation();
  if (!props.carousel) return null;

  return (
    <Carousel
      showArrows={true}
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
        <>
        {item.description === "1" && (
          <Link href={item.url}>
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
          </Link>
        )}
        </>
      ))}
  </Carousel>
  );
}

export default Header;
