export type ColorVariant = 
  | 'primary'      // Terracotta
  | 'secondary'    // Sand / Slate
  | 'teal'         // Nature / Activity
  | 'amber'        // Hotel / Warning
  | 'sky'          // Transport / Info
  | 'success'      // Green / Budget Healthy
  | 'danger'       // Red / Budget Exceeded
  | 'ai';          // AI gradient / Rose gold

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'ai';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  travelStyle?: 'backpacker' | 'comfort' | 'luxury' | 'family';
  preferredCurrency?: 'INR' | 'USD' | 'EUR' | 'GBP';
  createdAt?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
