import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("shows details", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  await given.navigationTo.tagShowPage("A");
});

test("can add alias", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole } = await given.navigationTo.tagShowPage("A");

  const aliasField = await findByRole("textbox", {
    name: /add-alias-input/i,
  });
  expect(aliasField).toBeVisible();
  userEvent.type(aliasField, "CoolerA{enter}");
  await waitFor(() => expect(aliasField).toHaveAttribute("disabled"));
  await waitFor(() => expect(aliasField).not.toHaveAttribute("disabled"));
});

test("can add implications going either way", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByLabelText, findByRole } = await given.navigationTo.tagShowPage(
    "A"
  );

  const impliedByThisField = await findByRole("textbox", {
    name: /add-implication-input-ImpliedByThis/i,
  });
  expect(impliedByThisField).toBeVisible();
  userEvent.type(impliedByThisField, "B{enter}");
  await waitFor(() => expect(impliedByThisField).toHaveAttribute("disabled"));
  await waitFor(() =>
    expect(impliedByThisField).not.toHaveAttribute("disabled")
  );

  const deleteImplied = await findByLabelText(/tag-delete-implication-B/i);
  expect(deleteImplied).toBeVisible();
  userEvent.click(deleteImplied);
  await waitFor(() => expect(deleteImplied).not.toBeVisible());

  const implyingThisField = await findByRole("textbox", {
    name: /add-implication-input-ImplyingThis/i,
  });
  expect(implyingThisField).toBeVisible();
  userEvent.type(implyingThisField, "C{enter}");
  await waitFor(() => expect(implyingThisField).toHaveAttribute("disabled"));
  await waitFor(() =>
    expect(implyingThisField).not.toHaveAttribute("disabled")
  );

  const deleteImplying = await findByLabelText(/tag-delete-implication-C/i);
  expect(deleteImplying).toBeVisible();
  userEvent.click(deleteImplying);
  await waitFor(() => expect(deleteImplying).not.toBeVisible());
});
