import { rest } from "msw";

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
  rest.get("/login", (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem("is-authenticated", "true");
    return res(ctx.status(500));
  }),
  rest.get("/media", mediaHandler),
  rest.get("/search", mediaHandler),
  rest.get("/rules", (req, res, ctx) => {
    return res(
      ctx.json([
        {
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
      ])
    );
  }),
  rest.patch("/sfw", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/stats", (req, res, ctx) => {
    return res(
      ctx.json({
        e: 41,
        q: 178,
        s: 55,
        u: 4,
      })
    );
  }),
  rest.get("/tag/A", (req, res, ctx) => {
    return res(
      ctx.json({
        aliases: [],
        count: 429,
        implied_by_this: [],
        implying_this: [],
        rating: "e",
        tag: "A",
      })
    );
  }),
  rest.patch("/tag/A", (req, res, ctx) => {
    const { rating } = req.params;
    return res(
      ctx.json({
        aliases: [],
        count: 429,
        implied_by_this: [],
        implying_this: [],
        rating: rating,
        tag: "A",
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
];
