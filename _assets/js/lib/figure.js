import $ from 'jquery';

const figure = {};

figure.fixFigures = function() {
  return this.each(function() {
    $(this)
      .find('figure > img')
      .each(setClassesOnContainer);
    $(this)
      .find('p img')
      .each(createFigures);
    $(this)
      .find('a > img')
      .each(addImageLinkClass);
  });
};

function setClassesOnContainer() {
  const img = $(this);
  const fig = findImageFigure(img);
  moveAttributes(img, fig);
  addLink(img);
}

function createFigures() {
  const img = $(this);
  if (hasCaption(img)) {
    createCaptionedFigure(img);
  } else {
    createUncaptionedFigure(img);
  }
}

function addImageLinkClass() {
  const img = $(this);
  const a = img.parent();
  a.addClass('image');
}

// replace <p><img></p> with <figure><img></figure>
function createUncaptionedFigure(img) {
  const p = findImageParagraph(img);
  const isSingleImage = p.find('img').length === 1;
  if (isEmptyParagraph(p) && isSingleImage) {
    const fig = $('<figure>');
    fig.insertBefore(p);
    fig.html(p.html());
    const imgEl = fig.find('img');
    p.remove();
    if (imgEl.length === 1) {
      moveAttr('class', imgEl, fig);
    }
    addLink(imgEl);
  }
}

// create <figure> with <figcaption>
function createCaptionedFigure(img) {
  const p = findImageParagraph(img);
  const alt = img.attr('alt');
  const fig = $('<figure></figure>');
  const caption = $('<figcaption>' + alt + '</figcaption>');
  fig.append(img);
  fig.append(caption);
  moveAttributes(img, fig);
  addLink(img);
  // insert into DOM
  fig.insertBefore(p);
  if (isEmptyParagraph(p)) {
    p.remove();
  }
}

function fileName(url) {
  const segments = url.trim().split('/');
  const last = segments[segments.length - 1];
  return last;
}

function moveAttributes(img, fig) {
  moveAttr('class', img, fig);
  moveAttr('id', img, fig);
  moveWidth(img, fig);
}

function moveAttr(attr, from, to) {
  if (from.is('[' + attr + ']')) {
    to.attr(attr, from.attr(attr));
    from.removeAttr(attr);
  }
}

function moveWidth(img, fig) {
  if (img.is('[width]')) {
    const width = parseInt(img.attr('width'), 10);
    fig.css('width', width + 9 + 'px');
  }
}

function addLink(img) {
  const hasLink = img.parents('a').length > 0;
  if (!hasLink) {
    img.wrap('<a href="' + img.attr('src') + '" title="View ' + fileName(img.attr('src')) + ' in full screen"></a>');
  }
}

function findImageParagraph(img) {
  return findParent(img, 'p');
}

function findImageFigure(img) {
  return findParent(img, 'figure');
}

function findParent(el, name) {
  const tagName = name.toUpperCase();
  let parent = el.parent();
  while (parent.prop('tagName') !== tagName) {
    parent = parent.parent();
  }
  return parent;
}

function hasCaption(img) {
  const alt = img.attr('alt') || '';
  return alt.trim() !== '';
}

function isEmptyParagraph(p) {
  return p.text().trim() === '';
}

if ($ && $.fn) {
  $.fn.fixFigures = figure.fixFigures;
}

export default figure;
