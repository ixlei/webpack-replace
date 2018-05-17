"use strict";
const { ConcatSource } = require("webpack-sources");

class ReplaceWebapck {
    constructor(options) {
        this.options = {
            inject: options.inject
        }
    }

    getAllChunks(compilation) {
        const chunkOnlyFilterConfig = {
            assets: false,
            cached: false,
            children: false,
            chunks: true,
            chunkModules: false,
            chunkOrigins: false,
            errorDetails: false,
            hash: false,
            modules: false,
            reasons: false,
            source: false,
            timings: false,
            version: false
        };
        const allChunks = compilation.getStats().toJson(chunkOnlyFilterConfig).chunks;
        return allChunks;
    }

    apply(compiler) {
        let optimizeChunkAssetsHook = (chunks) => {
            let compilation = this.compilation;
            let allChunks = this.getAllChunks(compilation);

            allChunks.forEach((item, key) => {
                let js = [],
                    css = [];
                item.files.forEach(function(file) {
                    if (/\.js$/.test(file)) {
                        js.push(file)
                    }
                    if (/.css$/.test(file)) {
                        css.push(file)
                    }
                });
                let jsSource = [],
                    cssSource = [];
                js.forEach(function(item) {
                    jsSource.push(compilation.assets[item].source());
                });
                css.forEach(function(item) {
                    cssSource.push(compilation.assets[item].source())
                });
                this.options.inject && this.options.inject(item.names, jsSource, cssSource);
                if (this.options.inject) {
                    jsSource.forEach(function(source, index) {
                        compilation.assets[js[index]] = new ConcatSource(source)
                    })

                    cssSource.forEach(function(source, index) {
                        compilation.assets[css[index]] = new ConcatSource(source)
                    })
                }
            })
        }

        let compilationHook = (compilation, params) => {
            this.compilation = compilation;
            compilation.hooks.optimizeChunkAssets.tap('webpack_replace', optimizeChunkAssetsHook);
        }

        if (compiler.hooks) {
            compiler.hooks.thisCompilation.tap('webpack_replace', compilationHook);
        } else {
            compiler.plugin('compilation', (compilation) => {
                compilation.plugin('optimize-chunk-assets', (chunks, done) => {
                    this.optimizeChunkAssetsHook(chunks);
                    done();
                })
            })
        }

    }
}

module.exports = ReplaceWebapck;