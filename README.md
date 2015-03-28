# planet-discovery
Discovering planets across the web

![planet-discovery preview](http://i.imgur.com/HnBRys4.png)

## What is it?

planet-discovery is made of two elements: a node.js server
running on port 3000 that crawls the internet starting from
a random Wikipedia page, and a three.js canvas that pops a new
planet each time a new link is reached.

## How it works

First, launch the server:

    $ node spider.js
    Server launched at 127.0.0.1:3000. Ctrl + C to terminate

Then, open your browser at [127.0.0.1:3000](http://127.0.0.1:3000), and that's it.
