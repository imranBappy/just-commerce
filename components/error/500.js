import Link from "next/link";
import classes from "./403.module.css";

const Error500 = () => {
  return (
    <div className={classes.body}>
      <div className={classes.body_container}>
        <div className={classes.ntfnd}>
          <div className={classes.error}>
            <h1>500</h1>
          </div>
          <h2>Oooops! Internal Server Error.</h2>
          <p>
            That is, something went terribly wrong. We suggest you to go back or
            visit here later
            <br />
            <Link href="/">Return to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error500;
