export const LOG_LEVEL = {
    INFO: "info",
    DATABASE: "DATABASE",
    INTERNAL: "INTERNAL",
    INIT: "INIT",
}

export function log(options) {
    let log = "{ ";
    if (!("level" in options)) return;
    for (let key of Object.keys(options)) {
        log += `"${key}": "${options[key]?.toString()}", `;
    }
    console.log(log.substring(0, log.length - 2) + " }")
}
