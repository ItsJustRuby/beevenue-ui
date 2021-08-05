import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("shows notification for 0 available violations", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  given.noRuleViolations();

  const { findByRole, findByText } = given.app();

  fireEvent.click(
    await findByRole("link", { name: /^Random rule violation$/i })
  );

  const infoNotification = await findByText(/No rule violations found/i);
  expect(infoNotification).toBeVisible();
});

// TODO Test using given.medium(123) and given.ruleViolationForMedium(123)
