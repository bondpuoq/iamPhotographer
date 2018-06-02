/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (a) {
    var b = "undefined" !== typeof console && console.log && console.log.bind ? console.log.bind(console) : function () { }, c = !0, d = a(window), g = function (a) { var c = null, f = null, d = null, g = a.parent().children().length, h = a.index(); 1 == g ? c = a.parent() : 0 == h ? d = a.next() : f = a.prev(); this.getNode = function () { return a }; this.swapWith = function (a) { c ? c.append(a.getNode()) : f ? f.after(a.getNode()) : d ? d.before(a.getNode()) : b("WARNING: Invalid state - either parent, prev, next should have a valid value") } }, f = function (b, c) {
        var f = new g(b),
        d = new g(c); a("script", c).remove(); f.swapWith(d); d.swapWith(f); f = b.attr("class"); b.attr("class", c.attr("class")); c.attr("class", f); b.hasClass("temp_no_id") && (b.removeClass("temp_no_id"), c.addClass("temp_no_id")); c.removeClass("placeholder").addClass("shared_content"); b.addClass("placeholder").removeClass("shared_content"); b.hasClass("temp_no_img_src") && (b.removeClass("temp_no_img_src"), c.addClass("temp_no_img_src"))
    }, j = function (g) {
        g.data("bpObj", this); var h = this, j = g.hasClass("active"), o = function (a) {
            a ==
            j ? b('WARNING: Setting the same "active" state twice', this.toString()) : (j = a) ? (g.addClass("active"), p.trigger("muse_bp_activate", [i, g, h])) : (g.removeClass("active"), p.trigger("muse_bp_deactivate", [i, g, h]))
        }, i = function () { var a = g.attr("data-min-width") || void 0, b = g.attr("data-max-width") || void 0, c = ""; void 0 !== a && (c += (c ? " and " : "") + "(min-width: " + a + "px)"); void 0 !== b && (c += (c ? " and " : "") + "(max-width: " + b + "px)"); return c }(), p = a("body"); this.getCondition = function () { return i }; this.isActive = function () { return j };
        this.isMatched = function () { var f; f = a("#muse_css_mq").css("background-color"); f.match(/^rgb/) ? (f = f.replace(/\s+/g, "").match(/([\d\,]+)/gi)[0].split(","), f = (parseInt(f[0]) << 16) + (parseInt(f[1]) << 8) + parseInt(f[2])) : f = f.match(/^\#/) ? parseInt(f.substr(1), 16) : 0; var h = g.attr("data-max-width") || 16777215; 16777214 == f && b("WARNING: No media query was matched by the CSS."); c && f < d.width() && (c = !1, a("html").addClass("always_vert_scroll")); return h == f }; this.activateImages = function () {
            var b = 0; a(".temp_no_img_src", g).each(function () {
                var c =
                    a(this); b++; c.removeClass("temp_no_img_src").attr("src", c.attr("data-orig-src")).removeAttr("data-orig-src")
            })
        }; this.swapPlaceholderNodesRecursively = function (c) {
            var d = this; a(".placeholder", c).each(function () {
                var c = a(this), g = c.attr("data-placeholder-for"); if (g) {
                    var h = a(".shared_content").filter(function (b, c) { return g == a(c).attr("data-content-guid") }); 0 == h.length ? b("WARNING: Could not find content node with GUID", g) : 1 < h.length ? b("WARNING: Found", h.length, "content nodes with GUID", g, ", expected only 1") :
                        (f(c, h), d.swapPlaceholderNodesRecursively(h))
                } else b("WARNING: Invalid placeholder-for data property for placeholder node", c)
            })
        }; this.activateIDs = function (c) { a(".temp_no_id", c).each(function () { var c = a(this), f = c.attr("data-orig-id"), d = a("#" + f); 1 == d.length ? d.removeAttr("id").attr("data-orig-id", f).addClass("temp_no_id") : b("WARNING: Expected to find 1 node with id", f, "but found", d.length); c.removeAttr("data-orig-id").attr("id", f).removeClass("temp_no_id") }) }; this.activate = function () {
            j ? b("WARNING: Trying to activate same breakpoint twice",
                this.toString()) : (this.swapPlaceholderNodesRecursively(g), this.activateIDs(g), this.activateImages(), o(!0))
        }; this.deactivate = function () { j ? o(!1) : b("WARNING: Trying to deactivate same breakpoint twice", this.toString()) }; this.onRegisterAlreadyActiveBP = function () { this.activateImages(); p.trigger("muse_bp_activate", [i, g, h]) }; this.toString = function () { return "[Breakpoint " + i + ", " + (j ? "active" : "not active") + ", " + (this.isMatched() ? "matched" : "not matched") + "]" }
    }, h = new function () {
        var c = function (a) {
            if (a) if (a == j) b("WARNING: breakpoint is already active.");
            else { j && j.deactivate(); j = a; d.data("muse-mq", a.getCondition()); h.attr("data-content", j.toString()); if (!a.isActive()) return j.activate(), !0; return !1 } else b("WARNING: Cannot update active breakpoint NULL.")
        }, f = function () { for (var a = 0; a < t.length; a++)if (t[a].isMatched()) return t[a]; b("WARNING: Could not find any active breakpoint"); return null }, g = function () { if (!j || !j.isMatched()) { var a = f(); a && !a.isActive() && c(a); var b = n; setTimeout(function () { d.scrollTop(b) }, 16) } else n = d.scrollTop() }, h = a(".css-section-debug .js"),
        j = null, i = !1, n = 0, t = []; this.registerBreakpoint = function (a) { t.push(a); if (a.isMatched()) { if (!c(a)) a.onRegisterAlreadyActiveBP() } else a.isActive() && a.deactivate() }; this.watchBreakpointChanges = function () { i || (d.on("resize", function () { Muse.Utils.requestAnimationFrame(function () { g() }) }), g(), i = !0) }
    }, i = null; a.fn.registerBreakpoint = function () {
        if (!window.matchMedia && "undefined" == typeof window.CSSMediaRule) b("WARNING: Browser does not support media queries."), this.each(function () {
            var b = a(this); if (void 0 === (b.attr("data-max-width") ||
                void 0)) { var c = new j(b); c.activateImages(); a("body").trigger("muse_bp_activate", [c.getCondition(), b, c]) }
        }); else return null == i && (i = a("body").append('<div id="muse_css_mq"></div>')), this.each(function () { h.registerBreakpoint(new j(a(this))) }), h.watchBreakpointChanges(), this
    }
})(jQuery);
; (function () { if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) { var a = function (a, b) { for (var c = 0, d = a.length; c < d; c++)if (a[c] == b) return c; return -1 }(Muse.assets.required, "jquery.museresponsive.js"); if (-1 != a) { Muse.assets.required.splice(a, 1); for (var a = document.getElementsByTagName("meta"), b = 0, c = a.length; b < c; b++) { var d = a[b]; if ("generator" == d.getAttribute("name")) { "2015.1.2.344" != d.getAttribute("content") && Muse.assets.outOfDate.push("jquery.museresponsive.js"); break } } } } })();
