import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

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
]; 