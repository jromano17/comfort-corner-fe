import { ShipmentStatus } from "@/lib/types"; 

interface ShipmentStatusPickerProps {
  value: string;
  onChange: (newStatus: string) => void;
  disabled?: boolean;
}

export function ShipmentStatusPicker({ value, onChange, disabled }: ShipmentStatusPickerProps) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="border border-input bg-background px-3 py-1 rounded-md text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
    >
      {Object.values(ShipmentStatus).map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}