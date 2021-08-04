import { paginationParamsFromQuery } from "wall/pagination";

test("sets non-integer pagination parameters to check for sensible default values", () => {
  expect(
    paginationParamsFromQuery({
      pageNumber: "foo",
      pageSize: "baz",
    })
  ).toEqual({
    pageNumber: 1,
    pageSize: 10,
  });
});

test.each([
  { pageNumber: 0, pageSize: 1 },
  { pageNumber: -50, pageSize: 5 },
  { pageNumber: 0, pageSize: 0 },
])(
  "uses too small pagination parameters (%o) to check for sensible default values",
  (q) => {
    expect(paginationParamsFromQuery(q)).toEqual({
      pageNumber: 1,
      pageSize: 10,
    });
  }
);

test.each([
  { pageNumber: 1, pageSize: 500 },
  { pageNumber: -50, pageSize: 101 },
])(
  "uses too large pagination parameters (%o) to check for sensible default values",
  (q) => {
    expect(paginationParamsFromQuery(q)).toEqual({
      pageNumber: 1,
      pageSize: 100,
    });
  }
);
