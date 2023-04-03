module.exports = {
    plugins: [require.resolve('prettier-plugin-astro')],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro'
            }
        }
    ],
    semi: true,
    trailingComma: 'none',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 4,
    useTabs: false
};
