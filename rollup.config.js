import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default [
    {
        input: "src/get-along.ts",
        output: {
            name: "GetAlong",
            file: "dist/get-along.js",
            format: "iife",
            sourcemap: "inline"
        },
        plugins: [
            typescript(),
            resolve()
        ],
    },
    {
        input: "src/get-along.ts",
        output: {
            name: "GetAlong",
            file: "dist/get-along.min.js",
            format: "iife"
        },
        plugins: [
            typescript(),
            resolve(),
            uglify()
        ],
    },
]; 