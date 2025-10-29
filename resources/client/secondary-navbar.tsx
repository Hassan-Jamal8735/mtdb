import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {SearchAutocomplete} from '@app/search/search-autocomplete';
import clsx from 'clsx';
import {IconButton} from '@ui/buttons/icon-button';
import {SearchIcon} from '@ui/icons/material/Search';
import {Link} from 'react-router';
import {Trans} from '@ui/i18n/trans';
import {Tooltip} from '@ui/tooltip/tooltip';

interface Props {
  className?: string;
}

export function SecondaryNavbar({className}: Props) {
  return (
    <nav
      className={clsx(
        'bg-gray-800 text-white flex justify-center space-x-8 py-2',
        className
      )}
    >
      <Link to="/section1" className="hover:text-yellow-400">
        Section 1
      </Link>
      <Link to="/section2" className="hover:text-yellow-400">
        Section 2
      </Link>
      <Link to="/section3" className="hover:text-yellow-400">
        Section 3
      </Link>
      <Link to="/section4" className="hover:text-yellow-400">
        Section 4
      </Link>
    </nav>
  );
}
