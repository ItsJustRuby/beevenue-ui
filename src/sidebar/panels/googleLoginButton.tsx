import { useEffect, useRef, useState } from "react";
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

  const [isLoadComplete, setIsLoadComplete] = useState(false);

  useEffect(() => {
    if (!isLoadComplete || !buttonRef.current) {
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
  }, [buttonRef, isLoadComplete, props, props.doAutoLogin]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoadComplete(true);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [setIsLoadComplete]);

  return <div ref={buttonRef}></div>;
};

export { GoogleLoginButton };
export default GoogleLoginButton;
