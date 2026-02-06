import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defineSection, fields, createRegistry } from '@structcms/core';
import { type SectionData } from '@structcms/core';
import { AdminProvider } from '../../../context/admin-context';
import { PageEditor } from '../page-editor';

const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string(),
    subtitle: fields.text(),
  },
});

const ContentSection = defineSection({
  name: 'content',
  fields: {
    body: fields.richtext(),
  },
});

const registry = createRegistry({
  sections: [HeroSection, ContentSection],
});

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      {ui}
    </AdminProvider>
  );
}

describe('PageEditor', () => {
  it('renders page editor', () => {
    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByTestId('page-editor')).toBeInTheDocument();
  });

  it('shows empty state when no sections', () => {
    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByText(/No sections yet/)).toBeInTheDocument();
  });

  it('renders section type selector', () => {
    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    const select = screen.getByTestId('section-type-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('hero');
  });

  it('renders Add Section button', () => {
    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByTestId('add-section')).toBeInTheDocument();
    expect(screen.getByText('Add Section')).toBeInTheDocument();
  });

  it('adds a section when Add Section is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    await user.click(screen.getByTestId('add-section'));

    expect(screen.getByTestId('page-section-0')).toBeInTheDocument();
  });

  it('renders existing sections', () => {
    const sections: SectionData[] = [
      { type: 'hero', data: { title: 'Hello', subtitle: 'World' } },
    ];

    renderWithProvider(
      <PageEditor
        sections={sections}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByTestId('page-section-0')).toBeInTheDocument();
  });

  it('renders Remove button for each section', () => {
    const sections: SectionData[] = [
      { type: 'hero', data: { title: 'Hello' } },
      { type: 'content', data: { body: '<p>Text</p>' } },
    ];

    renderWithProvider(
      <PageEditor
        sections={sections}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByTestId('section-remove-0')).toBeInTheDocument();
    expect(screen.getByTestId('section-remove-1')).toBeInTheDocument();
  });

  it('removes a section when Remove is clicked', async () => {
    const user = userEvent.setup();
    const sections: SectionData[] = [
      { type: 'hero', data: { title: 'Hello' } },
      { type: 'content', data: { body: '<p>Text</p>' } },
    ];

    renderWithProvider(
      <PageEditor
        sections={sections}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    await user.click(screen.getByTestId('section-remove-0'));

    expect(screen.queryByTestId('page-section-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('page-section-0')).toBeInTheDocument();
  });

  it('renders Up/Down buttons for each section', () => {
    const sections: SectionData[] = [
      { type: 'hero', data: {} },
      { type: 'content', data: {} },
    ];

    renderWithProvider(
      <PageEditor
        sections={sections}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByTestId('section-move-up-0')).toBeDisabled();
    expect(screen.getByTestId('section-move-down-0')).not.toBeDisabled();
    expect(screen.getByTestId('section-move-up-1')).not.toBeDisabled();
    expect(screen.getByTestId('section-move-down-1')).toBeDisabled();
  });

  it('renders Save Page button', () => {
    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
      />
    );

    expect(screen.getByTestId('save-page')).toBeInTheDocument();
    expect(screen.getByText('Save Page')).toBeInTheDocument();
  });

  it('calls onSave with sections when Save is clicked', async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();
    const sections: SectionData[] = [
      { type: 'hero', data: { title: 'Hello' } },
    ];

    renderWithProvider(
      <PageEditor
        sections={sections}
        allowedSections={['hero', 'content']}
        onSave={handleSave}
      />
    );

    await user.click(screen.getByTestId('save-page'));

    expect(handleSave).toHaveBeenCalledWith([
      { type: 'hero', data: { title: 'Hello' } },
    ]);
  });

  it('applies custom className', () => {
    renderWithProvider(
      <PageEditor
        sections={[]}
        allowedSections={['hero', 'content']}
        onSave={() => {}}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('page-editor')).toHaveClass('custom-class');
  });
});
