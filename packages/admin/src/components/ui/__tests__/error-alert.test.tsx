import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorAlert } from "../error-alert";

describe("ErrorAlert", () => {
  it("renders error message", () => {
    render(<ErrorAlert>Something went wrong</ErrorAlert>);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<ErrorAlert>Error</ErrorAlert>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders as <p> without onRetry", () => {
    render(<ErrorAlert data-testid="my-error">Error</ErrorAlert>);

    const el = screen.getByTestId("my-error");
    expect(el.tagName).toBe("P");
  });

  it("renders as <div> with onRetry", () => {
    render(
      <ErrorAlert data-testid="my-error" onRetry={() => {}}>
        Error
      </ErrorAlert>,
    );

    const el = screen.getByTestId("my-error");
    expect(el.tagName).toBe("DIV");
  });

  it("renders Retry button when onRetry is provided", () => {
    render(
      <ErrorAlert data-testid="my-error" onRetry={() => {}}>
        Error
      </ErrorAlert>,
    );

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("does not render Retry button without onRetry", () => {
    render(<ErrorAlert>Error</ErrorAlert>);

    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
  });

  it("calls onRetry when Retry button is clicked", async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorAlert onRetry={handleRetry}>Error</ErrorAlert>);

    await user.click(screen.getByText("Retry"));

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("applies data-testid to retry button", () => {
    render(
      <ErrorAlert data-testid="my-error" onRetry={() => {}}>
        Error
      </ErrorAlert>,
    );

    expect(screen.getByTestId("my-error-retry")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <ErrorAlert data-testid="my-error" className="custom-class">
        Error
      </ErrorAlert>,
    );

    expect(screen.getByTestId("my-error")).toHaveClass("custom-class");
  });

  describe('variant="card"', () => {
    it("renders card container with border and shadow", () => {
      render(
        <ErrorAlert data-testid="card-error" variant="card">
          Something failed
        </ErrorAlert>,
      );

      const el = screen.getByTestId("card-error");
      expect(el.tagName).toBe("DIV");
      expect(el.className).toContain("rounded-lg");
      expect(el.className).toContain("border");
      expect(el.className).toContain("shadow-xs");
      expect(el.className).toContain("py-10 px-8");
    });

    it("renders AlertCircle icon in error circle", () => {
      render(
        <ErrorAlert data-testid="card-error" variant="card">
          Error
        </ErrorAlert>,
      );

      const el = screen.getByTestId("card-error");
      const iconCircle = el.querySelector(".rounded-full");
      expect(iconCircle).toBeInTheDocument();
      expect(iconCircle?.className).toContain("w-16");
      expect(iconCircle?.className).toContain("h-16");
      expect(iconCircle?.className).toContain("bg-[var(--admin-error-50)]");
    });

    it("renders title when provided in card mode", () => {
      render(
        <ErrorAlert variant="card" title="Something went wrong">
          Please try again later.
        </ErrorAlert>,
      );

      const title = screen.getByText("Something went wrong");
      expect(title.className).toContain("font-semibold");
      expect(title.className).toContain("text-[var(--admin-gray-900)]");
    });

    it("renders children as description in card mode", () => {
      render(
        <ErrorAlert variant="card" title="Error">
          Please try again later.
        </ErrorAlert>,
      );

      expect(screen.getByText("Please try again later.")).toBeInTheDocument();
    });

    it("does not render title when not provided in card mode", () => {
      render(
        <ErrorAlert data-testid="card-error" variant="card">
          Error message only
        </ErrorAlert>,
      );

      const el = screen.getByTestId("card-error");
      const semiboldElements = el.querySelectorAll(".font-semibold");
      expect(semiboldElements).toHaveLength(0);
    });

    it("has role=alert in card mode", () => {
      render(<ErrorAlert variant="card">Card error</ErrorAlert>);

      expect(screen.getByRole("alert")).toHaveTextContent("Card error");
    });

    it("renders retry button in card mode", () => {
      render(
        <ErrorAlert variant="card" data-testid="card-error" onRetry={() => {}}>
          Error
        </ErrorAlert>,
      );

      expect(screen.getByTestId("card-error-retry")).toBeInTheDocument();
    });

    it("calls onRetry in card mode", async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();

      render(
        <ErrorAlert variant="card" onRetry={handleRetry}>
          Error
        </ErrorAlert>,
      );

      await user.click(screen.getByText("Retry"));

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it("applies custom className in card mode", () => {
      render(
        <ErrorAlert
          data-testid="card-error"
          variant="card"
          className="my-class"
        >
          Error
        </ErrorAlert>,
      );

      expect(screen.getByTestId("card-error")).toHaveClass("my-class");
    });
  });
});
