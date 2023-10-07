import Link from "next/link";
import { useEffect, useState } from "react";
import classes from "./403.module.css";

const DefaultError = ({ statusCode }) => {
  const [status, setStatus] = useState("");
  useEffect(() => {
    statusCode === 404
      ? setStatus("THIS PAGE COULD NOT BE FOUND")
      : statusCode === 500
      ? setStatus("Oooops! Internal Server Error.")
      : statusCode === 403
      ? setStatus("access forbidden")
      : null;
  }, [statusCode]);
  return (
    <div className={classes.body}>
      <div className={classes.body_container}>
        <div className={classes.ntfnd}>
          <div className={classes.error}>
            <h1>{statusCode}</h1>
          </div>
          <h2>{status}</h2>
          <p>
            <Link href="/">Return to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefaultError;
