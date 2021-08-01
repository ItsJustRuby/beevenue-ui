import React, { useEffect } from "react";

import { Api } from "api";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux/actions";
import { Anonymous } from "../redux/storeTypes";
import { useBeevenueSelector } from "../redux/selectors";
import Album from "./album";

const IndexPage = () => {
  const dispatch = useDispatch();
  const loggedInUser = useBeevenueSelector(store => store.login.loggedInUser);

  useEffect(() => {
    dispatch(setTitle(""));
  }, [dispatch]);

  return (
    <>
      {(loggedInUser !== Anonymous) ?  <Album apiCall={Api.Medium.load}  /> : null}
    </>
  );
};

export { IndexPage };
