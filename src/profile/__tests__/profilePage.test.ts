import given from "mocks/given";

test("renders", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  await given.navigationTo.profilePage();
});
