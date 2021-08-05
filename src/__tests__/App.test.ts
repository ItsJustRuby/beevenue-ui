import given from "mocks/given";

test("shows spinner when it cannot get login status", async () => {
  const { findByTestId } = given.app();

  const spinner = await findByTestId("full-page-spinner");
  expect(spinner).toBeVisible();
});
