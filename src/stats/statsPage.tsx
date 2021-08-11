import React, { useEffect, useRef, useState } from "react";

import { Api } from "api";
import { useLoginRequired } from "../hooks/loginRequired";
import { BeevenueSpinner } from "../beevenueSpinner";

import { Rating } from "types";
import { renderHistogram } from "./histogram";
import { useWindowDimensions } from "hooks/windowDimensions";

export type RatingStats = Record<Rating, number>;

interface Stats {
  tagHistogram: Record<number, number>;
  absentTagHistogram: Record<number, number>;
  byRating: Record<Rating, number>;
}

const StatsPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  useLoginRequired();

  const loadStats = () => {
    Api.Stats.get().then((res) => {
      setStats(res.data);
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getRatingStats = (ratingStats: Record<Rating, number>) => {
    const allRatings: Rating[] = ["s", "q", "e", "u"];

    let total = 0;
    allRatings.forEach((rating) => {
      total += ratingStats[rating];
    });

    const rows: JSX.Element[] = allRatings.map((rating) => {
      return (
        <tr key={rating}>
          <td>{rating}</td>
          <td>{ratingStats[rating]}</td>
          <td>{((100 * ratingStats[rating]) / total).toFixed(2)}</td>
        </tr>
      );
    });

    return (
      <table className="beevenue-table table">
        <thead>
          <tr>
            <th>Rating</th>
            <th># Media</th>
            <th>% of total</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const tagHistogram = useRef<HTMLDivElement>(null);
  const absentTagHistogram = useRef<HTMLDivElement>(null);
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    if (stats === null) return;

    if (tagHistogram.current !== null) {
      renderHistogram(stats.tagHistogram, tagHistogram.current);
    }

    if (absentTagHistogram.current !== null) {
      renderHistogram(stats.absentTagHistogram, absentTagHistogram.current);
    }
  }, [stats, windowDimensions]);

  let content: JSX.Element;
  if (stats === null) {
    content = <BeevenueSpinner />;
  } else {
    content = (
      <>
        <h3 className="title is-3">Ratings</h3>
        {getRatingStats(stats.byRating)}
        <h3 className="title is-3">Tag histogram</h3>
        <div className="beevenue-TagHistogram" ref={tagHistogram} />
        <h3 className="title is-3">Absent tag histogram</h3>
        <div className="beevenue-TagHistogram" ref={absentTagHistogram} />
      </>
    );
  }

  return (
    <>
      <h2 className="title is-2">Stats</h2>
      {content}
    </>
  );
};

export { StatsPage };
export default StatsPage;
