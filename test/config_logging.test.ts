import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Config } from '../src/core/config.js';

describe('Config logging', () => {
  const originalVerbose = process.env.OPENJAR_CLI_VERBOSE;

  beforeEach(() => {
    Config.reset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalVerbose === undefined) {
      delete process.env.OPENJAR_CLI_VERBOSE;
    } else {
      process.env.OPENJAR_CLI_VERBOSE = originalVerbose;
    }
    Config.reset();
  });

  it('does not emit diagnostic setup logs by default', async () => {
    delete process.env.OPENJAR_CLI_VERBOSE;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await Config.getInstance();

    expect(
      errorSpy.mock.calls.some(([msg]) => String(msg).includes('Using local repository:'))
    ).toBe(false);
  });

  it('emits diagnostic setup logs when OPENJAR_CLI_VERBOSE=1', async () => {
    process.env.OPENJAR_CLI_VERBOSE = '1';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await Config.getInstance();

    expect(
      errorSpy.mock.calls.some(([msg]) => String(msg).includes('Using local repository:'))
    ).toBe(true);
  });
});
