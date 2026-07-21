import { Command } from "commander";
export interface PauseResult {
    txHash: string;
    paused: boolean;
}
export type PauseExecutor = () => Promise<PauseResult>;
export type StateChecker = () => Promise<boolean>;
export declare function makePauseCommand(stateChecker?: StateChecker, pauseExecutor?: PauseExecutor, confirm?: (msg: string) => Promise<boolean>): Command;
export declare function makeUnpauseCommand(stateChecker?: StateChecker, unpauseExecutor?: PauseExecutor, confirm?: (msg: string) => Promise<boolean>): Command;
//# sourceMappingURL=pause.d.ts.map