import Image from "next/image";
import { shimmer, toBase64 } from "~/lib/clientFunctions";

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  quality,
  className,
  style,
  id,
  mouseMove,
  mouseOut,
  click,
  priority,
  
}) {
  return (
    <Image
      src={src}
      alt={alt || src || ""}
      width={width || 100}
      height={height || 100}
      className={className || null}
      style={style || null}
      placeholder={width < 40 ? "empty" : "blur"}
      blurDataURL={`data:image/svg+xml;base64,${toBase64(
        shimmer(width || 100, height || 100)
      )}`}
      id={id || null}
      onMouseMove={mouseMove || null}
      onMouseOut={mouseOut || null}
      onClick={click || null}
      quality={quality || null}
      priority={priority || undefined}
    />
  );
}
