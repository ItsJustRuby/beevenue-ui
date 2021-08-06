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
