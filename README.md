A demo of using sqlite3 extensions on gomix

- You need to know which version of sqlite is installed.
- You need to know the OS architecture as well.
- see [/config](https://gomix-sqlite3-extensions-howto.gomix.me/config) for those.

With this, you can build SQLite extensions on some equivalent server.

- Get a Linux droplet with the same architecture.
- Login as root.
- apt install build-essential tclsh tcl-dev
- Download sqlite source code for the same version. E.g. for 3.15.0
  - cd /tmp
  - `wget -Osqlite.tar.gz 'http://www.sqlite.org/cgi/src/tarball/SQLite-70787558.tar.gz?uuid=707875582fcba352b4906a595ad89198d84711d8'`
  - `tar xzvf sqlite.tar.gz`
  - `cd SQLite-70787558`
  - `./configure && make && make install`

Download whatever extension code you want to build
  
- See https://www.sqlite.org/contrib
- E.g. `wget -Oext.c 'https://www.sqlite.org/contrib/download/extension-functions.c?get=25'`

Compile the extension

- `gcc -fPIC -lm -shared ext.c -o libmath.so`

Upload the shared object

- scp this file to your machine
- drag it into gomix.com project
- click the "asset" to copy its url

Download asset into your project at runtime

- use the snippet in `server.js` to download the asset to the project's local data dir
- open the sqlite db
- load the extension

It's a bit convoluted but whatever!
