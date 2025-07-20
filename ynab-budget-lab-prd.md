# YNAB Budget Lab - PRD

## Problem

YNAB treats category names as single strings, preventing users with structured naming like `Frequency:Priority:Fixed/Variable` from filtering or sorting by individual segments. Additionally, users lack efficient ways to copy amounts for spreadsheet analysis and can't interactively experiment with budget scenarios to see real-time impact on total expenses.

## Solution

Custom frontend using YNAB API that parses category segments for advanced filtering, sorting, and budget experimentation.

## Core Features

### 1. Segment-Based Filtering & Sorting

- Parse `Frequency:Priority:Fixed/Variable` format
- Individual dropdown filters for each segment
- Sort by any segment or amount
- Handle malformed categories gracefully

### 2. Spreadsheet Copy

- Multi-select category rows
- Copy amounts as formula: `=10 + 20 + 30`
- One-click copy for Google Sheets/Excel

### 3. Budget Scenario Planning

- Toggle categories on/off
- Adjust variable amounts (non-destructive)
- Real-time total calculation
- Reset to original values

### 4. Basic Data Views

- Sortable category table
- Transaction paging
- Responsive design

## Technical Requirements

- **Auth**: YNAB Personal Access Token
- **API**: YNAB API v1 with rate limit handling
- **Frontend**: Typescript + React + Base UI
- **Requests**: Fetch API
- **Performance**: <3s load, <500ms filtering
- **Data**: Session-only caching (no browser storage)

## Success Criteria

- Filter/sort by category segments
- Copy formula works in spreadsheets
- Budget toggles update totals instantly
- Handles 200+ categories smoothly

## MVP Scope

**In**: Filtering, sorting, copy function, budget toggles
**Out**: Multi-budget support, data persistence, advanced analytics, mobile app

## Timeline

2-3 weeks for MVP delivery
