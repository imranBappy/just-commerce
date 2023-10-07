import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Table from "~/components/Table";
import classes from "~/components/tableFilter/table.module.css";
import PageLoader from "~/components/Ui/pageLoader";
import { deleteData } from "~/lib/clientFunctions";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

const SubscriberList = () => {
  const [data, setData] = useState({});
  const updateData = useRef();
  function updatePageData() {
    updateData.current.update();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const { t } = useTranslation();

  const openModal = (id) => {
    setSelectedUser(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteSubscriber = async () => {
    setIsOpen(false);
    await deleteData(`/api/users?id=${selectedUser}`)
      .then((data) =>
        data.success
          ? (toast.success("Customer Deleted Successfully"), updatePageData())
          : toast.error("Something Went Wrong"),
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const columns = [
    {
      name: t("name"),
      selector: (row) => row.name,
    },
    {
      name: t("Surname"),
      selector: (row) => row.isStaff.surname,
    },
    {
      name: t("email"),
      selector: (row) => row.email,
    },
    {
      name: t("phone"),
      selector: (row) => row.phone,
    },
    {
      name: t("action"),
      selector: (row) => (
        <>
          <div className={classes.button} onClick={() => openModal(row._id)}>
            <Trash width={22} height={22} title="DELETE" />
          </div>
          <Link href={`/dashboard/staffs/${row._id}`}>
            <div className={classes.button}>
              <PencilSquare width={22} height={22} title="EDIT" />
            </div>
          </Link>
        </>
      ),
    },
  ];

  return (
    <PageLoader url={`/api/staffs`} setData={setData} ref={updateData}>
      <div>
        <h4 className="text-center pt-3 pb-5">{t("Customers")}</h4>
        <div className={classes.container}>
          <Table
            columns={columns}
            data={data.users || []}
            searchKey="email"
            searchPlaceholder={t("email")}
          />
          <GlobalModal
            isOpen={isOpen}
            handleCloseModal={closeModal}
            small={true}
          >
            <div className={classes.modal_icon}>
              <Trash width={90} height={90} />
              <p>Are you sure, you want to delete?</p>
              <div>
                <button
                  className={classes.danger_button}
                  onClick={() => deleteSubscriber()}
                >
                  Delete
                </button>
                <button
                  className={classes.success_button}
                  onClick={() => closeModal()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlobalModal>
        </div>
      </div>
    </PageLoader>
  );
};

SubscriberList.requireAuthAdmin = true;
SubscriberList.dashboard = true;

export default SubscriberList;
