# YNAB Budget Lab - Implementation Plan

## Overview

This implementation plan follows KISS (Keep It Simple, Stupid), YAGNI (You Aren't Gonna Need It), SRP (Single Responsibility Principle), and atomic design methodology. Build the base program first, then iterate with features. All code should follow conventions and best practices, avoid code smells, and be super readable—like reading a simple book. No comments unless absolutely necessary; code should be self-documenting.

## Testing Stack

- **Unit Testing**: Vitest (built into Vite)
- **Component Testing**: React Testing Library + Vitest
- **E2E Testing**: Playwright (add later when needed)
- **Mocking**: MSW (Mock Service Worker) for API calls

## Prerequisites

- Node.js 18+
- YNAB Personal Access Token for testing
- Vite + React + TypeScript template

---

## Phase 1: Project Setup & Authentication

### Step 1: Create Basic App Shell

**Goal**: Establish main app structure and routing foundation

**Actions**:

1. Create `src/components/` directory structure: `atoms/`, `molecules/`, `organisms/`, `templates/`
2. Create basic `App.tsx` with header and main content area
3. Add CSS reset and basic responsive grid layout
4. Create `src/types/` directory for TypeScript definitions
5. Create `src/hooks/` directory for custom hooks
6. Remove default React assets and clean up boilerplate

**Best Practices**:

- Keep components small and focused (SRP)
- Use clear, conventional naming
- Avoid unnecessary abstraction or complexity (KISS, YAGNI)
- Code should be self-documenting; no comments unless absolutely necessary

**Test**:

- Visual verification: App displays header and content area
- Responsive test: Resize browser window, layout adapts correctly
- TypeScript: No compilation errors

### Step 2: Environment Configuration

**Goal**: Set up environment variables and configuration management

**Actions**:

1. Create `.env.local` file with `VITE_YNAB_API_KEY=` placeholder
2. Create `src/config/index.ts` to manage environment variables
3. Add `.env.local` to `.gitignore`
4. Create `src/config/api.ts` with YNAB API base URL and headers setup
5. Document environment setup in README

**Best Practices**:

- Use environment variables for secrets
- Keep configuration simple and readable

**Test**:

- Verify environment variables load correctly in development
- Test that missing API key shows appropriate error message
- Build process should not expose API key in bundle

### Step 3: YNAB API Integration Foundation

**Goal**: Create base API service with error handling and rate limiting

**Actions**:

1. Create `src/services/ynab-api.ts` with base fetch wrapper
2. Implement rate limiting (YNAB allows 200 requests per hour)
3. Add error handling for network failures and API errors
4. Create TypeScript interfaces for YNAB API responses in `src/types/ynab.ts`
5. Add request/response logging for development

**Best Practices**:

- Each function does one thing (SRP)
- Handle errors simply and clearly
- Avoid over-engineering (YAGNI)

**Test**:

- Unit test: API service handles successful responses
- Unit test: API service handles 4xx/5xx errors gracefully
- Unit test: Rate limiting prevents excessive requests
- Integration test: Successful API call with valid token

### Step 4: Authentication Flow

**Goal**: Implement API key input and validation

**Actions**:

1. Create `src/components/atoms/Input.tsx` - reusable input component
2. Create `src/components/atoms/Button.tsx` - reusable button component
3. Create `src/components/molecules/ApiKeyInput.tsx` - API key input form
4. Create `src/hooks/useAuth.ts` - authentication state management
5. Add API key validation by testing `/user` endpoint
6. Store authentication state in memory only

**Best Practices**:

- UI components should be minimal and intuitive
- State management should be simple and explicit

**Test**:

- Component test: ApiKeyInput accepts input and triggers validation
- Component test: Loading state displays during validation
- Component test: Error message shows for invalid API key
- Integration test: Valid API key successfully authenticates
- Test: Refresh page clears authentication (no persistence)

---

## Phase 2: Data Fetching & Core Components

### Step 5: Budget Data Fetching

**Goal**: Fetch and display basic budget information

**Actions**:

1. Extend YNAB API service to fetch budgets list
2. Create `src/hooks/useBudgets.ts` for budget data management
3. Create `src/components/molecules/BudgetSelector.tsx` if multiple budgets exist
4. Implement loading states and error handling
5. Add basic budget metadata display

**Best Practices**:

- Fetch logic should be isolated in hooks/services
- Display logic should be separated from data logic

**Test**:

- Unit test: useBudgets hook handles loading states
- Unit test: useBudgets hook handles errors
- Component test: BudgetSelector displays available budgets
- Integration test: Successful budget fetch with real API
- Test: Error boundary catches and displays budget fetch errors

### Step 6: Categories Data Structure

**Goal**: Fetch categories and establish data parsing foundation

**Actions**:

1. Add categories endpoint to YNAB API service
2. Create `src/types/category.ts` with category interfaces
3. Create `src/hooks/useCategories.ts` for category data management
4. Create basic category list display component
5. Add category loading and error states

**Best Practices**:

- Types/interfaces should be clear and minimal
- Parsing logic should be simple and robust

**Test**:

- Unit test: Categories fetch returns expected data structure
- Unit test: Empty categories array handled correctly
- Component test: Category list displays category names
- Integration test: Categories fetch with real budget ID
- Test: Categories update when budget changes

### Step 7: Category Name Parsing

**Goal**: Parse structured category names into segments

**Actions**:

1. Create `src/utils/categoryParser.ts` with parsing functions
2. Implement parsing for `Frequency:Priority:Fixed/Variable` format
3. Handle malformed category names gracefully (return original name)
4. Add parsed segments to category data structure
5. Create unit tests for various category name formats

**Best Practices**:

- Parsing functions should be pure and readable
- Handle edge cases gracefully

**Test**:

- Unit test: Correctly parses `Monthly:High:Fixed` format
- Unit test: Handles missing segments (e.g., `Monthly:High`)
- Unit test: Returns original name for unparseable formats
- Unit test: Handles edge cases (empty strings, special characters)
- Test: Parsed data integrates correctly with category display

### Step 8: Basic Category Table

**Goal**: Display categories in a sortable table

**Actions**:

1. Create `src/components/atoms/Table.tsx` - reusable table components
2. Create `src/components/molecules/CategoryRow.tsx` - individual category row
3. Create `src/components/organisms/CategoryTable.tsx` - full category table
4. Implement basic column headers: Name, Amount, Segments
5. Add table responsiveness for mobile

**Best Practices**:

- Table components should be simple and composable
- Use clear props and avoid unnecessary complexity

**Test**:

- Component test: CategoryTable renders with category data
- Component test: CategoryRow displays category information correctly
- Visual test: Table is responsive on mobile screens
- Test: Empty state displays when no categories
- Accessibility test: Table has proper ARIA labels

---

## Phase 3: Filtering & Sorting Foundation

### Step 9: Sorting Implementation

**Goal**: Enable sorting by different category attributes

**Actions**:

1. Create `src/hooks/useSorting.ts` for sort state management
2. Add sort functionality for: Name, Amount, Frequency, Priority, Type
3. Implement ascending/descending toggle
4. Add sort indicators to table headers
5. Integrate sorting with CategoryTable component

**Best Practices**:

- Sorting logic should be isolated and simple
- UI should clearly indicate sort state

**Test**:

- Unit test: Sorting works correctly for each attribute
- Unit test: Toggle between ascending/descending
- Unit test: Sorting handles undefined/null values
- Component test: Sort indicators update correctly
- User test: Clicking headers changes sort order

### Step 10: Basic Filtering Interface

**Goal**: Create filter controls for category segments

**Actions**:

1. Create `src/components/atoms/Select.tsx` - reusable dropdown component
2. Create `src/components/molecules/FilterControls.tsx` - filter interface
3. Create `src/hooks/useFilters.ts` for filter state management

**Best Practices**:

- Filter logic should be minimal and explicit
- UI controls should be intuitive and conventional
- Avoid unnecessary props or configuration

**Test**:

- Component test: FilterControls renders all dropdowns
- Component test: Dropdowns populate with unique values
- Unit test: Filter state updates correctly
- Component test: "All" option clears individual filters
- Test: Filter options update when categories change

### Step 11: Filter Application

**Goal**: Apply filters to category display

**Actions**:

1. Create `src/utils/categoryFilter.ts` with filtering logic
2. Implement multi-filter combination (AND logic)
3. Connect filtering to CategoryTable display
4. Add filtered results count display
5. Handle empty filter results gracefully

**Best Practices**:

- Filtering logic should be pure and easy to follow
- Handle empty and edge cases simply

**Test**:

- Unit test: Single filter works correctly
- Unit test: Multiple filters combine properly (AND logic)
- Unit test: Filter handles edge cases (no matches, empty data)
- Component test: CategoryTable updates when filters change
- User test: Filtering produces expected results

---

## Phase 4: Performance & Polish

### Step 12: Performance Optimization

**Goal**: Ensure smooth performance with large category lists

**Actions**:

1. Implement React.memo for CategoryRow components
2. Add useMemo for expensive filtering/sorting operations
3. Implement virtual scrolling if needed (for 500+ categories)
4. Add loading skeletons for better perceived performance
5. Optimize re-renders with useCallback

**Best Practices**:

- Optimize only when necessary (YAGNI)
- Use memoization for expensive operations
- Avoid premature optimization

**Test**:

- Performance test: Smooth operation with 200+ categories
- Performance test: Filtering completes within 500ms
- Memory test: No memory leaks during filter/sort operations
- User test: Loading states provide good feedback
- DevTools test: Minimal unnecessary re-renders

### Step 13: Error Handling & Edge Cases

**Goal**: Robust error handling throughout the application

**Actions**:

1. Create `src/components/molecules/ErrorBoundary.tsx`
2. Add error states for API failures
3. Handle network connectivity issues
4. Add user-friendly error messages
5. Implement retry mechanisms for failed requests

**Best Practices**:

- Error handling should be clear and user-friendly
- Avoid complex error flows

**Test**:

- Test: API errors display appropriate messages
- Test: Network failures handled gracefully
- Test: Error boundary catches component errors
- Test: Retry mechanism works for transient failures
- User test: Error states are clear and actionable

### Step 14: Final Integration & Documentation

**Goal**: Complete base program with documentation

**Actions**:

1. Create comprehensive README with setup instructions
2. Add inline code documentation
3. Create sample .env file
4. Add basic user guide for category naming conventions
5. Final testing across different browsers

**Best Practices**:

- Documentation should be concise and clear
- Inline code documentation only when absolutely necessary

**Test**:

- Documentation test: New developer can set up project from README
- Browser test: Works in Chrome, Firefox, Safari
- User test: Complete user flow from API key to filtered categories
- Code review: TypeScript strict mode passes
- Final test: All unit/component tests pass

---

## Success Criteria for Base Program

**Core Functionality Working**:

- ✅ User can authenticate with YNAB API key
- ✅ Categories load and display in table format
- ✅ Category names parse into segments correctly
- ✅ Sorting works for all category attributes
- ✅ Filtering works for all category segments
- ✅ Performance is smooth with 200+ categories
- ✅ Error handling prevents crashes

**Technical Quality**:

- ✅ TypeScript strict mode enabled
- ✅ 90%+ test coverage for utilities and hooks
- ✅ No console errors in production build
- ✅ Responsive design works on mobile/desktop
- ✅ Accessibility basics implemented

**Documentation & Maintenance**:

- ✅ Clear README for setup and usage
- ✅ Code is documented for future developers
- ✅ Architecture supports future feature additions

---

## Notes for Developers

1. **Start Simple**: Build the MVP first, resist adding features early (KISS, YAGNI)
2. **Test First**: Write tests before implementation where possible
3. **Mock Early**: Use MSW to mock YNAB API responses for consistent testing
4. **Atomic Components**: Build reusable atoms before complex organisms
5. **Performance Mindset**: Consider performance implications from the start, but avoid premature optimization
6. **Error Handling**: Plan for network failures and API changes
7. **Future-Ready**: Structure code to support upcoming features (copy, budget scenarios)
8. **SRP**: Each module/component/function should do one thing only
9. **Conventions & Best Practices**: Use clear naming, avoid code smells, and keep code super readable
10. **Self-Documenting Code**: No comments unless absolutely necessary; code should be easy to read and understand

This base program provides the foundation for all advanced features while maintaining code quality and performance standards.
