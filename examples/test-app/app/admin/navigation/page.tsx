"use client";

import { NavigationEditor, Skeleton, useApiClient } from "@structcms/admin";
import type { NavigationItem } from "@structcms/core";
import * as React from "react";

interface NavigationData {
  id: string;
  name: string;
  items: NavigationItem[];
}

export default function NavigationPage() {
  const apiClient = useApiClient();

  const [navigation, setNavigation] = React.useState<NavigationData | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response =
          await apiClient.get<NavigationData>("/navigation/main");
        if (response.data) {
          setNavigation(response.data);
        }
      } catch (err) {
        setError("Failed to load navigation");
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
      console.error("Failed to update navigation:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-64 w-full" shape="rect" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto flex-1 flex flex-col">
        <p className="text-[14px] text-[var(--admin-error-700)]">{error}</p>
      </div>
    );
  }

  if (!navigation) {
    return (
      <div className="max-w-[1100px] mx-auto flex-1 flex flex-col">
        <p className="text-[14px] text-[var(--admin-gray-600)]">
          No navigation found. Create one via the seed endpoint.
        </p>
      </div>
    );
  }

  return (
    <NavigationEditor
      items={navigation.items}
      onSave={handleSave}
      saving={saving}
    />
  );
}
