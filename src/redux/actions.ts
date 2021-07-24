import {
  LOGIN,
  LOGIN_ANONYMOUS,
  LOGOUT,
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  DISMISS_ALL_NOTIFICATIONS,
  NEW_SEARCH_QUERY,
  SET_SFW_SESSION,
  SET_FILE_UPLOADED,
  SET_SPEED_TAGGING,
  SET_SPEED_TAGGING_ABSENT,
  TOGGLE_SPEED_TAGGING_ITEM,
  CLEAR_SPEED_TAGGING_ITEMS,
  SET_SHOULD_REFRESH
} from "./actionTypes";
import {
  BeevenueNotificationId,
  BeevenueNotificationTemplate,
  makeNotificationFromTemplate
} from "../notifications";

interface LoginDetails {
  id: string;
  sfwSession: boolean;
}

export const login = (loginDetails: LoginDetails) => {
  return {
    type: LOGIN,
    payload: loginDetails
  };
};

export const setSfwSession = (sfw: boolean) => {
  return {
    type: SET_SFW_SESSION,
    payload: sfw
  };
};

export const loginAnonymous = () => {
  return {
    type: LOGIN_ANONYMOUS
  };
};

export const logout = () => ({
  type: LOGOUT,
  payload: {}
});

export const setSearchQuery = (query: string) => ({
  type: NEW_SEARCH_QUERY,
  payload: query
});

export const addNotification = (
  notificationTemplate: BeevenueNotificationTemplate
) => ({
  type: ADD_NOTIFICATION,
  payload: makeNotificationFromTemplate(notificationTemplate)
});

export const addNotLoggedInNotification = () =>
  addNotification({
    level: "error",
    contents: ["You must log in to access this page."]
  });

export const dismissNotification = (id: BeevenueNotificationId) => ({
  type: DISMISS_NOTIFICATION,
  payload: id
});

export const dismissAllNotifications = () => ({
  type: DISMISS_ALL_NOTIFICATIONS
});

export const setShouldRefresh = (shouldRefresh: boolean) => ({
  type: SET_SHOULD_REFRESH,
  payload: shouldRefresh
});

export const setFileUploaded = () => ({
  type: SET_FILE_UPLOADED,
  payload: +new Date()
});

export const toggleSpeedTagging = () => ({
  type: SET_SPEED_TAGGING
});

export const toggleSpeedTaggingAbsent = () => ({
  type: SET_SPEED_TAGGING_ABSENT
});

export const toggleSpeedTaggingItem = (id: number) => ({
  type: TOGGLE_SPEED_TAGGING_ITEM,
  payload: id
});

export const clearSpeedTaggingItems = () => ({
  type: CLEAR_SPEED_TAGGING_ITEMS
});
