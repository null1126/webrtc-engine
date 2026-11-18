---
title: Version Management
description: WebRTC Engine version history and release notes.
---

# Version Management

This page summarizes historical releases and the evolution path of WebRTC Engine.

> The latest version is listed first. Click a version to view detailed changes, migration notes, and compatibility impact.

## Evolution Overview

- **1.x stage**: Established the project foundation with core playback and publishing capabilities.
- **2.0 stage**: Refactored the plugin architecture and introduced reconnection for stronger production stability.
- **2.1 stage**: Expanded plugin extensibility limits, added key hooks/events, and fixed reconnection edge-case behavior.
- **2.2 stage**: Focused on production stability — fixed multiple edge-case crashes (ICE null, signaling failure, React resource leaks), added a new `failed` state and ErrorBoundary.

## Version History (Latest → Oldest)

- [v2.2.0 (latest)](/en/versions/v2.2.0)
- [v2.1.0](/en/versions/v2.1.0)
- [v2.0.0](/en/versions/v2.0.0)
- [v1.2.0](/en/versions/v1.2.0)
- [v1.0.0](/en/versions/v1.0.0)

## Reading Suggestions

- New users: start from `v2.2.0` to understand currently recommended capabilities.
- Existing users upgrading from older versions: check migration and compatibility notes first.
