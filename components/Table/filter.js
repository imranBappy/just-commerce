import classes from "./table.module.css";

const FilterComponent = ({ filterText, onFilter, onClear, placeholder }) => (
  <>
    <input
      id="search"
      type="text"
      placeholder={`Filter By ${placeholder ? placeholder : "Name"}`}
      aria-label="Search Input"
      className={classes.search_bar}
      value={filterText}
      onChange={onFilter}
    />
    <button
      type="button"
      className={classes.search_bar_button}
      onClick={onClear}
    >
      X
    </button>
  </>
);

export default FilterComponent;
