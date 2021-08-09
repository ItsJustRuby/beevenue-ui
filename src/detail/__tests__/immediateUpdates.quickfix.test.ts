import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("quick fix buttons disappear immediately", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findAllByRole } = await given.navigationTo.detailPage({
    id: 9999,
    rating: "s",
  });

  const quickFixButton = (
    await findAllByRole("button", {
      name: /medium-quick-fix-/i,
    })
  )[0];
  expect(quickFixButton).toBeVisible();
  userEvent.click(quickFixButton);

  await waitFor(() => expect(quickFixButton).not.toBeVisible());
});
