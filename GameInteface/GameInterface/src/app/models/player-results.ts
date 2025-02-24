import { GameResult } from "./game-result";


export interface PlayerResults {
  [playerName: string]: GameResult[];
}
