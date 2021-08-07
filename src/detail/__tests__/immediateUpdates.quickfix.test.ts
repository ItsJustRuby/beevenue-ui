import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("quick fix buttons disappear immediately", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole } = await given.navigationTo.detailPage({
    id: 9999,
    rating: "s",
  });

  const quickFixButton = await findByRole("button", {
    name: "medium-quick-fix-0-0",
  });
  expect(quickFixButton).toBeVisible();
  userEvent.click(quickFixButton);

  await waitFor(() => expect(quickFixButton).not.toBeVisible());
});
