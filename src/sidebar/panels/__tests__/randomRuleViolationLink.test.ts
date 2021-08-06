import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

const whenClickingRandomRuleViolation = async () => {
  const app = given.app();
  const { findByRole } = app;

  fireEvent.click(
    await findByRole("link", { name: /^Random rule violation$/i })
  );

  return app;
};

test("shows notification for 0 available violations", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  given.ruleViolations.none();

  const { findByText } = await whenClickingRandomRuleViolation();

  const infoNotification = await findByText(/No rule violations found/i);
  expect(infoNotification).toBeVisible();
});

test("redirects to violation if there is one", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  given.medium({ id: 123 });
  given.ruleViolations.forMedium(123);

  const { findByRole } = await whenClickingRandomRuleViolation();

  const mediumImg = await findByRole("img", { name: "Medium" });
  expect(mediumImg).toBeVisible();
});
