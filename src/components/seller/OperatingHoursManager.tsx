import { Component } from "react";
import type { OperatingHours, DaySchedule } from "../../domain/UMKM";
import { DEFAULT_OPERATING_HOURS } from "../../domain/UMKM";

const DAY_LABELS: Record<keyof OperatingHours, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

const DAYS = Object.keys(DAY_LABELS) as (keyof OperatingHours)[];

interface Props {
  isOpen: boolean;
  operatingHours: OperatingHours | null;
  isSaving: boolean;
  onSave: (hours: OperatingHours) => void;
}

interface State {
  draft: OperatingHours;
  isEditing: boolean;
}

export class OperatingHoursManager extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      draft: props.operatingHours ?? DEFAULT_OPERATING_HOURS,
      isEditing: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.operatingHours !== this.props.operatingHours &&
      !this.state.isEditing
    ) {
      this.setState({
        draft: this.props.operatingHours ?? DEFAULT_OPERATING_HOURS,
      });
    }
  }

  private handleToggleDay = (day: keyof OperatingHours) => {
    this.setState((prev) => ({
      draft: {
        ...prev.draft,
        [day]: {
          ...prev.draft[day],
          is_active: !prev.draft[day].is_active,
        },
      },
    }));
  };

  private handleTimeChange = (
    day: keyof OperatingHours,
    field: "open" | "close",
    value: string,
  ) => {
    this.setState((prev) => ({
      draft: {
        ...prev.draft,
        [day]: { ...prev.draft[day], [field]: value },
      },
    }));
  };

  private handleSave = () => {
    this.props.onSave(this.state.draft);
    this.setState({ isEditing: false });
  };

  private handleCancel = () => {
    this.setState({
      draft: this.props.operatingHours ?? DEFAULT_OPERATING_HOURS,
      isEditing: false,
    });
  };

  render() {
    const { isOpen, isSaving } = this.props;
    const { draft, isEditing } = this.state;

    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full flex flex-col transition-all hover:shadow-md">
        <div className="bg-[#1B2B65] p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-blue-200 uppercase tracking-widest mb-1">
              Status Operasional
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? "bg-green-400" : "bg-red-400"}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? "bg-green-500" : "bg-red-500"}`}
                ></span>
              </span>
              <span className="text-xl font-black text-white tracking-wide">
                {isOpen ? "BUKA" : "TUTUP"}
              </span>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => this.setState({ isEditing: true })}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold px-4 py-2 rounded-xl transition-colors focus:outline-none"
            >
              Atur Jadwal
            </button>
          )}
        </div>

        <div className="p-5">
          {!isEditing ? (
            <div className="flex flex-col gap-3">
              {DAYS.map((day) => {
                const s: DaySchedule = draft[day];
                return (
                  <div
                    key={day}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <span
                      className={`font-bold text-sm ${s.is_active ? "text-[#1B2B65]" : "text-gray-400"}`}
                    >
                      {DAY_LABELS[day]}
                    </span>
                    {s.is_active && s.open && s.close ? (
                      <span className="bg-blue-50 text-[#1B2B65] font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-100">
                        {s.open} - {s.close}
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 font-bold text-xs px-3 py-1.5 rounded-lg">
                        Libur
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {DAYS.map((day) => {
                const s: DaySchedule = draft[day];
                return (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        onClick={() => this.handleToggleDay(day)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${s.is_active ? "bg-[#FFB20E]" : "bg-gray-300"}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${s.is_active ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                      <span
                        className={`text-sm font-bold w-16 ${s.is_active ? "text-[#1B2B65]" : "text-gray-400"}`}
                      >
                        {DAY_LABELS[day]}
                      </span>
                    </div>

                    {s.is_active ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={s.open ?? ""}
                          onChange={(e) =>
                            this.handleTimeChange(day, "open", e.target.value)
                          }
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#1B2B65] focus:outline-none focus:ring-2 focus:ring-[#FFB20E] focus:border-transparent bg-white w-24 text-center"
                        />
                        <span className="text-gray-400 text-sm font-bold">
                          -
                        </span>
                        <input
                          type="time"
                          value={s.close ?? ""}
                          onChange={(e) =>
                            this.handleTimeChange(day, "close", e.target.value)
                          }
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#1B2B65] focus:outline-none focus:ring-2 focus:ring-[#FFB20E] focus:border-transparent bg-white w-24 text-center"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-400 italic px-4">
                        Toko Tutup
                      </span>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={this.handleCancel}
                  disabled={isSaving}
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors focus:outline-none"
                >
                  Batal
                </button>
                <button
                  onClick={this.handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-[#FFB20E] text-[#1B2B65] font-black py-3 rounded-xl hover:bg-[#F0A500] shadow-sm shadow-yellow-500/30 disabled:opacity-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#1B2B65] border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Jadwal"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
