import commonJS from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

export default [
    {
        input: "src/GetAlong.ts",
        output: {
            file: "dist/getalong.js",
            format: "cjs",
            sourcemap: "inline"
        },
        plugins: [
            typescript(),
            resolve(),
            commonJS({
                include: 'node_modules/**'
            })
        ]
    },
]; 