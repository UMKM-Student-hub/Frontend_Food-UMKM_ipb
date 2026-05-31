import { Component } from "react";
import type { FormEvent } from "react";
import type { UMKMSchedule, DaySchedule } from "../../domain/UMKM";
import { umkmService } from "../../services/UMKMService";

interface StoreScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: UMKMSchedule | undefined;
  onSuccess: () => void;
}

interface StoreScheduleModalState {
  schedule: UMKMSchedule;
  isSubmitting: boolean;
  error: string | null;
}

const DEFAULT_DAY: DaySchedule = {
  is_closed: false,
  open: "08:00",
  close: "17:00",
};

const DEFAULT_SCHEDULE: UMKMSchedule = {
  monday: { ...DEFAULT_DAY },
  tuesday: { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday: { ...DEFAULT_DAY },
  friday: { ...DEFAULT_DAY },
  saturday: { ...DEFAULT_DAY, is_closed: true },
  sunday: { ...DEFAULT_DAY, is_closed: true },
};

const DAYS_MAP = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
];

export class StoreScheduleModal extends Component<
  StoreScheduleModalProps,
  StoreScheduleModalState
> {
  constructor(props: StoreScheduleModalProps) {
    super(props);
    this.state = {
      schedule: props.schedule || JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
      isSubmitting: false,
      error: null,
    };
  }

  componentDidUpdate(prevProps: StoreScheduleModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({
        schedule:
          this.props.schedule || JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
        error: null,
      });
    }
  }

  handleDayToggle = (day: string) => {
    this.setState((prevState) => ({
      schedule: {
        ...prevState.schedule,
        [day]: {
          ...prevState.schedule[day],
          is_closed: !prevState.schedule[day].is_closed,
        },
      },
    }));
  };

  handleTimeChange = (day: string, field: "open" | "close", value: string) => {
    this.setState((prevState) => ({
      schedule: {
        ...prevState.schedule,
        [day]: {
          ...prevState.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, error: null });

    try {
      await umkmService.updateSchedule({
        operating_hours: this.state.schedule,
      });
      this.props.onSuccess();
    } catch (err: any) {
      this.setState({ error: err.message || "Gagal menyimpan jadwal." });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  renderDayRow = (dayKey: string, label: string) => {
    const dayData = this.state.schedule[dayKey];
    return (
      <div
        key={dayKey}
        className="flex items-center justify-between py-2 border-b"
      >
        <label className="flex items-center space-x-3 w-1/3">
          <input
            type="checkbox"
            checked={!dayData.is_closed}
            onChange={() => this.handleDayToggle(dayKey)}
            className="w-4 h-4 text-[#1B2B65] border-gray-300 rounded focus:ring-[#1B2B65]"
          />
          <span className="font-semibold">{label}</span>
        </label>

        {!dayData.is_closed ? (
          <div className="flex items-center space-x-2 w-2/3">
            <input
              type="time"
              value={dayData.open}
              onChange={(e) =>
                this.handleTimeChange(dayKey, "open", e.target.value)
              }
              className="border p-1 rounded rounded-md flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#1B2B65]"
              required
            />
            <span className="text-gray-500">-</span>
            <input
              type="time"
              value={dayData.close}
              onChange={(e) =>
                this.handleTimeChange(dayKey, "close", e.target.value)
              }
              className="border p-1 rounded rounded-md flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#1B2B65]"
              required
            />
          </div>
        ) : (
          <div className="w-2/3 flex items-center justify-center">
            <span className="text-red-500 font-bold text-sm bg-red-100 px-3 py-1 rounded-full">
              Tutup
            </span>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { isSubmitting, error } = this.state;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center bg-[#1B2B65] text-white">
            <h2 className="text-xl font-bold tracking-tight">
              Atur Jadwal Kantin
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 font-bold text-2xl transition"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={this.handleSubmit}
            className="p-6 overflow-y-auto flex-1"
          >
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col mb-4">
              {DAYS_MAP.map((d) => this.renderDayRow(d.key, d.label))}
            </div>

            <p className="text-xs text-gray-500 mb-6 italic">
              * Toko akan otomatis buka dan tutup sesuai jadwal yang diatur di
              atas. Pastikan zona waktu yang berlaku adalah Waktu Indonesia
              Barat (WIB).
            </p>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#1B2B65] hover:bg-blue-800 rounded-xl disabled:opacity-50 transition"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
