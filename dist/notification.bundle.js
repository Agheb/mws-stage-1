webpackJsonp([1], {
  14:
    /*!*******************************!*\
  !*** ./assets/js/snackbar.js ***!
  \*******************************/
    /*! dynamic exports provided */
    /*! all exports used */ function(t, i, e) {
      "use strict";
      Object.defineProperty(i, "__esModule", { value: !0 }),
        (i.showNotification = void 0);
      var n = e(/*! @material/snackbar */ 94);
      i.showNotification = function(t) {
        document.querySelector(".snackbar-container").innerHTML =
          '\n<div class="mdc-snackbar "\naria-live="assertive"\naria-atomic="true"\naria-hidden="true">\n<div class="mdc-snackbar__text"></div>\n<div class="mdc-snackbar__action-wrapper">\n<button type="button" class="mdc-snackbar__action-button"></button>\n</div>\n</div>';
        var i = {
          message: t,
          timeout: 5e3,
          multiline: !0,
          actionText: "Reload",
          actionHandler: function() {
            window.location.reload();
          }
        };
        new n.MDCSnackbar(document.querySelector(".mdc-snackbar")).show(i);
      };
    },
  94:
    /*!***************************************************!*\
  !*** ../node_modules/@material/snackbar/index.js ***!
  \***************************************************/
    /*! exports provided: MDCSnackbarFoundation, MDCSnackbar */
    /*! all exports used */ function(t, i, e) {
      "use strict";
      Object.defineProperty(i, "__esModule", { value: !0 });
      var n = e(/*! @material/base/index */ 9),
        a = e(/*! ./foundation */ 95),
        s = e(/*! @material/animation/index */ 97);
      e.d(i, "MDCSnackbarFoundation", function() {
        return a.a;
      });
      class r extends n.a {
        static attachTo(t) {
          return new r(t);
        }
        show(t) {
          this.foundation_.show(t);
        }
        getDefaultFoundation() {
          const { TEXT_SELECTOR: t, ACTION_BUTTON_SELECTOR: i } = a.a.strings,
            e = () => this.root_.querySelector(t),
            n = () => this.root_.querySelector(i);
          return new a.a({
            addClass: t => this.root_.classList.add(t),
            removeClass: t => this.root_.classList.remove(t),
            setAriaHidden: () => this.root_.setAttribute("aria-hidden", "true"),
            unsetAriaHidden: () => this.root_.removeAttribute("aria-hidden"),
            setActionAriaHidden: () => n().setAttribute("aria-hidden", "true"),
            unsetActionAriaHidden: () => n().removeAttribute("aria-hidden"),
            setActionText: t => {
              n().textContent = t;
            },
            setMessageText: t => {
              e().textContent = t;
            },
            setFocus: () => n().focus(),
            visibilityIsHidden: () => document.hidden,
            registerCapturedBlurHandler: t =>
              n().addEventListener("blur", t, !0),
            deregisterCapturedBlurHandler: t =>
              n().removeEventListener("blur", t, !0),
            registerVisibilityChangeHandler: t =>
              document.addEventListener("visibilitychange", t),
            deregisterVisibilityChangeHandler: t =>
              document.removeEventListener("visibilitychange", t),
            registerCapturedInteractionHandler: (t, i) =>
              document.body.addEventListener(t, i, !0),
            deregisterCapturedInteractionHandler: (t, i) =>
              document.body.removeEventListener(t, i, !0),
            registerActionClickHandler: t => n().addEventListener("click", t),
            deregisterActionClickHandler: t =>
              n().removeEventListener("click", t),
            registerTransitionEndHandler: t =>
              this.root_.addEventListener(
                Object(s.a)(window, "transitionend"),
                t
              ),
            deregisterTransitionEndHandler: t =>
              this.root_.removeEventListener(
                Object(s.a)(window, "transitionend"),
                t
              ),
            notifyShow: () => this.emit(a.a.strings.SHOW_EVENT),
            notifyHide: () => this.emit(a.a.strings.HIDE_EVENT)
          });
        }
        get dismissesOnAction() {
          return this.foundation_.dismissesOnAction();
        }
        set dismissesOnAction(t) {
          this.foundation_.setDismissOnAction(t);
        }
      }
      i.MDCSnackbar = r;
    },
  95:
    /*!********************************************************!*\
  !*** ../node_modules/@material/snackbar/foundation.js ***!
  \********************************************************/
    /*! exports provided: default */
    /*! exports used: default */ function(t, i, e) {
      "use strict";
      var n = e(/*! @material/base/index */ 9),
        a = e(/*! ./constants */ 96);
      class s extends n.b {
        static get cssClasses() {
          return a.a;
        }
        static get strings() {
          return a.c;
        }
        static get defaultAdapter() {
          return {
            addClass: () => {},
            removeClass: () => {},
            setAriaHidden: () => {},
            unsetAriaHidden: () => {},
            setActionAriaHidden: () => {},
            unsetActionAriaHidden: () => {},
            setActionText: () => {},
            setMessageText: () => {},
            setFocus: () => {},
            visibilityIsHidden: () => !1,
            registerCapturedBlurHandler: () => {},
            deregisterCapturedBlurHandler: () => {},
            registerVisibilityChangeHandler: () => {},
            deregisterVisibilityChangeHandler: () => {},
            registerCapturedInteractionHandler: () => {},
            deregisterCapturedInteractionHandler: () => {},
            registerActionClickHandler: () => {},
            deregisterActionClickHandler: () => {},
            registerTransitionEndHandler: () => {},
            deregisterTransitionEndHandler: () => {},
            notifyShow: () => {},
            notifyHide: () => {}
          };
        }
        get active() {
          return this.active_;
        }
        constructor(t) {
          super(Object.assign(s.defaultAdapter, t)),
            (this.active_ = !1),
            (this.actionWasClicked_ = !1),
            (this.dismissOnAction_ = !0),
            (this.firstFocus_ = !0),
            (this.pointerDownRecognized_ = !1),
            (this.snackbarHasFocus_ = !1),
            (this.snackbarData_ = null),
            (this.queue_ = []),
            (this.actionClickHandler_ = () => {
              (this.actionWasClicked_ = !0), this.invokeAction_();
            }),
            (this.visibilitychangeHandler_ = () => {
              clearTimeout(this.timeoutId_),
                (this.snackbarHasFocus_ = !0),
                this.adapter_.visibilityIsHidden() ||
                  setTimeout(
                    this.cleanup_.bind(this),
                    this.snackbarData_.timeout || a.b.MESSAGE_TIMEOUT
                  );
            }),
            (this.interactionHandler_ = t => {
              ("touchstart" != t.type && "mousedown" != t.type) ||
                (this.pointerDownRecognized_ = !0),
                this.handlePossibleTabKeyboardFocus_(t),
                "focus" == t.type && (this.pointerDownRecognized_ = !1);
            }),
            (this.blurHandler_ = () => {
              clearTimeout(this.timeoutId_),
                (this.snackbarHasFocus_ = !1),
                (this.timeoutId_ = setTimeout(
                  this.cleanup_.bind(this),
                  this.snackbarData_.timeout || a.b.MESSAGE_TIMEOUT
                ));
            });
        }
        init() {
          this.adapter_.registerActionClickHandler(this.actionClickHandler_),
            this.adapter_.setAriaHidden(),
            this.adapter_.setActionAriaHidden();
        }
        destroy() {
          this.adapter_.deregisterActionClickHandler(this.actionClickHandler_),
            this.adapter_.deregisterCapturedBlurHandler(this.blurHandler_),
            this.adapter_.deregisterVisibilityChangeHandler(
              this.visibilitychangeHandler_
            ),
            ["touchstart", "mousedown", "focus"].forEach(t => {
              this.adapter_.deregisterCapturedInteractionHandler(
                t,
                this.interactionHandler_
              );
            });
        }
        dismissesOnAction() {
          return this.dismissOnAction_;
        }
        setDismissOnAction(t) {
          this.dismissOnAction_ = !!t;
        }
        show(t) {
          if (!t)
            throw new Error(
              "Please provide a data object with at least a message to display."
            );
          if (!t.message)
            throw new Error("Please provide a message to be displayed.");
          if (t.actionHandler && !t.actionText)
            throw new Error("Please provide action text with the handler.");
          if (this.active) return void this.queue_.push(t);
          clearTimeout(this.timeoutId_),
            (this.snackbarData_ = t),
            (this.firstFocus_ = !0),
            this.adapter_.registerVisibilityChangeHandler(
              this.visibilitychangeHandler_
            ),
            this.adapter_.registerCapturedBlurHandler(this.blurHandler_),
            ["touchstart", "mousedown", "focus"].forEach(t => {
              this.adapter_.registerCapturedInteractionHandler(
                t,
                this.interactionHandler_
              );
            });
          const { ACTIVE: i, MULTILINE: e, ACTION_ON_BOTTOM: n } = a.a;
          this.adapter_.setMessageText(this.snackbarData_.message),
            this.snackbarData_.multiline &&
              (this.adapter_.addClass(e),
              this.snackbarData_.actionOnBottom && this.adapter_.addClass(n)),
            this.snackbarData_.actionHandler
              ? (this.adapter_.setActionText(this.snackbarData_.actionText),
                (this.actionHandler_ = this.snackbarData_.actionHandler),
                this.setActionHidden_(!1))
              : (this.setActionHidden_(!0),
                (this.actionHandler_ = null),
                this.adapter_.setActionText(null)),
            (this.active_ = !0),
            this.adapter_.addClass(i),
            this.adapter_.unsetAriaHidden(),
            this.adapter_.notifyShow(),
            (this.timeoutId_ = setTimeout(
              this.cleanup_.bind(this),
              this.snackbarData_.timeout || a.b.MESSAGE_TIMEOUT
            ));
        }
        handlePossibleTabKeyboardFocus_() {
          this.firstFocus_ &&
            !this.pointerDownRecognized_ &&
            this.setFocusOnAction_(),
            (this.firstFocus_ = !1);
        }
        setFocusOnAction_() {
          this.adapter_.setFocus(),
            (this.snackbarHasFocus_ = !0),
            (this.firstFocus_ = !1);
        }
        invokeAction_() {
          try {
            if (!this.actionHandler_) return;
            this.actionHandler_();
          } finally {
            this.dismissOnAction_ && this.cleanup_();
          }
        }
        cleanup_() {
          if (!this.snackbarHasFocus_ || this.actionWasClicked_) {
            const { ACTIVE: t, MULTILINE: i, ACTION_ON_BOTTOM: e } = a.a;
            this.adapter_.removeClass(t);
            const n = () => {
              clearTimeout(this.timeoutId_),
                this.adapter_.deregisterTransitionEndHandler(n),
                this.adapter_.removeClass(i),
                this.adapter_.removeClass(e),
                this.setActionHidden_(!0),
                this.adapter_.setAriaHidden(),
                (this.active_ = !1),
                (this.snackbarHasFocus_ = !1),
                this.adapter_.notifyHide(),
                this.showNext_();
            };
            this.adapter_.registerTransitionEndHandler(n);
          }
        }
        showNext_() {
          this.queue_.length && this.show(this.queue_.shift());
        }
        setActionHidden_(t) {
          t
            ? this.adapter_.setActionAriaHidden()
            : this.adapter_.unsetActionAriaHidden();
        }
      }
      i.a = s;
    },
  96:
    /*!*******************************************************!*\
  !*** ../node_modules/@material/snackbar/constants.js ***!
  \*******************************************************/
    /*! exports provided: cssClasses, strings, numbers */
    /*! exports used: cssClasses, numbers, strings */ function(t, i, e) {
      "use strict";
      i.a = {
        ROOT: "mdc-snackbar",
        TEXT: "mdc-snackbar__text",
        ACTION_WRAPPER: "mdc-snackbar__action-wrapper",
        ACTION_BUTTON: "mdc-snackbar__action-button",
        ACTIVE: "mdc-snackbar--active",
        MULTILINE: "mdc-snackbar--multiline",
        ACTION_ON_BOTTOM: "mdc-snackbar--action-on-bottom"
      };
      i.c = {
        TEXT_SELECTOR: ".mdc-snackbar__text",
        ACTION_WRAPPER_SELECTOR: ".mdc-snackbar__action-wrapper",
        ACTION_BUTTON_SELECTOR: ".mdc-snackbar__action-button",
        SHOW_EVENT: "MDCSnackbar:show",
        HIDE_EVENT: "MDCSnackbar:hide"
      };
      i.b = { MESSAGE_TIMEOUT: 2750 };
    },
  97:
    /*!****************************************************!*\
  !*** ../node_modules/@material/animation/index.js ***!
  \****************************************************/
    /*! exports provided: transformStyleProperties, getCorrectEventName, getCorrectPropertyName */
    /*! exports used: getCorrectEventName */ function(t, i, e) {
      "use strict";
      e.d(i, "a", function() {
        return r;
      });
      const n = {
          animationstart: {
            noPrefix: "animationstart",
            webkitPrefix: "webkitAnimationStart",
            styleProperty: "animation"
          },
          animationend: {
            noPrefix: "animationend",
            webkitPrefix: "webkitAnimationEnd",
            styleProperty: "animation"
          },
          animationiteration: {
            noPrefix: "animationiteration",
            webkitPrefix: "webkitAnimationIteration",
            styleProperty: "animation"
          },
          transitionend: {
            noPrefix: "transitionend",
            webkitPrefix: "webkitTransitionEnd",
            styleProperty: "transition"
          }
        },
        a = {
          animation: {
            noPrefix: "animation",
            webkitPrefix: "-webkit-animation"
          },
          transform: {
            noPrefix: "transform",
            webkitPrefix: "-webkit-transform"
          },
          transition: {
            noPrefix: "transition",
            webkitPrefix: "-webkit-transition"
          }
        };
      function s(t, i) {
        if (
          !(function(t) {
            return (
              void 0 !== t.document &&
              "function" == typeof t.document.createElement
            );
          })(t) ||
          !(function(t) {
            return t in n || t in a;
          })(i)
        )
          return i;
        const e = i in n ? n : a,
          s = t.document.createElement("div");
        let r = "";
        return (r =
          e === n
            ? (function(t, i, e) {
                return i[t].styleProperty in e.style
                  ? i[t].noPrefix
                  : i[t].webkitPrefix;
              })(i, e, s)
            : e[i].noPrefix in s.style
              ? e[i].noPrefix
              : e[i].webkitPrefix);
      }
      function r(t, i) {
        return s(t, i);
      }
    }
});
