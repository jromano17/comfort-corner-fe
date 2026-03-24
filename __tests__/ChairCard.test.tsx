import { render, screen } from "@testing-library/react";
import { ChairCard } from "@/components/chair-card"; 
import { describe, expect, it } from "vitest";

const mockChair = {
  id: "123",
  name: "Classic Wooden Chair",
  description: "A beautiful handcrafted dining chair.",
  basePrice: 150,
  category: { id: "c1", name: "Dining" },
  galleryImageUrls: ["/test-image.jpg"],
};

describe("ChairCard", () => {
  it("renders the chair details correctly", () => {
    render(<ChairCard chair={mockChair as any} />);

    expect(screen.getByText("Classic Wooden Chair")).toBeInTheDocument();
    expect(screen.getByText("Dining")).toBeInTheDocument();
    expect(screen.getByText("A beautiful handcrafted dining chair.")).toBeInTheDocument();
    
    expect(screen.getByText("From $150")).toBeInTheDocument();
  });

  it("uses the placeholder image when the gallery is empty", () => {
    const chairWithoutImages = { ...mockChair, galleryImageUrls: [] };
    
    render(<ChairCard chair={chairWithoutImages as any} />);
    
    const imageElement = screen.getByAltText("Classic Wooden Chair");
    
    expect(imageElement.getAttribute("src")).toContain("placeholder-chair.jpg");
  });
});