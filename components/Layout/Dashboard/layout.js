import { useEffect, useState } from "react";
import useWindowDimensions from "~/lib/useWindowDimensions";
import HeadData from "../../Head";
import DashboardHeader from "./header";
import classes from "./layout.module.css";
import DashboardMenu from "./menu";

const DashboardLayout = ({ children }) => {
  const { height, width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (width <= 768) {
      setIsOpen(false);
    }
  }, [width]);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <HeadData />
      <DashboardHeader toggleMenu={toggleMenu} />
      <div className={classes.content_body}>
        <DashboardMenu menuState={isOpen} />
        <div className={classes.content}>
          <div className={classes.content_inner_body}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
