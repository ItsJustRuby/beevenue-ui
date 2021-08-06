import { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

const whenSearchingFor = async (app: RenderResult, searchText: string) => {
  userEvent.type(
    await app.findByRole("textbox", { name: "search-input" }),
    `${searchText}{enter}`
  );
};

test("succeeds if there are no results", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  given.search.returnsNothingFor("A");

  const app = given.app();
  await whenSearchingFor(app, "A");

  expect(
    await app.findByRole("heading", { name: /no results found\./i })
  ).toBeVisible();
});
