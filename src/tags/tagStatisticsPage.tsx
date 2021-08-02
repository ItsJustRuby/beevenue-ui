import React, { useEffect } from "react";
import { TagSimilarityWidget } from "./tagSimilarityWidget";
import { TagImplicationWidget } from "./tagImplicationWidget";
import { useDispatch } from "react-redux";
import { setTitle } from "redux/actions";

const TagStatisticsPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Tag Stats"));
  }, [dispatch]);

  return (
    <div>
      <nav className="level" key="similarity">
        <TagSimilarityWidget />
      </nav>
      <nav className="level" key="implication">
        <TagImplicationWidget />
      </nav>
    </div>
  );
};

export { TagStatisticsPage };
export default TagStatisticsPage;
