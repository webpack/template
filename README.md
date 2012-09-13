# webpack/template

Scaffolding for webpack wep apps. (Coming soon)

Features:

* Create web apps by scaffolding.
* Update scaffolded web app if the template updates.
* Install webpack-template-modules, which add some stuff to the template
 * i. e. jQuery, bootstrap, node.js server, etc.
* Include development server for just-in-time compiling (just edit the source and update your browser).
* Includes all webpack features: Just require any resource (css, less, coffee, png).

``` text
> npm install webpack-template -g

> webpack-template create
appName: my-test-app
author: Your Name

> cd my-test-app

> webpack-template install http://webpack.github.com/webpack-template-modules/jquery
Installing jquery webpack-template-module (wtm)...
Done. You need to republish or restart the dev-server.

> webpack-template update
No need to update template.
Check for wtm updates...
No need to update jquery wtm.
Done.

> webpack-template disable cacheManifest
Done. You need to republish or restart the dev-server.

> publish
...

> index.html
```

WIP: It does not work yet. Just the template exist.
You may copy it to create a web app.