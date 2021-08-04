import { TemporaryViewModel } from "detail/immediateUpdateReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { forceRedirect } from "redirect";
import { useIsSessionSfw } from "redux/selectors";

const useClosePageOnSfw = (viewModel: TemporaryViewModel) => {
  const dispatch = useDispatch();
  const isSessionSfw = useIsSessionSfw();
  const history = useHistory();

  useEffect(() => {
    if (isSessionSfw && viewModel.isCanonical && viewModel.rating !== "s") {
      forceRedirect(history, "/");
    }
  }, [history, isSessionSfw, viewModel, dispatch]);
};

export { useClosePageOnSfw };
