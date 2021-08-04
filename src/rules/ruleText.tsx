import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Rating } from "../types";

type IffRulePartKind = "all" | "hasRating" | "hasAnyTagsIn" | "hasAnyTagsLike";

type ThenRulePartKind =
  | "all"
  | "fail"
  | "hasRating"
  | "hasAnyTagsIn"
  | "hasAllAbsentOrPresent"
  | "hasAnyTagsLike";

export type RulePartKind = IffRulePartKind | ThenRulePartKind;

interface RulePart {
  type: RulePartKind;
}

interface IfRulePart extends RulePart {
  type: IffRulePartKind;
}

interface ThenRulePart extends RulePart {
  type: ThenRulePartKind;
}

interface HasRatingRulePart extends RulePart {
  type: "hasRating";
  data: Rating;
}

interface HasAnyTagsLikeRulePart extends RulePart {
  type: "hasAnyTagsLike";
  data: string[];
}

interface HasAnyTagsInRulePart extends RulePart {
  type: "hasAnyTagsIn";
  data: string[];
}

interface HasAllTagsAbsentOrPresentRulePart extends RulePart {
  type: "hasAllAbsentOrPresent";
  data: string[];
}

export interface Rule {
  if: IfRulePart | IfRulePart[];
  then: ThenRulePart | ThenRulePart[];
}

interface Selector<T1, T2> {
  (t: T1, idx: number): T2;
}

const defaultSelector = (x: any, idx: number): any => {
  if (typeof x === "string") {
    return x;
  }
  return <Fragment key={idx}>{x}</Fragment>;
};

function _arrayToFragment<T1, T2>(
  terms: any[],
  options: {} = {},
  selector: Selector<T1, T2> = defaultSelector
) {
  if (!terms || terms.length === 0) return [];

  const localOptions = {
    separator: ", ",
    finalSeparator: " or ",
    ...options,
  };

  const n = terms.length;

  const results: (T2 | string)[] = [];
  terms.forEach((t, idx) => {
    results.push(selector(t, idx));
    if (idx === n - 1) return;
    if (idx === n - 2) {
      results.push(localOptions.finalSeparator);
      return;
    }

    results.push(localOptions.separator);
  });

  return results;
}

const RuleText = (props: Rule) => {
  const linkSelector = (x: string, idx: number) => {
    return (
      <Link key={idx} to={`/tag/${x}`}>
        {x}
      </Link>
    );
  };

  const renderIffTagsIn = (rulePart: HasAnyTagsInRulePart) => {
    return (
      <>
        has the tag&nbsp;
        {_arrayToFragment(rulePart.data, {}, linkSelector)}
      </>
    );
  };

  const renderThenTagsIn = (rulePart: HasAnyTagsInRulePart) => {
    return (
      <>
        should have one of the tags&nbsp;
        {_arrayToFragment(rulePart.data, {}, linkSelector)}
      </>
    );
  };

  const renderThenAbsentOrPresent = (
    rulePart: HasAllTagsAbsentOrPresentRulePart
  ) => {
    return (
      <>
        should have all of the following tags marked as present or absent:&nbsp;
        {_arrayToFragment(
          rulePart.data,
          { finalSeparator: " and " },
          linkSelector
        )}
      </>
    );
  };

  const renderIf = (iff: IfRulePart) => {
    switch (iff.type) {
      case "all":
        return "exists";
      case "hasRating":
        return `has a rating of ${(iff as HasRatingRulePart).data}`;
      case "hasAnyTagsIn":
        return renderIffTagsIn(iff as HasAnyTagsInRulePart);
      case "hasAnyTagsLike":
        return `has a tag like ${_arrayToFragment(
          (iff as HasAnyTagsLikeRulePart).data
        )}`;
    }
  };

  const renderThen = (then: ThenRulePart) => {
    const _thenTextHasRating = (p: HasRatingRulePart): string => {
      if (p.data) {
        return `should have a rating of ${p.data}`;
      }
      return "should have a rating";
    };

    switch (then.type) {
      case "fail":
        return "should not exist";
      case "all":
        return "should never happen";
      case "hasRating":
        return _thenTextHasRating(then as HasRatingRulePart);
      case "hasAnyTagsIn":
        return renderThenTagsIn(then as HasAnyTagsInRulePart);
      case "hasAllAbsentOrPresent":
        return renderThenAbsentOrPresent(
          then as HasAllTagsAbsentOrPresentRulePart
        );
      case "hasAnyTagsLike":
        return `should have a tag like ${_arrayToFragment(
          (then as HasAnyTagsLikeRulePart).data
        ).join("")}`;
    }
  };

  const renderIfs = (iffs: IfRulePart | IfRulePart[]) => {
    if (!Array.isArray(iffs)) {
      iffs = [iffs];
    }
    const iffsTexts = iffs.map(renderIf);
    return _arrayToFragment(iffsTexts, { finalSeparator: " and " });
  };

  const renderThens = (thens: ThenRulePart | ThenRulePart[]) => {
    if (!Array.isArray(thens)) {
      thens = [thens];
    }
    const thensTexts = thens.map(renderThen);
    return _arrayToFragment(thensTexts, { finalSeparator: " and " });
  };

  return (
    <>
      If a medium {renderIfs(props.if)}, then it {renderThens(props.then)}.
    </>
  );
};

export { RuleText };
