# YNAB Budget Lab

A modern React frontend for advanced YNAB (You Need A Budget) category management with smart filtering and scenario planning capabilities.

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- YNAB Personal Access Token (for real data integration)

## Installation

```bash
git clone https://github.com/your-org/ynab-budget-lab.git
cd ynab-budget-lab
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_YNAB_API_KEY=
```

- Leave blank to use demo mode (mock data).
- Enter your YNAB Personal Access Token to connect to your real budget.

## Running in Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Running Tests

```bash
npm test
```

- Runs all unit and component tests.
- Coverage reports are generated in the `coverage/` directory.

## Building for Production

```bash
npm run build
```

- Output files are generated in the `dist/` directory.

## Troubleshooting

- **API Key Issues**: Ensure your `VITE_YNAB_API_KEY` is correct and active.
- **Dependency Errors**: Run `npm install` to resolve missing packages.
- **TypeScript/ESLint Errors**: Run `npm run lint` and `npm run typecheck` for diagnostics.
- **Port Conflicts**: Change the dev server port in `vite.config.ts` if needed.

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

## Category Naming Convention

Categories should use the format: `Frequency:Priority:Fixed/Variable`.

**Format Breakdown:**

- `Frequency`: How often the expense occurs (e.g., Monthly, Weekly, Annual)
- `Priority`: Importance level (e.g., High, Medium, Low)
- `Fixed/Variable`: Type of expense

**Examples:**

- `Monthly:High:Fixed`
- `Annual:Low:Variable`
- `Weekly:Medium:Fixed`

**Tips:**

- Use consistent spelling and capitalization for easier filtering.
- If a category name is malformed or missing segments, update it to match the convention for best results.
- The app will attempt to parse partial names, but full format is recommended.

## Technical Stack

- **React 18**: Modern hooks-based architecture
- **TypeScript**: Type-safe codebase
- **Vite**: Fast build and dev server
- **BaseUI**: Consistent, accessible components
- **Jest**: Unit and component testing
- **ESLint**: Code linting and style enforcement
