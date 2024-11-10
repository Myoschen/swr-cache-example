CORE_DIR := "core"
WEB_DIR := "web"

default:
  @just --list

dev-core:
  @cd {{ CORE_DIR }} && bun i && bun run dev

dev-web:
  @cd {{ WEB_DIR }} && bun i && bun run dev