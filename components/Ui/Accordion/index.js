import { useState } from "react";
import classes from "./accordion.module.css";

const Accordion = ({ title, children, state }) => {
  const [isOpen, setIsOpen] = useState(state || true);
  const toggleCardBody = () => setIsOpen(!isOpen);
  return (
    <div className={classes.card}>
      <div className={classes.header} onClick={toggleCardBody}>
        {title}
      </div>
      <div className={classes.icon} aria-expanded={isOpen}></div>
      <div className={classes.body_container} aria-expanded={isOpen}>
        <div className={classes.body}>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
