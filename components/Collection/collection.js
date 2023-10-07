import Link from "next/link";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Collection = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.banner) return null;

  return (
    <>
      <Carousel
        className="hera"
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
          {data.scopeA.image[0] && (
              <Link href={data.scopeA.url} className="d-block">
                <ImageLoader
                src={data.scopeA.image[0]?.url}
                alt={data.scopeA.title}
                width={525}
                height={525}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              </Link>
            )}
            {data.scopeB.image[0] && (
            <Link href={data.scopeB.url} className="d-block">
              <ImageLoader
              src={data.scopeB.image[0]?.url}
              alt={data.scopeB.title}
              width={525}
              height={525}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            </Link>
          )}
          {data.scopeC.image[0] && (
            <Link href={data.scopeC.url} className="d-block">
              <ImageLoader
              src={data.scopeC.image[0]?.url}
              alt={data.scopeC.title}
              width={525}
              height={525}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            </Link>
          )}
          {data.scopeD.image[0] && (
              <Link href={data.scopeD.url} className="d-block">
                <ImageLoader
                src={data.scopeD.image[0]?.url}
                alt={data.scopeD.title}
                width={525}
                height={525}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              </Link>
            )}
      </Carousel>
    </>
  );
};

export default Collection;
