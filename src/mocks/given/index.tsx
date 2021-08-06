import { render } from "@testing-library/react";
import App from "App";
import { rest } from "msw";
import { Rating } from "types";
import { server } from "../server";

import navigation from "./navigation";
import ruleViolations from "./ruleViolations";
import rules from "./rules";
import search from "./search";

const indexPageListsMedium = (id: number) => {
  server.use(
    rest.get("/media", (req, res, ctx) => {
      return res(
        ctx.json({
          items: [
            {
              hash: "abcd",
              id: id,
              tinyThumbnail: "Zm9vYmFyCg==",
            },
          ],
          pageCount: 5,
          pageNumber: 1,
          pageSize: 10,
        })
      );
    })
  );
};

interface LoggedInAsOptions {
  role: string;
  sfwSession: boolean;
}

const loggedInAs = (options: Partial<LoggedInAsOptions>) => {
  const defaultOptions = {
    role: "admin",
    sfwSession: false,
  };

  const actualOptions = { ...defaultOptions, ...options };

  server.use(
    rest.get("/login", (req, res, ctx) => {
      return res(
        ctx.json({
          ...{
            id: "testing",
            version: "ffffffff",
          },
          ...actualOptions,
        })
      );
    })
  );
};

const loggedOut = () => {
  server.use(
    rest.get("/login", (req, res, ctx) => {
      return res(ctx.json(false));
    })
  );
};

interface RequiredMediumOptions {
  id: number;
}

interface OptionalMediumOptions {
  rating: Rating;
}

export type AllMediumOptions = RequiredMediumOptions &
  Partial<OptionalMediumOptions>;

const medium = (options: AllMediumOptions) => {
  const actualOptions: RequiredMediumOptions & OptionalMediumOptions = {
    ...{
      rating: "s",
    },
    ...options,
  };

  server.use(
    rest.get(`/medium/${options.id}`, (req, res, ctx) => {
      return res(
        ctx.json({
          absentTags: [],
          hash: "ffff",
          id: actualOptions.id,
          mimeType: "image/jpeg",
          rating: actualOptions.rating,
          similar: [
            {
              hash: "aaaa",
              id: 414,
            },
            {
              hash: "bbbb",
              id: 52,
            },
            {
              hash: "cccc",
              id: 342,
            },
            {
              hash: "dddd",
              id: 63,
            },
            {
              hash: "eeee",
              id: 90,
            },
          ],
          tags: ["A", "B"],
        })
      );
    })
  );

  server.use(
    rest.get(`/tags/missing/${options.id}`, (req, res, ctx) => {
      return res(ctx.json({ violations: [] }));
    })
  );
};

const app = () => render(<App />);

export default {
  app,
  indexPageListsMedium,
  loggedInAs,
  loggedOut,
  medium,
  navigationTo: navigation,
  ruleViolations,
  rules,
  search,
};
