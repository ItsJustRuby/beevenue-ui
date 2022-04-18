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

  useEffect(() => {
    if (!buttonRef.current || !window.google) {
      return;
    }

    const onSuccess = (response: CredentialResponse) => {
      if (response.credential !== undefined) {
        props.onSuccess(response.credential);
      }
    };

    window.google.accounts.id.initialize({
      auto_select: props.doAutoLogin,
      cancel_on_tap_outside: false,
      client_id: Config.googleClientId,
      callback: onSuccess,
      ux_mode: "popup",
    });

    if (props.doAutoLogin) {
      window.google.accounts.id.prompt(() => {});
    }
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "icon",
    });
  }, [buttonRef, props, props.doAutoLogin]);

  return <div ref={buttonRef}></div>;
};

export { GoogleLoginButton };
export default GoogleLoginButton;
