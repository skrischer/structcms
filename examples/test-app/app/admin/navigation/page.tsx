'use client';

import { Button, NavigationEditor, Skeleton, useApiClient } from '@structcms/admin';
import type { NavigationItem } from '@structcms/core';
import * as React from 'react';

interface NavigationData {
  id: string;
  name: string;
  items: NavigationItem[];
}

export default function NavigationPage() {
  const apiClient = useApiClient();

  const [navigation, setNavigation] = React.useState<NavigationData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await apiClient.get<NavigationData>('/navigation/main');
        if (response.data) {
          setNavigation(response.data);
        }
      } catch (err) {
        setError('Failed to load navigation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNavigation();
  }, [apiClient]);

  const handleSave = async (items: NavigationItem[]) => {
    if (!navigation) return;

    setSaving(true);
    try {
      await apiClient.put(`/navigation/id/${navigation.id}`, {
        items,
      });
      setNavigation({ ...navigation, items });
    } catch (err) {
      console.error('Failed to update navigation:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!navigation) {
    return (
      <div className="text-gray-600">No navigation found. Create one via the seed endpoint.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Navigation: {navigation.name}</h1>
        <Button onClick={() => handleSave(navigation.items)} disabled={saving}>
          {saving ? 'Saving...' : 'Save Navigation'}
        </Button>
      </div>

      <NavigationEditor items={navigation.items} onSave={handleSave} />
    </div>
  );
}
