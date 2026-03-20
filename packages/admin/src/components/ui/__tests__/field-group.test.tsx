import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldGroup } from "../field-group";

describe("FieldGroup", () => {
  it("renders children", () => {
    render(
      <FieldGroup>
        <span>Child content</span>
      </FieldGroup>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(
      <FieldGroup label="Content">
        <span>Field</span>
      </FieldGroup>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render label element when label is omitted", () => {
    const { container } = render(
      <FieldGroup>
        <span>Field</span>
      </FieldGroup>,
    );

    const labelEl = container.querySelector(".uppercase");
    expect(labelEl).not.toBeInTheDocument();
  });

  it("applies label styling", () => {
    render(
      <FieldGroup label="Metadata">
        <span>Field</span>
      </FieldGroup>,
    );

    const label = screen.getByText("Metadata");
    expect(label).toHaveClass("text-[11px]");
    expect(label).toHaveClass("uppercase");
    expect(label).toHaveClass("font-semibold");
  });

  it("applies mt-4 to children wrapper when label is present", () => {
    const { container } = render(
      <FieldGroup label="Group">
        <span>Field</span>
      </FieldGroup>,
    );

    const childrenWrapper = container.querySelector(".flex.flex-col.gap-4");
    expect(childrenWrapper).toHaveClass("mt-4");
  });

  it("does not apply mt-4 when label is absent", () => {
    const { container } = render(
      <FieldGroup>
        <span>Field</span>
      </FieldGroup>,
    );

    const childrenWrapper = container.querySelector(".flex.flex-col.gap-4");
    expect(childrenWrapper).not.toHaveClass("mt-3");
  });

  it("forwards className", () => {
    render(
      <FieldGroup className="my-custom">
        <span>Field</span>
      </FieldGroup>,
    );

    expect(screen.getByTestId("field-group")).toHaveClass("my-custom");
  });

  it("forwards HTML attributes", () => {
    render(
      <FieldGroup data-section="content">
        <span>Field</span>
      </FieldGroup>,
    );

    expect(screen.getByTestId("field-group")).toHaveAttribute(
      "data-section",
      "content",
    );
  });
});
