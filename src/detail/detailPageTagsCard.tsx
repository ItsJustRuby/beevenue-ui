import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ImmediateUpdateDispatch } from "./detailPageInner";
import Tags from "@yaireo/tagify/dist/react.tagify";
import { BaseTagData, ChangeEventData } from "@yaireo/tagify";

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

  const replaceTags = (event: CustomEvent<ChangeEventData<BaseTagData>>) => {
    const newValue = cleanTags(event.detail.tagify.value.map((o) => o.value));

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
      {/* TODO Keep fixing me */}
      <Tags
        className="tagsinput field is-grouped is-grouped-multiline input"
        onChange={replaceTags}
        value={tags.sort()}
        placeholder={placeholder}
        readOnly={userIsAdmin ? undefined : true}
        settings={{
          delimiters: ",| |\n|\t",
        }}
      />
      {/* <TagsInput
        inputProps={{
          "aria-label": className,
        }}
        tagProps={tagProps}
        renderTag={renderTag}
        renderLayout={getRenderLayout(userIsAdmin)}
      /> */}
    </nav>
  );
};

export { DetailPageTagsCard };
