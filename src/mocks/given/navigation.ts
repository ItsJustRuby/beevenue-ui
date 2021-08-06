import { fireEvent } from "@testing-library/dom";
import given, { AllMediumOptions } from ".";

const tagsPage = async () => {
  const app = given.app();
  const { findByRole } = app;

  fireEvent.click(await findByRole("link", { name: /^Tags$/i }));

  const table = await findByRole("table");
  expect(table).toBeVisible();

  return app;
};

const detailPage = async (options: AllMediumOptions) => {
  given.indexPageListsMedium(options.id);
  given.medium(options);

  const app = given.app();
  const { findByRole } = app;

  console.log("Looking for", `medium-${options.id}`);
  fireEvent.click(await findByRole("link", { name: `medium-${options.id}` }));

  const mediumImg = await findByRole("img", { name: "Medium" });
  expect(mediumImg).toBeVisible();
  return app;
};

const rulesPage = async () => {
  const app = given.app();
  const { findByRole } = app;

  fireEvent.click(await findByRole("link", { name: /^Configure rules$/i }));

  const currentRulesList = await findByRole("heading", {
    name: /^Rules$/i,
  });
  expect(currentRulesList).toBeVisible();

  return app;
};

export default { detailPage, rulesPage, tagsPage };
