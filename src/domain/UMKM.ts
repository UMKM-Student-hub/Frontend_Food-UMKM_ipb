export interface DaySchedule {
  is_active: boolean;
  open?: string;
  close?: string;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface UMKM {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  location: string;
  is_open: boolean;
  operating_hours: OperatingHours | null;
  created_at: string;
}

export interface UMKMCreateRequest {
  name: string;
  description: string;
  location: string;
}

export const DEFAULT_OPERATING_HOURS: OperatingHours = {
  monday: { is_active: false },
  tuesday: { is_active: false },
  wednesday: { is_active: false },
  thursday: { is_active: false },
  friday: { is_active: false },
  saturday: { is_active: false },
  sunday: { is_active: false },
};
