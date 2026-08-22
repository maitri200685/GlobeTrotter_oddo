export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeColor?: string;
  isExternal?: boolean;
}

export interface TripTabItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  highlight?: boolean;
}
