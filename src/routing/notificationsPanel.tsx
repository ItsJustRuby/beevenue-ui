import React from "react";
import { useDispatch } from "react-redux";
import { dismissNotification, dismissAllNotifications } from "../redux/actions";

import {
  BeevenueNotificationId,
  BeevenueNotificationLevel,
} from "../notifications";
import { useBeevenueSelector } from "../redux/selectors";

const NotificationsPanel = () => {
  const dispatch = useDispatch();
  const notifications = useBeevenueSelector(
    (store) => store.notifications.notifications
  );

  const dismiss = (id: BeevenueNotificationId): void => {
    dispatch(dismissNotification(id));
  };

  const dismissAll = (e: any): void => {
    e.preventDefault();
    dispatch(dismissAllNotifications());
  };

  const classFor = (level: BeevenueNotificationLevel): string => {
    const dict = {
      error: "is-danger",
      warning: "is-warning",
      info: "is-info",
    };

    return "beevenue-Notifications-Notification notification " + dict[level];
  };

  const getNotificationElements = () => {
    const notificationElements: JSX.Element[] = [];
    for (let [key, value] of Object.entries(notifications)) {
      const el = (
        <div className={classFor(value.level)} key={key}>
          <button
            aria-label={`notifications-dismiss-button-${key}`}
            className="delete"
            key={key}
            onClick={(_) => dismiss(key)}
          />
          {value.timestamp.toLocaleTimeString()} {value.content}
        </div>
      );
      notificationElements.push(el);
    }
    return notificationElements;
  };

  const getDismissAllLink = (notificationCount: number): JSX.Element | null => {
    if (notificationCount > 0) {
      return (
        <a
          href="#"
          aria-label="notifications-dismiss-all-link"
          onClick={(e) => dismissAll(e)}
        >
          Dismiss all
        </a>
      );
    }

    return null;
  };

  const notificationElements = getNotificationElements();
  const maybeDismissAll = getDismissAllLink(notificationElements.length);

  return (
    <div className="beevenue-Notifications">
      <div className="beevenue-Notifications-DismissAll">{maybeDismissAll}</div>
      <div className="beevenue-Notifications-Inner">{notificationElements}</div>
    </div>
  );
};

export { NotificationsPanel };
