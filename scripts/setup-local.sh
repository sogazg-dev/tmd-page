#!/usr/bin/env bash
# Prepara el proyecto para correrlo en local (macOS / Linux).
# Uso:  bash scripts/setup-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Revisando Node.js"
if ! command -v node >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "    Node.js no está instalado; instalándolo con Homebrew..."
    brew install node@20
    brew link --overwrite --force node@20
  else
    echo "    Node.js no está instalado."
    echo "    Descárgalo (versión LTS) de https://nodejs.org y vuelve a correr este script."
    exit 1
  fi
fi
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "    Tienes Node $(node -v). Se necesita Node 18 o más nuevo (recomendado 20 LTS)."
  exit 1
fi
echo "    Node $(node -v), npm $(npm -v)"

echo "==> Revisando permisos de la caché de npm"
NPM_CACHE="$(npm config get cache 2>/dev/null || echo "$HOME/.npm")"
if [ -d "$NPM_CACHE" ] && [ -n "$(find "$NPM_CACHE" ! -user "$(id -u)" -print -quit 2>/dev/null)" ]; then
  echo "    Hay archivos en $NPM_CACHE que no son de tu usuario (probablemente por un 'sudo npm')."
  echo "    Arréglalo con este comando y vuelve a correr el script:"
  echo "        sudo chown -R \$(id -u):\$(id -g) \"$NPM_CACHE\""
  exit 1
fi

echo "==> Instalando dependencias (npm ci)"
npm ci --no-audit --no-fund

echo "==> Revisando .env.local"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "    Se creó .env.local a partir de .env.example"
fi
if ! grep -qE '^REACT_APP_YOUTUBE_API_KEY=.+' .env.local; then
  printf "    Pega tu API key de YouTube (Enter para hacerlo después): "
  read -r KEY || KEY=""
  if [ -n "$KEY" ]; then
    # Reemplaza la línea de la key sin depender de la versión de sed.
    grep -v '^REACT_APP_YOUTUBE_API_KEY=' .env.local > .env.local.tmp || true
    printf 'REACT_APP_YOUTUBE_API_KEY=%s\n' "$KEY" | cat - .env.local.tmp > .env.local
    rm -f .env.local.tmp
    echo "    API key guardada en .env.local"
  else
    echo "    Sin API key: la página abrirá, pero las listas de videos mostrarán un error."
  fi
fi

echo
echo "Listo. Para abrir la página en http://localhost:3000 corre:"
echo "    npm start"
