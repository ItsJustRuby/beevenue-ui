import React, { useEffect, useState } from "react";

import { Api } from "api";
import { useLoginRequired } from "../hooks/loginRequired";
import { BeevenueSpinner } from "../beevenueSpinner";

import { Rating } from "types";

export type RatingStats = Record<Rating, number>;

type Stats = Record<Rating, number>;

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

  const getStats = (stats: Stats) => {
    const allRatings: Rating[] = ["s", "q", "e", "u"];

    let total = 0;
    allRatings.forEach((rating) => {
      total += stats[rating];
    });

    const rows: JSX.Element[] = allRatings.map((rating) => {
      return (
        <tr key={rating}>
          <td>{rating}</td>
          <td>{stats[rating]}</td>
          <td>{((100 * stats[rating]) / total).toFixed(2)}</td>
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

  let content: JSX.Element;
  if (stats === null) {
    content = <BeevenueSpinner />;
  } else {
    content = getStats(stats);
  }

  return (
    <>
      <h2 className="title is-2">Stats</h2>
      <h3 className="title is-3">Ratings</h3>
      {content}
    </>
  );
};

export { StatsPage };
export default StatsPage;
