import given from "mocks/given";

test("shows table", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  given.navigationTo.tagsPage();
});

// TODO: Test rating change
// TODO: Test or remove filter
