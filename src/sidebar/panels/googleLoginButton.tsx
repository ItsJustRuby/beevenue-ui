import { useEffect, useRef } from "react";
import Config from "../../config";

interface GoogleLoginButtonProps {
  doAutoLogin: boolean;
  onSuccess: (jwt: string) => void;
}

const GoogleLoginButton = (props: GoogleLoginButtonProps) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    const onSuccess = (response: any) => {
      console.log(response);
      if ((response as any).credential !== undefined) {
        props.onSuccess((response as any).credential);
      }
    };

    (window as any).google.accounts.id.initialize({
      auto_select: props.doAutoLogin,
      cancel_on_tap_outside: false,
      client_id: Config.googleClientId,
      callback: onSuccess,
      prompt: "",
      ux_mode: "popup",
    });

    if (props.doAutoLogin) {
      (window as any).google.accounts.id.prompt();
    }
    (window as any).google.accounts.id.renderButton(buttonRef.current, {
      type: "icon",
    });
  }, [buttonRef, props, props.doAutoLogin]);

  return <div ref={buttonRef}></div>;
};

export { GoogleLoginButton };
export default GoogleLoginButton;
