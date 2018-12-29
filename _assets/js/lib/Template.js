import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import markdown from './markdown';
import util from './util';

class Template extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <html
            prefix="og: http://ogp.me/ns#"
            {...(this.props.lang ? { lang: this.props.lang } : {})}
          />
          <title>{markdown.toText(this.props.title)}</title>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          {this.props.referrer ? (
            <meta content={this.props.referrer} name="referrer" />
          ) : (
            <meta content="no-referrer" name="referrer" />
          )}
          {this.props.noindex && <meta content="noindex" name="robots" />}
          {this.props.author && (
            <meta content={markdown.toText(this.props.author)} name="author" />
          )}
          {this.props.date && (
            <meta content={util.dateFormat(this.props.date)} name="date" />
          )}
          {this.props.abstract && (
            <meta
              content={markdown.toText(this.props.abstract)}
              name="description"
            />
          )}
          {this.props.keywords && (
            <meta
              content={markdown.toText(this.props.keywords)}
              name="keywords"
            />
          )}
          {this.props.md5 && <meta content={this.props.md5} name="md5" />}
          <meta content="text/css" http-equiv="Content-Style-Type" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {this.props.title && (
            <meta content={markdown.toText(this.props.title)} name="DC.Title" />
          )}
          {this.props.author && (
            <meta
              content={markdown.toText(this.props.author)}
              name="DC.Creator"
            />
          )}
          {this.props.date && (
            <meta content={util.dateFormat(this.props.date)} name="DC.Date" />
          )}
          {this.props.abstract && (
            <meta
              content={markdown.toText(this.props.abstract)}
              name="DC.Description"
            />
          )}
          {this.props.lang && (
            <meta content={this.props.lang} name="DC.Language" />
          )}
          <meta name="DC.Format" content="text/html" />
          {this.props.title && (
            <meta content={markdown.toText(this.props.title)} name="og:title" />
          )}
          {this.props.abstract && (
            <meta
              content={markdown.toText(this.props.abstract)}
              name="og:description"
            />
          )}
          {this.props.lang && (
            <meta content={this.props.lang} name="og:locale" />
          )}
          <meta property="og:type" content="article" />
          {this.props.url && <meta content={this.props.url} name="og:url" />}
          {this.props['site-name'] && (
            <meta content={this.props['site-name']} name="og:site_name" />
          )}
          {this.props.image ? (
            <meta
              content={util.urlResolve(this.props.path, this.props.image)}
              name="og:image"
            />
          ) : (
            this.props['cover-image'] && (
              <meta
                content={util.urlResolve(
                  this.props.path,
                  this.props['cover-image']
                )}
                name="og:image"
              />
            )
          )}
          {this.props.video && (
            <meta content={this.props.video} name="og:video" />
          )}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@github" />
          {this.props.title && (
            <meta
              content={markdown.toText(this.props.title)}
              name="twitter:title"
            />
          )}
          {this.props.abstract && (
            <meta
              content={markdown.toText(this.props.abstract)}
              name="twitter:description"
            />
          )}
          {this.props.image ? (
            <meta
              content={util.urlResolve(this.props.path, this.props.image)}
              name="twitter:image"
            />
          ) : (
            this.props['cover-image'] && (
              <meta
                content={util.urlResolve(
                  this.props.path,
                  this.props['cover-image']
                )}
                name="twitter:image"
              />
            )
          )}
          {/*
this.props.icon ? (
            <React.Fragment>
              <link
                href={util.urlRelative(this.props.path, this.props.icon)}
                rel="icon"
                type="image/x-icon"
              />
              <link
                href={util.urlRelative(this.props.path, this.props.icon)}
                rel="apple-touch-icon"
              />
            </React.Fragment>
          ) : (
            this.props.path && (
              <React.Fragment>
                <link
                  href={util.urlRelative(this.props.path, '/favicon.ico')}
                  rel="icon"
                  type="image/x-icon"
                />
                {this.props.image ? (
                  <link
                    href={util.urlRelative(this.props.path, this.props.image)}
                    rel="apple-touch-icon"
                  />
                ) : this.props['cover-image'] ? (
                  <link
                    href={util.urlRelative(
                      this.props.path,
                      this.props['cover-image']
                    )}
                    rel="apple-touch-icon"
                  />
                ) : (
                  <link
                    href={util.urlRelative(
                      this.props.path,
                      '/apple-touch-icon.png'
                    )}
                    rel="apple-touch-icon"
                  />
                )}
              </React.Fragment>
            )
          )
*/}
          <link
            href={util.urlRelative(this.props.path, '/_assets/css/wiki.css')}
            rel="stylesheet"
          />
          {/* <link href={this.props.url} rel="canonical" /> */}
          <link
            href={this.props.file}
            rel="alternate"
            title="Markdown"
            type="text/markdown"
          />
          {this.props.css &&
            this.props.css.map(x => (
              <link
                href={util.urlRelative(this.props.path, x)}
                rel="stylesheet"
                type="text/css"
              />
            ))}
          {this.props.stylesheet &&
            this.props.stylesheet.map(x => (
              <link
                href={util.urlRelative(this.props.path, x)}
                rel="stylesheet"
                type="text/css"
              />
            ))}
          {this.props.js &&
            this.props.js.map(x => (
              <script
                src={util.urlRelative(this.props.path, x)}
                type="text/javascript"
              />
            ))}
          {this.props.script &&
            this.props.script.map(x => (
              <script
                src={util.urlRelative(this.props.path, x)}
                type="text/javascript"
              />
            ))}
          {this.props.mathjax && [
            <script type="text/x-mathjax-config">{`
MathJax.Hub.Config({
  'HTML-CSS': {
    preferredFont: 'STIX'
  },
  TeX: {
    equationNumbers: {
      autoNumber: 'all'
    }
  }
})
`}</script>,
            <script
              async
              src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
              type="text/javascript"
            />
          ]}
          {/* <script src={util.urlRelative(this.props.path, '/_assets/js/wiki.js')} /> */}
        </Helmet>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid topbar">
            <ul className="nav nav-pills navbar-left">
              <li role="presentation">
                <a href={util.urlRelative(this.props.path, '/')} title={markdown.toText(this.props['home-title'])}>
                  <i className="fa fa-home" />
                </a>
              </li>
            </ul>
            <ul className="nav nav-pills navbar-right">
              {this.props.nav &&
                this.props.nav.map(x => (
                  <li
                    dangerouslySetInnerHTML={{ __html: markdown.inline(x) }}
                  />
                ))}
              {/* <li role="presentation"><a href={this.props.facebook} target="_blank" title={markdown.toText(this.props['facebook-title'])}><i className="fa fa-facebook-square"></i></li> */}
              {/* <li role="presentation"><a href={this.props.twitter} target="_blank" title={markdown.toText(this.props['twitter-title'])}><i className="fa fa-twitter-square"></i></li> */}
              {/* <li role="presentation"><a href={this.props.linkedin} target="_blank" title={markdown.toText(this.props['linkedin-title'])}><i className="fa fa-linkedin-square"></i></li> */}
              {/* <li role="presentation"><a href={this.props.linkedin} target="_blank" title={markdown.toText(this.props['linkedin-title'])}><i className="fa fa-linkedin-square"></i></li> */}
              <li role="presentation">
                <a
                  href="/tmp/clipboard/"
                  target="_blank"
                  title={markdown.toText(this.props['clipboard-title'])}
                >
                  <span className="clipboard-logo" />
                </a>
              </li>
              {this.props['github-repo'] ? (
                <React.Fragment>
                  {/* <li role="presentation"> <a href={this.props.github} title={markdown.toText(this.props['github-repo-title'])} > <i className="fa fa-github" /> </a> </li> */}
                  <li role="presentation">
                    <a
                      href={this.props['github-edit']}
                      title={markdown.toText(this.props['github-edit-title'])}
                    >
                      <i className="fa fa-edit" />
                    </a>
                  </li>
                  {/* <li role="presentation"><a href={this.props['github-history']} title={markdown.toText(this.props['github-history-title'])}><i className="fa fa-history"></i></a></li> */}
                  <li role="presentation">
                    <a
                      href={this.props.file}
                      title={markdown.toText(this.props['markdown-title'])}
                      type="text/plain"
                    >
                      <span className="markdown-mark" />
                    </a>
                  </li>
                </React.Fragment>
              ) : this.props['bitbucket-repo'] ? (
                <React.Fragment>
                  <li role="presentation">
                    <a
                      href={this.props.bitbucket}
                      title={markdown.toText(
                        this.props['bitbucket-repo-title']
                      )}
                    >
                      <i className="fa fa-edit" />
                    </a>
                  </li>
                  {/* <li role="presentation"><a href={this.props['bitbucket-history']} title={markdown.toText(this.props['bitbucket-history-title'])}><i className="fa fa-history"></i></a></li> */}
                  <li role="presentation">
                    <a
                      href={this.props.file}
                      title={markdown.toText(this.props['markdown-title'])}
                      type="text/plain"
                    >
                      <span className="markdown-mark" />
                    </a>
                  </li>
                </React.Fragment>
              ) : (
                <li role="presentation">
                  <a
                    href={this.props.file}
                    title={markdown.toText(this.props['markdown-title'])}
                    type="text/plain"
                  >
                    <span className="markdown-mark" />
                  </a>
                </li>
              )}
              {this.props.toc && (
                <li role="presentation">
                  <a
                    id="toc-button"
                    href="#toc"
                    data-toggle="collapse"
                    title={markdown.toText(this.props['toc-title'])}
                  >
                    <i className="fa fa-list" />
                  </a>
                </li>
              )}
            </ul>
            <form
              action="https://www.google.com/search"
              className="navbar-form"
              method="get"
              target="_blank"
            >
              <div className="form-group" style={{ display: 'inline' }}>
                <div className="input-group" style={{ display: 'table' }}>
                  <span className="input-group-addon" style={{ width: '1%' }}>
                    <span className="glyphicon glyphicon-search" />
                  </span>
                  <input
                    accessKey="."
                    autoComplete="off"
                    className="form-control"
                    name="q"
                    title={markdown.toText(this.props['search-title'])}
                    type="text"
                  />
                </div>
              </div>
            </form>
          </div>
          {this.props.toc && typeof this.props.toc === 'string' && (
            <div
              dangerouslySetInnerHTML={{
                __html: this.props.toc
              }}
            />
          )}
        </nav>
        <article className="h-entry" id="main">
          <header>
            {this.props['include-before'] && (
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props['include-before']
                }}
              />
            )}
            {this.props.title ? (
              <React.Fragment>
                <h1 className="p-name">
                  <a
                    className="u-uid u-url"
                    href={this.props.url}
                    rel="bookmark"
                    title="Permalink"
                    dangerouslySetInnerHTML={{
                      __html: markdown.inline(this.props.title)
                    }}
                  />
                </h1>
                {this.props.subtitle && (
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: markdown.inline(this.props.subtitle)
                    }}
                  />
                )}
                {this.props.author ? (
                  this.props.author.name ? (
                    <p className="author">
                      {this.props.author.url ? (
                        <a
                          className="p-author h-card"
                          href={this.props.author.url}
                          dangerouslySetInnerHTML={{
                            __html: markdown.inline(this.props.author.name)
                          }}
                        />
                      ) : (
                        <span
                          className="p-author"
                          dangerouslySetInnerHTML={{
                            __html: markdown.inline(this.props.author.name)
                          }}
                        />
                      )}
                      {this.props.author && this.props.date && (
                        <React.Fragment>
                          {' '}
                          <span>&bull;</span>{' '}
                        </React.Fragment>
                      )}
                      {this.props.date && (
                        <time
                          className="dt-published"
                          dateTime={util.dateFormat(this.props.date)}
                        >
                          {util.dateFormat(this.props.date)}
                        </time>
                      )}
                    </p>
                  ) : (
                    <p className="author">
                      {this.props['author-url'] ? (
                        <a
                          className="p-author h-card"
                          href={this.props['author-url']}
                          dangerouslySetInnerHTML={{
                            __html: markdown.inline(this.props.author)
                          }}
                        />
                      ) : this.props['author-email'] ? (
                        <a
                          className="p-author h-card"
                          href="mailto:{this.props['author-email']}"
                          dangerouslySetInnerHTML={{
                            __html: markdown.inline(this.props.author)
                          }}
                        />
                      ) : (
                        <span
                          className="p-author"
                          dangerouslySetInnerHTML={{
                            __html: markdown.inline(this.props.author)
                          }}
                        />
                      )}
                      {this.props.author && this.props.date && (
                        <React.Fragment>
                          {' '}
                          <span>&bull;</span>{' '}
                        </React.Fragment>
                      )}
                      {this.props.date && (
                        <time
                          className="dt-published"
                          dateTime={util.dateFormat(this.props.date)}
                        >
                          {util.dateFormat(this.props.date)}
                        </time>
                      )}
                    </p>
                  )
                ) : (
                  this.props.date && (
                    <p>
                      <time
                        className="dt-published"
                        dateTime={util.dateFormat(this.props.date)}
                      >
                        {util.dateFormat(this.props.date)}
                      </time>
                    </p>
                  )
                )}
              </React.Fragment>
            ) : (
              this.props.date && (
                <h1 className="p-name">
                  <a
                    className="u-uid u-url"
                    href={this.props.url}
                    title="Permalink"
                    dangerouslySetInnerHTML={{
                      __html: util.dateFormat(this.props.date)
                    }}
                  />
                </h1>
              )
            )}
            {this.props.abstract && (
              <p
                className="p-summary"
                dangerouslySetInnerHTML={{
                  __html: markdown.inline(this.props.abstract)
                }}
              />
            )}
            {this.props.image ? (
              <figure>
                <img
                  alt="{this.props['image-alt'] && this.props['image-alt']}"
                  className="u-photo"
                  {...(this.props['image-height']
                    ? { height: this.props['image-height'] }
                    : {})}
                  {...(this.props['image-width']
                    ? { width: this.props['image-width'] }
                    : {})}
                  src={util.urlRelative(this.props.path, this.props.image)}
                />
              </figure>
            ) : (
              this.props['cover-image'] && (
                <figure>
                  <img
                    alt="{this.props['image-alt'] && this.props['image-alt']}"
                    className="u-photo"
                    {...(this.props['image-height']
                      ? { height: this.props['image-height'] }
                      : {})}
                    {...(this.props['image-width']
                      ? { width: this.props['image-width'] }
                      : {})}
                    src={util.urlRelative(this.props.path, this.props.image)}
                  />
                </figure>
              )
            )}
          </header>
          <section
            className={
              'e-content' +
              (this.props.indent ? ' indent' : '') +
              (this.props.sidenotes ? ' sidenotes' : '')
            }
          >
            <div dangerouslySetInnerHTML={{ __html: this.props.content }} />
            {this.props.footnotes &&
              (this.props['footnotes-title'] ? (
                <React.Fragment>
                  <h1
                    dangerouslySetInnerHTML={{
                      __html: markdown.inline(this.props['footnotes-title'])
                    }}
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: this.props.footnotes }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <hr className="footnotes-sep" />
                  <section
                    className="footnotes"
                    dangerouslySetInnerHTML={{ __html: this.props.footnotes }}
                  />
                </React.Fragment>
              ))}
            {this.props['include-after'] && (
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props['include-after']
                }}
              />
            )}
          </section>
        </article>
      </div>
    );
  }
}

export default Template;
