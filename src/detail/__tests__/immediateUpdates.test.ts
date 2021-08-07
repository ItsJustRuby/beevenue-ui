import userEvent from "@testing-library/user-event";
import given from "mocks/given";

const whenChangingARating = async (id: number) => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findByRole } = await given.navigationTo.detailPage({
    id,
    rating: "q",
  });

  const setRatingSRadio = await findByRole("radio", {
    name: "medium-set-rating-s",
  });
  expect(setRatingSRadio).toBeVisible();

  userEvent.click(setRatingSRadio);
  return setRatingSRadio;
};

test("no changes to UI happen on changing the rating", async () => {
  await whenChangingARating(5555);
  await new Promise((res) => setTimeout(res, 2000));
});
