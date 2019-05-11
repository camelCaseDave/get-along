import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default [
    {
        input: "src/GetAlong.ts",
        output: {
            name: "GetAlong",
            file: "dist/getalong.js",
            format: "iife",
            sourcemap: "inline"
        },
        plugins: [
            typescript(),
            resolve()
        ],
    },
    {
        input: "src/GetAlong.ts",
        output: {
            name: "GetAlong",
            file: "dist/getalong.min.js",
            format: "iife"
        },
        plugins: [
            typescript(),
            resolve(),
            uglify()
        ],
    },
]; 