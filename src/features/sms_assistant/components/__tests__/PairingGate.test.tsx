// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PairingGate } from '../PairingGate';

describe('PairingGate Component', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders pairing instructions and live polling status', () => {
    const handleRefresh = vi.fn();
    render(<PairingGate token="test_token_123" onRefresh={handleRefresh} phoneNumber="0736108997" />);

    expect(screen.getByText(/Skanna för att logga in som administratör/i)).toBeInTheDocument();
    expect(screen.getByText(/Väntar på SMS från din administratörsmobil/i)).toBeInTheDocument();
  });

  it('triggers manual refresh when clicking the refresh button', () => {
    const handleRefresh = vi.fn();
    render(<PairingGate token="test_token_123" onRefresh={handleRefresh} phoneNumber="0736108997" />);

    const refreshButton = screen.getByRole('button', { name: /Kontrollera status nu/i });
    fireEvent.click(refreshButton);

    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
});
