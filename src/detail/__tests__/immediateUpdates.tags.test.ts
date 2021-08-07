import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("no changes to UI happen on entering (absent) tags", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole } = await given.navigationTo.detailPage({
    id: 8888,
    rating: "s",
  });

  const tagsInput = await findByRole("textbox", {
    name: "beevenue-medium-tags",
  });
  expect(tagsInput).toBeVisible();
  userEvent.type(tagsInput, "someTag{enter}");

  await new Promise((res) => setTimeout(res, 2000));

  const absentTagsInput = await findByRole("textbox", {
    name: "beevenue-medium-absent-tags",
  });
  expect(absentTagsInput).toBeVisible();
  userEvent.type(absentTagsInput, "someAbsentTag{enter}");

  await new Promise((res) => setTimeout(res, 2000));
});
