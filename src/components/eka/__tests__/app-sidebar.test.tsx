import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { UnifiedDataProvider } from '@/context/unified-data-context';

function renderWithProvider() {
  return render(
    <UnifiedDataProvider>
      <AppSidebar />
    </UnifiedDataProvider>
  );
}

describe('AppSidebar role sections', () => {
  beforeEach(() => {
    localStorage.removeItem('eka_persona');
  });

  it('shows ADMIN section for Admin persona', () => {
    localStorage.setItem('eka_persona', 'Admin');
    renderWithProvider();
    expect(screen.getByText(/ADMIN/i)).toBeTruthy();
  });

  it('shows THERAPIST section for Therapist persona', () => {
    localStorage.setItem('eka_persona', 'Therapist');
    renderWithProvider();
    expect(screen.getByText(/THERAPIST/i)).toBeTruthy();
  });

  it('shows CLIENT section for Patient persona', () => {
    localStorage.setItem('eka_persona', 'Patient');
    renderWithProvider();
    expect(screen.getByText(/CLIENT/i)).toBeTruthy();
  });
});
