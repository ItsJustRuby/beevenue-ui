import {
  LOGIN,
  LOGOUT,
  LOGIN_ANONYMOUS,
  SET_SFW_SESSION,
  SET_DO_AUTO_LOGIN,
} from "../actionTypes";
import { LoginStore, Unknown, Anonymous } from "../storeTypes";

const initialState: LoginStore = {
  doAutoLogin: true,
  loggedInUser: Unknown,
  loggedInRole: null,
  sfwSession: true,
  serverVersion: "unknown",
};

const doLogin = (state: LoginStore, action: any) => {
  const result = {
    ...state,
    loggedInUser: action.payload.id,
    loggedInRole: action.payload.role,
    serverVersion: action.payload.version,
    sfwSession: action.payload.sfwSession,
  };
  return result;
};

const doLoginAnonymous = (state: LoginStore) => {
  return {
    ...state,
    loggedInUser: Anonymous,
    loggedInRole: null,
  };
};

const doLogout = (state: LoginStore) => {
  return {
    ...state,
    loggedInUser: Anonymous,
    loggedInRole: null,
    doAutoLogin: false,
  };
};

const login = (state: LoginStore = initialState, action: any): LoginStore => {
  switch (action.type) {
    case LOGIN:
      return doLogin(state, action);
    case LOGIN_ANONYMOUS:
      return doLoginAnonymous(state);
    case LOGOUT:
      return doLogout(state);
    case SET_SFW_SESSION: {
      return {
        ...state,
        sfwSession: action.payload,
      };
    }
    case SET_DO_AUTO_LOGIN: {
      return {
        ...state,
        doAutoLogin: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default login;
