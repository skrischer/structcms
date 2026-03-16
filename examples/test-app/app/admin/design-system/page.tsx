"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Bell,
  Bold,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Edit,
  Eye,
  File,
  FileText,
  GripVertical,
  Home,
  Image,
  Info,
  Italic,
  LayoutDashboard,
  Link,
  List,
  ListOrdered,
  LogOut,
  Menu,
  MoreHorizontal,
  Navigation,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Strikethrough,
  Trash,
  Trash2,
  Underline,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import {
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  Skeleton,
  Textarea,
  Toggle,
} from "@structcms/admin";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] font-semibold text-[#1E293B] leading-[1.35] mb-6 mt-12 first:mt-0 border-b border-[#E2E8F0] pb-3">
      {children}
    </h2>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-[13px] font-medium text-[#475569] tracking-[0.01em] leading-[1.4] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function DesignSystemPage() {
  const [selectValue, setSelectValue] = useState<string>("published");
  const [checkboxStates, setCheckboxStates] = useState({
    unchecked: false,
    checked: true,
    indeterminate: false,
  });
  const [toggleStates, setToggleStates] = useState({
    off: false,
    on: true,
  });

  return (
    <div
      data-structcms-admin
      className="min-h-screen bg-[#F8FAFC] p-10"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[30px] font-bold text-[#0F172A] leading-[1.2] tracking-[-0.02em] mb-2">
          Design System -- Atoms
        </h1>
        <p className="text-[14px] text-[#64748B] mb-12">
          All atomic UI elements rendered with every variant and state.
        </p>

        {/* ============================================================
            1. BUTTONS
            ============================================================ */}
        <SectionTitle>1. Buttons</SectionTitle>

        <SubSection title="Primary">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex items-center gap-3">
              <Button>Default</Button>
              <Button className="bg-[#1D4ED8] hover:bg-[#1D4ED8]">Hover</Button>
              <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]">
                Active
              </Button>
              <Button disabled>Disabled</Button>
              <Button className="ring-[3px] ring-[rgba(59,130,246,0.15)]">
                Focus
              </Button>
            </div>
          </div>
        </SubSection>

        <SubSection title="Secondary">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary">Default</Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary">Default</Button>
              <Button variant="secondary" className="bg-[#F1F5F9]">
                Hover
              </Button>
              <Button
                variant="secondary"
                className="bg-[#E2E8F0] border-[#CBD5E1]"
              >
                Active
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button
                variant="secondary"
                className="ring-[3px] ring-[rgba(59,130,246,0.15)]"
              >
                Focus
              </Button>
            </div>
          </div>
        </SubSection>

        <SubSection title="Ghost">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Small
              </Button>
              <Button variant="ghost">Default</Button>
              <Button variant="ghost" size="lg">
                Large
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost">Default</Button>
              <Button variant="ghost" className="bg-[#F1F5F9]">
                Hover
              </Button>
              <Button variant="ghost" className="bg-[#E2E8F0]">
                Active
              </Button>
              <Button variant="ghost" disabled>
                Disabled
              </Button>
              <Button
                variant="ghost"
                className="ring-[3px] ring-[rgba(59,130,246,0.15)]"
              >
                Focus
              </Button>
            </div>
          </div>
        </SubSection>

        <SubSection title="Danger">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button variant="destructive" size="sm">
                Small
              </Button>
              <Button variant="destructive">Default</Button>
              <Button variant="destructive" size="lg">
                Large
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="destructive">Default</Button>
              <Button
                variant="destructive"
                className="bg-[#DC2626] hover:bg-[#DC2626]"
              >
                Hover
              </Button>
              <Button
                variant="destructive"
                className="bg-[#B91C1C] hover:bg-[#B91C1C]"
              >
                Active
              </Button>
              <Button variant="destructive" disabled>
                Disabled
              </Button>
              <Button
                variant="destructive"
                className="ring-[3px] ring-[rgba(239,68,68,0.15)]"
              >
                Focus
              </Button>
            </div>
          </div>
        </SubSection>

        <SubSection title="Danger Outline">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button variant="destructive-outline" size="sm">
                Small
              </Button>
              <Button variant="destructive-outline">Default</Button>
              <Button variant="destructive-outline" size="lg">
                Large
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="destructive-outline">Default</Button>
              <Button variant="destructive-outline" className="bg-[#FEF2F2]">
                Hover
              </Button>
              <Button
                variant="destructive-outline"
                className="bg-[#FEE2E2] border-[#DC2626] text-[#B91C1C]"
              >
                Active
              </Button>
              <Button variant="destructive-outline" disabled>
                Disabled
              </Button>
              <Button
                variant="destructive-outline"
                className="ring-[3px] ring-[rgba(239,68,68,0.15)]"
              >
                Focus
              </Button>
            </div>
          </div>
        </SubSection>

        <SubSection title="Buttons with Icons">
          <div className="flex items-center gap-3">
            <Button>
              <Plus size={16} />
              Icon Left
            </Button>
            <Button>
              Icon Right
              <ChevronDown size={16} />
            </Button>
            <Button size="icon">
              <Plus size={16} />
            </Button>
            <Button variant="secondary" size="icon">
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 size={16} />
            </Button>
            <Button variant="destructive-outline" size="icon">
              <Trash2 size={16} />
            </Button>
          </div>
        </SubSection>

        {/* ============================================================
            2. INPUT FIELDS
            ============================================================ */}
        <SectionTitle>2. Input Fields</SectionTitle>

        <SubSection title="Text Input States">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col w-[220px] gap-1">
                <span className="text-[12px] text-[#64748B]">Default</span>
                <Input placeholder="Placeholder text" />
              </div>
              <div className="flex flex-col w-[220px] gap-1">
                <span className="text-[12px] text-[#64748B]">Focus</span>
                <Input
                  defaultValue="Typing..."
                  className="border-[#3B82F6] ring-[3px] ring-[rgba(59,130,246,0.15)]"
                />
              </div>
              <div className="flex flex-col w-[220px] gap-1">
                <span className="text-[12px] text-[#64748B]">Filled</span>
                <Input defaultValue="John Doe" />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex flex-col w-[220px] gap-1">
                <span className="text-[12px] text-[#64748B]">Error</span>
                <Input error defaultValue="Invalid value" />
                <span className="text-[12px] text-[#B91C1C]">
                  This field is required
                </span>
              </div>
              <div className="flex flex-col w-[220px] gap-1">
                <span className="text-[12px] text-[#64748B]">Disabled</span>
                <Input disabled placeholder="Disabled input" />
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection title="Input with Label">
          <div className="flex items-start gap-4">
            <div className="flex flex-col w-[260px] gap-1.5">
              <Label>Email Address</Label>
              <Input placeholder="you@example.com" />
            </div>
            <div className="flex flex-col w-[260px] gap-1.5">
              <Label>Page Slug</Label>
              <div className="flex items-center h-9 rounded-[6px] overflow-clip bg-white border border-[#E2E8F0]">
                <div className="flex items-center h-full px-2.5 bg-[#F8FAFC] border-r border-[#E2E8F0]">
                  <span className="text-[13px] text-[#64748B] font-['JetBrains_Mono',monospace]">
                    /pages/
                  </span>
                </div>
                <div className="flex items-center grow px-3">
                  <span className="text-[14px] text-[#1E293B]">about-us</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[260px] gap-1.5">
              <Label>Search</Label>
              <div className="flex items-center h-9 rounded-[6px] py-2 px-3 gap-2 bg-white border border-[#E2E8F0]">
                <Search
                  size={16}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
                <span className="text-[14px] text-[#94A3B8]">
                  Search pages...
                </span>
              </div>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            3. TEXTAREA
            ============================================================ */}
        <SectionTitle>3. Textarea</SectionTitle>

        <SubSection title="Textarea States">
          <div className="flex items-start flex-wrap gap-4">
            <div className="flex flex-col w-[300px] gap-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Enter a description..." />
              <span className="text-[12px] text-[#64748B]">
                Maximum 500 characters
              </span>
            </div>
            <div className="flex flex-col w-[300px] gap-1.5">
              <Label>Description</Label>
              <Textarea
                defaultValue="This is a page about our company values and mission statement."
                className="border-[#3B82F6] ring-[3px] ring-[rgba(59,130,246,0.15)]"
              />
              <span className="text-[12px] text-[#64748B]">
                62 / 500 characters
              </span>
            </div>
            <div className="flex flex-col w-[300px] gap-1.5">
              <Label>Description</Label>
              <Textarea error defaultValue="Too short" />
              <span className="text-[12px] text-[#B91C1C]">
                Minimum 20 characters required
              </span>
            </div>
            <div className="flex flex-col w-[300px] gap-1.5">
              <Label className="opacity-60">Description</Label>
              <Textarea disabled placeholder="Disabled textarea" />
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            4. LABELS
            ============================================================ */}
        <SectionTitle>4. Labels</SectionTitle>

        <SubSection title="Label Variants">
          <div className="flex items-start gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B]">Standard</span>
              <Label>Page Title</Label>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B]">Required</span>
              <Label required>Page Title</Label>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B]">Optional</span>
              <Label optional>Subtitle</Label>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B]">Error</span>
              <Label error>Page Title</Label>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            5. SELECT / DROPDOWN
            ============================================================ */}
        <SectionTitle>5. Select / Dropdown</SectionTitle>

        <SubSection title="Closed States">
          <div className="flex items-start gap-4">
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">Default</span>
              <Select
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
                placeholder="Select option..."
              />
            </div>
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">With Value</span>
              <Select
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
                value={selectValue}
                onChange={setSelectValue}
              />
            </div>
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">Error</span>
              <Select
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
                error
                placeholder="Select option..."
              />
              <span className="text-[12px] text-[#B91C1C]">
                Please select a status
              </span>
            </div>
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">Disabled</span>
              <Select
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
                disabled
                placeholder="Select option..."
              />
            </div>
          </div>
        </SubSection>

        <SubSection title="Open State (interactive)">
          <div className="flex items-start gap-8">
            <div className="flex flex-col w-[260px]">
              <span className="text-[12px] text-[#64748B] mb-1">
                Click to open
              </span>
              <Select
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                  { value: "archived", label: "Archived" },
                  { value: "scheduled", label: "Scheduled" },
                ]}
                value={selectValue}
                onChange={setSelectValue}
              />
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            6. CHECKBOX & TOGGLE
            ============================================================ */}
        <SectionTitle>6. Checkbox & Toggle</SectionTitle>

        <SubSection title="Checkbox">
          <div className="flex items-center gap-6">
            <Checkbox
              label="Unchecked"
              checked={checkboxStates.unchecked}
              onChange={(v) =>
                setCheckboxStates((s) => ({ ...s, unchecked: v }))
              }
            />
            <Checkbox
              label="Checked"
              checked={checkboxStates.checked}
              onChange={(v) => setCheckboxStates((s) => ({ ...s, checked: v }))}
            />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Checked Disabled" checked disabled />
          </div>
        </SubSection>

        <SubSection title="Toggle / Switch">
          <div className="flex items-center gap-6">
            <Toggle
              label="Off"
              checked={toggleStates.off}
              onChange={(v) => setToggleStates((s) => ({ ...s, off: v }))}
            />
            <Toggle
              label="On"
              checked={toggleStates.on}
              onChange={(v) => setToggleStates((s) => ({ ...s, on: v }))}
            />
            <Toggle label="Disabled Off" disabled />
            <Toggle label="Disabled On" checked disabled />
          </div>
        </SubSection>

        {/* ============================================================
            7. BADGES / TAGS
            ============================================================ */}
        <SectionTitle>7. Badges / Tags</SectionTitle>

        <SubSection title="Default Size">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Badge onClose={() => {}}>Tag</Badge>
              <Badge variant="primary" onClose={() => {}}>
                Filter
              </Badge>
              <Badge variant="success" onClose={() => {}}>
                Active
              </Badge>
            </div>
          </div>
        </SubSection>

        <SubSection title="Small Size">
          <div className="flex items-center gap-3">
            <Badge size="sm">Default</Badge>
            <Badge size="sm" variant="primary">
              Primary
            </Badge>
            <Badge size="sm" variant="success">
              Success
            </Badge>
            <Badge size="sm" variant="warning">
              Warning
            </Badge>
            <Badge size="sm" variant="error">
              Error
            </Badge>
          </div>
        </SubSection>

        {/* ============================================================
            8. BREADCRUMB
            ============================================================ */}
        <SectionTitle>8. Breadcrumb</SectionTitle>

        <SubSection title="Standard Breadcrumb">
          <div className="flex flex-col gap-4">
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "#" },
                { label: "Pages", href: "#" },
                { label: "About Us" },
              ]}
            />
            <Breadcrumb
              items={[
                {
                  label: "",
                  icon: <Home size={16} strokeWidth={1.5} />,
                  href: "#",
                },
                { label: "Content", href: "#" },
                { label: "Hero Sections", href: "#" },
                { label: "Edit Section" },
              ]}
            />
          </div>
        </SubSection>

        {/* ============================================================
            9. SKELETON / LOADING
            ============================================================ */}
        <SectionTitle>9. Skeleton / Loading</SectionTitle>

        <SubSection title="Text Skeleton">
          <div className="flex flex-col w-[400px] gap-2">
            <Skeleton className="h-5 w-[70%]" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-[90%]" />
            <Skeleton className="h-3.5 w-[60%]" />
          </div>
        </SubSection>

        <SubSection title="Card Skeleton">
          <div className="flex flex-col w-[340px] rounded-lg gap-4 bg-white border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" className="size-10" />
              <div className="flex flex-col grow gap-1.5">
                <Skeleton className="h-3.5 w-[60%]" />
                <Skeleton className="h-3 w-[40%]" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-[85%]" />
            </div>
            <div className="flex gap-2">
              <Skeleton shape="button" className="h-8 w-20" />
              <Skeleton shape="button" className="h-8 w-20" />
            </div>
          </div>
        </SubSection>

        <SubSection title="Table Row Skeleton">
          <div className="flex flex-col w-[600px] rounded-lg overflow-clip bg-white border border-[#E2E8F0]">
            <div className="flex items-center py-3 px-4 gap-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <Skeleton className="h-3 w-[30%] bg-[#CBD5E1]" />
              <Skeleton className="h-3 w-[20%] bg-[#CBD5E1]" />
              <Skeleton className="h-3 w-[15%] bg-[#CBD5E1]" />
              <Skeleton className="h-3 w-[15%] bg-[#CBD5E1]" />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex items-center py-3 px-4 gap-4 ${i < 2 ? "border-b border-[#F1F5F9]" : ""}`}
              >
                <Skeleton className="h-3.5 w-[30%]" />
                <Skeleton className="h-3.5 w-[20%]" />
                <Skeleton className="h-3.5 w-[15%]" />
                <Skeleton className="h-3.5 w-[15%]" />
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Avatar / Image Skeleton">
          <div className="flex items-center gap-4">
            <Skeleton shape="circle" className="size-8" />
            <Skeleton shape="circle" className="size-10" />
            <Skeleton shape="circle" className="size-12" />
            <Skeleton shape="rect" className="w-[60px] h-[60px]" />
            <Skeleton shape="rect" className="size-20" />
            <Skeleton shape="rect" className="w-[120px] h-20" />
          </div>
        </SubSection>

        {/* ============================================================
            10. TOAST / NOTIFICATION (static previews)
            ============================================================ */}
        <SectionTitle>10. Toast / Notification</SectionTitle>

        <SubSection title="Full Toast (with description)">
          <div className="flex flex-col w-[420px] gap-3">
            {/* Success */}
            <div className="flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4">
              <CheckCircle
                size={20}
                className="text-[#22C55E] shrink-0 mt-px"
                strokeWidth={1.5}
              />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  Page published
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  Your page &quot;About Us&quot; is now live.
                </p>
              </div>
              <X
                size={16}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
            {/* Error */}
            <div className="flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4">
              <XCircle
                size={20}
                className="text-[#EF4444] shrink-0 mt-px"
                strokeWidth={1.5}
              />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  Upload failed
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  File exceeds the 10MB limit. Please try a smaller file.
                </p>
              </div>
              <X
                size={16}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </SubSection>

        <SubSection title="Warning + Info">
          <div className="flex flex-col w-[420px] gap-3">
            <div className="flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4">
              <AlertTriangle
                size={20}
                className="text-[#F59E0B] shrink-0 mt-px"
                strokeWidth={1.5}
              />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  Unsaved changes
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  You have unsaved changes that will be lost.
                </p>
              </div>
              <X
                size={16}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4">
              <Info
                size={20}
                className="text-[#3B82F6] shrink-0 mt-px"
                strokeWidth={1.5}
              />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  New version available
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  StructCMS v0.2.0 is ready. Refresh to update.
                </p>
              </div>
              <X
                size={16}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </SubSection>

        <SubSection title="Compact (single line)">
          <div className="flex flex-col w-[380px] gap-2">
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <Check
                size={16}
                className="text-[#22C55E] shrink-0"
                strokeWidth={2}
              />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                Changes saved successfully
              </p>
              <X
                size={14}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <XCircle
                size={16}
                className="text-[#EF4444] shrink-0"
                strokeWidth={2}
              />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                Failed to delete page
              </p>
              <X
                size={14}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <AlertTriangle
                size={16}
                className="text-[#F59E0B] shrink-0"
                strokeWidth={2}
              />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                Session expires in 5 minutes
              </p>
              <X
                size={14}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <Info
                size={16}
                className="text-[#3B82F6] shrink-0"
                strokeWidth={2}
              />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                3 pages selected for bulk action
              </p>
              <X
                size={14}
                className="text-[#94A3B8] shrink-0 cursor-pointer"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            11. ICONS
            ============================================================ */}
        <SectionTitle>11. Icons / Icon Styles</SectionTitle>

        <SubSection title="Lucide Icons -- Sizes (16px / 20px / 24px)">
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-medium text-[#94A3B8]">
                16px
              </span>
              <div className="flex items-center gap-4">
                <File size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Image size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Settings
                  size={16}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
                <Search
                  size={16}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
                <Plus size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Trash2
                  size={16}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-medium text-[#94A3B8]">
                20px
              </span>
              <div className="flex items-center gap-4">
                <File size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Image size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Settings
                  size={20}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
                <Search
                  size={20}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
                <Plus size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Trash2
                  size={20}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-medium text-[#94A3B8]">
                24px
              </span>
              <div className="flex items-center gap-4">
                <File size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Image size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Settings
                  size={24}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
                <Search
                  size={24}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
                <Plus size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Trash2
                  size={24}
                  className="text-[#1E293B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection title="CMS-relevant Icons (20px, stroke 1.5)">
          <div className="flex items-start flex-wrap gap-6">
            {[
              { icon: <File size={20} strokeWidth={1.5} />, name: "File" },
              { icon: <Image size={20} strokeWidth={1.5} />, name: "Image" },
              {
                icon: <Settings size={20} strokeWidth={1.5} />,
                name: "Settings",
              },
              { icon: <Search size={20} strokeWidth={1.5} />, name: "Search" },
              { icon: <Plus size={20} strokeWidth={1.5} />, name: "Plus" },
              { icon: <Trash2 size={20} strokeWidth={1.5} />, name: "Trash" },
              { icon: <Edit size={20} strokeWidth={1.5} />, name: "Edit" },
              {
                icon: <ChevronDown size={20} strokeWidth={1.5} />,
                name: "ChevronDown",
              },
              { icon: <Menu size={20} strokeWidth={1.5} />, name: "Menu" },
              { icon: <X size={20} strokeWidth={1.5} />, name: "X / Close" },
              { icon: <Check size={20} strokeWidth={1.5} />, name: "Check" },
              {
                icon: <AlertCircle size={20} strokeWidth={1.5} />,
                name: "AlertCircle",
              },
              { icon: <Info size={20} strokeWidth={1.5} />, name: "Info" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center w-16 gap-1.5"
              >
                <div className="flex items-center justify-center rounded-lg bg-[#F1F5F9] size-10 text-[#1E293B]">
                  {item.icon}
                </div>
                <span className="text-[11px] text-[#64748B] text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        {/* ============================================================
            COMPONENTS SECTION
            ============================================================ */}
        <hr className="border-[#E2E8F0] mt-16 mb-12" />

        <h1 className="text-[30px] font-bold text-[#0F172A] leading-[1.2] tracking-[-0.02em] mb-2">
          Design System -- Components
        </h1>
        <p className="text-[14px] text-[#64748B] mb-12">
          Compound components built from atomic elements. Each component shows
          realistic CMS context with relevant interaction states.
        </p>

        {/* ============================================================
            1. SIDEBAR / NAVIGATION
            ============================================================ */}
        <SectionTitle>1. Sidebar / Navigation</SectionTitle>

        <SubSection title="Expanded and Collapsed variants side by side">
          <div className="flex items-start gap-8">
            {/* Expanded Sidebar */}
            <div className="flex flex-col w-[260px] h-[640px] rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center py-5 px-4 gap-2.5 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-center rounded-md bg-[#2563EB] shrink-0 size-8">
                  <LayoutDashboard
                    size={18}
                    className="text-white"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-[16px] font-semibold text-[#0F172A]">
                  StructCMS
                </span>
              </div>
              <div className="flex flex-col grow py-3 px-2 gap-0.5">
                <div className="flex items-center rounded-md py-2 px-3 gap-2.5">
                  <LayoutDashboard
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[14px] font-medium text-[#334155]">
                    Dashboard
                  </span>
                </div>
                <div className="flex items-center rounded-md py-2 px-3 gap-2.5 bg-[#EFF6FF]">
                  <FileText
                    size={20}
                    className="text-[#2563EB]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[14px] font-medium text-[#2563EB]">
                    Pages
                  </span>
                </div>
                <div className="flex items-center rounded-md py-2 px-3 gap-2.5 bg-[#F1F5F9]">
                  <Image
                    size={20}
                    className="text-[#334155]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[14px] font-medium text-[#334155]">
                    Media
                  </span>
                </div>
                <div className="flex items-center rounded-md py-2 px-3 gap-2.5">
                  <Navigation
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[14px] font-medium text-[#334155]">
                    Navigation
                  </span>
                </div>
                <div className="flex items-center rounded-md py-2 px-3 gap-2.5">
                  <Settings
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[14px] font-medium text-[#334155]">
                    Settings
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-t border-[#F1F5F9] p-4">
                <div className="flex items-center justify-center rounded-full bg-[#E2E8F0] shrink-0 size-8">
                  <span className="text-[13px] font-semibold text-[#475569]">
                    JD
                  </span>
                </div>
                <div className="flex flex-col grow">
                  <span className="text-[13px] font-medium text-[#1E293B]">
                    Jane Doe
                  </span>
                  <span className="text-[12px] text-[#64748B]">Admin</span>
                </div>
                <LogOut
                  size={20}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Collapsed Sidebar */}
            <div className="flex flex-col w-16 h-[640px] rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-center py-5 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-center rounded-md bg-[#2563EB] shrink-0 size-8">
                  <LayoutDashboard
                    size={18}
                    className="text-white"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center grow py-3 gap-1">
                <div className="flex items-center justify-center rounded-md shrink-0 size-10">
                  <LayoutDashboard
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-md bg-[#EFF6FF] shrink-0 size-10">
                  <FileText
                    size={20}
                    className="text-[#2563EB]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-md shrink-0 size-10">
                  <Image
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-md shrink-0 size-10">
                  <Navigation
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-md shrink-0 size-10">
                  <Settings
                    size={20}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center py-4 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-center rounded-full bg-[#E2E8F0] shrink-0 size-8">
                  <span className="text-[13px] font-semibold text-[#475569]">
                    JD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            2. HEADER BAR
            ============================================================ */}
        <SectionTitle>2. Header Bar</SectionTitle>

        <SubSection title="Top bar with breadcrumb, search, notifications, and user avatar">
          <div className="flex items-center justify-between w-full h-14 rounded-lg px-5 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] text-[#64748B]">Dashboard</span>
              <ChevronRight
                size={16}
                className="text-[#CBD5E1]"
                strokeWidth={1.5}
              />
              <span className="text-[14px] text-[#64748B]">Pages</span>
              <ChevronRight
                size={16}
                className="text-[#CBD5E1]"
                strokeWidth={1.5}
              />
              <span className="text-[14px] font-medium text-[#1E293B]">
                Homepage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center w-[200px] h-8 rounded-md py-1.5 px-3 gap-2 bg-[#F8FAFC] border border-[#E2E8F0]">
                <Search
                  size={16}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
                <span className="text-[13px] text-[#94A3B8]">Search...</span>
              </div>
              <div className="flex items-center justify-center relative rounded-md shrink-0 size-9">
                <Bell size={20} className="text-[#475569]" strokeWidth={1.5} />
                <div className="absolute top-1.5 right-1.5 rounded-full bg-[#EF4444] border-2 border-white size-2" />
              </div>
              <div className="flex items-center justify-center rounded-full bg-[#E2E8F0] shrink-0 size-8">
                <span className="text-[12px] font-semibold text-[#475569]">
                  JD
                </span>
              </div>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            3. DATA TABLE
            ============================================================ */}
        <SectionTitle>3. Data Table</SectionTitle>

        <SubSection title="Pages table with sorting, selection, hover states, and empty state">
          {/* Filled Table */}
          <div className="flex flex-col w-full rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            {/* Table Header */}
            <div className="flex items-center h-11 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="rounded-[3px] border-[1.5px] border-[#CBD5E1] shrink-0 size-4" />
              </div>
              <div className="flex-[2] flex items-center px-4 gap-1">
                <span className="text-[13px] tracking-[0.01em] font-medium text-[#475569]">
                  Title
                </span>
                <ArrowUpDown
                  size={14}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <span className="text-[13px] tracking-[0.01em] font-medium text-[#475569]">
                  Status
                </span>
              </div>
              <div className="flex-1 flex items-center px-4 gap-1">
                <span className="text-[13px] tracking-[0.01em] font-medium text-[#475569]">
                  Slug
                </span>
              </div>
              <div className="w-[140px] flex items-center px-4 gap-1 shrink-0">
                <span className="text-[13px] tracking-[0.01em] font-medium text-[#475569]">
                  Last Modified
                </span>
                <ChevronDown
                  size={14}
                  className="text-[#2563EB]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="w-20 px-4 shrink-0">
                <span className="text-[13px] tracking-[0.01em] font-medium text-[#475569]">
                  Actions
                </span>
              </div>
            </div>

            {/* Row - Selected */}
            <div className="flex items-center h-[52px] px-4 bg-[#EFF6FF] border-b border-[#F1F5F9] shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="flex items-center justify-center rounded-[3px] bg-[#2563EB] shrink-0 size-4">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-[2] px-4">
                <span className="text-[14px] font-medium text-[#1E293B]">
                  Homepage
                </span>
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <Badge variant="success" size="sm">
                  Published
                </Badge>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] text-[#64748B] font-[JetBrains_Mono,monospace]">
                  /
                </span>
              </div>
              <div className="w-[140px] px-4 shrink-0">
                <span className="text-[13px] text-[#64748B]">Mar 15, 2026</span>
              </div>
              <div className="w-20 flex px-4 gap-1 shrink-0">
                <Pencil
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
                <Trash2
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Row - Default */}
            <div className="flex items-center h-[52px] px-4 bg-white border-b border-[#F1F5F9] shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="rounded-[3px] border-[1.5px] border-[#CBD5E1] shrink-0 size-4" />
              </div>
              <div className="flex-[2] px-4">
                <span className="text-[14px] text-[#1E293B]">About Us</span>
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <Badge variant="success" size="sm">
                  Published
                </Badge>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] text-[#64748B] font-[JetBrains_Mono,monospace]">
                  /about
                </span>
              </div>
              <div className="w-[140px] px-4 shrink-0">
                <span className="text-[13px] text-[#64748B]">Mar 12, 2026</span>
              </div>
              <div className="w-20 flex px-4 gap-1 shrink-0">
                <Pencil
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
                <Trash2
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Row - Hover */}
            <div className="flex items-center h-[52px] px-4 bg-[#F8FAFC] border-b border-[#F1F5F9] shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="rounded-[3px] border-[1.5px] border-[#CBD5E1] shrink-0 size-4" />
              </div>
              <div className="flex-[2] px-4">
                <span className="text-[14px] text-[#1E293B]">
                  Blog Post: Getting Started
                </span>
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <Badge variant="warning" size="sm">
                  Draft
                </Badge>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] text-[#64748B] font-[JetBrains_Mono,monospace]">
                  /blog/getting-started
                </span>
              </div>
              <div className="w-[140px] px-4 shrink-0">
                <span className="text-[13px] text-[#64748B]">Mar 14, 2026</span>
              </div>
              <div className="w-20 flex px-4 gap-1 shrink-0">
                <Pencil
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
                <Trash2
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Row - Default 2 */}
            <div className="flex items-center h-[52px] px-4 bg-white border-b border-[#F1F5F9] shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="rounded-[3px] border-[1.5px] border-[#CBD5E1] shrink-0 size-4" />
              </div>
              <div className="flex-[2] px-4">
                <span className="text-[14px] text-[#1E293B]">Contact</span>
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <Badge variant="success" size="sm">
                  Published
                </Badge>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] text-[#64748B] font-[JetBrains_Mono,monospace]">
                  /contact
                </span>
              </div>
              <div className="w-[140px] px-4 shrink-0">
                <span className="text-[13px] text-[#64748B]">Mar 10, 2026</span>
              </div>
              <div className="w-20 flex px-4 gap-1 shrink-0">
                <Pencil
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
                <Trash2
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Row - Default 3 */}
            <div className="flex items-center h-[52px] px-4 bg-white border-b border-[#F1F5F9] shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="rounded-[3px] border-[1.5px] border-[#CBD5E1] shrink-0 size-4" />
              </div>
              <div className="flex-[2] px-4">
                <span className="text-[14px] text-[#1E293B]">
                  Privacy Policy
                </span>
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <Badge variant="error" size="sm">
                  Archived
                </Badge>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] text-[#64748B] font-[JetBrains_Mono,monospace]">
                  /privacy
                </span>
              </div>
              <div className="w-[140px] px-4 shrink-0">
                <span className="text-[13px] text-[#64748B]">Feb 28, 2026</span>
              </div>
              <div className="w-20 flex px-4 gap-1 shrink-0">
                <Pencil
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
                <Trash2
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Row - Default 4 */}
            <div className="flex items-center h-[52px] px-4 bg-white shrink-0">
              <div className="w-8 flex items-center justify-center shrink-0">
                <div className="rounded-[3px] border-[1.5px] border-[#CBD5E1] shrink-0 size-4" />
              </div>
              <div className="flex-[2] px-4">
                <span className="text-[14px] text-[#1E293B]">
                  Terms of Service
                </span>
              </div>
              <div className="w-[100px] px-4 shrink-0">
                <Badge variant="warning" size="sm">
                  Draft
                </Badge>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] text-[#64748B] font-[JetBrains_Mono,monospace]">
                  /terms
                </span>
              </div>
              <div className="w-[140px] px-4 shrink-0">
                <span className="text-[13px] text-[#64748B]">Feb 20, 2026</span>
              </div>
              <div className="w-20 flex px-4 gap-1 shrink-0">
                <Pencil
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
                <Trash2
                  size={16}
                  className="text-[#64748B]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Empty State Table */}
          <div className="flex flex-col w-full mt-6 rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center h-11 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] shrink-0">
              <span className="text-[13px] tracking-[0.01em] font-medium text-[#475569] px-4">
                Title
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
              <div className="flex items-center justify-center rounded-full bg-[#F1F5F9] shrink-0 size-12">
                <FileText
                  size={24}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[14px] font-medium text-[#1E293B]">
                No pages found
              </span>
              <span className="text-[13px] text-[#64748B]">
                Get started by creating your first page.
              </span>
              <Button className="mt-1">
                <Plus size={16} />
                Create Page
              </Button>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            4. FORM LAYOUT
            ============================================================ */}
        <SectionTitle>4. Form Layout</SectionTitle>

        <SubSection title="Hero Section editor form with field groups, validation errors, and action bar">
          <div className="flex flex-col w-full max-w-[720px] rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] font-semibold text-[#0F172A]">
                  Hero Section
                </span>
                <span className="text-[13px] text-[#64748B]">
                  Edit the hero section for this page.
                </span>
              </div>
              <Badge variant="primary">hero</Badge>
            </div>

            {/* Content fields */}
            <div className="flex flex-col gap-4 p-5">
              <span className="text-[11px] tracking-[0.06em] uppercase font-semibold text-[#64748B]">
                Content
              </span>
              <div className="flex flex-col gap-1">
                <div>
                  <span className="text-[13px] font-medium text-[#334155]">
                    Title{" "}
                  </span>
                  <span className="text-[13px] font-medium text-[#EF4444]">
                    *
                  </span>
                </div>
                <Input defaultValue="Welcome to StructCMS" />
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <span className="text-[13px] font-medium text-[#334155]">
                    Subtitle{" "}
                  </span>
                  <span className="text-[13px] font-medium text-[#EF4444]">
                    *
                  </span>
                </div>
                <Input error />
                <span className="text-[12px] text-[#B91C1C]">
                  Subtitle is required. Please enter at least 10 characters.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-[#334155]">
                  Description
                </span>
                <Textarea defaultValue="A modern, code-first headless CMS framework for developers who value control and flexibility." />
                <span className="text-[12px] text-[#64748B]">
                  Optional. Supports basic formatting.
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E2E8F0]" />

            {/* Media fields */}
            <div className="flex flex-col gap-4 p-5">
              <span className="text-[11px] tracking-[0.06em] uppercase font-semibold text-[#64748B]">
                Media
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-[#334155]">
                  Background Image
                </span>
                <div className="flex items-center justify-center rounded-md gap-2 bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] p-6">
                  <Upload
                    size={20}
                    className="text-[#94A3B8]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[13px] text-[#64748B]">
                    Drop an image or click to browse
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-[#334155]">
                  CTA Button Label
                </span>
                <Input defaultValue="Get Started" />
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-end py-4 px-5 gap-2 bg-[#F8FAFC] border-t border-[#E2E8F0]">
              <Button variant="secondary">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            5. KPI CARDS
            ============================================================ */}
        <SectionTitle>5. Cards</SectionTitle>

        <SubSection title="KPI dashboard cards">
          <div className="flex w-full gap-4">
            {/* Total Pages */}
            <div className="flex flex-col grow rounded-lg gap-2 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#64748B]">
                  Total Pages
                </span>
                <FileText
                  size={20}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[30px] font-bold tracking-[-0.02em] text-[#0F172A]">
                124
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-medium text-[#15803D] bg-[#F0FDF4] rounded-sm py-px px-1.5">
                  +12%
                </span>
                <span className="text-[12px] text-[#64748B]">this month</span>
              </div>
            </div>

            {/* Media Files */}
            <div className="flex flex-col grow rounded-lg gap-2 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#64748B]">
                  Media Files
                </span>
                <Image size={20} className="text-[#94A3B8]" strokeWidth={1.5} />
              </div>
              <span className="text-[30px] font-bold tracking-[-0.02em] text-[#0F172A]">
                847
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-medium text-[#15803D] bg-[#F0FDF4] rounded-sm py-px px-1.5">
                  +5%
                </span>
                <span className="text-[12px] text-[#64748B]">this month</span>
              </div>
            </div>

            {/* Draft Pages */}
            <div className="flex flex-col grow rounded-lg gap-2 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#64748B]">
                  Draft Pages
                </span>
                <Pencil
                  size={20}
                  className="text-[#94A3B8]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[30px] font-bold tracking-[-0.02em] text-[#0F172A]">
                18
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-medium text-[#B91C1C] bg-[#FEF2F2] rounded-sm py-px px-1.5">
                  -3%
                </span>
                <span className="text-[12px] text-[#64748B]">this month</span>
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection title="Content card">
          <div className="flex flex-col w-[340px] rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-[#DBEAFE] to-[#93C5FD]">
              <Image size={40} className="text-[#93C5FD]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  Published
                </Badge>
                <span className="text-[12px] text-[#64748B]">Mar 15, 2026</span>
              </div>
              <span className="text-[16px] font-semibold text-[#0F172A]">
                Homepage
              </span>
              <span className="text-[14px] text-[#64748B]">
                The main landing page with hero section, features overview, and
                call-to-action blocks.
              </span>
              <div className="flex items-center pt-2 gap-2 border-t border-[#F1F5F9]">
                <Button variant="secondary" size="sm">
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button variant="secondary" size="sm">
                  <Eye size={14} />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            6. DIALOG / MODAL
            ============================================================ */}
        <SectionTitle>6. Dialog / Modal</SectionTitle>

        <SubSection title="Destructive and standard dialog variants (rendered as static cards)">
          <div className="flex items-start gap-8">
            {/* Destructive Dialog */}
            <div className="flex items-center justify-center w-[480px] h-80 rounded-xl bg-[rgba(15,23,42,0.5)]">
              <div className="flex flex-col w-[400px] rounded-xl overflow-clip bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between pt-5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-[#FEF2F2] shrink-0 size-10">
                      <Trash2
                        size={20}
                        className="text-[#EF4444]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-[16px] font-semibold text-[#0F172A]">
                      Delete Page
                    </span>
                  </div>
                  <div className="flex items-center justify-center rounded-md shrink-0 size-8">
                    <X size={20} className="text-[#94A3B8]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="pt-3 pb-5 px-5">
                  <span className="text-[14px] text-[#64748B]">
                    Are you sure you want to delete &quot;Homepage&quot;? This
                    action cannot be undone and all associated content will be
                    permanently removed.
                  </span>
                </div>
                <div className="flex items-center justify-end py-4 px-5 gap-2 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="destructive">Delete Page</Button>
                </div>
              </div>
            </div>

            {/* Standard Dialog */}
            <div className="flex items-center justify-center w-[480px] h-80 rounded-xl bg-[rgba(15,23,42,0.5)]">
              <div className="flex flex-col w-[400px] rounded-xl overflow-clip bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between pt-5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-[#EFF6FF] shrink-0 size-10">
                      <FileText
                        size={20}
                        className="text-[#3B82F6]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-[16px] font-semibold text-[#0F172A]">
                      Publish Page
                    </span>
                  </div>
                  <div className="flex items-center justify-center rounded-md shrink-0 size-8">
                    <X size={20} className="text-[#94A3B8]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="pt-3 pb-5 px-5">
                  <span className="text-[14px] text-[#64748B]">
                    This page will be published and visible to all visitors. You
                    can unpublish it at any time from the pages overview.
                  </span>
                </div>
                <div className="flex items-center justify-end py-4 px-5 gap-2 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <Button variant="secondary">Cancel</Button>
                  <Button>Publish</Button>
                </div>
              </div>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            7. MEDIA GRID
            ============================================================ */}
        <SectionTitle>7. Media Grid</SectionTitle>

        <SubSection title="Thumbnail grid with selection, hover overlay, and upload zone">
          {/* Thumbnail Grid */}
          <div className="flex flex-wrap w-full gap-3">
            {/* Selected item */}
            <div className="w-[120px] h-[120px] relative rounded-lg overflow-clip border-2 border-[#3B82F6] shadow-[0_0_0_3px_rgba(59,130,246,0.15)] bg-gradient-to-br from-[#DBEAFE] to-[#60A5FA]">
              <div className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-[#2563EB] size-5">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            </div>
            {/* Hover item */}
            <div className="w-[120px] h-[120px] relative rounded-lg overflow-clip border border-[#E2E8F0] bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]">
              <div className="absolute bottom-0 flex items-center justify-between bg-[rgba(15,23,42,0.7)] inset-x-0 p-2">
                <span className="text-[11px] text-white truncate">
                  banner.jpg
                </span>
                <MoreHorizontal
                  size={14}
                  className="text-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            {/* Default items */}
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#D1FAE5] to-[#6EE7B7]" />
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#E0E7FF] to-[#A5B4FC]" />
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#FCE7F3] to-[#F9A8D4]" />
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#FEE2E2] to-[#FCA5A5]" />
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#DBEAFE] to-[#93C5FD]" />
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#D1FAE5] to-[#34D399]" />
            <div className="w-[120px] h-[120px] rounded-lg border border-[#E2E8F0] bg-gradient-to-br from-[#F1F5F9] to-[#CBD5E1]" />
          </div>

          {/* Upload Zone */}
          <div className="flex flex-col items-center justify-center w-full mt-4 rounded-lg gap-2 bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] p-8">
            <div className="flex items-center justify-center rounded-full bg-[#F1F5F9] shrink-0 size-10">
              <Upload size={20} className="text-[#64748B]" strokeWidth={1.5} />
            </div>
            <span className="text-[14px] font-medium text-[#334155]">
              Drop files here or click to browse
            </span>
            <span className="text-[12px] text-[#94A3B8]">
              PNG, JPG, SVG, WebP up to 10MB
            </span>
          </div>
        </SubSection>

        {/* ============================================================
            8. ARRAY FIELD
            ============================================================ */}
        <SectionTitle>8. Array Field</SectionTitle>

        <SubSection title="Sortable list of repeatable items with drag handles and reorder capability">
          <div className="flex flex-col w-full max-w-[640px] rounded-lg overflow-clip bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            {/* Header */}
            <div className="flex items-center justify-between py-3 px-4 border-b border-[#E2E8F0]">
              <span className="text-[13px] font-medium text-[#334155]">
                Features
              </span>
              <span className="text-[12px] text-[#64748B]">4 items</span>
            </div>

            {/* Item 1 - Default */}
            <div className="flex items-center py-2.5 px-4 gap-3 border-b border-[#F1F5F9]">
              <GripVertical
                size={16}
                className="text-[#CBD5E1]"
                strokeWidth={2}
              />
              <div className="grow flex flex-col gap-0.5">
                <span className="text-[14px] text-[#1E293B]">
                  Code-First Architecture
                </span>
                <span className="text-[12px] text-[#64748B]">
                  Define your content model in TypeScript
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Pencil
                    size={14}
                    className="text-[#64748B]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Trash2
                    size={14}
                    className="text-[#94A3B8]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Item 2 - Active/Dragging */}
            <div className="flex items-center py-2.5 px-4 gap-3 bg-[#EFF6FF] border-l-2 border-l-[#3B82F6] border-b border-[#F1F5F9] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <GripVertical
                size={16}
                className="text-[#3B82F6]"
                strokeWidth={2}
              />
              <div className="grow flex flex-col gap-0.5">
                <span className="text-[14px] font-medium text-[#1E293B]">
                  Type-Safe API
                </span>
                <span className="text-[12px] text-[#64748B]">
                  Full TypeScript support from schema to delivery
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Pencil
                    size={14}
                    className="text-[#64748B]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Trash2
                    size={14}
                    className="text-[#94A3B8]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Item 3 - Default */}
            <div className="flex items-center py-2.5 px-4 gap-3 border-b border-[#F1F5F9]">
              <GripVertical
                size={16}
                className="text-[#CBD5E1]"
                strokeWidth={2}
              />
              <div className="grow flex flex-col gap-0.5">
                <span className="text-[14px] text-[#1E293B]">
                  Visual Admin Panel
                </span>
                <span className="text-[12px] text-[#64748B]">
                  Auto-generated forms for content editing
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Pencil
                    size={14}
                    className="text-[#64748B]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Trash2
                    size={14}
                    className="text-[#94A3B8]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Item 4 - Default */}
            <div className="flex items-center py-2.5 px-4 gap-3 border-b border-[#F1F5F9]">
              <GripVertical
                size={16}
                className="text-[#CBD5E1]"
                strokeWidth={2}
              />
              <div className="grow flex flex-col gap-0.5">
                <span className="text-[14px] text-[#1E293B]">
                  Supabase Integration
                </span>
                <span className="text-[12px] text-[#64748B]">
                  Built-in support for Supabase storage and auth
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Pencil
                    size={14}
                    className="text-[#64748B]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-sm shrink-0 size-7">
                  <Trash2
                    size={14}
                    className="text-[#94A3B8]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Add Item */}
            <div className="flex items-center justify-center gap-1.5 p-2.5">
              <Plus size={16} className="text-[#3B82F6]" strokeWidth={2} />
              <span className="text-[13px] font-medium text-[#3B82F6]">
                Add Item
              </span>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            9. RICH TEXT TOOLBAR
            ============================================================ */}
        <SectionTitle>9. Rich Text Editor Toolbar</SectionTitle>

        <SubSection title="Formatting toolbar with grouped actions and active state indicators">
          <div className="flex items-center w-full max-w-[720px] flex-wrap py-1.5 px-2 gap-0.5 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] rounded-t-lg">
            {/* Bold - Active */}
            <div className="flex items-center justify-center rounded-sm bg-[#EFF6FF] shrink-0 size-8">
              <Bold size={16} className="text-[#2563EB]" strokeWidth={2.5} />
            </div>
            {/* Italic */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <Italic size={16} className="text-[#475569]" strokeWidth={1.5} />
            </div>
            {/* Underline */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <Underline
                size={16}
                className="text-[#475569]"
                strokeWidth={1.5}
              />
            </div>
            {/* Strikethrough */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <Strikethrough
                size={16}
                className="text-[#475569]"
                strokeWidth={1.5}
              />
            </div>
            {/* Separator */}
            <div className="w-px h-6 bg-[#E2E8F0] shrink-0 mx-1" />
            {/* Heading dropdown - Active */}
            <div className="flex items-center h-8 rounded-sm py-1 px-2 gap-1 bg-[#EFF6FF]">
              <span className="text-[13px] font-semibold text-[#2563EB]">
                H2
              </span>
              <ChevronDown
                size={12}
                className="text-[#2563EB]"
                strokeWidth={1.5}
              />
            </div>
            {/* Separator */}
            <div className="w-px h-6 bg-[#E2E8F0] shrink-0 mx-1" />
            {/* Ordered List */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <ListOrdered
                size={16}
                className="text-[#475569]"
                strokeWidth={1.5}
              />
            </div>
            {/* Unordered List */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <List size={16} className="text-[#475569]" strokeWidth={1.5} />
            </div>
            {/* Separator */}
            <div className="w-px h-6 bg-[#E2E8F0] shrink-0 mx-1" />
            {/* Link */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <Link size={16} className="text-[#475569]" strokeWidth={1.5} />
            </div>
            {/* Image */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <Image size={16} className="text-[#475569]" strokeWidth={1.5} />
            </div>
            {/* Code */}
            <div className="flex items-center justify-center rounded-sm shrink-0 size-8">
              <Code size={16} className="text-[#475569]" strokeWidth={1.5} />
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            10. PAGINATION
            ============================================================ */}
        <SectionTitle>10. Pagination</SectionTitle>

        <SubSection title="Standard, compact, and items-per-page variants">
          <div className="flex flex-col gap-6">
            {/* Standard */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] tracking-[0.01em] font-medium text-[#64748B]">
                Standard
              </span>
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <ChevronLeft
                    size={16}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center justify-center rounded-md bg-[#2563EB] shrink-0 size-8">
                  <span className="text-[13px] font-medium text-white">1</span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <span className="text-[13px] font-medium text-[#334155]">
                    2
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <span className="text-[13px] font-medium text-[#334155]">
                    3
                  </span>
                </div>
                <div className="flex items-center justify-center shrink-0 size-8">
                  <span className="text-[13px] text-[#94A3B8]">...</span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <span className="text-[13px] font-medium text-[#334155]">
                    12
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <ChevronRight
                    size={16}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Compact */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] tracking-[0.01em] font-medium text-[#64748B]">
                Compact
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <ChevronLeft
                    size={16}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[14px] text-[#334155]">
                  Page <span className="font-medium">1</span> of{" "}
                  <span className="font-medium">12</span>
                </span>
                <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                  <ChevronRight
                    size={16}
                    className="text-[#475569]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* With Items Per Page */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] tracking-[0.01em] font-medium text-[#64748B]">
                With Items Per Page
              </span>
              <div className="flex items-center justify-between w-full max-w-[640px]">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#64748B]">
                    Rows per page
                  </span>
                  <div className="flex items-center h-8 rounded-md py-1 px-2.5 gap-1 border border-[#E2E8F0]">
                    <span className="text-[13px] text-[#1E293B]">10</span>
                    <ChevronDown
                      size={14}
                      className="text-[#64748B]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#64748B]">
                    1-10 of 124
                  </span>
                  <div className="flex gap-1">
                    <div className="flex items-center justify-center opacity-50 rounded-md border border-[#E2E8F0] shrink-0 size-8">
                      <ChevronLeft
                        size={16}
                        className="text-[#475569]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex items-center justify-center rounded-md border border-[#E2E8F0] shrink-0 size-8">
                      <ChevronRight
                        size={16}
                        className="text-[#475569]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SubSection>

        {/* ============================================================
            11. EMPTY / ERROR STATES
            ============================================================ */}
        <SectionTitle>11. Empty States / Error States</SectionTitle>

        <SubSection title="Empty, error, and not-found feedback states">
          <div className="flex flex-wrap gap-6">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center w-[340px] rounded-lg py-12 px-8 gap-3 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-center rounded-full bg-[#F1F5F9] shrink-0 size-16">
                <Image size={28} className="text-[#94A3B8]" strokeWidth={1.5} />
              </div>
              <span className="text-[16px] font-semibold text-center text-[#0F172A]">
                No media uploaded yet
              </span>
              <span className="text-[14px] text-center text-[#64748B]">
                Upload images, documents, and other files to use across your
                pages.
              </span>
              <Button className="mt-1">
                <Upload size={16} />
                Upload Files
              </Button>
            </div>

            {/* Error State */}
            <div className="flex flex-col items-center justify-center w-[340px] rounded-lg py-10 px-8 gap-3 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-center rounded-full bg-[#FEF2F2] shrink-0 size-16">
                <AlertCircle
                  size={28}
                  className="text-[#EF4444]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[16px] font-semibold text-center text-[#0F172A]">
                Something went wrong
              </span>
              <span className="text-[14px] text-center text-[#64748B]">
                We could not load the page data. Please check your connection
                and try again.
              </span>
              <Button variant="secondary" className="mt-1">
                <RefreshCw size={16} />
                Retry
              </Button>
            </div>

            {/* 404 State */}
            <div className="flex flex-col items-center justify-center w-[340px] rounded-lg py-12 px-8 gap-3 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <span className="text-[48px] font-bold tracking-[-0.02em] text-[#E2E8F0]">
                404
              </span>
              <span className="text-[16px] font-semibold text-center text-[#0F172A]">
                Page not found
              </span>
              <span className="text-[14px] text-center text-[#64748B]">
                The page you are looking for does not exist or has been moved.
              </span>
              <Button className="mt-1">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </SubSection>
      </div>
    </div>
  );
}
