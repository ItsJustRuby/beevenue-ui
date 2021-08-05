import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("renders", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByRole } = given.app();

  fireEvent.click(await findByRole("link", { name: /^Configure rules$/i }));

  const currentRulesList = await findByRole("heading", {
    name: /^Rules$/i,
  });
  expect(currentRulesList).toBeVisible();
});

// TODO Test rule delete buttons, download, upload buttons
// TODO Add more rules, so that we fully cover ruleText.tsx
