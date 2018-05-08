<h1 align="center">webpack-replace-plugin</h1>

<h2 align="center">Install</h2>

```bash
npm install --save-dev webpack-replace-plugin
```

<h2 align="center">Usage</h2>

this plugin provide a hook when ths assets seal, you can replace something you want replace.
config as follows:

**webpack.config.js**
```js
const HtmlWebpackPlugin = require('webpack-replace-plugin')

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new ReplaceWebapck({
        inject(entryKey, jsSource, cssSource) {
            // var js = jsSource[0];
            // jsSource[0] = js.replace(/__inject_styles_css/g, JSON.stringify(cssSource[0]));
        }
    })
  ]
}
```


<h2 align="center">Options</h2>

You can pass a hash of configuration options to `webpack-replace-plugin`.
Allowed values are as follows

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`inject`](#)**|`{function inject(entryKey: string,jsSource: Array<String>, cssSource: Array<String>): void}}`||you can replace somthing you want|

Here's an example webpack config illustrating how to use these options

**index.js**
```js
// inject styles to the css
(function() {
  var styles = '__inject_styles_css';
  var styleEle = document.createElement('style');
  styleEle.innerHTML = styles;
  document.head.appendChild(styleEle);
})()
```
**webpack.config.js**
```js
const HtmlWebpackPlugin = require('webpack-replace-plugin')

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new ReplaceWebapck({
        inject(entryKey, jsSource, cssSource) {
            // inject the styles to the js code, sometimes when you use like extract-text-webpack-plugin.
            var js = jsSource[0];
            var css = cssSource.join('');
            jsSource.forEach(function(item, index) {
              jsSource[index] = jsSource[index].replace(/__inject_styles_css/g, JSON.stringify(css))
            })
        }
    })
  ]
}
```
