import React from "react";
import { Sidebar } from "../sidebar";
import { NotificationsPanel } from "./notificationsPanel";
import { Helmet } from "react-helmet";
import { useTitle } from "redux/selectors";

export const BeevenuePage = (props: any) => {
  const titleAccessor = useTitle();

  let fullTitle = "Beevenue";
  const title = titleAccessor.title;
  if (title !== "") {
    fullTitle = `${fullTitle} - ${title}`;
  }

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      <div>
        <section className="section">
          <div className="columns is-tablet">
            <div className="column is-narrow-tablet is-narrow-mobile">
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
