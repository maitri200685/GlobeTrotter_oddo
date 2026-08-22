/**
 * shareService.ts
 * Frontend sharing service abstraction.
 * Handles public link generation, privacy settings, and cloning.
 * 
 * Backend integration point: GET/POST /api/share/:shareId, PATCH /api/trips/:id/privacy
 */

import type { Trip } from '@/types/trip.types';

export type SharePrivacy = 'public' | 'unlisted' | 'private';

export interface SharedTripMeta {
  shareId: string;
  shareUrl: string;
  privacy: SharePrivacy;
  createdAt: string;
  views: number;
  clones: number;
}

class ShareService {
  private readonly BASE_URL = window.location.origin;

  /**
   * Generate a shareable link for a trip.
   * Backend: POST /api/trips/:id/share
   */
  generateShareLink(trip: Trip): string {
    const shareId = trip.shareId || `gt-${trip.id.slice(-6)}`;
    return `${this.BASE_URL}/share/${shareId}`;
  }

  /**
   * Get share metadata for a trip.
   * Backend: GET /api/trips/:id/share
   */
  async getShareMeta(tripId: string): Promise<SharedTripMeta> {
    await new Promise((res) => setTimeout(res, 200));
    return {
      shareId: `gt-${tripId.slice(-6)}`,
      shareUrl: `${this.BASE_URL}/share/gt-${tripId.slice(-6)}`,
      privacy: 'private',
      createdAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 50),
      clones: Math.floor(Math.random() * 20),
    };
  }

  /**
   * Update trip privacy setting.
   * Backend: PATCH /api/trips/:id/privacy
   */
  async updatePrivacy(tripId: string, privacy: SharePrivacy): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
    // No-op in mock; real call would update server.
  }

  /**
   * Copy a shared trip to the current user's account.
   * Backend: POST /api/share/:shareId/clone
   */
  async cloneSharedTrip(shareId: string, targetUserId: string): Promise<{ tripId: string }> {
    await new Promise((res) => setTimeout(res, 800));
    return { tripId: `cloned-${Date.now()}` };
  }

  /**
   * Copy link to clipboard and return success.
   */
  async copyLinkToClipboard(shareUrl: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch {
      return false;
    }
  }
}

export const shareService = new ShareService();
