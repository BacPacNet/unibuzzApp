/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.js', '.json'],
                alias: {
                    '@': './src',
                },
            },
        ],
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',
                path: '.env',
            },
        ],
        'inline-dotenv',
        'react-native-reanimated/plugin', // needs to be last
    ],
    ignore: [/\.(css)$/],
};
