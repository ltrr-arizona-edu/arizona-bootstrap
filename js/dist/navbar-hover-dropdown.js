/*!
  * Arizona Bootstrap navbar-hover-dropdown.js v5.0.4-gamma1 (https://github.com/az-digital/arizona-bootstrap)
  * Copyright 2026 The Arizona Board of Regents on behalf of The University of Arizona
  * Licensed under MIT (https://github.com/az-digital/arizona-bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../../node_modules/bootstrap/js/src/dropdown.js'), require('../../node_modules/bootstrap/js/src/dom/event-handler.js')) :
  typeof define === 'function' && define.amd ? define(['../../node_modules/bootstrap/js/src/dropdown', '../../node_modules/bootstrap/js/src/dom/event-handler'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.NavbarHoverDropdown = factory(global.Dropdown, global.EventHandler));
})(this, (function (Dropdown, EventHandler) { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _createForOfIteratorHelperLoose(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (t) return (t = t.call(r)).next.bind(t);
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var o = 0;
      return function () {
        return o >= r.length ? {
          done: true
        } : {
          done: false,
          value: r[o++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _inheritsLoose(t, o) {
    t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
  }
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
      return t.__proto__ = e, t;
    }, _setPrototypeOf(t, e);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var HOVER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)';
  var HIDE_DELAY_MS = 300;
  var supportsPointerHover = function supportsPointerHover() {
    var _window$matchMedia;
    return typeof window !== 'undefined' && (window.matchMedia == null || (_window$matchMedia = window.matchMedia(HOVER_MEDIA_QUERY)) == null ? void 0 : _window$matchMedia.matches) === true;
  };
  function getPrimaryDropdownTrigger(dropdownElement) {
    var splitToggle = dropdownElement.querySelector(':scope > .dropdown-toggle.dropdown-toggle-split');
    if (splitToggle instanceof HTMLElement) {
      return splitToggle;
    }
    var toggle = dropdownElement.querySelector(':scope > .dropdown-toggle');
    if (toggle instanceof HTMLElement) {
      return toggle;
    }
    return null;
  }
  function closeOtherDropdowns(navbar, currentDropdownElement) {
    var openDropdowns = navbar.querySelectorAll('.navbar-nav > .nav-item.dropdown.show');
    for (var _iterator = _createForOfIteratorHelperLoose(openDropdowns), _step; !(_step = _iterator()).done;) {
      var openDropdown = _step.value;
      if (openDropdown === currentDropdownElement) {
        continue;
      }
      if (!(openDropdown instanceof HTMLElement)) {
        continue;
      }
      var trigger = getPrimaryDropdownTrigger(openDropdown);
      if (!trigger) {
        continue;
      }
      var instance = Dropdown.getInstance(trigger);
      instance == null || instance.hide();
    }
  }
  var NavbarHoverDropdown = /*#__PURE__*/function (_Dropdown) {
    function NavbarHoverDropdown(element, dropdownElement, navbar, config) {
      var _this;
      _this = _Dropdown.call(this, element, config) || this;
      _this._dropdownElement = dropdownElement;
      _this._navbar = navbar;
      _this._hideTimer = null;
      _this._shouldCloseSiblings = dropdownElement.matches('.navbar-nav > .nav-item.dropdown');
      _this._hoverTriggered = false;
      _this._suppressNextBlur = false;
      if (supportsPointerHover()) {
        _this._addHoverListeners();
      }
      return _this;
    }
    _inheritsLoose(NavbarHoverDropdown, _Dropdown);
    var _proto = NavbarHoverDropdown.prototype;
    _proto.dispose = function dispose() {
      this._removeHoverListeners();
      _Dropdown.prototype.dispose.call(this);
    };
    _proto._addHoverListeners = function _addHoverListeners() {
      var _this2 = this;
      if (!this._dropdownElement) {
        return;
      }
      this._boundOnEnter = function () {
        return _this2._handleHoverEnter();
      };
      this._boundOnLeave = function () {
        return _this2._handleHoverLeave();
      };
      this._boundMenuEnter = function () {
        return _this2._cancelScheduledHide();
      };
      this._boundMenuLeave = function () {
        return _this2._handleHoverLeave();
      };
      this._boundOnFocus = function (event) {
        return _this2._handleFocus(event);
      };
      this._boundOnBlur = function (event) {
        return _this2._handleBlur(event);
      };
      EventHandler.on(this._element, 'mouseenter', this._boundOnEnter);
      EventHandler.on(this._element, 'mouseleave', this._boundOnLeave);
      EventHandler.on(this._element, 'focus', this._boundOnFocus);
      EventHandler.on(this._element, 'blur', this._boundOnBlur);
      EventHandler.on(this._dropdownElement, 'mouseleave', this._boundOnLeave);
      if (this._menu) {
        EventHandler.on(this._menu, 'mouseenter', this._boundMenuEnter);
        EventHandler.on(this._menu, 'mouseleave', this._boundMenuLeave);
      }
    };
    _proto._removeHoverListeners = function _removeHoverListeners() {
      if (!this._dropdownElement || !supportsPointerHover()) {
        return;
      }
      EventHandler.off(this._element, 'mouseenter', this._boundOnEnter);
      EventHandler.off(this._element, 'mouseleave', this._boundOnLeave);
      EventHandler.off(this._element, 'focus', this._boundOnFocus);
      EventHandler.off(this._element, 'blur', this._boundOnBlur);
      EventHandler.off(this._dropdownElement, 'mouseleave', this._boundOnLeave);
      if (this._menu) {
        EventHandler.off(this._menu, 'mouseenter', this._boundMenuEnter);
        EventHandler.off(this._menu, 'mouseleave', this._boundMenuLeave);
      }
    };
    _proto._handleHoverEnter = function _handleHoverEnter() {
      this._cancelScheduledHide();
      this._hoverTriggered = true;
      if (this._shouldCloseSiblings && this._navbar && this._dropdownElement) {
        closeOtherDropdowns(this._navbar, this._dropdownElement);
      }
      this.show();
      this._removePointerFocus();
    };
    _proto._handleHoverLeave = function _handleHoverLeave() {
      this._scheduleHide();
    };
    _proto._handleFocus = function _handleFocus(event) {
      var _this$_menu;
      if (event.relatedTarget && (_this$_menu = this._menu) != null && _this$_menu.contains(event.relatedTarget)) {
        return;
      }
      this._cancelScheduledHide();
      this.show();
    };
    _proto._handleBlur = function _handleBlur(event) {
      var _this$_menu2;
      if (this._suppressNextBlur) {
        this._suppressNextBlur = false;
        return;
      }
      if (event.relatedTarget && (_this$_menu2 = this._menu) != null && _this$_menu2.contains(event.relatedTarget)) {
        return;
      }
      this._scheduleHide();
    };
    _proto._scheduleHide = function _scheduleHide() {
      var _this3 = this;
      this._cancelScheduledHide();
      this._hideTimer = window.setTimeout(function () {
        _this3.hide();
      }, HIDE_DELAY_MS);
    };
    _proto._cancelScheduledHide = function _cancelScheduledHide() {
      if (this._hideTimer) {
        window.clearTimeout(this._hideTimer);
        this._hideTimer = null;
      }
    };
    _proto._removePointerFocus = function _removePointerFocus() {
      if (!this._hoverTriggered) {
        return;
      }
      if (document.activeElement === this._element) {
        this._suppressNextBlur = true;
        this._element.blur();
      }
      this._hoverTriggered = false;
    };
    return NavbarHoverDropdown;
  }(Dropdown);
  function enableAzNavbarHoverDropdowns() {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }
    var navbars = document.querySelectorAll('.navbar-az');
    if (!navbars.length) {
      return;
    }
    if (!supportsPointerHover()) {
      return;
    }
    var _loop = function _loop() {
      var navbar = _step2.value;
      EventHandler.on(navbar, 'mouseleave', function () {
        var openTriggers = navbar.querySelectorAll('.dropdown-toggle.show');
        for (var _iterator3 = _createForOfIteratorHelperLoose(openTriggers), _step3; !(_step3 = _iterator3()).done;) {
          var _Dropdown$getInstance;
          var trigger = _step3.value;
          (_Dropdown$getInstance = Dropdown.getInstance(trigger)) == null || _Dropdown$getInstance.hide();
        }
      });
      var dropdowns = navbar.querySelectorAll('.navbar-nav > .nav-item.dropdown');
      for (var _iterator4 = _createForOfIteratorHelperLoose(dropdowns), _step4; !(_step4 = _iterator4()).done;) {
        var dropdownElement = _step4.value;
        if (!(dropdownElement instanceof HTMLElement)) {
          continue;
        }
        var triggerElement = getPrimaryDropdownTrigger(dropdownElement);
        if (!triggerElement) {
          continue;
        }
        var existingInstance = Dropdown.getInstance(triggerElement);
        if (existingInstance && !(existingInstance instanceof NavbarHoverDropdown)) {
          existingInstance.dispose();
        }
        if (existingInstance instanceof NavbarHoverDropdown) {
          continue;
        }
        createNavbarHoverDropdown(triggerElement, dropdownElement, navbar);
      }
    };
    for (var _iterator2 = _createForOfIteratorHelperLoose(navbars), _step2; !(_step2 = _iterator2()).done;) {
      _loop();
    }
  }
  function createNavbarHoverDropdown(triggerElement, dropdownElement, navbar) {
    return new NavbarHoverDropdown(triggerElement, dropdownElement, navbar);
  }

  return enableAzNavbarHoverDropdowns;

}));
//# sourceMappingURL=navbar-hover-dropdown.js.map
