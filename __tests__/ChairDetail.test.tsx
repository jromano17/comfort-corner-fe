import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import useSWR from "swr";
import { ChairDetail } from "@/components/chair-detail";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { describe, expect, it } from "vitest";

vi.mock("swr");
vi.mock("@/lib/auth-context", () => ({ useAuth: vi.fn() }));
vi.mock("@/lib/cart-context", () => ({ useCart: vi.fn() }));

const mockChair = {
  id: 1,
  name: "The Comfy Throne",
  description: "A very nice chair to sit on.",
  basePrice: 200,
  category: { name: "Ergonomic" },
  galleryImageUrls: ["/test1.jpg"],
};

const mockVariants = [
  {
    id: 101,
    finalPrice: 250,
    image: "/variant1.jpg",
    material: { name: "Leather", description: "Premium leather" },
    colorOption: { name: "Black" },
    dimension: { name: "Standard", width: 50, depth: 50, height: 100, weightCapacity: 120 },
  },
];

describe("ChairDetail Component", () => {
  const mockAddItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useCart).mockReturnValue({ addItem: mockAddItem } as any);
  });

  it("shows a loading spinner when data is fetching", () => {
    vi.mocked(useSWR).mockReturnValue({ data: undefined, error: undefined, isLoading: true } as any);
    
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    const { container } = render(<ChairDetail chairId={1} />);
    
    expect(container.querySelector(".text-primary")).toBeInTheDocument(); 
  });

  it("shows an error message if the API fails", () => {
    vi.mocked(useSWR).mockReturnValue({ data: null, error: new Error("Network Error"), isLoading: false } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(<ChairDetail chairId={1} />);
    
    expect(screen.getByText("Failed to load chair details")).toBeInTheDocument();
  });

  it("renders chair details and asks unauthenticated users to sign in", () => {
    vi.mocked(useSWR).mockImplementation((key: any) => {
      if (key.includes("variants")) return { data: mockVariants, isLoading: false, error: null } as any;
      return { data: mockChair, isLoading: false, error: null } as any;
    });

    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(<ChairDetail chairId={1} />);

    expect(screen.getByText("The Comfy Throne")).toBeInTheDocument();
    expect(screen.getByText("Ergonomic")).toBeInTheDocument();
    expect(screen.getByText("$250")).toBeInTheDocument(); // The final price of the selected variant

    expect(screen.getByText("Sign in to Order")).toBeInTheDocument();
    expect(screen.getByText("You need to be logged in to add items to your cart")).toBeInTheDocument();
  });

  it("allows authenticated users to add the item to their cart", async () => {
    vi.mocked(useSWR).mockImplementation((key: any) => {
      if (key.includes("variants")) return { data: mockVariants, isLoading: false, error: null } as any;
      return { data: mockChair, isLoading: false, error: null } as any;
    });

    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    render(<ChairDetail chairId={1} />);

    const addToCartButton = screen.getByRole("button", { name: /Add to Cart/i });
    expect(addToCartButton).toBeInTheDocument();
    
    await userEvent.click(addToCartButton);

    expect(mockAddItem).toHaveBeenCalledWith(mockVariants[0], "The Comfy Throne");
    
    expect(screen.getByText(/Added to Cart/i)).toBeInTheDocument();
  });
});