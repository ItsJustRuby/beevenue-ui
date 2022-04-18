import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import given from "mocks/given";

test.each([false, true])(
  "speedTagger can add tags",
  async (doToggleAbsent: boolean) => {
    given.loggedInAs({ role: "admin", sfwSession: true });

    const { findByRole, findByLabelText, findByText } = given.app();
    const speedTaggerInput = await findByRole("textbox", {
      name: /speed-tagger-input/i,
    });
    expect(speedTaggerInput).toBeVisible();

    await userEvent.type(speedTaggerInput, "D");

    const isActiveToggle = await findByRole("checkbox", {
      name: /speed-tagger-active-switch/i,
    });
    expect(isActiveToggle).toBeVisible();
    if (!isActiveToggle.hasAttribute("checked")) {
      await userEvent.click(isActiveToggle);
    }

    await waitFor(() => expect(isActiveToggle).toHaveAttribute("checked"));

    if (doToggleAbsent) {
      const isAbsentToggle = await findByRole("checkbox", {
        name: /speed-tagger-absent-switch/i,
      });
      expect(isAbsentToggle).toBeVisible();
      await userEvent.click(isAbsentToggle);
    }

    const medium = await findByLabelText(/speed-tagger-medium-1/i);
    expect(medium).toBeVisible();
    await userEvent.click(medium);
    await waitFor(() =>
      expect(medium).toHaveClass("beevenue-speed-tagger-medium-selected")
    );

    const speedTaggerTitle = await findByText(/Speed tagger \(1 selected\)/i);
    expect(speedTaggerTitle).toBeVisible();

    const goLink = await findByLabelText(/speed-tagger-go-link/i);
    await userEvent.click(goLink);

    const infoNotification = await findByText(/That went well/i);
    expect(infoNotification).toBeVisible();
  }
);
