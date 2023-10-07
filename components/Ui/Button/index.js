import { Broadcast } from "@styled-icons/bootstrap";
import { useEffect, useState } from "react";
import classes from "./button.module.css";

const LoadingButton = ({ text, type, state, clickEvent }) => {
  const [buttonState, setButtonState] = useState("");

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  return (
    <button
      className={classes.button}
      onClick={clickEvent}
      type={type || "button"}
    >
      <div>
        <span>{text} </span>
        {buttonState === "loading" && (
          <Broadcast width={25} height={25} className={classes.svg} />
        )}
      </div>
    </button>
  );
};

export default LoadingButton;
