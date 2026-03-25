import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SelectField } from "../select-field";

describe("SelectField", () => {
  it("renders radio buttons when options <= 3", () => {
    render(<SelectField label="Color" options={["Red", "Blue"]} />);

    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("renders dropdown when options > 3", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue", "Green", "Yellow"]}
      />,
    );

    // Select atom renders a button trigger (not a native <select>)
    expect(screen.getByRole("button", { name: /select/i })).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<SelectField label="Color" options={["Red", "Blue"]} />);

    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("shows required indicator when required", () => {
    render(<SelectField label="Color" options={["Red", "Blue"]} required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not show required indicator when not required", () => {
    render(<SelectField label="Color" options={["Red", "Blue"]} />);

    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("displays validation error", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue"]}
        error="Selection required"
      />,
    );

    expect(screen.getByText("Selection required")).toBeInTheDocument();
  });

  it("sets aria-invalid when error is present", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue"]}
        error="Selection required"
      />,
    );

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("calls onChange when radio option selected", async () => {
    const user = userEvent.setup();
    let selected = "";
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue"]}
        onChange={(v) => {
          selected = v;
        }}
      />,
    );

    await user.click(screen.getByTestId("select-option-Blue"));

    expect(selected).toBe("Blue");
  });

  it("calls onChange when dropdown value changes", async () => {
    const user = userEvent.setup();
    let selected = "";
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue", "Green", "Yellow"]}
        onChange={(v) => {
          selected = v;
        }}
      />,
    );

    // Open the Select dropdown by clicking the trigger button
    await user.click(screen.getByRole("button", { name: /select/i }));
    // Click the "Green" option
    await user.click(screen.getByText("Green"));

    expect(selected).toBe("Green");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SelectField
        label="Color"
        options={["Red", "Blue"]}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("shows correct option as selected in radio mode", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue", "Green"]}
        value="Blue"
      />,
    );

    const blueRadio = screen.getByTestId(
      "select-option-Blue",
    ) as HTMLInputElement;
    const redRadio = screen.getByTestId(
      "select-option-Red",
    ) as HTMLInputElement;

    expect(blueRadio.checked).toBe(true);
    expect(redRadio.checked).toBe(false);
  });

  it("shows correct option as selected in dropdown mode", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue", "Green", "Yellow"]}
        value="Green"
      />,
    );

    // Select atom shows the selected label in the trigger button
    expect(screen.getByText("Green")).toBeInTheDocument();
  });

  it("renders description when no error is present", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue"]}
        description="Help text"
      />,
    );

    expect(screen.getByText("Help text")).toBeInTheDocument();
  });

  it("hides description when error is present", () => {
    render(
      <SelectField
        label="Color"
        options={["Red", "Blue"]}
        description="Help text"
        error="Selection required"
      />,
    );

    expect(screen.getByText("Selection required")).toBeInTheDocument();
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });
});
