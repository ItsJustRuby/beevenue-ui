import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { server } from "mocks/server";
import { mocked } from "jest-mock";

import Config from "./config";

jest.mock("./config");
const mockBackendUrl = mocked(Config, false);
mockBackendUrl.backendUrl = "/";

jest.setTimeout(20_000);

global.crypto = {
  getRandomValues: (arr: any) => require("crypto").randomBytes(arr.length),
} as any;

// https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn();

configure({
  // Some pages are slow AF (Looking at you, TagsPage).
  // Set this as low as possible.
  asyncUtilTimeout: 5000,
  throwSuggestions: true,
});

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "error",
  });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());
