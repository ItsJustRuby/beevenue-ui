import { fireEvent } from "@testing-library/dom";
import given from ".";

const tagsPage = async () => {
  const app = given.app();
  const { findByRole } = app;

  fireEvent.click(await findByRole("link", { name: /^Tags$/i }));

  const table = await findByRole("table");
  expect(table).toBeVisible();

  return app;
};

export default { tagsPage };
