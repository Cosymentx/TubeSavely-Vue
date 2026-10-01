#!/usr/bin/env sh
set -eu

pnpm install --frozen-lockfile
pnpm exec vue-tsc --noEmit
pnpm exec vite build
