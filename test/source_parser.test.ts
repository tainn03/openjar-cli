import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';

const { openMock } = vi.hoisted(() => ({
  openMock: vi.fn(),
}));

vi.mock('yauzl', () => ({
  default: {
    open: openMock,
  },
}));

describe('SourceParser source extraction', () => {
  beforeEach(() => {
    vi.resetModules();
    openMock.mockReset();
  });

  it('reads full source when entry path is prefixed and class is an inner class', async () => {
    const zipfile = new EventEmitter() as any;
    let emitted = false;

    zipfile.readEntry = () => {
      if (emitted) {
        process.nextTick(() => zipfile.emit('end'));
        return;
      }
      emitted = true;
      process.nextTick(() => {
        zipfile.emit('entry', { fileName: 'src/main/java/com/example/MyService.java' });
      });
    };

    zipfile.openReadStream = (_entry: any, cb: (err: Error | null, stream: EventEmitter | null) => void) => {
      const stream = new EventEmitter();
      cb(null, stream);
      process.nextTick(() => {
        stream.emit('data', Buffer.from('package com.example;\npublic class MyService {\n  class Nested {}\n}\n'));
        stream.emit('end');
      });
    };

    openMock.mockImplementation((_jarPath: string, _opts: any, cb: (err: Error | null, zipfile: any) => void) => {
      cb(null, zipfile);
    });

    const { SourceParser } = await import('../src/core/source_parser.js');
    const result = await SourceParser.getClassDetail('/tmp/fake.jar', 'com.example.MyService$Nested', 'source');

    expect(result).not.toBeNull();
    expect(result?.language).toBe('java');
    expect(result?.source).toContain('public class MyService');
    expect(result?.source).toContain('class Nested');
  });
});
