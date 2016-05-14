
A mash-up of Haskell News and Luite Stegeman's hdiff site.

These are alternate versions of the Haskell News page
which adds a few convenience features:

- Hackage news items have an __(hdiff)__ link to
  Luite Stegman's hdiff Hackage mirror so you can see
  what changed in a package

- __index2.html__ has controls to toggle viewing of
news items by category -- e.g. Reddit, Haskell Cafe, Hackage, etc.

__Usage__

If you are using Safari, you can simply run:

    $ open site/haskellnews-hdiff/index.html

Otherwise you'll have to run the included proxy server `hn-proxy`:

    $ pip install requests
    $ python2.7 ./hn-proxy -p 8000
    $ open http://localhost:8000/

If you not running `hn-proxy` from the repository root, use `-d ...`
to specify the location of the `site` directory.

