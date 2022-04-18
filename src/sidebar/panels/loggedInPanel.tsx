import React, { FormEvent, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { Api } from "api";
import { logout } from "../../redux/actions";
import { SfwButton } from "../sfwButton";
import { BeevenueSpinner } from "../../beevenueSpinner";

import CONFIG from "../../config";
import { useBeevenueSelector } from "../../redux/selectors";
import { forceRedirect } from "../../redirect";
import { useHistory } from "react-router-dom";

const LoggedInPanel = () => {
  const [loginInProgress, setLoginInProgress] = useState(false);

  const serverVersion = useBeevenueSelector(
    (store) => store.login.serverVersion
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const isMounted = useRef(true);

  const finish = () => {
    if (!isMounted.current) return;
    setLoginInProgress(false);
  };

  const submitLogout = (event: FormEvent) => {
    event.preventDefault();
    setLoginInProgress(true);

    Api.Session.logout()
      .then((res) => {
        if (res.status === 200) {
          // The session cookie is unset now.
          dispatch(logout());
          forceRedirect(history, "/");
        }
      })
      .finally(finish);
  };

  const renderLogout = () => {
    return (
      <div className="card beevenue-Sidebar-Card">
        <div className="card-header">
          <p className="card-header-title">Logout</p>
        </div>
        <div className="card-content">
          <div className="content">
            <SfwButton />
            <div className="field">
              <div>Server version: {serverVersion}</div>
              <div>UI version: {CONFIG.commitId}</div>
            </div>
            <div className="field">
              <form onSubmit={(e) => submitLogout(e)}>
                <div className="field">
                  <button className="button">Logout</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loginInProgress) {
    isMounted.current = false;
    return <BeevenueSpinner />;
  }
  isMounted.current = true;

  return renderLogout();
};

export { LoggedInPanel };
