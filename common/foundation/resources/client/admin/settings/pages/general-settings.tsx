import { useAdminSettings } from '../requests/use-admin-settings';
import { TextField } from '@ui/forms/input-field/text-field/text-field';
import { FormSelect, Option } from '@ui/forms/select/select';
import { FormSwitch } from '@ui/forms/toggle/switch';
import { Button } from '@ui/buttons/button';
import { ExternalLink } from '@ui/buttons/external-link';
import { Trans } from '@ui/i18n/trans';
import React, { Fragment, useContext } from 'react';
import { SiteConfigContext } from '@common/core/settings/site-config-context';
import { useSettings } from '@ui/settings/use-settings';
import { useValueLists } from '@common/http/value-lists';
import { useForm, useFormContext } from 'react-hook-form';
import { AdminSettingsWithFiles } from '@common/admin/settings/requests/use-update-admin-settings';
import { useGenerateSitemap } from '@common/admin/settings/requests/use-generate-sitemap';
import { useBootstrapDataStore } from '@ui/bootstrap-data/bootstrap-data-store';
import { AdminSettings } from '@common/admin/settings/admin-settings';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import { SettingsSeparator } from '@common/admin/settings/form/settings-separator';
import { LearnMoreLink } from '@common/admin/settings/form/learn-more-link';

export function GeneralSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="General" />}
      description={
        <Trans message="Configure site url, homepage, theme and other general settings." />
      }
    >
      {(data) => <Form data={data} />}
    </AdminSettingsLayout>
  );
}

interface FormProps {
  data: AdminSettings;
}

function Form({ data }: FormProps) {
 const form = useForm<AdminSettings>({
  defaultValues: {
    client: {
      homepage: {
        type: data.client.homepage?.type ?? 'landingPage',
        value: data.client.homepage?.value ?? '',
      },
      themes: {
        default_id: data.client.themes?.default_id ?? 0,
        user_change: data.client.themes?.user_change ?? false,
      },
      secondaryNavbar: data.client.secondaryNavbar ?? [],
    },
  },
    
  });
  console.log('Form Values:', form.getValues());

// console.log('isDirty:', form.formState.isDirty, form.watch());
  return (
    <AdminSettingsForm form={form}>
      <SiteUrlSection />
      <SettingsSeparator />
      <HomepageSection />
      <SettingsSeparator />
      <ThemeSection />
      <SettingsSeparator />
      <SecondaryNavbarSection />
      <SettingsSeparator />
      <SitemapSection />
    </AdminSettingsForm>
  );
}

function SiteUrlSection() {
  const { data } = useAdminSettings();
  if (!data) return null;

  const server = data.server;
  const isInvalid = server.newAppUrl && server.newAppUrl !== server.app_url;

  return (
    <>
      <TextField
        readOnly
        invalid={!!isInvalid}
        value={server.app_url}
        label={<Trans message="Primary site url" />}
        description={
          <LearnMoreLink link="https://support.vebto.com/hc/articles/35/primary-site-url" />
        }
      />
      {isInvalid && (
        <div className="mt-20 text-sm text-danger">
          <Trans
            values={{
              baseUrl: server.app_url,
              currentUrl: server.newAppUrl,
              b: (chunks) => <b>{chunks}</b>,
            }}
            message="Base site url is set as <b>:baseUrl</b> in configuration, but current url is <b>:currentUrl</b>. It is recommended to set the primary url you want to use in configuration file and then redirect all other url versions to this primary version via cpanel or .htaccess file."
          />
        </div>
      )}
    </>
  );
}

function HomepageSection() {
  const { watch } = useFormContext<AdminSettingsWithFiles>();
  const { homepage } = useContext(SiteConfigContext);
  const { data } = useValueLists(['menuItemCategories']);
  const selectedType = watch('client.homepage.type');

  return (
    <div>
      <FormSelect
        name="client.homepage.type"
        selectionMode="single"
        label={<Trans message="Site home page" />}
        description={<Trans message="Which page should be used as site homepage." />}
      >
        {homepage.options.map((option) => (
          <Option key={option.value} value={option.value}>
            <Trans {...option.label} />
          </Option>
        ))}
        {data?.menuItemCategories?.map((category) => (
          <Option key={category.type} value={category.type}>
            {category.name}
          </Option>
        ))}
      </FormSelect>

      {data?.menuItemCategories?.map((category) =>
        selectedType === category.type ? (
          <FormSelect
            className="mt-24"
            name="client.homepage.value"
            key={category.name}
            selectionMode="single"
            label={<Trans message="Homepage :name" values={{ name: category.name }} />}
          >
            {category.items.map((item) => (
              <Option key={item.label} value={`${item.model_id}`}>
                {item.label}
              </Option>
            ))}
          </FormSelect>
        ) : null
      )}
    </div>
  );
}

function ThemeSection() {
  // ✅ Fix: pass correct key array, not string
  const themes = useBootstrapDataStore((s) => s.data?.themes || []);

  return (
    <>
      <FormSelect
        className="mb-20"
        name="client.themes.default_id"
        selectionMode="single"
        label={<Trans message="Default site theme" />}
        description={
          <Trans message="Which theme to use for users that have not chosen a theme manually." />
        }
      >
        <Option value={0}>
          <Trans message="System" />
        </Option>
        {themes.map((theme) => (
          <Option key={theme.id} value={theme.id}>
            {theme.name}
          </Option>
        ))}
      </FormSelect>
      <FormSwitch
        name="client.themes.user_change"
        description={<Trans message="Allow users to manually change site theme." />}
      >
        <Trans message="Allow theme change" />
      </FormSwitch>
    </>
  );
}

function SecondaryNavbarSection() {
  const { watch, setValue } = useFormContext<AdminSettings>();
  const secondaryNavbar = watch('client.secondaryNavbar') || [];

  return (
    <div className="mt-24">
      <h3 className="text-lg font-medium mb-16">
        <Trans message="Secondary Navbar Items" />
      </h3>

      {secondaryNavbar.map((item: any, index: number) => (
        <div key={index} className="flex gap-10 mb-12 items-center">
          <TextField
  name={`client.secondaryNavbar.${index}.label`}
  label={<Trans message="Label" />}
  className="flex-1"
  value={item.label}
  onChange={(e) =>
    setValue(
      `client.secondaryNavbar.${index}.label`,
      e.target.value,
      { shouldDirty: true }
    )
  }
/>

<TextField
  name={`client.secondaryNavbar.${index}.action`}
  label={<Trans message="URL / Route" />}
  className="flex-1"
  value={item.action}
  onChange={(e) =>
    setValue(
      `client.secondaryNavbar.${index}.action`,
      e.target.value,
      { shouldDirty: true }
    )
  }
/>

          <Button
            type="button"
            variant="outline"
            size="xs"
            color="danger"
            onClick={() => {
              const newMenu = [...secondaryNavbar];
              newMenu.splice(index, 1);
              setValue('client.secondaryNavbar', newMenu, { shouldDirty: true });
            }}
          >
            <Trans message="Remove" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setValue(
            'client.secondaryNavbar',
            [...secondaryNavbar, { label: 'New Item', action: '/path' }],
            { shouldDirty: true }
          );
        }}
      >
        <Trans message="Add Item" />
      </Button>
    </div>
  );
}


function SitemapSection() {
  const generateSitemap = useGenerateSitemap();
  const { base_url } = useSettings(); // ✅ no arguments here
  const url = `${base_url}/storage/sitemaps/sitemap-index.xml`;
  const link = <ExternalLink href={url}>{url}</ExternalLink>;

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        color="primary"
        disabled={generateSitemap.isPending}
        onClick={() => generateSitemap.mutate()}
      >
        <Trans message="Generate sitemap" />
      </Button>
      <div className="mt-14 text-sm text-muted">
        <Trans
          message="Once generated, sitemap url will be: :url"
          values={{ url: link }}
        />
      </div>
    </>
  );
}
