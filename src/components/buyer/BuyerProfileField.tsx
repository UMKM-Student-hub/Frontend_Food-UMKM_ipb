import { Component, ChangeEvent } from "react";

interface BuyerProfileFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  disabled: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export class BuyerProfileField extends Component<BuyerProfileFieldProps> {
  render() {
    const {
      label,
      name,
      value,
      type = "text",
      disabled,
      onChange,
    } = this.props;

    return (
      <div>
        <label className="block text-white font-semibold text-lg md:text-xl mb-2">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={disabled}
          className={`w-full rounded-xl px-4 py-3.5 text-gray-800 font-medium outline-none transition-all ${
            disabled
              ? "bg-white opacity-95 cursor-default"
              : "bg-yellow-50 border-4 border-[#FFB20E] focus:ring-4 focus:ring-[#FFB20E]/50"
          }`}
        />
      </div>
    );
  }
}
