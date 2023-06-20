module.exports = {
    "plugins": [
        ["@babel/plugin-transform-modules-commonjs"],
        [ "search-and-replace", {
            "rules": [
                {
                  "search": /\.mjs/,
                  "replace": ".cjs"
                }
            ]
        }]
    ]
}