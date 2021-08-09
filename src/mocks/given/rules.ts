import { server } from "mocks/server";
import { rest } from "msw";

const complicated = [
  {
    definition: {
      if: [
        {
          data: "e",
          type: "hasRating",
        },
        {
          data: ["a:.*"],
          type: "hasAnyTagsLike",
        },
      ],
      then: [
        {
          data: ["x:.*", "y:.*"],
          type: "hasAnyTagsLike",
        },
        {
          data: ["z:.*"],
          type: "hasAnyTagsLike",
        },
      ],
    },
    adherence: 0.1,
  },
  {
    definition: {
      if: {
        data: "q",
        type: "hasRating",
      },
      then: {
        data: ["A", "B", "C"],
        type: "hasAllAbsentOrPresent",
      },
    },
    adherence: 0.2,
  },
  {
    definition: {
      if: {
        data: ["x:.*"],
        type: "hasAnyTagsLike",
      },
      then: [
        {
          data: ["A", "B"],
          type: "hasAnyTagsIn",
        },
        {
          data: "q",
          type: "hasRating",
        },
      ],
    },
    adherence: 0.3,
  },
  {
    definition: {
      if: {
        type: "all",
      },
      then: [
        {
          data: ["x:.*"],
          type: "hasAnyTagsLike",
        },
        {
          data: ["C", "D"],
          type: "hasAnyTagsIn",
        },
        {
          type: "hasRating",
        },
      ],
    },
    adherence: 0.4,
  },
  {
    definition: {
      if: {
        data: ["E", "F"],
        type: "hasAnyTagsIn",
      },
      then: {
        type: "fail",
      },
    },
    adherence: 0.5,
  },
];

const areCurrently = (r: any) => {
  server.use(
    rest.get("/rules/summary", (req, res, ctx) => {
      return res(ctx.json(r));
    })
  );
};

const dontValidate = () => {
  server.use(
    rest.post("/rules/validation", (req, res, ctx) => {
      return res(
        ctx.json({
          ok: false,
          data: "Nope, this is invalid",
        })
      );
    })
  );
};

const validate = () => {
  server.use(
    rest.post("/rules/validation", (req, res, ctx) => {
      return res(
        ctx.json({
          ok: true,
          data: 4,
        })
      );
    })
  );
};

const validationErrorsOut = () => {
  server.use(
    rest.post("/rules/validation", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
};

export default {
  complicated,
  areCurrently,
  validate,
  dontValidate,
  validationErrorsOut,
};
