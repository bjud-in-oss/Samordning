import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { StreamQuoteCard } from "../StreamQuoteCard";

describe("StreamQuoteCard", () => {
  it("renders quote text and scripture reference correctly", () => {
    render(<StreamQuoteCard />);
    expect(
      screen.getByText("”När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.”")
    ).toBeInTheDocument();
    expect(screen.getByText("Mosiah 2:17")).toBeInTheDocument();
  });
});
