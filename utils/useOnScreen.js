import { useState, useEffect } from "react";
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return isIntersecting;
};
export default useOnScreen;
