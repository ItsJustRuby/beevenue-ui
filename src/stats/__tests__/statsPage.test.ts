import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("renders", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByRole } = given.app();

  fireEvent.click(await findByRole("link", { name: /^Statistics$/i }));

  const statsTable = await findByRole("table");
  expect(statsTable).toBeVisible();

  // Example of the actual number of media shown per rating
  expect(statsTable).toHaveTextContent(/178/i);

  const expectedPercentage = ((100 * 178) / (178 + 41 + 55 + 4)).toFixed(2);
  expect(statsTable).toHaveTextContent(expectedPercentage);
});
