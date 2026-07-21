"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePauseCommand = makePauseCommand;
exports.makeUnpauseCommand = makeUnpauseCommand;
const commander_1 = require("commander");
const readline = __importStar(require("readline"));
const config_js_1 = require("../config.js");
const format_js_1 = require("../format.js");
async function promptConfirm(message) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(`${message} `, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "y");
        });
    });
}
// Default mock executors
async function defaultPauseExecutor() {
    return {
        txHash: `TX${Math.random().toString(36).slice(2).toUpperCase()}`,
        paused: true,
    };
}
async function defaultUnpauseExecutor() {
    return {
        txHash: `TX${Math.random().toString(36).slice(2).toUpperCase()}`,
        paused: false,
    };
}
let defaultState = false;
async function defaultStateChecker() {
    return defaultState;
}
function makePauseCommand(stateChecker = defaultStateChecker, pauseExecutor = defaultPauseExecutor, confirm = promptConfirm) {
    const cmd = new commander_1.Command("pause").description("Pause all contract operations");
    cmd
        .option("--yes", "Skip confirmation prompt")
        .action(async (opts) => {
        const rootOpts = cmd.parent?.opts();
        const json = (0, format_js_1.isJsonMode)(rootOpts);
        try {
            // Require admin authentication
            const profile = (0, config_js_1.resolveProfile)(rootOpts?.profile);
            if (!profile) {
                (0, format_js_1.formatError)("No connected wallet found. Run: iln wallet generate", "NO_WALLET", json);
                return;
            }
            // Check current state
            const isCurrentlyPaused = await stateChecker();
            if (isCurrentlyPaused) {
                (0, format_js_1.formatOutput)({ paused: true, message: "contract is already paused" }, json, () => {
                    console.log("Contract is already paused. No changes made.");
                });
                return;
            }
            // Confirmation prompt
            if (!opts.yes) {
                const msg = "Confirm pause of contract? [y/N]";
                const confirmed = await confirm(msg);
                if (!confirmed) {
                    (0, format_js_1.formatOutput)({ aborted: true, message: "contract not paused" }, json, () => {
                        console.log("Aborted — contract not paused.");
                    });
                    return;
                }
            }
            const result = await pauseExecutor();
            // Update defaultState if using defaultStateChecker
            defaultState = true;
            (0, format_js_1.formatOutput)({ ...result, state: "Paused" }, json, () => {
                console.log(`Contract paused. TX: ${result.txHash}`);
                console.log(`Contract State: Paused`);
            });
        }
        catch (err) {
            (0, format_js_1.formatError)(err.message, "PAUSE_ERROR", json);
        }
    });
    return cmd;
}
function makeUnpauseCommand(stateChecker = defaultStateChecker, unpauseExecutor = defaultUnpauseExecutor, confirm = promptConfirm) {
    const cmd = new commander_1.Command("unpause").description("Unpause contract operations");
    cmd
        .option("--yes", "Skip confirmation prompt")
        .action(async (opts) => {
        const rootOpts = cmd.parent?.opts();
        const json = (0, format_js_1.isJsonMode)(rootOpts);
        try {
            // Require admin authentication
            const profile = (0, config_js_1.resolveProfile)(rootOpts?.profile);
            if (!profile) {
                (0, format_js_1.formatError)("No connected wallet found. Run: iln wallet generate", "NO_WALLET", json);
                return;
            }
            // Check current state
            const isCurrentlyPaused = await stateChecker();
            if (!isCurrentlyPaused) {
                (0, format_js_1.formatOutput)({ paused: false, message: "contract is already unpaused" }, json, () => {
                    console.log("Contract is already unpaused. No changes made.");
                });
                return;
            }
            // Confirmation prompt
            if (!opts.yes) {
                const msg = "Confirm unpause of contract? [y/N]";
                const confirmed = await confirm(msg);
                if (!confirmed) {
                    (0, format_js_1.formatOutput)({ aborted: true, message: "contract not unpaused" }, json, () => {
                        console.log("Aborted — contract not unpaused.");
                    });
                    return;
                }
            }
            const result = await unpauseExecutor();
            // Update defaultState if using defaultStateChecker
            defaultState = false;
            (0, format_js_1.formatOutput)({ ...result, state: "Active" }, json, () => {
                console.log(`Contract unpaused. TX: ${result.txHash}`);
                console.log(`Contract State: Active`);
            });
        }
        catch (err) {
            (0, format_js_1.formatError)(err.message, "UNPAUSE_ERROR", json);
        }
    });
    return cmd;
}
//# sourceMappingURL=pause.js.map