import { Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "~/components/Table";
import classes from "~/components/tableFilter/table.module.css";
import PageLoader from "~/components/Ui/pageLoader";
import { cpf, dateFormat, deleteData } from "~/lib/clientFunctions";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

const SubscriberList = () => {
  const [data, setData] = useState({ users: [] });

  const updateData = useRef();
  function updatePageData() {
    updateData.current.update();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    setPermissions(cpf(session, "customers"));
  }, [session]);

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
      name: t("email"),
      selector: (row) => row.email,
    },
    {
      name: t("phone"),
      selector: (row) => row.phone,
    },
    {
      name: t("Created"),
      selector: (row) => dateFormat(row.createdAt),
      sortable: true,
    },
    {
      name: t("Total Order"),
      selector: (row) => row.orders.length,
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) =>
        permissions.delete && (
          <div className={classes.button} onClick={() => openModal(row._id)}>
            <Trash width={22} height={22} title="DELETE" />
          </div>
        ),
    },
  ];

  return (
    <PageLoader url={`/api/users`} setData={setData} ref={updateData}>
      <div>
        <h4 className="text-center pt-3 pb-5">Customers</h4>
        <div className={classes.container}>
          <Table
            columns={columns}
            data={data.users}
            searchKey="email"
            searchPlaceholder="Email"
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
