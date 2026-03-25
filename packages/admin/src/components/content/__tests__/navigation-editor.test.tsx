import type { NavigationItem } from "@structcms/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NavigationEditor } from "../navigation-editor";

describe("NavigationEditor", () => {
  it("renders navigation editor", () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId("navigation-editor")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("shows empty state when no items", () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No navigation items")).toBeInTheDocument();
  });

  it("renders Add Item button", () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId("nav-add-item")).toBeInTheDocument();
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("renders Save Navigation button", () => {
    const items: NavigationItem[] = [{ label: "Home", href: "/" }];
    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByTestId("nav-save")).toBeInTheDocument();
    expect(screen.getByText("Save Navigation")).toBeInTheDocument();
  });

  it("renders existing items as display rows", () => {
    const items: NavigationItem[] = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByTestId("nav-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("nav-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("nav-item-label-0")).toHaveTextContent("Home");
    expect(screen.getByTestId("nav-item-href-0")).toHaveTextContent("/");
    expect(screen.getByTestId("nav-item-label-1")).toHaveTextContent("About");
    expect(screen.getByTestId("nav-item-href-1")).toHaveTextContent("/about");
  });

  it("adds a new item when Add Item is clicked", async () => {
    const user = userEvent.setup();

    render(<NavigationEditor items={[]} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-add-item"));

    expect(screen.getByTestId("nav-item-0")).toBeInTheDocument();
  });

  it("removes an item when Remove is clicked", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-item-remove-0"));

    expect(screen.queryByTestId("nav-item-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-item-label-0")).toHaveTextContent("About");
  });

  it("shows editor panel when item row is clicked", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: "Home", href: "/" }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.queryByTestId("nav-editor-label")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("nav-item-label-0"));

    expect(screen.getByTestId("nav-editor-panel")).toBeInTheDocument();
    expect(screen.getByTestId("nav-editor-label")).toHaveValue("Home");
    expect(screen.getByTestId("nav-editor-href")).toHaveValue("/");
  });

  it("selects item by clicking row", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: "Home", href: "/" }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-item-label-0"));

    expect(screen.getByTestId("nav-editor-panel")).toBeInTheDocument();
    expect(screen.getByTestId("nav-editor-label")).toHaveValue("Home");
  });

  it("applies edited values to item", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: "Home", href: "/" }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-item-label-0"));

    const labelInput = screen.getByTestId("nav-editor-label");
    const hrefInput = screen.getByTestId("nav-editor-href");

    await user.clear(labelInput);
    await user.type(labelInput, "About");
    await user.clear(hrefInput);
    await user.type(hrefInput, "/about");
    await user.click(screen.getByTestId("nav-editor-apply"));

    expect(screen.getByTestId("nav-item-label-0")).toHaveTextContent("About");
    expect(screen.getByTestId("nav-item-href-0")).toHaveTextContent("/about");
    expect(screen.queryByTestId("nav-editor-label")).not.toBeInTheDocument();
  });

  it("cancels editing and discards changes", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: "Home", href: "/" }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-item-label-0"));

    const labelInput = screen.getByTestId("nav-editor-label");
    await user.clear(labelInput);
    await user.type(labelInput, "Changed");
    await user.click(screen.getByTestId("nav-editor-cancel"));

    expect(screen.getByTestId("nav-item-label-0")).toHaveTextContent("Home");
    expect(screen.queryByTestId("nav-editor-label")).not.toBeInTheDocument();
  });

  it("adds a child item", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: "Products", href: "/products", children: [] },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-add-child-0"));

    expect(screen.getByTestId("nav-child-0-0")).toBeInTheDocument();
  });

  it("renders existing children as display rows", () => {
    const items: NavigationItem[] = [
      {
        label: "Products",
        href: "/products",
        children: [{ label: "Widget", href: "/products/widget" }],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByTestId("nav-child-0-0")).toBeInTheDocument();
    expect(screen.getByTestId("nav-child-label-0-0")).toHaveTextContent(
      "Widget",
    );
    expect(screen.getByTestId("nav-child-href-0-0")).toHaveTextContent(
      "/products/widget",
    );
  });

  it("removes a child item", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      {
        label: "Products",
        href: "/products",
        children: [
          { label: "Widget", href: "/products/widget" },
          { label: "Gadget", href: "/products/gadget" },
        ],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-child-remove-0-0"));

    expect(screen.queryByTestId("nav-child-0-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-child-label-0-0")).toHaveTextContent(
      "Gadget",
    );
  });

  it("edits a child item via editor panel", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      {
        label: "Products",
        href: "/products",
        children: [{ label: "Widget", href: "/products/widget" }],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-child-label-0-0"));

    expect(screen.getByTestId("nav-editor-label")).toHaveValue("Widget");
    expect(screen.getByTestId("nav-editor-href")).toHaveValue(
      "/products/widget",
    );

    const labelInput = screen.getByTestId("nav-editor-label");
    await user.clear(labelInput);
    await user.type(labelInput, "Gizmo");
    await user.click(screen.getByTestId("nav-editor-apply"));

    expect(screen.getByTestId("nav-child-label-0-0")).toHaveTextContent(
      "Gizmo",
    );
  });

  it("calls onSave with updated items when Save is clicked", async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: "Home", href: "/", children: [] },
    ];

    render(<NavigationEditor items={items} onSave={handleSave} />);

    await user.click(screen.getByTestId("nav-save"));

    expect(handleSave).toHaveBeenCalledWith([
      { label: "Home", href: "/", children: [] },
    ]);
  });

  it("applies custom className", () => {
    render(
      <NavigationEditor
        items={[]}
        onSave={() => {}}
        className="custom-class"
      />,
    );

    expect(screen.getByTestId("navigation-editor")).toHaveClass("custom-class");
  });

  it("shows item count badge", () => {
    const items: NavigationItem[] = [
      { label: "Home", href: "/" },
      {
        label: "Products",
        href: "/products",
        children: [{ label: "Widget", href: "/widget" }],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByText("3 items")).toBeInTheDocument();
  });

  it("deselects item when it is removed", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId("nav-item-label-0"));
    expect(screen.getByTestId("nav-editor-panel")).toBeInTheDocument();

    await user.click(screen.getByTestId("nav-item-remove-0"));
    expect(screen.queryByTestId("nav-editor-label")).not.toBeInTheDocument();
  });

  it("saves edited values through onSave after apply", async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: "Home", href: "/", children: [] },
    ];

    render(<NavigationEditor items={items} onSave={handleSave} />);

    await user.click(screen.getByTestId("nav-item-label-0"));
    const labelInput = screen.getByTestId("nav-editor-label");
    await user.clear(labelInput);
    await user.type(labelInput, "About");
    await user.click(screen.getByTestId("nav-editor-apply"));

    await user.click(screen.getByTestId("nav-save"));

    expect(handleSave).toHaveBeenCalledWith([
      { label: "About", href: "/", children: [] },
    ]);
  });

  it("auto-applies dirty edits when selecting a different item", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    // Select first item and edit it
    await user.click(screen.getByTestId("nav-item-label-0"));
    const labelInput = screen.getByTestId("nav-editor-label");
    await user.clear(labelInput);
    await user.type(labelInput, "Homepage");

    // Click second item — dirty edits on first item should auto-apply
    await user.click(screen.getByTestId("nav-item-label-1"));

    // First item should have the edited label
    expect(screen.getByTestId("nav-item-label-0")).toHaveTextContent(
      "Homepage",
    );
    // Editor should now show second item
    expect(screen.getByTestId("nav-editor-label")).toHaveValue("About");
    expect(screen.getByTestId("nav-editor-href")).toHaveValue("/about");
  });

  it("has aria-labels on icon buttons", () => {
    const items: NavigationItem[] = [
      {
        label: "Home",
        href: "/",
        children: [{ label: "Sub", href: "/sub" }],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByLabelText("Add child")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove item")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove child")).toBeInTheDocument();
  });

  it("supports keyboard navigation on rows", async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: "Home", href: "/" }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    // The label is inside a native <button>, find it
    const labelButton = screen
      .getByTestId("nav-item-label-0")
      .closest("button") as HTMLElement | null;
    expect(labelButton).toBeInTheDocument();

    // Focus and press Enter
    labelButton?.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("nav-editor-label")).toHaveValue("Home");
  });
});
