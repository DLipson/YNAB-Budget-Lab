# Streamlined YNAB Budget Lab - Implementation Plan

## Overview

Maintaining KISS, YAGNI, SRP, and atomic design principles. Focus on MVP delivery with test-driven development and clean, readable code. Using BaseUI for consistent components.

**Completed Steps 1-5**: Project setup, authentication, environment config, YNAB API integration, and budget data fetching are complete.

---

## Phase 2: Core MVP Features (Streamlined)

### Step 6: Category Parsing & Display

**Goal**: Parse category names and display in simple table

**Actions**:
1. Create `src/utils/categoryParser.ts` - parse `Frequency:Priority:Fixed/Variable` format
2. Create `src/components/CategoryTable.tsx` using BaseUI Table components
3. Display: Category Name, Amount, Frequency, Priority, Type (parsed segments)
4. Add loading states and error handling

**Best Practices**:
- Single parser function that handles all parsing logic
- Graceful fallback for unparseable names
- Use BaseUI components directly, no custom wrappers needed

**Test**:
- Unit test: Parser handles valid formats correctly
- Unit test: Parser returns original name for invalid formats
- Component test: Table displays all category data
- Integration test: Real YNAB data parses and displays

### Step 7: Combined Filter & Sort

**Goal**: Single component handling both filtering and sorting

**Actions**:
1. Create `src/components/CategoryControls.tsx` with BaseUI Select components
2. Implement sort dropdown (Name, Amount, Frequency, Priority, Type)
3. Add filter dropdowns for each parsed segment
4. Create `src/hooks/useCategoryFilter.ts` - combines filtering and sorting logic
5. Add "Clear All Filters" button

**Best Practices**:
- One hook manages all table state (filtering + sorting)
- Use useMemo for expensive operations only
- Simple AND logic for multiple filters

**Test**:
- Unit test: Hook correctly filters and sorts data
- Component test: Controls update table display
- User test: All filter combinations work as expected

### Step 8: Error Boundaries & Polish

**Goal**: Production-ready error handling and UX

**Actions**:
1. Add React Error Boundary to main app
2. Create loading skeletons using BaseUI Skeleton
3. Add empty states for no categories/no filter results
4. Implement basic retry for failed API calls
5. Add responsive design for mobile

**Best Practices**:
- Use BaseUI components for consistent styling
- Simple, clear error messages
- Progressive enhancement for mobile

**Test**:
- Test: Error boundary catches component crashes
- Test: Loading states provide good UX
- Test: Mobile layout works on small screens
- Test: Retry mechanism works for API failures

---

## Phase 3: MVP Complete

### Step 9: Documentation & Deployment

**Goal**: Ship-ready application

**Actions**:
1. Update README with complete setup instructions
2. Add category naming convention guide
3. Create production build configuration
4. Add basic analytics/error tracking setup
5. Final cross-browser testing

**Test**:
- Test: New user can set up and run the application
- Test: Production build works correctly
- Test: All major browsers supported
- Final integration test with real YNAB account

---

## Simplified Success Criteria

**Core MVP Features**:
- ✅ User authenticates with YNAB API
- ✅ Categories display with parsed segments
- ✅ Filter by frequency, priority, type
- ✅ Sort by any column
- ✅ Mobile responsive
- ✅ Error handling prevents crashes

**Technical Quality**:
- ✅ TypeScript strict mode
- ✅ Test coverage for critical paths
- ✅ BaseUI components used consistently
- ✅ Clean, readable code structure

---

## Key Simplifications Made

1. **Combined Components**: Merged separate filter and sort components into single CategoryControls
2. **Removed Abstraction**: Use BaseUI components directly instead of creating wrapper atoms
3. **Single Hook**: One hook manages all table state instead of separate hooks
4. **Simplified Testing**: Focus on critical paths, not exhaustive coverage
5. **Removed Premature Optimization**: No virtual scrolling, minimal memoization until needed

## What This Preserves

- All quality standards (KISS, YAGNI, SRP)
- Test-driven development approach  
- Clean, readable code principles
- BaseUI integration
- TypeScript strict mode
- Responsive design
- Error handling

## Future Feature Foundation

This streamlined approach still supports future enhancements:
- Copy functionality can extend CategoryTable
- Budget scenarios can extend the filtering hook
- Advanced features can build on the parsing utilities

The simplified plan reduces complexity while maintaining all your core principles and delivering a functional MVP faster.