# openjar-cli

[![npm version](https://img.shields.io/npm/v/openjar-cli.svg?style=flat)](https://www.npmjs.com/package/openjar-cli)

A command-line tool for querying your local Maven/Gradle artifact index directly from the terminal — no MCP client required.

**Key Use Case**: When AI tools in the terminal (claude, gemini-cli, copilot-cli, codex, etc.) need to look up Java classes, method signatures, or source code from your local dependencies, they can call `openjar-cli` directly instead of requiring an MCP server.

## Installation

```bash
# Install the CLI
npm install -g openjar-cli

# Install the skill
npx skills add tainn03/openjar-cli -g
```

The skill guides AI tools to call `openjar-cli` when they need to look up Java classes, artifacts, or source code from your local Maven/Gradle dependencies.

## Quick Start

```bash
# Build the index first (quick scan — one version per artifact)
openjar-cli refresh

# Search for a class
openjar-cli class StringUtils

# Get method signatures
openjar-cli detail com.google.common.collect.ImmutableList
```

## Commands

### `class <query>`

Search for Java classes by name or keyword.

```bash
openjar-cli class StringUtils
openjar-cli class com.google.common.collect.ImmutableList --limit 10
openjar-cli class guava --json
```

Options:
- `--limit <n>` — maximum number of results
- `--json` — output as JSON

### `artifact <query>`

Search for artifacts by groupId, artifactId, or keyword.

```bash
openjar-cli artifact guava
openjar-cli artifact com.google.guava --limit 5
```

### `impl <className>`

Find all implementations of an interface or subclasses of a base class.

```bash
openjar-cli impl java.util.List
openjar-cli impl org.springframework.context.ApplicationListener
```

### `resource <pattern>`

Search for non-class resources (proto files, XML configs, etc.) inside JARs.

```bash
openjar-cli resource .proto
openjar-cli resource log4j.xml
```

### `detail <className>`

Retrieve method signatures, Javadocs, or full source code for a class.

```bash
# Signatures (default)
openjar-cli detail com.google.common.collect.ImmutableList

# Javadocs
openjar-cli detail com.google.common.collect.ImmutableList --type docs

# Full source
openjar-cli detail com.google.common.collect.ImmutableList --type source

# From a specific artifact
openjar-cli detail com.google.common.collect.ImmutableList --coordinate com.google.guava:guava:32.1.2-jre
```

Options:
- `--type <signatures|docs|source>` — detail level (default: `signatures`)
- `--coordinate <groupId:artifactId:version>` — resolve from a specific artifact

### `refresh`

Rebuild the artifact index.

```bash
# Quick scan (default) — one best version per artifact, fast
openjar-cli refresh

# Full scan — all versions of all artifacts
openjar-cli refresh --full
```

> **Note**: Query commands never trigger automatic indexing. If the index is empty they exit immediately with a message telling you to run `refresh`. This keeps query latency predictable.

## Configuration

The CLI uses `~/.openjar-cli/openjar-cli-index.sqlite` by default. The database uses WAL mode for safe concurrent access.

Override the database path with the `DB_FILE` environment variable:

```bash
DB_FILE=/custom/path/openjar-cli-index.sqlite openjar-cli class Foo
```

Other environment variables:

| Variable | Description | Default |
|---|---|---|
| `MAVEN_REPO` | Path to local Maven repository | `~/.m2/repository` |
| `GRADLE_REPO_PATH` | Path to Gradle cache | `~/.gradle/caches/modules-2/files-2.1` |
| `INCLUDED_PACKAGES` | Comma-separated package patterns to index | `*` (all) |
| `MAVEN_INDEXER_CFR_PATH` | Path to CFR decompiler JAR | bundled |
| `VERSION_RESOLUTION_STRATEGY` | `semver`, `latest-published`, or `latest-used` | `semver` |

## Smart Class Resolution

When you pass an unqualified class name (e.g., `MyService` instead of `com.example.MyService`), the CLI will:

1. Search your current project directory for `*.java` / `*.kt` files matching that name
2. Extract the package declaration to construct the fully qualified name
3. Trigger a targeted scan of artifacts matching that package prefix
4. Return the result as if you had provided the full name

This works best when run from your project root.

## Development

```bash
git clone git@github.com:tainn03/openjar-cli.git
cd openjar-cli
npm install
npm run build
npm test
```

### Release

```bash
./scripts/release.sh
```

### Publish

```bash
./scripts/publish.sh [npm|github|all]
```

## License

[ISC](LICENSE)
