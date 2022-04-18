import { Api } from "api";
import Config from "../config";
import { useLoginRequired } from "../hooks/loginRequired";
import { useEffect, useRef } from "react";

const ProfilePage = () => {
  useLoginRequired();
  const onEvent = (response: any) => {
    if (response.credential !== undefined) {
      Api.Session.connectGoogleAccount(response.credential);
    } else {
      console.log("Could not identify using Google Social login:", response);
    }
  };

  const buttonRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: Config.googleClientId,
      callback: onEvent,
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      text: "signup_with",
    });
  }, [buttonRef]);

  return (
    <>
      <h2 className="title is-2">Profile</h2>
      <div ref={buttonRef}></div>
    </>
  );
};

export { ProfilePage };
export default ProfilePage;
