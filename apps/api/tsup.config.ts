import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src'],
    outDir: './dist',
    format: ['esm', 'cjs'],
    target: 'node20',
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false,
    shims: false,
    noExternal: ['saas/auth', 'saas/env']
})