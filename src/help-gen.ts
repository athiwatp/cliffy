import { Command } from "./definitions";
const indent = require("indent");
const columnify = require("columnify");

function genUsage(command: string, val: Command) {
    let usage = `${command} [options]`;
    if (!val.parameters) return usage;
    for (const param of val.parameters) {
        usage += ` <${param.label}>`
    }
    return usage;
}

export function printCommandHelp(command: string, val: Command) {
    console.log("");
    if (val.description) {
        console.log(val.description + "\n");
    }
    console.log(`Usage:\n`);
    console.log(indent(genUsage(command, val), 4) + "\n");
    printOptions(val);
    printSubCommands(val);
    console.log("");
}

function printOptions(val: Command) {
    if (val.options && val.options.length > 0) {
        console.log(`Options:\n`);
        const options: any = {};
        val.options.forEach(opt => {
            if (typeof opt === "string") {
                options[`@${opt}`] = "";
                return;
            }
            options[`@${opt}`] = opt.description || "";
        });
        console.log(indent(columnify(options, { showHeaders: false}), 4));
    }
}

function printSubCommands(val: Command) {
    if (val.subcommands) {
        console.log("Sub-Commands:\n");
        const commands: any = {};
        for (const command in val.subcommands) {
            commands[genUsage(command, val.subcommands[command])] = val.subcommands[command].description || "";
        }
        console.log(indent(columnify(commands, { showHeaders: false }), 4));
    }
}

export function printOverviewHelp(commands: { [command: string]: Command }) {
    const commandDescriptions: any = {};
    for (const command in commands) {
        commandDescriptions[genUsage(command, commands[command])] = commands[command].description || "";
    }
    console.log(`\nUsage:\n`)
    console.log(indent(`<cmd>\n`, 4));

    console.log(`Available commands:\n`);
    console.log(indent(`help <cmd>`, 4));

    console.log(indent(columnify(commandDescriptions, { showHeaders: false }), 4) + "\n");
    return;
}