import { useGoogleSignIn } from "hooks/googleSignIn";
import { useEffect, useRef } from "react";
import Config from "../../config";

type CredentialResponse = Parameters<
  NonNullable<
    Parameters<typeof window.google.accounts.id.initialize>[0]["callback"]
  >
>[0];

interface GoogleLoginButtonProps {
  doAutoLogin: boolean;
  onSuccess: (jwt: string) => void;
}

const GoogleLoginButton = (props: GoogleLoginButtonProps) => {
  const buttonRef = useRef(null);
  const { isLoadComplete, google } = useGoogleSignIn();

  useEffect(() => {
    if (!isLoadComplete || !buttonRef.current) {
      return;
    }

    const onSuccess = (response: CredentialResponse) => {
      if (response.credential !== undefined) {
        props.onSuccess(response.credential);
      }
    };

    google.accounts.id.initialize({
      auto_select: props.doAutoLogin,
      cancel_on_tap_outside: false,
      client_id: Config.googleClientId,
      callback: onSuccess,
      ux_mode: "popup",
    });

    if (props.doAutoLogin) {
      google.accounts.id.prompt(() => {});
    }
    google.accounts.id.renderButton(buttonRef.current, {
      type: "icon",
    });
  }, [buttonRef, isLoadComplete, props, props.doAutoLogin]);

  return <div ref={buttonRef}></div>;
};

export { GoogleLoginButton };
export default GoogleLoginButton;
