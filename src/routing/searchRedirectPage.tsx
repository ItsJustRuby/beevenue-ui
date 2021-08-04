import React from "react";
import qs from "qs";
import { Redirect, useLocation } from "react-router-dom";

const SearchRedirectPage = () => {
  const location = useLocation();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const q = query.q;
  if (!q || typeof q !== "string") {
    return <Redirect to="/" />;
  }

  const longPath = decodeURI(q).replace(" ", "/");
  return <Redirect to={`/search/${longPath}`} />;
};

export { SearchRedirectPage };
export default SearchRedirectPage;
