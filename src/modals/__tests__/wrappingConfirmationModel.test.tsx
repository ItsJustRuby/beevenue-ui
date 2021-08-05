import { fireEvent, render } from "@testing-library/react";
import {
  BaseProps,
  WrappingConfirmationModal,
} from "../wrappingConfirmationModal";

const SimpleWrappedComponent = (simpleProps: BaseProps) => {
  return <button onClick={simpleProps.onClick}>Open Modal</button>;
};

test("renders confirmation text", async () => {
  const { findByRole, findByText } = render(
    <WrappingConfirmationModal
      WrappedComponent={SimpleWrappedComponent}
      onConfirm={() => {}}
    />
  );

  fireEvent.click(await findByRole("button", { name: /open/i }));

  const confirmationTextElement = await findByText(/Are you sure/i);
  expect(confirmationTextElement).toBeVisible();
});

test("calls onConfirm when pressing confirm button", async () => {
  let confirmed = false;

  const { findByRole } = render(
    <WrappingConfirmationModal
      WrappedComponent={SimpleWrappedComponent}
      onConfirm={() => {
        confirmed = true;
      }}
    />
  );

  fireEvent.click(await findByRole("button", { name: /open/i }));
  fireEvent.click(await findByRole("button", { name: /delete/i }));

  expect(confirmed).toBeTruthy();
  await expect(findByRole("button", { name: /delete/i })).rejects.toBeTruthy();
});

test("does nothing when pressing cancel button", async () => {
  let confirmed = false;

  const { findByRole } = render(
    <WrappingConfirmationModal
      WrappedComponent={SimpleWrappedComponent}
      onConfirm={() => {
        confirmed = true;
      }}
    />
  );

  fireEvent.click(await findByRole("button", { name: /open/i }));
  fireEvent.click(await findByRole("button", { name: /cancel/i }));

  expect(confirmed).toBeFalsy();
  await expect(findByRole("button", { name: /delete/i })).rejects.toBeTruthy();
});

test("does nothing when closing via X button", async () => {
  let confirmed = false;

  const { findByRole } = render(
    <WrappingConfirmationModal
      WrappedComponent={SimpleWrappedComponent}
      onConfirm={() => {
        confirmed = true;
      }}
    />
  );

  fireEvent.click(await findByRole("button", { name: /open/i }));
  fireEvent.click(await findByRole("button", { name: /close/i }));

  expect(confirmed).toBeFalsy();
  await expect(findByRole("button", { name: /delete/i })).rejects.toBeTruthy();
});

test("does nothing when closing via clicking the background", async () => {
  let confirmed = false;

  const { findByRole, findByTestId } = render(
    <WrappingConfirmationModal
      WrappedComponent={SimpleWrappedComponent}
      onConfirm={() => {
        confirmed = true;
      }}
    />
  );

  fireEvent.click(await findByRole("button", { name: /open/i }));
  fireEvent.click(await findByTestId("confirmation-modal-background"));

  expect(confirmed).toBeFalsy();
  await expect(findByRole("button", { name: /delete/i })).rejects.toBeTruthy();
});
