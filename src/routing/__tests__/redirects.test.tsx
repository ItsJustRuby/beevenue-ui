import given from "mocks/given";

test("redirects to / on no route match", async () => {
  given.loggedInAs({ role: "admin", sfwSession: true });
  const { history } = await given.landingViaUrl("/nonsense");
  expect(history.location.pathname).toEqual("/");
});

test("redirects search from query string format to /-separated format", async () => {
  given.loggedInAs({ role: "admin", sfwSession: true });
  const { history } = await given.landingViaUrl("/search?q=foo%20bar");
  expect(history.location.pathname).toEqual("/search/foo/bar");
});
