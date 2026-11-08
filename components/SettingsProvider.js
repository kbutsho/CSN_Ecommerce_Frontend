'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

const defaults = {
  site_name: 'Marketly',
  hero_title: 'Discover products from local shops',
  hero_subtitle: 'Pick a shop, browse what it sells and see its own prices.',
  currency: '৳',
  contact_email: 'hello@example.com',
  contact_phone: '+880 1700 000000',
  contact_address: 'Dhaka, Bangladesh',
};

const SettingsContext = createContext({ settings: defaults, setSettings: () => { } });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    api('/settings').then((data) => setSettings({ ...defaults, ...data })).catch(() => { });
  }, []);

  useEffect(() => {
    document.title = settings.site_name;
  }, [settings.site_name]);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
