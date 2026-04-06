"use strict";
window.domA11y = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/dom-accessibility-api/dist/polyfills/array.from.js
  var require_array_from = __commonJS({
    "node_modules/dom-accessibility-api/dist/polyfills/array.from.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.default = arrayFrom;
      var toStr = Object.prototype.toString;
      function isCallable(fn) {
        return typeof fn === "function" || toStr.call(fn) === "[object Function]";
      }
      function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      }
      var maxSafeInteger = Math.pow(2, 53) - 1;
      function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      }
      function arrayFrom(arrayLike, mapFn) {
        var C = Array;
        var items = Object(arrayLike);
        if (arrayLike == null) {
          throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }
        if (typeof mapFn !== "undefined") {
          if (!isCallable(mapFn)) {
            throw new TypeError("Array.from: when provided, the second argument must be a function");
          }
        }
        var len = toLength(items.length);
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        var k = 0;
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = mapFn(kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        A.length = len;
        return A;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/polyfills/SetLike.js
  var require_SetLike = __commonJS({
    "node_modules/dom-accessibility-api/dist/polyfills/SetLike.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.default = void 0;
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i)) return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var SetLike = /* @__PURE__ */ (function() {
        function SetLike2() {
          var items = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
          _classCallCheck(this, SetLike2);
          _defineProperty(this, "items", void 0);
          this.items = items;
        }
        return _createClass(SetLike2, [{
          key: "add",
          value: function add(value) {
            if (this.has(value) === false) {
              this.items.push(value);
            }
            return this;
          }
        }, {
          key: "clear",
          value: function clear() {
            this.items = [];
          }
        }, {
          key: "delete",
          value: function _delete(value) {
            var previousLength = this.items.length;
            this.items = this.items.filter(function(item) {
              return item !== value;
            });
            return previousLength !== this.items.length;
          }
        }, {
          key: "forEach",
          value: function forEach(callbackfn) {
            var _this = this;
            this.items.forEach(function(item) {
              callbackfn(item, item, _this);
            });
          }
        }, {
          key: "has",
          value: function has(value) {
            return this.items.indexOf(value) !== -1;
          }
        }, {
          key: "size",
          get: function get() {
            return this.items.length;
          }
        }]);
      })();
      var _default = exports.default = typeof Set === "undefined" ? Set : SetLike;
    }
  });

  // node_modules/dom-accessibility-api/dist/getRole.js
  var require_getRole = __commonJS({
    "node_modules/dom-accessibility-api/dist/getRole.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.default = getRole;
      exports.getLocalName = getLocalName;
      var _util = require_util();
      function getLocalName(element) {
        var _element$localName;
        return (
          // eslint-disable-next-line no-restricted-properties -- actual guard for environments without localName
          (_element$localName = element.localName) !== null && _element$localName !== void 0 ? _element$localName : (
            // eslint-disable-next-line no-restricted-properties -- required for the fallback
            element.tagName.toLowerCase()
          )
        );
      }
      var localNameToRoleMappings = {
        article: "article",
        aside: "complementary",
        button: "button",
        datalist: "listbox",
        dd: "definition",
        details: "group",
        dialog: "dialog",
        dt: "term",
        fieldset: "group",
        figure: "figure",
        // WARNING: Only with an accessible name
        form: "form",
        footer: "contentinfo",
        h1: "heading",
        h2: "heading",
        h3: "heading",
        h4: "heading",
        h5: "heading",
        h6: "heading",
        header: "banner",
        hr: "separator",
        html: "document",
        legend: "legend",
        li: "listitem",
        math: "math",
        main: "main",
        menu: "list",
        nav: "navigation",
        ol: "list",
        optgroup: "group",
        // WARNING: Only in certain context
        option: "option",
        output: "status",
        progress: "progressbar",
        // WARNING: Only with an accessible name
        section: "region",
        summary: "button",
        table: "table",
        tbody: "rowgroup",
        textarea: "textbox",
        tfoot: "rowgroup",
        // WARNING: Only in certain context
        td: "cell",
        th: "columnheader",
        thead: "rowgroup",
        tr: "row",
        ul: "list"
      };
      var prohibitedAttributes = {
        caption: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        code: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        deletion: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        emphasis: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        generic: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby", "aria-roledescription"]),
        insertion: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        none: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        paragraph: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        presentation: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        strong: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        subscript: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        superscript: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"])
      };
      function hasGlobalAriaAttributes(element, role) {
        return [
          "aria-atomic",
          "aria-busy",
          "aria-controls",
          "aria-current",
          "aria-description",
          "aria-describedby",
          "aria-details",
          // "disabled",
          "aria-dropeffect",
          // "errormessage",
          "aria-flowto",
          "aria-grabbed",
          // "haspopup",
          "aria-hidden",
          // "invalid",
          "aria-keyshortcuts",
          "aria-label",
          "aria-labelledby",
          "aria-live",
          "aria-owns",
          "aria-relevant",
          "aria-roledescription"
        ].some(function(attributeName) {
          var _prohibitedAttributes;
          return element.hasAttribute(attributeName) && !((_prohibitedAttributes = prohibitedAttributes[role]) !== null && _prohibitedAttributes !== void 0 && _prohibitedAttributes.has(attributeName));
        });
      }
      function ignorePresentationalRole(element, implicitRole) {
        return hasGlobalAriaAttributes(element, implicitRole);
      }
      function getRole(element) {
        var explicitRole = getExplicitRole(element);
        if (explicitRole === null || _util.presentationRoles.indexOf(explicitRole) !== -1) {
          var implicitRole = getImplicitRole(element);
          if (_util.presentationRoles.indexOf(explicitRole || "") === -1 || ignorePresentationalRole(element, implicitRole || "")) {
            return implicitRole;
          }
        }
        return explicitRole;
      }
      function getImplicitRole(element) {
        var mappedByTag = localNameToRoleMappings[getLocalName(element)];
        if (mappedByTag !== void 0) {
          return mappedByTag;
        }
        switch (getLocalName(element)) {
          case "a":
          case "area":
          case "link":
            if (element.hasAttribute("href")) {
              return "link";
            }
            break;
          case "img":
            if (element.getAttribute("alt") === "" && !ignorePresentationalRole(element, "img")) {
              return "presentation";
            }
            return "img";
          case "input": {
            var _ref = element, type = _ref.type;
            switch (type) {
              case "button":
              case "image":
              case "reset":
              case "submit":
                return "button";
              case "checkbox":
              case "radio":
                return type;
              case "range":
                return "slider";
              case "email":
              case "tel":
              case "text":
              case "url":
                if (element.hasAttribute("list")) {
                  return "combobox";
                }
                return "textbox";
              case "search":
                if (element.hasAttribute("list")) {
                  return "combobox";
                }
                return "searchbox";
              case "number":
                return "spinbutton";
              default:
                return null;
            }
          }
          case "select":
            if (element.hasAttribute("multiple") || element.size > 1) {
              return "listbox";
            }
            return "combobox";
        }
        return null;
      }
      function getExplicitRole(element) {
        var role = element.getAttribute("role");
        if (role !== null) {
          var explicitRole = role.trim().split(" ")[0];
          if (explicitRole.length > 0) {
            return explicitRole;
          }
        }
        return null;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/util.js
  var require_util = __commonJS({
    "node_modules/dom-accessibility-api/dist/util.js"(exports) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      exports.__esModule = true;
      exports.hasAnyConcreteRoles = hasAnyConcreteRoles;
      exports.isElement = isElement;
      exports.isHTMLFieldSetElement = isHTMLFieldSetElement;
      exports.isHTMLInputElement = isHTMLInputElement;
      exports.isHTMLLegendElement = isHTMLLegendElement;
      exports.isHTMLOptGroupElement = isHTMLOptGroupElement;
      exports.isHTMLSelectElement = isHTMLSelectElement;
      exports.isHTMLSlotElement = isHTMLSlotElement;
      exports.isHTMLTableCaptionElement = isHTMLTableCaptionElement;
      exports.isHTMLTableElement = isHTMLTableElement;
      exports.isHTMLTextAreaElement = isHTMLTextAreaElement;
      exports.isSVGElement = isSVGElement;
      exports.isSVGSVGElement = isSVGSVGElement;
      exports.isSVGTitleElement = isSVGTitleElement;
      exports.presentationRoles = void 0;
      exports.queryIdRefs = queryIdRefs;
      exports.safeWindow = safeWindow;
      var _getRole = _interopRequireWildcard(require_getRole());
      exports.getLocalName = _getRole.getLocalName;
      function _getRequireWildcardCache(e) {
        if ("function" != typeof WeakMap) return null;
        var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(e2) {
          return e2 ? t : r;
        })(e);
      }
      function _interopRequireWildcard(e, r) {
        if (!r && e && e.__esModule) return e;
        if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e };
        var t = _getRequireWildcardCache(r);
        if (t && t.has(e)) return t.get(e);
        var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
          var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
          i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
        }
        return n.default = e, t && t.set(e, n), n;
      }
      var presentationRoles = exports.presentationRoles = ["presentation", "none"];
      function isElement(node) {
        return node !== null && node.nodeType === node.ELEMENT_NODE;
      }
      function isHTMLTableCaptionElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "caption";
      }
      function isHTMLInputElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "input";
      }
      function isHTMLOptGroupElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "optgroup";
      }
      function isHTMLSelectElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "select";
      }
      function isHTMLTableElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "table";
      }
      function isHTMLTextAreaElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "textarea";
      }
      function safeWindow(node) {
        var _ref = node.ownerDocument === null ? node : node.ownerDocument, defaultView = _ref.defaultView;
        if (defaultView === null) {
          throw new TypeError("no window available");
        }
        return defaultView;
      }
      function isHTMLFieldSetElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "fieldset";
      }
      function isHTMLLegendElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "legend";
      }
      function isHTMLSlotElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "slot";
      }
      function isSVGElement(node) {
        return isElement(node) && node.ownerSVGElement !== void 0;
      }
      function isSVGSVGElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "svg";
      }
      function isSVGTitleElement(node) {
        return isSVGElement(node) && (0, _getRole.getLocalName)(node) === "title";
      }
      function queryIdRefs(node, attributeName) {
        if (isElement(node) && node.hasAttribute(attributeName)) {
          var ids = node.getAttribute(attributeName).split(" ");
          var root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
          return ids.map(function(id) {
            return root.getElementById(id);
          }).filter(
            function(element) {
              return element !== null;
            }
            // TODO: why does this not narrow?
          );
        }
        return [];
      }
      function hasAnyConcreteRoles(node, roles) {
        if (isElement(node)) {
          return roles.indexOf((0, _getRole.default)(node)) !== -1;
        }
        return false;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/accessible-name-and-description.js
  var require_accessible_name_and_description = __commonJS({
    "node_modules/dom-accessibility-api/dist/accessible-name-and-description.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.computeTextAlternative = computeTextAlternative;
      var _array = _interopRequireDefault(require_array_from());
      var _SetLike = _interopRequireDefault(require_SetLike());
      var _util = require_util();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function asFlatString(s) {
        return s.trim().replace(/\s\s+/g, " ");
      }
      function isHidden(node, getComputedStyleImplementation) {
        if (!(0, _util.isElement)(node)) {
          return false;
        }
        if (node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true") {
          return true;
        }
        var style = getComputedStyleImplementation(node);
        return style.getPropertyValue("display") === "none" || style.getPropertyValue("visibility") === "hidden";
      }
      function isControl(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["button", "combobox", "listbox", "textbox"]) || hasAbstractRole(node, "range");
      }
      function hasAbstractRole(node, role) {
        if (!(0, _util.isElement)(node)) {
          return false;
        }
        switch (role) {
          case "range":
            return (0, _util.hasAnyConcreteRoles)(node, ["meter", "progressbar", "scrollbar", "slider", "spinbutton"]);
          default:
            throw new TypeError("No knowledge about abstract role '".concat(role, "'. This is likely a bug :("));
        }
      }
      function querySelectorAllSubtree(element, selectors) {
        var elements = (0, _array.default)(element.querySelectorAll(selectors));
        (0, _util.queryIdRefs)(element, "aria-owns").forEach(function(root) {
          elements.push.apply(elements, (0, _array.default)(root.querySelectorAll(selectors)));
        });
        return elements;
      }
      function querySelectedOptions(listbox) {
        if ((0, _util.isHTMLSelectElement)(listbox)) {
          return listbox.selectedOptions || querySelectorAllSubtree(listbox, "[selected]");
        }
        return querySelectorAllSubtree(listbox, '[aria-selected="true"]');
      }
      function isMarkedPresentational(node) {
        return (0, _util.hasAnyConcreteRoles)(node, _util.presentationRoles);
      }
      function isNativeHostLanguageTextAlternativeElement(node) {
        return (0, _util.isHTMLTableCaptionElement)(node);
      }
      function allowsNameFromContent(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "label", "legend", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowheader", "switch", "tab", "tooltip", "treeitem"]);
      }
      function isDescendantOfNativeHostLanguageTextAlternativeElement(node) {
        return false;
      }
      function getValueOfTextbox(element) {
        if ((0, _util.isHTMLInputElement)(element) || (0, _util.isHTMLTextAreaElement)(element)) {
          return element.value;
        }
        return element.textContent || "";
      }
      function getTextualContent(declaration) {
        var content = declaration.getPropertyValue("content");
        if (/^["'].*["']$/.test(content)) {
          return content.slice(1, -1);
        }
        return "";
      }
      function isLabelableElement(element) {
        var localName = (0, _util.getLocalName)(element);
        return localName === "button" || localName === "input" && element.getAttribute("type") !== "hidden" || localName === "meter" || localName === "output" || localName === "progress" || localName === "select" || localName === "textarea";
      }
      function findLabelableElement(element) {
        if (isLabelableElement(element)) {
          return element;
        }
        var labelableElement = null;
        element.childNodes.forEach(function(childNode) {
          if (labelableElement === null && (0, _util.isElement)(childNode)) {
            var descendantLabelableElement = findLabelableElement(childNode);
            if (descendantLabelableElement !== null) {
              labelableElement = descendantLabelableElement;
            }
          }
        });
        return labelableElement;
      }
      function getControlOfLabel(label) {
        if (label.control !== void 0) {
          return label.control;
        }
        var htmlFor = label.getAttribute("for");
        if (htmlFor !== null) {
          return label.ownerDocument.getElementById(htmlFor);
        }
        return findLabelableElement(label);
      }
      function getLabels(element) {
        var labelsProperty = element.labels;
        if (labelsProperty === null) {
          return labelsProperty;
        }
        if (labelsProperty !== void 0) {
          return (0, _array.default)(labelsProperty);
        }
        if (!isLabelableElement(element)) {
          return null;
        }
        var document = element.ownerDocument;
        return (0, _array.default)(document.querySelectorAll("label")).filter(function(label) {
          return getControlOfLabel(label) === element;
        });
      }
      function getSlotContents(slot) {
        var assignedNodes = slot.assignedNodes();
        if (assignedNodes.length === 0) {
          return (0, _array.default)(slot.childNodes);
        }
        return assignedNodes;
      }
      function computeTextAlternative(root) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var consultedNodes = new _SetLike.default();
        var computedStyles = typeof Map === "undefined" ? void 0 : /* @__PURE__ */ new Map();
        var window = (0, _util.safeWindow)(root);
        var _options$compute = options.compute, compute = _options$compute === void 0 ? "name" : _options$compute, _options$computedStyl = options.computedStyleSupportsPseudoElements, computedStyleSupportsPseudoElements = _options$computedStyl === void 0 ? options.getComputedStyle !== void 0 : _options$computedStyl, _options$getComputedS = options.getComputedStyle, uncachedGetComputedStyle = _options$getComputedS === void 0 ? window.getComputedStyle.bind(window) : _options$getComputedS, _options$hidden = options.hidden, hidden = _options$hidden === void 0 ? false : _options$hidden;
        var getComputedStyle = function getComputedStyle2(el, pseudoElement) {
          if (pseudoElement !== void 0) {
            throw new Error("use uncachedGetComputedStyle directly for pseudo elements");
          }
          if (computedStyles === void 0) {
            return uncachedGetComputedStyle(el);
          }
          var cachedStyles = computedStyles.get(el);
          if (cachedStyles) {
            return cachedStyles;
          }
          var style = uncachedGetComputedStyle(el, pseudoElement);
          computedStyles.set(el, style);
          return style;
        };
        function computeMiscTextAlternative(node, context) {
          var accumulatedText = "";
          if ((0, _util.isElement)(node) && computedStyleSupportsPseudoElements) {
            var pseudoBefore = uncachedGetComputedStyle(node, "::before");
            var beforeContent = getTextualContent(pseudoBefore);
            accumulatedText = "".concat(beforeContent, " ").concat(accumulatedText);
          }
          var childNodes = (0, _util.isHTMLSlotElement)(node) ? getSlotContents(node) : (0, _array.default)(node.childNodes).concat((0, _util.queryIdRefs)(node, "aria-owns"));
          childNodes.forEach(function(child) {
            var result = computeTextAlternative2(child, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false,
              recursion: true
            });
            var display = (0, _util.isElement)(child) ? getComputedStyle(child).getPropertyValue("display") : "inline";
            var separator = display !== "inline" ? " " : "";
            accumulatedText += "".concat(separator).concat(result).concat(separator);
          });
          if ((0, _util.isElement)(node) && computedStyleSupportsPseudoElements) {
            var pseudoAfter = uncachedGetComputedStyle(node, "::after");
            var afterContent = getTextualContent(pseudoAfter);
            accumulatedText = "".concat(accumulatedText, " ").concat(afterContent);
          }
          return accumulatedText.trim();
        }
        function useAttribute(element, attributeName) {
          var attribute = element.getAttributeNode(attributeName);
          if (attribute !== null && !consultedNodes.has(attribute) && attribute.value.trim() !== "") {
            consultedNodes.add(attribute);
            return attribute.value;
          }
          return null;
        }
        function computeTooltipAttributeValue(node) {
          if (!(0, _util.isElement)(node)) {
            return null;
          }
          return useAttribute(node, "title");
        }
        function computeElementTextAlternative(node) {
          if (!(0, _util.isElement)(node)) {
            return null;
          }
          if ((0, _util.isHTMLFieldSetElement)(node)) {
            consultedNodes.add(node);
            var children = (0, _array.default)(node.childNodes);
            for (var i = 0; i < children.length; i += 1) {
              var child = children[i];
              if ((0, _util.isHTMLLegendElement)(child)) {
                return computeTextAlternative2(child, {
                  isEmbeddedInLabel: false,
                  isReferenced: false,
                  recursion: false
                });
              }
            }
          } else if ((0, _util.isHTMLTableElement)(node)) {
            consultedNodes.add(node);
            var _children = (0, _array.default)(node.childNodes);
            for (var _i = 0; _i < _children.length; _i += 1) {
              var _child = _children[_i];
              if ((0, _util.isHTMLTableCaptionElement)(_child)) {
                return computeTextAlternative2(_child, {
                  isEmbeddedInLabel: false,
                  isReferenced: false,
                  recursion: false
                });
              }
            }
          } else if ((0, _util.isSVGSVGElement)(node)) {
            consultedNodes.add(node);
            var _children2 = (0, _array.default)(node.childNodes);
            for (var _i2 = 0; _i2 < _children2.length; _i2 += 1) {
              var _child2 = _children2[_i2];
              if ((0, _util.isSVGTitleElement)(_child2)) {
                return _child2.textContent;
              }
            }
            return null;
          } else if ((0, _util.getLocalName)(node) === "img" || (0, _util.getLocalName)(node) === "area") {
            var nameFromAlt = useAttribute(node, "alt");
            if (nameFromAlt !== null) {
              return nameFromAlt;
            }
          } else if ((0, _util.isHTMLOptGroupElement)(node)) {
            var nameFromLabel = useAttribute(node, "label");
            if (nameFromLabel !== null) {
              return nameFromLabel;
            }
          }
          if ((0, _util.isHTMLInputElement)(node) && (node.type === "button" || node.type === "submit" || node.type === "reset")) {
            var nameFromValue = useAttribute(node, "value");
            if (nameFromValue !== null) {
              return nameFromValue;
            }
            if (node.type === "submit") {
              return "Submit";
            }
            if (node.type === "reset") {
              return "Reset";
            }
          }
          var labels = getLabels(node);
          if (labels !== null && labels.length !== 0) {
            consultedNodes.add(node);
            return (0, _array.default)(labels).map(function(element) {
              return computeTextAlternative2(element, {
                isEmbeddedInLabel: true,
                isReferenced: false,
                recursion: true
              });
            }).filter(function(label) {
              return label.length > 0;
            }).join(" ");
          }
          if ((0, _util.isHTMLInputElement)(node) && node.type === "image") {
            var _nameFromAlt = useAttribute(node, "alt");
            if (_nameFromAlt !== null) {
              return _nameFromAlt;
            }
            var nameFromTitle = useAttribute(node, "title");
            if (nameFromTitle !== null) {
              return nameFromTitle;
            }
            return "Submit Query";
          }
          if ((0, _util.hasAnyConcreteRoles)(node, ["button"])) {
            var nameFromSubTree = computeMiscTextAlternative(node, {
              isEmbeddedInLabel: false,
              isReferenced: false
            });
            if (nameFromSubTree !== "") {
              return nameFromSubTree;
            }
          }
          return null;
        }
        function computeTextAlternative2(current, context) {
          if (consultedNodes.has(current)) {
            return "";
          }
          if (!hidden && isHidden(current, getComputedStyle) && !context.isReferenced) {
            consultedNodes.add(current);
            return "";
          }
          var labelAttributeNode = (0, _util.isElement)(current) ? current.getAttributeNode("aria-labelledby") : null;
          var labelElements = labelAttributeNode !== null && !consultedNodes.has(labelAttributeNode) ? (0, _util.queryIdRefs)(current, "aria-labelledby") : [];
          if (compute === "name" && !context.isReferenced && labelElements.length > 0) {
            consultedNodes.add(labelAttributeNode);
            return labelElements.map(function(element) {
              return computeTextAlternative2(element, {
                isEmbeddedInLabel: context.isEmbeddedInLabel,
                isReferenced: true,
                // this isn't recursion as specified, otherwise we would skip
                // `aria-label` in
                // <input id="myself" aria-label="foo" aria-labelledby="myself"
                recursion: false
              });
            }).join(" ");
          }
          var skipToStep2E = context.recursion && isControl(current) && compute === "name";
          if (!skipToStep2E) {
            var ariaLabel = ((0, _util.isElement)(current) && current.getAttribute("aria-label") || "").trim();
            if (ariaLabel !== "" && compute === "name") {
              consultedNodes.add(current);
              return ariaLabel;
            }
            if (!isMarkedPresentational(current)) {
              var elementTextAlternative = computeElementTextAlternative(current);
              if (elementTextAlternative !== null) {
                consultedNodes.add(current);
                return elementTextAlternative;
              }
            }
          }
          if ((0, _util.hasAnyConcreteRoles)(current, ["menu"])) {
            consultedNodes.add(current);
            return "";
          }
          if (skipToStep2E || context.isEmbeddedInLabel || context.isReferenced) {
            if ((0, _util.hasAnyConcreteRoles)(current, ["combobox", "listbox"])) {
              consultedNodes.add(current);
              var selectedOptions = querySelectedOptions(current);
              if (selectedOptions.length === 0) {
                return (0, _util.isHTMLInputElement)(current) ? current.value : "";
              }
              return (0, _array.default)(selectedOptions).map(function(selectedOption) {
                return computeTextAlternative2(selectedOption, {
                  isEmbeddedInLabel: context.isEmbeddedInLabel,
                  isReferenced: false,
                  recursion: true
                });
              }).join(" ");
            }
            if (hasAbstractRole(current, "range")) {
              consultedNodes.add(current);
              if (current.hasAttribute("aria-valuetext")) {
                return current.getAttribute("aria-valuetext");
              }
              if (current.hasAttribute("aria-valuenow")) {
                return current.getAttribute("aria-valuenow");
              }
              return current.getAttribute("value") || "";
            }
            if ((0, _util.hasAnyConcreteRoles)(current, ["textbox"])) {
              consultedNodes.add(current);
              return getValueOfTextbox(current);
            }
          }
          if (allowsNameFromContent(current) || (0, _util.isElement)(current) && context.isReferenced || isNativeHostLanguageTextAlternativeElement(current) || isDescendantOfNativeHostLanguageTextAlternativeElement(current)) {
            var accumulatedText2F = computeMiscTextAlternative(current, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false
            });
            if (accumulatedText2F !== "") {
              consultedNodes.add(current);
              return accumulatedText2F;
            }
          }
          if (current.nodeType === current.TEXT_NODE) {
            consultedNodes.add(current);
            return current.textContent || "";
          }
          if (context.recursion) {
            consultedNodes.add(current);
            return computeMiscTextAlternative(current, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false
            });
          }
          var tooltipAttributeValue = computeTooltipAttributeValue(current);
          if (tooltipAttributeValue !== null) {
            consultedNodes.add(current);
            return tooltipAttributeValue;
          }
          consultedNodes.add(current);
          return "";
        }
        return asFlatString(computeTextAlternative2(root, {
          isEmbeddedInLabel: false,
          // by spec computeAccessibleDescription starts with the referenced elements as roots
          isReferenced: compute === "description",
          recursion: false
        }));
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/accessible-description.js
  var require_accessible_description = __commonJS({
    "node_modules/dom-accessibility-api/dist/accessible-description.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.computeAccessibleDescription = computeAccessibleDescription;
      var _accessibleNameAndDescription = require_accessible_name_and_description();
      var _util = require_util();
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i)) return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      function computeAccessibleDescription(root) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var description = (0, _util.queryIdRefs)(root, "aria-describedby").map(function(element) {
          return (0, _accessibleNameAndDescription.computeTextAlternative)(element, _objectSpread(_objectSpread({}, options), {}, {
            compute: "description"
          }));
        }).join(" ");
        if (description === "") {
          var ariaDescription = root.getAttribute("aria-description");
          description = ariaDescription === null ? "" : ariaDescription;
        }
        if (description === "") {
          var title = root.getAttribute("title");
          description = title === null ? "" : title;
        }
        return description;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/accessible-name.js
  var require_accessible_name = __commonJS({
    "node_modules/dom-accessibility-api/dist/accessible-name.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.computeAccessibleName = computeAccessibleName;
      var _accessibleNameAndDescription = require_accessible_name_and_description();
      var _util = require_util();
      function prohibitsNaming(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["caption", "code", "deletion", "emphasis", "generic", "insertion", "none", "paragraph", "presentation", "strong", "subscript", "superscript"]);
      }
      function computeAccessibleName(root) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (prohibitsNaming(root)) {
          return "";
        }
        return (0, _accessibleNameAndDescription.computeTextAlternative)(root, options);
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/is-inaccessible.js
  var require_is_inaccessible = __commonJS({
    "node_modules/dom-accessibility-api/dist/is-inaccessible.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.isInaccessible = isInaccessible;
      exports.isSubtreeInaccessible = isSubtreeInaccessible;
      function isInaccessible(element) {
        var _element$ownerDocumen;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _options$getComputedS = options.getComputedStyle, getComputedStyle = _options$getComputedS === void 0 ? (_element$ownerDocumen = element.ownerDocument.defaultView) === null || _element$ownerDocumen === void 0 ? void 0 : _element$ownerDocumen.getComputedStyle : _options$getComputedS, _options$isSubtreeIna = options.isSubtreeInaccessible, isSubtreeInaccessibleImpl = _options$isSubtreeIna === void 0 ? isSubtreeInaccessible : _options$isSubtreeIna;
        if (typeof getComputedStyle !== "function") {
          throw new TypeError("Owner document of the element needs to have an associated window.");
        }
        if (getComputedStyle(element).visibility === "hidden") {
          return true;
        }
        var currentElement = element;
        while (currentElement) {
          if (isSubtreeInaccessibleImpl(currentElement, {
            getComputedStyle
          })) {
            return true;
          }
          currentElement = currentElement.parentElement;
        }
        return false;
      }
      function isSubtreeInaccessible(element) {
        var _element$ownerDocumen2;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _options$getComputedS2 = options.getComputedStyle, getComputedStyle = _options$getComputedS2 === void 0 ? (_element$ownerDocumen2 = element.ownerDocument.defaultView) === null || _element$ownerDocumen2 === void 0 ? void 0 : _element$ownerDocumen2.getComputedStyle : _options$getComputedS2;
        if (typeof getComputedStyle !== "function") {
          throw new TypeError("Owner document of the element needs to have an associated window.");
        }
        if (element.hidden === true) {
          return true;
        }
        if (element.getAttribute("aria-hidden") === "true") {
          return true;
        }
        if (getComputedStyle(element).display === "none") {
          return true;
        }
        return false;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/is-disabled.js
  var require_is_disabled = __commonJS({
    "node_modules/dom-accessibility-api/dist/is-disabled.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.isDisabled = isDisabled;
      var _getRole = require_getRole();
      var elementsSupportingDisabledAttribute = /* @__PURE__ */ new Set(["button", "fieldset", "input", "optgroup", "option", "select", "textarea"]);
      function isDisabled(element) {
        var localName = (0, _getRole.getLocalName)(element);
        return elementsSupportingDisabledAttribute.has(localName) && element.hasAttribute("disabled") ? true : element.getAttribute("aria-disabled") === "true";
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/index.js
  var require_index = __commonJS({
    "node_modules/dom-accessibility-api/dist/index.js"(exports) {
      exports.__esModule = true;
      var _exportNames = {
        computeAccessibleDescription: true,
        computeAccessibleName: true,
        getRole: true,
        isDisabled: true
      };
      exports.isDisabled = exports.getRole = exports.computeAccessibleName = exports.computeAccessibleDescription = void 0;
      var _accessibleDescription = require_accessible_description();
      exports.computeAccessibleDescription = _accessibleDescription.computeAccessibleDescription;
      var _accessibleName = require_accessible_name();
      exports.computeAccessibleName = _accessibleName.computeAccessibleName;
      var _getRole = _interopRequireDefault(require_getRole());
      exports.getRole = _getRole.default;
      var _isInaccessible = require_is_inaccessible();
      Object.keys(_isInaccessible).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _isInaccessible[key]) return;
        exports[key] = _isInaccessible[key];
      });
      var _isDisabled = require_is_disabled();
      exports.isDisabled = _isDisabled.isDisabled;
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
    }
  });
  return require_index();
})();
