import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { RegisterForm } from "@/components/register-form"; 
import { describe, expect, it } from "vitest";

const mockRegister = vi.fn();

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

describe("RegisterForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form inputs correctly", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument(); 
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create account/i })).toBeInTheDocument();
  });

  it("shows an error if passwords do not match", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/^Password/), "password123");
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), "different456");

    await userEvent.click(screen.getByRole("button", { name: /Create account/i }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("shows an error if the password is too short", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/^Password/), "12345"); // Only 5 chars
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), "12345");

    await userEvent.click(screen.getByRole("button", { name: /Create account/i }));

    expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("calls the register function when all data is valid", async () => {
    mockRegister.mockResolvedValueOnce({});

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/^Password/), "securepass123");
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), "securepass123");

    await userEvent.click(screen.getByRole("button", { name: /Create account/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      email: "test@example.com",
      username: "testuser",
      password: "securepass123",
      role: "ROLE_ADMIN",
    });
  });

  it("toggles password visibility when the eye icon is clicked", async () => {
    render(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText(/^Password/);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByText("Show password");
    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});