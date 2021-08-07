import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("has an editable title field", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByLabelText, findByRole } = await given.navigationTo.tagShowPage(
    "C"
  );

  const titleElement = await findByLabelText("tag-title");
  expect(titleElement).toBeVisible();

  userEvent.click(titleElement);

  const titleField = await findByRole("textbox", { name: /tag-title-input/i });
  await waitFor(() => expect(titleField).toBeVisible());

  userEvent.clear(titleField);
  userEvent.type(titleField, "ReplacementA{enter}");

  await waitFor(async () =>
    expect(await findByLabelText("tag-title")).toBeVisible()
  );
});
