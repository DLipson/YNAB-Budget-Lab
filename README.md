# YNAB Budget Lab

A modern React frontend for advanced YNAB (You Need A Budget) category management with smart filtering and scenario planning capabilities.

## Features

### Core Functionality

- **Smart Filtering**: Filter categories by frequency, priority, and type segments
- **Scenario Planning**: Toggle scenario mode to modify budgets and see real-time impact
- **Batch Operations**: Select multiple categories and copy Excel formulas
- **Advanced Sorting**: Sort by any column with visual indicators

### UI/UX

- **Modern Design**: Glassmorphic UI with gradient backgrounds and backdrop blur
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Interactive Components**: Smooth animations and hover effects
- **Dark Theme**: Eye-friendly dark interface with vibrant accents

## Quick Start

1. **Demo Mode**: Leave API token blank to try with mock data
2. **YNAB Integration**: Enter your Personal Access Token to connect real data

## Environment Setup

Create a `.env.local` file in the project root with the following content:

```env
VITE_YNAB_API_KEY=
```

This key is required for authenticating requests to the YNAB API. Enter your Personal Access Token after the `=` sign.

## Usage

### Basic Operations

- **Select Categories**: Use checkboxes to select multiple categories
- **Apply Filters**: Use dropdown filters to narrow down categories
- **Sort Data**: Click column headers to sort ascending/descending

### Scenario Planning

1. Toggle "Scenario Mode" in the Budget Controls panel
2. Enable/disable categories using the eye icon
3. Modify budget amounts directly in the table
4. View real-time budget impact and differences
5. Reset to original values when done

### Formula Generation

- Select categories you want to sum
- Click "Copy Formula" to generate Excel-compatible formula
- Paste directly into spreadsheets

## Technical Stack

- **React 18**: Modern hooks-based architecture
- **MUI Base**: Unstyled component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Clean, consistent icons

## Environment Setup

To enable YNAB API access, create a `.env.local` file in the project root with the following content:

```
VITE_YNAB_API_KEY=your_ynab_api_key_here
```

- This API key is required for connecting to the YNAB API.
- The `.env.local` file is ignored by git and should not be committed.

## Component Architecture

- **Atoms**: Basic UI components (Button, Input, Select, etc.)
- **Molecules**: Composite components (FilterBar, BudgetControls, etc.)
- **Organisms**: Complex components (CategoryTable)
- **Pages**: Full page components (YnabCustomFrontend)

## Mock Data Structure

Categories include:

- Basic info: `id`, `name`, `budgeted`
- Segments: `frequency`, `priority`, `type`
- Scenario state: `enabled`, `currentBudgeted`, `originalBudgeted`

## Future Enhancements

- Real YNAB API integration
- Data persistence
- Export capabilities
- Advanced reporting
- Custom category segments
