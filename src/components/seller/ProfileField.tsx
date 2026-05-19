import { Component } from "react";

interface ProfileFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export class ProfileField extends Component<ProfileFieldProps> {
  render() {
    const {
      id,
      label,
      name,
      value,
      type = "text",
      placeholder,
      disabled,
      onChange,
    } = this.props;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className="text-gray-700 font-semibold text-sm md:text-base"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-gray-50/80 border border-transparent rounded-2xl px-5 py-4 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm font-medium"
        />
      </div>
    );
  }
}
