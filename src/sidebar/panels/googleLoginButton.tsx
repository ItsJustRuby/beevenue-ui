import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import Config from "../../config.json";

interface GoogleLoginButtonProps {
  onSuccess: (jwt: string) => void;
}

const GoogleLoginButton = (props: GoogleLoginButtonProps) => {
  const onSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ((response as GoogleLoginResponse).tokenId !== undefined) {
      console.log(response);
      props.onSuccess((response as GoogleLoginResponse).tokenId);
    }
  };

  return <GoogleLogin clientId={Config.googleClientId} onSuccess={onSuccess} />;
};

export { GoogleLoginButton };
export default GoogleLoginButton;
