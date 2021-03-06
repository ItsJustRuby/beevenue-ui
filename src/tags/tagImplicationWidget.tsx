import React, { useEffect, useRef, useState } from "react";
import { Api } from "api";
import { ImplicationData } from "../api/implications";
import { useIsSessionSfw } from "../redux/selectors";
import { createImplicationsSvg } from "./tagImplications";

const TagImplicationWidget = () => {
  const [isDoneRendering, setIsDoneRendering] = useState<boolean>(false);
  const isSessionSfw = useIsSessionSfw();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    Api.Tags.getImplications().then((res) => {
      const implicationData = res.data as ImplicationData;
      createImplicationsSvg(svgRef.current!, implicationData);
      setIsDoneRendering(true);
    });
  }, [isSessionSfw, setIsDoneRendering, svgRef]);

  const label = isDoneRendering
    ? "implications-rendered"
    : "implications-rendering";

  return (
    <div className="card beevenue-Card">
      <header className="card-header">
        <p className="card-header-title">Implications</p>
      </header>
      <div className="card-content">
        <div className="content" data-testid={label}>
          <svg id="beevenue-implication-svg" ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
};

export { TagImplicationWidget };
