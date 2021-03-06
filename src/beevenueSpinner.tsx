import React from "react";
// This partial import is ugly, but reduces bundle size.
//@ts-ignore
import RingLoader from "react-spinners/RingLoader";

const BeevenueSpinner = (props: any) => {
  return (
    <div className="beevenue-Spinner">
      <RingLoader {...props} />
    </div>
  );
};

export { BeevenueSpinner };
