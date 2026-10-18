import type { WorldId, CompanionId, FeelingId, SavedDreamTicket } from '../components/exhibits/DreamForge';

export const PRIMARY_TICKET_KEY = 'pip_dreamos_saved_dream_ticket_v1';
export const SHELF_TICKETS_KEY = 'pip_dreamos_saved_tickets_shelf_v1';

export function validateTicket(obj: unknown): SavedDreamTicket | null {
  if (!obj || typeof obj !== 'object') return null;
  const t = obj as Partial<SavedDreamTicket>;
  if (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.world === 'string' &&
    typeof t.companion === 'string' &&
    typeof t.feeling === 'string' &&
    typeof t.story === 'string' &&
    Array.isArray(t.colors) &&
    t.colors.length === 4
  ) {
    return {
      id: t.id,
      title: t.title,
      world: t.world as WorldId,
      companion: t.companion as CompanionId,
      feeling: t.feeling as FeelingId,
      story: t.story,
      colors: t.colors as [string, string, string, string],
      timestamp: typeof t.timestamp === 'string' ? t.timestamp : 'Tonight',
      frequency: typeof t.frequency === 'string' ? t.frequency : '432.0 Hz'
    };
  }
  return null;
}

export function getActiveSavedTicket(): SavedDreamTicket | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRIMARY_TICKET_KEY);
    if (!raw) return null;
    return validateTicket(JSON.parse(raw));
  } catch (err) {
    console.warn('[DreamStorage] Failed to read active dream ticket:', err);
    return null;
  }
}

export function getAllSavedTickets(): SavedDreamTicket[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SHELF_TICKETS_KEY);
    if (!raw) {
      const active = getActiveSavedTicket();
      return active ? [active] : [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const valid = parsed.map(validateTicket).filter((t): t is SavedDreamTicket => t !== null);
      if (valid.length === 0) {
        const active = getActiveSavedTicket();
        return active ? [active] : [];
      }
      return valid;
    }
  } catch (err) {
    console.warn('[DreamStorage] Failed to read ticket shelf:', err);
  }
  const fallback = getActiveSavedTicket();
  return fallback ? [fallback] : [];
}

export function saveTicketToStorage(ticket: SavedDreamTicket): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // 1. Save as latest primary active ticket
    localStorage.setItem(PRIMARY_TICKET_KEY, JSON.stringify(ticket));

    // 2. Add to shelf list without duplicates (matching id or matching content)
    const existing = getAllSavedTickets();
    const filtered = existing.filter((t) => t.id !== ticket.id && t.title !== ticket.title);
    const updated = [ticket, ...filtered].slice(0, 12);
    localStorage.setItem(SHELF_TICKETS_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.warn('[DreamStorage] Failed to save dream ticket:', err);
    return false;
  }
}

export function deleteSavedTicket(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getAllSavedTickets();
    const filtered = existing.filter((t) => t.id !== id);
    localStorage.setItem(SHELF_TICKETS_KEY, JSON.stringify(filtered));

    const active = getActiveSavedTicket();
    if (active && active.id === id) {
      if (filtered.length > 0) {
        localStorage.setItem(PRIMARY_TICKET_KEY, JSON.stringify(filtered[0]));
      } else {
        localStorage.removeItem(PRIMARY_TICKET_KEY);
      }
    }
  } catch (err) {
    console.warn('[DreamStorage] Failed to delete ticket:', err);
  }
}
