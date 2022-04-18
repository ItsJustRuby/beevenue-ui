import { rest } from "msw";

const defaultMedium = (id: number) => {
  return {
    absentTags: [],
    hash: "ffff",
    id,
    mimeType: "image/jpeg",
    rating: "s",
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
  };
};

const mediaHandler = (req: any, res: any, ctx: any) => {
  const pageNrString = req.url.searchParams.get("pageNumber");
  const pageNumber = pageNrString ? parseInt(pageNrString, 10) : 1;
  return res(
    ctx.json({
      items: [
        {
          hash: "9762152070fd76452299c84c8658893e",
          id: 1,
          tinyThumbnail: "Zm9vYmFyCg==",
        },
      ],
      pageCount: 5,
      pageNumber: pageNumber,
      pageSize: 10,
    })
  );
};

export const defaultHandlers = [
  rest.post("/logout", (req, res, ctx) => {
    return res(ctx.json(""));
  }),
  rest.post("/login", (req, res, ctx) => {
    return res(
      ctx.json({
        id: "testing",
        role: "admin",
        version: "ffffffff",
        sfwSession: true,
      })
    );
  }),
  rest.get("/login", (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem("is-authenticated", "true");
    return res(ctx.status(500));
  }),
  rest.delete("/medium/:whatever", (req, res, ctx) => {
    return res(ctx.json(""));
  }),
  rest.get("/medium/:id/thumbnail/picks", (req, res, ctx) => {
    return res(
      ctx.json({
        thumbs: [Array(30).fill("/9j/example")],
      })
    );
  }),
  rest.patch("/medium/:id/thumbnail/pick/:i", (req, res, ctx) => {
    return res(
      ctx.json({
        contents: [
          {
            type: "text",
            data: "New thumnbail",
          },
        ],
        level: "info",
      })
    );
  }),
  rest.post("/medium", (req, res, ctx) => {
    return res(
      ctx.json({
        contents: [
          {
            type: "link",
            data: { location: "/medium/55", text: "Upload success" },
          },
        ],
        level: "info",
      })
    );
  }),
  rest.patch("/medium/:id/file", (req, res, ctx) => {
    return res(ctx.json(defaultMedium(Number(req.params.id))));
  }),
  rest.patch("/medium/:id/metadata", (req, res, ctx) => {
    const patchedMedium = {
      ...defaultMedium(Number(req.params.id)),
      ...req.params,
    };
    return res(ctx.json(patchedMedium));
  }),
  rest.get("/media", mediaHandler),
  rest.get("/search", mediaHandler),
  rest.get("/rules/summary", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          definition: {
            if: {
              data: "s",
              type: "hasRating",
            },
            then: [
              {
                data: ["A"],
                type: "hasAnyTagsLike",
              },
            ],
          },
          adherence: 0.5,
        },
      ])
    );
  }),
  rest.delete("/rules/:whatever", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.patch("/sfw", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/stats", (req, res, ctx) => {
    return res(
      ctx.json({
        tagHistogram: {
          0: 2,
          5: 200,
        },
        absentTagHistogram: {
          0: 5,
          1: 2,
        },
        byRating: {
          e: 41,
          q: 178,
          s: 55,
          u: 4,
        },
      })
    );
  }),
  rest.get("/tag/:tag", (req, res, ctx) => {
    const { tag } = req.params;
    return res(
      ctx.json({
        aliases: [],
        count: 429,
        implied_by_this: [],
        implying_this: [],
        rating: "e",
        tag,
      })
    );
  }),
  rest.patch("/tag/:anything", (req, res, ctx) => {
    const { rating, tag } = req.params;
    return res(
      ctx.json({
        aliases: [],
        count: 429,
        implied_by_this: [],
        implying_this: [],
        rating: rating,
        tag: tag || "A",
      })
    );
  }),
  rest.get("/tags", (req, res, ctx) => {
    return res(
      ctx.json({
        tags: [
          {
            impliedBySomething: true,
            mediaCount: 32,
            rating: "e",
            tag: "A",
          },
          {
            impliedBySomething: false,
            mediaCount: 1,
            rating: "s",
            tag: "B",
          },
          {
            impliedBySomething: false,
            mediaCount: 7,
            rating: "q",
            tag: "C",
          },
          {
            impliedBySomething: true,
            mediaCount: 3,
            rating: "s",
            tag: "D",
          },
          {
            impliedBySomething: false,
            mediaCount: 7,
            rating: "s",
            tag: "E",
          },
        ],
      })
    );
  }),
  rest.get("/tags/implications", (req, res, ctx) => {
    return res(
      ctx.json({
        links: {
          A: ["B"],
          B: ["C"],
        },
        nodes: {
          A: {},
          B: {},
          C: {},
        },
      })
    );
  }),
  rest.get("/tags/similarity", (req, res, ctx) => {
    return res(
      ctx.json({
        links: {
          A: {
            B: {
              relevance: 17,
              similarity: 0.573,
            },
            C: {
              relevance: 8,
              similarity: 0.01,
            },
          },
          B: {
            C: {
              relevance: 163,
              similarity: 0.021,
            },
          },
        },
        nodes: {
          A: {
            size: 11,
          },
          B: {
            size: 5,
          },
          C: {
            size: 16,
          },
        },
      })
    );
  }),
  rest.delete("/tag/:implying/implications/:implied", async (req, res, ctx) => {
    return res(ctx.json(""));
  }),
  rest.patch("/tag/:implying/implications/:implied", async (req, res, ctx) => {
    return res(ctx.json(""));
  }),
  rest.post("/tag/:t/aliases/:alias", async (req, res, ctx) => {
    return res(ctx.json(""));
  }),
  rest.delete("/tag/:t/aliases/:alias", async (req, res, ctx) => {
    return res(ctx.json(""));
  }),
  rest.post("/tags/batch", async (req, res, ctx) => {
    return res(
      ctx.json({
        contents: [
          {
            type: "text",
            data: "Yep, that went well!",
          },
        ],
        level: "info",
      })
    );
  }),
  rest.patch("/thumbnail/:id", async (req, res, ctx) => {
    return res(ctx.json(""));
  }),
];
