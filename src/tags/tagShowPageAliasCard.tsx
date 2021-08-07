import React, { useEffect, useState } from "react";
import { AddAliasField } from "./addAliasField";
import { Api } from "api";
import { ShowTagViewModel } from "./tagShowPage";

interface TagDetailPageAliasCardProps {
  tag: ShowTagViewModel;
  tagName: string;

  onAliasRemoved: (a: string) => void;
  onAliasAdded: (a: string) => void;
}

const removeAlias = (
  tagName: string,
  alias: string,
  setAliases: (f: (aliases: string[]) => string[]) => void,
  onAliasRemoved: (a: string) => void
): void => {
  setAliases((currentAliases) => {
    const newAliases = currentAliases.slice();
    newAliases.splice(newAliases.indexOf(alias));
    return newAliases;
  });

  Api.Tags.removeAlias(tagName, alias).then((_) => {
    onAliasRemoved(alias);
  });
};

const onAliasAdded = (
  parentOnAliasAdded: (a: string) => void,
  setAliases: (f: (aliases: string[]) => string[]) => void,
  a: string
) => {
  setAliases((x) => [...x, a]);
  parentOnAliasAdded(a);
};

const useAliases = (props: TagDetailPageAliasCardProps) => {
  const [aliases, setAliases] = useState<string[]>(props.tag.aliases);

  useEffect(() => {
    setAliases(props.tag.aliases);
  }, [props.tag.aliases]);

  const currentAliases =
    aliases.length === 0 ? null : (
      <ul>
        {aliases.sort().map((a, idx) => (
          <li key={a}>
            {a}
            <a
              className="beevenue-TagDetail-AliasDelete delete is-small"
              aria-label={`tag-delete-alias-${idx}`}
              onClick={(e) =>
                removeAlias(props.tagName, a, setAliases, props.onAliasRemoved)
              }
            />
          </li>
        ))}
      </ul>
    );

  return { currentAliases, setAliases };
};

const TagDetailPageAliasCard = (props: TagDetailPageAliasCardProps) => {
  const { currentAliases, setAliases } = useAliases(props);

  return (
    <div className="card beevenue-Card">
      <header className="card-header">
        <p className="card-header-title">Aliases</p>
      </header>
      <div className="card-content">
        <div className="content">
          {currentAliases}
          <AddAliasField
            tag={props.tagName}
            onAliasAdded={(a) =>
              onAliasAdded(props.onAliasAdded, setAliases, a)
            }
          />
        </div>
      </div>
    </div>
  );
};

export { TagDetailPageAliasCard };
export default TagDetailPageAliasCard;
