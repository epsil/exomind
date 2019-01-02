import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import markdown from './markdown';
import util from './util';

const Template = props => {
  const {
    title,
    subtitle,
    date,
    author,
    'author-url': authorUrl,
    'author-email': authorEmail,
    abstract: description,
    'include-before': includeBefore,
    'include-after': includeAfter,
    keywords,
    lang,
    icon,
    image,
    'image-alt': imageAlt,
    'image-height': imageHeight,
    'image-width': imageWidth,
    'cover-image': coverImage,
    'cover-image-alt': coverImageAlt,
    'cover-image-height': coverImageHeight,
    'cover-image-width': coverImageWidth,
    css,
    stylesheet,
    js,
    script,
    video,
    mathjax,
    url,
    path,
    file,
    md5,
    nav,
    referrer,
    noindex,
    indent,
    sidenotes,
    footnotes,
    'footnotes-title': footnotesTitle,
    toc,
    'toc-title': tocTitle,
    content,
    'show-title': showTitle,
    'home-title': homeTitle,
    'search-title': searchTitle,
    'site-name': siteName,
    facebook,
    'facebook-title': facebookTitle,
    twitter,
    'twitter-title': twitterTitle,
    linkedin,
    'linkedin-title': linkedinTitle,
    'clipboard-title': clipboardTitle,
    github,
    'github-repo': githubRepo,
    'github-repo-title': githubRepoTitle,
    'github-edit': githubEdit,
    'github-edit-title': githubEditTitle,
    'github-history': githubHistory,
    'github-history-title': githubHistoryTitle,
    'markdown-title': markdownTitle,
    bitbucket,
    'bitbucket-repo': bitbucketRepo,
    'bitbucket-repo-title': bitbucketRepoTitle,
    'bitbucket-history': bitbucketHistory,
    'bitbucket-history-title': bitbucketHistoryTitle
  } = props;
  let key = 1;
  return (
    <div>
      <Helmet>
        <html prefix="og: http://ogp.me/ns#" lang={lang || 'en'} />
        <title>{markdown.toText(title)}</title>
        <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
        {referrer ? <meta content={referrer} name="referrer" /> : <meta content="no-referrer" name="referrer" />}
        {noindex && <meta content="noindex" name="robots" />}
        {author && <meta content={markdown.toText(author)} name="author" />}
        {date && <meta content={util.dateFormat(date)} name="date" />}
        {description && <meta content={markdown.toText(description)} name="description" />}
        {keywords && <meta content={markdown.toText(keywords)} name="keywords" />}
        {md5 && <meta content={md5} name="md5" />}
        <meta content="text/css" httpEquiv="Content-Style-Type" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {title && <meta content={markdown.toText(title)} name="DC.Title" />}
        {author && <meta content={markdown.toText(author)} name="DC.Creator" />}
        {date && <meta content={util.dateFormat(date)} name="DC.Date" />}
        {description && <meta content={markdown.toText(description)} name="DC.Description" />}
        {lang && <meta content={lang} name="DC.Language" />}
        <meta name="DC.Format" content="text/html" />
        {title && <meta content={markdown.toText(title)} name="og:title" />}
        {description && <meta content={markdown.toText(description)} name="og:description" />}
        {lang && <meta content={lang} name="og:locale" />}
        <meta property="og:type" content="article" />
        {url && <meta content={url} name="og:url" />}
        {siteName && <meta content={siteName} name="og:site_name" />}
        {image ? (
          <meta content={util.urlResolve(path, image)} name="og:image" />
        ) : (
          coverImage && <meta content={util.urlResolve(path, coverImage)} name="og:image" />
        )}
        {video && <meta content={video} name="og:video" />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@github" />
        {title && <meta content={markdown.toText(title)} name="twitter:title" />}
        {description && <meta content={markdown.toText(description)} name="twitter:description" />}
        {image ? (
          <meta content={util.urlResolve(path, image)} name="twitter:image" />
        ) : (
          coverImage && <meta content={util.urlResolve(path, coverImage)} name="twitter:image" />
        )}
        {icon && [
          <link href={util.urlRelative(path, icon)} key={key++} rel="icon" type="image/x-icon" />,
          <link href={util.urlRelative(path, icon)} key={key++} rel="apple-touch-icon" />
        ]}
        {icon
          ? [
              <link href={util.urlRelative(path, icon)} key={key++} rel="icon" type="image/x-icon" />,
              <link href={util.urlRelative(path, icon)} key={key++} rel="apple-touch-icon" />
            ]
          : path && [
              <link
                href={util.urlRelative(path, coverImage || '/favicon.ico')}
                key={key++}
                rel="icon"
                type="image/x-icon"
              />,
              ...(image
                ? [<link href={util.urlRelative(path, image)} key={key++} rel="apple-touch-icon" />]
                : coverImage
                ? [<link href={util.urlRelative(path, coverImage)} key={key++} rel="apple-touch-icon" />]
                : [<link href={util.urlRelative(path, '/apple-touch-icon.png')} key={key++} rel="apple-touch-icon" />])
            ]}
        <link href={util.urlRelative(path, '/_assets/css/wiki.css')} rel="stylesheet" />
        {/* <link href={url} rel="canonical" /> */}
        <link href={file} rel="alternate" title="Markdown" type="text/markdown" />
        {css && css.map(x => <link href={util.urlRelative(path, x)} key={key++} rel="stylesheet" type="text/css" />)}
        {stylesheet &&
          stylesheet.map(x => <link href={util.urlRelative(path, x)} key={key++} rel="stylesheet" type="text/css" />)}
        {js && js.map(x => <script key={key++} src={util.urlRelative(path, x)} type="text/javascript" />)}
        {script && script.map(x => <script key={key++} src={util.urlRelative(path, x)} type="text/javascript" />)}
        {mathjax && [
          <script type="text/x-mathjax-config">
            {`MathJax.Hub.Config({
  'HTML-CSS': {
    preferredFont: 'STIX'
  },
  TeX: {
    equationNumbers: {
      autoNumber: 'all'
    }
  }
})
`}
          </script>,
          <script
            async
            src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
            type="text/javascript"
          />
        ]}
        {/* <script src={util.urlRelative(path, '/_assets/js/wiki.js')} /> */}
      </Helmet>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid topbar">
          <ul className="nav nav-pills navbar-left">
            <li role="presentation">
              <a href={util.urlRelative(path, '/')} title={markdown.toText(homeTitle)}>
                <i className="fa fa-home" />
              </a>
            </li>
          </ul>
          <ul className="nav nav-pills navbar-right">
            {nav && nav.map(x => <li key={key++} dangerouslySetInnerHTML={{ __html: markdown.inline(x) }} />)}
            {/* <li role="presentation"><a href={facebook} target="_blank" title={markdown.toText(facebookTitle)}><i className="fa fa-facebook-square"></i></li> */}
            {/* <li role="presentation"><a href={twitter} target="_blank" title={markdown.toText(twitterTitle)}><i className="fa fa-twitter-square"></i></li> */}
            {/* <li role="presentation"><a href={linkedin} target="_blank" title={markdown.toText(linkedinTitle)}><i className="fa fa-linkedin-square"></i></li> */}
            {/* <li role="presentation"><a href={linkedin} target="_blank" title={markdown.toText(linkedinTitle)}><i className="fa fa-linkedin-square"></i></li> */}
            <li role="presentation">
              <a
                href={util.urlRelative(path, '/tmp/clipboard/')}
                rel="noopener noreferrer"
                target="_blank"
                title={markdown.toText(clipboardTitle)}
              >
                <span className="clipboard-logo" />
              </a>
            </li>
            {githubRepo ? (
              <React.Fragment>
                {/* <li role="presentation"> <a href={github} title={markdown.toText(githubRepoTitle)} > <i className="fa fa-github" /> </a> </li> */}
                <li role="presentation">
                  <a href={githubEdit} title={markdown.toText(githubEditTitle)}>
                    <i className="fa fa-edit" />
                  </a>
                </li>
                {/* <li role="presentation"><a href={githubHistory} title={markdown.toText(githubHistoryTitle)}><i className="fa fa-history"></i></a></li> */}
                <li role="presentation">
                  <a href={file} title={markdown.toText(markdownTitle)} type="text/plain">
                    <span className="markdown-mark" />
                  </a>
                </li>
              </React.Fragment>
            ) : bitbucketRepo ? (
              <React.Fragment>
                <li role="presentation">
                  <a href={bitbucket} title={markdown.toText(bitbucketRepoTitle)}>
                    <i className="fa fa-edit" />
                  </a>
                </li>
                {/* <li role="presentation"><a href={bitbucketHistory} title={markdown.toText(bitbucketHistoryTitle)}><i className="fa fa-history"></i></a></li> */}
                <li role="presentation">
                  <a href={file} title={markdown.toText(markdownTitle)} type="text/plain">
                    <span className="markdown-mark" />
                  </a>
                </li>
              </React.Fragment>
            ) : (
              <li role="presentation">
                <a href={file} title={markdown.toText(markdownTitle)} type="text/plain">
                  <span className="markdown-mark" />
                </a>
              </li>
            )}
            {toc && (
              <li role="presentation">
                <a id="toc-button" href="#toc" data-toggle="collapse" title={markdown.toText(tocTitle)}>
                  <i className="fa fa-list" />
                </a>
              </li>
            )}
          </ul>
          <form
            action="https://www.google.com/search"
            className="navbar-form"
            method="get"
            rel="noopener noreferrer"
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
                  title={markdown.toText(searchTitle)}
                  type="text"
                />
              </div>
            </div>
          </form>
        </div>
        {toc && typeof toc === 'string' && (
          <div
            dangerouslySetInnerHTML={{
              __html: toc
            }}
          />
        )}
      </nav>
      <article className="h-entry" id="main">
        <header>
          {includeBefore && (
            <div
              dangerouslySetInnerHTML={{
                __html: includeBefore
              }}
            />
          )}
          {title && showTitle ? (
            <React.Fragment>
              <h1 className="p-name">
                <a
                  className="u-uid u-url"
                  href={url}
                  rel="bookmark"
                  title="Permalink"
                  dangerouslySetInnerHTML={{
                    __html: markdown.inline(title)
                  }}
                />
              </h1>
              {subtitle && (
                <h2
                  dangerouslySetInnerHTML={{
                    __html: markdown.inline(subtitle)
                  }}
                />
              )}
              {author ? (
                author.name ? (
                  <p className="author">
                    {author.url ? (
                      <a
                        className="p-author h-card"
                        href={author.url}
                        dangerouslySetInnerHTML={{
                          __html: markdown.inline(author.name)
                        }}
                      />
                    ) : (
                      <span
                        className="p-author"
                        dangerouslySetInnerHTML={{
                          __html: markdown.inline(author.name)
                        }}
                      />
                    )}
                    {author && date && (
                      <React.Fragment>
                        {' '}
                        <span>&bull;</span>{' '}
                      </React.Fragment>
                    )}
                    {date && (
                      <time className="dt-published" dateTime={util.dateFormat(date)}>
                        {util.dateFormat(date)}
                      </time>
                    )}
                  </p>
                ) : (
                  <p className="author">
                    {authorUrl ? (
                      <a
                        className="p-author h-card"
                        href={authorUrl}
                        dangerouslySetInnerHTML={{
                          __html: markdown.inline(author)
                        }}
                      />
                    ) : authorEmail ? (
                      <a
                        className="p-author h-card"
                        href={'mailto:' + authorEmail}
                        dangerouslySetInnerHTML={{
                          __html: markdown.inline(author)
                        }}
                      />
                    ) : (
                      <span
                        className="p-author"
                        dangerouslySetInnerHTML={{
                          __html: markdown.inline(author)
                        }}
                      />
                    )}
                    {author && date && (
                      <React.Fragment>
                        {' '}
                        <span>&bull;</span>{' '}
                      </React.Fragment>
                    )}
                    {date && (
                      <time className="dt-published" dateTime={util.dateFormat(date)}>
                        {util.dateFormat(date)}
                      </time>
                    )}
                  </p>
                )
              ) : (
                date && (
                  <p>
                    <time className="dt-published" dateTime={util.dateFormat(date)}>
                      {util.dateFormat(date)}
                    </time>
                  </p>
                )
              )}
            </React.Fragment>
          ) : (
            date && (
              <h1 className="p-name">
                <a
                  className="u-uid u-url"
                  href={url}
                  title="Permalink"
                  dangerouslySetInnerHTML={{
                    __html: util.dateFormat(date)
                  }}
                />
              </h1>
            )
          )}
          {description && (
            <p
              className="p-summary"
              dangerouslySetInnerHTML={{
                __html: markdown.inline(description)
              }}
            />
          )}
          {image ? (
            <figure>
              <a className="image" href={util.urlRelative(path, image)}>
                <img
                  alt={imageAlt}
                  className="u-photo"
                  {...(imageHeight ? { height: imageHeight } : {})}
                  {...(imageWidth ? { width: imageWidth } : {})}
                  src={util.urlRelative(path, image)}
                />
              </a>
            </figure>
          ) : (
            coverImage && (
              <figure>
                <a className="image" href={util.urlRelative(path, coverImage)}>
                  <img
                    alt={coverImageAlt}
                    className="u-photo"
                    {...(coverImageHeight ? { height: coverImageHeight } : {})}
                    {...(coverImageWidth ? { width: coverImageWidth } : {})}
                    src={util.urlRelative(path, coverImage)}
                  />
                </a>
              </figure>
            )
          )}
        </header>
        <section className={'e-content' + (indent ? ' indent' : '') + (sidenotes ? ' sidenotes' : '')}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {footnotes &&
            (footnotesTitle ? (
              <React.Fragment>
                <h1
                  dangerouslySetInnerHTML={{
                    __html: markdown.inline(footnotesTitle)
                  }}
                />
                <div dangerouslySetInnerHTML={{ __html: footnotes }} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <section className="footnotes">
                  <hr className="footnotes-sep endnotes" />
                  <div dangerouslySetInnerHTML={{ __html: footnotes }} />
                </section>
              </React.Fragment>
            ))}
          {includeAfter && (
            <div
              dangerouslySetInnerHTML={{
                __html: includeAfter
              }}
            />
          )}
        </section>
      </article>
    </div>
  );
};

export default Template;
