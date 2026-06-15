'use client';

import {
  AlertCircle,
  ArrowLeft,
  Bold,
  Copy,
  Eye,
  FileText,
  GripVertical,
  Heading1,
  Image,
  Inbox,
  Italic,
  LayoutDashboard,
  Link,
  List,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Type,
  Upload,
  X,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { ArrayField } from '../fields/array-field';
import { Badge } from '../ui/badge';
import { Breadcrumb } from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DataTable } from '../ui/data-table';
import type { Column } from '../ui/data-table';
import { Dialog } from '../ui/dialog';
import { EmptyState } from '../ui/empty-state';
import { ErrorAlert } from '../ui/error-alert';
import { FieldGroup } from '../ui/field-group';
import { FieldMessage } from '../ui/field-message';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Pagination } from '../ui/pagination';
import { RadioGroup } from '../ui/radio-group';
import { Select } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { TagInput } from '../ui/tag-input';
import { Textarea } from '../ui/textarea';
import { ToastItem } from '../ui/toast';
import { Toggle } from '../ui/toggle';

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] font-semibold text-[var(--admin-gray-800)] leading-[1.35] mb-6 mt-12 first:mt-0 border-b border-[var(--admin-gray-200)] pb-3">
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
      <h3 className="text-[13px] font-medium text-[var(--admin-gray-600)] tracking-[0.01em] leading-[1.4] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

interface SamplePage extends Record<string, unknown> {
  id: string;
  title: string;
  status: string;
  slug: string;
  modified: string;
}

const samplePages: SamplePage[] = [
  {
    id: '1',
    title: 'Homepage',
    status: 'published',
    slug: '/',
    modified: '2 hours ago',
  },
  {
    id: '2',
    title: 'About Us',
    status: 'draft',
    slug: '/about',
    modified: '1 day ago',
  },
  {
    id: '3',
    title: 'Blog',
    status: 'published',
    slug: '/blog',
    modified: '3 days ago',
  },
  {
    id: '4',
    title: 'Contact',
    status: 'draft',
    slug: '/contact',
    modified: '5 days ago',
  },
  {
    id: '5',
    title: 'Privacy Policy',
    status: 'published',
    slug: '/privacy',
    modified: '1 week ago',
  },
];

const sampleColumns: Column<SamplePage>[] = [
  { key: 'title', header: 'Title', sortable: true },
  {
    key: 'status',
    header: 'Status',
    width: '100px',
    render: (_value: unknown, row: SamplePage) => (
      <Badge variant={row.status === 'published' ? 'success' : 'default'} size="sm">
        {row.status}
      </Badge>
    ),
  },
  { key: 'slug', header: 'Slug' },
  { key: 'modified', header: 'Last Modified', sortable: true, width: '140px' },
];

/* ------------------------------------------------------------------ */
/*  DesignSystemPage                                                   */
/* ------------------------------------------------------------------ */

export interface DesignSystemPageProps {
  className?: string;
}

function DesignSystemPage({ className }: DesignSystemPageProps) {
  /* --- interactive state --- */
  const [checkboxA, setCheckboxA] = React.useState(false);
  const [checkboxB, setCheckboxB] = React.useState(true);
  const [toggleA, setToggleA] = React.useState(false);
  const [toggleB, setToggleB] = React.useState(true);
  const [selectValue, setSelectValue] = React.useState('');
  const [selectOpen, setSelectOpen] = React.useState('opt2');
  const [tags, setTags] = React.useState<string[]>(['cms', 'headless', 'typescript']);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [arrayItems, setArrayItems] = React.useState<string[]>([
    'Hero Section',
    'Feature Grid',
    'Testimonials',
  ]);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const [formLayout, setFormLayout] = React.useState('default');
  const [formTheme, setFormTheme] = React.useState('light');
  const [formTarget, setFormTarget] = React.useState('_self');
  const [formShowCta, setFormShowCta] = React.useState(true);
  const [formPublished, setFormPublished] = React.useState(true);

  return (
    <div
      className={cn('max-w-[1200px] mx-auto w-full flex flex-col gap-6', className)}
      data-testid="design-system-page"
    >
      <h1 className="text-[30px] font-bold text-[var(--admin-gray-900)] leading-[1.2] tracking-[-0.02em] mb-2">
        Design System -- Atoms
      </h1>
      <p className="text-[14px] text-[var(--admin-gray-500)] mb-12">
        All atomic UI elements rendered with every variant and state.
      </p>

      {/* ============================================================ */}
      {/*  DESIGN TOKENS                                                */}
      {/* ============================================================ */}
      <div className="border-b-2 border-[var(--admin-gray-200)] pb-12 mb-12">
        <h1 className="text-[30px] font-bold text-[var(--admin-gray-900)] leading-[1.2] tracking-[-0.02em] mb-2">
          Design Tokens
        </h1>
        <p className="text-[14px] text-[var(--admin-gray-500)] mb-12">
          Color, typography, spacing, radius, and shadow tokens used across the system.
        </p>

        {/* -------------------------------------------------------------- */}
        {/*  Color Palette                                                  */}
        {/* -------------------------------------------------------------- */}
        <SectionTitle>Color Palette</SectionTitle>

        <SubSection title="Primary">
          <div className="flex flex-wrap gap-3">
            {[
              { token: 'primary-50', hex: '#eff6ff' },
              { token: 'primary-100', hex: '#dbeafe' },
              { token: 'primary-200', hex: '#bfdbfe' },
              { token: 'primary-500', hex: '#3b82f6' },
              { token: 'primary-600', hex: '#2563eb' },
              { token: 'primary-700', hex: '#1d4ed8' },
            ].map((c) => (
              <div key={c.token} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-12 h-12 rounded-md border border-[var(--admin-gray-200)]"
                  style={{
                    backgroundColor: `var(--admin-${c.token})`,
                  }}
                />
                <span className="text-[11px] text-[var(--admin-gray-600)]">{c.token}</span>
                <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-400)]">
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Gray / Neutral">
          <div className="flex flex-wrap gap-3">
            {[
              { token: 'gray-50', hex: '#f8fafc' },
              { token: 'gray-100', hex: '#f1f5f9' },
              { token: 'gray-200', hex: '#e2e8f0' },
              { token: 'gray-300', hex: '#cbd5e1' },
              { token: 'gray-400', hex: '#94a3b8' },
              { token: 'gray-500', hex: '#64748b' },
              { token: 'gray-600', hex: '#475569' },
              { token: 'gray-700', hex: '#334155' },
              { token: 'gray-800', hex: '#1e293b' },
              { token: 'gray-900', hex: '#0f172a' },
            ].map((c) => (
              <div key={c.token} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-12 h-12 rounded-md border border-[var(--admin-gray-200)]"
                  style={{
                    backgroundColor: `var(--admin-${c.token})`,
                  }}
                />
                <span className="text-[11px] text-[var(--admin-gray-600)]">{c.token}</span>
                <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-400)]">
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Semantic">
          <div className="flex flex-wrap gap-6">
            {[
              {
                group: 'Success',
                tokens: [
                  { token: 'success-500', hex: '#22c55e' },
                  { token: 'success-700', hex: '#15803d' },
                ],
              },
              {
                group: 'Error',
                tokens: [
                  { token: 'error-500', hex: '#ef4444' },
                  { token: 'error-700', hex: '#b91c1c' },
                ],
              },
              {
                group: 'Warning',
                tokens: [
                  { token: 'warning-500', hex: '#f59e0b' },
                  { token: 'warning-700', hex: '#b45309' },
                ],
              },
              {
                group: 'Info',
                tokens: [
                  { token: 'info-500', hex: '#3b82f6' },
                  { token: 'info-700', hex: '#1d4ed8' },
                ],
              },
            ].map((g) => (
              <div key={g.group} className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-[var(--admin-gray-500)] tracking-[0.04em] uppercase mb-1">
                  {g.group}
                </span>
                <div className="flex gap-3">
                  {g.tokens.map((c) => (
                    <div key={c.token} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-12 h-12 rounded-md border border-[var(--admin-gray-200)]"
                        style={{ backgroundColor: `var(--admin-${c.token})` }}
                      />
                      <span className="text-[11px] text-[var(--admin-gray-600)]">{c.token}</span>
                      <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-400)]">
                        {c.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Surfaces">
          <div className="flex flex-wrap gap-3">
            {[
              { token: 'surface-page', label: 'Page', hex: '#f8fafc' },
              { token: 'surface-card', label: 'Card', hex: '#ffffff' },
              { token: 'surface-sidebar', label: 'Sidebar', hex: '#ffffff' },
              { token: 'surface-header', label: 'Header', hex: '#ffffff' },
            ].map((c) => (
              <div key={c.token} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-12 h-12 rounded-md border border-[var(--admin-gray-200)]"
                  style={{ backgroundColor: `var(--admin-${c.token})` }}
                />
                <span className="text-[11px] text-[var(--admin-gray-600)]">{c.label}</span>
                <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-400)]">
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        {/* -------------------------------------------------------------- */}
        {/*  Typography Scale                                               */}
        {/* -------------------------------------------------------------- */}
        <SectionTitle>Typography Scale</SectionTitle>

        <SubSection title="Type Specimens">
          <div className="flex flex-col gap-5">
            {[
              {
                name: 'Display',
                size: '30px',
                weight: 700,
                lh: '1.2',
                tracking: '-0.02em',
              },
              { name: 'H1', size: '24px', weight: 600, lh: '1.3' },
              { name: 'H2', size: '20px', weight: 600, lh: '1.35' },
              { name: 'H3', size: '16px', weight: 600, lh: '1.3' },
              { name: 'Body LG', size: '16px', weight: 400, lh: '1.5' },
              { name: 'Body', size: '14px', weight: 400, lh: '1.5' },
              { name: 'Body Medium', size: '14px', weight: 500, lh: '1.5' },
              { name: 'Label', size: '13px', weight: 500, lh: '1.4' },
              { name: 'Caption', size: '12px', weight: 400, lh: '1.4' },
              {
                name: 'Overline',
                size: '11px',
                weight: 600,
                lh: '1.4',
                tracking: '0.06em',
                transform: 'uppercase' as const,
              },
              {
                name: 'Code',
                size: '13px',
                weight: 400,
                lh: '1.5',
                font: "'JetBrains Mono', monospace",
              },
            ].map((t) => (
              <div key={t.name} className="flex items-baseline gap-6">
                <div className="w-[120px] shrink-0">
                  <span className="text-[11px] font-medium text-[var(--admin-gray-500)]">
                    {t.name}
                  </span>
                  <span className="block text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-400)]">
                    {t.size}/{t.weight}
                  </span>
                </div>
                <span
                  className="text-[var(--admin-gray-900)]"
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    lineHeight: t.lh,
                    letterSpacing: t.tracking,
                    textTransform: t.transform,
                    fontFamily: t.font,
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        {/* -------------------------------------------------------------- */}
        {/*  Spacing Scale                                                  */}
        {/* -------------------------------------------------------------- */}
        <SectionTitle>Spacing Scale</SectionTitle>

        <SubSection title="Spacing Values">
          <div className="flex flex-col gap-2">
            {[2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].map((px) => (
              <div key={px} className="flex items-center gap-3">
                <span className="w-[48px] text-right text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-500)] shrink-0">
                  {px}px
                </span>
                <div
                  className="h-3 rounded-sm bg-[var(--admin-primary-400)]"
                  style={{ width: `${px}px` }}
                />
              </div>
            ))}
          </div>
        </SubSection>

        {/* -------------------------------------------------------------- */}
        {/*  Border Radius                                                  */}
        {/* -------------------------------------------------------------- */}
        <SectionTitle>Border Radius</SectionTitle>

        <SubSection title="Radius Values">
          <div className="flex flex-wrap items-end gap-4">
            {[
              { name: 'none', value: '0px' },
              { name: 'sm', value: '4px' },
              { name: 'md', value: '6px' },
              { name: 'lg', value: '8px' },
              { name: 'xl', value: '12px' },
              { name: '2xl', value: '16px' },
              { name: 'full', value: '9999px' },
            ].map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-16 h-16 bg-[var(--admin-primary-100)] border-2 border-[var(--admin-primary-400)]"
                  style={{ borderRadius: `var(--admin-radius-${r.name})` }}
                />
                <span className="text-[11px] font-medium text-[var(--admin-gray-600)]">
                  {r.name}
                </span>
                <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[var(--admin-gray-400)]">
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        {/* -------------------------------------------------------------- */}
        {/*  Shadows                                                        */}
        {/* -------------------------------------------------------------- */}
        <SectionTitle>Shadows</SectionTitle>

        <SubSection title="Shadow Levels">
          <div className="flex flex-wrap items-start gap-6">
            {['xs', 'sm', 'md', 'lg', 'xl', 'ring'].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className="w-24 h-24 rounded-lg bg-[var(--admin-surface-card)]"
                  style={{ boxShadow: `var(--admin-shadow-${s})` }}
                />
                <span className="text-[11px] font-medium text-[var(--admin-gray-600)]">{s}</span>
              </div>
            ))}
          </div>
        </SubSection>
      </div>

      {/* ============================================================ */}
      {/*  1. Buttons                                                   */}
      {/* ============================================================ */}
      <SectionTitle>1. Buttons</SectionTitle>

      <SubSection title="Variants (default size)">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Danger</Button>
          <Button variant="destructive-outline">Danger Outline</Button>
        </div>
      </SubSection>

      <SubSection title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus size={16} />
          </Button>
        </div>
      </SubSection>

      <SubSection title="Disabled">
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Primary</Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
          <Button variant="destructive" disabled>
            Danger
          </Button>
          <Button variant="destructive-outline" disabled>
            Danger Outline
          </Button>
        </div>
      </SubSection>

      <SubSection title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <Plus size={16} /> Add Page
          </Button>
          <Button variant="secondary">
            <Upload size={16} /> Upload
          </Button>
          <Button variant="ghost">
            <Settings size={16} /> Settings
          </Button>
          <Button variant="destructive">
            <Trash2 size={16} /> Delete
          </Button>
          <Button variant="destructive-outline">
            <Trash2 size={16} /> Remove
          </Button>
        </div>
      </SubSection>

      <SubSection title="Icon Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon">
            <Pencil size={16} />
          </Button>
          <Button size="icon" variant="secondary">
            <Copy size={16} />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreHorizontal size={16} />
          </Button>
          <Button size="icon" variant="destructive">
            <Trash2 size={16} />
          </Button>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  2. Input Fields                                              */}
      {/* ============================================================ */}
      <SectionTitle>2. Input Fields</SectionTitle>

      <SubSection title="States">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-[220px]">
            <Input placeholder="Default" />
          </div>
          <div className="w-[220px]">
            <Input defaultValue="Filled value" />
          </div>
          <div className="w-[220px]">
            <Input error placeholder="Error state" />
          </div>
          <div className="w-[220px]">
            <Input disabled placeholder="Disabled" />
          </div>
        </div>
      </SubSection>

      <SubSection title="Input with Label">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col w-[220px] gap-1.5">
            <Label>Page Title</Label>
            <Input placeholder="Enter title..." />
          </div>
          <div className="flex flex-col w-[220px] gap-1.5">
            <Label required>Page Title</Label>
            <Input placeholder="Required field" />
          </div>
          <div className="flex flex-col w-[220px] gap-1.5">
            <Label error>Page Title</Label>
            <Input error placeholder="Error field" />
          </div>
        </div>
      </SubSection>

      <SubSection title="Input with Prefix / Suffix">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col w-[300px] gap-1.5">
            <Label>Search</Label>
            <Input prefix={<Search size={16} strokeWidth={1.5} />} placeholder="Search pages..." />
          </div>
          <div className="flex flex-col w-[300px] gap-1.5">
            <Label>Slug</Label>
            <Input
              prefix={
                <span className="text-[13px] font-['JetBrains_Mono',monospace]">/pages/</span>
              }
              defaultValue="about-us"
            />
          </div>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  3. Textarea                                                  */}
      {/* ============================================================ */}
      <SectionTitle>3. Textarea</SectionTitle>

      <SubSection title="States">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-[260px]">
            <Textarea placeholder="Default textarea..." />
          </div>
          <div className="w-[260px]">
            <Textarea defaultValue="This is a filled textarea with content." />
          </div>
          <div className="w-[260px]">
            <Textarea error placeholder="Error state" />
          </div>
          <div className="w-[260px]">
            <Textarea disabled placeholder="Disabled" />
          </div>
        </div>
      </SubSection>

      <SubSection title="With Character Counter">
        <div className="w-[400px]">
          <Textarea
            showCount
            maxLength={500}
            defaultValue="This is a description that tracks character count as you type."
          />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  4. Labels                                                    */}
      {/* ============================================================ */}
      <SectionTitle>4. Labels</SectionTitle>

      <SubSection title="Variants">
        <div className="flex flex-wrap items-start gap-6">
          <Label>Standard Label</Label>
          <Label required>Required Label</Label>
          <Label optional>Optional Label</Label>
          <Label error>Error Label</Label>
        </div>
      </SubSection>

      <SubSection title="With Subtitle">
        <div className="flex flex-wrap items-start gap-6">
          <Label subtitle="A short summary shown in search results">Meta Description</Label>
          <Label subtitle="Used in the browser tab" required>
            Page Title
          </Label>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  5. Select / Dropdown                                         */}
      {/* ============================================================ */}
      <SectionTitle>5. Select / Dropdown</SectionTitle>

      <SubSection title="Closed States">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' },
                { value: 'opt3', label: 'Option 3' },
              ]}
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Select an option..."
            />
          </div>
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' },
              ]}
              value="opt1"
              onChange={() => {}}
              placeholder="With value"
            />
          </div>
          <div className="w-[220px]">
            <Select
              options={[{ value: 'opt1', label: 'Option 1' }]}
              error
              placeholder="Error state"
            />
          </div>
          <div className="w-[220px]">
            <Select
              options={[{ value: 'opt1', label: 'Option 1' }]}
              disabled
              placeholder="Disabled"
            />
          </div>
        </div>
      </SubSection>

      <SubSection title="Open State">
        <div className="flex items-start gap-4">
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'opt1', label: 'Published' },
                { value: 'opt2', label: 'Draft' },
                { value: 'opt3', label: 'Archived' },
              ]}
              value={selectOpen}
              onChange={setSelectOpen}
              placeholder="Select status"
            />
          </div>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  6. Checkbox & Toggle                                         */}
      {/* ============================================================ */}
      <SectionTitle>6. Checkbox & Toggle</SectionTitle>

      <SubSection title="Checkboxes">
        <div className="flex flex-wrap items-start gap-6">
          <Checkbox label="Unchecked" checked={checkboxA} onChange={setCheckboxA} />
          <Checkbox label="Checked" checked={checkboxB} onChange={setCheckboxB} />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" checked disabled />
        </div>
      </SubSection>

      <SubSection title="Toggles">
        <div className="flex flex-wrap items-start gap-6">
          <Toggle label="Off" checked={toggleA} onChange={setToggleA} />
          <Toggle label="On" checked={toggleB} onChange={setToggleB} />
          <Toggle label="Disabled off" disabled />
          <Toggle label="Disabled on" checked disabled />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  7. Badges / Tags                                             */}
      {/* ============================================================ */}
      <SectionTitle>7. Badges / Tags</SectionTitle>

      <SubSection title="Default Size">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </SubSection>

      <SubSection title="Small Size">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" size="sm">
            Default
          </Badge>
          <Badge variant="primary" size="sm">
            Primary
          </Badge>
          <Badge variant="success" size="sm">
            Success
          </Badge>
          <Badge variant="warning" size="sm">
            Warning
          </Badge>
          <Badge variant="error" size="sm">
            Error
          </Badge>
        </div>
      </SubSection>

      <SubSection title="Closeable">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" onClose={() => {}}>
            Removable
          </Badge>
          <Badge variant="primary" onClose={() => {}}>
            Removable
          </Badge>
          <Badge variant="success" onClose={() => {}}>
            Removable
          </Badge>
          <Badge variant="warning" onClose={() => {}}>
            Removable
          </Badge>
          <Badge variant="error" onClose={() => {}}>
            Removable
          </Badge>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  8. Breadcrumb                                                */}
      {/* ============================================================ */}
      <SectionTitle>8. Breadcrumb</SectionTitle>

      <SubSection title="Standard Navigation Paths">
        <div className="flex flex-col gap-4">
          <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Pages' }]} />
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Pages', href: '/pages' },
              { label: 'Edit Page' },
            ]}
          />
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Media', href: '/media' },
              { label: 'Images', href: '/media/images' },
              { label: 'hero-banner.jpg' },
            ]}
          />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  9. Skeleton / Loading                                        */}
      {/* ============================================================ */}
      <SectionTitle>9. Skeleton / Loading</SectionTitle>

      <SubSection title="Text Skeletons">
        <div className="flex flex-col gap-2 max-w-md">
          <Skeleton width="75%" height={14} shape="text" />
          <Skeleton width="100%" height={14} shape="text" />
          <Skeleton width="60%" height={14} shape="text" />
        </div>
      </SubSection>

      <SubSection title="Card Skeleton">
        <Card variant="outlined" className="w-[300px]">
          <div className="flex flex-col gap-3">
            <Skeleton width="100%" height={120} shape="rect" />
            <Skeleton width="70%" height={16} shape="text" />
            <Skeleton width="90%" height={12} shape="text" />
          </div>
        </Card>
      </SubSection>

      <SubSection title="Table Row Skeleton">
        <div className="flex items-center gap-4 py-3 border-b border-[var(--admin-gray-100)]">
          <Skeleton width={18} height={18} shape="rect" />
          <Skeleton width="40%" height={14} shape="text" />
          <Skeleton width={60} height={20} shape="button" />
          <Skeleton width="20%" height={14} shape="text" />
          <Skeleton width={80} height={14} shape="text" />
        </div>
      </SubSection>

      <SubSection title="Avatar Skeleton">
        <div className="flex items-center gap-3">
          <Skeleton width={32} height={32} shape="circle" />
          <Skeleton width={40} height={40} shape="circle" />
          <Skeleton width={48} height={48} shape="circle" />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  10. Toast / Notification                                     */}
      {/* ============================================================ */}
      <SectionTitle>10. Toast / Notification</SectionTitle>

      <SubSection title="Full (with title)">
        <div className="flex flex-col gap-3 max-w-sm">
          <ToastItem
            variant="success"
            title="Page Published"
            message="Homepage is now live and accessible to visitors."
            onDismiss={() => {}}
          />
          <ToastItem
            variant="error"
            title="Upload Failed"
            message="The file exceeds the maximum allowed size of 10MB."
            onDismiss={() => {}}
          />
          <ToastItem
            variant="warning"
            title="Unsaved Changes"
            message="You have unsaved changes that will be lost."
            onDismiss={() => {}}
          />
          <ToastItem
            variant="info"
            title="New Version"
            message="A new version of the CMS is available."
            onDismiss={() => {}}
          />
        </div>
      </SubSection>

      <SubSection title="Compact (no title)">
        <div className="flex flex-col gap-3 max-w-sm">
          <ToastItem variant="success" message="Page saved successfully." onDismiss={() => {}} />
          <ToastItem variant="error" message="Failed to delete page." onDismiss={() => {}} />
          <ToastItem
            variant="warning"
            message="Session expires in 5 minutes."
            onDismiss={() => {}}
          />
          <ToastItem variant="info" message="2 pages updated." onDismiss={() => {}} />
          <ToastItem variant="default" message="Action completed." onDismiss={() => {}} />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  11. Icons                                                    */}
      {/* ============================================================ */}
      <SectionTitle>11. Icons</SectionTitle>

      <SubSection title="Sizes (16, 20, 24)">
        <div className="flex items-end gap-4 text-[var(--admin-gray-600)]">
          <div className="flex flex-col items-center gap-1">
            <FileText size={16} strokeWidth={1.5} />
            <span className="text-[11px] text-[var(--admin-gray-400)]">16px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FileText size={20} strokeWidth={1.5} />
            <span className="text-[11px] text-[var(--admin-gray-400)]">20px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FileText size={24} strokeWidth={1.5} />
            <span className="text-[11px] text-[var(--admin-gray-400)]">24px</span>
          </div>
        </div>
      </SubSection>

      <SubSection title="CMS-relevant Icons">
        <div className="flex flex-wrap items-center gap-5 text-[var(--admin-gray-600)]">
          {[
            {
              icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
              name: 'Dashboard',
            },
            { icon: <FileText size={20} strokeWidth={1.5} />, name: 'Pages' },
            { icon: <Image size={20} strokeWidth={1.5} />, name: 'Media' },
            {
              icon: <Settings size={20} strokeWidth={1.5} />,
              name: 'Settings',
            },
            { icon: <Plus size={20} strokeWidth={1.5} />, name: 'Add' },
            { icon: <Pencil size={20} strokeWidth={1.5} />, name: 'Edit' },
            { icon: <Trash2 size={20} strokeWidth={1.5} />, name: 'Delete' },
            { icon: <Search size={20} strokeWidth={1.5} />, name: 'Search' },
            { icon: <Eye size={20} strokeWidth={1.5} />, name: 'Preview' },
            { icon: <Upload size={20} strokeWidth={1.5} />, name: 'Upload' },
            { icon: <Link size={20} strokeWidth={1.5} />, name: 'Link' },
            { icon: <Copy size={20} strokeWidth={1.5} />, name: 'Copy' },
            {
              icon: <GripVertical size={20} strokeWidth={1.5} />,
              name: 'Drag',
            },
          ].map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-1.5 w-14">
              {item.icon}
              <span className="text-[11px] text-[var(--admin-gray-400)]">{item.name}</span>
            </div>
          ))}
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  12. Card                                                     */}
      {/* ============================================================ */}
      <SectionTitle>12. Card</SectionTitle>

      <SubSection title="Card Variants">
        <div className="flex items-start gap-4">
          <Card variant="default" className="w-[220px]">
            <p className="text-[14px] text-[var(--admin-gray-800)]">
              Default card with border and subtle shadow.
            </p>
          </Card>
          <Card variant="outlined" className="w-[220px]">
            <p className="text-[14px] text-[var(--admin-gray-800)]">
              Outlined card with border only.
            </p>
          </Card>
          <Card variant="elevated" className="w-[220px]">
            <p className="text-[14px] text-[var(--admin-gray-800)]">
              Elevated card with stronger shadow.
            </p>
          </Card>
        </div>
      </SubSection>

      <SubSection title="Padding Sizes">
        <div className="flex items-start gap-4">
          <Card padding="sm" className="w-[180px]">
            <p className="text-[13px] text-[var(--admin-gray-600)]">Small padding (p-4)</p>
          </Card>
          <Card padding="default" className="w-[180px]">
            <p className="text-[13px] text-[var(--admin-gray-600)]">Default padding (p-6)</p>
          </Card>
          <Card padding="lg" className="w-[180px]">
            <p className="text-[13px] text-[var(--admin-gray-600)]">Large padding (p-8)</p>
          </Card>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  13. Empty State                                              */}
      {/* ============================================================ */}
      <SectionTitle>13. Empty State</SectionTitle>

      <SubSection title='variant="inline" (default)'>
        <div className="flex flex-wrap gap-6">
          <Card variant="outlined" className="w-[340px]" padding="none">
            <EmptyState
              icon={<Image size={28} strokeWidth={1.5} />}
              title="No media uploaded yet"
              description="Upload images, documents, and other files to use across your pages."
              action={
                <Button>
                  <Upload size={16} /> Upload Files
                </Button>
              }
            />
          </Card>
          <Card variant="outlined" className="w-[340px]" padding="none">
            <EmptyState
              title="Page not found"
              description="The page you are looking for does not exist or has been moved."
              action={
                <Button>
                  <ArrowLeft size={16} /> Back to Dashboard
                </Button>
              }
            />
          </Card>
        </div>
      </SubSection>

      <SubSection title='variant="card"'>
        <div className="flex flex-wrap gap-6">
          <EmptyState
            variant="card"
            icon={<Inbox size={28} strokeWidth={1.5} />}
            title="No items found"
            description="There are no items matching your criteria."
            action={
              <Button>
                <Plus size={16} /> Add Item
              </Button>
            }
            className="w-[340px]"
          />
          <EmptyState
            variant="card"
            icon={<Image size={28} strokeWidth={1.5} />}
            title="No media uploaded yet"
            description="Upload images, documents, and other files to use across your pages."
            action={
              <Button>
                <Upload size={16} /> Upload Files
              </Button>
            }
            className="w-[340px]"
          />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  14. Tag Input                                                */}
      {/* ============================================================ */}
      <SectionTitle>14. Tag Input</SectionTitle>

      <SubSection title="Tag Input States">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col w-[300px] gap-1.5">
            <Label>Tags</Label>
            <TagInput value={tags} onChange={setTags} placeholder="Add a tag..." />
          </div>
          <div className="flex flex-col w-[300px] gap-1.5">
            <Label>Tags (empty)</Label>
            <TagInput value={[]} onChange={() => {}} placeholder="Add a tag..." />
          </div>
          <div className="flex flex-col w-[300px] gap-1.5">
            <Label error>Tags (error)</Label>
            <TagInput value={['invalid']} onChange={() => {}} error />
          </div>
          <div className="flex flex-col w-[300px] gap-1.5">
            <Label>Tags (disabled)</Label>
            <TagInput value={['locked', 'tag']} onChange={() => {}} disabled />
          </div>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  15. Dialog                                                   */}
      {/* ============================================================ */}
      <SectionTitle>15. Dialog</SectionTitle>

      <SubSection title="Interactive Dialog">
        <div className="flex gap-3">
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
        </div>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Publish Page"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
            </div>
          }
        >
          <p className="text-[14px] text-[var(--admin-gray-500)]">
            This page will be published and visible to all visitors.
          </p>
        </Dialog>
      </SubSection>

      {/* ============================================================ */}
      {/*  16. Data Table                                               */}
      {/* ============================================================ */}
      <SectionTitle>16. Data Table</SectionTitle>

      <SubSection title="Interactive Table">
        <DataTable<SamplePage>
          columns={sampleColumns}
          data={samplePages}
          rowKey="id"
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyState={<EmptyState title="No pages found" description="Create your first page." />}
        />
      </SubSection>

      {/* ============================================================ */}
      {/*  17. Pagination                                               */}
      {/* ============================================================ */}
      <SectionTitle>17. Pagination</SectionTitle>

      <SubSection title="Standard and Compact">
        <div className="flex flex-col gap-6">
          <Pagination currentPage={currentPage} totalPages={12} onPageChange={setCurrentPage} />
          <Pagination
            currentPage={currentPage}
            totalPages={12}
            onPageChange={setCurrentPage}
            variant="compact"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={12}
            onPageChange={setCurrentPage}
            totalItems={124}
            itemsPerPage={10}
          />
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  18. Error Alert                                              */}
      {/* ============================================================ */}
      <SectionTitle>18. Error Alert</SectionTitle>

      <SubSection title='variant="inline" (default)'>
        <div className="flex flex-col gap-4 max-w-md">
          <ErrorAlert>Failed to load page data. Please try again.</ErrorAlert>
          <ErrorAlert onRetry={() => {}}>Connection lost. Click retry to reconnect.</ErrorAlert>
        </div>
      </SubSection>

      <SubSection title='variant="card"'>
        <div className="flex flex-wrap gap-6">
          <ErrorAlert
            variant="card"
            title="Something went wrong"
            onRetry={() => {}}
            className="w-[340px]"
          >
            We could not load the page data. Please check your connection and try again.
          </ErrorAlert>
        </div>
      </SubSection>

      {/* ============================================================ */}
      {/*  COMPONENTS (composite examples)                              */}
      {/* ============================================================ */}
      <div className="border-t-2 border-[var(--admin-gray-200)] mt-16 pt-12">
        <h1 className="text-[30px] font-bold text-[var(--admin-gray-900)] leading-[1.2] tracking-[-0.02em] mb-2">
          Components
        </h1>
        <p className="text-[14px] text-[var(--admin-gray-500)] mb-12">
          Composite patterns built from atomic elements.
        </p>
      </div>

      {/* Sidebar mockup */}
      <SectionTitle>Sidebar</SectionTitle>
      <SubSection title="Navigation Sidebar">
        <div className="w-[240px] bg-[var(--admin-surface-card)] border border-[var(--admin-gray-200)] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[var(--admin-gray-200)]">
            <span className="text-[16px] font-semibold text-[var(--admin-gray-900)]">
              StructCMS
            </span>
          </div>
          <nav className="p-2 flex flex-col gap-0.5">
            {[
              {
                icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
                label: 'Dashboard',
                active: true,
              },
              {
                icon: <FileText size={18} strokeWidth={1.5} />,
                label: 'Pages',
                active: false,
              },
              {
                icon: <Image size={18} strokeWidth={1.5} />,
                label: 'Media',
                active: false,
              },
              {
                icon: <Link size={18} strokeWidth={1.5} />,
                label: 'Navigation',
                active: false,
              },
              {
                icon: <Settings size={18} strokeWidth={1.5} />,
                label: 'Settings',
                active: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-[14px] transition-colors cursor-pointer',
                  item.active
                    ? 'bg-[var(--admin-primary-50)] text-[var(--admin-primary-600)] font-medium'
                    : 'text-[var(--admin-gray-600)] hover:bg-[var(--admin-gray-50)]'
                )}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
        </div>
      </SubSection>

      {/* Header mockup */}
      <SectionTitle>Header</SectionTitle>
      <SubSection title="Header Bar">
        <div className="bg-[var(--admin-surface-card)] border border-[var(--admin-gray-200)] rounded-lg px-6 py-3 flex items-center justify-between">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Pages', href: '/pages' },
              { label: 'Edit Page' },
            ]}
          />
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Eye size={14} /> Preview
            </Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </SubSection>

      {/* Form Layout mockup */}
      <SectionTitle>Form Layout</SectionTitle>
      <SubSection title="Full Section Editor">
        <Card variant="default" className="max-w-2xl" padding="none">
          {/* Header */}
          <div className="px-5 py-5 border-b border-[var(--admin-gray-200)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-semibold text-[var(--admin-gray-900)]">
                    Showcase Section
                  </h3>
                  <Badge variant="primary" size="sm">
                    showcase
                  </Badge>
                </div>
                <p className="text-[13px] text-[var(--admin-gray-500)]">
                  Edit the showcase section for this page.
                </p>
              </div>
            </div>
          </div>

          {/* Group 1: Content */}
          <FieldGroup label="Content" className="px-5 py-5">
            <div className="flex flex-col gap-1.5">
              <Label required>Title</Label>
              <Input placeholder="Enter headline..." defaultValue="Welcome to StructCMS" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Subtitle</Label>
              <Input placeholder="Optional subtitle..." />
              <FieldMessage>Short tagline displayed below the title</FieldMessage>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label optional>Summary</Label>
              <Textarea
                placeholder="Brief summary for previews..."
                error
                defaultValue="This text is too long for a summary and should be shortened to fit the preview card layout properly."
              />
              <FieldMessage variant="error">Summary must not exceed 120 characters.</FieldMessage>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Body</Label>
              <Card variant="outlined" padding="none">
                <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[var(--admin-gray-100)]">
                  {[
                    { icon: <Bold size={16} />, active: true },
                    { icon: <Italic size={16} />, active: false },
                    { icon: <Heading1 size={16} />, active: false },
                    { icon: <List size={16} />, active: false },
                    { icon: <Link size={16} />, active: false },
                  ].map((btn, i) => (
                    <button
                      key={`form-toolbar-${i}`}
                      type="button"
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
                        btn.active
                          ? 'bg-[var(--admin-gray-100)] text-[var(--admin-gray-800)]'
                          : 'text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-50)]'
                      )}
                    >
                      {btn.icon}
                    </button>
                  ))}
                </div>
                <div className="p-4 min-h-[80px]">
                  <p className="text-[14px] text-[var(--admin-gray-400)]">
                    Write your content here...
                  </p>
                </div>
              </Card>
            </div>
          </FieldGroup>

          <hr className="border-[var(--admin-gray-200)] border-t" />

          {/* Group 2: Media */}
          <FieldGroup label="Media" className="px-5 py-5">
            <div className="flex flex-col gap-1.5">
              <Label>Image</Label>
              <div className="flex items-center justify-center h-[100px] rounded-lg border-2 border-dashed border-[var(--admin-gray-300)] bg-[var(--admin-gray-50)] cursor-pointer hover:border-[var(--admin-primary-400)] transition-colors">
                <div className="flex flex-col items-center gap-1 text-[var(--admin-gray-400)]">
                  <Upload size={20} strokeWidth={1.5} />
                  <span className="text-[12px]">Click or drag to upload</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Grid Items</Label>
                <span className="text-[12px] text-[var(--admin-gray-400)]">2 items</span>
              </div>
              <Card variant="outlined" padding="none">
                {['Product Overview', 'Team Photo'].map((item, i) => (
                  <div
                    key={item}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5',
                      i < 1 && 'border-b border-[var(--admin-gray-100)]'
                    )}
                  >
                    <GripVertical
                      size={14}
                      strokeWidth={1.5}
                      className="text-[var(--admin-gray-300)] cursor-grab shrink-0"
                    />
                    <span className="text-[13px] text-[var(--admin-gray-700)] grow">{item}</span>
                    <Button size="icon" variant="ghost" className="w-6 h-6">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
                <div className="p-2 border-t border-[var(--admin-gray-100)]">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Plus size={14} /> Add Item
                  </Button>
                </div>
              </Card>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Attachment</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-gray-50)]">
                <Paperclip
                  size={16}
                  strokeWidth={1.5}
                  className="text-[var(--admin-gray-400)] shrink-0"
                />
                <div className="flex flex-col grow min-w-0">
                  <span className="text-[13px] text-[var(--admin-gray-700)] truncate">
                    datasheet-v2.pdf
                  </span>
                  <span className="text-[11px] text-[var(--admin-gray-400)]">248 KB</span>
                </div>
                <Button size="icon" variant="ghost" className="w-6 h-6 shrink-0">
                  <X size={12} />
                </Button>
              </div>
              <FieldMessage>Downloadable file (PDF, document, etc.)</FieldMessage>
            </div>
          </FieldGroup>

          <hr className="border-[var(--admin-gray-200)] border-t" />

          {/* Group 3: Appearance */}
          <FieldGroup label="Appearance" className="px-5 py-5">
            <div className="flex flex-col gap-1.5">
              <Label>Layout</Label>
              <RadioGroup
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'cards', label: 'Cards' },
                  { value: 'grid', label: 'Grid' },
                ]}
                value={formLayout}
                onChange={setFormLayout}
              />
              <FieldMessage>Controls how the section content is arranged</FieldMessage>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Theme</Label>
              <RadioGroup
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' },
                ]}
                value={formTheme}
                onChange={setFormTheme}
              />
              <FieldMessage>Color scheme for this section</FieldMessage>
            </div>
            <div className="flex flex-col gap-1">
              <Checkbox label="Display captions below grid/card items" checked={false} />
              <p className="text-[11px] italic text-[var(--admin-gray-400)] pl-6">
                Visible when Layout is cards or grid
              </p>
            </div>
          </FieldGroup>

          <hr className="border-[var(--admin-gray-200)] border-t" />

          {/* Group 4: Call to Action */}
          <FieldGroup label="Call to Action" className="px-5 py-5">
            <div className="flex flex-col gap-1.5">
              <Label>External URL</Label>
              <Input placeholder="https://..." defaultValue="https://structcms.dev/docs" />
              <FieldMessage>Link to an external resource</FieldMessage>
            </div>
            <Toggle label="Show Button" checked={formShowCta} onChange={setFormShowCta} />
            {formShowCta && (
              <div className="flex flex-col gap-3 pl-4 border-l-2 border-[var(--admin-gray-200)]">
                <FieldMessage>Visible when "Show Button" is enabled</FieldMessage>
                <div className="flex flex-col gap-1.5">
                  <Label>Button Label</Label>
                  <Input placeholder="e.g. Get Started" defaultValue="Get Started" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Button URL</Label>
                  <Input
                    prefix={
                      <span className="text-[13px] font-['JetBrains_Mono',monospace]">/</span>
                    }
                    placeholder="path"
                    defaultValue="docs/getting-started"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Variant</Label>
                  <Select
                    options={[
                      { value: 'primary', label: 'Primary' },
                      { value: 'secondary', label: 'Secondary' },
                      { value: 'ghost', label: 'Ghost' },
                      { value: 'outline', label: 'Outline' },
                    ]}
                    value="primary"
                    onChange={() => {}}
                    placeholder="Select variant..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Target</Label>
                  <RadioGroup
                    options={[
                      { value: '_self', label: 'Same tab' },
                      { value: '_blank', label: 'New tab' },
                    ]}
                    value={formTarget}
                    onChange={setFormTarget}
                    orientation="horizontal"
                  />
                </div>
              </div>
            )}
          </FieldGroup>

          <hr className="border-[var(--admin-gray-200)] border-t" />

          {/* Group 5: Metadata */}
          <FieldGroup label="Metadata" className="px-5 py-5">
            <div className="flex flex-col gap-1.5">
              <Label>Tags</Label>
              <TagInput value={tags} onChange={setTags} placeholder="Add a tag..." />
              <FieldMessage>Keywords for categorization</FieldMessage>
            </div>
            <div className="flex flex-col gap-3 pl-4 border-l-2 border-[var(--admin-gray-200)]">
              <div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-[var(--admin-gray-400)]">
                Author
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Name</Label>
                <Input defaultValue="Jane Doe" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Input defaultValue="Editor" />
              </div>
            </div>
            <Toggle label="Published" checked={formPublished} onChange={setFormPublished} />
          </FieldGroup>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-5 py-4 bg-[var(--admin-surface-subtle)] border-t border-[var(--admin-gray-200)]">
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </Card>
      </SubSection>

      {/* Cards mockup */}
      <SectionTitle>Cards</SectionTitle>
      <SubSection title="KPI Cards">
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Total Pages', value: '24', change: '+3 this week' },
            { label: 'Media Files', value: '156', change: '+12 this week' },
            { label: 'Navigations', value: '4', change: 'No change' },
          ].map((kpi) => (
            <Card key={kpi.label} variant="default" className="w-[200px]">
              <p className="text-[13px] text-[var(--admin-gray-500)]">{kpi.label}</p>
              <p className="text-[28px] font-bold text-[var(--admin-gray-900)] leading-tight mt-1">
                {kpi.value}
              </p>
              <p className="text-[12px] text-[var(--admin-gray-400)] mt-1">{kpi.change}</p>
            </Card>
          ))}
        </div>
      </SubSection>

      {/* Media Grid mockup */}
      <SectionTitle>Media Grid</SectionTitle>
      <SubSection title="Image Grid">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={`media-${i}`} variant="outlined" padding="none" className="overflow-hidden">
              <div className="aspect-square bg-[var(--admin-gray-100)] flex items-center justify-center">
                <Image size={24} strokeWidth={1.5} className="text-[var(--admin-gray-300)]" />
              </div>
              <div className="p-2.5">
                <p className="text-[13px] text-[var(--admin-gray-800)] truncate">
                  image-{i + 1}.jpg
                </p>
                <p className="text-[11px] text-[var(--admin-gray-400)]">1.2 MB</p>
              </div>
            </Card>
          ))}
        </div>
      </SubSection>

      {/* Array Field component */}
      <SectionTitle>Array Field</SectionTitle>
      <SubSection title="Card-style with header, items, and add-item footer">
        <div className="max-w-lg">
          <ArrayField
            label="Sections"
            value={arrayItems}
            onChange={setArrayItems}
            createDefaultItem={() => 'New Section'}
            renderItem={(item, _index, onChange) => (
              <Input value={item} onChange={(e) => onChange(e.target.value)} />
            )}
          />
        </div>
      </SubSection>

      {/* Rich Text Toolbar mockup */}
      <SectionTitle>Rich Text Toolbar</SectionTitle>
      <SubSection title="Toolbar">
        <Card variant="outlined" padding="none" className="max-w-lg">
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[var(--admin-gray-100)]">
            {[
              { icon: <Bold size={16} />, active: true },
              { icon: <Italic size={16} />, active: false },
              { icon: <Heading1 size={16} />, active: false },
              { icon: <List size={16} />, active: false },
              { icon: <Link size={16} />, active: false },
              { icon: <Type size={16} />, active: false },
            ].map((btn, i) => (
              <button
                key={`toolbar-${i}`}
                type="button"
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
                  btn.active
                    ? 'bg-[var(--admin-gray-100)] text-[var(--admin-gray-800)]'
                    : 'text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-50)]'
                )}
              >
                {btn.icon}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[120px]">
            <p className="text-[14px] text-[var(--admin-gray-800)] leading-relaxed">
              Start writing rich text content here...
            </p>
          </div>
        </Card>
      </SubSection>

      {/* Empty / Error States mockup */}
      <SectionTitle>Empty & Error States</SectionTitle>
      <SubSection title="In Context">
        <div className="flex flex-wrap gap-6">
          <Card variant="outlined" className="w-[360px]" padding="none">
            <div className="p-4 border-b border-[var(--admin-gray-100)]">
              <h3 className="text-[14px] font-medium text-[var(--admin-gray-800)]">Recent Pages</h3>
            </div>
            <EmptyState
              icon={<FileText size={24} strokeWidth={1.5} />}
              title="No pages yet"
              description="Create your first page to get started."
              action={
                <Button size="sm">
                  <Plus size={14} /> Create Page
                </Button>
              }
            />
          </Card>
          <Card variant="outlined" className="w-[360px]" padding="none">
            <div className="p-4 border-b border-[var(--admin-gray-100)]">
              <h3 className="text-[14px] font-medium text-[var(--admin-gray-800)]">
                Search Results
              </h3>
            </div>
            <EmptyState
              icon={<Search size={24} strokeWidth={1.5} />}
              title="No results found"
              description="Try adjusting your search or filter to find what you are looking for."
            />
          </Card>
        </div>
      </SubSection>
    </div>
  );
}

DesignSystemPage.displayName = 'DesignSystemPage';

export { DesignSystemPage };
