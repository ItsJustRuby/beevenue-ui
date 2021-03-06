import React, { Fragment, useState, useMemo, useEffect } from "react";
import { Api } from "api";
import { AddImplicationField, Mode } from "./addImplicationField";
import { Link } from "react-router-dom";

type AddOrRemove = "Add" | "Remove";

export interface TagImplicationsViewModel {
  implied_by_this: string[];
  implying_this: string[];
}

interface ImplicationsCardProps {
  tag: TagImplicationsViewModel;
  tagName: string;
}

const updateArrays = (
  addOrRemove: AddOrRemove,
  current: any[],
  setter: (a: any[]) => void,
  tagName: string
) => {
  const newArray = current.slice();
  if (addOrRemove === "Add") {
    newArray.push(tagName);
  } else {
    const maybeIdx = newArray.indexOf(tagName);
    if (maybeIdx > -1) {
      newArray.splice(maybeIdx, 1);
    }
  }

  setter(newArray);
};

const listHelper = (list: string[], callback: (s: string) => void) => {
  if (list.length === 0) return null;

  return (
    <ul>
      {list.map((a) => (
        <Fragment key={a}>
          <li>
            <Link to={`/tag/${a}`}>{a}</Link>
            <a
              className="beevenue-TagDetail-AliasDelete delete is-small"
              aria-label={`tag-delete-implication-${a}`}
              onClick={(e) => callback(a)}
            />
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

const removeHelper = (
  apiCall: Promise<any>,
  current: string[],
  setter: (a: string[]) => void,
  a: string
) => {
  return apiCall.then(
    (res) => {
      updateArrays("Remove", current, setter, a);
    },
    (err) => {
      console.log(err);
    }
  );
};

const useHelper = (
  props: ImplicationsCardProps,
  mode: Mode,
  apiDeleteCall: (a: string, tagName: string) => Promise<any>
) => {
  const { tagName } = props;
  const [currentTagName, setCurrentTagName] = useState<string>(tagName);

  useEffect(() => {
    setCurrentTagName(tagName);
  }, [tagName]);

  const initialArray =
    mode === "ImpliedByThis"
      ? props.tag.implied_by_this
      : props.tag.implying_this;
  const [array, setArray] = useState(initialArray);

  useEffect(() => {
    setArray(initialArray);
  }, [initialArray]);

  return useMemo((): any => {
    const remove = (a: string) =>
      removeHelper(apiDeleteCall(a, currentTagName), array, setArray, a);

    return (
      <div>
        {mode === "ImpliedByThis" ? "Implied by this" : "Implying this"}:
        {listHelper(array, remove)}
        <AddImplicationField
          tag={currentTagName}
          mode={mode}
          onImplicationAdded={(a) => updateArrays("Add", array, setArray, a)}
        />
      </div>
    );
  }, [array, currentTagName, mode, apiDeleteCall]);
};

const ImplicationsCard = (props: ImplicationsCardProps) => {
  const getImpliedByThis = useHelper(
    props,
    "ImpliedByThis",
    (a: string, tagName: string) => Api.Tags.removeImplication(tagName, a)
  );

  const getImplyingThis = useHelper(
    props,
    "ImplyingThis",
    (a: string, tagName: string) => Api.Tags.removeImplication(a, tagName)
  );

  return (
    <div className="card beevenue-Card">
      <header className="card-header">
        <p className="card-header-title">Implications</p>
      </header>
      <div className="card-content">
        <div className="content">
          {getImpliedByThis}
          {getImplyingThis}
        </div>
      </div>
    </div>
  );
};

export { ImplicationsCard };
