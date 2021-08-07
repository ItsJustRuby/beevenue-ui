import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("detail page has a replace medium widget", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByLabelText, findByRole } = await given.navigationTo.detailPage({
    id: 7777,
    rating: "s",
  });

  const mediumReplaceInput = await findByLabelText("medium-replace-input");
  expect(mediumReplaceInput).toBeVisible();

  userEvent.upload(
    mediumReplaceInput,
    new File(["Example file contents"], "example.jpg", {
      type: "image/jpeg",
    })
  );

  const goButton = await findByRole("button", {
    name: "medium-replace-go-button",
  });
  expect(goButton).not.toHaveAttribute("disabled");

  userEvent.click(goButton);

  await waitFor(() => expect(goButton).toHaveAttribute("disabled"));
  await waitFor(() => expect(goButton).not.toHaveAttribute("disabled"));
});
