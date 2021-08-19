import React, { useState } from "react";
import { Api } from "api";
import { useDispatch } from "react-redux";
import { setSfwSession } from "../redux/actions";
import { useBeevenueSelector } from "../redux/selectors";
import { useEffect } from "react";
import { BroadcastChannel } from "broadcast-channel";

const SfwButton = () => {
  const dispatch = useDispatch();
  const initialSfw = useBeevenueSelector((store) => store.login.sfwSession);

  const [sfw, setSfw] = useState(initialSfw);

  useEffect(() => {
    setSfw(initialSfw);
  }, [initialSfw]);

  const onChange = () => {
    const newValue = !sfw;
    Api.Session.setSfw(newValue).then(
      (_) => {
        dispatch(setSfwSession(newValue));
        setSfw(newValue);
        const bc = new BroadcastChannel("beevenue");
        bc.postMessage("refresh");
        return bc.close();
      },
      (_) => {}
    );
  };

  return (
    <div className="field">
      <input
        type="checkbox"
        id="sfw-switch"
        name="sfw-switch"
        aria-label="sfw-switch"
        className="switch"
        checked={sfw}
        onChange={(_) => onChange()}
      />
      <label htmlFor="sfw-switch">SFW</label>
    </div>
  );
};

export { SfwButton };
