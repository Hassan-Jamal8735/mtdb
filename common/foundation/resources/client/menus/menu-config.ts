import type {IconTree} from '@ui/icons/create-svg-icon';

export interface MenuConfig {
  id: string;
  name: string;
  positions: string[];
  items: MenuItemConfig[];
}

export interface MenuItemConfig {
  id: string;
  type: 'route' | 'link';
  order: number;
  label: string;
  action: string;
  target?: '_blank' | '_self';
  roles?: number[];
  permissions?: string[];
  settings?: Record<string, any>;
  subscriptionStatus?: 'subscribed' | 'unsubscribed';
  icon?: IconTree[] | null;
}

export const secondaryMenu: MenuItemConfig[] = [
  {
    id: 'features',
    type: 'route',
    order: 1,
    label: 'Feataures',
    action: '/features',
  },
  {
    id: 'docs',
    type: 'route',
    order: 2,
    label: 'Docs',
    action: '/docs',
  },
  {
    id: 'support',
    type: 'route',
    order: 3,
    label: 'Support',
    action: '/support',
  },
];
