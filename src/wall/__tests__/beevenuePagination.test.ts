import { fireEvent } from "@testing-library/react";
import given from "mocks/given";

test("clicks on all pages of the pagination", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const { findAllByLabelText } = given.app();

  for (let currentPage = 1; currentPage < 5; ++currentPage) {
    fireEvent.click(
      (await findAllByLabelText(`Go to page ${currentPage + 1}`))[0]
    );

    if (currentPage < 4) {
      const nextNextPageButton = (
        await findAllByLabelText(`Go to page ${currentPage + 2}`)
      )[0];
      expect(nextNextPageButton).toBeVisible();
    } else {
      const firstPageButton = (await findAllByLabelText("Go to page 1"))[0];
      expect(firstPageButton).toBeVisible();
    }
  }
});
