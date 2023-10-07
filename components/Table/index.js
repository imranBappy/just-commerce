import dynamic from "next/dynamic";
import React from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "./filter";

export default function Table({ data, columns, searchKey, searchPlaceholder }) {
  // const DataTable = dynamic(() => import("react-data-table-component"));
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = data.filter(
    (item) =>
      item[searchKey] &&
      item[searchKey].toLowerCase().includes(filterText.toLowerCase()),
  );
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        placeholder={searchPlaceholder}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "70px",
        fontSize: "14px",
        fontWeight: 500,
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: 600,
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={filteredItems}
      pagination
      paginationResetDefaultPage={resetPaginationToggle}
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      persistTableHead
      customStyles={customStyles}
    />
  );
}
