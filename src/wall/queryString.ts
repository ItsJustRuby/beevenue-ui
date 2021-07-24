import qs from "qs";
import { useHistory, useLocation } from "react-router-dom";
import { useCallback } from "react";
import { forceRedirect } from "../redirect";

interface QueryStringRedirectParameters {
  pageNr: number;
  pageSize?: number;
}

export const useQueryStringRedirect = () => {
  const history = useHistory();
  const location = useLocation();
  const f = useCallback(
    (q: QueryStringRedirectParameters) => {
      const currentLocation = location;
      const currentQs = qs.parse(location.search, {
        ignoreQueryPrefix: true
      });
      const newQs = { ...currentQs, ...q };
      const newLocation = {
        ...currentLocation,
        search: qs.stringify(newQs, { addQueryPrefix: true })
      };

      forceRedirect(history, newLocation.pathname + newLocation.search);
    },
    [history, location]
  );

  return f;
};
