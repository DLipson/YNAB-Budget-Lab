# YNAB Budget Lab - PRD

## Problem

YNAB treats category group names as single strings, preventing users with structured naming like `Frequency:Priority:Fixed/Variable` from filtering or sorting by individual segments. Additionally, users lack efficient ways to copy transaction amounts for spreadsheet analysis and can't interactively experiment with budget scenarios to see real-time impact on total expenses.

## Solution

Custom frontend using YNAB API that parses category group segments for advanced filtering, sorting, and budget experimentation.

## Core Features

### 1. Segment-Based Filtering & Sorting

- Parse `Frequency:Priority:Fixed/Variable` format
- Individual dropdown filters for each segment
- Sort by any segment or amount
- Handle malformed categories gracefully

### 2. Spreadsheet Copy

- Multi-select category group rows
- Copy amounts as formula: `=10 + 20 + 30`
- One-click copy for Google Sheets/Excel

### 3. Budget Scenario Planning

- Toggle category groups on/off
- Adjust variable amounts for each category in a group that is for variable amounts (non-destructive)
- Real-time total calculation
- Reset to original values

### 4. Basic Data Views

- Sortable category group table
- View categories under each group
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

- Filter/sort by category group segments
- Copy formula works in spreadsheets
- Budget toggles update totals instantly
- Handles 20+ category groups and 200+ categories smoothly

## MVP Scope

**In**: Filtering, sorting, copy function, budget toggles
**Out**: Multi-budget support, data persistence, advanced analytics, mobile app
