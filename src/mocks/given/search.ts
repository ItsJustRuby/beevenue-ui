import { server } from "mocks/server";
import { rest } from "msw";

const returnsNothingFor = (query: string) => {
  server.use(
    rest.get("/search", (req, res, ctx) => {
      return res(
        ctx.json({
          items: [],
          pageCount: 0,
          pageNumber: 1,
          pageSize: 10,
        })
      );
    })
  );
};

export default { returnsNothingFor };
