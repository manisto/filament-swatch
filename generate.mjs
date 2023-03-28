import { spawn } from "node:child_process";

export function generate(settings, onDone) {
    const file = fname(settings);

    var process = spawn("openscad", ["-o", file, ...params(settings), "swatch.scad"]);

    process.on("close", (exitCode) => {
        onDone(file);
    });
}

process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

process.on("close", (exitCode) => {
    console.log(exitCode);
});

function params(params) {
    return Object.keys(params).flatMap(key => ["-D", `${key}=${tick(params[key])}`]);
}

function tick(val) {
    return (isNaN(val)) ? `"${val}"` : `${val}`;
}

function fname(params) {
    return `${dash(params.material)}_${dash(params.brand)}_${dash(params.name)}.stl`;
}

function dash(name) {
    return name.replace(/[^0-9a-z ]/gi, "").trim(" ");
}