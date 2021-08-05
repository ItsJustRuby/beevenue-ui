import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("detail page renders itself", async () => {
  given.loggedInAs({ role: "admin", sfwSession: true });
  given.indexPageListsMedium(1234);
  given.medium({ id: 1234 });

  const { findByRole } = given.app();

  fireEvent.click(await findByRole("link", { name: "medium-1234" }));

  const mediumImg = await findByRole("img", { name: "Medium" });
  expect(mediumImg).toBeVisible();
});

// TODO Go to detail page for medium rated 'q'. Toggle SFW ON. Expect to be somewhere else.
