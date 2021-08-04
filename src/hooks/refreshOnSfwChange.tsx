import { Api } from "api";
import { ImmediateUpdate } from "detail/immediateUpdateReducer";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { forceRedirect } from "redirect";
import { addNotLoggedInNotification } from "redux/actions";
import { useBeevenueSelector, useIsSessionSfw } from "redux/selectors";

const useRefreshOnSfwChange = (
  id: number,
  immediateDispatch: React.Dispatch<ImmediateUpdate>
) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isSessionSfw = useIsSessionSfw();

  const globalSearchTerms = useBeevenueSelector(
    (store) => store.search.searchQuery
  );

  useEffect(() => {
    Api.Medium.show(id).then(
      (res) => {
        immediateDispatch({
          action: "overwrite",
          payload: res.data,
        });
      },
      (err) => {
        if (err.response.status === 401) {
          dispatch(addNotLoggedInNotification());
        }

        if (globalSearchTerms === "") {
          forceRedirect(history, "/");
        } else {
          forceRedirect(
            history,
            `/search/${globalSearchTerms.replaceAll(" ", "/")}`
          );
        }
      }
    );
  }, [
    dispatch,
    globalSearchTerms,
    history,
    immediateDispatch,
    id,
    isSessionSfw,
  ]);

  return id;
};

export { useRefreshOnSfwChange };
