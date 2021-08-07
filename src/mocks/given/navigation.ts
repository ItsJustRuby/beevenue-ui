import { fireEvent } from "@testing-library/dom";
import given, { AllMediumOptions } from ".";

const tagShowPage = async (tag: string) => {
  const app = await tagsPage();
  const { findByRole } = app;

  fireEvent.click(await findByRole("link", { name: `large-tag-link-${tag}` }));

  const newAliasTextbox = await findByRole("textbox", {
    name: /add-alias-input/i,
  });
  expect(newAliasTextbox).toBeVisible();

  return app;
};

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
  const { findByRole, findByLabelText } = app;

  fireEvent.click(await findByRole("link", { name: `medium-${options.id}` }));

  const mediumContainer = await findByLabelText("medium");
  expect(mediumContainer).toBeVisible();
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

export default { detailPage, rulesPage, tagShowPage, tagsPage };
