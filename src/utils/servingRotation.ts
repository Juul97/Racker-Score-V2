// Helper functions for serving rotation in doubles matches

/**
 * Rotate serving order in doubles matches
 * Rotation order: 1 -> 2 -> 3 -> 4 -> 1 (Team1P1 -> Team2P1 -> Team1P2 -> Team2P2)
 */
export function rotateServer(currentServer: 1 | 2 | 3 | 4): 1 | 2 | 3 | 4 {
  if (currentServer === 1) return 2;
  if (currentServer === 2) return 3;
  if (currentServer === 3) return 4;
  return 1;
}

/**
 * Get serving team from server number
 * 1 or 3 = Team 1, 2 or 4 = Team 2
 */
export function getServingTeam(server: 1 | 2 | 3 | 4): 1 | 2 {
  return server <= 2 ? 1 : 2;
}

/**
 * Get the other team's players for next game serving selection
 */
export function getOtherTeamPlayers(winningTeam: 1 | 2): { player1: 1 | 2 | 3 | 4; player2: 1 | 2 | 3 | 4 } {
  if (winningTeam === 1) {
    // Other team is Team 2, players are 2 and 4
    return { player1: 2, player2: 4 };
  } else {
    // Other team is Team 1, players are 1 and 3
    return { player1: 1, player2: 3 };
  }
}

/**
 * Get next server in custom rotation pattern
 * Rotation: firstServer -> secondServer -> next Team 1 player -> next Team 2 player -> repeat
 * 
 * @param firstServer The player who serves first (1=Team1P1, 2=Team2P1, 3=Team1P2, 4=Team2P2)
 * @param secondServer The player who serves second (must be from opposite team of firstServer)
 * @param currentServer The current server
 * @returns The next server in the rotation
 */
export function getNextServerInCustomRotation(
  firstServer: 1 | 2 | 3 | 4,
  secondServer: 1 | 2 | 3 | 4,
  currentServer: 1 | 2 | 3 | 4
): 1 | 2 | 3 | 4 {
  // Team 1 = players 1 and 3, Team 2 = players 2 and 4
  const firstServerTeam = firstServer <= 2 ? 1 : 2;
  
  // Determine the next Team 1 and Team 2 players in the rotation
  let nextTeam1Player: 1 | 3;
  let nextTeam2Player: 2 | 4;
  
  if (firstServerTeam === 1) {
    // First server is from Team 1, so next Team 1 player is the other Team 1 player
    nextTeam1Player = firstServer === 1 ? 3 : 1;
    // Next Team 2 player is the other Team 2 player (not secondServer)
    nextTeam2Player = secondServer === 2 ? 4 : 2;
  } else {
    // First server is from Team 2, so next Team 1 player is the other Team 1 player (not secondServer)
    nextTeam1Player = secondServer === 1 ? 3 : 1;
    // Next Team 2 player is the other Team 2 player
    nextTeam2Player = firstServer === 2 ? 4 : 2;
  }
  
  // Rotation logic
  if (currentServer === firstServer) {
    return secondServer;
  } else if (currentServer === secondServer) {
    return nextTeam1Player;
  } else if (currentServer === nextTeam1Player) {
    return nextTeam2Player;
  } else if (currentServer === nextTeam2Player) {
    return firstServer; // Repeat cycle
  }
  
  // Fallback (shouldn't happen)
  return firstServer;
}
