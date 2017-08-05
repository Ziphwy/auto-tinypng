module.exports = {
    "extends": "airbnb-base",
    ecmaFeatures: {
        'es6': true
    },
    "plugins": [
        "import"
    ],
    "env": {
        "node": true,
        "es6": true,
    },
    "rules": {
        'no-unused-expressions': 0,
        'consistent-return': 0,
        'no-plusplus': 0,
        'no-shadow': 1,
        'no-param-reassign': [1, { "props": false }],
        'one-var': 0,
        'no-use-before-define': ["error", { "functions": false }],
        'import/no-unresolved': [0, { commonjs: true, amd: true }],
        'import/extensions': 0,
        'camelcase': 2,
        'no-underscore-dangle': 0,
    },
};