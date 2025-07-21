import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "../molecules/ErrorBoundary";

class ProblemChild extends React.Component {
  render() {
    throw new Error("Test error");
    return null;
  }
}

describe("ErrorBoundary", () => {
  it("renders fallback UI on error", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Safe Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe Child")).toBeInTheDocument();
  });
});
