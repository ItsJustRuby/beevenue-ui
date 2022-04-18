import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("upload panel happy flow", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByLabelText, findByRole, findByText } = given.app();

  await userEvent.upload(await findByLabelText("medium-upload-input"), [
    new File(["Example file contents 1"], "example.jpg", {
      type: "image/jpeg",
    }),
    new File(["Example file contents 2"], "example.jpg", {
      type: "image/jpeg",
    }),
  ]);

  expect(await findByText(/2 files selected/i)).toBeVisible();

  const submitButton = await findByRole("button", {
    name: "medium-upload-submit-button",
  });
  await userEvent.click(submitButton);

  const progressBar = await findByRole("progressbar", {
    name: /upload\-panel\-progress\-bar/i,
  });

  // Duration until this element resets is hardcoded in uploadPanel.tsx,
  // so we also hardcode it here.
  await new Promise((resolve) => setTimeout(resolve, 8_000));

  await waitFor(() => expect(progressBar).not.toBeInTheDocument());
});
