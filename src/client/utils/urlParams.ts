// URL parameter utility functions for session management

export function setSessionInUrl(codeword: string, playerName: string): void {
  if (!codeword || !playerName) {
    return;
  }
  
  const url = new URL(window.location.href);
  url.searchParams.set('session', codeword);
  url.searchParams.set('player', playerName);
  
  // Update URL without page reload
  window.history.replaceState({}, '', url.toString());
  console.log('[URL] Session saved to URL:', { codeword, playerName });
}

export function getSessionFromUrl(): { codeword: string | null; playerName: string | null } {
  const url = new URL(window.location.href);
  const codeword = url.searchParams.get('session');
  const playerName = url.searchParams.get('player');
  
  if (codeword && playerName) {
    console.log('[URL] Session found in URL:', { codeword, playerName });
    return { codeword: codeword.trim().toLowerCase(), playerName: playerName.trim() };
  }
  
  console.log('[URL] No session found in URL');
  return { codeword: null, playerName: null };
}

export function clearSessionFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('session');
  url.searchParams.delete('player');
  window.history.replaceState({}, '', url.toString());
  console.log('[URL] Session cleared from URL');
}

