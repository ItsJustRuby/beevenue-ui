import { Api } from "api";
import Config from "../config";
import { useLoginRequired } from "../hooks/loginRequired";
import { useEffect, useRef } from "react";
import { useGoogleSignIn } from "hooks/googleSignIn";

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
  const { isLoadComplete, google } = useGoogleSignIn();

  useEffect(() => {
    if (!isLoadComplete || !buttonRef.current) {
      return;
    }

    google.initialize({
      client_id: Config.googleClientId,
      callback: onEvent,
      ux_mode: "popup",
    });

    google.renderButton(buttonRef.current, {
      type: "standard",
      text: "signup_with",
    });
  }, [buttonRef, google, isLoadComplete]);

  return (
    <>
      <h2 className="title is-2">Profile</h2>
      <div ref={buttonRef}></div>
    </>
  );
};

export { ProfilePage };
export default ProfilePage;
