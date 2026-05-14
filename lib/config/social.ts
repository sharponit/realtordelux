export type SocialPlatformId = 'linkedin' | 'instagram' | 'youtube' | 'x';

export type SocialPlatform = {
  id: SocialPlatformId;
  name: string;
  url: string;
  enabled: boolean;
  order: number;
  ariaLabel: string;
};

export const socialPlatforms = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/viyra',
    enabled: true,
    order: 10,
    ariaLabel: 'Follow VIYRA on LinkedIn'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/viyra',
    enabled: true,
    order: 20,
    ariaLabel: 'Follow VIYRA on Instagram'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@viyra',
    enabled: true,
    order: 30,
    ariaLabel: 'Follow VIYRA on YouTube'
  },
  {
    id: 'x',
    name: 'X',
    url: 'https://x.com/viyra',
    enabled: true,
    order: 40,
    ariaLabel: 'Follow VIYRA on X'
  }
] as const satisfies readonly SocialPlatform[];

export const enabledSocialPlatforms = socialPlatforms
  .filter((platform) => platform.enabled && platform.url.trim().length > 0)
  .sort((a, b) => a.order - b.order);
