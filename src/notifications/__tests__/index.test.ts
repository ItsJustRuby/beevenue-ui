import { makeNotificationFromTemplate } from "../index";

test.each([
  {
    contents: [
      {
        data: "Your SFW setting does not allow you to see this.",
        type: "text",
      },
    ],
    level: "info",
  },
  {
    contents: [
      {
        data: "Example warning.",
        type: "text",
      },
    ],
    level: "warning",
  },
  {
    contents: [
      {
        data: 'Cannot handle file "foo.jpg" since it already exists:',
        type: "text",
      },
      {
        data: {
          location: "/show/1234",
          text: "Medium 1234",
        },
        type: "link",
      },
    ],
    level: "error",
  },
])("can transform example notifications into element", (notification: any) => {
  expect(makeNotificationFromTemplate(notification)).toBeTruthy();
});
