import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("detail page has a pick alternate thumbnail widget", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole, findByText } = await given.navigationTo.detailPage({
    id: 5555,
    rating: "s",
    mimeType: "video/webm",
  });

  const goButton = await findByRole("button", {
    name: "medium-alternate-thumbnail-go-button",
  });
  userEvent.click(goButton);

  const successMessage = await findByText(/New thumbnails are being generated/);
  expect(successMessage).toBeVisible();
});
