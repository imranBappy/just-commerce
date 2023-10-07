import classes from "./spinner.module.css";

const Spinner = ({ color }) => {
  return (
    <div className={classes.container}>
      <div className={classes.spinner}></div>
    </div>
  );
};

export default Spinner;
