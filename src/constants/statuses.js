export const STATUSES = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
};

export const STATUS_LABELS = {
  [STATUSES.AVAILABLE]: 'Available',
  [STATUSES.RESERVED]: 'Reserved',
  [STATUSES.PICKED_UP]: 'Picked Up',
  [STATUSES.DELIVERED]: 'Delivered',
  [STATUSES.EXPIRED]: 'Expired',
  [STATUSES.CANCELLED]: 'Cancelled',
};

export const STATUS_COLORS = {
  [STATUSES.AVAILABLE]: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50',
  [STATUSES.RESERVED]: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50',
  [STATUSES.PICKED_UP]: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  [STATUSES.DELIVERED]: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50',
  [STATUSES.EXPIRED]: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50',
  [STATUSES.CANCELLED]: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50',
};
