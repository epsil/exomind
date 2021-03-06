Exomind
=======

A Markdown-based wiki implemented in [React](REACT.md).

Organization
------------

The wiki has the following file structure:

    .
    |-- index.md
    |-- index.html
    |-- page
    |   |-- index.md
    |   `-- index.html
    `-- anotherpage
        |-- index.md
        `-- index.html

Every page has its own folder, and folders can be arbitrarily nested. The page's contents are stored in a Markdown file named `index.md`. There is also an associated `index.html` file, which uses a bit of JavaScript to dynamically render the Markdown as HTML when viewed in a browser.

Web server
----------

One of several benefits of the above file structure is that the whole wiki can be served by a web server, and every wiki page gets its own URL. If the wiki is uploaded to the server's root directory (any directory will do), the addresses become:

| URL | Page |
| --- | ---- |
| `/` | root |
| `/page/` | page |
| `/anotherpage/` | anotherpage |

The wiki can also be served locally. To do this, run `npm run http` (requires [Node](http://nodejs.org/)).

One can also open the `index.html` files directly from disk, without starting up a web server first. Unfortunately, this only works in Firefox; other browsers impose limits on [resource sharing](http://en.wikipedia.org/wiki/Same-origin_policy), and therefore require that a web server is running.

Markup
------

The wiki is written in Markdown ([Pandoc flavor](http://pandoc.org/MANUAL.html#pandocs-markdown)).

The wiki supports [metadata](http://pandoc.org/MANUAL.html#metadata-blocks) in the form of an initial YAML block:

```markdown
---
title: Page title
author: Page author
---

This is a page written in **Markdown**.
```

The wiki uses [markdown-it](https://www.npmjs.com/package/markdown-it) for its Markdown parser, which is customizable with extensions. Thus, the wiki can accommodate a number of extensions to plain Markdown syntax, such as [MathJax](https://www.npmjs.com/package/markdown-it-mathjax) markup.

Styling
-------

By default, the wiki uses [Bootstrap](http://getbootstrap.com/) to provide responsive CSS styling.

One can add custom CSS styling to a page by adding a stylesheet file to the page's directory:

    .
    `-- page
        |-- index.md
        |-- index.html
        `-- style.css

Then reference the file in the page's metadata block:

```yaml
---
title: Page title
author: Page author
css: style.css
---
```

Images
------

To add an image to a page, put it in the page's folder:

    .
    `-- page
        |-- index.md
        |-- index.html
        `-- image.jpg

Then reference it with the standard Markdown image syntax:

```markdown
![](image.jpg)
```

It is possible to reference images from anywhere, but it is good practice to bundle them together with the relevant page.

Other files
-----------

In the same way, one can bundle all kinds of files in a page's directory:

    .
    `-- page
        |-- index.md
        |-- index.html
        `-- document.pdf

Then one can reference them with a Markdown link:

```markdown
[PDF document](document.pdf)
```

Thus, the wiki can serve as a repository not only for Markdown documents, but for any kind of file that is related to the subject.

Editing
-------

A wiki page is edited by opening its `index.md` file in a text editor, making changes, and committing them with Git. A shorthand command for this is `npm run commit`. To synchronize the changes, one can use `npm run push`. One can also use standard Git commands (`git commit` and `git push`) for the same tasks.

The wiki can be edited online simply by hosting the repository at GitHub, BitBucket or a similar service. These websites lets one edit Markdown files with a user-friendly web interface.

Searching
---------

Since Markdown files are plain text, the wiki is easily searchable. A `grep` command for finding the string `markdown` would be:

    grep -Ri --exclude-dir="node_modules" --exclude-dir="resources" --include="*.md" "markdown" .

A shorthand for the above is `npm run search`. Thus, to search for `markdown`:

    npm run search markdown

Versioning
----------

The wiki uses [Git](https://git-scm.com/) to keep track of changes. The wiki is a regular Git repository, and standard Git commands work as one would expect.

It is optional, but highly recommended, to set up a remote repository for the wiki (`git remote`). Then one can back up the wiki and synchronize it across machines with `git push` and `git pull`.

Future compatibility
--------------------

Markdown is a light-weight markup language, and Markdown files are plain text. As such, they are human readable, easy to work with, and future-proof.

Markdown can also be converted to a host of other formats with [Pandoc](http://pandoc.org/), whether to other markup languages or to more conventional formats like Microsoft Word and Adobe PDF.
