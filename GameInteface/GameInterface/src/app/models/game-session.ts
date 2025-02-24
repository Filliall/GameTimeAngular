
import { GameResult } from "./game-result";

export interface GameSession {
  id: number;
  startTime: string;
  endTime: string;
  totalTurns: number;
  results: GameResult[];
}
