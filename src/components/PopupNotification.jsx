import React, { useEffect, useState } from "react";
import { getNotificationsAPI } from "../services/notificationService";
import Loading from "./Loading";
import NotificationCard from "./NotificationCard";

const PopupNotification = ({ menuOpen, setMenuOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [crPage, setCrPage] = useState(2);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      getData();
    }
  }, [menuOpen]);

  const getData = async () => {
    setIsLoading(true);
    setIsEnd(false);
    setCrPage(2);
    const data = await getNotificationsAPI(1);
    if (data?.code === 0) {
      setNotifications(data?.notifications);

      if (data?.notifications?.length < 10) {
        setIsEnd(true);
      }
    }
    setIsLoading(false);
  };

  const handleClosePopup = () => {
    setMenuOpen(false);
  };

  const onclickLoadMore = async () => {
    const data = await getNotificationsAPI(crPage);
    if (data?.code === 0) {
      setNotifications([...notifications, ...data.notifications]);
      setCrPage((x) => x + 1);

      if (data?.notifications?.length < 10) {
        setIsEnd(true);
      }
    }
  };

  return (
    <>
      {menuOpen && (
        <div
          className="fixed flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClosePopup}
        >
          <div
            className="w-96 absolute top-1 mt-12 bg-white z-50 rounded-xl border shadow-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-center font-bold text-xl sm:text-2xl text-gray-800 p-4">
                Thông báo
              </h3>
              <button className="inline-flex text-2xl px-2 sm:px-3 py-2 text-gray-800 items-center rounded font-medium">
                <i className="fa-solid fa-circle-check"></i>
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              {isLoading ? (
                <div className="p-3">
                  <Loading />
                </div>
              ) : notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification._id}
                      notification={notification}
                      handleClosePopup={handleClosePopup}
                    />
                  ))}
                  {!isEnd && (
                    <div className="text-center py-3">
                      <button
                        className="text-gray-800 font-medium"
                        onClick={onclickLoadMore}
                      >
                        Xem thêm
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  Bạn chưa có thông báo nào.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupNotification;
