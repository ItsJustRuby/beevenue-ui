import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("shows diagrams", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  const { findByRole, findByTestId } = given.app();

  fireEvent.click(await findByRole("link", { name: /^Tag Statistics$/i }));

  // Oh boy, D3 is slow in testing
  const similaritySvg = await findByTestId("similarity-rendered", undefined, {
    timeout: 30_000,
  });
  expect(similaritySvg).toBeVisible();

  // Oh boy, D3 is slow in testing
  const implicationsSvg = await findByTestId(
    "implications-rendered",
    undefined,
    { timeout: 30_000 }
  );
  expect(implicationsSvg).toBeVisible();
});
