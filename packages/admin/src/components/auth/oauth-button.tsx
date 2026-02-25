import type React from 'react';
import { Button } from '../ui/button';

export interface OAuthButtonProps {
  provider: 'google' | 'github' | 'gitlab' | 'azure' | 'bitbucket';
  apiBaseUrl: string;
  redirectTo?: string;
  children?: React.ReactNode;
  className?: string;
}

export function OAuthButton({
  provider,
  apiBaseUrl,
  redirectTo,
  children,
  className,
}: OAuthButtonProps) {
  const handleClick = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, redirectTo }),
      });

      if (!response.ok) {
        throw new Error('OAuth initialization failed');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  const providerLabels = {
    google: 'Google',
    github: 'GitHub',
    gitlab: 'GitLab',
    azure: 'Azure',
    bitbucket: 'Bitbucket',
  };

  return (
    <Button type="button" variant="outline" onClick={handleClick} className={className}>
      {children || `Sign in with ${providerLabels[provider]}`}
    </Button>
  );
}
