import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test("detail page has a pick alternate thumbnail widget", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole } = await given.navigationTo.detailPage({
    id: 5555,
    rating: "s",
    mimeType: "video/webm",
  });

  const pickCountSelect = await findByRole("combobox", {
    name: /medium\-alternate\-thumbnail\-pick\-count\-select/i,
  });
  expect(pickCountSelect).toBeVisible();

  userEvent.selectOptions(pickCountSelect, "10");
  expect(pickCountSelect).toHaveValue("10");

  const goButton = await findByRole("button", {
    name: "medium-alternate-thumbnail-go-button",
  });
  userEvent.click(goButton);

  const firstThumb = await findByRole("img", {
    name: "medium-alternate-thumbnail-pick-0",
  });
  expect(firstThumb).toBeVisible();

  userEvent.click(firstThumb);

  await waitFor(async () =>
    expect(
      await findByRole("button", {
        name: "medium-alternate-thumbnail-go-button",
      })
    ).toBeVisible()
  );
});
