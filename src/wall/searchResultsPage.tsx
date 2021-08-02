import React, { useEffect, useMemo } from "react";
import { useRouteMatch } from "react-router";

import { useDispatch } from "react-redux";

import { setSearchQuery, setTitle } from "../redux/actions";

import { Api } from "api";
import { LoadMediaParameters } from "api/api";
import Album from "./album";

interface SearchResultsPageParams {
  extra: string;
}

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const match = useRouteMatch<SearchResultsPageParams>();

  const searchTermsFromRoute = useMemo((): string => {
    const joinedTerms = match.params.extra;
    if (!joinedTerms) return "";
    const tags = joinedTerms.split("/").join(" ");
    return tags;
  }, [match.params.extra]);

  // Only do this once (when landing on this page directly)
  // to correctly initialize global state from that URL.
  // Local state is then kept in sync with global state
  // as the source of truth.
  useEffect(() => {
    dispatch(setSearchQuery(searchTermsFromRoute));
    dispatch(setTitle(`Search: ${searchTermsFromRoute}`));
  }, [dispatch, searchTermsFromRoute]);

  const apiCall = (params: LoadMediaParameters) => {
    return Api.Medium.search({ ...params, q: searchTermsFromRoute });
  };

  return <Album apiCall={apiCall} />;
};

export { SearchResultsPage };
export default SearchResultsPage;
