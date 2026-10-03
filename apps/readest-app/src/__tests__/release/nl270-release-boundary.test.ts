import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../../../../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('NL-270 release boundary', () => {
  it('does not ship the upstream updater or release endpoints', () => {
    const packageJson = read('apps/readest-app/package.json');
    const cargoToml = read('apps/readest-app/src-tauri/Cargo.toml');
    const cargoLock = read('Cargo.lock');
    const tauriConfig = read('apps/readest-app/src-tauri/tauri.conf.json');
    const tauriHost = read('apps/readest-app/src-tauri/src/lib.rs');
    const updaterPackage = ['tauri', 'plugin', 'updater'].join('-');
    const releaseHost = ['download', 'readest', 'com'].join('.');

    expect(packageJson).not.toContain(`@tauri-apps/${updaterPackage}`);
    expect(cargoToml).not.toContain(updaterPackage);
    expect(cargoLock).not.toContain(updaterPackage);
    expect(tauriConfig).not.toContain(releaseHost);
    expect(tauriHost).toContain('.dbus_id("com.readest.nl270".to_owned())');
    expect(tauriHost).not.toContain('.dbus_id("com.bilingify.readest".to_owned())');
    expect(existsSync(resolve(root, 'apps/readest-app/src/app/updater/page.tsx'))).toBe(false);
    expect(existsSync(resolve(root, 'apps/readest-app/src/components/UpdaterWindow.tsx'))).toBe(
      false,
    );
    expect(
      existsSync(resolve(root, 'apps/readest-app/scripts/nightly-verify-harness/serve.mjs')),
    ).toBe(false);
  });

  it('keeps updater artifacts disabled', () => {
    const tauriConfig = JSON.parse(read('apps/readest-app/src-tauri/tauri.conf.json')) as {
      bundle: { createUpdaterArtifacts?: boolean };
      plugins: Record<string, unknown>;
    };

    expect(tauriConfig.bundle.createUpdaterArtifacts).toBe(false);
    expect(tauriConfig.plugins).not.toHaveProperty('updater');
  });
});
