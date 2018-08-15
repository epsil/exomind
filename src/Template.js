import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import markdown from './markdown';
import util from './util';
import 'bootstrap/dist/css/bootstrap.css';

class Template extends Component {
  render() {
    return (
      <div className="container">
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
          {this.props.icon
            ? [
                <link
                  href={util.urlRelative(this.props.path, this.props.icon)}
                  rel="icon"
                  type="image/x-icon"
                />,
                <link
                  href={util.urlRelative(this.props.path, this.props.icon)}
                  rel="apple-touch-icon"
                />
              ]
            : this.props.path && [
                <link
                  href={util.urlRelative(this.props.path, '/favicon.ico')}
                  rel="icon"
                  type="image/x-icon"
                />,
                ...(this.props.image
                  ? [
                      <link
                        href={util.urlRelative(
                          this.props.path,
                          this.props.image
                        )}
                        rel="apple-touch-icon"
                      />
                    ]
                  : this.props['cover-image']
                    ? [
                        <link
                          href={util.urlRelative(
                            this.props.path,
                            this.props['cover-image']
                          )}
                          rel="apple-touch-icon"
                        />
                      ]
                    : [
                        <link
                          href={util.urlRelative(
                            this.props.path,
                            '/apple-touch-icon.png'
                          )}
                          rel="apple-touch-icon"
                        />
                      ])
              ]}
          <link
            href={util.urlRelative(this.props.path, '/_assets/css/wiki.css')}
            rel="stylesheet"
          />
          // <link href={this.props.url} rel="canonical" />
          <link
            href={this.props.file}
            rel="alternate"
            title="Markdown"
            type="text/markdown"
          />
          ...
          {this.props.css
            ? this.props.css.map(x => (
                <link
                  href={util.urlRelative(this.props.path, x)}
                  rel="stylesheet"
                  type="text/css"
                />
              ))
            : []}
          ...
          {this.props.stylesheet
            ? this.props.stylesheet.map(x => (
                <link
                  href={util.urlRelative(this.props.path, x)}
                  rel="stylesheet"
                  type="text/css"
                />
              ))
            : []}
          ...
          {this.props.js
            ? this.props.js.map(x => (
                <script
                  src={util.urlRelative(this.props.path, x)}
                  type="text/javascript"
                />
              ))
            : []}
          ...
          {this.props.script
            ? this.props.script.map(x => (
                <script
                  src={util.urlRelative(this.props.path, x)}
                  type="text/javascript"
                />
              ))
            : []}
          ...
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
          <script
            src={util.urlRelative(this.props.path, '/_assets/js/wiki.js')}
          />
        </Helmet>
        <header>
          <h1
            dangerouslySetInnerHTML={{
              __html: markdown.inline(this.props.title)
            }}
          />
          {this.props.author && <h2>{this.props.author}</h2>}
        </header>
        <article dangerouslySetInnerHTML={{ __html: this.props.content }} />
      </div>
    );
  }
}

export default Template;
