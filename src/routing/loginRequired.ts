import { useEffect } from "react";

import { addNotLoggedInNotification } from "../redux/actions";
import { useBeevenueSelector } from "../redux/selectors";
import { forceRedirect } from "../redirect";
import { useHistory } from "react-router-dom";

const useLoginRequired = () => {
  const history = useHistory();

  const loggedInRole = useBeevenueSelector(store => {
    return store.login.loggedInRole;
  });

  const isLoggedIn = useBeevenueSelector(store => {
    return typeof store.login.loggedInUser === "string";
  });

  useEffect(() => {
    if (!isLoggedIn || loggedInRole !== "admin") {
      addNotLoggedInNotification();
      forceRedirect(history, "/", true);
    }
  });
};
export { useLoginRequired };
