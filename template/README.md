# <<<appName>>>

## Setup

``` text
npm install
```

## Development

Execute `./dev-server.sh` (linux) or `dev-server.bat` (windows).

Open `http://locahost:8081` in your browser.

## Publish

Execute `./publish.sh` (linux) or `publish.bat` (windows).

Execute `./server.sh` (linux) or `publish.bat` (windows). (if node.js server)

Open `index.html` in your browser. (if no node.js server)

Open `http://locahost:8080/` in your browser. (if node.js server)

## Notes

If you want to publish to a git repo, you need to push these files: (see .gitignore)

* public/*
* index.html
* publishedStats.json (if node.js server)
* server.js (if node.js server)
* cache.minifest (if cacheManifest)