import { ArrowRepeat, Bell, X } from "@styled-icons/bootstrap";
import { useState } from "react";
import useSWR from "swr";
import { dateFormat, deleteData, fetchData } from "~/lib/clientFunctions";
import cls from "./notification.module.css";

export default function Notification() {
  const url = `/api/notification`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [isClicked, setIsClicked] = useState(false);

  const toggleItem = () => setIsClicked(!isClicked);

  async function removeAllNotification() {
    try {
      const _r = await deleteData("/api/notification");
      if (_r.success) mutate();
    } catch (e) {
      console.log(e);
    }
  }

  if (error) return <div className={cls.msg}>failed to load</div>;
  if (!data) return <ArrowRepeat width={20} height={20} className={cls.spin} />;

  return (
    <div className={cls.wrap}>
      <div className={cls.icon}>
        <Bell width={20} height={20} onClick={toggleItem} />
        {data.notification && data.notification.length > 0 && (
          <div className={cls.circle}></div>
        )}
      </div>
      {isClicked && (
        <div className={cls.container}>
          <div className={cls.close} onClick={toggleItem}>
            <X width={15} height={15} />
          </div>
          {!data.notification || !data.notification.length > 0 ? (
            <div className={cls.msg}>No notification found</div>
          ) : (
            <>
              <ul>
                {data.notification.map((n) => (
                  <li key={n._id}>
                    <span>{dateFormat(n.createdAt)}</span>
                    <div dangerouslySetInnerHTML={{ __html: n.message }} />
                  </li>
                ))}
              </ul>
              <button onClick={removeAllNotification}>Clear All</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
