import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { deleteData, fetchData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const Templates = () => {
  const url = `/api/templates`;
  const { data, error, mutate } = useSWR(url, fetchData);

    
  const [templateList, setTemplateList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.templates) {
      setTemplateList(data.templates);
    }
  }, [data]);

    


 
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteProduct = async () => {
    setIsOpen(false);
    await deleteData(`/api/attributes?id=${selectedAttr}`)
      .then((data) =>
        data.success
          ? (toast.success("Attribute Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);


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
      />
    );
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "92px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const columns = [
    {
      name: t("name"),
      selector: (row) => row.category.name,
      sortable: true,
      grow: 0,
    },
    {
      name: t("Value"),
      selector: (row) =>   row.templates.map((item) => `${item.specificationName}, `),
      grow: 2,
    },
    {
      name: t("action"),
      selector: (row) => (
        <div>
          { (
            <Link href={`/dashboard/templates/edit?id=${row._id}`}>
              <div className={classes.button}>
                <PencilSquare width={22} height={22} title="EDIT" />
              </div>
            </Link>
          )}
        </div>
      ),
    },
    ];

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">All Attributes</h4>
          <div className={classes.container}>
            <DataTable
              columns={columns}
              data={templateList}
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              customStyles={customStyles}
            />
          </div>
        </div>
      )}
    </>
  );
};

Templates.requireAuthAdmin = true;
Templates.dashboard = true;

export default Templates;
