import React, { useEffect, useState } from "react";

import { Api } from "api";
import { useLoginRequired } from "../hooks/loginRequired";
import { BeevenueSpinner } from "../beevenueSpinner";

import { RuleFileUploadCard } from "./ruleFileUploadCard";
import { RuleFileDownloadCard } from "./ruleFileDownloadCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { Rule, RuleText } from "./ruleText";
import { useDispatch } from "react-redux";
import { setTitle } from "redux/actions";
import { Link } from "react-router-dom";
import { IntrusiveConfirmationModal } from "modals/intrusiveConfirmationModal";

const RulesPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Rules"));
  }, [dispatch]);

  const [rules, setRules] = useState<any[] | null>(null);
  const [isShowingModal, setIsShowingModal] = useState(false);

  useLoginRequired();

  const loadRules = (getIsMounted: () => boolean = () => true) => {
    if (!getIsMounted()) return;
    Api.Rules.get().then((res) => {
      if (!getIsMounted()) return;
      setRules(res.data);
    });
  };

  useEffect(() => {
    let isMounted = true;
    loadRules(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  // This is only initially null. It never gets reset to null, since its value only gets accessed
  // after being overwritten again anyway.
  const [ruleIndexToDelete, setRuleIndexToDelete] = useState<number | null>(
    null
  );

  const startShowingModal = (e: any, c: number) => {
    e.preventDefault();
    setRuleIndexToDelete(c);
    setIsShowingModal(true);
  };

  const getRules = (rules: Rule[]) => {
    const getRuleElement = (r: Rule, idx: number) => {
      return (
        <li key={`rule${idx}`}>
          <RuleText {...r} />
          &nbsp;
          <span className="beevenue-icon-container">
            <Link to={`/search/rule:${idx}`}>
              <FontAwesomeIcon icon={faSearch} />
            </Link>
            <Link to="#" onClick={(e) => startShowingModal(e, idx)}>
              <FontAwesomeIcon icon={faTrash} />
            </Link>
          </span>
        </li>
      );
    };

    const doConfirm = () => {
      if (ruleIndexToDelete === null) {
        return;
      }

      Api.Rules.delete(ruleIndexToDelete).then((_) => loadRules());
    };

    return (
      <>
        <nav className="level">
          <div className="level-item beevenue-level-item-fullwidth">
            <div className="card beevenue-sidebar-card">
              <header className="card-header">
                <p className="card-header-title">Rules</p>
              </header>
              <div className="card-content">
                <div className="content">
                  <IntrusiveConfirmationModal
                    isVisible={isShowingModal}
                    setIsVisible={setIsShowingModal}
                    onConfirm={doConfirm}
                  />
                  <ul>{rules.map(getRuleElement)}</ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  };

  let content: JSX.Element;
  if (rules === null) {
    content = <BeevenueSpinner />;
  } else {
    content = getRules(rules);
  }

  return (
    <>
      <h2 className="title is-2">Rules</h2>
      <h3 className="title is-3">File</h3>
      <RuleFileUploadCard onUploaded={() => loadRules()} />
      <RuleFileDownloadCard />
      <h3 className="title is-3">Current rules</h3>
      {content}
    </>
  );
};

export { RulesPage };
export default RulesPage;
