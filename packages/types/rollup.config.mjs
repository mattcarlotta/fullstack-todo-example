import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

const terserOptions = {
    compress: {
        warnings: false,
        comparisons: false,
        inline: 2
    },
    mangle: {
        safari10: true
    },
    output: {
        comments: false,
        ascii_only: true
    }
};

export default [
    {
        input: ["index.ts"],
        output: [{ dir: "build", format: "cjs", entryFileNames: "[name].cjs" }],
        external: ["zod"],
        plugins: [
            typescript(),
            terser(terserOptions)
        ]
    },
    {
        input: ["index.ts"],
        output: [{ dir: "build", format: "esm", entryFileNames: "[name].mjs", preserveModules: true }],
        external: ["zod"],
        plugins: [
            typescript({ tsconfig: "./tsconfig.esm.json" }),
            terser(terserOptions)
        ]
    }
];
