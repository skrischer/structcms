'use client';

import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  Edit,
  File,
  Home,
  Image,
  Info,
  Menu,
  Plus,
  Search,
  Settings,
  Trash,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

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
} from '@structcms/admin';

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
  const [selectValue, setSelectValue] = useState<string>('published');
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
              <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]">Active</Button>
              <Button disabled>Disabled</Button>
              <Button className="ring-[3px] ring-[rgba(59,130,246,0.15)]">Focus</Button>
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
              <Button variant="secondary" className="bg-[#E2E8F0] border-[#CBD5E1]">
                Active
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" className="ring-[3px] ring-[rgba(59,130,246,0.15)]">
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
              <Button variant="ghost" className="ring-[3px] ring-[rgba(59,130,246,0.15)]">
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
              <Button variant="destructive" className="bg-[#DC2626] hover:bg-[#DC2626]">
                Hover
              </Button>
              <Button variant="destructive" className="bg-[#B91C1C] hover:bg-[#B91C1C]">
                Active
              </Button>
              <Button variant="destructive" disabled>
                Disabled
              </Button>
              <Button variant="destructive" className="ring-[3px] ring-[rgba(239,68,68,0.15)]">
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
                <span className="text-[12px] text-[#B91C1C]">This field is required</span>
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
                <Search size={16} className="text-[#94A3B8]" strokeWidth={1.5} />
                <span className="text-[14px] text-[#94A3B8]">Search pages...</span>
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
              <span className="text-[12px] text-[#64748B]">Maximum 500 characters</span>
            </div>
            <div className="flex flex-col w-[300px] gap-1.5">
              <Label>Description</Label>
              <Textarea
                defaultValue="This is a page about our company values and mission statement."
                className="border-[#3B82F6] ring-[3px] ring-[rgba(59,130,246,0.15)]"
              />
              <span className="text-[12px] text-[#64748B]">62 / 500 characters</span>
            </div>
            <div className="flex flex-col w-[300px] gap-1.5">
              <Label>Description</Label>
              <Textarea error defaultValue="Too short" />
              <span className="text-[12px] text-[#B91C1C]">Minimum 20 characters required</span>
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
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                ]}
                placeholder="Select option..."
              />
            </div>
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">With Value</span>
              <Select
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                ]}
                value={selectValue}
                onChange={setSelectValue}
              />
            </div>
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">Error</span>
              <Select
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                ]}
                error
                placeholder="Select option..."
              />
              <span className="text-[12px] text-[#B91C1C]">Please select a status</span>
            </div>
            <div className="flex flex-col w-[220px] gap-1">
              <span className="text-[12px] text-[#64748B]">Disabled</span>
              <Select
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
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
              <span className="text-[12px] text-[#64748B] mb-1">Click to open</span>
              <Select
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' },
                  { value: 'scheduled', label: 'Scheduled' },
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
              onChange={(v) => setCheckboxStates((s) => ({ ...s, unchecked: v }))}
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
                { label: 'Dashboard', href: '#' },
                { label: 'Pages', href: '#' },
                { label: 'About Us' },
              ]}
            />
            <Breadcrumb
              items={[
                {
                  label: '',
                  icon: <Home size={16} strokeWidth={1.5} />,
                  href: '#',
                },
                { label: 'Content', href: '#' },
                { label: 'Hero Sections', href: '#' },
                { label: 'Edit Section' },
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
                className={`flex items-center py-3 px-4 gap-4 ${i < 2 ? 'border-b border-[#F1F5F9]' : ''}`}
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
              <CheckCircle size={20} className="text-[#22C55E] shrink-0 mt-px" strokeWidth={1.5} />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  Page published
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  Your page &quot;About Us&quot; is now live.
                </p>
              </div>
              <X size={16} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
            </div>
            {/* Error */}
            <div className="flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4">
              <XCircle size={20} className="text-[#EF4444] shrink-0 mt-px" strokeWidth={1.5} />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  Upload failed
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  File exceeds the 10MB limit. Please try a smaller file.
                </p>
              </div>
              <X size={16} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
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
              <X size={16} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
            </div>
            <div className="flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4">
              <Info size={20} className="text-[#3B82F6] shrink-0 mt-px" strokeWidth={1.5} />
              <div className="flex flex-col grow gap-0.5">
                <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">
                  New version available
                </p>
                <p className="text-[13px] text-[#64748B] leading-4">
                  StructCMS v0.2.0 is ready. Refresh to update.
                </p>
              </div>
              <X size={16} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
            </div>
          </div>
        </SubSection>

        <SubSection title="Compact (single line)">
          <div className="flex flex-col w-[380px] gap-2">
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <Check size={16} className="text-[#22C55E] shrink-0" strokeWidth={2} />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                Changes saved successfully
              </p>
              <X size={14} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
            </div>
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <XCircle size={16} className="text-[#EF4444] shrink-0" strokeWidth={2} />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                Failed to delete page
              </p>
              <X size={14} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
            </div>
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <AlertTriangle size={16} className="text-[#F59E0B] shrink-0" strokeWidth={2} />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                Session expires in 5 minutes
              </p>
              <X size={14} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
            </div>
            <div className="flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <Info size={16} className="text-[#3B82F6] shrink-0" strokeWidth={2} />
              <p className="text-[14px] text-[#1E293B] leading-[18px] grow">
                3 pages selected for bulk action
              </p>
              <X size={14} className="text-[#94A3B8] shrink-0 cursor-pointer" strokeWidth={1.5} />
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
              <span className="text-[11px] font-medium text-[#94A3B8]">16px</span>
              <div className="flex items-center gap-4">
                <File size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Image size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Settings size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Search size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Plus size={16} className="text-[#1E293B]" strokeWidth={1.5} />
                <Trash2 size={16} className="text-[#1E293B]" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-medium text-[#94A3B8]">20px</span>
              <div className="flex items-center gap-4">
                <File size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Image size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Settings size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Search size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Plus size={20} className="text-[#1E293B]" strokeWidth={1.5} />
                <Trash2 size={20} className="text-[#1E293B]" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-medium text-[#94A3B8]">24px</span>
              <div className="flex items-center gap-4">
                <File size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Image size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Settings size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Search size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Plus size={24} className="text-[#1E293B]" strokeWidth={1.5} />
                <Trash2 size={24} className="text-[#1E293B]" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection title="CMS-relevant Icons (20px, stroke 1.5)">
          <div className="flex items-start flex-wrap gap-6">
            {[
              { icon: <File size={20} strokeWidth={1.5} />, name: 'File' },
              { icon: <Image size={20} strokeWidth={1.5} />, name: 'Image' },
              {
                icon: <Settings size={20} strokeWidth={1.5} />,
                name: 'Settings',
              },
              { icon: <Search size={20} strokeWidth={1.5} />, name: 'Search' },
              { icon: <Plus size={20} strokeWidth={1.5} />, name: 'Plus' },
              { icon: <Trash2 size={20} strokeWidth={1.5} />, name: 'Trash' },
              { icon: <Edit size={20} strokeWidth={1.5} />, name: 'Edit' },
              {
                icon: <ChevronDown size={20} strokeWidth={1.5} />,
                name: 'ChevronDown',
              },
              { icon: <Menu size={20} strokeWidth={1.5} />, name: 'Menu' },
              { icon: <X size={20} strokeWidth={1.5} />, name: 'X / Close' },
              { icon: <Check size={20} strokeWidth={1.5} />, name: 'Check' },
              {
                icon: <AlertCircle size={20} strokeWidth={1.5} />,
                name: 'AlertCircle',
              },
              { icon: <Info size={20} strokeWidth={1.5} />, name: 'Info' },
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center w-16 gap-1.5">
                <div className="flex items-center justify-center rounded-lg bg-[#F1F5F9] size-10 text-[#1E293B]">
                  {item.icon}
                </div>
                <span className="text-[11px] text-[#64748B] text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </SubSection>
      </div>
    </div>
  );
}
