import { server } from "mocks/server";
import { rest } from "msw";

const forMedium = (id: number) => {
  server.use(
    rest.get("/tags/missing/any", (req, res, ctx) => {
      const json: any = {};
      json["id"] = id;

      return res(ctx.json(json));
    })
  );
};

const none = () => {
  server.use(
    rest.get("/tags/missing/any", (req, res, ctx) => {
      return res(ctx.json({}));
    })
  );
};

export default { forMedium, none };
