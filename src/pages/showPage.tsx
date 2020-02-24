import React, { Component } from "react";
import { match } from "react-router";

import TagsInput from "react-tagsinput";

import { Api } from "../api/api";
import { ShowViewModel, Rating } from "../api/show";
import { BeevenuePage, BeevenuePageProps } from "./beevenuePage";
import { Medium } from "../fragments/medium";
import { connect } from "react-redux";
import {
  addNotification,
  addNotLoggedInNotification,
  redirect
} from "../redux/actions";
import pick from "lodash-es/pick";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { MediumDeleteButton } from "../fragments/MediumDeleteButton";
import { MissingTags } from "../fragments/missingTags";

import { isSessionSfw, getLoggedInRole } from "../redux/reducers/login";
import { RegenerateThumbnailButton } from "../fragments/RegenerateThumbnailButton";
import { Link } from "react-router-dom";
import { PickAlternateThumbnailWidget } from "../fragments/pickAlternateThumbnailWidget";

interface UnitializedShowPageState {
  ViewModel: ShowViewModel | null;
}

interface InitializedShowPageState {
  ViewModel: ShowViewModel;
}

type ShowPageState = UnitializedShowPageState | InitializedShowPageState;

interface ShowPageProps extends BeevenuePageProps {
  isSessionSfw: boolean;
  loggedInRole: string | null;

  match: match<ShowPageParams>;
  addNotification: typeof addNotification;
  addNotLoggedInNotification: typeof addNotLoggedInNotification;
  redirect: typeof redirect;
}

interface ShowPageParams {
  id: string;
}

const FullRating = (r: Rating): string => {
  const dict = {
    u: "Unknown",
    s: "Safe",
    q: "Questionable",
    e: "Explicit"
  };

  return dict[r];
};

class ShowPage extends Component<ShowPageProps, ShowPageState, any> {
  public constructor(props: ShowPageProps) {
    super(props);
    this.state = { ViewModel: null };
  }

  private get mediumId(): number {
    return parseInt(this.props.match.params.id, 10);
  }

  componentDidMount() {
    this.loadMedium(this.mediumId);
  }

  private get userIsAdmin() {
    return this.props.loggedInRole === "admin";
  }

  private loadMedium(mediumId: number) {
    Api.show(mediumId).then(
      res => {
        this.setState({ ViewModel: res.data as ShowViewModel });
      },
      err => {
        if (err.response.status === 401) {
          this.props.addNotLoggedInNotification();
        }

        this.props.redirect("/");
      }
    );
  }

  componentDidUpdate(oldProps: ShowPageProps, oldState: ShowPageState) {
    if (this.props.isSessionSfw && this.state.ViewModel !== null) {
      if (this.state.ViewModel.rating !== "s") {
        this.props.redirect("/");
        return;
      }
    }

    if (oldProps.isSessionSfw !== this.props.isSessionSfw) {
      if (this.state.ViewModel !== null) {
        this.loadMedium(this.state.ViewModel.id);
      }
    }

    if (oldProps.match.params.id === this.props.match.params.id) return;

    this.loadMedium(parseInt(this.props.match.params.id, 10));
  }

  deleteMedium() {
    Api.deleteMedium(this.mediumId).then(
      res => {
        this.props.addNotification({
          level: "info",
          contents: ["Deletion successful."]
        });
        this.props.redirect("/");
      },
      err => {
        this.props.addNotification({
          level: "error",
          contents: ["Deletion unsuccessful."]
        });
        this.props.redirect("/");
      }
    );
  }

  renderTags(viewModel: ShowViewModel) {
    if (!viewModel.tags) {
      return null;
    }

    const renderLayout = (tagComponents: any, inputComponent: any) => {
      return (
        <>
          {tagComponents}
          {this.userIsAdmin ? inputComponent : null}
        </>
      );
    };

    const renderTag = (props: any) => {
      const {
        tag,
        key,
        disabled,
        onRemove,
        classNameRemove,
        getTagDisplayValue,
        ...other
      } = props;

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
              <a className="tag is-delete" onClick={e => onRemove(key)} />
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Tags</p>
        </header>
        <div className="card-content">
          <div className="content">
            <TagsInput
              value={viewModel.tags}
              disabled={this.userIsAdmin ? undefined : true}
              className="tagsinput field is-grouped is-grouped-multiline input"
              tagProps={{ className: "tags has-addons" }}
              renderTag={renderTag}
              renderLayout={renderLayout}
              onlyUnique={true}
              addKeys={[9, 13, 32, 188]} // Tab, Enter, Space, Comma
              onChange={(e: any) => this.onTagsChange(e)}
            />
          </div>
        </div>
      </div>
    );
  }

  updateMedium(newState: InitializedShowPageState) {
    const params = pick(newState.ViewModel, ["id", "tags", "rating"]);
    return Api.updateMedium(params).then(res => {
      this.setState(newState);
      return res;
    });
  }

  onTagsChange(newTags: string[]) {
    // Technically, the user can't manually enter these characters.
    // However, by pasting them, they can still occur in here.
    const cleanTags = newTags.map(unclean => {
      return unclean.replace(/[\t\r\n ]/g, "");
    });

    const newState = { ...(this.state as InitializedShowPageState) };
    newState.ViewModel.tags = cleanTags;
    this.updateMedium(newState).then(res => {
      // TODO Inelegant - REST response to updateMedium could already
      // contain this information so we save one round trip.
      this.loadMedium(this.mediumId);
    });
  }

  onRatingChange(value: string) {
    const newRating = value as Rating;
    if (!newRating) return;

    const newState = { ...(this.state as InitializedShowPageState) };
    newState.ViewModel.rating = newRating;
    this.updateMedium(newState);
  }

  renderRating(viewModel: ShowViewModel): JSX.Element | null {
    if (!viewModel.rating) {
      return null;
    }

    const ratingElementFor = (r: Rating): JSX.Element => {
      const fullRating = FullRating(r);
      const id = `currentRating${fullRating}`;
      return (
        <div className="beevenue-rating" key={id}>
          <input
            className="is-checkradio"
            type="radio"
            disabled={this.userIsAdmin ? undefined : true}
            checked={viewModel.rating === r}
            name="currentRating"
            onChange={e => this.onRatingChange(e.target.value)}
            value={r}
            id={id}
          />
          <label htmlFor={id}>{fullRating}</label>
        </div>
      );
    };

    const ratings: Rating[] = ["s", "q", "e"];

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Rating</p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="field beevenue-ratings">
              {ratings.map(ratingElementFor)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let view;
    const viewModel = this.state.ViewModel;

    if (viewModel !== null) {
      view = (
        <>
          <Medium {...viewModel} />
          {this.renderTags(viewModel)}
          {this.renderRating(viewModel)}
          {this.userIsAdmin ? (
            <>
              <MissingTags {...viewModel} />
              <MediumDeleteButton onConfirm={() => this.deleteMedium()} />
              <RegenerateThumbnailButton mediumId={this.mediumId} />
              <PickAlternateThumbnailWidget {...viewModel} />
            </>
          ) : null}
        </>
      );
    } else {
      view = <BeevenueSpinner />;
    }

    return (
      <BeevenuePage {...this.props}>
        <div className="beevenue-show-page">{view}</div>
      </BeevenuePage>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    loggedInRole: getLoggedInRole(state.login),
    isSessionSfw: isSessionSfw(state.login)
  };
};

const x = connect(mapStateToProps, {
  addNotification,
  addNotLoggedInNotification,
  redirect
})(ShowPage);
export { x as ShowPage };
export default x;
