import { Link } from 'react-router';
import clsx from 'clsx';
import { IconButton } from '@ui/buttons/icon-button';
import { Menu, MenuTrigger, MenuItem } from '@ui/menu/menu-trigger';
import { MenuIcon } from '@ui/icons/material/Menu';
import { useIsMobileMediaQuery } from '@ui/utils/hooks/is-mobile-media-query';
import { Trans } from '@ui/i18n/trans';
import { useSettings } from '@ui/settings/use-settings';
import { AdminSettings } from '@common/admin/settings/admin-settings';

interface Props {
  className?: string;
}

interface SecondaryNavbarItem {
  label: string;
  action: string;
}

export function SecondaryNavbar({ className }: Props) {
  const isMobile = useIsMobileMediaQuery();

  // Settings might come from admin (with client property)
  // or from frontend (without client)
  const rawSettings = useSettings() as Partial<AdminSettings> | any;
  const clientSettings = rawSettings?.client ?? rawSettings;

  const secondaryMenu: SecondaryNavbarItem[] =
    clientSettings?.secondaryNavbar ?? [];

  if (isMobile) {
    // Mobile view: dropdown
    return (
      <nav
        className={clsx(
          'bg-gray-900 text-white shadow-md flex justify-end items-center px-4 py-3',
          className
        )}
      >
        <MenuTrigger>
          <IconButton aria-label="Open menu" className="text-white">
            <MenuIcon />
          </IconButton>

          {/* ✅ Menu doesn’t accept className directly, so wrap it */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-2">
            <Menu>
              {secondaryMenu.map((menuItem) => (
                <MenuItem
                  key={menuItem.label + menuItem.action}
                  value={menuItem.action}
                  onSelected={() => (window.location.href = menuItem.action)}
                >
                  <div className="px-4 py-2 hover:bg-gray-700 hover:text-yellow-400 rounded-md transition-colors">
                    <Trans message={menuItem.label} />
                  </div>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </MenuTrigger>
      </nav>
    );
  }

  // Desktop view: inline links
  return (
    <nav
      className="text-white shadow-md flex justify-center items-center container mx-auto @container md:p-6"
      style={{ backgroundColor: '#29292e' }}
    >
      {secondaryMenu.map((menuItem) => (
        <Link
          key={menuItem.label + menuItem.action}
          to={menuItem.action}
          className="px-4 py-2 rounded-md hover:bg-gray-800 hover:text-yellow-400 transition-colors font-medium"
        >
          <Trans message={menuItem.label} />
        </Link>
      ))}
    </nav>
  );
}
