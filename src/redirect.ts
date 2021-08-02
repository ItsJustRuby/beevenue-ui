import { BrowserHistory } from "history";

export const forceRedirect = (
  history: BrowserHistory,
  target: string,
  doReplace?: boolean
) => {
  let actualDoReplace = false;

  if (doReplace !== undefined) {
    actualDoReplace = doReplace;
  }

  if (actualDoReplace) {
    history.replace(target);
  } else {
    history.push(target);
  }
};
