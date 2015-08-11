import $ from 'jquery';

const CHARIOT_COMPUTED_STYLE_CLASS_PREFIX = 'chariot_computed_styles';

class Style {
  static calculateLeft($tooltip, $anchor, xOffset, position, arrowOffset) {
    let offset = 0;
    switch (position) {
      case 'left':
        offset = $anchor.offset().left - $tooltip.outerWidth() + xOffset - arrowOffset;
        break;
      case 'right':
        offset = $anchor.offset().left + $anchor.outerWidth() + xOffset + arrowOffset;
        break;
      case 'top':
      case 'bottom':
        offset = $anchor.offset().left + $anchor.outerWidth() / 2 -
          $tooltip.outerWidth() / 2 + xOffset;
        break;
      default:
        break;
    }
    return offset;
  }

  static calculateTop($tooltip, $anchor, yOffset, position, arrowOffset) {
    let offset = 0;
    switch (position) {
      case 'top':
        offset = $anchor.offset().top - $tooltip.outerHeight() + yOffset - arrowOffset;
        break;
      case 'bottom':
        offset = $anchor.offset().top + $anchor.outerHeight() + yOffset + arrowOffset;
        break;
      case 'left':
      case 'right':
        offset = $anchor.offset().top + $anchor.outerHeight() / 2 -
          $tooltip.outerHeight() / 2 + yOffset;
        break;
      default:
        break;
    }
    return offset;
  }

  static getComputedStylesFor(element) {
    if (element._chariotComputedStyles) {
      return element._chariotComputedStyles;
    } else {
      return this._cacheStyleFor(element);
    }
  }

  static cloneStyles($element, $clone) {
    let start = new Date().getTime();
    let cssText = this.getComputedStylesFor($element[0]);
    $clone[0].style.cssText = cssText;

    // Fixes IE border box boxing model
    if (navigator.userAgent.match(/msie|windows/i)) {
      this._ieBoxModelStyleFix('width', $clone, cssText);
      this._ieBoxModelStyleFix('height', $clone, cssText);
    }
    $clone.css('pointer-events', 'none');
    //this._clonePseudoStyle($element, $clone, 'before');
    //this._clonePseudoStyle($element, $clone, 'after');
  }

  static clearCachedStylesForElement($element) {
    if (!$element || !$element.length) return;
    $element[0]._chariotComputedStyles = null;
    $.each($element.children(), (index, child) => {
      this.clearCachedStylesForElement($(child));
    });
  }

  static _ieBoxModelStyleFix(style, $ele, cssText) {
    let match = cssText.match(new RegExp(`; ${style}: ([^;]*)`));
    let value = (match && match.length > 1) ? parseInt(match[1]) : 0;
    if (value != 0 && !isNaN(value)) {
      $ele[style](value);
    }
  }

  static _generateUniqueClassName(prefix = 'class') {
    return `${prefix}_${Math.floor(Math.random() * 1000000)}`;
  }

  // NOTE: unused currently
  static _clonePseudoStyle($element, $clone, pseudoClass) {
    let pseudoStyle = window.getComputedStyle($element[0], `:${pseudoClass}` );
    if (pseudoStyle.content && pseudoStyle.content !== '') {
      let className = this._generateUniqueClassName();
      $clone.addClass(className);
      document.styleSheets[0].insertRule(`.${className}::${pseudoClass} {
        ${pseudoStyle.cssText}; content: ${pseudoStyle.content}; }`,
        0);
    }
  }

  static _cacheStyleFor(element) {
    // check for IE getComputedCSSText()
    let computedStyles;
    if (navigator.userAgent.match(/msie|windows|firefox/i)) {
      computedStyles = element.getComputedCSSText();
    } else {
      computedStyles = document.defaultView.getComputedStyle(element).cssText;
    }

    Object.defineProperty(element, '_chariotComputedStyles', {
      value: computedStyles,
      enumerable: false,
      writable: true,
      configurable: false
    });

    return computedStyles;
  }
}
export default Style;
