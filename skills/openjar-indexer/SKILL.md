---
name: openjar-indexer
description: Query the local Maven/Gradle artifact index from the terminal. Use when you see an import but cannot find the class definition in the workspace (it likely comes from a compiled internal library), when you need to read the actual implementation of an internal or non-well-known library, or when you need to find which artifact contains a class, discover implementations of an interface, or inspect proto/resource files inside JARs. Do not use for well-known standard libraries (java.util, Spring core, etc.) that the AI already knows.
---

# Maven Indexer

Use `openjar-cli` to search and inspect Java classes, artifacts, and resources from your local Maven/Gradle cache.

## When to activate

**Use this skill when:**
- You see an import (e.g. `com.company.util.Helper`) but cannot find the definition in the workspace — it likely comes from a compiled internal library
- You need to read the actual implementation of an internal or non-well-known library ("Don't guess what the internal library does — read the code")
- You need to find which artifact contains a given class
- You need method signatures, Javadocs, or full source code of a dependency class
- You need to find implementations of an interface or subclasses of a base class (e.g. SPI implementations)
- You need to locate proto files or other resources embedded in JARs

**Skip when:**
- The class is from the standard Java library (`java.util`, `java.io`, etc.) or a well-known public library the AI already knows well
- The source is already present in the current workspace

## Check index first

If the index might be empty or stale, build it first:

```bash
# Quick scan — one best version per artifact (fast, recommended)
openjar-cli refresh

# Full scan — all versions of all artifacts
openjar-cli refresh --full
```

## Commands

### `class` — Find which artifact contains a class

Essential when you see an import but cannot find the definition. Do not assume the source is local just because the code compiles.

```bash
openjar-cli class <className>
# Examples:
openjar-cli class StringUtils
openjar-cli class com.company.util.Helper
openjar-cli class JsonToXml          # keyword search also works
```

### `detail` — Read the actual implementation

Use instead of guessing. Prefers source JARs, falls back to decompilation.

```bash
# Method signatures (default)
openjar-cli detail <className>

# Javadocs + method signatures
openjar-cli detail <className> --type docs

# Full source code
openjar-cli detail <className> --type source

# From a specific artifact version
openjar-cli detail <className> --coordinate groupId:artifactId:version
```

### `artifact` — Find artifacts by coordinate or keyword

```bash
openjar-cli artifact <query>
# Examples:
openjar-cli artifact guava
openjar-cli artifact com.google.guava
```

### `impl` — Find SPI implementations and subclasses

Particularly useful for finding implementations of SPIs or base classes within internal company libraries.

```bash
openjar-cli impl <className>
# Examples:
openjar-cli impl java.util.List
openjar-cli impl com.example.spi.Handler
```

### `resource` — Find proto files and other JAR resources

```bash
openjar-cli resource <pattern>
# Examples:
openjar-cli resource .proto
openjar-cli resource log4j.xml
```

## Output

All commands support `--json` for structured output:

```bash
openjar-cli class ImmutableList --json
openjar-cli detail com.google.common.collect.ImmutableList --json
```

> If `openjar-cli` is not found, install it: `npm install -g openjar-cli`
