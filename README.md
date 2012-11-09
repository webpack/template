# webpack/template

Scaffolding for webpack wep apps.

Features:

* Create web apps by scaffolding.
* Update scaffolded web app if the template updates.
* Include development server for just-in-time compiling (just edit the source and update your browser).
* Includes all webpack features: Just require any resource (css, less, coffee, png).
* Also supports a node.js Server. It is enhanced with enhanced-require, so you can use webpack features in node.
* Supports hot code replacement on server side.
* Install webpack-template-modules, which add some stuff to the template
 * i. e. jQuery, bootstrap, etc.

``` text
> npm install wpt -g

> wpt create
appName: my-test-app
author: Your Name
...

> cd my-test-app

> npm install

> wpt install webpack/jquery-wpt-module
Installing jquery wpt-module...
Done.

> wpt enable nodeServer
Done.
...

> dev-server

> publish
...

> server
```
