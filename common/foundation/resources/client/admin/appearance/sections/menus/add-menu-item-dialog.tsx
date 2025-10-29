import {useForm} from 'react-hook-form';
import {Accordion, AccordionItem} from '@ui/accordion/accordion';
import {Form} from '@ui/forms/form';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {FormSelect} from '@ui/forms/select/select';
import {AddIcon} from '@ui/icons/material/Add';
import {Button} from '@ui/buttons/button';
import {useAvailableRoutes} from '@common/admin/appearance/sections/menus/hooks/available-routes';
import {List, ListItem} from '@ui/list/list';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {Trans} from '@ui/i18n/trans';
import {useValueLists} from '@common/http/value-lists';
import {ReactNode} from 'react';
import {nanoid} from 'nanoid';
import {MenuItemConfig} from '@common/menus/menu-config';
import {ucFirst} from '@ui/utils/string/uc-first';
import {Option} from '@ui/forms/select/select';

interface AddMenuItemDialogProps {
  title?: ReactNode;
  menu?: { items: MenuItemConfig[] }; // pass full menu for parent selector
}

export function AddMenuItemDialog({
  title = <Trans message="Add menu item" />,
  menu,
}: AddMenuItemDialogProps) {
  const {data} = useValueLists(['menuItemCategories']);
  const categories = data?.menuItemCategories || [];
  const routeItems = useAvailableRoutes();

  return (
    <Dialog size="sm">
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <Accordion variant="outline">
          <AccordionItem
            label={<Trans message="Link" />}
            bodyClassName="max-h-240 overflow-y-auto"
          >
            <AddCustomLink menu={menu} />
          </AccordionItem>

          <AccordionItem
            label={<Trans message="Route" />}
            bodyClassName="max-h-240 overflow-y-auto"
          >
            <AddRoute menu={menu} items={routeItems} />
          </AccordionItem>

          {categories.map(category => (
            <AccordionItem
              key={category.name}
              label={<Trans message={category.name} />}
            >
              <AddRoute menu={menu} items={category.items} />
            </AccordionItem>
          ))}
        </Accordion>
      </DialogBody>
    </Dialog>
  );
}

interface AddCustomLinkProps {
  menu?: { items: MenuItemConfig[] };
}

function AddCustomLink({menu}: AddCustomLinkProps) {
  const form = useForm<MenuItemConfig & { parentId?: string }>({
    defaultValues: {
      id: nanoid(6),
      type: 'link',
      target: '_blank',
    },
  });
  const {close} = useDialogContext();

  const handleSubmit = (value: MenuItemConfig & { parentId?: string }) => {
    const newItem = {
      ...value,
      id: nanoid(6),
      children: [],
    };

    // If parent selected, nest under parent
    if (value.parentId && menu?.items) {
      const updated = menu.items.map(parent => {
        if (parent.id === value.parentId) {
          const children = parent.children ? [...parent.children, newItem] : [newItem];
          return {...parent, children};
        }
        return parent;
      });
      close(updated);
    } else {
      // top-level item
      close([...(menu?.items || []), newItem]);
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormTextField
        required
        name="label"
        label={<Trans message="Label" />}
        className="mb-20"
      />
      <FormTextField
        required
        type="url"
        name="action"
        placeholder="https://"
        label={<Trans message="Url" />}
        className="mb-20"
      />

      {menu?.items?.length ? (
        <FormSelect
          name="parentId"
          label={<Trans message="Parent item (optional)" />}
          className="mb-20"
        >
          <Option value="">— None —</Option>
          {menu.items.map(item => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </FormSelect>
      ) : null}

      <div className="text-right">
        <Button type="submit" variant="flat" color="primary" size="xs">
          <Trans message="Add to menu" />
        </Button>
      </div>
    </Form>
  );
}

interface AddRouteProps {
  items: Partial<MenuItemConfig>[];
  menu?: { items: MenuItemConfig[] };
}

function AddRoute({items, menu}: AddRouteProps) {
  const {close} = useDialogContext();

  const handleSelect = (item: Partial<MenuItemConfig>, parentId?: string) => {
    if (item.label) {
      const last = item.label.split('/').pop();
      item.label = last ? ucFirst(last) : item.label;
      item.id = nanoid(6);
    }
    if (!item.target) item.target = '_self';
    const newItem: MenuItemConfig = {
      ...(item as MenuItemConfig),
      children: [],
    };

    if (parentId && menu?.items) {
      const updated = menu.items.map(parent => {
        if (parent.id === parentId) {
          const children = parent.children ? [...parent.children, newItem] : [newItem];
          return {...parent, children};
        }
        return parent;
      });
      close(updated);
    } else {
      close([...(menu?.items || []), newItem]);
    }
  };

  return (
    <List>
      {items.map(item => (
        <ListItem
          key={item.id || item.label}
          startIcon={<AddIcon size="sm" />}
          onSelected={() => handleSelect(item)}
        >
          {item.label}
        </ListItem>
      ))}
    </List>
  );
}
