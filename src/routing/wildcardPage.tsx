import React, { useEffect } from "react";

import { useRouteMatch } from "react-router";
import { useHistory } from "react-router-dom";
import { forceRedirect } from "../redirect";

interface WildcardPageParams {
  whatever: string;
}

const WildcardPage = () => {
  const history = useHistory();
  const match = useRouteMatch<WildcardPageParams>();
  const { whatever } = match.params;

  useEffect(() => {
    if (whatever) {
      forceRedirect(history, "/");
    }
  }, [history, whatever]);

  return (
    <div className="column">
      <h1 className="title">Title</h1>
    </div>
  );
};

export { WildcardPage };
export default WildcardPage;
