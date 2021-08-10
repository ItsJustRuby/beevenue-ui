import React, { Suspense, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Bowser from "bowser";
import { Route, Switch } from "react-router-dom";
import { BeevenueSpinner } from "./beevenueSpinner";

import { Api } from "api";
import {
  login,
  loginAnonymous,
  setClientOS,
  setClientThumbnailSize,
} from "./redux/actions";
import { BeevenuePage } from "./routing/beevenuePage";

import { IndexPage } from "./wall/indexPage";

import SearchRedirectPage from "routing/searchRedirectPage";
const SearchResultsPage = React.lazy(() => import("./wall/searchResultsPage"));

const TagStatisticsPage = React.lazy(() => import("./tags/tagStatisticsPage"));
const TagsPage = React.lazy(() => import("./tags/tagsPage"));
const TagDetailPage = React.lazy(() => import("./tags/tagShowPage"));

const DetailPage = React.lazy(() => import("./detail/detailPage"));

const RulesPage = React.lazy(() => import("./rules/rulesPage"));
const StatsPage = React.lazy(() => import("./stats/statsPage"));

const WildcardPage = React.lazy(() => import("./routing/wildcardPage"));

const AppRouter = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasUser, setHasUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only handle API response if this component is still mounted
    // (this might happen in production, but especially unbreaks tests).
    let isMounted = true;

    Api.Session.amILoggedIn()
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          dispatch(login(res.data));
        } else {
          dispatch(loginAnonymous());
        }
        setHasUser(true);
      })
      .catch((err) => {
        if (!isMounted) return;
        setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, setHasError]);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const platformType = browser.getPlatformType();
    if (platformType === "mobile") {
      dispatch(setClientThumbnailSize("s"));
    } else {
      dispatch(setClientThumbnailSize("l"));
    }

    const os = browser.getOSName();
    if (os === "iOS") {
      dispatch(setClientOS("iOS"));
    } else {
      dispatch(setClientOS("other"));
    }
  }, [dispatch]);

  const statusText = hasError
    ? "Could not connect to backend."
    : "Placeholder text";

  const statusClassName = hasError
    ? "beevenue-FullPageSpinner-Status beevenue-FullPageSpinner-Status--failed"
    : "beevenue-FullPageSpinner-Status beevenue-FullPageSpinner-Status--none";

  const fallback = (
    <div data-testid="full-page-spinner" className="beevenue-FullPageSpinner">
      <div className="beevenue-FullPageSpinner-Inner">
        <BeevenueSpinner />
        <div>
          <p className={statusClassName}>{statusText}</p>
        </div>
      </div>
    </div>
  );

  if (!hasUser) {
    return fallback;
  }

  return (
    <BeevenuePage>
      <Suspense fallback={fallback}>
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/search/:extra(.+)" component={SearchResultsPage} />
          <Route path="/search" component={SearchRedirectPage} />
          <Route path="/show/:id" component={DetailPage} />
          <Route path="/tags" component={TagsPage} />
          <Route path="/tagStats" component={TagStatisticsPage} />
          <Route path="/stats" component={StatsPage} />
          <Route path="/tag/:name" component={TagDetailPage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/:whatever" component={WildcardPage} />
        </Switch>
      </Suspense>
    </BeevenuePage>
  );
};

export { AppRouter };
