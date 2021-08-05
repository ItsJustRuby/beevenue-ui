import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("shows logout panel and album when logged in", async () => {
  given.loggedInAs({ role: "admin", sfwSession: true });

  const { findByRole, findByTestId } = given.app();

  const logoutButton = await findByRole("button", { name: /logout/i });
  expect(logoutButton).toBeVisible();

  const masonry = await findByTestId("beevenue-masonry");
  expect(masonry).toBeVisible();
});

test("shows index page when clicking the Home button", async () => {
  given.loggedInAs({ role: "admin", sfwSession: true });

  const { findByRole, findByTestId } = given.app();

  // navigate away first so we have somwhere to switch back from
  fireEvent.click(await findByRole("link", { name: /^Configure rules$/i }));

  await expect(findByTestId("beevenue-masonry")).rejects.toBeTruthy();

  fireEvent.click(await findByRole("link", { name: /^Home$/i }));

  const masonry = await findByTestId("beevenue-masonry");
  expect(masonry).toBeVisible();
});

test("Does not show speed tagger panel when logged in as user", async () => {
  given.loggedInAs({ role: "user", sfwSession: true });

  const { findByRole } = given.app();

  await expect(
    findByRole("textbox", { name: /speedtagger-input/i })
  ).rejects.toBeTruthy();
});

test("shows login panel when not logged in", async () => {
  given.loggedOut();

  const { findByRole } = given.app();

  const usernameField = await findByRole("textbox", { name: /username/i });
  expect(usernameField).toBeVisible();

  const loginButton = await findByRole("button", { name: /login/i });
  expect(loginButton).toBeVisible();
});
