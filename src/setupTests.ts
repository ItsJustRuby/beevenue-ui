import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { server } from "mocks/server";
import { mocked } from "ts-jest/utils";

import Config from "./config.json";

jest.mock("./config.json");
const mockBackendUrl = mocked(Config, false);
mockBackendUrl.backendUrl = "/";

jest.setTimeout(20_000);

configure({
  // Some pages are slow AF (Looking at you, TagsPage).
  // Set this as low as possible.
  asyncUtilTimeout: 5000,
  throwSuggestions: true,
});

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());
