import { BeevenueStore } from "../storeTypes";
import { useSelector, TypedUseSelectorHook } from "react-redux";

export const useBeevenueSelector: TypedUseSelectorHook<BeevenueStore> =
  useSelector;

export const useSpeedTagging = () =>
  useBeevenueSelector((store) => store.speedTagging);

export const useTitle = () => useBeevenueSelector((store) => store.title);

export const useIsSessionSfw = () =>
  useBeevenueSelector((store) => store.login.sfwSession);

export const useDoAutoLogin = () =>
  useBeevenueSelector((store) => store.login.doAutoLogin);
