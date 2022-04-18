import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("can delete rules", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  given.rules.areCurrently(given.rules.complicated);

  const { queryAllByRole, findByRole } = await given.navigationTo.rulesPage();

  const deleteLink = await findByRole("link", { name: "rules-delete-link-4" });
  expect(deleteLink).toBeVisible();

  await userEvent.click(deleteLink);

  const modalDeleteButton = await findByRole("button", {
    name: /modal-delete-button/i,
  });
  expect(modalDeleteButton).toBeVisible();
  await userEvent.click(modalDeleteButton);

  await new Promise((res) => setTimeout(res, 1000));

  expect(
    queryAllByRole("button", {
      name: /modal-delete-button/i,
    })
  ).toHaveLength(0);
});
