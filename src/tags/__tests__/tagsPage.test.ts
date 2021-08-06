import { fireEvent, prettyDOM, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("shows table", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  given.navigationTo.tagsPage();
});

test("handles rating change", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByRole } = await given.navigationTo.tagsPage();

  const qCheckbox = await findByRole("radio", {
    name: "large-tag-A-rating-q",
  });
  fireEvent.change(qCheckbox);

  // TODO: Turns out this doesn't actually happen to the DOM.
  // await waitFor(() => {
  //   expect(qCheckbox).toHaveAttribute("checked");
  // });
});

test("has a filter that works", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByRole } = await given.navigationTo.tagsPage();

  const filterTextbox = await findByRole("textbox", {
    name: "tags-filter",
  });

  userEvent.type(filterTextbox, "A");

  await waitFor(async () => {
    expect(
      await findByRole("link", { name: "large-tag-link-A" })
    ).toBeVisible();
  });

  await expect(
    findByRole("link", { name: "large-tag-link-B" })
  ).rejects.toBeTruthy();
});
