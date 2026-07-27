---
name: stitch-ui
description: Use Google Stitch MCP to generate, edit, manage, and extract rich UI components, screens, and design systems for web and mobile interfaces.
---

# Stitch UI Skill Instructions

## Overview
Stitch is an AI-powered UI design and generation tool. This skill provides standard workflows for creating, refining, and applying UI designs using the `StitchMCP` server tools.

## Available Stitch MCP Tools

| Tool Name | Description | Key Arguments |
|-----------|-------------|---------------|
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "create_project", ...)` | Creates a new Stitch UI project | `title` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "get_project", ...)` | Fetches details for a project | `projectId` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "list_projects", ...)` | Lists existing Stitch projects | N/A |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "generate_screen_from_text", ...)` | Generates a new screen from text prompt | `projectId`, `prompt`, `deviceType`, `designSystem` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "get_screen", ...)` | Retrieves screen details and code | `projectId`, `screenId` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "list_screens", ...)` | Lists screens in a project | `projectId` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "edit_screens", ...)` | Edits existing screens | `projectId`, `screenIds`, `prompt` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "generate_variants", ...)` | Generates design variations for a screen | `projectId`, `screenId`, `prompt` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "upload_design_md", ...)` | Uploads design markdown token spec | `projectId`, `designMdContent` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "create_design_system", ...)` | Creates a design system | `title`, `colorPalette`, `typography` |
| `call_mcp_tool(ServerName: "StitchMCP", ToolName: "apply_design_system", ...)` | Applies a design system to project | `projectId`, `designSystemId` |

## Standard UI Workflow with Stitch

1. **Initialize Project**:
   Call `create_project` to get a `projectId`.
2. **Define Design Tokens (Optional)**:
   Upload a `DESIGN.md` via `upload_design_md` or `create_design_system` to ensure consistent colors, fonts, and dark mode theme.
3. **Generate UI Screen**:
   Call `generate_screen_from_text` specifying `projectId`, `prompt`, and `deviceType` (`DESKTOP` or `MOBILE`).
4. **Refine / Edit UI**:
   Use `edit_screens` or `generate_variants` to iterate on visual layout, typography, or functionality based on user feedback.
5. **Fetch Component Code**:
   Use `get_screen` to inspect the generated UI HTML/CSS/JS and integrate into local projects.
