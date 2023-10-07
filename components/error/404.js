import Link from "next/link";
import classes from "./403.module.css";

const Error404 = () => {
  return (
    <div className={classes.body}>
      <div className={classes.body_container}>
        <div className={classes.ntfnd}>
          <div className={classes.error}>
            <h1>404</h1>
          </div>
          <h2>THIS PAGE COULD NOT BE FOUND</h2>
          <p>
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
            <br />
            <Link href="/">Return to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error404;
