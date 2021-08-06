import given from "mocks/given";

test("detail page renders itself", async () => {
  given.loggedInAs({ role: "admin", sfwSession: true });
  await given.navigationTo.detailPage({ id: 1234 });
});
