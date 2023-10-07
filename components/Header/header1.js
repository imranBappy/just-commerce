import Link from "next/link";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";

function Header1(props) {
  const { t } = useTranslation();
  if (!props.carousel) return null;

  return (
    <div className="row px-2">
      {props.carousel.carouselData &&
        props.carousel.carouselData.map((item) => (
          <>
          {item.description === "2" && (
            <div className={`${item.subTitle}`}>
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
            </div>
          )}
          </>
        ))}
    </div>
  );
}

export default Header1;
