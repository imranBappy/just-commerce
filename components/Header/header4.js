import Link from "next/link";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";

function Header4(props) {
  const { t } = useTranslation();
  if (!props.carousel) return null;

  return (
    <div className="custom_container">
      <div className="row px-2 my-2">
        {props.carousel.carouselData &&
          props.carousel.carouselData.map((item) => (
            <>
            {item.description === "5" && (
              <div className={`${item.subTitle}`}>
                <Link href={item.url}>
                  <ImageLoader
                    src={item.image[0]?.url}
                    width={300}
                    height={200}
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
    </div>
  );
}

export default Header4;
