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

  it("uses flex-col gap-4 layout on wrapper", () => {
    render(
      <FieldGroup label="Group">
        <span>Field</span>
      </FieldGroup>,
    );

    const wrapper = screen.getByTestId("field-group");
    expect(wrapper).toHaveClass("flex", "flex-col", "gap-4");
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
