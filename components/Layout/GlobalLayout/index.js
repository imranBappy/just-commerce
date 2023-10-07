import ClientLayout from "../Client/layout";
import DashboardLayout from "../Dashboard/layout";

const GlobalLayout = (props) => {
  if (props.error) {
    return <>{props.children}</>;
  }

  return (
    <>
      {props.dashboard ? (
        <DashboardLayout>{props.children}</DashboardLayout>
      ) : (
        <ClientLayout footer={props.footer}>{props.children}</ClientLayout>
      )}
    </>
  );
};

export default GlobalLayout;
