import React, { useEffect, useState } from "react";
import { Api } from "api";
import { forceRedirect } from "../redirect";
import { useHistory } from "react-router-dom";

interface EditableTitleFieldProps {
  initialTitle: string;
}

const EditableTitleField = (props: EditableTitleFieldProps) => {
  const [currentTitle, setCurrentTitle] = useState(props.initialTitle);

  const history = useHistory();

  useEffect(() => {
    setCurrentTitle(props.initialTitle);
  }, [props.initialTitle]);

  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const onTitleChanged = (newTitle: string): void => {
    forceRedirect(history, `/tag/${newTitle}`, true);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    stopEditing();
  };

  const onChange = (text: string) => {
    setCurrentTitle(text);
  };

  const beginEditing = () => {
    setIsBeingEdited(true);
  };

  const stopEditing = () => {
    if (!currentTitle) return;

    if (currentTitle === props.initialTitle) {
      setIsBeingEdited(false);
      return;
    }

    Api.Tags.patch(props.initialTitle, {
      tag: currentTitle,
    }).then((_) => {
      setIsBeingEdited(false);
      onTitleChanged(currentTitle || "");
    });
  };

  let content = null;
  if (isBeingEdited) {
    content = (
      <form
        onSubmit={(e) => onSubmit(e)}
        className="beevenue-TagDetail-EditableTitle"
      >
        <input
          className="input"
          aria-label="tag-title-input"
          onBlur={(e) => stopEditing()}
          type="text"
          autoFocus
          placeholder="Tag title"
          onChange={(e) => onChange(e.currentTarget.value)}
          value={currentTitle || ""}
        />
      </form>
    );
  } else {
    content = (
      <span aria-label="tag-title" onClick={(e) => beginEditing()}>
        "{currentTitle}" tag
      </span>
    );
  }

  return <>{content}</>;
};

export { EditableTitleField };
