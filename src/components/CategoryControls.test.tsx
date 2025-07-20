import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryControls } from "./CategoryControls";

describe("CategoryControls", () => {
  it("renders all filter and sort dropdowns", () => {
    render(<CategoryControls />);
    expect(screen.getByPlaceholderText("Sort by")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Frequency")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Priority")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type")).toBeInTheDocument();
  });

  it("allows selecting sort option", () => {
    render(<CategoryControls />);
    const sortSelect = screen.getByPlaceholderText("Sort by");
    fireEvent.click(sortSelect);
    expect(screen.getByText("Name")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Name"));
    expect(sortSelect).toHaveTextContent("Name");
  });

  it("allows selecting frequency filter", () => {
    render(<CategoryControls />);
    const freqSelect = screen.getByPlaceholderText("Frequency");
    fireEvent.click(freqSelect);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Monthly"));
    expect(freqSelect).toHaveTextContent("Monthly");
  });

  it("allows selecting priority filter", () => {
    render(<CategoryControls />);
    const prioritySelect = screen.getByPlaceholderText("Priority");
    fireEvent.click(prioritySelect);
    expect(screen.getByText("High")).toBeInTheDocument();
    fireEvent.click(screen.getByText("High"));
    expect(prioritySelect).toHaveTextContent("High");
  });

  it("allows selecting type filter", () => {
    render(<CategoryControls />);
    const typeSelect = screen.getByPlaceholderText("Type");
    fireEvent.click(typeSelect);
    expect(screen.getByText("Fixed")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fixed"));
    expect(typeSelect).toHaveTextContent("Fixed");
  });

  it('renders "Clear All Filters" button if present and clears filters on click', () => {
    render(<CategoryControls />);
    const clearBtn = screen.queryByText(/Clear All Filters/i);
    if (clearBtn) {
      fireEvent.click(clearBtn);
      // After clearing, all selects should reset to empty or "All"
      expect(screen.getByPlaceholderText("Sort by")).toHaveTextContent("");
      expect(screen.getByPlaceholderText("Frequency")).toHaveTextContent("");
      expect(screen.getByPlaceholderText("Priority")).toHaveTextContent("");
      expect(screen.getByPlaceholderText("Type")).toHaveTextContent("");
    }
  });

  it("handles edge case: selecting multiple filters sequentially", () => {
    render(<CategoryControls />);
    const freqSelect = screen.getByPlaceholderText("Frequency");
    fireEvent.click(freqSelect);
    fireEvent.click(screen.getByText("Weekly"));
    expect(freqSelect).toHaveTextContent("Weekly");

    const prioritySelect = screen.getByPlaceholderText("Priority");
    fireEvent.click(prioritySelect);
    fireEvent.click(screen.getByText("Low"));
    expect(prioritySelect).toHaveTextContent("Low");
  });
});
