import React, { FormEvent, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { Api } from "api";
import { login } from "../../redux/actions";
import { BeevenueSpinner } from "../../beevenueSpinner";
import { GoogleLoginButton } from "./googleLoginButton";
import { AxiosPromise } from "axios";

const useLoginSubmission = () => {
  const [loginInProgress, setLoginInProgress] = useState(false);
  const dispatch = useDispatch();

  const loginHelper = (
    apiCall: AxiosPromise<any>,
    isMounted: boolean,
    event?: FormEvent
  ) => {
    setLoginInProgress(true);

    apiCall
      .then((res) => {
        if (res.status === 200) {
          // The session cookie is set now.
          dispatch(login(res.data));
        }
      })
      .finally(() => {
        if (!isMounted) return;
        setLoginInProgress(false);
      });

    event?.preventDefault();
  };

  const onFormLogin = (
    event: FormEvent,
    isMounted: boolean,
    username: string,
    password: string
  ) => {
    loginHelper(Api.Session.login({ username, password }), isMounted, event);
  };

  const onGoogleLogin = (isMounted: boolean, jwt: string) => {
    loginHelper(Api.Session.loginWithGoogle(jwt), isMounted);
  };

  return { onFormLogin, onGoogleLogin, loginInProgress };
};

const getUsernameField = (setUsername: (p: string) => void) => {
  return (
    <div className="field">
      <input
        className="input"
        type="text"
        name="beevenue-username"
        aria-label="username"
        placeholder="Username"
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
    </div>
  );
};

const getPasswordField = (setPassword: (p: string) => void) => {
  return (
    <div className="field">
      <input
        className="input"
        autoComplete="current-password"
        type="password"
        name="beevenue-password"
        aria-label="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
    </div>
  );
};

const useForm = (onFormLogin: any, isMounted: boolean) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={(e) => onFormLogin(e, isMounted, username, password)}>
      {getUsernameField(setUsername)}
      {getPasswordField(setPassword)}
      <div className="field">
        <button className="button">Login</button>
      </div>
    </form>
  );
};

const LoggedOutPanel = () => {
  const isMounted = useRef(true);
  const { onFormLogin, onGoogleLogin, loginInProgress } = useLoginSubmission();
  const form = useForm(onFormLogin, isMounted.current);

  const renderLogin = () => {
    return (
      <div className="card beevenue-Sidebar-Card">
        <div className="card-header">
          <p className="card-header-title">Login</p>
        </div>
        <div className="card-content">
          <div className="content">{form}</div>
          <GoogleLoginButton
            onSuccess={(jwt) => onGoogleLogin(isMounted.current, jwt)}
          />
        </div>
      </div>
    );
  };

  if (loginInProgress) {
    isMounted.current = false;
    return <BeevenueSpinner />;
  }
  isMounted.current = true;
  return renderLogin();
};

export { LoggedOutPanel };
