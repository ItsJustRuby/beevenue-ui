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
    <>
      <TagSimilarityWidget />
      <TagImplicationWidget />
    </>
  );
};

export { TagStatisticsPage };
export default TagStatisticsPage;
