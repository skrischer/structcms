import { createRegistry, defineSection, fields } from '@structcms/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminProvider } from '../../../context/admin-context';
import { SectionEditor } from '../section-editor';

const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string().min(1, 'Title is required'),
    subtitle: fields.text(),
  },
});

const registry = createRegistry({
  sections: [HeroSection],
});

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      {ui}
    </AdminProvider>
  );
}

describe('SectionEditor', () => {
  it('renders form for a known section type', () => {
    renderWithProvider(<SectionEditor sectionType="hero" onChange={() => {}} />);

    expect(screen.getByTestId('section-editor')).toBeInTheDocument();
    expect(screen.getByText('hero')).toBeInTheDocument();
  });

  it('renders form fields from section schema', () => {
    renderWithProvider(<SectionEditor sectionType="hero" onChange={() => {}} />);

    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subtitle/)).toBeInTheDocument();
  });

  it('shows error for unknown section type', () => {
    renderWithProvider(<SectionEditor sectionType="nonexistent" onChange={() => {}} />);

    expect(screen.getByTestId('section-editor-error')).toBeInTheDocument();
    expect(screen.getByText(/Unknown section type/)).toBeInTheDocument();
    expect(screen.getByText('nonexistent')).toBeInTheDocument();
  });

  it('populates form with provided data', () => {
    renderWithProvider(
      <SectionEditor
        sectionType="hero"
        data={{ title: 'Hello', subtitle: 'World' }}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/Title/)).toHaveValue('Hello');
  });

  it('calls onChange automatically on field change', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(
      <SectionEditor
        sectionType="hero"
        data={{ title: '', subtitle: '' }}
        onChange={handleChange}
      />
    );

    await user.type(screen.getByLabelText(/Title/), 'New Title');

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Title' }));
    });
  });

  it('hides submit button when onChange auto-syncs', () => {
    renderWithProvider(<SectionEditor sectionType="hero" onChange={() => {}} />);

    expect(screen.queryByTestId('form-submit')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithProvider(
      <SectionEditor sectionType="hero" onChange={() => {}} className="custom-class" />
    );

    expect(screen.getByTestId('section-editor')).toHaveClass('custom-class');
  });
});
