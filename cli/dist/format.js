"use strict";
/**
 * Shared output formatting utilities for the ILN CLI.
 *
 * When the global --json flag is set, all commands output machine-readable
 * JSON instead of human-friendly formatted text.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonMode = isJsonMode;
exports.formatOutput = formatOutput;
exports.formatError = formatError;
/**
 * Return true when the current CLI invocation has --json enabled.
 * Reads from the parent (root) program options via Commander's hierarchy.
 */
function isJsonMode(parentOpts) {
    return parentOpts?.json === true;
}
/**
 * Output data in the appropriate format based on --json flag.
 * - JSON mode: prints valid JSON to stdout (no ANSI, no extra text).
 * - Human mode: calls the provided `human` callback to print formatted output.
 */
function formatOutput(data, json, human) {
    if (json) {
        console.log(JSON.stringify(data));
    }
    else {
        human?.();
    }
}
/**
 * Output a structured error as JSON when --json mode is active,
 * otherwise print a plain-text error and exit.
 */
function formatError(message, code, json) {
    if (json) {
        const err = { error: message, code };
        console.log(JSON.stringify(err));
    }
    else {
        console.error(`Error: ${message}`);
    }
    process.exit(1);
}
//# sourceMappingURL=format.js.map