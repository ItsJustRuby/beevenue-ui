import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("detail page switches away when toggled to SFW", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole, findByTestId } = await given.navigationTo.detailPage({
    id: 2222,
    rating: "q",
  });

  userEvent.click(await findByRole("checkbox", { name: /sfw-switch/i }));

  const masonry = await findByTestId("beevenue-masonry");
  expect(masonry).toBeVisible();
});

test("detail page has a delete button that opens a modal", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole, findByText } = await given.navigationTo.detailPage({
    id: 3333,
    rating: "s",
  });

  const mediumDeleteButton = await findByRole("button", {
    name: /medium-delete-button/i,
  });
  expect(mediumDeleteButton).toBeVisible();

  userEvent.click(mediumDeleteButton);

  const modalDeleteButton = await findByRole("button", {
    name: /modal-delete-button/i,
  });
  expect(modalDeleteButton).toBeVisible();

  userEvent.click(modalDeleteButton);

  const infoNotification = await findByText(/Successfully deleted medium/i);
  expect(infoNotification).toBeVisible();

  // While we're here, test that notification can be dismissed all at once
  const dismissAllLink = await findByRole("link", {
    name: /notifications-dismiss-all-link/i,
  });
  userEvent.click(dismissAllLink);
  expect(dismissAllLink).not.toBeVisible();
});

test("detail page has a regenerate thumbnail button", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findAllByRole, findByRole, findByText } =
    await given.navigationTo.detailPage({
      id: 4444,
      rating: "s",
    });

  const regenButton = await findByRole("button", {
    name: /medium-regenerate-thumbnail-button/i,
  });
  expect(regenButton).toBeVisible();

  userEvent.click(regenButton);

  const infoNotification = await findByText(
    /Successfully created new thumbnails/i
  );
  expect(infoNotification).toBeVisible();

  // While we're here, test that notification can be dismissed
  const dismissButton = (
    await findAllByRole("button", {
      name: /notifications-dismiss-button-/i,
    })
  )[0];
  userEvent.click(dismissButton);
  expect(dismissButton).not.toBeVisible();
});
