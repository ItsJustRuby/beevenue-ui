import React from "react";
import { Sidebar } from "../sidebar";
import { NotificationsPanel } from "./notificationsPanel";
import { Helmet } from "react-helmet";
import { useBeevenueSelector } from "redux/selectors";

export const BeevenuePage = (props: any) => {
  const title = useBeevenueSelector((store) => store.title.title);
  let fullTitle = "Beevenue";
  if (title !== "") {
    fullTitle = `${fullTitle} - ${title}`
  }

  return (
    <>
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
    <div>
      <section className="section">
        <div className="columns">
          <div className="column is-narrow">
            <Sidebar {...props} />
          </div>
          <div className="column">
            <NotificationsPanel />
            {props.children}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};
