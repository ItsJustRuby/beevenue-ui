import { fireEvent, render } from "@testing-library/react";
import { IntrusiveConfirmationModal } from "../intrusiveConfirmationModal";

const nop = (x: any) => {};

test("renders confirmation text if visible", async () => {
  const { findByText } = render(
    <IntrusiveConfirmationModal
      isVisible={true}
      setIsVisible={nop}
      onConfirm={() => {}}
    />
  );

  const confirmationTextElement = await findByText(/Are you sure/i);
  expect(confirmationTextElement).toBeVisible();
});

test("renders nothing if invisible", async () => {
  const { findByText } = render(
    <IntrusiveConfirmationModal
      isVisible={false}
      setIsVisible={nop}
      onConfirm={() => {}}
    />
  );

  await expect(findByText(/Are you sure/i)).rejects.toBeTruthy();
});

test("calls onConfirm and closes itself on confirming", async () => {
  let confirmed = false;
  let isVisible = true;
  const setIsVisible = (b: boolean) => {
    isVisible = b;
  };

  const { findByRole } = render(
    <IntrusiveConfirmationModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      onConfirm={() => {
        confirmed = true;
      }}
    />
  );

  fireEvent.click(await findByRole("button", { name: /delete/i }));

  expect(confirmed).toBeTruthy();
  expect(isVisible).toBeFalsy();
});
