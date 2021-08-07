import React from "react";
import TagsInput from "react-tagsinput";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ImmediateUpdateDispatch } from "./detailPageInner";

interface DetailPageTagsCardProps {
  isAbsentTags: boolean;
  tags: Array<string>;
  userIsAdmin: boolean;
}

const renderTag = (props: any) => {
  const { tag, key, disabled, onRemove, getTagDisplayValue, ...other } = props;

  const displayValue = getTagDisplayValue(tag);

  const linkTarget = disabled
    ? `/search/${displayValue}`
    : `/tag/${displayValue}`;

  return (
    <div className="control" key={key}>
      <div {...other}>
        <Link to={linkTarget}>
          <span className="tag">{displayValue}</span>
        </Link>
        {!disabled && (
          <a className="tag is-delete" onClick={(e) => onRemove(key)} />
        )}
      </div>
    </div>
  );
};

const getRenderLayout = (userIsAdmin: boolean) => {
  return (tagComponents: any, inputComponent: any) => {
    return (
      <>
        {tagComponents}
        {userIsAdmin ? inputComponent : null}
      </>
    );
  };
};

const cleanTags = (unclean: string[]) => {
  // Technically, the user can't manually enter these characters.
  // However, by pasting them, they can still occur in here.
  return unclean.map((s) => s.replace(/[\t\r\n ]/g, ""));
};

const DetailPageTagsCard = (props: DetailPageTagsCardProps) => {
  const { isAbsentTags, tags, userIsAdmin } = props;

  const dispatch = useContext(ImmediateUpdateDispatch)!;

  if (!tags) {
    return null;
  }

  const replaceTags = (newValue: string[]) => {
    newValue = cleanTags(newValue);

    if (isAbsentTags) {
      dispatch({
        action: "replaceAbsentTags",
        absentTags: newValue,
      });
    } else {
      dispatch({
        action: "replaceTags",
        tags: newValue,
      });
    }
  };

  const className = isAbsentTags
    ? "beevenue-medium-absent-tags"
    : "beevenue-medium-tags";
  const placeholder = isAbsentTags ? "Add absent tags" : "Add tags";

  const tagProps = {
    className: isAbsentTags
      ? "beevenue-AbsentTag tags has-addons"
      : "tags has-addons",
  };

  return (
    <nav className={`level ${className}`}>
      <TagsInput
        value={tags.sort()}
        disabled={userIsAdmin ? undefined : true}
        className="tagsinput field is-grouped is-grouped-multiline input"
        inputProps={{
          "aria-label": className,
          className: "react-tagsinput-input beevenue-TagsInput-Input",
          placeholder,
        }}
        tagProps={tagProps}
        renderTag={renderTag}
        renderLayout={getRenderLayout(userIsAdmin)}
        onlyUnique={true}
        addKeys={[9, 13, 32, 188]} // Tab, Enter, Space, Comma
        onChange={replaceTags}
      />
    </nav>
  );
};

export { DetailPageTagsCard };
