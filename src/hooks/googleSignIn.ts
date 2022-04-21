import { useEffect, useState } from "react";

const useGoogleSignIn = () => {
  const [isLoadComplete, setIsLoadComplete] = useState(false);

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

  return { isLoadComplete, google: window.google };
};

export { useGoogleSignIn };
