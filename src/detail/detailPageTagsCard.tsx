import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ImmediateUpdateDispatch } from "./detailPageInner";
import CreatableSelect from "react-select/creatable";
import { useEffect } from "react";
import { MultiValue, MultiValueProps, OnChangeValue } from "react-select";
import isEqual from "lodash-es/isEqual";

interface DetailPageTagsCardProps {
  isAbsentTags: boolean;
  tags: Array<string>;
  userIsAdmin: boolean;
}

const Tag = (props: MultiValueProps<Option, true>) => {
  const displayValue = props.data.value;
  const disabled = props.selectProps.isDisabled;

  const onRemove = (value: string) => {
    const currentValue = props.selectProps.value as MultiValue<Option>;
    const newValue = currentValue.slice().filter((v) => v.value !== value);
    props.selectProps.onChange(newValue, {
      action: "remove-value",
      removedValue: props.data,
    });
  };

  const linkTarget = disabled
    ? `/search/${displayValue}`
    : `/tag/${displayValue}`;

  const isFirst = props.index === 0;
  let classNames = ["beevenue-Tag", "tag"];
  if (isFirst) classNames.push("beevenue-Tag-first");

  const className = classNames.join(" ");

  return (
    <div className="control">
      <div className={props.className}>
        <Link to={linkTarget}>
          <span className={className}>{displayValue}</span>
        </Link>
        {!disabled && (
          <a
            className={`${className} is-delete`}
            onClick={(e) => onRemove(displayValue)}
          />
        )}
      </div>
    </div>
  );
};

const cleanTags = (unclean: string[]) => {
  // Technically, the user can't manually enter these characters.
  // However, by pasting them, they can still occur in here.
  return unclean.map((s) => s.replace(/[\t\r\n ]/g, ""));
};

interface Option {
  readonly label: string;
  readonly value: string;
}

interface State {
  inputValue: string;
  readonly value: readonly Option[];
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const DetailPageTagsCard = (props: DetailPageTagsCardProps) => {
  const { isAbsentTags, tags, userIsAdmin } = props;

  const sortedTagsFromProps = React.useMemo(() => {
    return tags.map(createOption).sort();
  }, [tags]);

  const [state, setState] = useState<State>({
    inputValue: "",
    value: sortedTagsFromProps,
  });

  const [isInSync, setIsInSync] = useState(false);

  const dispatch = useContext(ImmediateUpdateDispatch)!;

  useEffect(() => {
    const newValue = cleanTags(state.value.map((o) => o.value)).sort();

    if (isEqual(newValue, sortedTagsFromProps.map((o) => o.value).sort())) {
      return;
    }

    if (isInSync) {
      setState((s) => {
        return {
          ...s,
          value: sortedTagsFromProps,
        };
      });
      return;
    }

    if (isAbsentTags) {
      dispatch({
        action: "replaceAbsentTags",
        absentTags: newValue,
      });
      setIsInSync(false);
    } else {
      dispatch({
        action: "replaceTags",
        tags: newValue,
      });
      setIsInSync(false);
    }
  }, [dispatch, isAbsentTags, isInSync, sortedTagsFromProps, state.value]);

  useEffect(() => {
    if (isInSync) {
      return;
    }

    setState((s) => {
      return {
        ...s,
        value: sortedTagsFromProps,
      };
    });
    setIsInSync(true);
  }, [isInSync, sortedTagsFromProps]);

  if (!tags) {
    return null;
  }

  const className = isAbsentTags
    ? "beevenue-medium-absent-tags"
    : "beevenue-medium-tags";
  const placeholder = isAbsentTags ? "Add absent tags" : "Add tags";

  const handleInputChange = (inputValue: string) => {
    setState({ ...state, inputValue });
    setIsInSync(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Enter":
      case "Tab":
      case ",":
      case " ":
        setState({
          inputValue: "",
          value: [...state.value, createOption(state.inputValue)],
        });
        setIsInSync(false);
    }
  };

  const TagHOC = (reactSelectProps: MultiValueProps<Option, true>) => {
    const tagProps = {
      className: isAbsentTags
        ? "beevenue-AbsentTag tags has-addons"
        : "tags has-addons",
    };

    return <Tag {...reactSelectProps} {...tagProps} />;
  };

  const components = {
    DropdownIndicator: null,
    MultiValue: TagHOC,
  };

  const handleChange = (value: OnChangeValue<Option, true>) => {
    setState({ ...state, value });
    setIsInSync(false);
  };

  return (
    <nav className={`level ${className}`} aria-label={className}>
      <CreatableSelect
        className="tagsinput field is-grouped is-grouped-multiline input"
        components={components}
        styles={{
          control: (provided, f) => {
            return {
              ...provided,
              flexGrow: 1,
              cursor: "text",
              borderWidth: "0px",
            };
          },
        }}
        inputValue={state.inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isMulti
        isDisabled={userIsAdmin ? undefined : true}
        backspaceRemovesValue={true}
        isClearable={false}
        menuIsOpen={false}
        placeholder={placeholder}
        value={state.value}
      />
    </nav>
  );
};

export { DetailPageTagsCard };
