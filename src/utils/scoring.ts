import type { TennisMatchState, RallyScoreState, PickleballState, Settings } from '../types';
import { getNextServerInCustomRotation } from './servingRotation';

// Tennis/Padel scoring logic
export function incrementTennisScore(
  state: TennisMatchState,
  player: 1 | 2,
  settings: Settings
): { newState: TennisMatchState; gameWon?: boolean; setWon?: boolean; matchWon?: boolean } {
  const newState = JSON.parse(JSON.stringify(state)) as TennisMatchState;
  const game = newState.currentSet.currentGame;

  // Handle tiebreak
  if (newState.currentSet.tiebreak) {
    const tiebreak = newState.currentSet.tiebreak;
    if (player === 1) {
      tiebreak.player1Score++;
    } else {
      tiebreak.player2Score++;
    }

    const p1Score = tiebreak.player1Score;
    const p2Score = tiebreak.player2Score;
    const diff = Math.abs(p1Score - p2Score);

    // Switch serve every 2 points
    if ((p1Score + p2Score) % 2 === 0) {
      tiebreak.serving = tiebreak.serving === 1 ? 2 : 1;
    }

    // Win tiebreak: first to 7, win by 2
    if ((p1Score >= 7 || p2Score >= 7) && diff >= 2) {
      // Tiebreak won
      const setWon = player === 1 ? p1Score > p2Score : p2Score > p1Score;
      if (setWon) {
        // Set won
        newState.sets.push({
          games: newState.currentSet.games,
          tiebreak: [p1Score, p2Score],
        });
        
        const setsWon = newState.sets.filter(s => {
          const p1Games = s.games[0];
          const p2Games = s.games[1];
          return p1Games > p2Games ? 1 : 2;
        }).length;

        const setsNeeded = settings.tennis.matchFormat === 'best-of-3' ? 2 : 3;
        const matchWon = (player === 1 && setsWon >= setsNeeded) || (player === 2 && setsWon < setsNeeded);

        if (matchWon) {
          return { newState, matchWon: true };
        }

        // Start new set
        // For doubles with custom rotation, use getNextServerInCustomRotation
        let nextServingTeam: 1 | 2;
        if (newState.firstServer && newState.secondServer && newState.currentServer) {
          const nextServer = getNextServerInCustomRotation(
            newState.firstServer,
            newState.secondServer,
            newState.currentServer
          );
          newState.currentServer = nextServer;
          nextServingTeam = nextServer <= 2 ? 1 : 2;
        } else {
          nextServingTeam = newState.serving === 1 ? 2 : 1;
        }
        newState.currentSet = {
          games: [0, 0],
          currentGame: {
            player1Score: 0,
            player2Score: 0,
            serving: nextServingTeam,
          },
        };
        newState.serving = nextServingTeam;
        newState.side = nextServingTeam;
        return { newState, setWon: true };
      }
    }

    return { newState };
  }

  // Regular game scoring
  if (player === 1) {
    if (game.player1Score === 0) game.player1Score = 15;
    else if (game.player1Score === 15) game.player1Score = 30;
    else if (game.player1Score === 30) game.player1Score = 40;
    else if (game.player1Score === 40) {
      if (game.player2Score === 40) {
        // Deuce
        if (settings.tennis.scoring === 'no-ad') {
          // No-ad mode: next point wins
          // Game won
          newState.currentSet.games[0]++;
          const games = newState.currentSet.games;
          
          // Check for set win
          // Rule: Win by 2 games with minimum 6 games
          // If score is 6-5, continue (need to win by 2, so must go to at least 7-5)
          const diff = Math.abs(games[0] - games[1]);
          const setWon = ((games[0] >= 6 || games[1] >= 6) && diff >= 2);
          
          if (setWon) {
            // Set won
            newState.sets.push({
              games: [games[0], games[1]],
            });
            
            // Count sets won by each player
            const setsWonByPlayer1 = newState.sets.filter(s => s.games[0] > s.games[1]).length;
            const setsWonByPlayer2 = newState.sets.filter(s => s.games[1] > s.games[0]).length;
            const setsNeeded = settings.tennis.matchFormat === 'best-of-3' ? 2 : 3;
            const matchWon = setsWonByPlayer1 >= setsNeeded || setsWonByPlayer2 >= setsNeeded;

            if (matchWon) {
              return { newState, gameWon: true, setWon: true, matchWon: true };
            }

            // Start new set
            newState.currentSet = {
              games: [0, 0],
              currentGame: {
                player1Score: 0,
                player2Score: 0,
                serving: newState.serving === 1 ? 2 : 1,
              },
            };
            newState.serving = newState.serving === 1 ? 2 : 1;
            return { newState, gameWon: true, setWon: true };
          }

          // Check for tiebreak
          if (settings.tennis.tiebreak && games[0] === 6 && games[1] === 6) {
            newState.currentSet.tiebreak = {
              player1Score: 0,
              player2Score: 0,
              serving: newState.serving,
            };
            return { newState, gameWon: true };
          }

          // New game
          newState.currentSet.currentGame = {
            player1Score: 0,
            player2Score: 0,
            serving: newState.serving === 1 ? 2 : 1,
          };
          newState.serving = newState.serving === 1 ? 2 : 1;
          return { newState, gameWon: true };
        } else {
          // Standard mode: advantage
          game.player1Score = 'ad';
        }
      } else if (game.player2Score === 'ad') {
        game.player2Score = 40; // Back to deuce
      } else {
        // Game won
        newState.currentSet.games[0]++;
        const games = newState.currentSet.games;
        
        // Check for set win
        // Rule: Win by 2 games, OR reach 6 games when opponent has 4 or less
        const diff = Math.abs(games[0] - games[1]);
        const setWon = (games[0] >= 6 && games[0] > games[1] && (diff >= 2 || games[1] <= 4)) ||
                      (games[1] >= 6 && games[1] > games[0] && (diff >= 2 || games[0] <= 4));
        
        if (setWon) {
          // Set won
          newState.sets.push({
            games: [games[0], games[1]],
          });
          
          // Count sets won by each player
          const setsWonByPlayer1 = newState.sets.filter(s => s.games[0] > s.games[1]).length;
          const setsWonByPlayer2 = newState.sets.filter(s => s.games[1] > s.games[0]).length;
          const setsNeeded = settings.tennis.matchFormat === 'best-of-3' ? 2 : 3;
          const matchWon = setsWonByPlayer1 >= setsNeeded || setsWonByPlayer2 >= setsNeeded;

          if (matchWon) {
            return { newState, gameWon: true, setWon: true, matchWon: true };
          }

          // Start new set
          // For doubles with custom rotation, use getNextServerInCustomRotation
          let nextServingTeam: 1 | 2;
          if (newState.firstServer && newState.secondServer && newState.currentServer) {
            const nextServer = getNextServerInCustomRotation(
              newState.firstServer,
              newState.secondServer,
              newState.currentServer
            );
            newState.currentServer = nextServer;
            nextServingTeam = nextServer <= 2 ? 1 : 2;
          } else {
            nextServingTeam = newState.serving === 1 ? 2 : 1;
          }
          newState.currentSet = {
            games: [0, 0],
            currentGame: {
              player1Score: 0,
              player2Score: 0,
              serving: nextServingTeam,
            },
          };
          newState.serving = nextServingTeam;
          newState.side = nextServingTeam;
          return { newState, gameWon: true, setWon: true };
        }

        // Check for tiebreak
        if (settings.tennis.tiebreak && games[0] === 6 && games[1] === 6) {
          newState.currentSet.tiebreak = {
            player1Score: 0,
            player2Score: 0,
            serving: newState.serving,
          };
          return { newState, gameWon: true };
        }

        // New game
        newState.currentSet.currentGame = {
          player1Score: 0,
          player2Score: 0,
          serving: newState.serving === 1 ? 2 : 1, // Serve alternates
        };
        newState.serving = newState.serving === 1 ? 2 : 1;
        return { newState, gameWon: true };
      }
    } else if (game.player1Score === 'ad') {
      // Game won from advantage
      newState.currentSet.games[0]++;
      // ... similar logic as above
      newState.currentSet.currentGame = {
        player1Score: 0,
        player2Score: 0,
        serving: newState.serving === 1 ? 2 : 1,
      };
      newState.serving = newState.serving === 1 ? 2 : 1;
      return { newState, gameWon: true };
    }
  } else {
    // Player 2 scoring (similar logic)
    if (game.player2Score === 0) game.player2Score = 15;
    else if (game.player2Score === 15) game.player2Score = 30;
    else if (game.player2Score === 30) game.player2Score = 40;
    else if (game.player2Score === 40) {
      if (game.player1Score === 40) {
        // Deuce
        if (settings.tennis.scoring === 'no-ad') {
          // No-ad mode: next point wins
          // Game won
          newState.currentSet.games[1]++;
          const games = newState.currentSet.games;
          
          // Check for set win
          // Rule: Win by 2 games with minimum 6 games
          // If score is 6-5, continue (need to win by 2, so must go to at least 7-5)
          const diff = Math.abs(games[0] - games[1]);
          const setWon = ((games[0] >= 6 || games[1] >= 6) && diff >= 2);
          
          if (setWon) {
            newState.sets.push({
              games: [games[0], games[1]],
            });
            
            // Count sets won by each player
            const setsWonByPlayer1 = newState.sets.filter(s => s.games[0] > s.games[1]).length;
            const setsWonByPlayer2 = newState.sets.filter(s => s.games[1] > s.games[0]).length;
            const setsNeeded = settings.tennis.matchFormat === 'best-of-3' ? 2 : 3;
            const matchWon = setsWonByPlayer1 >= setsNeeded || setsWonByPlayer2 >= setsNeeded;

            if (matchWon) {
              return { newState, gameWon: true, setWon: true, matchWon: true };
            }

            newState.currentSet = {
              games: [0, 0],
              currentGame: {
                player1Score: 0,
                player2Score: 0,
                serving: newState.serving === 1 ? 2 : 1,
              },
            };
            newState.serving = newState.serving === 1 ? 2 : 1;
            return { newState, gameWon: true, setWon: true };
          }

          if (settings.tennis.tiebreak && games[0] === 6 && games[1] === 6) {
            newState.currentSet.tiebreak = {
              player1Score: 0,
              player2Score: 0,
              serving: newState.serving,
            };
            return { newState, gameWon: true };
          }

          newState.currentSet.currentGame = {
            player1Score: 0,
            player2Score: 0,
            serving: newState.serving === 1 ? 2 : 1,
          };
          newState.serving = newState.serving === 1 ? 2 : 1;
          return { newState, gameWon: true };
        } else {
          // Standard mode: advantage
          game.player2Score = 'ad';
        }
      } else if (game.player1Score === 'ad') {
        game.player1Score = 40;
      } else {
        newState.currentSet.games[1]++;
        const games = newState.currentSet.games;
        
        // Check for set win
        // Rule: Win by 2 games, OR reach 6 games when opponent has 4 or less
        const diff = Math.abs(games[0] - games[1]);
        const setWon = (games[0] >= 6 && games[0] > games[1] && (diff >= 2 || games[1] <= 4)) ||
                      (games[1] >= 6 && games[1] > games[0] && (diff >= 2 || games[0] <= 4));
        
        if (setWon) {
          newState.sets.push({
            games: [games[0], games[1]],
          });
          
          // Count sets won by each player
          const setsWonByPlayer1 = newState.sets.filter(s => s.games[0] > s.games[1]).length;
          const setsWonByPlayer2 = newState.sets.filter(s => s.games[1] > s.games[0]).length;
          const setsNeeded = settings.tennis.matchFormat === 'best-of-3' ? 2 : 3;
          const matchWon = setsWonByPlayer1 >= setsNeeded || setsWonByPlayer2 >= setsNeeded;

          if (matchWon) {
            return { newState, gameWon: true, setWon: true, matchWon: true };
          }

          newState.currentSet = {
            games: [0, 0],
            currentGame: {
              player1Score: 0,
              player2Score: 0,
              serving: newState.serving === 1 ? 2 : 1,
            },
          };
          newState.serving = newState.serving === 1 ? 2 : 1;
          return { newState, gameWon: true, setWon: true };
        }

        if (settings.tennis.tiebreak && games[0] === 6 && games[1] === 6) {
          newState.currentSet.tiebreak = {
            player1Score: 0,
            player2Score: 0,
            serving: newState.serving,
          };
          return { newState, gameWon: true };
        }

        newState.currentSet.currentGame = {
          player1Score: 0,
          player2Score: 0,
          serving: newState.serving === 1 ? 2 : 1,
        };
        newState.serving = newState.serving === 1 ? 2 : 1;
        return { newState, gameWon: true };
      }
    } else if (game.player2Score === 'ad') {
      newState.currentSet.games[1]++;
      newState.currentSet.currentGame = {
        player1Score: 0,
        player2Score: 0,
        serving: newState.serving === 1 ? 2 : 1,
      };
      newState.serving = newState.serving === 1 ? 2 : 1;
      return { newState, gameWon: true };
    }
  }

  return { newState };
}

// Badminton/Table Tennis/Squash scoring
export function incrementRallyScore(
  state: RallyScoreState,
  player: 1 | 2,
  targetScore: number,
  maxScore?: number,
  isDoubles?: boolean
): { newState: RallyScoreState; gameWon?: boolean } {
  const newState = JSON.parse(JSON.stringify(state)) as RallyScoreState;
  
  if (player === 1) {
    newState.player1Score++;
  } else {
    newState.player2Score++;
  }

  // Winner serves next (rally scoring)
  newState.serving = player;
  
  // In doubles, rotate server number after each point
  // Use custom rotation if secondServer is defined, otherwise use standard rotation
  if (isDoubles && newState.currentServer) {
    if (newState.firstServer && newState.secondServer) {
      // Use custom rotation: firstServer -> secondServer -> next Team 1 -> next Team 2 -> repeat
      // For per-point rotation in rally scoring, we still rotate within the cycle
      // But we need to ensure the serving team matches
      const serverTeam = newState.currentServer <= 2 ? 1 : 2;
      if (player !== serverTeam) {
        // Winner is from different team, so we need to move to the next server in the cycle
        newState.currentServer = getNextServerInCustomRotation(
          newState.firstServer,
          newState.secondServer,
          newState.currentServer
        );
      } else {
        // Same team won, but we still rotate to next player in the cycle
        // In rally scoring, the same team can serve multiple points, so we rotate
        newState.currentServer = getNextServerInCustomRotation(
          newState.firstServer,
          newState.secondServer,
          newState.currentServer
        );
        // But ensure it's still from the winning team
        const newServerTeam = newState.currentServer <= 2 ? 1 : 2;
        if (newServerTeam !== player) {
          // If rotation moved to wrong team, rotate again
          newState.currentServer = getNextServerInCustomRotation(
            newState.firstServer,
            newState.secondServer,
            newState.currentServer
          );
        }
      }
    } else {
      // Standard rotation: 1 (Team1P1) -> 2 (Team2P1) -> 3 (Team1P2) -> 4 (Team2P2) -> 1
      if (newState.currentServer === 1) newState.currentServer = 2;
      else if (newState.currentServer === 2) newState.currentServer = 3;
      else if (newState.currentServer === 3) newState.currentServer = 4;
      else newState.currentServer = 1;
      
      // Ensure the serving team matches the current server
      const serverTeam = newState.currentServer <= 2 ? 1 : 2;
      if (player !== serverTeam) {
        // Adjust currentServer to match the winning team
        if (player === 1) {
          newState.currentServer = newState.currentServer === 2 ? 1 : 3;
        } else {
          newState.currentServer = newState.currentServer === 1 ? 2 : 4;
        }
      }
    }
  }

  const p1Score = newState.player1Score;
  const p2Score = newState.player2Score;
  const diff = Math.abs(p1Score - p2Score);

  // Check win condition
  if (maxScore && (p1Score >= maxScore || p2Score >= maxScore)) {
    // Reached max score, winner is whoever reached it
    return { newState, gameWon: true };
  }

  if ((p1Score >= targetScore || p2Score >= targetScore) && diff >= 2) {
    return { newState, gameWon: true };
  }

  return { newState };
}

// Pickleball scoring
export function incrementPickleballScore(
  state: PickleballState,
  team: 1 | 2,
  targetScore: number
): { newState: PickleballState; gameWon?: boolean; sideOut?: boolean } {
  const newState = JSON.parse(JSON.stringify(state)) as PickleballState;

  // Only serving team can score
  if (team !== newState.serving) {
    // Side-out: switch serve
    if (newState.serving === 1) {
      newState.serving = 2;
      newState.serverNumber = 1;
      newState.isFirstServe = true;
    } else {
      newState.serving = 1;
      newState.serverNumber = 1;
      newState.isFirstServe = true;
    }
    return { newState, sideOut: true };
  }

  // Serving team scores
  if (newState.serving === 1) {
    newState.serverScore++;
  } else {
    // When team 2 is serving, their score is the server score
    // This is a simplification - actual pickleball has receiver score too
    newState.serverScore++;
  }

  // Check win condition
  const diff = Math.abs(newState.serverScore - newState.receiverScore);
  if (newState.serverScore >= targetScore && diff >= 2) {
    return { newState, gameWon: true };
  }

  // Serve rotation (every 2 points in doubles, or after fault)
  // Simplified: switch server number after scoring
  if (newState.serverNumber === 1 && !newState.isFirstServe) {
    newState.serverNumber = 2;
  } else if (newState.serverNumber === 2) {
    // After 2nd server, side-out
    newState.serving = newState.serving === 1 ? 2 : 1;
    newState.serverNumber = 1;
    newState.isFirstServe = true;
  } else {
    newState.isFirstServe = false;
  }

  return { newState };
}
