import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("shows details", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByRole } = await given.navigationTo.tagsPage();

  fireEvent.click(await findByRole("link", { name: "large-tag-link-A" }));

  const newAliasTextbox = await findByRole("textbox", {
    name: /new-alias/i,
  });
  expect(newAliasTextbox).toBeVisible();
});
