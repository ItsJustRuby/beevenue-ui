import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

import { Api } from "api";
import Config from "../config";
import { useLoginRequired } from "../hooks/loginRequired";

const ProfilePage = () => {
  useLoginRequired();
  const onSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ((response as GoogleLoginResponse).tokenId !== undefined) {
      console.log(response);
      Api.Session.connectGoogleAccount(
        (response as GoogleLoginResponse).tokenId
      );
    }
  };

  const onFailure = (error: any) => {
    console.log("Could not identify using Google Social login:", error);
  };

  return (
    <>
      <h2 className="title is-2">Profile</h2>
      <GoogleLogin
        buttonText="Connect Google account"
        clientId={Config.googleClientId}
        onFailure={onFailure}
        onSuccess={onSuccess}
      />
    </>
  );
};

export { ProfilePage };
export default ProfilePage;
