import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";import { ShipmentStatusPicker } from "@/components/shipment-status-picker";  
import { describe, expect, it } from "vitest";

import { ShipmentStatus } from "@/lib/types";

describe("ShipmentStatusPicker", () => {
  const firstStatus = Object.values(ShipmentStatus)[0];
  const secondStatus = Object.values(ShipmentStatus)[1];

  it("renders with the correct initial value", () => {
    render(
      <ShipmentStatusPicker 
        value={firstStatus} 
        onChange={() => {}} 
      />
    );

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveValue(firstStatus);
  });

  it("calls onChange when a new status is selected", async () => {
    const mockOnChange = vi.fn(); 
    
    render(
      <ShipmentStatusPicker 
        value={firstStatus} 
        onChange={mockOnChange} 
      />
    );

    const selectElement = screen.getByRole("combobox");
    
    await userEvent.selectOptions(selectElement, secondStatus);

    expect(mockOnChange).toHaveBeenCalledWith(secondStatus);
  });

  it("disables the dropdown when the disabled prop is true", () => {
    render(
      <ShipmentStatusPicker 
        value={firstStatus} 
        onChange={() => {}} 
        disabled={true}
      />
    );

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeDisabled();
  });
});