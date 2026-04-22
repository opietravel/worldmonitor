import { t } from '@/services/i18n';
import { getDismissed, setDismissed } from '@/utils/cross-domain-storage';

const DISMISSED_KEY = 'wm-community-dismissed-v2';
const DISCUSSION_URL = 'https://discord.gg/re63kWKxaz';

export function mountCommunityWidget(): void {
  // Community widget disabled on personal deploy — no Discord CTA, no widget mount.
  void DISMISSED_KEY;
  void DISCUSSION_URL;
  void t;
  void getDismissed;
  void setDismissed;
}
