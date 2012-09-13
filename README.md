# webpack/template

Scaffolding for webpack wep apps.

Features:

* Create web apps by scaffolding.
* Update scaffolded web app if the template updates.
* Include development server for just-in-time compiling (just edit the source and update your browser).
* Includes all webpack features: Just require any resource (css, less, coffee, png).
* Install webpack-template-modules, which add some stuff to the template (Coming soon)
 * i. e. jQuery, bootstrap, node.js server, etc.

``` text
> npm install wpt -g

> wpt create
appName: my-test-app
author: Your Name
...

> cd my-test-app

> wpt install jquery
Installing jquery webpack-template-module (wtm)...
Done.

> wpt init
Done.

> wpt disable cacheManifest
Done.

> npm install
...

> publish
...

> index.html
```

WIP: Just `wpt create` and `wpt init` work yet. Not wtms yet, sorry.