import userEvent, { FilesArgument } from "@testing-library/user-event";
import given from "mocks/given";

const whenUploading = async (app: any, filesArgument: FilesArgument) => {
  userEvent.upload(
    await app.findByLabelText("rule-upload-input"),
    filesArgument
  );
};

const whenUploadingValidJson = async (app: any) => {
  return whenUploading(
    app,
    // This is valid JSON, but not a valid rules file
    new File(["{}"], "foo.json", {
      type: "application/json",
    })
  );
};

const thenThereIsAMessage = async (
  app: any,
  expectedErrorText: string | RegExp
) => {
  expect(await app.findByText(expectedErrorText)).toBeVisible();
};

test("renders", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });

  await given.navigationTo.rulesPage();
});

// TODO Test rule delete buttons, upload button

test("only accepts json files", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const app = await given.navigationTo.rulesPage();

  await whenUploading(
    app,
    new File(["<xml>notvalidjson</xml>"], "foo.xml", {
      type: "application/xml",
    })
  );

  await thenThereIsAMessage(app, /This is not valid/i);
});

test("shows error when API cannot validate file", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const app = await given.navigationTo.rulesPage();

  given.rules.dontValidate();
  await whenUploadingValidJson(app);
  await thenThereIsAMessage(app, /This is not valid/i);

  given.rules.validationErrorsOut();
  await whenUploadingValidJson(app);
  await thenThereIsAMessage(app, /This is not valid/i);
});

test("shows number of rules when API can validate file", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  const app = await given.navigationTo.rulesPage();
  given.rules.validate();
  await whenUploadingValidJson(app);
  await thenThereIsAMessage(app, /This is valid and contains 4 rules/i);
});

test("can print complicated rules", async () => {
  given.loggedInAs({ role: "admin", sfwSession: false });
  given.rules.areCurrently(given.rules.complicated);

  await given.navigationTo.rulesPage();
});
