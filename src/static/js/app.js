function ajax(e) {
    function t(e) {
        for (var t in ajax.defaults)
            null == e[t] && (e[t] = ajax.defaults[t])
    }
    function s(e) {
        e.data && ("GET" === e.type ? (e.url += "?" + a(e.data),
        e.data = null) : e.data = a(e.data))
    }
    function a(e) {
        return Object.entries(e).map(( ([e,t]) => `${encodeURIComponent(e)}=${encodeURIComponent(t)}`)).join("&")
    }
    function n(e, t) {
        t.async && (e.timer = setTimeout(c.bind(void 0, e, t), 1e3 * t.timeout),
        t.progress && (e.onprogress = t.progress),
        e.onreadystatechange = function() {
            4 === e.readyState && (clearTimeout(e.timer),
            r(e, t))
        }
        )
    }
    function i(e, t) {
        for (var s in t.headers || (t.headers = {}),
        t.contentType && (t.headers["Content-Type"] = t.contentType),
        !t.headers["Content-Type"] && t.data && "GET" !== t.type && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        t.dataType && (t.headers.Accept = MIME_TYPES[t.dataType] || t.dataType),
        t.headers) {
            var a = t.headers[s];
            e.setRequestHeader(s, a)
        }
    }
    function r(e, t) {
        if (200 <= e.status && e.status < 300) {
            let s;
            null != (s = u(e, t)) ? o(s, e, t) : l("invalid", e, t)
        } else
            l("error", e, t)
    }
    function o(e, t, s) {
        null != s.success && s.success.call(s.context, e, t, s)
    }
    function l(e, t, s) {
        null != s.error && s.error.call(s.context, e, t, s)
    }
    function c(e, t) {
        e.abort(),
        l("timeout", e, t)
    }
    function d(e) {
        clearTimeout(e.timer),
        e.onreadystatechange = null,
        e.abort()
    }
    function u(e, t) {
        return "json" === t.dataType ? h(e.responseText) : e.responseText
    }
    function h(e) {
        try {
            return JSON.parse(e)
        } catch (e) {}
    }
    t(e),
    s(e);
    const p = new XMLHttpRequest;
    return p.open(e.type, e.url, e.async),
    n(p, e),
    i(p, e),
    p.send(e.data),
    e.async ? {
        abort: d.bind(void 0, p)
    } : u(p, e)
}
function exactMatch() {
    if (index = value.indexOf(query),
    index >= 0)
        return lastIndex = value.lastIndexOf(query),
        index !== lastIndex ? Math.max(scoreExactMatch(), (index = lastIndex) && scoreExactMatch() || 0) : scoreExactMatch()
}
function scoreExactMatch() {
    if (score = 100 - (valueLength - queryLength),
    index > 0) {
        if (value.charAt(index - 1) === SEPARATOR)
            score += index - 1;
        else {
            if (1 === queryLength)
                return;
            for (i = index - 2; i >= 0 && value.charAt(i) !== SEPARATOR; )
                i--;
            score -= index - i + (valueLength - queryLength - index)
        }
        for (separators = 0,
        i = index - 2; i >= 0; )
            value.charAt(i) === SEPARATOR && separators++,
            i--;
        score -= separators
    }
    for (separators = 0,
    i = valueLength - queryLength - index - 1; i >= 0; )
        value.charAt(index + queryLength + i) === SEPARATOR && separators++,
        i--;
    return score -= 5 * separators,
    Math.max(1, score)
}
function fuzzyMatch() {
    if (!(valueLength <= queryLength || value.includes(query)) && (match = fuzzyRegexp.exec(value)))
        return matchIndex = match.index,
        matchLength = match[0].length,
        score = scoreFuzzyMatch(),
        (match = fuzzyRegexp.exec(value.slice(i = value.lastIndexOf(SEPARATOR) + 1))) ? (matchIndex = i + match.index,
        matchLength = match[0].length,
        Math.max(score, scoreFuzzyMatch())) : score
}
function scoreFuzzyMatch() {
    return 0 === matchIndex || value.charAt(matchIndex - 1) === SEPARATOR ? Math.max(66, 100 - matchLength) : matchIndex + matchLength === valueLength ? Math.max(33, 67 - matchLength) : Math.max(1, 34 - matchLength)
}
!function(e, t) {
    "use strict";
    var s = function(e) {
        if ("object" != typeof e.document)
            throw new Error("Cookies.js requires a `window` with a `document` object");
        var s = function(e, t, a) {
            return 1 === arguments.length ? s.get(e) : s.set(e, t, a)
        };
        return s._document = e.document,
        s._cacheKeyPrefix = "cookey.",
        s._maxExpireDate = new Date("Fri, 31 Dec 9999 23:59:59 UTC"),
        s.defaults = {
            path: "/",
            SameSite: "Strict",
            secure: !0
        },
        s.get = function(e) {
            s._cachedDocumentCookie !== s._document.cookie && s._renewCache();
            var a = s._cache[s._cacheKeyPrefix + e];
            return a === t ? t : decodeURIComponent(a)
        }
        ,
        s.set = function(e, a, n) {
            return (n = s._getExtendedOptions(n)).expires = s._getExpiresDate(a === t ? -1 : n.expires),
            s._document.cookie = s._generateCookieString(e, a, n),
            s
        }
        ,
        s.expire = function(e, a) {
            return s.set(e, t, a)
        }
        ,
        s._getExtendedOptions = function(e) {
            return {
                path: e && e.path || s.defaults.path,
                domain: e && e.domain || s.defaults.domain,
                SameSite: e && e.SameSite || s.defaults.SameSite,
                expires: e && e.expires || s.defaults.expires,
                secure: e && e.secure !== t ? e.secure : s.defaults.secure
            }
        }
        ,
        s._isValidDate = function(e) {
            return "[object Date]" === Object.prototype.toString.call(e) && !isNaN(e.getTime())
        }
        ,
        s._getExpiresDate = function(e, t) {
            if (t = t || new Date,
            "number" == typeof e ? e = e === 1 / 0 ? s._maxExpireDate : new Date(t.getTime() + 1e3 * e) : "string" == typeof e && (e = new Date(e)),
            e && !s._isValidDate(e))
                throw new Error("`expires` parameter cannot be converted to a valid Date instance");
            return e
        }
        ,
        s._generateCookieString = function(e, t, s) {
            var a = (e = (e = e.replace(/[^#$&+\^`|]/g, encodeURIComponent)).replace(/\(/g, "%28").replace(/\)/g, "%29")) + "=" + (t = (t + "").replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent));
            return a += (s = s || {}).path ? ";path=" + s.path : "",
            a += s.domain ? ";domain=" + s.domain : "",
            a += s.SameSite ? ";SameSite=" + s.SameSite : "",
            a += s.expires ? ";expires=" + s.expires.toUTCString() : "",
            a += s.secure ? ";secure" : ""
        }
        ,
        s._getCacheFromString = function(e) {
            for (var a = {}, n = e ? e.split("; ") : [], i = 0; i < n.length; i++) {
                var r = s._getKeyValuePairFromCookieString(n[i]);
                a[s._cacheKeyPrefix + r.key] === t && (a[s._cacheKeyPrefix + r.key] = r.value)
            }
            return a
        }
        ,
        s._getKeyValuePairFromCookieString = function(e) {
            var t = e.indexOf("=");
            t = t < 0 ? e.length : t;
            var s, a = e.substr(0, t);
            try {
                s = decodeURIComponent(a)
            } catch (e) {
                console && "function" == typeof console.error && console.error('Could not decode cookie with key "' + a + '"', e)
            }
            return {
                key: s,
                value: e.substr(t + 1)
            }
        }
        ,
        s._renewCache = function() {
            s._cache = s._getCacheFromString(s._document.cookie),
            s._cachedDocumentCookie = s._document.cookie
        }
        ,
        s._areEnabled = function() {
            var e = "cookies.js"
              , t = "1" === s.set(e, 1).get(e);
            return s.expire(e),
            t
        }
        ,
        s.enabled = s._areEnabled(),
        s
    }
      , a = e && "object" == typeof e.document ? s(e) : s;
    "function" == typeof define && define.amd ? define((function() {
        return a
    }
    )) : "object" == typeof exports ? ("object" == typeof module && "object" == typeof module.exports && (exports = module.exports = a),
    exports.Cookies = a) : e.Cookies = a
}("undefined" == typeof window ? this : window),
window.addEventListener("load", (function() {
    var e, t, s;
    s = "http://www.w3.org/1998/Math/MathML",
    document.body.insertAdjacentHTML("afterbegin", "<div style='border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px;'><math xmlns='" + s + "'><mspace height='23px' width='77px'></mspace></math></div>"),
    e = (t = document.body.firstChild).firstChild.firstChild.getBoundingClientRect(),
    document.body.removeChild(t),
    (Math.abs(e.height - 23) > 1 || Math.abs(e.width - 77) > 1) && (window.supportsMathML = !1)
}
));
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {}
  , Prism = function(e) {
    function t(e, t, s, a) {
        this.type = e,
        this.content = t,
        this.alias = s,
        this.length = 0 | (a || "").length
    }
    function s(e, t, s, a) {
        e.lastIndex = t;
        var n = e.exec(s);
        if (n && a && n[1]) {
            var i = n[1].length;
            n.index += i,
            n[0] = n[0].slice(i)
        }
        return n
    }
    function a(e, n, o, l, c, d) {
        for (var u in o)
            if (o.hasOwnProperty(u) && o[u]) {
                var p = o[u];
                p = Array.isArray(p) ? p : [p];
                for (var g = 0; g < p.length; ++g) {
                    if (d && d.cause == u + "," + g)
                        return;
                    var f = p[g]
                      , m = f.inside
                      , b = !!f.lookbehind
                      , _ = !!f.greedy
                      , v = f.alias;
                    if (_ && !f.pattern.global) {
                        var E = f.pattern.toString().match(/[imsuy]*$/)[0];
                        f.pattern = RegExp(f.pattern.source, E + "g")
                    }
                    for (var y = f.pattern || f, w = l.next, S = c; w !== n.tail && !(d && S >= d.reach); S += w.value.length,
                    w = w.next) {
                        var T = w.value;
                        if (n.length > e.length)
                            return;
                        if (!(T instanceof t)) {
                            var k, A = 1;
                            if (_) {
                                if (!(k = s(y, S, e, b)) || k.index >= e.length)
                                    break;
                                var C = k.index
                                  , R = k.index + k[0].length
                                  , N = S;
                                for (N += w.value.length; C >= N; )
                                    N += (w = w.next).value.length;
                                if (S = N -= w.value.length,
                                w.value instanceof t)
                                    continue;
                                for (var I = w; I !== n.tail && (N < R || "string" == typeof I.value); I = I.next)
                                    A++,
                                    N += I.value.length;
                                A--,
                                T = e.slice(S, N),
                                k.index -= S
                            } else if (!(k = s(y, 0, T, b)))
                                continue;
                            C = k.index;
                            var D = k[0]
                              , x = T.slice(0, C)
                              , O = T.slice(C + D.length)
                              , P = S + T.length;
                            d && P > d.reach && (d.reach = P);
                            var L = w.prev;
                            if (x && (L = i(n, L, x),
                            S += x.length),
                            r(n, L, A),
                            w = i(n, L, new t(u,m ? h.tokenize(D, m) : D,v,D)),
                            O && i(n, w, O),
                            A > 1) {
                                var $ = {
                                    cause: u + "," + g,
                                    reach: P
                                };
                                a(e, n, o, w.prev, S, $),
                                d && $.reach > d.reach && (d.reach = $.reach)
                            }
                        }
                    }
                }
            }
    }
    function n() {
        var e = {
            value: null,
            prev: null,
            next: null
        }
          , t = {
            value: null,
            prev: e,
            next: null
        };
        e.next = t,
        this.head = e,
        this.tail = t,
        this.length = 0
    }
    function i(e, t, s) {
        var a = t.next
          , n = {
            value: s,
            prev: t,
            next: a
        };
        return t.next = n,
        a.prev = n,
        e.length++,
        n
    }
    function r(e, t, s) {
        for (var a = t.next, n = 0; n < s && a !== e.tail; n++)
            a = a.next;
        t.next = a,
        a.prev = t,
        e.length -= n
    }
    function o(e) {
        for (var t = [], s = e.head.next; s !== e.tail; )
            t.push(s.value),
            s = s.next;
        return t
    }
    function l() {
        h.manual || h.highlightAll()
    }
    var c = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i
      , d = 0
      , u = {}
      , h = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
            encode: function e(s) {
                return s instanceof t ? new t(s.type,e(s.content),s.alias) : Array.isArray(s) ? s.map(e) : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
            },
            type: function(e) {
                return Object.prototype.toString.call(e).slice(8, -1)
            },
            objId: function(e) {
                return e.__id || Object.defineProperty(e, "__id", {
                    value: ++d
                }),
                e.__id
            },
            clone: function e(t, s) {
                var a, n;
                switch (s = s || {},
                h.util.type(t)) {
                case "Object":
                    if (n = h.util.objId(t),
                    s[n])
                        return s[n];
                    for (var i in a = {},
                    s[n] = a,
                    t)
                        t.hasOwnProperty(i) && (a[i] = e(t[i], s));
                    return a;
                case "Array":
                    return n = h.util.objId(t),
                    s[n] ? s[n] : (a = [],
                    s[n] = a,
                    t.forEach((function(t, n) {
                        a[n] = e(t, s)
                    }
                    )),
                    a);
                default:
                    return t
                }
            },
            getLanguage: function(e) {
                for (; e; ) {
                    var t = c.exec(e.className);
                    if (t)
                        return t[1].toLowerCase();
                    e = e.parentElement
                }
                return "none"
            },
            setLanguage: function(e, t) {
                e.className = e.className.replace(RegExp(c, "gi"), ""),
                e.classList.add("language-" + t)
            },
            currentScript: function() {
                if ("undefined" == typeof document)
                    return null;
                if ("currentScript"in document)
                    return document.currentScript;
                try {
                    throw new Error
                } catch (a) {
                    var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(a.stack) || [])[1];
                    if (e) {
                        var t = document.getElementsByTagName("script");
                        for (var s in t)
                            if (t[s].src == e)
                                return t[s]
                    }
                    return null
                }
            },
            isActive: function(e, t, s) {
                for (var a = "no-" + t; e; ) {
                    var n = e.classList;
                    if (n.contains(t))
                        return !0;
                    if (n.contains(a))
                        return !1;
                    e = e.parentElement
                }
                return !!s
            }
        },
        languages: {
            plain: u,
            plaintext: u,
            text: u,
            txt: u,
            extend: function(e, t) {
                var s = h.util.clone(h.languages[e]);
                for (var a in t)
                    s[a] = t[a];
                return s
            },
            insertBefore: function(e, t, s, a) {
                var n = (a = a || h.languages)[e]
                  , i = {};
                for (var r in n)
                    if (n.hasOwnProperty(r)) {
                        if (r == t)
                            for (var o in s)
                                s.hasOwnProperty(o) && (i[o] = s[o]);
                        s.hasOwnProperty(r) || (i[r] = n[r])
                    }
                var l = a[e];
                return a[e] = i,
                h.languages.DFS(h.languages, (function(t, s) {
                    s === l && t != e && (this[t] = i)
                }
                )),
                i
            },
            DFS: function e(t, s, a, n) {
                n = n || {};
                var i = h.util.objId;
                for (var r in t)
                    if (t.hasOwnProperty(r)) {
                        s.call(t, r, t[r], a || r);
                        var o = t[r]
                          , l = h.util.type(o);
                        "Object" !== l || n[i(o)] ? "Array" !== l || n[i(o)] || (n[i(o)] = !0,
                        e(o, s, r, n)) : (n[i(o)] = !0,
                        e(o, s, null, n))
                    }
            }
        },
        plugins: {},
        highlightAll: function(e, t) {
            h.highlightAllUnder(document, e, t)
        },
        highlightAllUnder: function(e, t, s) {
            var a = {
                callback: s,
                container: e,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            h.hooks.run("before-highlightall", a),
            a.elements = Array.prototype.slice.apply(a.container.querySelectorAll(a.selector)),
            h.hooks.run("before-all-elements-highlight", a);
            for (var n, i = 0; n = a.elements[i++]; )
                h.highlightElement(n, !0 === t, a.callback)
        },
        highlightElement: function(t, s, a) {
            function n(e) {
                l.highlightedCode = e,
                h.hooks.run("before-insert", l),
                l.element.innerHTML = l.highlightedCode,
                h.hooks.run("after-highlight", l),
                h.hooks.run("complete", l),
                a && a.call(l.element)
            }
            var i = h.util.getLanguage(t)
              , r = h.languages[i];
            h.util.setLanguage(t, i);
            var o = t.parentElement;
            o && "pre" === o.nodeName.toLowerCase() && h.util.setLanguage(o, i);
            var l = {
                element: t,
                language: i,
                grammar: r,
                code: t.textContent
            };
            if (h.hooks.run("before-sanity-check", l),
            (o = l.element.parentElement) && "pre" === o.nodeName.toLowerCase() && !o.hasAttribute("tabindex") && o.setAttribute("tabindex", "0"),
            !l.code)
                return h.hooks.run("complete", l),
                void (a && a.call(l.element));
            if (h.hooks.run("before-highlight", l),
            l.grammar)
                if (s && e.Worker) {
                    var c = new Worker(h.filename);
                    c.onmessage = function(e) {
                        n(e.data)
                    }
                    ,
                    c.postMessage(JSON.stringify({
                        language: l.language,
                        code: l.code,
                        immediateClose: !0
                    }))
                } else
                    n(h.highlight(l.code, l.grammar, l.language));
            else
                n(h.util.encode(l.code))
        },
        highlight: function(e, s, a) {
            var n = {
                code: e,
                grammar: s,
                language: a
            };
            if (h.hooks.run("before-tokenize", n),
            !n.grammar)
                throw new Error('The language "' + n.language + '" has no grammar.');
            return n.tokens = h.tokenize(n.code, n.grammar),
            h.hooks.run("after-tokenize", n),
            t.stringify(h.util.encode(n.tokens), n.language)
        },
        tokenize: function(e, t) {
            var s = t.rest;
            if (s) {
                for (var r in s)
                    t[r] = s[r];
                delete t.rest
            }
            var l = new n;
            return i(l, l.head, e),
            a(e, l, t, l.head, 0),
            o(l)
        },
        hooks: {
            all: {},
            add: function(e, t) {
                var s = h.hooks.all;
                s[e] = s[e] || [],
                s[e].push(t)
            },
            run: function(e, t) {
                var s = h.hooks.all[e];
                if (s && s.length)
                    for (var a, n = 0; a = s[n++]; )
                        a(t)
            }
        },
        Token: t
    };
    if (e.Prism = h,
    t.stringify = function e(t, s) {
        if ("string" == typeof t)
            return t;
        if (Array.isArray(t)) {
            var a = "";
            return t.forEach((function(t) {
                a += e(t, s)
            }
            )),
            a
        }
        var n = {
            type: t.type,
            content: e(t.content, s),
            tag: "span",
            classes: ["token", t.type],
            attributes: {},
            language: s
        }
          , i = t.alias;
        i && (Array.isArray(i) ? Array.prototype.push.apply(n.classes, i) : n.classes.push(i)),
        h.hooks.run("wrap", n);
        var r = "";
        for (var o in n.attributes)
            r += " " + o + '="' + (n.attributes[o] || "").replace(/"/g, "&quot;") + '"';
        return "<" + n.tag + ' class="' + n.classes.join(" ") + '"' + r + ">" + n.content + "</" + n.tag + ">"
    }
    ,
    !e.document)
        return e.addEventListener ? (h.disableWorkerMessageHandler || e.addEventListener("message", (function(t) {
            var s = JSON.parse(t.data)
              , a = s.language
              , n = s.code
              , i = s.immediateClose;
            e.postMessage(h.highlight(n, h.languages[a], a)),
            i && e.close()
        }
        ), !1),
        h) : h;
    var p = h.util.currentScript();
    if (p && (h.filename = p.src,
    p.hasAttribute("data-manual") && (h.manual = !0)),
    !h.manual) {
        var g = document.readyState;
        "loading" === g || "interactive" === g && p && p.defer ? document.addEventListener("DOMContentLoaded", l) : requestAnimationFrame ? requestAnimationFrame(l) : window.setTimeout(l, 16)
    }
    return h
}(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
"undefined" != typeof global && (global.Prism = Prism),
Prism.languages.markup = {
    comment: {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: !0
    },
    prolog: {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: !0
    },
    doctype: {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
            "internal-subset": {
                pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                lookbehind: !0,
                greedy: !0,
                inside: null
            },
            string: {
                pattern: /"[^"]*"|'[^']*'/,
                greedy: !0
            },
            punctuation: /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/i,
            name: /[^\s<>'"]+/
        }
    },
    cdata: {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: !0
    },
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "special-attr": [],
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    punctuation: [{
                        pattern: /^=/,
                        alias: "attr-equals"
                    }, {
                        pattern: /^(\s*)["']|["']$/,
                        lookbehind: !0
                    }]
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: [{
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
    }, /&#x?[\da-f]{1,8};/i]
},
Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity,
Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup,
Prism.hooks.add("wrap", (function(e) {
    "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"))
}
)),
Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function(e, t) {
        var s = {};
        s["language-" + t] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Prism.languages[t]
        },
        s.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var a = {
            "included-cdata": {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: s
            }
        };
        a["language-" + t] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[t]
        };
        var n = {};
        n[e] = {
            pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, (function() {
                return e
            }
            )), "i"),
            lookbehind: !0,
            greedy: !0,
            inside: a
        },
        Prism.languages.insertBefore("markup", "cdata", n)
    }
}),
Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    value: function(e, t) {
        Prism.languages.markup.tag.inside["special-attr"].push({
            pattern: RegExp(/(^|["'\s])/.source + "(?:" + e + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, "i"),
            lookbehind: !0,
            inside: {
                "attr-name": /^[^\s=]+/,
                "attr-value": {
                    pattern: /=[\s\S]+/,
                    inside: {
                        value: {
                            pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                            lookbehind: !0,
                            alias: [t, "language-" + t],
                            inside: Prism.languages[t]
                        },
                        punctuation: [{
                            pattern: /^=/,
                            alias: "attr-equals"
                        }, /"|'/]
                    }
                }
            }
        })
    }
}),
Prism.languages.html = Prism.languages.markup,
Prism.languages.mathml = Prism.languages.markup,
Prism.languages.svg = Prism.languages.markup,
Prism.languages.xml = Prism.languages.extend("markup", {}),
Prism.languages.ssml = Prism.languages.xml,
Prism.languages.atom = Prism.languages.xml,
Prism.languages.rss = Prism.languages.xml,
function(e) {
    var t = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    e.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
            pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + t.source + ")*?" + /(?:;|(?=\s*\{))/.source),
            inside: {
                rule: /^@[\w-]+/,
                "selector-function-argument": {
                    pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                    lookbehind: !0,
                    alias: "selector"
                },
                keyword: {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: !0
                }
            }
        },
        url: {
            pattern: RegExp("\\burl\\((?:" + t.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
            greedy: !0,
            inside: {
                function: /^url/i,
                punctuation: /^\(|\)$/,
                string: {
                    pattern: RegExp("^" + t.source + "$"),
                    alias: "url"
                }
            }
        },
        selector: {
            pattern: RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" + t.source + ")*(?=\\s*\\{)"),
            lookbehind: !0
        },
        string: {
            pattern: t,
            greedy: !0
        },
        property: {
            pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: !0
        },
        important: /!important\b/i,
        function: {
            pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
            lookbehind: !0
        },
        punctuation: /[(){};:,]/
    },
    e.languages.css.atrule.inside.rest = e.languages.css;
    var s = e.languages.markup;
    s && (s.tag.addInlined("style", "css"),
    s.tag.addAttribute("style", "css"))
}(Prism),
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    }],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
},
Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: !0
    }],
    keyword: [{
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: !0
    }, {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
    }],
    function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
        pattern: RegExp(/(^|[^\w$])/.source + "(?:" + /NaN|Infinity/.source + "|" + /0[bB][01]+(?:_[01]+)*n?/.source + "|" + /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + /\d+(?:_\d+)*n/.source + "|" + /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source + ")" + /(?![\w$])/.source),
        lookbehind: !0
    },
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
}),
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,
Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),
        lookbehind: !0,
        greedy: !0,
        inside: {
            "regex-source": {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: !0,
                alias: "language-regex",
                inside: Prism.languages.regex
            },
            "regex-delimiter": /^\/|\/$/,
            "regex-flags": /^[a-z]+$/
        }
    },
    "function-variable": {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function"
    },
    parameter: [{
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}),
Prism.languages.insertBefore("javascript", "string", {
    hashbang: {
        pattern: /^#!.*/,
        greedy: !0,
        alias: "comment"
    },
    "template-string": {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
            "template-punctuation": {
                pattern: /^`|`$/,
                alias: "string"
            },
            interpolation: {
                pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                lookbehind: !0,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\$\{|\}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    },
    "string-property": {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: "property"
    }
}),
Prism.languages.insertBefore("javascript", "operator", {
    "literal-property": {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: "property"
    }
}),
Prism.languages.markup && (Prism.languages.markup.tag.addInlined("script", "javascript"),
Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, "javascript")),
Prism.languages.js = Prism.languages.javascript,
function(e) {
    var t = "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b"
      , s = {
        pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
        lookbehind: !0,
        alias: "punctuation",
        inside: null
    }
      , a = {
        bash: s,
        environment: {
            pattern: RegExp("\\$" + t),
            alias: "constant"
        },
        variable: [{
            pattern: /\$?\(\([\s\S]+?\)\)/,
            greedy: !0,
            inside: {
                variable: [{
                    pattern: /(^\$\(\([\s\S]+)\)\)/,
                    lookbehind: !0
                }, /^\$\(\(/],
                number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                punctuation: /\(\(?|\)\)?|,|;/
            }
        }, {
            pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
            greedy: !0,
            inside: {
                variable: /^\$\(|^`|\)$|`$/
            }
        }, {
            pattern: /\$\{[^}]+\}/,
            greedy: !0,
            inside: {
                operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                punctuation: /[\[\]]/,
                environment: {
                    pattern: RegExp("(\\{)" + t),
                    lookbehind: !0,
                    alias: "constant"
                }
            }
        }, /\$(?:\w+|[#?*!@$])/],
        entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
    };
    e.languages.bash = {
        shebang: {
            pattern: /^#!\s*\/.*/,
            alias: "important"
        },
        comment: {
            pattern: /(^|[^"{\\$])#.*/,
            lookbehind: !0
        },
        "function-name": [{
            pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
            lookbehind: !0,
            alias: "function"
        }, {
            pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
            alias: "function"
        }],
        "for-or-select": {
            pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
            alias: "variable",
            lookbehind: !0
        },
        "assign-left": {
            pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
            inside: {
                environment: {
                    pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + t),
                    lookbehind: !0,
                    alias: "constant"
                }
            },
            alias: "variable",
            lookbehind: !0
        },
        parameter: {
            pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
            alias: "variable",
            lookbehind: !0
        },
        string: [{
            pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
            lookbehind: !0,
            greedy: !0,
            inside: a
        }, {
            pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
            lookbehind: !0,
            greedy: !0,
            inside: {
                bash: s
            }
        }, {
            pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
            lookbehind: !0,
            greedy: !0,
            inside: a
        }, {
            pattern: /(^|[^$\\])'[^']*'/,
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
            greedy: !0,
            inside: {
                entity: a.entity
            }
        }],
        environment: {
            pattern: RegExp("\\$?" + t),
            alias: "constant"
        },
        variable: a.variable,
        function: {
            pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
            lookbehind: !0
        },
        keyword: {
            pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
            lookbehind: !0
        },
        builtin: {
            pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
            lookbehind: !0,
            alias: "class-name"
        },
        boolean: {
            pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
            lookbehind: !0
        },
        "file-descriptor": {
            pattern: /\B&\d\b/,
            alias: "important"
        },
        operator: {
            pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
            inside: {
                "file-descriptor": {
                    pattern: /^\d/,
                    alias: "important"
                }
            }
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {
            pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
            lookbehind: !0
        }
    },
    s.inside = e.languages.bash;
    for (var n = ["comment", "function-name", "for-or-select", "assign-left", "parameter", "string", "environment", "function", "keyword", "builtin", "boolean", "file-descriptor", "operator", "punctuation", "number"], i = a.variable[1].inside, r = 0; r < n.length; r++)
        i[n[r]] = e.languages.bash[n[r]];
    e.languages.sh = e.languages.bash,
    e.languages.shell = e.languages.bash
}(Prism),
Prism.languages.c = Prism.languages.extend("clike", {
    comment: {
        pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0
    },
    string: {
        pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
        greedy: !0
    },
    "class-name": {
        pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
        lookbehind: !0
    },
    keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
    function: /\b[a-z_]\w*(?=\s*\()/i,
    number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
}),
Prism.languages.insertBefore("c", "string", {
    char: {
        pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
        greedy: !0
    }
}),
Prism.languages.insertBefore("c", "string", {
    macro: {
        pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: !0,
        greedy: !0,
        alias: "property",
        inside: {
            string: [{
                pattern: /^(#\s*include\s*)<[^>]+>/,
                lookbehind: !0
            }, Prism.languages.c.string],
            char: Prism.languages.c.char,
            comment: Prism.languages.c.comment,
            "macro-name": [{
                pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
                lookbehind: !0
            }, {
                pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
                lookbehind: !0,
                alias: "function"
            }],
            directive: {
                pattern: /^(#\s*)[a-z]+/,
                lookbehind: !0,
                alias: "keyword"
            },
            "directive-hash": /^#/,
            punctuation: /##|\\(?=[\r\n])/,
            expression: {
                pattern: /\S[\s\S]*/,
                inside: Prism.languages.c
            }
        }
    }
}),
Prism.languages.insertBefore("c", "function", {
    constant: /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
}),
delete Prism.languages.c.boolean,
function(e) {
    var t = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/
      , s = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, (function() {
        return t.source
    }
    ));
    e.languages.cpp = e.languages.extend("c", {
        "class-name": [{
            pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(/<keyword>/g, (function() {
                return t.source
            }
            ))),
            lookbehind: !0
        }, /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/, /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i, /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],
        keyword: t,
        number: {
            pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
            greedy: !0
        },
        operator: />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
        boolean: /\b(?:false|true)\b/
    }),
    e.languages.insertBefore("cpp", "string", {
        module: {
            pattern: RegExp(/(\b(?:import|module)\s+)/.source + "(?:" + /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source + "|" + /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, (function() {
                return s
            }
            )) + ")"),
            lookbehind: !0,
            greedy: !0,
            inside: {
                string: /^[<"][\s\S]+/,
                operator: /:/,
                punctuation: /\./
            }
        },
        "raw-string": {
            pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
            alias: "string",
            greedy: !0
        }
    }),
    e.languages.insertBefore("cpp", "keyword", {
        "generic-function": {
            pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
            inside: {
                function: /^\w+/,
                generic: {
                    pattern: /<[\s\S]+/,
                    alias: "class-name",
                    inside: e.languages.cpp
                }
            }
        }
    }),
    e.languages.insertBefore("cpp", "operator", {
        "double-colon": {
            pattern: /::/,
            alias: "punctuation"
        }
    }),
    e.languages.insertBefore("cpp", "class-name", {
        "base-clause": {
            pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
            lookbehind: !0,
            greedy: !0,
            inside: e.languages.extend("cpp", {})
        }
    }),
    e.languages.insertBefore("inside", "double-colon", {
        "class-name": /\b[a-z_]\w*\b(?!\s*::)/i
    }, e.languages.cpp["base-clause"])
}(Prism),
Prism.languages.cmake = {
    comment: /#.*/,
    string: {
        pattern: /"(?:[^\\"]|\\.)*"/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\$\{(?:[^{}$]|\$\{[^{}$]*\})*\}/,
                inside: {
                    punctuation: /\$\{|\}/,
                    variable: /\w+/
                }
            }
        }
    },
    variable: /\b(?:CMAKE_\w+|\w+_(?:(?:BINARY|SOURCE)_DIR|DESCRIPTION|HOMEPAGE_URL|ROOT|VERSION(?:_MAJOR|_MINOR|_PATCH|_TWEAK)?)|(?:ANDROID|APPLE|BORLAND|BUILD_SHARED_LIBS|CACHE|CPACK_(?:ABSOLUTE_DESTINATION_FILES|COMPONENT_INCLUDE_TOPLEVEL_DIRECTORY|ERROR_ON_ABSOLUTE_INSTALL_DESTINATION|INCLUDE_TOPLEVEL_DIRECTORY|INSTALL_DEFAULT_DIRECTORY_PERMISSIONS|INSTALL_SCRIPT|PACKAGING_INSTALL_PREFIX|SET_DESTDIR|WARN_ON_ABSOLUTE_INSTALL_DESTINATION)|CTEST_(?:BINARY_DIRECTORY|BUILD_COMMAND|BUILD_NAME|BZR_COMMAND|BZR_UPDATE_OPTIONS|CHANGE_ID|CHECKOUT_COMMAND|CONFIGURATION_TYPE|CONFIGURE_COMMAND|COVERAGE_COMMAND|COVERAGE_EXTRA_FLAGS|CURL_OPTIONS|CUSTOM_(?:COVERAGE_EXCLUDE|ERROR_EXCEPTION|ERROR_MATCH|ERROR_POST_CONTEXT|ERROR_PRE_CONTEXT|MAXIMUM_FAILED_TEST_OUTPUT_SIZE|MAXIMUM_NUMBER_OF_(?:ERRORS|WARNINGS)|MAXIMUM_PASSED_TEST_OUTPUT_SIZE|MEMCHECK_IGNORE|POST_MEMCHECK|POST_TEST|PRE_MEMCHECK|PRE_TEST|TESTS_IGNORE|WARNING_EXCEPTION|WARNING_MATCH)|CVS_CHECKOUT|CVS_COMMAND|CVS_UPDATE_OPTIONS|DROP_LOCATION|DROP_METHOD|DROP_SITE|DROP_SITE_CDASH|DROP_SITE_PASSWORD|DROP_SITE_USER|EXTRA_COVERAGE_GLOB|GIT_COMMAND|GIT_INIT_SUBMODULES|GIT_UPDATE_CUSTOM|GIT_UPDATE_OPTIONS|HG_COMMAND|HG_UPDATE_OPTIONS|LABELS_FOR_SUBPROJECTS|MEMORYCHECK_(?:COMMAND|COMMAND_OPTIONS|SANITIZER_OPTIONS|SUPPRESSIONS_FILE|TYPE)|NIGHTLY_START_TIME|P4_CLIENT|P4_COMMAND|P4_OPTIONS|P4_UPDATE_OPTIONS|RUN_CURRENT_SCRIPT|SCP_COMMAND|SITE|SOURCE_DIRECTORY|SUBMIT_URL|SVN_COMMAND|SVN_OPTIONS|SVN_UPDATE_OPTIONS|TEST_LOAD|TEST_TIMEOUT|TRIGGER_SITE|UPDATE_COMMAND|UPDATE_OPTIONS|UPDATE_VERSION_ONLY|USE_LAUNCHERS)|CYGWIN|ENV|EXECUTABLE_OUTPUT_PATH|GHS-MULTI|IOS|LIBRARY_OUTPUT_PATH|MINGW|MSVC(?:10|11|12|14|60|70|71|80|90|_IDE|_TOOLSET_VERSION|_VERSION)?|MSYS|PROJECT_NAME|UNIX|WIN32|WINCE|WINDOWS_PHONE|WINDOWS_STORE|XCODE))\b/,
    property: /\b(?:cxx_\w+|(?:ARCHIVE_OUTPUT_(?:DIRECTORY|NAME)|COMPILE_DEFINITIONS|COMPILE_PDB_NAME|COMPILE_PDB_OUTPUT_DIRECTORY|EXCLUDE_FROM_DEFAULT_BUILD|IMPORTED_(?:IMPLIB|LIBNAME|LINK_DEPENDENT_LIBRARIES|LINK_INTERFACE_LANGUAGES|LINK_INTERFACE_LIBRARIES|LINK_INTERFACE_MULTIPLICITY|LOCATION|NO_SONAME|OBJECTS|SONAME)|INTERPROCEDURAL_OPTIMIZATION|LIBRARY_OUTPUT_DIRECTORY|LIBRARY_OUTPUT_NAME|LINK_FLAGS|LINK_INTERFACE_LIBRARIES|LINK_INTERFACE_MULTIPLICITY|LOCATION|MAP_IMPORTED_CONFIG|OSX_ARCHITECTURES|OUTPUT_NAME|PDB_NAME|PDB_OUTPUT_DIRECTORY|RUNTIME_OUTPUT_DIRECTORY|RUNTIME_OUTPUT_NAME|STATIC_LIBRARY_FLAGS|VS_CSHARP|VS_DOTNET_REFERENCEPROP|VS_DOTNET_REFERENCE|VS_GLOBAL_SECTION_POST|VS_GLOBAL_SECTION_PRE|VS_GLOBAL|XCODE_ATTRIBUTE)_\w+|\w+_(?:CLANG_TIDY|COMPILER_LAUNCHER|CPPCHECK|CPPLINT|INCLUDE_WHAT_YOU_USE|OUTPUT_NAME|POSTFIX|VISIBILITY_PRESET)|ABSTRACT|ADDITIONAL_MAKE_CLEAN_FILES|ADVANCED|ALIASED_TARGET|ALLOW_DUPLICATE_CUSTOM_TARGETS|ANDROID_(?:ANT_ADDITIONAL_OPTIONS|API|API_MIN|ARCH|ASSETS_DIRECTORIES|GUI|JAR_DEPENDENCIES|NATIVE_LIB_DEPENDENCIES|NATIVE_LIB_DIRECTORIES|PROCESS_MAX|PROGUARD|PROGUARD_CONFIG_PATH|SECURE_PROPS_PATH|SKIP_ANT_STEP|STL_TYPE)|ARCHIVE_OUTPUT_DIRECTORY|ATTACHED_FILES|ATTACHED_FILES_ON_FAIL|AUTOGEN_(?:BUILD_DIR|ORIGIN_DEPENDS|PARALLEL|SOURCE_GROUP|TARGETS_FOLDER|TARGET_DEPENDS)|AUTOMOC|AUTOMOC_(?:COMPILER_PREDEFINES|DEPEND_FILTERS|EXECUTABLE|MACRO_NAMES|MOC_OPTIONS|SOURCE_GROUP|TARGETS_FOLDER)|AUTORCC|AUTORCC_EXECUTABLE|AUTORCC_OPTIONS|AUTORCC_SOURCE_GROUP|AUTOUIC|AUTOUIC_EXECUTABLE|AUTOUIC_OPTIONS|AUTOUIC_SEARCH_PATHS|BINARY_DIR|BUILDSYSTEM_TARGETS|BUILD_RPATH|BUILD_RPATH_USE_ORIGIN|BUILD_WITH_INSTALL_NAME_DIR|BUILD_WITH_INSTALL_RPATH|BUNDLE|BUNDLE_EXTENSION|CACHE_VARIABLES|CLEAN_NO_CUSTOM|COMMON_LANGUAGE_RUNTIME|COMPATIBLE_INTERFACE_(?:BOOL|NUMBER_MAX|NUMBER_MIN|STRING)|COMPILE_(?:DEFINITIONS|FEATURES|FLAGS|OPTIONS|PDB_NAME|PDB_OUTPUT_DIRECTORY)|COST|CPACK_DESKTOP_SHORTCUTS|CPACK_NEVER_OVERWRITE|CPACK_PERMANENT|CPACK_STARTUP_SHORTCUTS|CPACK_START_MENU_SHORTCUTS|CPACK_WIX_ACL|CROSSCOMPILING_EMULATOR|CUDA_EXTENSIONS|CUDA_PTX_COMPILATION|CUDA_RESOLVE_DEVICE_SYMBOLS|CUDA_SEPARABLE_COMPILATION|CUDA_STANDARD|CUDA_STANDARD_REQUIRED|CXX_EXTENSIONS|CXX_STANDARD|CXX_STANDARD_REQUIRED|C_EXTENSIONS|C_STANDARD|C_STANDARD_REQUIRED|DEBUG_CONFIGURATIONS|DEFINE_SYMBOL|DEFINITIONS|DEPENDS|DEPLOYMENT_ADDITIONAL_FILES|DEPLOYMENT_REMOTE_DIRECTORY|DISABLED|DISABLED_FEATURES|ECLIPSE_EXTRA_CPROJECT_CONTENTS|ECLIPSE_EXTRA_NATURES|ENABLED_FEATURES|ENABLED_LANGUAGES|ENABLE_EXPORTS|ENVIRONMENT|EXCLUDE_FROM_ALL|EXCLUDE_FROM_DEFAULT_BUILD|EXPORT_NAME|EXPORT_PROPERTIES|EXTERNAL_OBJECT|EchoString|FAIL_REGULAR_EXPRESSION|FIND_LIBRARY_USE_LIB32_PATHS|FIND_LIBRARY_USE_LIB64_PATHS|FIND_LIBRARY_USE_LIBX32_PATHS|FIND_LIBRARY_USE_OPENBSD_VERSIONING|FIXTURES_CLEANUP|FIXTURES_REQUIRED|FIXTURES_SETUP|FOLDER|FRAMEWORK|Fortran_FORMAT|Fortran_MODULE_DIRECTORY|GENERATED|GENERATOR_FILE_NAME|GENERATOR_IS_MULTI_CONFIG|GHS_INTEGRITY_APP|GHS_NO_SOURCE_GROUP_FILE|GLOBAL_DEPENDS_DEBUG_MODE|GLOBAL_DEPENDS_NO_CYCLES|GNUtoMS|HAS_CXX|HEADER_FILE_ONLY|HELPSTRING|IMPLICIT_DEPENDS_INCLUDE_TRANSFORM|IMPORTED|IMPORTED_(?:COMMON_LANGUAGE_RUNTIME|CONFIGURATIONS|GLOBAL|IMPLIB|LIBNAME|LINK_DEPENDENT_LIBRARIES|LINK_INTERFACE_(?:LANGUAGES|LIBRARIES|MULTIPLICITY)|LOCATION|NO_SONAME|OBJECTS|SONAME)|IMPORT_PREFIX|IMPORT_SUFFIX|INCLUDE_DIRECTORIES|INCLUDE_REGULAR_EXPRESSION|INSTALL_NAME_DIR|INSTALL_RPATH|INSTALL_RPATH_USE_LINK_PATH|INTERFACE_(?:AUTOUIC_OPTIONS|COMPILE_DEFINITIONS|COMPILE_FEATURES|COMPILE_OPTIONS|INCLUDE_DIRECTORIES|LINK_DEPENDS|LINK_DIRECTORIES|LINK_LIBRARIES|LINK_OPTIONS|POSITION_INDEPENDENT_CODE|SOURCES|SYSTEM_INCLUDE_DIRECTORIES)|INTERPROCEDURAL_OPTIMIZATION|IN_TRY_COMPILE|IOS_INSTALL_COMBINED|JOB_POOLS|JOB_POOL_COMPILE|JOB_POOL_LINK|KEEP_EXTENSION|LABELS|LANGUAGE|LIBRARY_OUTPUT_DIRECTORY|LINKER_LANGUAGE|LINK_(?:DEPENDS|DEPENDS_NO_SHARED|DIRECTORIES|FLAGS|INTERFACE_LIBRARIES|INTERFACE_MULTIPLICITY|LIBRARIES|OPTIONS|SEARCH_END_STATIC|SEARCH_START_STATIC|WHAT_YOU_USE)|LISTFILE_STACK|LOCATION|MACOSX_BUNDLE|MACOSX_BUNDLE_INFO_PLIST|MACOSX_FRAMEWORK_INFO_PLIST|MACOSX_PACKAGE_LOCATION|MACOSX_RPATH|MACROS|MANUALLY_ADDED_DEPENDENCIES|MEASUREMENT|MODIFIED|NAME|NO_SONAME|NO_SYSTEM_FROM_IMPORTED|OBJECT_DEPENDS|OBJECT_OUTPUTS|OSX_ARCHITECTURES|OUTPUT_NAME|PACKAGES_FOUND|PACKAGES_NOT_FOUND|PARENT_DIRECTORY|PASS_REGULAR_EXPRESSION|PDB_NAME|PDB_OUTPUT_DIRECTORY|POSITION_INDEPENDENT_CODE|POST_INSTALL_SCRIPT|PREDEFINED_TARGETS_FOLDER|PREFIX|PRE_INSTALL_SCRIPT|PRIVATE_HEADER|PROCESSORS|PROCESSOR_AFFINITY|PROJECT_LABEL|PUBLIC_HEADER|REPORT_UNDEFINED_PROPERTIES|REQUIRED_FILES|RESOURCE|RESOURCE_LOCK|RULE_LAUNCH_COMPILE|RULE_LAUNCH_CUSTOM|RULE_LAUNCH_LINK|RULE_MESSAGES|RUNTIME_OUTPUT_DIRECTORY|RUN_SERIAL|SKIP_AUTOGEN|SKIP_AUTOMOC|SKIP_AUTORCC|SKIP_AUTOUIC|SKIP_BUILD_RPATH|SKIP_RETURN_CODE|SOURCES|SOURCE_DIR|SOVERSION|STATIC_LIBRARY_FLAGS|STATIC_LIBRARY_OPTIONS|STRINGS|SUBDIRECTORIES|SUFFIX|SYMBOLIC|TARGET_ARCHIVES_MAY_BE_SHARED_LIBS|TARGET_MESSAGES|TARGET_SUPPORTS_SHARED_LIBS|TESTS|TEST_INCLUDE_FILE|TEST_INCLUDE_FILES|TIMEOUT|TIMEOUT_AFTER_MATCH|TYPE|USE_FOLDERS|VALUE|VARIABLES|VERSION|VISIBILITY_INLINES_HIDDEN|VS_(?:CONFIGURATION_TYPE|COPY_TO_OUT_DIR|DEBUGGER_(?:COMMAND|COMMAND_ARGUMENTS|ENVIRONMENT|WORKING_DIRECTORY)|DEPLOYMENT_CONTENT|DEPLOYMENT_LOCATION|DOTNET_REFERENCES|DOTNET_REFERENCES_COPY_LOCAL|INCLUDE_IN_VSIX|IOT_STARTUP_TASK|KEYWORD|RESOURCE_GENERATOR|SCC_AUXPATH|SCC_LOCALPATH|SCC_PROJECTNAME|SCC_PROVIDER|SDK_REFERENCES|SHADER_(?:DISABLE_OPTIMIZATIONS|ENABLE_DEBUG|ENTRYPOINT|FLAGS|MODEL|OBJECT_FILE_NAME|OUTPUT_HEADER_FILE|TYPE|VARIABLE_NAME)|STARTUP_PROJECT|TOOL_OVERRIDE|USER_PROPS|WINRT_COMPONENT|WINRT_EXTENSIONS|WINRT_REFERENCES|XAML_TYPE)|WILL_FAIL|WIN32_EXECUTABLE|WINDOWS_EXPORT_ALL_SYMBOLS|WORKING_DIRECTORY|WRAP_EXCLUDE|XCODE_(?:EMIT_EFFECTIVE_PLATFORM_NAME|EXPLICIT_FILE_TYPE|FILE_ATTRIBUTES|LAST_KNOWN_FILE_TYPE|PRODUCT_TYPE|SCHEME_(?:ADDRESS_SANITIZER|ADDRESS_SANITIZER_USE_AFTER_RETURN|ARGUMENTS|DISABLE_MAIN_THREAD_CHECKER|DYNAMIC_LIBRARY_LOADS|DYNAMIC_LINKER_API_USAGE|ENVIRONMENT|EXECUTABLE|GUARD_MALLOC|MAIN_THREAD_CHECKER_STOP|MALLOC_GUARD_EDGES|MALLOC_SCRIBBLE|MALLOC_STACK|THREAD_SANITIZER(?:_STOP)?|UNDEFINED_BEHAVIOUR_SANITIZER(?:_STOP)?|ZOMBIE_OBJECTS))|XCTEST)\b/,
    keyword: /\b(?:add_compile_definitions|add_compile_options|add_custom_command|add_custom_target|add_definitions|add_dependencies|add_executable|add_library|add_link_options|add_subdirectory|add_test|aux_source_directory|break|build_command|build_name|cmake_host_system_information|cmake_minimum_required|cmake_parse_arguments|cmake_policy|configure_file|continue|create_test_sourcelist|ctest_build|ctest_configure|ctest_coverage|ctest_empty_binary_directory|ctest_memcheck|ctest_read_custom_files|ctest_run_script|ctest_sleep|ctest_start|ctest_submit|ctest_test|ctest_update|ctest_upload|define_property|else|elseif|enable_language|enable_testing|endforeach|endfunction|endif|endmacro|endwhile|exec_program|execute_process|export|export_library_dependencies|file|find_file|find_library|find_package|find_path|find_program|fltk_wrap_ui|foreach|function|get_cmake_property|get_directory_property|get_filename_component|get_property|get_source_file_property|get_target_property|get_test_property|if|include|include_directories|include_external_msproject|include_guard|include_regular_expression|install|install_files|install_programs|install_targets|link_directories|link_libraries|list|load_cache|load_command|macro|make_directory|mark_as_advanced|math|message|option|output_required_files|project|qt_wrap_cpp|qt_wrap_ui|remove|remove_definitions|return|separate_arguments|set|set_directory_properties|set_property|set_source_files_properties|set_target_properties|set_tests_properties|site_name|source_group|string|subdir_depends|subdirs|target_compile_definitions|target_compile_features|target_compile_options|target_include_directories|target_link_directories|target_link_libraries|target_link_options|target_sources|try_compile|try_run|unset|use_mangled_mesa|utility_source|variable_requires|variable_watch|while|write_file)(?=\s*\()\b/,
    boolean: /\b(?:FALSE|OFF|ON|TRUE)\b/,
    namespace: /\b(?:INTERFACE|PRIVATE|PROPERTIES|PUBLIC|SHARED|STATIC|TARGET_OBJECTS)\b/,
    operator: /\b(?:AND|DEFINED|EQUAL|GREATER|LESS|MATCHES|NOT|OR|STREQUAL|STRGREATER|STRLESS|VERSION_EQUAL|VERSION_GREATER|VERSION_LESS)\b/,
    inserted: {
        pattern: /\b\w+::\w+\b/,
        alias: "class-name"
    },
    number: /\b\d+(?:\.\d+)*\b/,
    function: /\b[a-z_]\w*(?=\s*\()\b/i,
    punctuation: /[()>}]|\$[<{]/
},
function(e) {
    var t = /#(?!\{).+/
      , s = {
        pattern: /#\{[^}]+\}/,
        alias: "variable"
    };
    e.languages.coffeescript = e.languages.extend("javascript", {
        comment: t,
        string: [{
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            greedy: !0
        }, {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            greedy: !0,
            inside: {
                interpolation: s
            }
        }],
        keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
        "class-member": {
            pattern: /@(?!\d)\w+/,
            alias: "variable"
        }
    }),
    e.languages.insertBefore("coffeescript", "comment", {
        "multiline-comment": {
            pattern: /###[\s\S]+?###/,
            alias: "comment"
        },
        "block-regex": {
            pattern: /\/{3}[\s\S]*?\/{3}/,
            alias: "regex",
            inside: {
                comment: t,
                interpolation: s
            }
        }
    }),
    e.languages.insertBefore("coffeescript", "string", {
        "inline-javascript": {
            pattern: /`(?:\\[\s\S]|[^\\`])*`/,
            inside: {
                delimiter: {
                    pattern: /^`|`$/,
                    alias: "punctuation"
                },
                script: {
                    pattern: /[\s\S]+/,
                    alias: "language-javascript",
                    inside: e.languages.javascript
                }
            }
        },
        "multiline-string": [{
            pattern: /'''[\s\S]*?'''/,
            greedy: !0,
            alias: "string"
        }, {
            pattern: /"""[\s\S]*?"""/,
            greedy: !0,
            alias: "string",
            inside: {
                interpolation: s
            }
        }]
    }),
    e.languages.insertBefore("coffeescript", "keyword", {
        property: /(?!\d)\w+(?=\s*:(?!:))/
    }),
    delete e.languages.coffeescript["template-string"],
    e.languages.coffee = e.languages.coffeescript
}(Prism),
function(e) {
    e.languages.ruby = e.languages.extend("clike", {
        comment: {
            pattern: /#.*|^=begin\s[\s\S]*?^=end/m,
            greedy: !0
        },
        "class-name": {
            pattern: /(\b(?:class|module)\s+|\bcatch\s+\()[\w.\\]+|\b[A-Z_]\w*(?=\s*\.\s*new\b)/,
            lookbehind: !0,
            inside: {
                punctuation: /[.\\]/
            }
        },
        keyword: /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/,
        operator: /\.{2,3}|&\.|===|<?=>|[!=]?~|(?:&&|\|\||<<|>>|\*\*|[+\-*/%<>!^&|=])=?|[?:]/,
        punctuation: /[(){}[\].,;]/
    }),
    e.languages.insertBefore("ruby", "operator", {
        "double-colon": {
            pattern: /::/,
            alias: "punctuation"
        }
    });
    var t = {
        pattern: /((?:^|[^\\])(?:\\{2})*)#\{(?:[^{}]|\{[^{}]*\})*\}/,
        lookbehind: !0,
        inside: {
            content: {
                pattern: /^(#\{)[\s\S]+(?=\}$)/,
                lookbehind: !0,
                inside: e.languages.ruby
            },
            delimiter: {
                pattern: /^#\{|\}$/,
                alias: "punctuation"
            }
        }
    };
    delete e.languages.ruby.function;
    var s = "(?:" + [/([^a-zA-Z0-9\s{(\[<=])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source, /\((?:[^()\\]|\\[\s\S]|\((?:[^()\\]|\\[\s\S])*\))*\)/.source, /\{(?:[^{}\\]|\\[\s\S]|\{(?:[^{}\\]|\\[\s\S])*\})*\}/.source, /\[(?:[^\[\]\\]|\\[\s\S]|\[(?:[^\[\]\\]|\\[\s\S])*\])*\]/.source, /<(?:[^<>\\]|\\[\s\S]|<(?:[^<>\\]|\\[\s\S])*>)*>/.source].join("|") + ")"
      , a = /(?:"(?:\\.|[^"\\\r\n])*"|(?:\b[a-zA-Z_]\w*|[^\s\0-\x7F]+)[?!]?|\$.)/.source;
    e.languages.insertBefore("ruby", "keyword", {
        "regex-literal": [{
            pattern: RegExp(/%r/.source + s + /[egimnosux]{0,6}/.source),
            greedy: !0,
            inside: {
                interpolation: t,
                regex: /[\s\S]+/
            }
        }, {
            pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[egimnosux]{0,6}(?=\s*(?:$|[\r\n,.;})#]))/,
            lookbehind: !0,
            greedy: !0,
            inside: {
                interpolation: t,
                regex: /[\s\S]+/
            }
        }],
        variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
        symbol: [{
            pattern: RegExp(/(^|[^:]):/.source + a),
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: RegExp(/([\r\n{(,][ \t]*)/.source + a + /(?=:(?!:))/.source),
            lookbehind: !0,
            greedy: !0
        }],
        "method-definition": {
            pattern: /(\bdef\s+)\w+(?:\s*\.\s*\w+)?/,
            lookbehind: !0,
            inside: {
                function: /\b\w+$/,
                keyword: /^self\b/,
                "class-name": /^\w+/,
                punctuation: /\./
            }
        }
    }),
    e.languages.insertBefore("ruby", "string", {
        "string-literal": [{
            pattern: RegExp(/%[qQiIwWs]?/.source + s),
            greedy: !0,
            inside: {
                interpolation: t,
                string: /[\s\S]+/
            }
        }, {
            pattern: /("|')(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|(?!\1)[^\\#\r\n])*\1/,
            greedy: !0,
            inside: {
                interpolation: t,
                string: /[\s\S]+/
            }
        }, {
            pattern: /<<[-~]?([a-z_]\w*)[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
            alias: "heredoc-string",
            greedy: !0,
            inside: {
                delimiter: {
                    pattern: /^<<[-~]?[a-z_]\w*|\b[a-z_]\w*$/i,
                    inside: {
                        symbol: /\b\w+/,
                        punctuation: /^<<[-~]?/
                    }
                },
                interpolation: t,
                string: /[\s\S]+/
            }
        }, {
            pattern: /<<[-~]?'([a-z_]\w*)'[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
            alias: "heredoc-string",
            greedy: !0,
            inside: {
                delimiter: {
                    pattern: /^<<[-~]?'[a-z_]\w*'|\b[a-z_]\w*$/i,
                    inside: {
                        symbol: /\b\w+/,
                        punctuation: /^<<[-~]?'|'$/
                    }
                },
                string: /[\s\S]+/
            }
        }],
        "command-literal": [{
            pattern: RegExp(/%x/.source + s),
            greedy: !0,
            inside: {
                interpolation: t,
                command: {
                    pattern: /[\s\S]+/,
                    alias: "string"
                }
            }
        }, {
            pattern: /`(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|[^\\`#\r\n])*`/,
            greedy: !0,
            inside: {
                interpolation: t,
                command: {
                    pattern: /[\s\S]+/,
                    alias: "string"
                }
            }
        }]
    }),
    delete e.languages.ruby.string,
    e.languages.insertBefore("ruby", "number", {
        builtin: /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,
        constant: /\b[A-Z][A-Z0-9_]*(?:[?!]|\b)/
    }),
    e.languages.rb = e.languages.ruby
}(Prism),
function(e) {
    e.languages.crystal = e.languages.extend("ruby", {
        keyword: [/\b(?:__DIR__|__END_LINE__|__FILE__|__LINE__|abstract|alias|annotation|as|asm|begin|break|case|class|def|do|else|elsif|end|ensure|enum|extend|for|fun|if|ifdef|include|instance_sizeof|lib|macro|module|next|of|out|pointerof|private|protected|ptr|require|rescue|return|select|self|sizeof|struct|super|then|type|typeof|undef|uninitialized|union|unless|until|when|while|with|yield)\b/, {
            pattern: /(\.\s*)(?:is_a|responds_to)\?/,
            lookbehind: !0
        }],
        number: /\b(?:0b[01_]*[01]|0o[0-7_]*[0-7]|0x[\da-fA-F_]*[\da-fA-F]|(?:\d(?:[\d_]*\d)?)(?:\.[\d_]*\d)?(?:[eE][+-]?[\d_]*\d)?)(?:_(?:[uif](?:8|16|32|64))?)?\b/,
        operator: [/->/, e.languages.ruby.operator],
        punctuation: /[(){}[\].,;\\]/
    }),
    e.languages.insertBefore("crystal", "string-literal", {
        attribute: {
            pattern: /@\[.*?\]/,
            inside: {
                delimiter: {
                    pattern: /^@\[|\]$/,
                    alias: "punctuation"
                },
                attribute: {
                    pattern: /^(\s*)\w+/,
                    lookbehind: !0,
                    alias: "class-name"
                },
                args: {
                    pattern: /\S(?:[\s\S]*\S)?/,
                    inside: e.languages.crystal
                }
            }
        },
        expansion: {
            pattern: /\{(?:\{.*?\}|%.*?%)\}/,
            inside: {
                content: {
                    pattern: /^(\{.)[\s\S]+(?=.\}$)/,
                    lookbehind: !0,
                    inside: e.languages.crystal
                },
                delimiter: {
                    pattern: /^\{[\{%]|[\}%]\}$/,
                    alias: "operator"
                }
            }
        },
        char: {
            pattern: /'(?:[^\\\r\n]{1,2}|\\(?:.|u(?:[A-Fa-f0-9]{1,4}|\{[A-Fa-f0-9]{1,6}\})))'/,
            greedy: !0
        }
    })
}(Prism),
Prism.languages.d = Prism.languages.extend("clike", {
    comment: [{
        pattern: /^\s*#!.+/,
        greedy: !0
    }, {
        pattern: RegExp(/(^|[^\\])/.source + "(?:" + [/\/\+(?:\/\+(?:[^+]|\+(?!\/))*\+\/|(?!\/\+)[\s\S])*?\+\//.source, /\/\/.*/.source, /\/\*[\s\S]*?\*\//.source].join("|") + ")"),
        lookbehind: !0,
        greedy: !0
    }],
    string: [{
        pattern: RegExp([/\b[rx]"(?:\\[\s\S]|[^\\"])*"[cwd]?/.source, /\bq"(?:\[[\s\S]*?\]|\([\s\S]*?\)|<[\s\S]*?>|\{[\s\S]*?\})"/.source, /\bq"((?!\d)\w+)$[\s\S]*?^\1"/.source, /\bq"(.)[\s\S]*?\2"/.source, /(["`])(?:\\[\s\S]|(?!\3)[^\\])*\3[cwd]?/.source].join("|"), "m"),
        greedy: !0
    }, {
        pattern: /\bq\{(?:\{[^{}]*\}|[^{}])*\}/,
        greedy: !0,
        alias: "token-string"
    }],
    keyword: /\$|\b(?:__(?:(?:DATE|EOF|FILE|FUNCTION|LINE|MODULE|PRETTY_FUNCTION|TIMESTAMP|TIME|VENDOR|VERSION)__|gshared|parameters|traits|vector)|abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|dstring|else|enum|export|extern|false|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|inout|int|interface|invariant|ireal|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|ptrdiff_t|public|pure|real|ref|return|scope|shared|short|size_t|static|string|struct|super|switch|synchronized|template|this|throw|true|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|wstring)\b/,
    number: [/\b0x\.?[a-f\d_]+(?:(?!\.\.)\.[a-f\d_]*)?(?:p[+-]?[a-f\d_]+)?[ulfi]{0,4}/i, {
        pattern: /((?:\.\.)?)(?:\b0b\.?|\b|\.)\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:e[+-]?\d[\d_]*)?[ulfi]{0,4}/i,
        lookbehind: !0
    }],
    operator: /\|[|=]?|&[&=]?|\+[+=]?|-[-=]?|\.?\.\.|=[>=]?|!(?:i[ns]\b|<>?=?|>=?|=)?|\bi[ns]\b|(?:<[<>]?|>>?>?|\^\^|[*\/%^~])=?/
}),
Prism.languages.insertBefore("d", "string", {
    char: /'(?:\\(?:\W|\w+)|[^\\])'/
}),
Prism.languages.insertBefore("d", "keyword", {
    property: /\B@\w*/
}),
Prism.languages.insertBefore("d", "function", {
    register: {
        pattern: /\b(?:[ABCD][LHX]|E?(?:BP|DI|SI|SP)|[BS]PL|[ECSDGF]S|CR[0234]|[DS]IL|DR[012367]|E[ABCD]X|X?MM[0-7]|R(?:1[0-5]|[89])[BWD]?|R[ABCD]X|R[BS]P|R[DS]I|TR[3-7]|XMM(?:1[0-5]|[89])|YMM(?:1[0-5]|\d))\b|\bST(?:\([0-7]\)|\b)/,
        alias: "variable"
    }
}),
function(e) {
    var t = [/\b(?:async|sync|yield)\*/, /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|final|finally|for|get|hide|if|implements|import|in|interface|library|mixin|new|null|on|operator|part|rethrow|return|set|show|static|super|switch|sync|this|throw|try|typedef|var|void|while|with|yield)\b/]
      , s = /(^|[^\w.])(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source
      , a = {
        pattern: RegExp(s + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
        lookbehind: !0,
        inside: {
            namespace: {
                pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
                inside: {
                    punctuation: /\./
                }
            }
        }
    };
    e.languages.dart = e.languages.extend("clike", {
        "class-name": [a, {
            pattern: RegExp(s + /[A-Z]\w*(?=\s+\w+\s*[;,=()])/.source),
            lookbehind: !0,
            inside: a.inside
        }],
        keyword: t,
        operator: /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
    }),
    e.languages.insertBefore("dart", "string", {
        "string-literal": {
            pattern: /r?(?:("""|''')[\s\S]*?\1|(["'])(?:\\.|(?!\2)[^\\\r\n])*\2(?!\2))/,
            greedy: !0,
            inside: {
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
                    lookbehind: !0,
                    inside: {
                        punctuation: /^\$\{?|\}$/,
                        expression: {
                            pattern: /[\s\S]+/,
                            inside: e.languages.dart
                        }
                    }
                },
                string: /[\s\S]+/
            }
        },
        string: void 0
    }),
    e.languages.insertBefore("dart", "class-name", {
        metadata: {
            pattern: /@\w+/,
            alias: "function"
        }
    }),
    e.languages.insertBefore("dart", "class-name", {
        generics: {
            pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
            inside: {
                "class-name": a,
                keyword: t,
                punctuation: /[<>(),.:]/,
                operator: /[?&|]/
            }
        }
    })
}(Prism),
function(e) {
    e.languages.diff = {
        coord: [/^(?:\*{3}|-{3}|\+{3}).*$/m, /^@@.*@@$/m, /^\d.*$/m]
    };
    var t = {
        "deleted-sign": "-",
        "deleted-arrow": "<",
        "inserted-sign": "+",
        "inserted-arrow": ">",
        unchanged: " ",
        diff: "!"
    };
    Object.keys(t).forEach((function(s) {
        var a = t[s]
          , n = [];
        /^\w+$/.test(s) || n.push(/\w+/.exec(s)[0]),
        "diff" === s && n.push("bold"),
        e.languages.diff[s] = {
            pattern: RegExp("^(?:[" + a + "].*(?:\r\n?|\n|(?![\\s\\S])))+", "m"),
            alias: n,
            inside: {
                line: {
                    pattern: /(.)(?=[\s\S]).*(?:\r\n?|\n)?/,
                    lookbehind: !0
                },
                prefix: {
                    pattern: /[\s\S]/,
                    alias: /\w+/.exec(s)[0]
                }
            }
        }
    }
    )),
    Object.defineProperty(e.languages.diff, "PREFIXES", {
        value: t
    })
}(Prism),
function(e) {
    function t(e, t) {
        return "___" + e.toUpperCase() + t + "___"
    }
    Object.defineProperties(e.languages["markup-templating"] = {}, {
        buildPlaceholders: {
            value: function(s, a, n, i) {
                if (s.language === a) {
                    var r = s.tokenStack = [];
                    s.code = s.code.replace(n, (function(e) {
                        if ("function" == typeof i && !i(e))
                            return e;
                        for (var n, o = r.length; -1 !== s.code.indexOf(n = t(a, o)); )
                            ++o;
                        return r[o] = e,
                        n
                    }
                    )),
                    s.grammar = e.languages.markup
                }
            }
        },
        tokenizePlaceholders: {
            value: function(s, a) {
                function n(o) {
                    for (var l = 0; l < o.length && !(i >= r.length); l++) {
                        var c = o[l];
                        if ("string" == typeof c || c.content && "string" == typeof c.content) {
                            var d = r[i]
                              , u = s.tokenStack[d]
                              , h = "string" == typeof c ? c : c.content
                              , p = t(a, d)
                              , g = h.indexOf(p);
                            if (g > -1) {
                                ++i;
                                var f = h.substring(0, g)
                                  , m = new e.Token(a,e.tokenize(u, s.grammar),"language-" + a,u)
                                  , b = h.substring(g + p.length)
                                  , _ = [];
                                f && _.push.apply(_, n([f])),
                                _.push(m),
                                b && _.push.apply(_, n([b])),
                                "string" == typeof c ? o.splice.apply(o, [l, 1].concat(_)) : c.content = _
                            }
                        } else
                            c.content && n(c.content)
                    }
                    return o
                }
                if (s.language === a && s.tokenStack) {
                    s.grammar = e.languages[a];
                    var i = 0
                      , r = Object.keys(s.tokenStack);
                    n(s.tokens)
                }
            }
        }
    })
}(Prism),
function(e) {
    e.languages.django = {
        comment: /^\{#[\s\S]*?#\}$/,
        tag: {
            pattern: /(^\{%[+-]?\s*)\w+/,
            lookbehind: !0,
            alias: "keyword"
        },
        delimiter: {
            pattern: /^\{[{%][+-]?|[+-]?[}%]\}$/,
            alias: "punctuation"
        },
        string: {
            pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
            greedy: !0
        },
        filter: {
            pattern: /(\|)\w+/,
            lookbehind: !0,
            alias: "function"
        },
        test: {
            pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
            lookbehind: !0,
            alias: "function"
        },
        function: /\b[a-z_]\w+(?=\s*\()/i,
        keyword: /\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,
        operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
        number: /\b\d+(?:\.\d+)?\b/,
        boolean: /[Ff]alse|[Nn]one|[Tt]rue/,
        variable: /\b\w+\b/,
        punctuation: /[{}[\](),.:;]/
    };
    var t = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g
      , s = e.languages["markup-templating"];
    e.hooks.add("before-tokenize", (function(e) {
        s.buildPlaceholders(e, "django", t)
    }
    )),
    e.hooks.add("after-tokenize", (function(e) {
        s.tokenizePlaceholders(e, "django")
    }
    )),
    e.languages.jinja2 = e.languages.django,
    e.hooks.add("before-tokenize", (function(e) {
        s.buildPlaceholders(e, "jinja2", t)
    }
    )),
    e.hooks.add("after-tokenize", (function(e) {
        s.tokenizePlaceholders(e, "jinja2")
    }
    ))
}(Prism),
Prism.languages.elixir = {
    doc: {
        pattern: /@(?:doc|moduledoc)\s+(?:("""|''')[\s\S]*?\1|("|')(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2)/,
        inside: {
            attribute: /^@\w+/,
            string: /['"][\s\S]+/
        }
    },
    comment: {
        pattern: /#.*/,
        greedy: !0
    },
    regex: {
        pattern: /~[rR](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[uismxfr]*/,
        greedy: !0
    },
    string: [{
        pattern: /~[cCsSwW](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|#\{[^}]+\}|#(?!\{)|[^#\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[csa]?/,
        greedy: !0,
        inside: {}
    }, {
        pattern: /("""|''')[\s\S]*?\1/,
        greedy: !0,
        inside: {}
    }, {
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0,
        inside: {}
    }],
    atom: {
        pattern: /(^|[^:]):\w+/,
        lookbehind: !0,
        alias: "symbol"
    },
    module: {
        pattern: /\b[A-Z]\w*\b/,
        alias: "class-name"
    },
    "attr-name": /\b\w+\??:(?!:)/,
    argument: {
        pattern: /(^|[^&])&\d+/,
        lookbehind: !0,
        alias: "variable"
    },
    attribute: {
        pattern: /@\w+/,
        alias: "variable"
    },
    function: /\b[_a-zA-Z]\w*[?!]?(?:(?=\s*(?:\.\s*)?\()|(?=\/\d))/,
    number: /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
    keyword: /\b(?:after|alias|and|case|catch|cond|def(?:callback|delegate|exception|impl|macro|module|n|np|p|protocol|struct)?|do|else|end|fn|for|if|import|not|or|quote|raise|require|rescue|try|unless|unquote|use|when)\b/,
    boolean: /\b(?:false|nil|true)\b/,
    operator: [/\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/, {
        pattern: /([^<])<(?!<)/,
        lookbehind: !0
    }, {
        pattern: /([^>])>(?!>)/,
        lookbehind: !0
    }],
    punctuation: /<<|>>|[.,%\[\]{}()]/
},
Prism.languages.elixir.string.forEach((function(e) {
    e.inside = {
        interpolation: {
            pattern: /#\{[^}]+\}/,
            inside: {
                delimiter: {
                    pattern: /^#\{|\}$/,
                    alias: "punctuation"
                },
                rest: Prism.languages.elixir
            }
        }
    }
}
)),
Prism.languages.erlang = {
    comment: /%.+/,
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"/,
        greedy: !0
    },
    "quoted-function": {
        pattern: /'(?:\\.|[^\\'\r\n])+'(?=\()/,
        alias: "function"
    },
    "quoted-atom": {
        pattern: /'(?:\\.|[^\\'\r\n])+'/,
        alias: "atom"
    },
    boolean: /\b(?:false|true)\b/,
    keyword: /\b(?:after|begin|case|catch|end|fun|if|of|receive|try|when)\b/,
    number: [/\$\\?./, /\b\d+#[a-z0-9]+/i, /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i],
    function: /\b[a-z][\w@]*(?=\()/,
    variable: {
        pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
        lookbehind: !0
    },
    operator: [/[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:and|andalso|band|bnot|bor|bsl|bsr|bxor|div|not|or|orelse|rem|xor)\b/, {
        pattern: /(^|[^<])<(?!<)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^>])>(?!>)/,
        lookbehind: !0
    }],
    atom: /\b[a-z][\w@]*/,
    punctuation: /[()[\]{}:;,.#|]|<<|>>/
},
Prism.languages.go = Prism.languages.extend("clike", {
    string: {
        pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
        lookbehind: !0,
        greedy: !0
    },
    keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
    boolean: /\b(?:_|false|iota|nil|true)\b/,
    number: [/\b0(?:b[01_]+|o[0-7_]+)i?\b/i, /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i, /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],
    operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
    builtin: /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/
}),
Prism.languages.insertBefore("go", "string", {
    char: {
        pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
        greedy: !0
    }
}),
delete Prism.languages.go["class-name"],
function(e) {
    var t = {
        pattern: /((?:^|[^\\$])(?:\\{2})*)\$(?:\w+|\{[^{}]*\})/,
        lookbehind: !0,
        inside: {
            "interpolation-punctuation": {
                pattern: /^\$\{?|\}$/,
                alias: "punctuation"
            },
            expression: {
                pattern: /[\s\S]+/,
                inside: null
            }
        }
    };
    e.languages.groovy = e.languages.extend("clike", {
        string: {
            pattern: /'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'/,
            greedy: !0
        },
        keyword: /\b(?:abstract|as|assert|boolean|break|byte|case|catch|char|class|const|continue|def|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|in|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
        number: /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
        operator: {
            pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
            lookbehind: !0
        },
        punctuation: /\.+|[{}[\];(),:$]/
    }),
    e.languages.insertBefore("groovy", "string", {
        shebang: {
            pattern: /#!.+/,
            alias: "comment",
            greedy: !0
        },
        "interpolation-string": {
            pattern: /"""(?:[^\\]|\\[\s\S])*?"""|(["/])(?:\\.|(?!\1)[^\\\r\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/,
            greedy: !0,
            inside: {
                interpolation: t,
                string: /[\s\S]+/
            }
        }
    }),
    e.languages.insertBefore("groovy", "punctuation", {
        "spock-block": /\b(?:and|cleanup|expect|given|setup|then|when|where):/
    }),
    e.languages.insertBefore("groovy", "function", {
        annotation: {
            pattern: /(^|[^.])@\w+/,
            lookbehind: !0,
            alias: "punctuation"
        }
    }),
    t.inside.expression.inside = e.languages.groovy
}(Prism),
function(e) {
    var t = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/
      , s = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source
      , a = {
        pattern: RegExp(/(^|[^\w.])/.source + s + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
        lookbehind: !0,
        inside: {
            namespace: {
                pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
                inside: {
                    punctuation: /\./
                }
            },
            punctuation: /\./
        }
    };
    e.languages.java = e.languages.extend("clike", {
        string: {
            pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
            lookbehind: !0,
            greedy: !0
        },
        "class-name": [a, {
            pattern: RegExp(/(^|[^\w.])/.source + s + /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),
            lookbehind: !0,
            inside: a.inside
        }, {
            pattern: RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source + s + /[A-Z]\w*\b/.source),
            lookbehind: !0,
            inside: a.inside
        }],
        keyword: t,
        function: [e.languages.clike.function, {
            pattern: /(::\s*)[a-z_]\w*/,
            lookbehind: !0
        }],
        number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
        operator: {
            pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
            lookbehind: !0
        },
        constant: /\b[A-Z][A-Z_\d]+\b/
    }),
    e.languages.insertBefore("java", "string", {
        "triple-quoted-string": {
            pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
            greedy: !0,
            alias: "string"
        },
        char: {
            pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
            greedy: !0
        }
    }),
    e.languages.insertBefore("java", "class-name", {
        annotation: {
            pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
            lookbehind: !0,
            alias: "punctuation"
        },
        generics: {
            pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
            inside: {
                "class-name": a,
                keyword: t,
                punctuation: /[<>(),.:]/,
                operator: /[?&|]/
            }
        },
        import: [{
            pattern: RegExp(/(\bimport\s+)/.source + s + /(?:[A-Z]\w*|\*)(?=\s*;)/.source),
            lookbehind: !0,
            inside: {
                namespace: a.inside.namespace,
                punctuation: /\./,
                operator: /\*/,
                "class-name": /\w+/
            }
        }, {
            pattern: RegExp(/(\bimport\s+static\s+)/.source + s + /(?:\w+|\*)(?=\s*;)/.source),
            lookbehind: !0,
            alias: "static",
            inside: {
                namespace: a.inside.namespace,
                static: /\b\w+$/,
                punctuation: /\./,
                operator: /\*/,
                "class-name": /\w+/
            }
        }],
        namespace: {
            pattern: RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g, (function() {
                return t.source
            }
            ))),
            lookbehind: !0,
            inside: {
                punctuation: /\./
            }
        }
    })
}(Prism),
Prism.languages.json = {
    property: {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        lookbehind: !0,
        greedy: !0
    },
    string: {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        lookbehind: !0,
        greedy: !0
    },
    comment: {
        pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0
    },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:false|true)\b/,
    null: {
        pattern: /\bnull\b/,
        alias: "keyword"
    }
},
Prism.languages.webmanifest = Prism.languages.json,
Prism.languages.julia = {
    comment: {
        pattern: /(^|[^\\])(?:#=(?:[^#=]|=(?!#)|#(?!=)|#=(?:[^#=]|=(?!#)|#(?!=))*=#)*=#|#.*)/,
        lookbehind: !0
    },
    regex: {
        pattern: /r"(?:\\.|[^"\\\r\n])*"[imsx]{0,4}/,
        greedy: !0
    },
    string: {
        pattern: /"""[\s\S]+?"""|(?:\b\w+)?"(?:\\.|[^"\\\r\n])*"|`(?:[^\\`\r\n]|\\.)*`/,
        greedy: !0
    },
    char: {
        pattern: /(^|[^\w'])'(?:\\[^\r\n][^'\r\n]*|[^\\\r\n])'/,
        lookbehind: !0,
        greedy: !0
    },
    keyword: /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|in|let|local|macro|module|print|println|quote|return|struct|try|type|typealias|using|while)\b/,
    boolean: /\b(?:false|true)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+(?:_[\da-f]+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[efp][+-]?\d+(?:_\d+)*)?j?/i,
    operator: /&&|\|\||[-+*^%\xf7\u22bb&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:|])?|>(?:=|>>?=?)?|==?=?|[~\u2260\u2264\u2265'\u221a\u221b]/,
    punctuation: /::?|[{}[\]();,.?]/,
    constant: /\b(?:(?:Inf|NaN)(?:16|32|64)?|im|pi)\b|[\u03c0\u212f]/
},
function(e) {
    e.languages.kotlin = e.languages.extend("clike", {
        keyword: {
            pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
            lookbehind: !0
        },
        function: [{
            pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/,
            greedy: !0
        }, {
            pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/,
            lookbehind: !0,
            greedy: !0
        }],
        number: /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
        operator: /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
    }),
    delete e.languages.kotlin["class-name"];
    var t = {
        "interpolation-punctuation": {
            pattern: /^\$\{?|\}$/,
            alias: "punctuation"
        },
        expression: {
            pattern: /[\s\S]+/,
            inside: e.languages.kotlin
        }
    };
    e.languages.insertBefore("kotlin", "string", {
        "string-literal": [{
            pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
            alias: "multiline",
            inside: {
                interpolation: {
                    pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
                    inside: t
                },
                string: /[\s\S]+/
            }
        }, {
            pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
            alias: "singleline",
            inside: {
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
                    lookbehind: !0,
                    inside: t
                },
                string: /[\s\S]+/
            }
        }],
        char: {
            pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/,
            greedy: !0
        }
    }),
    delete e.languages.kotlin.string,
    e.languages.insertBefore("kotlin", "keyword", {
        annotation: {
            pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
            alias: "builtin"
        }
    }),
    e.languages.insertBefore("kotlin", "function", {
        label: {
            pattern: /\b\w+@|@\w+\b/,
            alias: "symbol"
        }
    }),
    e.languages.kt = e.languages.kotlin,
    e.languages.kts = e.languages.kotlin
}(Prism),
function(e) {
    var t = /\\(?:[^a-z()[\]]|[a-z*]+)/i
      , s = {
        "equation-command": {
            pattern: t,
            alias: "regex"
        }
    };
    e.languages.latex = {
        comment: /%.*/,
        cdata: {
            pattern: /(\\begin\{((?:lstlisting|verbatim)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
            lookbehind: !0
        },
        equation: [{
            pattern: /\$\$(?:\\[\s\S]|[^\\$])+\$\$|\$(?:\\[\s\S]|[^\\$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/,
            inside: s,
            alias: "string"
        }, {
            pattern: /(\\begin\{((?:align|eqnarray|equation|gather|math|multline)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
            lookbehind: !0,
            inside: s,
            alias: "string"
        }],
        keyword: {
            pattern: /(\\(?:begin|cite|documentclass|end|label|ref|usepackage)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
            lookbehind: !0
        },
        url: {
            pattern: /(\\url\{)[^}]+(?=\})/,
            lookbehind: !0
        },
        headline: {
            pattern: /(\\(?:chapter|frametitle|paragraph|part|section|subparagraph|subsection|subsubparagraph|subsubsection|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
            lookbehind: !0,
            alias: "class-name"
        },
        function: {
            pattern: t,
            alias: "selector"
        },
        punctuation: /[[\]{}&]/
    },
    e.languages.tex = e.languages.latex,
    e.languages.context = e.languages.latex
}(Prism),
Prism.languages.lua = {
    comment: /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
    string: {
        pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[^z]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
        greedy: !0
    },
    number: /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|(?:\.\d*)?(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
    keyword: /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
    function: /(?!\d)\w+(?=\s*(?:[({]))/,
    operator: [/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
        pattern: /(^|[^.])\.\.(?!\.)/,
        lookbehind: !0
    }],
    punctuation: /[\[\](){},;]|\.+|:+/
},
function(e) {
    function t(e) {
        return e = e.replace(/<inner>/g, (function() {
            return a
        }
        )),
        RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + e + ")")
    }
    function s(e) {
        var t = e.replace(o, "");
        return t = t.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, (function(e, t) {
            var s;
            if ("#" === (t = t.toLowerCase())[0])
                return s = "x" === t[1] ? parseInt(t.slice(2), 16) : Number(t.slice(1)),
                c(s);
            var a = l[t];
            return a || e
        }
        )),
        t
    }
    var a = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source
      , n = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source
      , i = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, (function() {
        return n
    }
    ))
      , r = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;
    e.languages.markdown = e.languages.extend("markup", {}),
    e.languages.insertBefore("markdown", "prolog", {
        "front-matter-block": {
            pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
            lookbehind: !0,
            greedy: !0,
            inside: {
                punctuation: /^---|---$/,
                "front-matter": {
                    pattern: /\S+(?:\s+\S+)*/,
                    alias: ["yaml", "language-yaml"],
                    inside: e.languages.yaml
                }
            }
        },
        blockquote: {
            pattern: /^>(?:[\t ]*>)*/m,
            alias: "punctuation"
        },
        table: {
            pattern: RegExp("^" + i + r + "(?:" + i + ")*", "m"),
            inside: {
                "table-data-rows": {
                    pattern: RegExp("^(" + i + r + ")(?:" + i + ")*$"),
                    lookbehind: !0,
                    inside: {
                        "table-data": {
                            pattern: RegExp(n),
                            inside: e.languages.markdown
                        },
                        punctuation: /\|/
                    }
                },
                "table-line": {
                    pattern: RegExp("^(" + i + ")" + r + "$"),
                    lookbehind: !0,
                    inside: {
                        punctuation: /\||:?-{3,}:?/
                    }
                },
                "table-header-row": {
                    pattern: RegExp("^" + i + "$"),
                    inside: {
                        "table-header": {
                            pattern: RegExp(n),
                            alias: "important",
                            inside: e.languages.markdown
                        },
                        punctuation: /\|/
                    }
                }
            }
        },
        code: [{
            pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
            lookbehind: !0,
            alias: "keyword"
        }, {
            pattern: /^```[\s\S]*?^```$/m,
            greedy: !0,
            inside: {
                "code-block": {
                    pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                    lookbehind: !0
                },
                "code-language": {
                    pattern: /^(```).+/,
                    lookbehind: !0
                },
                punctuation: /```/
            }
        }],
        title: [{
            pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
            alias: "important",
            inside: {
                punctuation: /==+$|--+$/
            }
        }, {
            pattern: /(^\s*)#.+/m,
            lookbehind: !0,
            alias: "important",
            inside: {
                punctuation: /^#+|#+$/
            }
        }],
        hr: {
            pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        list: {
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        "url-reference": {
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                variable: {
                    pattern: /^(!?\[)[^\]]+/,
                    lookbehind: !0
                },
                string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                punctuation: /^[\[\]!:]|[<>]/
            },
            alias: "url"
        },
        bold: {
            pattern: t(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),
            lookbehind: !0,
            greedy: !0,
            inside: {
                content: {
                    pattern: /(^..)[\s\S]+(?=..$)/,
                    lookbehind: !0,
                    inside: {}
                },
                punctuation: /\*\*|__/
            }
        },
        italic: {
            pattern: t(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source),
            lookbehind: !0,
            greedy: !0,
            inside: {
                content: {
                    pattern: /(^.)[\s\S]+(?=.$)/,
                    lookbehind: !0,
                    inside: {}
                },
                punctuation: /[*_]/
            }
        },
        strike: {
            pattern: t(/(~~?)(?:(?!~)<inner>)+\2/.source),
            lookbehind: !0,
            greedy: !0,
            inside: {
                content: {
                    pattern: /(^~~?)[\s\S]+(?=\1$)/,
                    lookbehind: !0,
                    inside: {}
                },
                punctuation: /~~?/
            }
        },
        "code-snippet": {
            pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
            lookbehind: !0,
            greedy: !0,
            alias: ["code", "keyword"]
        },
        url: {
            pattern: t(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source),
            lookbehind: !0,
            greedy: !0,
            inside: {
                operator: /^!/,
                content: {
                    pattern: /(^\[)[^\]]+(?=\])/,
                    lookbehind: !0,
                    inside: {}
                },
                variable: {
                    pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
                    lookbehind: !0
                },
                url: {
                    pattern: /(^\]\()[^\s)]+/,
                    lookbehind: !0
                },
                string: {
                    pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
                    lookbehind: !0
                }
            }
        }
    }),
    ["url", "bold", "italic", "strike"].forEach((function(t) {
        ["url", "bold", "italic", "strike", "code-snippet"].forEach((function(s) {
            t !== s && (e.languages.markdown[t].inside.content.inside[s] = e.languages.markdown[s])
        }
        ))
    }
    )),
    e.hooks.add("after-tokenize", (function(e) {
        function t(e) {
            if (e && "string" != typeof e)
                for (var s = 0, a = e.length; s < a; s++) {
                    var n = e[s];
                    if ("code" === n.type) {
                        var i = n.content[1]
                          , r = n.content[3];
                        if (i && r && "code-language" === i.type && "code-block" === r.type && "string" == typeof i.content) {
                            var o = i.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp")
                              , l = "language-" + (o = (/[a-z][\w-]*/i.exec(o) || [""])[0].toLowerCase());
                            r.alias ? "string" == typeof r.alias ? r.alias = [r.alias, l] : r.alias.push(l) : r.alias = [l]
                        }
                    } else
                        t(n.content)
                }
        }
        "markdown" !== e.language && "md" !== e.language || t(e.tokens)
    }
    )),
    e.hooks.add("wrap", (function(t) {
        if ("code-block" === t.type) {
            for (var a = "", n = 0, i = t.classes.length; n < i; n++) {
                var r = t.classes[n]
                  , o = /language-(.+)/.exec(r);
                if (o) {
                    a = o[1];
                    break
                }
            }
            var l = e.languages[a];
            if (l)
                t.content = e.highlight(s(t.content), l, a);
            else if (a && "none" !== a && e.plugins.autoloader) {
                var c = "md-" + (new Date).valueOf() + "-" + Math.floor(1e16 * Math.random());
                t.attributes.id = c,
                e.plugins.autoloader.loadLanguages(a, (function() {
                    var t = document.getElementById(c);
                    t && (t.innerHTML = e.highlight(t.textContent, e.languages[a], a))
                }
                ))
            }
        }
    }
    ));
    var o = RegExp(e.languages.markup.tag.pattern.source, "gi")
      , l = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"'
    }
      , c = String.fromCodePoint || String.fromCharCode;
    e.languages.md = e.languages.markdown
}(Prism),
Prism.languages.matlab = {
    comment: [/%\{[\s\S]*?\}%/, /%.+/],
    string: {
        pattern: /\B'(?:''|[^'\r\n])*'/,
        greedy: !0
    },
    number: /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
    keyword: /\b(?:NaN|break|case|catch|continue|else|elseif|end|for|function|if|inf|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
    function: /\b(?!\d)\w+(?=\s*\()/,
    operator: /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
    punctuation: /\.{3}|[.,;\[\](){}!]/
},
function(e) {
    var t = /\$(?:\w[a-z\d]*(?:_[^\x00-\x1F\s"'\\()$]*)?|\{[^}\s"'\\]+\})/i;
    e.languages.nginx = {
        comment: {
            pattern: /(^|[\s{};])#.*/,
            lookbehind: !0,
            greedy: !0
        },
        directive: {
            pattern: /(^|\s)\w(?:[^;{}"'\\\s]|\\.|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\s+(?:#.*(?!.)|(?![#\s])))*?(?=\s*[;{])/,
            lookbehind: !0,
            greedy: !0,
            inside: {
                string: {
                    pattern: /((?:^|[^\\])(?:\\\\)*)(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/,
                    lookbehind: !0,
                    greedy: !0,
                    inside: {
                        escape: {
                            pattern: /\\["'\\nrt]/,
                            alias: "entity"
                        },
                        variable: t
                    }
                },
                comment: {
                    pattern: /(\s)#.*/,
                    lookbehind: !0,
                    greedy: !0
                },
                keyword: {
                    pattern: /^\S+/,
                    greedy: !0
                },
                boolean: {
                    pattern: /(\s)(?:off|on)(?!\S)/,
                    lookbehind: !0
                },
                number: {
                    pattern: /(\s)\d+[a-z]*(?!\S)/i,
                    lookbehind: !0
                },
                variable: t
            }
        },
        punctuation: /[{};]/
    }
}(Prism),
Prism.languages.nim = {
    comment: {
        pattern: /#.*/,
        greedy: !0
    },
    string: {
        pattern: /(?:\b(?!\d)(?:\w|\\x[89a-fA-F][0-9a-fA-F])+)?(?:"""[\s\S]*?"""(?!")|"(?:\\[\s\S]|""|[^"\\])*")/,
        greedy: !0
    },
    char: {
        pattern: /'(?:\\(?:\d+|x[\da-fA-F]{0,2}|.)|[^'])'/,
        greedy: !0
    },
    function: {
        pattern: /(?:(?!\d)(?:\w|\\x[89a-fA-F][0-9a-fA-F])+|`[^`\r\n]+`)\*?(?:\[[^\]]+\])?(?=\s*\()/,
        greedy: !0,
        inside: {
            operator: /\*$/
        }
    },
    identifier: {
        pattern: /`[^`\r\n]+`/,
        greedy: !0,
        inside: {
            punctuation: /`/
        }
    },
    number: /\b(?:0[xXoObB][\da-fA-F_]+|\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)(?:'?[iuf]\d*)?/,
    keyword: /\b(?:addr|as|asm|atomic|bind|block|break|case|cast|concept|const|continue|converter|defer|discard|distinct|do|elif|else|end|enum|except|export|finally|for|from|func|generic|if|import|include|interface|iterator|let|macro|method|mixin|nil|object|out|proc|ptr|raise|ref|return|static|template|try|tuple|type|using|var|when|while|with|without|yield)\b/,
    operator: {
        pattern: /(^|[({\[](?=\.\.)|(?![({\[]\.).)(?:(?:[=+\-*\/<>@$~&%|!?^:\\]|\.\.|\.(?![)}\]]))+|\b(?:and|div|in|is|isnot|mod|not|notin|of|or|shl|shr|xor)\b)/m,
        lookbehind: !0
    },
    punctuation: /[({\[]\.|\.[)}\]]|[`(){}\[\],:]/
},
Prism.languages.nix = {
    comment: {
        pattern: /\/\*[\s\S]*?\*\/|#.*/,
        greedy: !0
    },
    string: {
        pattern: /"(?:[^"\\]|\\[\s\S])*"|''(?:(?!'')[\s\S]|''(?:'|\\|\$\{))*''/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /(^|(?:^|(?!'').)[^\\])\$\{(?:[^{}]|\{[^}]*\})*\}/,
                lookbehind: !0,
                inside: null
            }
        }
    },
    url: [/\b(?:[a-z]{3,7}:\/\/)[\w\-+%~\/.:#=?&]+/, {
        pattern: /([^\/])(?:[\w\-+%~.:#=?&]*(?!\/\/)[\w\-+%~\/.:#=?&])?(?!\/\/)\/[\w\-+%~\/.:#=?&]*/,
        lookbehind: !0
    }],
    antiquotation: {
        pattern: /\$(?=\{)/,
        alias: "important"
    },
    number: /\b\d+\b/,
    keyword: /\b(?:assert|builtins|else|if|in|inherit|let|null|or|then|with)\b/,
    function: /\b(?:abort|add|all|any|attrNames|attrValues|baseNameOf|compareVersions|concatLists|currentSystem|deepSeq|derivation|dirOf|div|elem(?:At)?|fetch(?:Tarball|url)|filter(?:Source)?|fromJSON|genList|getAttr|getEnv|hasAttr|hashString|head|import|intersectAttrs|is(?:Attrs|Bool|Function|Int|List|Null|String)|length|lessThan|listToAttrs|map|mul|parseDrvName|pathExists|read(?:Dir|File)|removeAttrs|replaceStrings|seq|sort|stringLength|sub(?:string)?|tail|throw|to(?:File|JSON|Path|String|XML)|trace|typeOf)\b|\bfoldl'\B/,
    boolean: /\b(?:false|true)\b/,
    operator: /[=!<>]=?|\+\+?|\|\||&&|\/\/|->?|[?@]/,
    punctuation: /[{}()[\].,:;]/
},
Prism.languages.nix.string.inside.interpolation.inside = Prism.languages.nix,
Prism.languages.ocaml = {
    comment: {
        pattern: /\(\*[\s\S]*?\*\)/,
        greedy: !0
    },
    char: {
        pattern: /'(?:[^\\\r\n']|\\(?:.|[ox]?[0-9a-f]{1,3}))'/i,
        greedy: !0
    },
    string: [{
        pattern: /"(?:\\(?:[\s\S]|\r\n)|[^\\\r\n"])*"/,
        greedy: !0
    }, {
        pattern: /\{([a-z_]*)\|[\s\S]*?\|\1\}/,
        greedy: !0
    }],
    number: [/\b(?:0b[01][01_]*|0o[0-7][0-7_]*)\b/i, /\b0x[a-f0-9][a-f0-9_]*(?:\.[a-f0-9_]*)?(?:p[+-]?\d[\d_]*)?(?!\w)/i, /\b\d[\d_]*(?:\.[\d_]*)?(?:e[+-]?\d[\d_]*)?(?!\w)/i],
    directive: {
        pattern: /\B#\w+/,
        alias: "property"
    },
    label: {
        pattern: /\B~\w+/,
        alias: "property"
    },
    "type-variable": {
        pattern: /\B'\w+/,
        alias: "function"
    },
    variant: {
        pattern: /`\w+/,
        alias: "symbol"
    },
    keyword: /\b(?:as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|match|method|module|mutable|new|nonrec|object|of|open|private|rec|sig|struct|then|to|try|type|val|value|virtual|when|where|while|with)\b/,
    boolean: /\b(?:false|true)\b/,
    "operator-like-punctuation": {
        pattern: /\[[<>|]|[>|]\]|\{<|>\}/,
        alias: "punctuation"
    },
    operator: /\.[.~]|:[=>]|[=<>@^|&+\-*\/$%!?~][!$%&*+\-.\/:<=>?@^|~]*|\b(?:and|asr|land|lor|lsl|lsr|lxor|mod|or)\b/,
    punctuation: /;;|::|[(){}\[\].,:;#]|\b_\b/
},
function(e) {
    var t = /(?:\((?:[^()\\]|\\[\s\S])*\)|\{(?:[^{}\\]|\\[\s\S])*\}|\[(?:[^[\]\\]|\\[\s\S])*\]|<(?:[^<>\\]|\\[\s\S])*>)/.source;
    e.languages.perl = {
        comment: [{
            pattern: /(^\s*)=\w[\s\S]*?=cut.*/m,
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: /(^|[^\\$])#.*/,
            lookbehind: !0,
            greedy: !0
        }],
        string: [{
            pattern: RegExp(/\b(?:q|qq|qw|qx)(?![a-zA-Z0-9])\s*/.source + "(?:" + [/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source, /([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2/.source, t].join("|") + ")"),
            greedy: !0
        }, {
            pattern: /("|`)(?:(?!\1)[^\\]|\\[\s\S])*\1/,
            greedy: !0
        }, {
            pattern: /'(?:[^'\\\r\n]|\\.)*'/,
            greedy: !0
        }],
        regex: [{
            pattern: RegExp(/\b(?:m|qr)(?![a-zA-Z0-9])\s*/.source + "(?:" + [/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source, /([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2/.source, t].join("|") + ")" + /[msixpodualngc]*/.source),
            greedy: !0
        }, {
            pattern: RegExp(/(^|[^-])\b(?:s|tr|y)(?![a-zA-Z0-9])\s*/.source + "(?:" + [/([^a-zA-Z0-9\s{(\[<])(?:(?!\2)[^\\]|\\[\s\S])*\2(?:(?!\2)[^\\]|\\[\s\S])*\2/.source, /([a-zA-Z0-9])(?:(?!\3)[^\\]|\\[\s\S])*\3(?:(?!\3)[^\\]|\\[\s\S])*\3/.source, t + /\s*/.source + t].join("|") + ")" + /[msixpodualngcer]*/.source),
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|x|xor)\b))/,
            greedy: !0
        }],
        variable: [/[&*$@%]\{\^[A-Z]+\}/, /[&*$@%]\^[A-Z_]/, /[&*$@%]#?(?=\{)/, /[&*$@%]#?(?:(?:::)*'?(?!\d)[\w$]+(?![\w$]))+(?:::)*/, /[&*$@%]\d+/, /(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/],
        filehandle: {
            pattern: /<(?![<=])\S*?>|\b_\b/,
            alias: "symbol"
        },
        "v-string": {
            pattern: /v\d+(?:\.\d+)*|\d+(?:\.\d+){2,}/,
            alias: "string"
        },
        function: {
            pattern: /(\bsub[ \t]+)\w+/,
            lookbehind: !0
        },
        keyword: /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|return|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
        number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)\b/,
        operator: /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|xor)\b/,
        punctuation: /[{}[\];(),:]/
    }
}(Prism),
function(e) {
    var t = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/
      , s = [{
        pattern: /\b(?:false|true)\b/i,
        alias: "boolean"
    }, {
        pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
        greedy: !0,
        lookbehind: !0
    }, {
        pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
        greedy: !0,
        lookbehind: !0
    }, /\b(?:null)\b/i, /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/]
      , a = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i
      , n = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/
      , i = /[{}\[\](),:;]/;
    e.languages.php = {
        delimiter: {
            pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
            alias: "important"
        },
        comment: t,
        variable: /\$+(?:\w+\b|(?=\{))/,
        package: {
            pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        },
        "class-name-definition": {
            pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
            lookbehind: !0,
            alias: "class-name"
        },
        "function-definition": {
            pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
            lookbehind: !0,
            alias: "function"
        },
        keyword: [{
            pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
            alias: "type-casting",
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
            alias: "type-hint",
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
            alias: "return-type",
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
            alias: "type-declaration",
            greedy: !0
        }, {
            pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
            alias: "type-declaration",
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /\b(?:parent|self|static)(?=\s*::)/i,
            alias: "static-context",
            greedy: !0
        }, {
            pattern: /(\byield\s+)from\b/i,
            lookbehind: !0
        }, /\bclass\b/i, {
            pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
            lookbehind: !0
        }],
        "argument-name": {
            pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
            lookbehind: !0
        },
        "class-name": [{
            pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
            greedy: !0
        }, {
            pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
            alias: "class-name-fully-qualified",
            greedy: !0,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }, {
            pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
            alias: "class-name-fully-qualified",
            greedy: !0,
            inside: {
                punctuation: /\\/
            }
        }, {
            pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
            alias: "class-name-fully-qualified",
            greedy: !0,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }, {
            pattern: /\b[a-z_]\w*(?=\s*\$)/i,
            alias: "type-declaration",
            greedy: !0
        }, {
            pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
            alias: ["class-name-fully-qualified", "type-declaration"],
            greedy: !0,
            inside: {
                punctuation: /\\/
            }
        }, {
            pattern: /\b[a-z_]\w*(?=\s*::)/i,
            alias: "static-context",
            greedy: !0
        }, {
            pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
            alias: ["class-name-fully-qualified", "static-context"],
            greedy: !0,
            inside: {
                punctuation: /\\/
            }
        }, {
            pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
            alias: "type-hint",
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
            alias: ["class-name-fully-qualified", "type-hint"],
            greedy: !0,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }, {
            pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
            alias: "return-type",
            greedy: !0,
            lookbehind: !0
        }, {
            pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
            alias: ["class-name-fully-qualified", "return-type"],
            greedy: !0,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }],
        constant: s,
        function: {
            pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        },
        property: {
            pattern: /(->\s*)\w+/,
            lookbehind: !0
        },
        number: a,
        operator: n,
        punctuation: i
    };
    var r = {
        pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
        lookbehind: !0,
        inside: e.languages.php
    }
      , o = [{
        pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
        alias: "nowdoc-string",
        greedy: !0,
        inside: {
            delimiter: {
                pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                alias: "symbol",
                inside: {
                    punctuation: /^<<<'?|[';]$/
                }
            }
        }
    }, {
        pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
        alias: "heredoc-string",
        greedy: !0,
        inside: {
            delimiter: {
                pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                alias: "symbol",
                inside: {
                    punctuation: /^<<<"?|[";]$/
                }
            },
            interpolation: r
        }
    }, {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        alias: "backtick-quoted-string",
        greedy: !0
    }, {
        pattern: /'(?:\\[\s\S]|[^\\'])*'/,
        alias: "single-quoted-string",
        greedy: !0
    }, {
        pattern: /"(?:\\[\s\S]|[^\\"])*"/,
        alias: "double-quoted-string",
        greedy: !0,
        inside: {
            interpolation: r
        }
    }];
    e.languages.insertBefore("php", "variable", {
        string: o,
        attribute: {
            pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
            greedy: !0,
            inside: {
                "attribute-content": {
                    pattern: /^(#\[)[\s\S]+(?=\]$)/,
                    lookbehind: !0,
                    inside: {
                        comment: t,
                        string: o,
                        "attribute-class-name": [{
                            pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                            alias: "class-name",
                            greedy: !0,
                            lookbehind: !0
                        }, {
                            pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                            alias: ["class-name", "class-name-fully-qualified"],
                            greedy: !0,
                            lookbehind: !0,
                            inside: {
                                punctuation: /\\/
                            }
                        }],
                        constant: s,
                        number: a,
                        operator: n,
                        punctuation: i
                    }
                },
                delimiter: {
                    pattern: /^#\[|\]$/,
                    alias: "punctuation"
                }
            }
        }
    }),
    e.hooks.add("before-tokenize", (function(t) {
        if (/<\?/.test(t.code)) {
            var s = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g;
            e.languages["markup-templating"].buildPlaceholders(t, "php", s)
        }
    }
    )),
    e.hooks.add("after-tokenize", (function(t) {
        e.languages["markup-templating"].tokenizePlaceholders(t, "php")
    }
    ))
}(Prism),
Prism.languages.python = {
    comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0,
        greedy: !0
    },
    "string-interpolation": {
        pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
                lookbehind: !0,
                inside: {
                    "format-spec": {
                        pattern: /(:)[^:(){}]+(?=\}$)/,
                        lookbehind: !0
                    },
                    "conversion-option": {
                        pattern: /![sra](?=[:}]$)/,
                        alias: "punctuation"
                    },
                    rest: null
                }
            },
            string: /[\s\S]+/
        }
    },
    "triple-quoted-string": {
        pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
        greedy: !0,
        alias: "string"
    },
    string: {
        pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
        greedy: !0
    },
    function: {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: !0
    },
    "class-name": {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: !0
    },
    decorator: {
        pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
        lookbehind: !0,
        alias: ["annotation", "punctuation"],
        inside: {
            punctuation: /\./
        }
    },
    keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:False|None|True)\b/,
    number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
    operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/
},
Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python,
Prism.languages.py = Prism.languages.python,
function(e) {
    for (var t = /"(?:\\.|[^\\"\r\n])*"|'(?:\\.|[^\\'\r\n])*'/.source, s = /\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\//.source, a = /(?:[^\\()[\]{}"'/]|<string>|\/(?![*/])|<comment>|\(<expr>*\)|\[<expr>*\]|\{<expr>*\}|\\[\s\S])/.source.replace(/<string>/g, (function() {
        return t
    }
    )).replace(/<comment>/g, (function() {
        return s
    }
    )), n = 0; n < 2; n++)
        a = a.replace(/<expr>/g, (function() {
            return a
        }
        ));
    a = a.replace(/<expr>/g, "[^\\s\\S]"),
    e.languages.qml = {
        comment: {
            pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
            greedy: !0
        },
        "javascript-function": {
            pattern: RegExp(/((?:^|;)[ \t]*)function\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*\(<js>*\)\s*\{<js>*\}/.source.replace(/<js>/g, (function() {
                return a
            }
            )), "m"),
            lookbehind: !0,
            greedy: !0,
            alias: "language-javascript",
            inside: e.languages.javascript
        },
        "class-name": {
            pattern: /((?:^|[:;])[ \t]*)(?!\d)\w+(?=[ \t]*\{|[ \t]+on\b)/m,
            lookbehind: !0
        },
        property: [{
            pattern: /((?:^|[;{])[ \t]*)(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
            lookbehind: !0
        }, {
            pattern: /((?:^|[;{])[ \t]*)property[ \t]+(?!\d)\w+(?:\.\w+)*[ \t]+(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
            lookbehind: !0,
            inside: {
                keyword: /^property/,
                property: /\w+(?:\.\w+)*/
            }
        }],
        "javascript-expression": {
            pattern: RegExp(/(:[ \t]*)(?![\s;}[])(?:(?!$|[;}])<js>)+/.source.replace(/<js>/g, (function() {
                return a
            }
            )), "m"),
            lookbehind: !0,
            greedy: !0,
            alias: "language-javascript",
            inside: e.languages.javascript
        },
        string: {
            pattern: /"(?:\\.|[^\\"\r\n])*"/,
            greedy: !0
        },
        keyword: /\b(?:as|import|on)\b/,
        punctuation: /[{}[\]:;,]/
    }
}(Prism),
Prism.languages.r = {
    comment: /#.*/,
    string: {
        pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "percent-operator": {
        pattern: /%[^%\s]*%/,
        alias: "operator"
    },
    boolean: /\b(?:FALSE|TRUE)\b/,
    ellipsis: /\.\.(?:\.|\d+)/,
    number: [/\b(?:Inf|NaN)\b/, /(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+(?:\.\d*)?|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
    keyword: /\b(?:NA|NA_character_|NA_complex_|NA_integer_|NA_real_|NULL|break|else|for|function|if|in|next|repeat|while)\b/,
    operator: /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
    punctuation: /[(){}\[\],;]/
},
function(e) {
    function t(e, t) {
        return e = e.replace(/<S>/g, (function() {
            return a
        }
        )).replace(/<BRACES>/g, (function() {
            return n
        }
        )).replace(/<SPREAD>/g, (function() {
            return i
        }
        )),
        RegExp(e, t)
    }
    var s = e.util.clone(e.languages.javascript)
      , a = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source
      , n = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source
      , i = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
    i = t(i).source,
    e.languages.jsx = e.languages.extend("markup", s),
    e.languages.jsx.tag.pattern = t(/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source),
    e.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/,
    e.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,
    e.languages.jsx.tag.inside.tag.inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/,
    e.languages.jsx.tag.inside.comment = s.comment,
    e.languages.insertBefore("inside", "attr-name", {
        spread: {
            pattern: t(/<SPREAD>/.source),
            inside: e.languages.jsx
        }
    }, e.languages.jsx.tag),
    e.languages.insertBefore("inside", "special-attr", {
        script: {
            pattern: t(/=<BRACES>/.source),
            alias: "language-javascript",
            inside: {
                "script-punctuation": {
                    pattern: /^=(?=\{)/,
                    alias: "punctuation"
                },
                rest: e.languages.jsx
            }
        }
    }, e.languages.jsx.tag);
    var r = function(e) {
        return e ? "string" == typeof e ? e : "string" == typeof e.content ? e.content : e.content.map(r).join("") : ""
    }
      , o = function(t) {
        for (var s = [], a = 0; a < t.length; a++) {
            var n = t[a]
              , i = !1;
            if ("string" != typeof n && ("tag" === n.type && n.content[0] && "tag" === n.content[0].type ? "</" === n.content[0].content[0].content ? s.length > 0 && s[s.length - 1].tagName === r(n.content[0].content[1]) && s.pop() : "/>" === n.content[n.content.length - 1].content || s.push({
                tagName: r(n.content[0].content[1]),
                openedBraces: 0
            }) : s.length > 0 && "punctuation" === n.type && "{" === n.content ? s[s.length - 1].openedBraces++ : s.length > 0 && s[s.length - 1].openedBraces > 0 && "punctuation" === n.type && "}" === n.content ? s[s.length - 1].openedBraces-- : i = !0),
            (i || "string" == typeof n) && s.length > 0 && 0 === s[s.length - 1].openedBraces) {
                var l = r(n);
                a < t.length - 1 && ("string" == typeof t[a + 1] || "plain-text" === t[a + 1].type) && (l += r(t[a + 1]),
                t.splice(a + 1, 1)),
                a > 0 && ("string" == typeof t[a - 1] || "plain-text" === t[a - 1].type) && (l = r(t[a - 1]) + l,
                t.splice(a - 1, 1),
                a--),
                t[a] = new e.Token("plain-text",l,null,l)
            }
            n.content && "string" != typeof n.content && o(n.content)
        }
    };
    e.hooks.add("after-tokenize", (function(e) {
        "jsx" !== e.language && "tsx" !== e.language || o(e.tokens)
    }
    ))
}(Prism),
function(e) {
    for (var t = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source, s = 0; s < 2; s++)
        t = t.replace(/<self>/g, (function() {
            return t
        }
        ));
    t = t.replace(/<self>/g, (function() {
        return /[^\s\S]/.source
    }
    )),
    e.languages.rust = {
        comment: [{
            pattern: RegExp(/(^|[^\\])/.source + t),
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: !0,
            greedy: !0
        }],
        string: {
            pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
            greedy: !0
        },
        char: {
            pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
            greedy: !0
        },
        attribute: {
            pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
            greedy: !0,
            alias: "attr-name",
            inside: {
                string: null
            }
        },
        "closure-params": {
            pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
            lookbehind: !0,
            greedy: !0,
            inside: {
                "closure-punctuation": {
                    pattern: /^\||\|$/,
                    alias: "punctuation"
                },
                rest: null
            }
        },
        "lifetime-annotation": {
            pattern: /'\w+/,
            alias: "symbol"
        },
        "fragment-specifier": {
            pattern: /(\$\w+:)[a-z]+/,
            lookbehind: !0,
            alias: "punctuation"
        },
        variable: /\$\w+/,
        "function-definition": {
            pattern: /(\bfn\s+)\w+/,
            lookbehind: !0,
            alias: "function"
        },
        "type-definition": {
            pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
            lookbehind: !0,
            alias: "class-name"
        },
        "module-declaration": [{
            pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
            lookbehind: !0,
            alias: "namespace"
        }, {
            pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
            lookbehind: !0,
            alias: "namespace",
            inside: {
                punctuation: /::/
            }
        }],
        keyword: [/\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/, /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/],
        function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
        macro: {
            pattern: /\b\w+!/,
            alias: "property"
        },
        constant: /\b[A-Z_][A-Z_\d]+\b/,
        "class-name": /\b[A-Z]\w*\b/,
        namespace: {
            pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
            inside: {
                punctuation: /::/
            }
        },
        number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
        boolean: /\b(?:false|true)\b/,
        punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
        operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
    },
    e.languages.rust["closure-params"].inside.rest = e.languages.rust,
    e.languages.rust.attribute.inside.string = e.languages.rust.string
}(Prism),
Prism.languages.scss = Prism.languages.extend("css", {
    comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
        lookbehind: !0
    },
    atrule: {
        pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
        inside: {
            rule: /@[\w-]+/
        }
    },
    url: /(?:[-a-z]+-)?url(?=\()/i,
    selector: {
        pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
        inside: {
            parent: {
                pattern: /&/,
                alias: "important"
            },
            placeholder: /%[-\w]+/,
            variable: /\$[-\w]+|#\{\$[-\w]+\}/
        }
    },
    property: {
        pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
        inside: {
            variable: /\$[-\w]+|#\{\$[-\w]+\}/
        }
    }
}),
Prism.languages.insertBefore("scss", "atrule", {
    keyword: [/@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i, {
        pattern: /( )(?:from|through)(?= )/,
        lookbehind: !0
    }]
}),
Prism.languages.insertBefore("scss", "important", {
    variable: /\$[-\w]+|#\{\$[-\w]+\}/
}),
Prism.languages.insertBefore("scss", "function", {
    "module-modifier": {
        pattern: /\b(?:as|hide|show|with)\b/i,
        alias: "keyword"
    },
    placeholder: {
        pattern: /%[-\w]+/,
        alias: "selector"
    },
    statement: {
        pattern: /\B!(?:default|optional)\b/i,
        alias: "keyword"
    },
    boolean: /\b(?:false|true)\b/,
    null: {
        pattern: /\bnull\b/,
        alias: "keyword"
    },
    operator: {
        pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/,
        lookbehind: !0
    }
}),
Prism.languages.scss.atrule.inside.rest = Prism.languages.scss,
Prism.languages.scala = Prism.languages.extend("java", {
    "triple-quoted-string": {
        pattern: /"""[\s\S]*?"""/,
        greedy: !0,
        alias: "string"
    },
    string: {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    keyword: /<-|=>|\b(?:abstract|case|catch|class|def|derives|do|else|enum|extends|extension|final|finally|for|forSome|given|if|implicit|import|infix|inline|lazy|match|new|null|object|opaque|open|override|package|private|protected|return|sealed|self|super|this|throw|trait|transparent|try|type|using|val|var|while|with|yield)\b/,
    number: /\b0x(?:[\da-f]*\.)?[\da-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e\d+)?[dfl]?/i,
    builtin: /\b(?:Any|AnyRef|AnyVal|Boolean|Byte|Char|Double|Float|Int|Long|Nothing|Short|String|Unit)\b/,
    symbol: /'[^\d\s\\]\w*/
}),
Prism.languages.insertBefore("scala", "triple-quoted-string", {
    "string-interpolation": {
        pattern: /\b[a-z]\w*(?:"""(?:[^$]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*?"""|"(?:[^$"\r\n]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*")/i,
        greedy: !0,
        inside: {
            id: {
                pattern: /^\w+/,
                greedy: !0,
                alias: "function"
            },
            escape: {
                pattern: /\\\$"|\$[$"]/,
                greedy: !0,
                alias: "symbol"
            },
            interpolation: {
                pattern: /\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
                greedy: !0,
                inside: {
                    punctuation: /^\$\{?|\}$/,
                    expression: {
                        pattern: /[\s\S]+/,
                        inside: Prism.languages.scala
                    }
                }
            },
            string: /[\s\S]+/
        }
    }
}),
delete Prism.languages.scala["class-name"],
delete Prism.languages.scala.function,
delete Prism.languages.scala.constant,
function(e) {
    var t = [/"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/.source, /'[^']*'/.source, /\$'(?:[^'\\]|\\[\s\S])*'/.source, /<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2/.source].join("|");
    e.languages["shell-session"] = {
        command: {
            pattern: RegExp(/^/.source + "(?:" + /[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?/.source + "|" + /[/~.][^\0-\x1F$#%*?"<>@:;|]*/.source + ")?" + /[$#%](?=\s)/.source + /(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|<<str>>)+/.source.replace(/<<str>>/g, (function() {
                return t
            }
            )), "m"),
            greedy: !0,
            inside: {
                info: {
                    pattern: /^[^#$%]+/,
                    alias: "punctuation",
                    inside: {
                        user: /^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,
                        punctuation: /:/,
                        path: /[\s\S]+/
                    }
                },
                bash: {
                    pattern: /(^[$#%]\s*)\S[\s\S]*/,
                    lookbehind: !0,
                    alias: "language-bash",
                    inside: e.languages.bash
                },
                "shell-symbol": {
                    pattern: /^[$#%]/,
                    alias: "important"
                }
            }
        },
        output: /.(?:.*(?:[\r\n]|.$))*/
    },
    e.languages["sh-session"] = e.languages.shellsession = e.languages["shell-session"]
}(Prism),
Prism.languages.sql = {
    comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
        lookbehind: !0
    },
    variable: [{
        pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
        greedy: !0
    }, /@[\w.$]+/],
    string: {
        pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
        greedy: !0,
        lookbehind: !0
    },
    identifier: {
        pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
        greedy: !0,
        lookbehind: !0,
        inside: {
            punctuation: /^`|`$/
        }
    },
    function: /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
    keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
    boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
    number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
    operator: /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    punctuation: /[;[\]()`,.]/
},
function(e) {
    e.languages.typescript = e.languages.extend("javascript", {
        "class-name": {
            pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
            lookbehind: !0,
            greedy: !0,
            inside: null
        },
        builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
    }),
    e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/, /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/, /\btype\b(?=\s*(?:[\{*]|$))/),
    delete e.languages.typescript.parameter,
    delete e.languages.typescript["literal-property"];
    var t = e.languages.extend("typescript", {});
    delete t["class-name"],
    e.languages.typescript["class-name"].inside = t,
    e.languages.insertBefore("typescript", "function", {
        decorator: {
            pattern: /@[$\w\xA0-\uFFFF]+/,
            inside: {
                at: {
                    pattern: /^@/,
                    alias: "operator"
                },
                function: /^[\s\S]+/
            }
        },
        "generic-function": {
            pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
            greedy: !0,
            inside: {
                function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
                generic: {
                    pattern: /<[\s\S]+/,
                    alias: "class-name",
                    inside: t
                }
            }
        }
    }),
    e.languages.ts = e.languages.typescript
}(Prism),
function(e) {
    function t(e, t) {
        t = (t || "").replace(/m/g, "") + "m";
        var s = /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g, (function() {
            return n
        }
        )).replace(/<<value>>/g, (function() {
            return e
        }
        ));
        return RegExp(s, t)
    }
    var s = /[*&][^\s[\]{},]+/
      , a = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/
      , n = "(?:" + a.source + "(?:[ \t]+" + s.source + ")?|" + s.source + "(?:[ \t]+" + a.source + ")?)"
      , i = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g, (function() {
        return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source
    }
    ))
      , r = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
    e.languages.yaml = {
        scalar: {
            pattern: RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g, (function() {
                return n
            }
            ))),
            lookbehind: !0,
            alias: "string"
        },
        comment: /#.*/,
        key: {
            pattern: RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g, (function() {
                return n
            }
            )).replace(/<<key>>/g, (function() {
                return "(?:" + i + "|" + r + ")"
            }
            ))),
            lookbehind: !0,
            greedy: !0,
            alias: "atrule"
        },
        directive: {
            pattern: /(^[ \t]*)%.+/m,
            lookbehind: !0,
            alias: "important"
        },
        datetime: {
            pattern: t(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),
            lookbehind: !0,
            alias: "number"
        },
        boolean: {
            pattern: t(/false|true/.source, "i"),
            lookbehind: !0,
            alias: "important"
        },
        null: {
            pattern: t(/null|~/.source, "i"),
            lookbehind: !0,
            alias: "important"
        },
        string: {
            pattern: t(r),
            lookbehind: !0,
            greedy: !0
        },
        number: {
            pattern: t(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source, "i"),
            lookbehind: !0
        },
        tag: a,
        important: s,
        punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
    },
    e.languages.yml = e.languages.yaml
}(Prism),
function(e) {
    function t(e) {
        return function() {
            return e
        }
    }
    var s = /\b(?:align|allowzero|and|anyframe|anytype|asm|async|await|break|cancel|catch|comptime|const|continue|defer|else|enum|errdefer|error|export|extern|fn|for|if|inline|linksection|nakedcc|noalias|nosuspend|null|or|orelse|packed|promise|pub|resume|return|stdcallcc|struct|suspend|switch|test|threadlocal|try|undefined|union|unreachable|usingnamespace|var|volatile|while)\b/
      , a = "\\b(?!" + s.source + ")(?!\\d)\\w+\\b"
      , n = /align\s*\((?:[^()]|\([^()]*\))*\)/.source
      , i = "(?!\\s)(?:!?\\s*(?:" + /(?:\?|\bpromise->|(?:\[[^[\]]*\]|\*(?!\*)|\*\*)(?:\s*<ALIGN>|\s*const\b|\s*volatile\b|\s*allowzero\b)*)/.source.replace(/<ALIGN>/g, t(n)) + "\\s*)*" + /(?:\bpromise\b|(?:\berror\.)?<ID>(?:\.<ID>)*(?!\s+<ID>))/.source.replace(/<ID>/g, t(a)) + ")+";
    e.languages.zig = {
        comment: [{
            pattern: /\/\/[/!].*/,
            alias: "doc-comment"
        }, /\/{2}.*/],
        string: [{
            pattern: /(^|[^\\@])c?"(?:[^"\\\r\n]|\\.)*"/,
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: /([\r\n])([ \t]+c?\\{2}).*(?:(?:\r\n?|\n)\2.*)*/,
            lookbehind: !0,
            greedy: !0
        }],
        char: {
            pattern: /(^|[^\\])'(?:[^'\\\r\n]|[\uD800-\uDFFF]{2}|\\(?:.|x[a-fA-F\d]{2}|u\{[a-fA-F\d]{1,6}\}))'/,
            lookbehind: !0,
            greedy: !0
        },
        builtin: /\B@(?!\d)\w+(?=\s*\()/,
        label: {
            pattern: /(\b(?:break|continue)\s*:\s*)\w+\b|\b(?!\d)\w+\b(?=\s*:\s*(?:\{|while\b))/,
            lookbehind: !0
        },
        "class-name": [/\b(?!\d)\w+(?=\s*=\s*(?:(?:extern|packed)\s+)?(?:enum|struct|union)\s*[({])/, {
            pattern: RegExp(/(:\s*)<TYPE>(?=\s*(?:<ALIGN>\s*)?[=;,)])|<TYPE>(?=\s*(?:<ALIGN>\s*)?\{)/.source.replace(/<TYPE>/g, t(i)).replace(/<ALIGN>/g, t(n))),
            lookbehind: !0,
            inside: null
        }, {
            pattern: RegExp(/(\)\s*)<TYPE>(?=\s*(?:<ALIGN>\s*)?;)/.source.replace(/<TYPE>/g, t(i)).replace(/<ALIGN>/g, t(n))),
            lookbehind: !0,
            inside: null
        }],
        "builtin-type": {
            pattern: /\b(?:anyerror|bool|c_u?(?:int|long|longlong|short)|c_longdouble|c_void|comptime_(?:float|int)|f(?:16|32|64|128)|[iu](?:8|16|32|64|128|size)|noreturn|type|void)\b/,
            alias: "keyword"
        },
        keyword: s,
        function: /\b(?!\d)\w+(?=\s*\()/,
        number: /\b(?:0b[01]+|0o[0-7]+|0x[a-fA-F\d]+(?:\.[a-fA-F\d]*)?(?:[pP][+-]?[a-fA-F\d]+)?|\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\b/,
        boolean: /\b(?:false|true)\b/,
        operator: /\.[*?]|\.{2,3}|[-=]>|\*\*|\+\+|\|\||(?:<<|>>|[-+*]%|[-+*/%^&|<>!=])=?|[?~]/,
        punctuation: /[.:,;(){}[\]]/
    },
    e.languages.zig["class-name"].forEach((function(t) {
        null === t.inside && (t.inside = e.languages.zig)
    }
    ))
}(Prism),
/*! Raven.js 3.20.1 (42adaf5) | github.com/getsentry/raven-js */
/*
 * Includes TraceKit
 * https://github.com/getsentry/TraceKit
 *
 * Copyright 2017 Matt Robenolt and other contributors
 * Released under the BSD license
 * https://github.com/getsentry/raven-js/blob/master/LICENSE
 *
 */
function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Raven = e()
    }
}((function() {
    return function e(t, s, a) {
        function n(r, o) {
            if (!s[r]) {
                if (!t[r]) {
                    var l = "function" == typeof require && require;
                    if (!o && l)
                        return l(r, !0);
                    if (i)
                        return i(r, !0);
                    var c = new Error("Cannot find module '" + r + "'");
                    throw c.code = "MODULE_NOT_FOUND",
                    c
                }
                var d = s[r] = {
                    exports: {}
                };
                t[r][0].call(d.exports, (function(e) {
                    var s = t[r][1][e];
                    return n(s || e)
                }
                ), d, d.exports, e, t, s, a)
            }
            return s[r].exports
        }
        for (var i = "function" == typeof require && require, r = 0; r < a.length; r++)
            n(a[r]);
        return n
    }({
        1: [function(e, t) {
            function s(e) {
                this.name = "RavenConfigError",
                this.message = e
            }
            s.prototype = new Error,
            s.prototype.constructor = s,
            t.exports = s
        }
        , {}],
        2: [function(e, t) {
            var s = function(e, t, s) {
                var a = e[t]
                  , n = e;
                if (t in e) {
                    var i = "warn" === t ? "warning" : t;
                    e[t] = function() {
                        var e = [].slice.call(arguments)
                          , r = "" + e.join(" ")
                          , o = {
                            level: i,
                            logger: "console",
                            extra: {
                                arguments: e
                            }
                        };
                        "assert" === t ? !1 === e[0] && (r = "Assertion failed: " + (e.slice(1).join(" ") || "console.assert"),
                        o.extra.arguments = e.slice(1),
                        s && s(r, o)) : s && s(r, o),
                        a && Function.prototype.apply.call(a, n, e)
                    }
                }
            };
            t.exports = {
                wrapMethod: s
            }
        }
        , {}],
        3: [function(e, t) {
            (function(s) {
                function a() {
                    return +new Date
                }
                function n(e, t) {
                    return g(t) ? function(s) {
                        return t(s, e)
                    }
                    : t
                }
                function i() {
                    for (var e in this._hasJSON = !("object" != typeof JSON || !JSON.stringify),
                    this._hasDocument = !p(L),
                    this._hasNavigator = !p($),
                    this._lastCapturedException = null,
                    this._lastData = null,
                    this._lastEventId = null,
                    this._globalServer = null,
                    this._globalKey = null,
                    this._globalProject = null,
                    this._globalContext = {},
                    this._globalOptions = {
                        logger: "javascript",
                        ignoreErrors: [],
                        ignoreUrls: [],
                        whitelistUrls: [],
                        includePaths: [],
                        collectWindowErrors: !0,
                        maxMessageLength: 0,
                        maxUrlLength: 250,
                        stackTraceLimit: 50,
                        autoBreadcrumbs: !0,
                        instrument: !0,
                        sampleRate: 1
                    },
                    this._ignoreOnError = 0,
                    this._isRavenInstalled = !1,
                    this._originalErrorStackTraceLimit = Error.stackTraceLimit,
                    this._originalConsole = P.console || {},
                    this._originalConsoleMethods = {},
                    this._plugins = [],
                    this._startTime = a(),
                    this._wrappedBuiltIns = [],
                    this._breadcrumbs = [],
                    this._lastCapturedEvent = null,
                    this._keypressTimeout,
                    this._location = P.location,
                    this._lastHref = this._location && this._location.href,
                    this._resetBackoff(),
                    this._originalConsole)
                        this._originalConsoleMethods[e] = this._originalConsole[e]
                }
                var r = e(6)
                  , o = e(7)
                  , l = e(1)
                  , c = e(5)
                  , d = c.isError
                  , u = c.isObject
                  , h = c.isErrorEvent
                  , p = c.isUndefined
                  , g = c.isFunction
                  , f = c.isString
                  , m = c.isArray
                  , b = c.isEmptyObject
                  , _ = c.each
                  , v = c.objectMerge
                  , E = c.truncate
                  , y = c.objectFrozen
                  , w = c.hasKey
                  , S = c.joinRegExp
                  , T = c.urlencode
                  , k = c.uuid4
                  , A = c.htmlTreeAsString
                  , C = c.isSameException
                  , R = c.isSameStacktrace
                  , N = c.parseUrl
                  , I = c.fill
                  , D = e(2).wrapMethod
                  , x = "source protocol user pass host port path".split(" ")
                  , O = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/
                  , P = "undefined" != typeof window ? window : void 0 !== s ? s : "undefined" != typeof self ? self : {}
                  , L = P.document
                  , $ = P.navigator;
                i.prototype = {
                    VERSION: "3.20.1",
                    debug: !1,
                    TraceKit: r,
                    config: function(e, t) {
                        var s = this;
                        if (s._globalServer)
                            return this._logDebug("error", "Error: Raven has already been configured"),
                            s;
                        if (!e)
                            return s;
                        var a = s._globalOptions;
                        t && _(t, (function(e, t) {
                            "tags" === e || "extra" === e || "user" === e ? s._globalContext[e] = t : a[e] = t
                        }
                        )),
                        s.setDSN(e),
                        a.ignoreErrors.push(/^Script error\.?$/),
                        a.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/),
                        a.ignoreErrors = S(a.ignoreErrors),
                        a.ignoreUrls = !!a.ignoreUrls.length && S(a.ignoreUrls),
                        a.whitelistUrls = !!a.whitelistUrls.length && S(a.whitelistUrls),
                        a.includePaths = S(a.includePaths),
                        a.maxBreadcrumbs = Math.max(0, Math.min(a.maxBreadcrumbs || 100, 100));
                        var n = {
                            xhr: !0,
                            console: !0,
                            dom: !0,
                            location: !0,
                            sentry: !0
                        }
                          , i = a.autoBreadcrumbs;
                        "[object Object]" === {}.toString.call(i) ? i = v(n, i) : !1 !== i && (i = n),
                        a.autoBreadcrumbs = i;
                        var o = {
                            tryCatch: !0
                        }
                          , l = a.instrument;
                        return "[object Object]" === {}.toString.call(l) ? l = v(o, l) : !1 !== l && (l = o),
                        a.instrument = l,
                        r.collectWindowErrors = !!a.collectWindowErrors,
                        s
                    },
                    install: function() {
                        var e = this;
                        return e.isSetup() && !e._isRavenInstalled && (r.report.subscribe((function() {
                            e._handleOnErrorStackInfo.apply(e, arguments)
                        }
                        )),
                        e._patchFunctionToString(),
                        e._globalOptions.instrument && e._globalOptions.instrument.tryCatch && e._instrumentTryCatch(),
                        e._globalOptions.autoBreadcrumbs && e._instrumentBreadcrumbs(),
                        e._drainPlugins(),
                        e._isRavenInstalled = !0),
                        Error.stackTraceLimit = e._globalOptions.stackTraceLimit,
                        this
                    },
                    setDSN: function(e) {
                        var t = this
                          , s = t._parseDSN(e)
                          , a = s.path.lastIndexOf("/")
                          , n = s.path.substr(1, a);
                        t._dsn = e,
                        t._globalKey = s.user,
                        t._globalSecret = s.pass && s.pass.substr(1),
                        t._globalProject = s.path.substr(a + 1),
                        t._globalServer = t._getGlobalServer(s),
                        t._globalEndpoint = t._globalServer + "/" + n + "api/" + t._globalProject + "/store/",
                        this._resetBackoff()
                    },
                    context: function(e, t, s) {
                        return g(e) && (s = t || [],
                        t = e,
                        e = void 0),
                        this.wrap(e, t).apply(this, s)
                    },
                    wrap: function(e, t, s) {
                        function a() {
                            var a = []
                              , i = arguments.length
                              , r = !e || e && !1 !== e.deep;
                            for (s && g(s) && s.apply(this, arguments); i--; )
                                a[i] = r ? n.wrap(e, arguments[i]) : arguments[i];
                            try {
                                return t.apply(this, a)
                            } catch (t) {
                                throw n._ignoreNextOnError(),
                                n.captureException(t, e),
                                t
                            }
                        }
                        var n = this;
                        if (p(t) && !g(e))
                            return e;
                        if (g(e) && (t = e,
                        e = void 0),
                        !g(t))
                            return t;
                        try {
                            if (t.__raven__)
                                return t;
                            if (t.__raven_wrapper__)
                                return t.__raven_wrapper__
                        } catch (e) {
                            return t
                        }
                        for (var i in t)
                            w(t, i) && (a[i] = t[i]);
                        return a.prototype = t.prototype,
                        t.__raven_wrapper__ = a,
                        a.__raven__ = !0,
                        a.__orig__ = t,
                        a
                    },
                    uninstall: function() {
                        return r.report.uninstall(),
                        this._unpatchFunctionToString(),
                        this._restoreBuiltIns(),
                        Error.stackTraceLimit = this._originalErrorStackTraceLimit,
                        this._isRavenInstalled = !1,
                        this
                    },
                    captureException: function(e, t) {
                        var s = !d(e)
                          , a = !h(e)
                          , n = h(e) && !e.error;
                        if (s && a || n)
                            return this.captureMessage(e, v({
                                trimHeadFrames: 1,
                                stacktrace: !0
                            }, t));
                        h(e) && (e = e.error),
                        this._lastCapturedException = e;
                        try {
                            var i = r.computeStackTrace(e);
                            this._handleStackInfo(i, t)
                        } catch (t) {
                            if (e !== t)
                                throw t
                        }
                        return this
                    },
                    captureMessage: function(e, t) {
                        if (!this._globalOptions.ignoreErrors.test || !this._globalOptions.ignoreErrors.test(e)) {
                            var s, a = v({
                                message: e + ""
                            }, t = t || {});
                            try {
                                throw new Error(e)
                            } catch (e) {
                                s = e
                            }
                            s.name = null;
                            var n = r.computeStackTrace(s)
                              , i = m(n.stack) && n.stack[1]
                              , o = i && i.url || "";
                            if ((!this._globalOptions.ignoreUrls.test || !this._globalOptions.ignoreUrls.test(o)) && (!this._globalOptions.whitelistUrls.test || this._globalOptions.whitelistUrls.test(o))) {
                                if (this._globalOptions.stacktrace || t && t.stacktrace) {
                                    t = v({
                                        fingerprint: e,
                                        trimHeadFrames: (t.trimHeadFrames || 0) + 1
                                    }, t);
                                    var l = this._prepareFrames(n, t);
                                    a.stacktrace = {
                                        frames: l.reverse()
                                    }
                                }
                                return this._send(a),
                                this
                            }
                        }
                    },
                    captureBreadcrumb: function(e) {
                        var t = v({
                            timestamp: a() / 1e3
                        }, e);
                        if (g(this._globalOptions.breadcrumbCallback)) {
                            var s = this._globalOptions.breadcrumbCallback(t);
                            if (u(s) && !b(s))
                                t = s;
                            else if (!1 === s)
                                return this
                        }
                        return this._breadcrumbs.push(t),
                        this._breadcrumbs.length > this._globalOptions.maxBreadcrumbs && this._breadcrumbs.shift(),
                        this
                    },
                    addPlugin: function(e) {
                        var t = [].slice.call(arguments, 1);
                        return this._plugins.push([e, t]),
                        this._isRavenInstalled && this._drainPlugins(),
                        this
                    },
                    setUserContext: function(e) {
                        return this._globalContext.user = e,
                        this
                    },
                    setExtraContext: function(e) {
                        return this._mergeContext("extra", e),
                        this
                    },
                    setTagsContext: function(e) {
                        return this._mergeContext("tags", e),
                        this
                    },
                    clearContext: function() {
                        return this._globalContext = {},
                        this
                    },
                    getContext: function() {
                        return JSON.parse(o(this._globalContext))
                    },
                    setEnvironment: function(e) {
                        return this._globalOptions.environment = e,
                        this
                    },
                    setRelease: function(e) {
                        return this._globalOptions.release = e,
                        this
                    },
                    setDataCallback: function(e) {
                        var t = this._globalOptions.dataCallback;
                        return this._globalOptions.dataCallback = n(t, e),
                        this
                    },
                    setBreadcrumbCallback: function(e) {
                        var t = this._globalOptions.breadcrumbCallback;
                        return this._globalOptions.breadcrumbCallback = n(t, e),
                        this
                    },
                    setShouldSendCallback: function(e) {
                        var t = this._globalOptions.shouldSendCallback;
                        return this._globalOptions.shouldSendCallback = n(t, e),
                        this
                    },
                    setTransport: function(e) {
                        return this._globalOptions.transport = e,
                        this
                    },
                    lastException: function() {
                        return this._lastCapturedException
                    },
                    lastEventId: function() {
                        return this._lastEventId
                    },
                    isSetup: function() {
                        return !!this._hasJSON && (!!this._globalServer || (this.ravenNotConfiguredError || (this.ravenNotConfiguredError = !0,
                        this._logDebug("error", "Error: Raven has not been configured.")),
                        !1))
                    },
                    afterLoad: function() {
                        var e = P.RavenConfig;
                        e && this.config(e.dsn, e.config).install()
                    },
                    showReportDialog: function(e) {
                        if (L) {
                            var t = (e = e || {}).eventId || this.lastEventId();
                            if (!t)
                                throw new l("Missing eventId");
                            var s = e.dsn || this._dsn;
                            if (!s)
                                throw new l("Missing DSN");
                            var a = encodeURIComponent
                              , n = "";
                            n += "?eventId=" + a(t),
                            n += "&dsn=" + a(s);
                            var i = e.user || this._globalContext.user;
                            i && (i.name && (n += "&name=" + a(i.name)),
                            i.email && (n += "&email=" + a(i.email)));
                            var r = this._getGlobalServer(this._parseDSN(s))
                              , o = L.createElement("script");
                            o.async = !0,
                            o.src = r + "/api/embed/error-page/" + n,
                            (L.head || L.body).appendChild(o)
                        }
                    },
                    _ignoreNextOnError: function() {
                        var e = this;
                        this._ignoreOnError += 1,
                        setTimeout((function() {
                            e._ignoreOnError -= 1
                        }
                        ))
                    },
                    _triggerEvent: function(e, t) {
                        var s, a;
                        if (this._hasDocument) {
                            for (a in t = t || {},
                            e = "raven" + e.substr(0, 1).toUpperCase() + e.substr(1),
                            L.createEvent ? (s = L.createEvent("HTMLEvents")).initEvent(e, !0, !0) : (s = L.createEventObject()).eventType = e,
                            t)
                                w(t, a) && (s[a] = t[a]);
                            if (L.createEvent)
                                L.dispatchEvent(s);
                            else
                                try {
                                    L.fireEvent("on" + s.eventType.toLowerCase(), s)
                                } catch (e) {}
                        }
                    },
                    _breadcrumbEventHandler: function(e) {
                        var t = this;
                        return function(s) {
                            if (t._keypressTimeout = null,
                            t._lastCapturedEvent !== s) {
                                var a;
                                t._lastCapturedEvent = s;
                                try {
                                    a = A(s.target)
                                } catch (e) {
                                    a = "<unknown>"
                                }
                                t.captureBreadcrumb({
                                    category: "ui." + e,
                                    message: a
                                })
                            }
                        }
                    },
                    _keypressEventHandler: function() {
                        var e = this
                          , t = 1e3;
                        return function(s) {
                            var a;
                            try {
                                a = s.target
                            } catch (e) {
                                return
                            }
                            var n = a && a.tagName;
                            if (n && ("INPUT" === n || "TEXTAREA" === n || a.isContentEditable)) {
                                var i = e._keypressTimeout;
                                i || e._breadcrumbEventHandler("input")(s),
                                clearTimeout(i),
                                e._keypressTimeout = setTimeout((function() {
                                    e._keypressTimeout = null
                                }
                                ), t)
                            }
                        }
                    },
                    _captureUrlChange: function(e, t) {
                        var s = N(this._location.href)
                          , a = N(t)
                          , n = N(e);
                        this._lastHref = t,
                        s.protocol === a.protocol && s.host === a.host && (t = a.relative),
                        s.protocol === n.protocol && s.host === n.host && (e = n.relative),
                        this.captureBreadcrumb({
                            category: "navigation",
                            data: {
                                to: t,
                                from: e
                            }
                        })
                    },
                    _patchFunctionToString: function() {
                        var e = this;
                        e._originalFunctionToString = Function.prototype.toString,
                        Function.prototype.toString = function() {
                            return "function" == typeof this && this.__raven__ ? e._originalFunctionToString.apply(this.__orig__, arguments) : e._originalFunctionToString.apply(this, arguments)
                        }
                    },
                    _unpatchFunctionToString: function() {
                        this._originalFunctionToString && (Function.prototype.toString = this._originalFunctionToString)
                    },
                    _instrumentTryCatch: function() {
                        function e(e) {
                            return function(t, a) {
                                for (var n = new Array(arguments.length), i = 0; i < n.length; ++i)
                                    n[i] = arguments[i];
                                var r = n[0];
                                return g(r) && (n[0] = s.wrap(r)),
                                e.apply ? e.apply(this, n) : e(n[0], n[1])
                            }
                        }
                        function t(e) {
                            var t = P[e] && P[e].prototype;
                            t && t.hasOwnProperty && t.hasOwnProperty("addEventListener") && (I(t, "addEventListener", (function(t) {
                                return function(a, i, r, o) {
                                    try {
                                        i && i.handleEvent && (i.handleEvent = s.wrap(i.handleEvent))
                                    } catch (e) {}
                                    var l, c, d;
                                    return n && n.dom && ("EventTarget" === e || "Node" === e) && (c = s._breadcrumbEventHandler("click"),
                                    d = s._keypressEventHandler(),
                                    l = function(e) {
                                        if (e) {
                                            var t;
                                            try {
                                                t = e.type
                                            } catch (e) {
                                                return
                                            }
                                            return "click" === t ? c(e) : "keypress" === t ? d(e) : void 0
                                        }
                                    }
                                    ),
                                    t.call(this, a, s.wrap(i, void 0, l), r, o)
                                }
                            }
                            ), a),
                            I(t, "removeEventListener", (function(e) {
                                return function(t, s, a, n) {
                                    try {
                                        s = s && (s.__raven_wrapper__ ? s.__raven_wrapper__ : s)
                                    } catch (e) {}
                                    return e.call(this, t, s, a, n)
                                }
                            }
                            ), a))
                        }
                        var s = this
                          , a = s._wrappedBuiltIns
                          , n = this._globalOptions.autoBreadcrumbs;
                        I(P, "setTimeout", e, a),
                        I(P, "setInterval", e, a),
                        _requestAnimationFrame && I(P, "requestAnimationFrame", (function(e) {
                            return function(t) {
                                return e(s.wrap(t))
                            }
                        }
                        ), a);
                        for (var i = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"], r = 0; r < i.length; r++)
                            t(i[r])
                    },
                    _instrumentBreadcrumbs: function() {
                        function e(e, s) {
                            e in s && g(s[e]) && I(s, e, (function(e) {
                                return t.wrap(e)
                            }
                            ))
                        }
                        var t = this
                          , s = this._globalOptions.autoBreadcrumbs
                          , a = t._wrappedBuiltIns;
                        if (s.xhr && "XMLHttpRequest"in P) {
                            var n = XMLHttpRequest.prototype;
                            I(n, "open", (function(e) {
                                return function(s, a) {
                                    return f(a) && -1 === a.indexOf(t._globalKey) && (this.__raven_xhr = {
                                        method: s,
                                        url: a,
                                        status_code: null
                                    }),
                                    e.apply(this, arguments)
                                }
                            }
                            ), a),
                            I(n, "send", (function(s) {
                                return function(a) {
                                    function n() {
                                        if (i.__raven_xhr && 4 === i.readyState) {
                                            try {
                                                i.__raven_xhr.status_code = i.status
                                            } catch (e) {}
                                            t.captureBreadcrumb({
                                                type: "http",
                                                category: "xhr",
                                                data: i.__raven_xhr
                                            })
                                        }
                                    }
                                    for (var i = this, r = ["onload", "onerror", "onprogress"], o = 0; o < r.length; o++)
                                        e(r[o], i);
                                    return "onreadystatechange"in i && g(i.onreadystatechange) ? I(i, "onreadystatechange", (function(e) {
                                        return t.wrap(e, void 0, n)
                                    }
                                    )) : i.onreadystatechange = n,
                                    s.apply(this, arguments)
                                }
                            }
                            ), a)
                        }
                        s.xhr && "fetch"in P && I(P, "fetch", (function(e) {
                            return function(s, a) {
                                for (var n = new Array(arguments.length), i = 0; i < n.length; ++i)
                                    n[i] = arguments[i];
                                var r, o = n[0], l = "GET";
                                "string" == typeof o ? r = o : "Request"in P && o instanceof P.Request ? (r = o.url,
                                o.method && (l = o.method)) : r = "" + o,
                                n[1] && n[1].method && (l = n[1].method);
                                var c = {
                                    method: l,
                                    url: r,
                                    status_code: null
                                };
                                return t.captureBreadcrumb({
                                    type: "http",
                                    category: "fetch",
                                    data: c
                                }),
                                e.apply(this, n).then((function(e) {
                                    return c.status_code = e.status,
                                    e
                                }
                                ))
                            }
                        }
                        ), a),
                        s.dom && this._hasDocument && (L.addEventListener ? (L.addEventListener("click", t._breadcrumbEventHandler("click"), !1),
                        L.addEventListener("keypress", t._keypressEventHandler(), !1)) : (L.attachEvent("onclick", t._breadcrumbEventHandler("click")),
                        L.attachEvent("onkeypress", t._keypressEventHandler())));
                        var i = P.chrome
                          , r = !(i && i.app && i.app.runtime) && P.history && history.pushState && history.replaceState;
                        if (s.location && r) {
                            var o = P.onpopstate;
                            P.onpopstate = function() {
                                var e = t._location.href;
                                if (t._captureUrlChange(t._lastHref, e),
                                o)
                                    return o.apply(this, arguments)
                            }
                            ;
                            var l = function(e) {
                                return function() {
                                    var s = arguments.length > 2 ? arguments[2] : void 0;
                                    return s && t._captureUrlChange(t._lastHref, s + ""),
                                    e.apply(this, arguments)
                                }
                            };
                            I(history, "pushState", l, a),
                            I(history, "replaceState", l, a)
                        }
                        if (s.console && "console"in P && console.log) {
                            var c = function(e, s) {
                                t.captureBreadcrumb({
                                    message: e,
                                    level: s.level,
                                    category: "console"
                                })
                            };
                            _(["debug", "info", "warn", "error", "log"], (function(e, t) {
                                D(console, t, c)
                            }
                            ))
                        }
                    },
                    _restoreBuiltIns: function() {
                        for (var e; this._wrappedBuiltIns.length; ) {
                            var t = (e = this._wrappedBuiltIns.shift())[0]
                              , s = e[1]
                              , a = e[2];
                            t[s] = a
                        }
                    },
                    _drainPlugins: function() {
                        var e = this;
                        _(this._plugins, (function(t, s) {
                            var a = s[0]
                              , n = s[1];
                            a.apply(e, [e].concat(n))
                        }
                        ))
                    },
                    _parseDSN: function(e) {
                        var t = O.exec(e)
                          , s = {}
                          , a = 7;
                        try {
                            for (; a--; )
                                s[x[a]] = t[a] || ""
                        } catch (t) {
                            throw new l("Invalid DSN: " + e)
                        }
                        if (s.pass && !this._globalOptions.allowSecretKey)
                            throw new l("Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key");
                        return s
                    },
                    _getGlobalServer: function(e) {
                        var t = "//" + e.host + (e.port ? ":" + e.port : "");
                        return e.protocol && (t = e.protocol + ":" + t),
                        t
                    },
                    _handleOnErrorStackInfo: function() {
                        this._ignoreOnError || this._handleStackInfo.apply(this, arguments)
                    },
                    _handleStackInfo: function(e, t) {
                        var s = this._prepareFrames(e, t);
                        this._triggerEvent("handle", {
                            stackInfo: e,
                            options: t
                        }),
                        this._processException(e.name, e.message, e.url, e.lineno, s, t)
                    },
                    _prepareFrames: function(e, t) {
                        var s = this
                          , a = [];
                        if (e.stack && e.stack.length && (_(e.stack, (function(t, n) {
                            var i = s._normalizeFrame(n, e.url);
                            i && a.push(i)
                        }
                        )),
                        t && t.trimHeadFrames))
                            for (var n = 0; n < t.trimHeadFrames && n < a.length; n++)
                                a[n].in_app = !1;
                        return a = a.slice(0, this._globalOptions.stackTraceLimit)
                    },
                    _normalizeFrame: function(e, t) {
                        var s = {
                            filename: e.url,
                            lineno: e.line,
                            colno: e.column,
                            function: e.func || "?"
                        };
                        return e.url || (s.filename = t),
                        s.in_app = !(this._globalOptions.includePaths.test && !this._globalOptions.includePaths.test(s.filename) || /(Raven|TraceKit)\./.test(s.function) || /raven\.(min\.)?js$/.test(s.filename)),
                        s
                    },
                    _processException: function(e, t, s, a, n, i) {
                        var r, o = (e ? e + ": " : "") + (t || "");
                        if ((!this._globalOptions.ignoreErrors.test || !this._globalOptions.ignoreErrors.test(t) && !this._globalOptions.ignoreErrors.test(o)) && (n && n.length ? (s = n[0].filename || s,
                        n.reverse(),
                        r = {
                            frames: n
                        }) : s && (r = {
                            frames: [{
                                filename: s,
                                lineno: a,
                                in_app: !0
                            }]
                        }),
                        (!this._globalOptions.ignoreUrls.test || !this._globalOptions.ignoreUrls.test(s)) && (!this._globalOptions.whitelistUrls.test || this._globalOptions.whitelistUrls.test(s)))) {
                            var l = v({
                                exception: {
                                    values: [{
                                        type: e,
                                        value: t,
                                        stacktrace: r
                                    }]
                                },
                                culprit: s
                            }, i);
                            this._send(l)
                        }
                    },
                    _trimPacket: function(e) {
                        var t = this._globalOptions.maxMessageLength;
                        if (e.message && (e.message = E(e.message, t)),
                        e.exception) {
                            var s = e.exception.values[0];
                            s.value = E(s.value, t)
                        }
                        var a = e.request;
                        return a && (a.url && (a.url = E(a.url, this._globalOptions.maxUrlLength)),
                        a.Referer && (a.Referer = E(a.Referer, this._globalOptions.maxUrlLength))),
                        e.breadcrumbs && e.breadcrumbs.values && this._trimBreadcrumbs(e.breadcrumbs),
                        e
                    },
                    _trimBreadcrumbs: function(e) {
                        for (var t, s, a, n = ["to", "from", "url"], i = 0; i < e.values.length; ++i)
                            if ((s = e.values[i]).hasOwnProperty("data") && u(s.data) && !y(s.data)) {
                                a = v({}, s.data);
                                for (var r = 0; r < n.length; ++r)
                                    t = n[r],
                                    a.hasOwnProperty(t) && a[t] && (a[t] = E(a[t], this._globalOptions.maxUrlLength));
                                e.values[i].data = a
                            }
                    },
                    _getHttpData: function() {
                        if (this._hasNavigator || this._hasDocument) {
                            var e = {};
                            return this._hasNavigator && $.userAgent && (e.headers = {
                                "User-Agent": navigator.userAgent
                            }),
                            this._hasDocument && (L.location && L.location.href && (e.url = L.location.href),
                            L.referrer && (e.headers || (e.headers = {}),
                            e.headers.Referer = L.referrer)),
                            e
                        }
                    },
                    _resetBackoff: function() {
                        this._backoffDuration = 0,
                        this._backoffStart = null
                    },
                    _shouldBackoff: function() {
                        return this._backoffDuration && a() - this._backoffStart < this._backoffDuration
                    },
                    _isRepeatData: function(e) {
                        var t = this._lastData;
                        return !(!t || e.message !== t.message || e.culprit !== t.culprit) && (e.stacktrace || t.stacktrace ? R(e.stacktrace, t.stacktrace) : !e.exception && !t.exception || C(e.exception, t.exception))
                    },
                    _setBackoffState: function(e) {
                        if (!this._shouldBackoff()) {
                            var t = e.status;
                            if (400 === t || 401 === t || 429 === t) {
                                var s;
                                try {
                                    s = e.getResponseHeader("Retry-After"),
                                    s = 1e3 * parseInt(s, 10)
                                } catch (e) {}
                                this._backoffDuration = s || (2 * this._backoffDuration || 1e3),
                                this._backoffStart = a()
                            }
                        }
                    },
                    _send: function(e) {
                        var t = this._globalOptions
                          , s = {
                            project: this._globalProject,
                            logger: t.logger,
                            platform: "javascript"
                        }
                          , n = this._getHttpData();
                        n && (s.request = n),
                        e.trimHeadFrames && delete e.trimHeadFrames,
                        (e = v(s, e)).tags = v(v({}, this._globalContext.tags), e.tags),
                        e.extra = v(v({}, this._globalContext.extra), e.extra),
                        e.extra["session:duration"] = a() - this._startTime,
                        this._breadcrumbs && this._breadcrumbs.length > 0 && (e.breadcrumbs = {
                            values: [].slice.call(this._breadcrumbs, 0)
                        }),
                        b(e.tags) && delete e.tags,
                        this._globalContext.user && (e.user = this._globalContext.user),
                        t.environment && (e.environment = t.environment),
                        t.release && (e.release = t.release),
                        t.serverName && (e.server_name = t.serverName),
                        g(t.dataCallback) && (e = t.dataCallback(e) || e),
                        e && !b(e) && (g(t.shouldSendCallback) && !t.shouldSendCallback(e) || (this._shouldBackoff() ? this._logDebug("warn", "Raven dropped error due to backoff: ", e) : "number" == typeof t.sampleRate ? Math.random() < t.sampleRate && this._sendProcessedPayload(e) : this._sendProcessedPayload(e)))
                    },
                    _getUuid: function() {
                        return k()
                    },
                    _sendProcessedPayload: function(e, t) {
                        var s = this
                          , a = this._globalOptions;
                        if (this.isSetup())
                            if (e = this._trimPacket(e),
                            this._globalOptions.allowDuplicates || !this._isRepeatData(e)) {
                                this._lastEventId = e.event_id || (e.event_id = this._getUuid()),
                                this._lastData = e,
                                this._logDebug("debug", "Raven about to send:", e);
                                var n = {
                                    sentry_version: "7",
                                    sentry_client: "raven-js/" + this.VERSION,
                                    sentry_key: this._globalKey
                                };
                                this._globalSecret && (n.sentry_secret = this._globalSecret);
                                var i = e.exception && e.exception.values[0];
                                this._globalOptions.autoBreadcrumbs && this._globalOptions.autoBreadcrumbs.sentry && this.captureBreadcrumb({
                                    category: "sentry",
                                    message: i ? (i.type ? i.type + ": " : "") + i.value : e.message,
                                    event_id: e.event_id,
                                    level: e.level || "error"
                                });
                                var r = this._globalEndpoint;
                                (a.transport || this._makeRequest).call(this, {
                                    url: r,
                                    auth: n,
                                    data: e,
                                    options: a,
                                    onSuccess: function() {
                                        s._resetBackoff(),
                                        s._triggerEvent("success", {
                                            data: e,
                                            src: r
                                        }),
                                        t && t()
                                    },
                                    onError: function(a) {
                                        s._logDebug("error", "Raven transport failed to send: ", a),
                                        a.request && s._setBackoffState(a.request),
                                        s._triggerEvent("failure", {
                                            data: e,
                                            src: r
                                        }),
                                        a = a || new Error("Raven send failed (no additional details provided)"),
                                        t && t(a)
                                    }
                                })
                            } else
                                this._logDebug("warn", "Raven dropped repeat event: ", e)
                    },
                    _makeRequest: function(e) {
                        var t = P.XMLHttpRequest && new P.XMLHttpRequest;
                        if (t && ("withCredentials"in t || "undefined" != typeof XDomainRequest)) {
                            var s = e.url;
                            "withCredentials"in t ? t.onreadystatechange = function() {
                                if (4 === t.readyState)
                                    if (200 === t.status)
                                        e.onSuccess && e.onSuccess();
                                    else if (e.onError) {
                                        var s = new Error("Sentry error code: " + t.status);
                                        s.request = t,
                                        e.onError(s)
                                    }
                            }
                            : (t = new XDomainRequest,
                            s = s.replace(/^https?:/, ""),
                            e.onSuccess && (t.onload = e.onSuccess),
                            e.onError && (t.onerror = function() {
                                var s = new Error("Sentry error code: XDomainRequest");
                                s.request = t,
                                e.onError(s)
                            }
                            )),
                            t.open("POST", s + "?" + T(e.auth)),
                            t.send(o(e.data))
                        }
                    },
                    _logDebug: function(e) {
                        this._originalConsoleMethods[e] && this.debug && Function.prototype.apply.call(this._originalConsoleMethods[e], this._originalConsole, [].slice.call(arguments, 1))
                    },
                    _mergeContext: function(e, t) {
                        p(t) ? delete this._globalContext[e] : this._globalContext[e] = v(this._globalContext[e] || {}, t)
                    }
                },
                i.prototype.setUser = i.prototype.setUserContext,
                i.prototype.setReleaseContext = i.prototype.setRelease,
                t.exports = i
            }
            ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            1: 1,
            2: 2,
            5: 5,
            6: 6,
            7: 7
        }],
        4: [function(e, t) {
            (function(s) {
                var a = e(3)
                  , n = "undefined" != typeof window ? window : void 0 !== s ? s : "undefined" != typeof self ? self : {}
                  , i = n.Raven
                  , r = new a;
                r.noConflict = function() {
                    return n.Raven = i,
                    r
                }
                ,
                r.afterLoad(),
                t.exports = r
            }
            ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            3: 3
        }],
        5: [function(e, t) {
            (function(e) {
                function s(e) {
                    return "object" == typeof e && null !== e
                }
                function a(e) {
                    switch ({}.toString.call(e)) {
                    case "[object Error]":
                    case "[object Exception]":
                    case "[object DOMException]":
                        return !0;
                    default:
                        return e instanceof Error
                    }
                }
                function n(e) {
                    return d() && "[object ErrorEvent]" === {}.toString.call(e)
                }
                function i(e) {
                    return void 0 === e
                }
                function r(e) {
                    return "function" == typeof e
                }
                function o(e) {
                    return "[object String]" === Object.prototype.toString.call(e)
                }
                function l(e) {
                    return "[object Array]" === Object.prototype.toString.call(e)
                }
                function c(e) {
                    for (var t in e)
                        if (e.hasOwnProperty(t))
                            return !1;
                    return !0
                }
                function d() {
                    try {
                        return new ErrorEvent(""),
                        !0
                    } catch (e) {
                        return !1
                    }
                }
                function u(e) {
                    function t(t, s) {
                        var a = e(t) || t;
                        return s && s(a) || a
                    }
                    return t
                }
                function h(e, t) {
                    var s, a;
                    if (i(e.length))
                        for (s in e)
                            m(e, s) && t.call(null, s, e[s]);
                    else if (a = e.length)
                        for (s = 0; s < a; s++)
                            t.call(null, s, e[s])
                }
                function p(e, t) {
                    return t ? (h(t, (function(t, s) {
                        e[t] = s
                    }
                    )),
                    e) : e
                }
                function g(e) {
                    return !!Object.isFrozen && Object.isFrozen(e)
                }
                function f(e, t) {
                    return !t || e.length <= t ? e : e.substr(0, t) + "\u2026"
                }
                function m(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                }
                function b(e) {
                    for (var t, s = [], a = 0, n = e.length; a < n; a++)
                        o(t = e[a]) ? s.push(t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")) : t && t.source && s.push(t.source);
                    return new RegExp(s.join("|"),"i")
                }
                function _(e) {
                    var t = [];
                    return h(e, (function(e, s) {
                        t.push(encodeURIComponent(e) + "=" + encodeURIComponent(s))
                    }
                    )),
                    t.join("&")
                }
                function v(e) {
                    var t = e.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
                    if (!t)
                        return {};
                    var s = t[6] || ""
                      , a = t[8] || "";
                    return {
                        protocol: t[2],
                        host: t[4],
                        path: t[5],
                        relative: t[5] + s + a
                    }
                }
                function E() {
                    var e = C.crypto || C.msCrypto;
                    if (!i(e) && e.getRandomValues) {
                        var t = new Uint16Array(8);
                        e.getRandomValues(t),
                        t[3] = 4095 & t[3] | 16384,
                        t[4] = 16383 & t[4] | 32768;
                        var s = function(e) {
                            for (var t = e.toString(16); t.length < 4; )
                                t = "0" + t;
                            return t
                        };
                        return s(t[0]) + s(t[1]) + s(t[2]) + s(t[3]) + s(t[4]) + s(t[5]) + s(t[6]) + s(t[7])
                    }
                    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
                        var t = 16 * Math.random() | 0;
                        return ("x" === e ? t : 3 & t | 8).toString(16)
                    }
                    ))
                }
                function y(e) {
                    for (var t, s = 5, a = 80, n = [], i = 0, r = 0, o = " > ", l = o.length; e && i++ < s && !("html" === (t = w(e)) || i > 1 && r + n.length * l + t.length >= a); )
                        n.push(t),
                        r += t.length,
                        e = e.parentNode;
                    return n.reverse().join(o)
                }
                function w(e) {
                    var t, s, a, n, i, r = [];
                    if (!e || !e.tagName)
                        return "";
                    if (r.push(e.tagName.toLowerCase()),
                    e.id && r.push("#" + e.id),
                    (t = e.className) && o(t))
                        for (s = t.split(/\s+/),
                        i = 0; i < s.length; i++)
                            r.push("." + s[i]);
                    var l = ["type", "name", "title", "alt"];
                    for (i = 0; i < l.length; i++)
                        a = l[i],
                        (n = e.getAttribute(a)) && r.push("[" + a + '="' + n + '"]');
                    return r.join("")
                }
                function S(e, t) {
                    return !!(!!e ^ !!t)
                }
                function T(e, t) {
                    return !S(e, t) && (e = e.values[0],
                    t = t.values[0],
                    e.type === t.type && e.value === t.value && k(e.stacktrace, t.stacktrace))
                }
                function k(e, t) {
                    if (S(e, t))
                        return !1;
                    var s, a, n = e.frames, i = t.frames;
                    if (n.length !== i.length)
                        return !1;
                    for (var r = 0; r < n.length; r++)
                        if (s = n[r],
                        a = i[r],
                        s.filename !== a.filename || s.lineno !== a.lineno || s.colno !== a.colno || s.function !== a.function)
                            return !1;
                    return !0
                }
                function A(e, t, s, a) {
                    var n = e[t];
                    e[t] = s(n),
                    e[t].__raven__ = !0,
                    e[t].__orig__ = n,
                    a && a.push([e, t, n])
                }
                var C = "undefined" != typeof window ? window : void 0 !== e ? e : "undefined" != typeof self ? self : {};
                t.exports = {
                    isObject: s,
                    isError: a,
                    isErrorEvent: n,
                    isUndefined: i,
                    isFunction: r,
                    isString: o,
                    isArray: l,
                    isEmptyObject: c,
                    supportsErrorEvent: d,
                    wrappedCallback: u,
                    each: h,
                    objectMerge: p,
                    truncate: f,
                    objectFrozen: g,
                    hasKey: m,
                    joinRegExp: b,
                    urlencode: _,
                    uuid4: E,
                    htmlTreeAsString: y,
                    htmlElementAsString: w,
                    isSameException: T,
                    isSameStacktrace: k,
                    parseUrl: v,
                    fill: A
                }
            }
            ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {}],
        6: [function(e, t) {
            (function(s) {
                function a() {
                    return "undefined" == typeof document || null == document.location ? "" : document.location.href
                }
                var n = e(5)
                  , i = {
                    collectWindowErrors: !0,
                    debug: !1
                }
                  , r = "undefined" != typeof window ? window : void 0 !== s ? s : "undefined" != typeof self ? self : {}
                  , o = [].slice
                  , l = "?"
                  , c = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                i.report = function() {
                    function e(e) {
                        h(),
                        _.push(e)
                    }
                    function t(e) {
                        for (var t = _.length - 1; t >= 0; --t)
                            _[t] === e && _.splice(t, 1)
                    }
                    function s() {
                        p(),
                        _ = []
                    }
                    function d(e, t) {
                        var s = null;
                        if (!t || i.collectWindowErrors) {
                            for (var a in _)
                                if (_.hasOwnProperty(a))
                                    try {
                                        _[a].apply(null, [e].concat(o.call(arguments, 2)))
                                    } catch (e) {
                                        s = e
                                    }
                            if (s)
                                throw s
                        }
                    }
                    function u(e, t, s, r, o) {
                        if (y)
                            i.computeStackTrace.augmentStackTraceWithInitialElement(y, t, s, e),
                            g();
                        else if (o && n.isError(o))
                            d(i.computeStackTrace(o), !0);
                        else {
                            var u, h = {
                                url: t,
                                line: s,
                                column: r
                            }, p = void 0, f = e;
                            if ("[object String]" === {}.toString.call(e))
                                (u = e.match(c)) && (p = u[1],
                                f = u[2]);
                            h.func = l,
                            d({
                                name: p,
                                message: f,
                                url: a(),
                                stack: [h]
                            }, !0)
                        }
                        return !!m && m.apply(this, arguments)
                    }
                    function h() {
                        b || (m = r.onerror,
                        r.onerror = u,
                        b = !0)
                    }
                    function p() {
                        b && (r.onerror = m,
                        b = !1,
                        m = void 0)
                    }
                    function g() {
                        var e = y
                          , t = v;
                        v = null,
                        y = null,
                        E = null,
                        d.apply(null, [e, !1].concat(t))
                    }
                    function f(e, t) {
                        var s = o.call(arguments, 1);
                        if (y) {
                            if (E === e)
                                return;
                            g()
                        }
                        var a = i.computeStackTrace(e);
                        if (y = a,
                        E = e,
                        v = s,
                        setTimeout((function() {
                            E === e && g()
                        }
                        ), a.incomplete ? 2e3 : 0),
                        !1 !== t)
                            throw e
                    }
                    var m, b, _ = [], v = null, E = null, y = null;
                    return f.subscribe = e,
                    f.unsubscribe = t,
                    f.uninstall = s,
                    f
                }(),
                i.computeStackTrace = function() {
                    function e(e) {
                        if (void 0 !== e.stack && e.stack) {
                            for (var t, s, n, i = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, r = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i, o = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, d = /\((\S*)(?::(\d+))(?::(\d+))\)/, u = e.stack.split("\n"), h = [], p = (/^(.*) is undefined$/.exec(e.message),
                            0), g = u.length; p < g; ++p) {
                                if (s = i.exec(u[p])) {
                                    var f = s[2] && 0 === s[2].indexOf("native");
                                    s[2] && 0 === s[2].indexOf("eval") && (t = d.exec(s[2])) && (s[2] = t[1],
                                    s[3] = t[2],
                                    s[4] = t[3]),
                                    n = {
                                        url: f ? null : s[2],
                                        func: s[1] || l,
                                        args: f ? [s[2]] : [],
                                        line: s[3] ? +s[3] : null,
                                        column: s[4] ? +s[4] : null
                                    }
                                } else if (s = o.exec(u[p]))
                                    n = {
                                        url: s[2],
                                        func: s[1] || l,
                                        args: [],
                                        line: +s[3],
                                        column: s[4] ? +s[4] : null
                                    };
                                else {
                                    if (!(s = r.exec(u[p])))
                                        continue;
                                    s[3] && s[3].indexOf(" > eval") > -1 && (t = c.exec(s[3])) ? (s[3] = t[1],
                                    s[4] = t[2],
                                    s[5] = null) : 0 !== p || s[5] || void 0 === e.columnNumber || (h[0].column = e.columnNumber + 1),
                                    n = {
                                        url: s[3],
                                        func: s[1] || l,
                                        args: s[2] ? s[2].split(",") : [],
                                        line: s[4] ? +s[4] : null,
                                        column: s[5] ? +s[5] : null
                                    }
                                }
                                !n.func && n.line && (n.func = l),
                                h.push(n)
                            }
                            return h.length ? {
                                name: e.name,
                                message: e.message,
                                url: a(),
                                stack: h
                            } : null
                        }
                    }
                    function t(e, t, s) {
                        var a = {
                            url: t,
                            line: s
                        };
                        if (a.url && a.line) {
                            if (e.incomplete = !1,
                            a.func || (a.func = l),
                            e.stack.length > 0 && e.stack[0].url === a.url) {
                                if (e.stack[0].line === a.line)
                                    return !1;
                                if (!e.stack[0].line && e.stack[0].func === a.func)
                                    return e.stack[0].line = a.line,
                                    !1
                            }
                            return e.stack.unshift(a),
                            e.partial = !0,
                            !0
                        }
                        return e.incomplete = !0,
                        !1
                    }
                    function s(e, r) {
                        for (var o, c, d = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, u = [], h = {}, p = !1, g = s.caller; g && !p; g = g.caller)
                            if (g !== n && g !== i.report) {
                                if (c = {
                                    url: null,
                                    func: l,
                                    line: null,
                                    column: null
                                },
                                g.name ? c.func = g.name : (o = d.exec(g.toString())) && (c.func = o[1]),
                                void 0 === c.func)
                                    try {
                                        c.func = o.input.substring(0, o.input.indexOf("{"))
                                    } catch (e) {}
                                h["" + g] ? p = !0 : h["" + g] = !0,
                                u.push(c)
                            }
                        r && u.splice(0, r);
                        var f = {
                            name: e.name,
                            message: e.message,
                            url: a(),
                            stack: u
                        };
                        return t(f, e.sourceURL || e.fileName, e.line || e.lineNumber, e.message || e.description),
                        f
                    }
                    function n(t, n) {
                        var r = null;
                        n = null == n ? 0 : +n;
                        try {
                            if (r = e(t))
                                return r
                        } catch (e) {
                            if (i.debug)
                                throw e
                        }
                        try {
                            if (r = s(t, n + 1))
                                return r
                        } catch (e) {
                            if (i.debug)
                                throw e
                        }
                        return {
                            name: t.name,
                            message: t.message,
                            url: a()
                        }
                    }
                    return n.augmentStackTraceWithInitialElement = t,
                    n.computeStackTraceFromStackProp = e,
                    n
                }(),
                t.exports = i
            }
            ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            5: 5
        }],
        7: [function(e, t) {
            function s(e, t) {
                for (var s = 0; s < e.length; ++s)
                    if (e[s] === t)
                        return s;
                return -1
            }
            function a(e, t, s, a) {
                return JSON.stringify(e, i(t, a), s)
            }
            function n(e) {
                var t = {
                    stack: e.stack,
                    message: e.message,
                    name: e.name
                };
                for (var s in e)
                    Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
                return t
            }
            function i(e, t) {
                var a = []
                  , i = [];
                return null == t && (t = function(e, t) {
                    return a[0] === t ? "[Circular ~]" : "[Circular ~." + i.slice(0, s(a, t)).join(".") + "]"
                }
                ),
                function(r, o) {
                    if (a.length > 0) {
                        var l = s(a, this);
                        ~l ? a.splice(l + 1) : a.push(this),
                        ~l ? i.splice(l, 1 / 0, r) : i.push(r),
                        ~s(a, o) && (o = t.call(this, r, o))
                    } else
                        a.push(o);
                    return null == e ? o instanceof Error ? n(o) : o : e.call(this, r, o)
                }
            }
            (t.exports = a).getSerialize = i
        }
        , {}]
    }, {}, [4])(4)
}
));
const MIME_TYPES = {
    json: "application/json",
    html: "text/html"
};
ajax.defaults = {
    async: !0,
    dataType: "json",
    timeout: 30,
    type: "GET"
};
class CookiesStore {
    static INT = /^\d+$/;
    static onBlocked() {}
    get(e) {
        let t = Cookies.get(e);
        return null != t && CookiesStore.INT.test(t) && (t = parseInt(t, 10)),
        t
    }
    set(e, t) {
        !1 !== t ? (!0 === t && (t = 1),
        t && ("function" == typeof CookiesStore.INT.test ? CookiesStore.INT.test(t) : void 0) && (t = parseInt(t, 10)),
        Cookies.set(e, "" + t, {
            path: "/",
            expires: 1e8
        }),
        this.get(e) !== t && CookiesStore.onBlocked(e, t, this.get(e))) : this.del(e)
    }
    del(e) {
        Cookies.expire(e)
    }
    reset() {
        try {
            for (var e of document.cookie.split(/;\s?/))
                Cookies.expire(e.split("=")[0]);
            return
        } catch (e) {}
    }
    dump() {
        const e = {};
        for (var t of document.cookie.split(/;\s?/))
            "_" !== t[0] && (e[(t = t.split("="))[0]] = t[1]);
        return e
    }
}
class Events {
    on(e, t) {
        if (e.includes(" "))
            for (var s of e.split(" "))
                this.on(s, t);
        else
            this._callbacks ||= {},
            this._callbacks[e] ||= [],
            this._callbacks[e].push(t);
        return this
    }
    off(e, t) {
        let s, a;
        if (e.includes(" "))
            for (var n of e.split(" "))
                this.off(n, t);
        else
            (s = this._callbacks?.[e]) && (a = s.indexOf(t)) >= 0 && (s.splice(a, 1),
            s.length || delete this._callbacks[e]);
        return this
    }
    trigger(e, ...t) {
        this.eventInProgress = {
            name: e,
            args: t
        };
        const s = this._callbacks?.[e];
        if (s)
            for (const e of s.slice(0))
                "function" == typeof e && e(...t);
        return this.eventInProgress = null,
        "all" !== e && this.trigger("all", e, ...t),
        this
    }
    removeEvent(e) {
        if (null != this._callbacks)
            for (var t of e.split(" "))
                delete this._callbacks[t];
        return this
    }
}
let defaultUrl = null
  , currentSlug = null;
const imageCache = {}
  , urlCache = {}
  , withImage = function(e, t) {
    if (imageCache[e])
        return t(imageCache[e]);
    {
        const s = new Image;
        return s.crossOrigin = "anonymous",
        s.src = e,
        s.onload = () => (imageCache[e] = s,
        t(s))
    }
};
this.setFaviconForDoc = function(e) {
    if (currentSlug === e.slug || app.settings.get("noDocSpecificIcon"))
        return;
    const t = $('link[rel="icon"]');
    if (null === defaultUrl && (defaultUrl = t.href),
    urlCache[e.slug])
        return t.href = urlCache[e.slug],
        void (currentSlug = e.slug);
    const s = $(`._icon-${e.slug.split("~")[0]}`);
    if (null === s)
        return;
    const a = window.getComputedStyle(s, ":before")
      , n = a["background-position-x"]
      , i = a["background-position-y"];
    if (void 0 === n || void 0 === i)
        return;
    const r = app.config.favicon_spritesheet
      , o = 16
      , l = Math.abs(parseInt(n.slice(0, -2)))
      , c = Math.abs(parseInt(i.slice(0, -2)));
    return withImage(r, (s => withImage(defaultUrl, (function(a) {
        const n = a.width
          , i = document.createElement("canvas")
          , r = i.getContext("2d");
        i.width = n,
        i.height = n,
        r.drawImage(a, 0, 0);
        const d = 65
          , u = n / 100 * (100 - d)
          , h = n / 100 * d;
        r.drawImage(s, l, c, o, o, u, u, h, h);
        try {
            return urlCache[e.slug] = i.toDataURL(),
            t.href = urlCache[e.slug],
            currentSlug = e.slug
        } catch (e) {
            return Raven.captureException(e, {
                level: "info"
            }),
            this.resetFavicon()
        }
    }
    ))))
}
,
this.resetFavicon = function() {
    if (null !== defaultUrl && null !== currentSlug)
        return $('link[rel="icon"]').href = defaultUrl,
        currentSlug = null
}
,
this.LocalStorageStore = class {
    get(e) {
        try {
            return JSON.parse(localStorage.getItem(e))
        } catch (e) {}
    }
    set(e, t) {
        try {
            return localStorage.setItem(e, JSON.stringify(t)),
            !0
        } catch (e) {}
    }
    del(e) {
        try {
            return localStorage.removeItem(e),
            !0
        } catch (e) {}
    }
    reset() {
        try {
            return localStorage.clear(),
            !0
        } catch (e) {}
    }
}
;
/*
 * Based on github.com/visionmedia/page.js
 * Licensed under the MIT license
 * Copyright 2012 TJ Holowaychuk <tj@vision-media.ca>
 */
let running = !1
  , currentState = null;
const callbacks = [];
this.page = function(e, t) {
    if ("function" == typeof e)
        page("*", e);
    else if ("function" == typeof t) {
        const s = new Route(e);
        callbacks.push(s.middleware(t))
    } else
        "string" == typeof e ? page.show(e, t) : page.start(e)
}
,
page.start = function(e) {
    null == e && (e = {}),
    running || (running = !0,
    addEventListener("popstate", onpopstate),
    addEventListener("click", onclick),
    page.replace(currentPath(), null, null, !0))
}
,
page.stop = function() {
    running && (running = !1,
    removeEventListener("click", onclick),
    removeEventListener("popstate", onpopstate))
}
,
page.show = function(e, t) {
    let s;
    if (e === currentState?.path)
        return;
    const a = new Context(e,t)
      , n = currentState;
    return currentState = a.state,
    (s = page.dispatch(a)) ? (currentState = n,
    location.assign(s)) : (a.pushState(),
    updateCanonicalLink(),
    track()),
    a
}
,
page.replace = function(e, t, s, a) {
    let n, i = new Context(e,t || currentState);
    return i.init = a,
    currentState = i.state,
    s || (n = page.dispatch(i)),
    n && (i = new Context(n),
    i.init = a,
    currentState = i.state,
    page.dispatch(i)),
    i.replaceState(),
    updateCanonicalLink(),
    s || track(),
    i
}
,
page.dispatch = function(e) {
    let t = 0;
    var s = function() {
        let a, n;
        return (a = callbacks[t++]) && (n = a(e, s)),
        n
    };
    return s()
}
,
page.canGoBack = () => !Context.isIntialState(currentState),
page.canGoForward = () => !Context.isLastState(currentState);
const currentPath = () => location.pathname + location.search + location.hash;
class Context {
    static isIntialState(e) {
        return 0 === e.id
    }
    static isLastState(e) {
        return e.id === this.stateId - 1
    }
    static isInitialPopState(e) {
        return e.path === this.initialPath && 1 === this.stateId
    }
    static isSameSession(e) {
        return e.sessionId === this.sessionId
    }
    constructor(e, t) {
        this.initialPath = currentPath(),
        this.sessionId = Date.now(),
        this.stateId = 0,
        null == e && (e = "/"),
        this.path = e,
        null == t && (t = {}),
        this.state = t,
        this.pathname = this.path.replace(/(?:\?([^#]*))?(?:#(.*))?$/, ( (e, t, s) => (this.query = t,
        this.hash = s,
        ""))),
        null == this.state.id && (this.state.id = this.constructor.stateId++),
        null == this.state.sessionId && (this.state.sessionId = this.constructor.sessionId),
        this.state.path = this.path
    }
    pushState() {
        history.pushState(this.state, "", this.path)
    }
    replaceState() {
        try {
            history.replaceState(this.state, "", this.path)
        } catch (e) {}
    }
}
class Route {
    constructor(e, t) {
        this.path = e,
        null == t && (t = {}),
        this.keys = [],
        this.regexp = pathToRegexp(this.path, this.keys)
    }
    middleware(e) {
        return (t, s) => {
            let a;
            return this.match(t.pathname, a = []) ? (t.params = a,
            e(t, s)) : s()
        }
    }
    match(e, t) {
        let s;
        if (!(s = this.regexp.exec(e)))
            return;
        const a = s.slice(1);
        for (let e = 0; e < a.length; e++) {
            var n, i = a[e];
            "string" == typeof i && (i = decodeURIComponent(i)),
            (n = this.keys[e]) ? t[n.name] = i : t.push(i)
        }
        return !0
    }
}
var pathToRegexp = function(e, t) {
    return e instanceof RegExp ? e : (e instanceof Array && (e = `(${e.join("|")})`),
    e = e.replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, ( (e, s, a, n, i, r) => {
        null == s && (s = ""),
        null == a && (a = ""),
        t.push({
            name: n,
            optional: !!r
        });
        let o = r ? "" : s;
        return o += "(?:",
        r && (o += s),
        o += a,
        o += i || (a ? "([^/.]+?)" : "([^/]+?)"),
        o += ")",
        r && (o += r),
        o
    }
    )).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"),
    new RegExp(`^${e}$`))
}
  , onpopstate = function(e) {
    e.state && !Context.isInitialPopState(e.state) && (Context.isSameSession(e.state) ? page.replace(e.state.path, e.state) : location.reload())
}
  , onclick = function(e) {
    try {
        if (1 !== e.which || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented)
            return
    } catch (e) {
        return
    }
    let t = $.eventTarget(e);
    for (; t && "A" !== t.tagName; )
        t = t.parentNode;
    if (t && t.hasAttribute("data-no-ajax")) return;
    if (t && !t.target && isSameOrigin(t.href)) {
        e.preventDefault();
        let s = t.href
        s = s.replace(/^\/\/+/, "/"),
        page.show(s)
    }
}
  , isSameOrigin = e => e.startsWith(`http://127.0.0.1:5000/`)
  ,updateCanonicalLink = function() {
    this.canonicalLink = this.canonicalLink || document.head.querySelector('link[rel="canonical"]');

    let path = location.pathname;

    // Xóa phần tử xuất hiện ngay sau "/tutorial/"
    let newPath = path.replace(/^\/tutorial\/[^\/]+/, ""); 

    // Kiểm tra thẻ <a> hiện tại và cập nhật href
    let linkElement = document.querySelector('a'); // Thay bằng cách chọn đúng thẻ <a> nếu cần
    if (linkElement) {
        linkElement.href = `http://127.0.0.1:5000/tutorial${newPath}`;
    }

    console.log("Final Path:", newPath); // Debug giá trị cuối cùng

    this.canonicalLink.setAttribute("href", `http://127.0.0.1:5000/tutorial${newPath}`);
};

const trackers = [];
page.track = function(e) {
    trackers.push(e)
}
;
var track = function() {
    if ("production" !== app.config.env)
        return;
    if ("1" === navigator.doNotTrack)
        return;
    if (navigator.globalPrivacyControl)
        return;
    const e = Cookies.get("analyticsConsent")
      , t = Cookies.get("analyticsConsentAsked");
    if ("1" === e)
        for (var s of trackers)
            s.call();
    else
        void 0 === e && void 0 === t && (Cookies.set("analyticsConsentAsked", "1"),
        new app.views.Notif("AnalyticsConsent",{
            autoHide: null
        }))
};
let smoothDistance, smoothDuration, smoothEnd, smoothStart;
this.resetAnalytics = function() {
    for (var e of document.cookie.split(/;\s?/)) {
        var t = e.split("=")[0];
        "_" === t[0] && "_" !== t[1] && Cookies.expire(t)
    }
}
,
this.$ = function(e, t) {
    null == t && (t = document);
    try {
        return t.querySelector(e)
    } catch (e) {}
}
,
this.$$ = function(e, t) {
    null == t && (t = document);
    try {
        return t.querySelectorAll(e)
    } catch (e) {}
}
,
$.id = e => document.getElementById(e),
$.hasChild = function(e, t) {
    if (e)
        for (; t; ) {
            if (t === e)
                return !0;
            if (t === document.body)
                return;
            t = t.parentNode
        }
}
,
$.closestLink = function(e, t) {
    for (null == t && (t = document.body); e; ) {
        if ("A" === e.tagName)
            return e;
        if (e === t)
            return;
        e = e.parentNode
    }
}
,
$.on = function(e, t, s, a) {
    // Kiểm tra tham số đầu vào
    if (!e || !e.addEventListener) {
        return;
    }
    
    if (typeof t !== 'string' || t.trim() === '') {
        console.error('Invalid event name', t);
        return;
    }
    
    if (typeof s !== 'function') {
        console.error('Invalid event handler', s);
        return;
    }

    // Xử lý tham số useCapture/options
    var options = {};
    if (typeof a === 'object') {
        options = a;
    } else {
        options.capture = !!a;
    }

    try {
        // Xử lý nhiều sự kiện
        if (t.includes(" ")) {
            t.split(" ").forEach(function(eventName) {
                if (eventName.trim()) {
                    e.addEventListener(eventName.trim(), s, options);
                }
            });
        } else {
            e.addEventListener(t, s, options);
        }
    } catch (error) {
        console.error('Failed to add event listener:', {
            element: e,
            event: t,
            handler: s,
            options: options,
            error: error
        });
    }
    
    // Trả về function để remove event
    return function() {
        if (t.includes(" ")) {
            t.split(" ").forEach(function(eventName) {
                e.removeEventListener(eventName.trim(), s, options);
            });
        } else {
            e.removeEventListener(t, s, options);
        }
    };
}
,
$.off = function(e, t, s, a) {
    if (null == a && (a = !1),
    t.includes(" "))
        for (var n of t.split(" "))
            $.off(e, n, s);
    else
        e.removeEventListener(t, s, a)
}
,
$.trigger = function(e, t, s, a) {
    const n = new Event(t,{
        bubbles: s ?? !0,
        cancelable: a ?? !0
    });
    e.dispatchEvent(n)
}
,
$.click = function(e) {
    const t = new MouseEvent("click",{
        bubbles: !0,
        cancelable: !0
    });
    e.dispatchEvent(t)
}
,
$.stopEvent = function(e) {
    e.preventDefault(),
    e.stopPropagation(),
    e.stopImmediatePropagation()
}
,
$.eventTarget = e => e.target.correspondingUseElement || e.target;
const buildFragment = function(e) {
    const t = document.createDocumentFragment();
    if ($.isCollection(e))
        for (var s of $.makeArray(e))
            t.appendChild(s);
    else
        t.innerHTML = e;
    return t
};
$.append = function(e, t) {
    if (!e || !e.nodeType) { // Kiểm tra e là DOM element hợp lệ
        return;
    }
    
    if ("string" == typeof t) {
        e.insertAdjacentHTML("beforeend", t);
    } else {
        $.isCollection(t) && (t = buildFragment(t));
        e.appendChild(t);
    }
}
,
$.prepend = function(e, t) {
    e.firstChild ? "string" == typeof t ? e.insertAdjacentHTML("afterbegin", t) : ($.isCollection(t) && (t = buildFragment(t)),
    e.insertBefore(t, e.firstChild)) : $.append(t)
}
,
$.before = function(e, t) {
    ("string" == typeof t || $.isCollection(t)) && (t = buildFragment(t)),
    e.parentNode.insertBefore(t, e)
}
,
$.after = function(e, t) {
    ("string" == typeof t || $.isCollection(t)) && (t = buildFragment(t)),
    e.nextSibling ? e.parentNode.insertBefore(t, e.nextSibling) : e.parentNode.appendChild(t)
}
,
$.remove = function(e) {
    if ($.isCollection(e))
        for (var t of $.makeArray(e))
            null != t.parentNode && t.parentNode.removeChild(t);
    else
        null != e.parentNode && e.parentNode.removeChild(e)
}
,
$.empty = function(e) {
    if (!e || !e.firstChild) return;  // Kiểm tra e tồn tại và có firstChild
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }
}
,
$.batchUpdate = function(e, t) {
    const s = e.parentNode
      , a = e.nextSibling;
    s.removeChild(e),
    t(e),
    a ? s.insertBefore(e, a) : s.appendChild(e)
}
,
$.rect = e => e.getBoundingClientRect(),
$.offset = function(e, t) {
    null == t && (t = document.body);
    let s = 0
      , a = 0;
    for (; e && e !== t; )
        s += e.offsetTop,
        a += e.offsetLeft,
        e = e.offsetParent;
    return {
        top: s,
        left: a
    }
}
,
$.scrollParent = function(e) {
    for (; (e = e.parentNode) && 1 === e.nodeType && !(e.scrollTop > 0) && !["auto", "scroll"].includes(getComputedStyle(e)?.overflowY ?? ""); )
        ;
    return e
}
,
$.scrollTo = function(e, t, s, a) {
    if (null == s && (s = "center"),
    null == a && (a = {}),
    !e)
        return;
    if (null == t && (t = $.scrollParent(e)),
    !t)
        return;
    const n = t.clientHeight
      , i = t.scrollHeight;
    if (!(i > n))
        return;
    const {top: r} = $.offset(e, t)
      , {offsetTop: o} = t.firstElementChild;
    switch (s) {
    case "top":
        t.scrollTop = r - o - (a.margin || 0);
        break;
    case "center":
        t.scrollTop = r - Math.round(n / 2 - e.offsetHeight / 2);
        break;
    case "continuous":
        var {scrollTop: l} = t
          , c = e.offsetHeight
          , d = t.lastElementChild.offsetTop + t.lastElementChild.offsetHeight
          , u = d > 0 ? i - d : 0;
        r - o <= l + c * (a.topGap || 1) ? t.scrollTop = r - o - c * (a.topGap || 1) : r + u >= l + n - c * ((a.bottomGap || 1) + 1) && (t.scrollTop = r + u - n + c * ((a.bottomGap || 1) + 1))
    }
}
,
$.scrollToWithImageLock = function(e, t, ...s) {
    if (null == t && (t = $.scrollParent(e)),
    t)
        for (var a of ($.scrollTo(e, t, ...s),
        t.getElementsByTagName("img")))
            a.complete || function() {
                let n;
                const i = function(a) {
                    return clearTimeout(n),
                    r(a.target),
                    $.scrollTo(e, t, ...s)
                };
                var r = e => $.off(e, "load", i);
                $.on(a, "load", i),
                n = setTimeout(r.bind(null, a), 3e3)
            }()
}
,
$.lockScroll = function(e, t) {
    let s;
    if (s = $.scrollParent(e)) {
        let {top: a} = $.rect(e);
        [document.body, document.documentElement].includes(s) || (a -= $.rect(s).top),
        t(),
        s.scrollTop = $.offset(e, s).top - a
    } else
        t()
}
;
let smoothScroll = smoothStart = smoothEnd = smoothDistance = smoothDuration = null;
$.smoothScroll = function(e, t) {
    if (smoothEnd = t,
    smoothScroll) {
        const e = smoothEnd - smoothStart;
        return smoothDuration += Math.min(300, Math.abs(smoothDistance - e)),
        void (smoothDistance = e)
    }
    smoothStart = e.scrollTop,
    smoothDistance = smoothEnd - smoothStart,
    smoothDuration = Math.min(300, Math.abs(smoothDistance));
    const s = Date.now();
    return smoothScroll = function() {
        const t = Math.min(1, (Date.now() - s) / smoothDuration)
          , a = Math.max(0, Math.floor(smoothStart + smoothDistance * (t < .5 ? 2 * t * t : t * (4 - 2 * t) - 1)));
        return e.scrollTop = a,
        1 === t ? smoothScroll = null : requestAnimationFrame(smoothScroll)
    }
    ,
    requestAnimationFrame(smoothScroll)
}
,
$.makeArray = function(e) {
    return Array.isArray(e) ? e : Array.prototype.slice.apply(e)
}
,
$.arrayDelete = function(e, t) {
    const s = e.indexOf(t);
    return s >= 0 && (e.splice(s, 1),
    !0)
}
,
$.isCollection = e => Array.isArray(e) || "function" == typeof e?.item;
const ESCAPE_HTML_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;"
}
  , ESCAPE_HTML_REGEXP = /[&<>"'\/]/g;
$.escape = e => e.replace(ESCAPE_HTML_REGEXP, (e => ESCAPE_HTML_MAP[e]));
const ESCAPE_REGEXP = /([.*+?^=!:${}()|\[\]\/\\])/g;
$.escapeRegexp = e => e.replace(ESCAPE_REGEXP, "\\$1"),
$.urlDecode = e => decodeURIComponent(e.replace(/\+/g, "%20")),
$.classify = function(e) {
    e = e.split("_");
    for (let s = 0; s < e.length; s++) {
        var t = e[s];
        e[s] = t[0].toUpperCase() + t.slice(1)
    }
    return e.join("")
}
,
$.noop = function() {}
,
$.popup = function(e) {
    try {
        window.open(e.href || e, "_blank", "noopener")
    } catch (t) {
        const s = window.open();
        s.opener && (s.opener = null),
        s.location = e.href || e
    }
}
;
let isMac = null;
$.isMac = () => null != isMac ? isMac : isMac = navigator.userAgent.includes("Mac");
let isIE = null;
$.isIE = () => null != isIE ? isIE : isIE = navigator.userAgent.includes("MSIE") || navigator.userAgent.includes("rv:11.0");
let isChromeForAndroid = null;
$.isChromeForAndroid = () => null != isChromeForAndroid ? isChromeForAndroid : isChromeForAndroid = navigator.userAgent.includes("Android") && /Chrome\/([.0-9])+ Mobile/.test(navigator.userAgent);
let isAndroid = null;
$.isAndroid = () => null != isAndroid ? isAndroid : isAndroid = navigator.userAgent.includes("Android");
let isIOS = null;
$.isIOS = () => null != isIOS ? isIOS : isIOS = navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad"),
$.overlayScrollbarsEnabled = function() {
    if (!$.isMac())
        return !1;
    const e = document.createElement("div");
    e.setAttribute("style", "width: 100px; height: 100px; overflow: scroll; position: absolute"),
    document.body.appendChild(e);
    const t = e.offsetWidth === e.clientWidth;
    return document.body.removeChild(e),
    t
}
;
const HIGHLIGHT_DEFAULTS = {
    className: "highlight",
    delay: 1e3
};
$.highlight = function(e, t) {
    t = {
        ...HIGHLIGHT_DEFAULTS,
        ...t || {}
    },
    e.classList.add(t.className),
    setTimeout(( () => e.classList.remove(t.className)), t.delay)
}
;
class App extends Events {
    _$ = $;
    _$$ = $$;
    _page = page;
    collections = {};
    models = {};
    templates = {};
    views = {};
    init() {
        try {
            this.initErrorTracking()
        } catch (e) {}
        this.browserCheck() && (this.el = $("._app"),
        this.localStorage = new LocalStorageStore,
        app.ServiceWorker.isEnabled() && (this.serviceWorker = new app.ServiceWorker),
        this.settings = new app.Settings,
        this.db = new app.DB,
        this.settings.initLayout(),
        this.docs = new app.collections.Docs,
        this.disabledDocs = new app.collections.Docs,
        this.entries = new app.collections.Entries,
        this.router = new app.Router,
        this.shortcuts = new app.Shortcuts,
        this.document = new app.views.Document,
        this.isMobile() && (this.mobile = new app.views.Mobile),
        document.body.hasAttribute("data-doc") ? (this.DOC = JSON.parse(document.body.getAttribute("data-doc")),
        this.bootOne()) : this.DOCS ? this.bootAll() : this.onBootError())
    }
    browserCheck() {
        return !!this.isSupportedBrowser() || (document.body.innerHTML = app.templates.unsupportedBrowser,
        this.hideLoadingScreen(),
        !1)
    }
    initErrorTracking() {
        this.isInvalidLocation() ? new app.views.Notif("InvalidLocation") : (this.config.sentry_dsn && Raven.config(this.config.sentry_dsn, {
            release: this.config.release,
            whitelistUrls: [/devdocs/],
            includePaths: [/devdocs/],
            ignoreErrors: [/NPObject/, /NS_ERROR/, /^null$/, /EvalError/],
            tags: {
                mode: this.isSingleDoc() ? "single" : "full",
                iframe: (window.top !== window).toString(),
                electron: (!!window.process?.versions?.electron).toString()
            },
            shouldSendCallback: () => {
                try {
                    if (this.isInjectionError())
                        return this.onInjectionError(),
                        !1;
                    if (this.isAndroidWebview())
                        return !1
                } catch (e) {}
                return !0
            }
            ,
            dataCallback(e) {
                try {
                    e.user ||= {},
                    Object.assign(e.user, app.settings.dump()),
                    e.user.docs && (e.user.docs = e.user.docs.split("/")),
                    app.lastIDBTransaction && (e.user.lastIDBTransaction = app.lastIDBTransaction),
                    e.tags.scriptCount = document.scripts.length
                } catch (e) {}
                return e
            }
        }).install(),
        this.previousErrorHandler = onerror,
        window.onerror = this.onWindowError.bind(this),
        CookiesStore.onBlocked = this.onCookieBlocked)
    }
    bootOne() {
        this.doc = new app.models.Doc(this.DOC),
        this.docs.reset([this.doc]),
        this.doc.load(this.start.bind(this), this.onBootError.bind(this), {
            readCache: !0
        }),
        new app.views.Notice("singleDoc",this.doc),
        delete this.DOC
    }
    bootAll() {
        const e = this.settings.getDocs();
        for (var t of this.DOCS)
            (e.includes(t.slug) ? this.docs : this.disabledDocs).add(t);
        this.migrateDocs(),
        this.docs.load(this.start.bind(this), this.onBootError.bind(this), {
            readCache: !0,
            writeCache: !0
        }),
        delete this.DOCS
    }
    start() {
        let e;
        for (e of this.docs.all())
            this.entries.add(e.toEntry());
        for (e of this.disabledDocs.all())
            this.entries.add(e.toEntry());
        for (e of this.docs.all())
            this.initDoc(e);
        this.trigger("ready"),
        this.router.start(),
        this.hideLoadingScreen(),
        setTimeout(( () => (this.doc || this.welcomeBack(),
        this.removeEvent("ready bootError"))), 50)
    }
    initDoc(e) {
        for (var t of e.types.all())
            e.entries.add(t.toEntry());
        this.entries.add(e.entries.all())
    }
    migrateDocs() {
        let e;
        for (var t of this.settings.getDocs()) {
            var s;
            if (!this.docs.findBy("slug", t))
                e = !0,
                "webpack~2" === t && (s = this.disabledDocs.findBy("slug", "webpack")),
                "angular~4_typescript" === t && (s = this.disabledDocs.findBy("slug", "angular")),
                "angular~2_typescript" === t && (s = this.disabledDocs.findBy("slug", "angular~2")),
                s || (s = this.disabledDocs.findBy("slug_without_version", t)),
                s && (this.disabledDocs.remove(s),
                this.docs.add(s))
        }
        e && this.saveDocs()
    }
    enableDoc(e, t, s) {
        if (this.docs.contains(e))
            return;
        const a = () => {
            this.docs.contains(e) || (this.disabledDocs.remove(e),
            this.docs.add(e),
            this.docs.sort(),
            this.initDoc(e),
            this.saveDocs(),
            app.settings.get("autoInstall") ? e.install(t, s) : t())
        }
        ;
        e.load(a, s, {
            writeCache: !0
        })
    }
    saveDocs() {
        return this.settings.setDocs(this.docs.all().map((e => e.slug))),
        this.db.migrate(),
        null != this.serviceWorker ? this.serviceWorker.updateInBackground() : void 0
    }
    welcomeBack() {
        let e = this.settings.get("count");
        return this.settings.set("count", ++e),
        5 === e && new app.views.Notif("Share",{
            autoHide: null
        }),
        new app.views.News,
        new app.views.Updates,
        this.updateChecker = new app.UpdateChecker
    }
    reboot() {
        "/" !== location.pathname && "/settings" !== location.pathname ? window.location = `/#${location.pathname}` : window.location = "/"
    }
    reload() {
        this.docs.clearCache(),
        this.disabledDocs.clearCache(),
        this.serviceWorker ? this.serviceWorker.reload() : this.reboot()
    }
    reset() {
        this.localStorage.reset(),
        this.settings.reset(),
        null != this.db && this.db.reset(),
        null != this.serviceWorker && this.serviceWorker.update(),
        window.location = "/"
    }
    showTip(e) {
        if (this.isSingleDoc())
            return;
        const t = this.settings.getTips();
        t.includes(e) || (t.push(e),
        this.settings.setTips(t),
        new app.views.Tip(e))
    }
    hideLoadingScreen() {
        $.overlayScrollbarsEnabled() && document.body.classList.add("_overlay-scrollbars"),
        document.documentElement.classList.remove("_booting")
    }
    indexHost() {
        return this.config[this.serviceWorker && this.settings.hasDocs() ? "index_path" : "docs_origin"]
    }
    onBootError(...e) {
        this.trigger("bootError"),
        this.hideLoadingScreen()
    }
    onQuotaExceeded() {
        this.quotaExceeded || (this.quotaExceeded = !0,
        new app.views.Notif("QuotaExceeded",{
            autoHide: null
        }))
    }
    onCookieBlocked(e, t, s) {
        this.cookieBlocked || (this.cookieBlocked = !0,
        new app.views.Notif("CookieBlocked",{
            autoHide: null
        }),
        Raven.captureMessage(`CookieBlocked/${e}`, {
            level: "warning",
            extra: {
                value: t,
                actual: s
            }
        }))
    }
    onWindowError(...e) {
        this.cookieBlocked || (this.isInjectionError(...e) ? this.onInjectionError() : this.isAppError(...e) && ("function" == typeof this.previousErrorHandler && this.previousErrorHandler(...e),
        this.hideLoadingScreen(),
        this.errorNotif || (this.errorNotif = new app.views.Notif("Error")),
        this.errorNotif.show()))
    }
    onInjectionError() {
        this.injectionError || (this.injectionError = !0,
        alert("JavaScript code has been injected in the page which prevents DevDocs from running correctly.\nPlease check your browser extensions/addons. "),
        Raven.captureMessage("injection error", {
            level: "info"
        }))
    }
    isInjectionError() {
        return window.$ !== app._$ || window.$$ !== app._$$ || window.page !== app._page || "function" != typeof $.empty || "function" != typeof page.show
    }
    isAppError(e, t) {
        return t && t.includes("devdocs") && t.endsWith(".js")
    }
    isSupportedBrowser() {
        try {
            const t = {
                bind: !!Function.prototype.bind,
                pushState: !!history.pushState,
                matchMedia: !!window.matchMedia,
                insertAdjacentHTML: !!document.body.insertAdjacentHTML,
                defaultPrevented: !1 === document.createEvent("CustomEvent").defaultPrevented,
                cssVariables: !!CSS.supports?.("(--t: 0)")
            };
            for (var e in t) {
                if (!t[e])
                    return Raven.captureMessage(`unsupported/${e}`, {
                        level: "info"
                    }),
                    !1
            }
            return !0
        } catch (e) {
            return Raven.captureMessage("unsupported/exception", {
                level: "info",
                extra: {
                    error: e
                }
            }),
            !1
        }
    }
    isSingleDoc() {
        return document.body.hasAttribute("data-doc")
    }
    isMobile() {
        return null != this._isMobile ? this._isMobile : this._isMobile = app.views.Mobile.detect()
    }
    isAndroidWebview() {
        return null != this._isAndroidWebview ? this._isAndroidWebview : this._isAndroidWebview = app.views.Mobile.detectAndroidWebview()
    }
    isInvalidLocation() {
        return "production" === this.config.env && !location.host.startsWith(app.config.production_host)
    }
}
let fuzzyRegexp, i, index, lastIndex, match, matcher, matchIndex, matchLength, queryLength, score, separators, value, valueLength;
this.app = new App,
app.config = {
    db_filename: "db.json",
    default_docs: ["css", "dom", "html", "http", "javascript"],
    docs_aliases: {
        angular: "ng",
        "angular.js": "ng",
        "backbone.js": "bb",
        "c++": "cpp",
        coffeescript: "cs",
        crystal: "cr",
        elixir: "ex",
        javascript: "js",
        julia: "jl",
        jquery: "$",
        "knockout.js": "ko",
        kubernetes: "k8s",
        less: "ls",
        lodash: "_",
        "l\xf6ve": "love",
        marionette: "mn",
        markdown: "md",
        matplotlib: "mpl",
        modernizr: "mdr",
        "moment.js": "mt",
        openjdk: "java",
        nginx: "ngx",
        numpy: "np",
        pandas: "pd",
        postgresql: "pg",
        python: "py",
        "ruby.on.rails": "ror",
        ruby: "rb",
        rust: "rs",
        sass: "scss",
        tensorflow: "tf",
        typescript: "ts",
        "underscore.js": "_"
    },
    docs_origin: "//documents.devdocs.io",
    env: "production",
    history_cache_size: 10,
    index_filename: "index.json",
    index_path: "/docs",
    max_results: 50,
    production_host: "devdocs.io",
    search_param: "q",
    sentry_dsn: "https://5df3f4c982314008b52b799b1f25ad9d@app.getsentry.com/11245",
    version: 1740609774,
    release: "Wed, 26 Feb 2025 22:42:54 GMT",
    mathml_stylesheet: "/mathml.css",
    favicon_spritesheet: "/assets/sprites/docs-51d19d98861d43bb4f9f169b5b14eafdbadda4199b61cbb432387ec48c3ae31b.png",
    service_worker_path: "/service-worker.js",
    service_worker_enabled: !0
},
app.DB = class e {
    static NAME = "docs";
    static VERSION = 15;
    constructor() {
        this.versionMultipler = $.isIE() ? 1e5 : 1e9,
        this.useIndexedDB = this.useIndexedDB(),
        this.callbacks = []
    }
    db(t) {
        if (!this.useIndexedDB)
            return t();
        if (t && this.callbacks.push(t),
        !this.open)
            try {
                this.open = !0;
                const t = indexedDB.open(e.NAME, e.VERSION * this.versionMultipler + this.userVersion());
                t.onsuccess = e => this.onOpenSuccess(e),
                t.onerror = e => this.onOpenError(e),
                t.onupgradeneeded = e => this.onUpgradeNeeded(e)
            } catch (e) {
                this.fail("exception", e)
            }
    }
    onOpenSuccess(e) {
        let t;
        const s = e.target.result;
        if (0 === s.objectStoreNames.length) {
            try {
                s.close()
            } catch (e) {}
            this.open = !1,
            this.fail("empty")
        } else if (t = this.buggyIDB(s)) {
            try {
                s.close()
            } catch (e) {}
            this.open = !1,
            this.fail("buggy", t)
        } else
            this.runCallbacks(s),
            this.open = !1,
            s.close()
    }
    onOpenError(e) {
        e.preventDefault(),
        this.open = !1;
        const {error: t} = e.target;
        switch (t.name) {
        case "QuotaExceededError":
            this.onQuotaExceededError();
            break;
        case "VersionError":
            this.onVersionError();
            break;
        case "InvalidStateError":
            this.fail("private_mode");
            break;
        default:
            this.fail("cant_open", t)
        }
    }
    fail(e, t) {
        this.cachedDocs = null,
        this.useIndexedDB = !1,
        this.reason || (this.reason = e),
        this.error || (this.error = t),
        t && "function" == typeof console.error && console.error("IDB error", t),
        this.runCallbacks(),
        t && "cant_open" === e && Raven.captureMessage(`${t.name}: ${t.message}`, {
            level: "warning",
            fingerprint: [t.name]
        })
    }
    onQuotaExceededError() {
        this.reset(),
        this.db(),
        app.onQuotaExceeded(),
        Raven.captureMessage("QuotaExceededError", {
            level: "warning"
        })
    }
    onVersionError() {
        const t = indexedDB.open(e.NAME);
        t.onsuccess = e => this.handleVersionMismatch(e.target.result.version),
        t.onerror = function(e) {
            return e.preventDefault(),
            this.fail("cant_open", error)
        }
    }
    handleVersionMismatch(t) {
        Math.floor(t / this.versionMultipler) !== e.VERSION ? this.fail("version") : (this.setUserVersion(t - e.VERSION * this.versionMultipler),
        this.db())
    }
    buggyIDB(e) {
        if (!this.checkedBuggyIDB) {
            this.checkedBuggyIDB = !0;
            try {
                return void this.idbTransaction(e, {
                    stores: $.makeArray(e.objectStoreNames).slice(0, 2),
                    mode: "readwrite"
                }).abort()
            } catch (e) {
                return e
            }
        }
    }
    runCallbacks(e) {
        let t;
        for (; t = this.callbacks.shift(); )
            t(e)
    }
    onUpgradeNeeded(e) {
        let t;
        if (!(t = e.target.result))
            return;
        const s = $.makeArray(t.objectStoreNames);
        if (!$.arrayDelete(s, "docs"))
            try {
                t.createObjectStore("docs")
            } catch (e) {}
        for (var a of app.docs.all())
            if (!$.arrayDelete(s, a.slug))
                try {
                    t.createObjectStore(a.slug)
                } catch (e) {}
        for (var n of s)
            try {
                t.deleteObjectStore(n)
            } catch (e) {}
    }
    store(e, t, s, a, n) {
        null == n && (n = !0),
        this.db((i => {
            if (!i)
                return void a();
            const r = this.idbTransaction(i, {
                stores: ["docs", e.slug],
                mode: "readwrite",
                ignoreError: !1
            });
            r.oncomplete = () => {
                null != this.cachedDocs && (this.cachedDocs[e.slug] = e.mtime),
                s()
            }
            ,
            r.onerror = i => {
                i.preventDefault(),
                "NotFoundError" === r.error?.name && n ? (this.migrate(),
                setTimeout(( () => this.store(e, t, s, a, !1)), 0)) : a(i)
            }
            ;
            let o = r.objectStore(e.slug);
            for (var l in o.clear(),
            t) {
                var c = t[l];
                o.add(c, l)
            }
            o = r.objectStore("docs"),
            o.put(e.mtime, e.slug)
        }
        ))
    }
    unstore(e, t, s, a) {
        null == a && (a = !0),
        this.db((n => {
            if (!n)
                return void s();
            const i = this.idbTransaction(n, {
                stores: ["docs", e.slug],
                mode: "readwrite",
                ignoreError: !1
            });
            i.oncomplete = () => {
                null != this.cachedDocs && delete this.cachedDocs[e.slug],
                t()
            }
            ,
            i.onerror = function(n) {
                n.preventDefault(),
                "NotFoundError" === i.error?.name && a ? (this.migrate(),
                setTimeout(( () => this.unstore(e, t, s, !1)), 0)) : s(n)
            }
            ;
            let r = i.objectStore("docs");
            r.delete(e.slug),
            r = i.objectStore(e.slug),
            r.clear()
        }
        ))
    }
    version(e, t) {
        const s = this.cachedVersion(e);
        null == s ? this.db((s => {
            if (!s)
                return void t(!1);
            const a = this.idbTransaction(s, {
                stores: ["docs"],
                mode: "readonly"
            }).objectStore("docs").get(e.slug);
            a.onsuccess = function() {
                t(a.result)
            }
            ,
            a.onerror = function(e) {
                e.preventDefault(),
                t(!1)
            }
        }
        )) : t(s)
    }
    cachedVersion(e) {
        if (this.cachedDocs)
            return this.cachedDocs[e.slug] || !1
    }
    versions(e, t) {
        const s = this.cachedVersions(e);
        if (!s)
            return this.db((s => {
                if (!s)
                    return void t(!1);
                const a = this.idbTransaction(s, {
                    stores: ["docs"],
                    mode: "readonly"
                });
                a.oncomplete = function() {
                    t(i)
                }
                ;
                const n = a.objectStore("docs");
                var i = {};
                e.forEach((e => {
                    const t = n.get(e.slug);
                    t.onsuccess = function() {
                        i[e.slug] = t.result
                    }
                    ,
                    t.onerror = function(t) {
                        t.preventDefault(),
                        i[e.slug] = !1
                    }
                }
                ))
            }
            ));
        t(s)
    }
    cachedVersions(e) {
        if (!this.cachedDocs)
            return;
        const t = {};
        for (var s of e)
            t[s.slug] = this.cachedVersion(s);
        return t
    }
    load(e, t, s) {
        return this.shouldLoadWithIDB(e) ? this.loadWithIDB(e, t, ( () => this.loadWithXHR(e, t, s))) : this.loadWithXHR(e, t, s)
    }
    loadWithXHR(e, t, s) {
        return ajax({
            url: e.fileUrl(),
            dataType: "html",
            success: t,
            error: s
        })
    }
    loadWithIDB(e, t, s) {
        return this.db((a => {
            if (!a)
                return void s();
            if (!a.objectStoreNames.contains(e.doc.slug))
                return s(),
                void this.loadDocsCache(a);
            const n = this.idbTransaction(a, {
                stores: [e.doc.slug],
                mode: "readonly"
            }).objectStore(e.doc.slug).get(e.dbPath());
            n.onsuccess = function() {
                n.result ? t(n.result) : s()
            }
            ,
            n.onerror = function(e) {
                e.preventDefault(),
                s()
            }
            ,
            this.loadDocsCache(a)
        }
        ))
    }
    loadDocsCache(e) {
        if (this.cachedDocs)
            return;
        this.cachedDocs = {};
        const t = this.idbTransaction(e, {
            stores: ["docs"],
            mode: "readonly"
        });
        t.oncomplete = () => {
            setTimeout(( () => this.checkForCorruptedDocs()), 50)
        }
        ;
        const s = t.objectStore("docs").openCursor();
        s.onsuccess = e => {
            let t;
            (t = e.target.result) && (this.cachedDocs[t.key] = t.value,
            t.continue())
        }
        ,
        s.onerror = function(e) {
            e.preventDefault()
        }
    }
    checkForCorruptedDocs() {
        this.db((e => {
            let t;
            this.corruptedDocs = [];
            const s = ( () => {
                const e = [];
                for (var t in this.cachedDocs) {
                    this.cachedDocs[t] && e.push(t)
                }
                return e
            }
            )();
            if (0 === s.length)
                return;
            for (t of s)
                app.docs.findBy("slug", t) || this.corruptedDocs.push(t);
            for (t of this.corruptedDocs)
                $.arrayDelete(s, t);
            if (0 === s.length)
                return void setTimeout(( () => this.deleteCorruptedDocs()), 0);
            const a = this.idbTransaction(e, {
                stores: s,
                mode: "readonly",
                ignoreError: !1
            });
            for (var n of (a.oncomplete = () => {
                this.corruptedDocs.length > 0 && setTimeout(( () => this.deleteCorruptedDocs()), 0)
            }
            ,
            s))
                a.objectStore(n).get("index").onsuccess = e => {
                    e.target.result || this.corruptedDocs.push(e.target.source.name)
                }
        }
        ))
    }
    deleteCorruptedDocs() {
        this.db((e => {
            let t;
            const s = this.idbTransaction(e, {
                stores: ["docs"],
                mode: "readwrite",
                ignoreError: !1
            }).objectStore("docs");
            for (; t = this.corruptedDocs.pop(); )
                this.cachedDocs[t] = !1,
                s.delete(t)
        }
        )),
        Raven.captureMessage("corruptedDocs", {
            level: "info",
            extra: {
                docs: this.corruptedDocs.join(",")
            }
        })
    }
    shouldLoadWithIDB(e) {
        return this.useIndexedDB && (!this.cachedDocs || this.cachedDocs[e.doc.slug])
    }
    idbTransaction(e, t) {
        app.lastIDBTransaction = [t.stores, t.mode];
        const s = e.transaction(t.stores, t.mode);
        return !1 !== t.ignoreError && (s.onerror = function(e) {
            e.preventDefault()
        }
        ),
        !1 !== t.ignoreAbort && (s.onabort = function(e) {
            e.preventDefault()
        }
        ),
        s
    }
    reset() {
        try {
            indexedDB?.deleteDatabase(e.NAME)
        } catch (e) {}
    }
    useIndexedDB() {
        try {
            return !(app.isSingleDoc() || !window.indexedDB) || (this.reason = "not_supported",
            !1)
        } catch (e) {
            return !1
        }
    }
    migrate() {
        app.settings.set("schema", this.userVersion() + 1)
    }
    setUserVersion(e) {
        app.settings.set("schema", e)
    }
    userVersion() {
        return app.settings.get("schema")
    }
}
,
app.Router = class extends Events {
    static routes = [["*", "before"], ["/", "root"], ["/settings", "settings"], ["/offline", "offline"], ["/about", "about"], ["/news", "news"], ["/help", "help"], ["/:doc-:type/", "type"], ["/:doc/", "doc"], ["/:doc/:path(*)", "entry"], ["*", "notFound"]];
    constructor() {
        for (var [e,t] of (super(),
        this.constructor.routes))
            page(e, this[t].bind(this));
        this.setInitialPath()
    }
    start() {
        page.start()
    }
    show(e) {
        page.show(e)
    }
    triggerRoute(e) {
        this.trigger(e, this.context),
        this.trigger("after", e, this.context)
    }
    before(e, t) {
        let s;
        const a = this.context;
        return this.context = e,
        this.trigger("before", e),
        (s = t()) ? (this.context = a,
        s) : void 0
    }
    doc(e, t) {
        let s;
        return (s = app.docs.findBySlug(e.params.doc) || app.disabledDocs.findBySlug(e.params.doc)) ? (e.doc = s,
        e.entry = s.toEntry(),
        void this.triggerRoute("entry")) : t()
    }
    type(e, t) {
        const s = app.docs.findBySlug(e.params.doc)
          , a = s?.types?.findBy("slug", e.params.type);
        return a ? (e.doc = s,
        e.type = a,
        void this.triggerRoute("type")) : t()
    }
    entry(e, t) {
        let s;
        const a = app.docs.findBySlug(e.params.doc);
        if (!a)
            return t();
        let {path: n} = e.params;
        const {hash: i} = e;
        if (s = a.findEntryByPathAndHash(n, i))
            return e.doc = a,
            e.entry = s,
            void this.triggerRoute("entry");
        if ("/index" === n.slice(-6)) {
            if (n = n.substr(0, n.length - 6),
            s = a.findEntryByPathAndHash(n, i))
                return s.fullPath()
        } else if (n = `${n}/index`,
        s = a.findEntryByPathAndHash(n, i))
            return s.fullPath();
        return t()
    }
    root() {
        if (app.isSingleDoc())
            return "/";
        this.triggerRoute("root")
    }
    settings(e) {
        if (app.isSingleDoc())
            return `/#/${e.path}`;
        this.triggerRoute("settings")
    }
    offline(e) {
        if (app.isSingleDoc())
            return `/#/${e.path}`;
        this.triggerRoute("offline")
    }
    about(e) {
        if (app.isSingleDoc())
            return `/#/${e.path}`;
        e.page = "about",
        this.triggerRoute("page")
    }
    news(e) {
        if (app.isSingleDoc())
            return `/#/${e.path}`;
        e.page = "news",
        this.triggerRoute("page")
    }
    help(e) {
        if (app.isSingleDoc())
            return `/#/${e.path}`;
        e.page = "help",
        this.triggerRoute("page")
    }
    notFound(e) {
        this.triggerRoute("notFound")
    }
    isIndex() {
        return "/" === this.context?.path || app.isSingleDoc() && this.context?.entry?.isIndex()
    }
    isSettings() {
        return "/settings" === this.context?.path
    }
    setInitialPath() {
        let e;
        (e = location.pathname.replace(/^\/{2,}/g, "/")) !== location.pathname && page.replace(e + location.search + location.hash, null, !0),
        "/" === location.pathname && ((e = this.getInitialPathFromHash()) ? page.replace(e + location.search, null, !0) : (e = this.getInitialPathFromCookie()) && page.replace(e + location.search + location.hash, null, !0))
    }
    getInitialPathFromHash() {
        try {
            return new RegExp("#/(.+)").exec(decodeURIComponent(location.hash))?.[1]
        } catch (e) {}
    }
    getInitialPathFromCookie() {
        let e;
        if (e = Cookies.get("initial_path"))
            return Cookies.expire("initial_path"),
            e
    }
    replaceHash(e) {
        page.replace(location.pathname + location.search + (e || ""), null, !0)
    }
}
;
const SEPARATOR = ".";
let query = queryLength = value = valueLength = matcher = fuzzyRegexp = index = lastIndex = match = matchIndex = matchLength = score = separators = i = null;
app.Searcher = class e extends Events {
    static CHUNK_SIZE = 2e4;
    static DEFAULTS = {
        max_results: app.config.max_results,
        fuzzy_min_length: 3
    };
    static SEPARATORS_REGEXP = /#|::|:-|->|\$(?=\w)|\-(?=\w)|\:(?=\w)|\ [\/\-&]\ |:\ |\ /g;
    static EOS_SEPARATORS_REGEXP = /(\w)[\-:]$/;
    static INFO_PARANTHESES_REGEXP = /\ \(\w+?\)$/;
    static EMPTY_PARANTHESES_REGEXP = /\(\)/;
    static EVENT_REGEXP = /\ event$/;
    static DOT_REGEXP = /\.+/g;
    static WHITESPACE_REGEXP = /\s/g;
    static EMPTY_STRING = "";
    static ELLIPSIS = "...";
    static STRING = "string";
    static normalizeString(t) {
        return t.toLowerCase().replace(e.ELLIPSIS, e.EMPTY_STRING).replace(e.EVENT_REGEXP, e.EMPTY_STRING).replace(e.INFO_PARANTHESES_REGEXP, e.EMPTY_STRING).replace(e.SEPARATORS_REGEXP, SEPARATOR).replace(e.DOT_REGEXP, SEPARATOR).replace(e.EMPTY_PARANTHESES_REGEXP, e.EMPTY_STRING).replace(e.WHITESPACE_REGEXP, e.EMPTY_STRING)
    }
    static normalizeQuery(t) {
        return (t = this.normalizeString(t)).replace(e.EOS_SEPARATORS_REGEXP, "$1.")
    }
    constructor(t) {
        super(),
        this.options = {
            ...e.DEFAULTS,
            ...t || {}
        }
    }
    find(e, t, s) {
        this.kill(),
        this.data = e,
        this.attr = t,
        this.query = s,
        this.setup(),
        this.isValid() ? this.match() : this.end()
    }
    setup() {
        query = this.query = this.constructor.normalizeQuery(this.query),
        queryLength = query.length,
        this.dataLength = this.data.length,
        this.matchers = [exactMatch],
        this.totalResults = 0,
        this.setupFuzzy()
    }
    setupFuzzy() {
        queryLength >= this.options.fuzzy_min_length ? (fuzzyRegexp = this.queryToFuzzyRegexp(query),
        this.matchers.push(fuzzyMatch)) : fuzzyRegexp = null
    }
    isValid() {
        return queryLength > 0 && query !== SEPARATOR
    }
    end() {
        this.totalResults || this.triggerResults([]),
        this.trigger("end"),
        this.free()
    }
    kill() {
        this.timeout && (clearTimeout(this.timeout),
        this.free())
    }
    free() {
        this.data = null,
        this.attr = null,
        this.dataLength = null,
        this.matchers = null,
        this.matcher = null,
        this.query = null,
        this.totalResults = null,
        this.scoreMap = null,
        this.cursor = null,
        this.timeout = null
    }
    match() {
        !this.foundEnough() && (this.matcher = this.matchers.shift()) ? (this.setupMatcher(),
        this.matchChunks()) : this.end()
    }
    setupMatcher() {
        this.cursor = 0,
        this.scoreMap = new Array(101)
    }
    matchChunks() {
        this.matchChunk(),
        this.cursor === this.dataLength || this.scoredEnough() ? (this.delay(( () => this.match())),
        this.sendResults()) : this.delay(( () => this.matchChunks()))
    }
    matchChunk() {
        ({matcher: matcher} = this);
        for (let e = 0, t = this.chunkSize(); e < t; e++) {
            if (value = this.data[this.cursor][this.attr],
            value.split)
                valueLength = value.length,
                (score = matcher()) && this.addResult(this.data[this.cursor], score);
            else {
                for (value of (score = 0,
                Array.from(this.data[this.cursor][this.attr])))
                    valueLength = value.length,
                    score = Math.max(score, matcher() || 0);
                score > 0 && this.addResult(this.data[this.cursor], score)
            }
            this.cursor++
        }
    }
    chunkSize() {
        return this.cursor + e.CHUNK_SIZE > this.dataLength ? this.dataLength % e.CHUNK_SIZE : e.CHUNK_SIZE
    }
    scoredEnough() {
        return this.scoreMap[100]?.length >= this.options.max_results
    }
    foundEnough() {
        return this.totalResults >= this.options.max_results
    }
    addResult(e, t) {
        let s;
        (this.scoreMap[s = Math.round(t)] || (this.scoreMap[s] = [])).push(e),
        this.totalResults++
    }
    getResults() {
        const e = [];
        for (let s = this.scoreMap.length - 1; s >= 0; s--) {
            var t = this.scoreMap[s];
            t && e.push(...t)
        }
        return e.slice(0, this.options.max_results)
    }
    sendResults() {
        const e = this.getResults();
        e.length && this.triggerResults(e)
    }
    triggerResults(e) {
        this.trigger("results", e)
    }
    delay(e) {
        return this.timeout = setTimeout(e, 1)
    }
    queryToFuzzyRegexp(e) {
        const t = e.split("");
        for (i = 0; i < t.length; i++) {
            var s = t[i];
            t[i] = $.escapeRegexp(s)
        }
        return new RegExp(t.join(".*?"))
    }
}
,
app.SynchronousSearcher = class extends app.Searcher {
    match() {
        return this.matcher && (this.allResults || (this.allResults = []),
        this.allResults.push(...this.getResults())),
        super.match(...arguments)
    }
    free() {
        return this.allResults = null,
        super.free(...arguments)
    }
    end() {
        return this.sendResults(!0),
        super.end(...arguments)
    }
    sendResults(e) {
        if (e && this.allResults?.length)
            return this.triggerResults(this.allResults)
    }
    delay(e) {
        return e()
    }
}
,
app.ServiceWorker = class extends Events {
    static isEnabled() {
        return !!navigator.serviceWorker && app.config.service_worker_enabled
    }
    constructor() {
        super();
        this.onStateChange = this.onStateChange.bind(this);
        this.registration = null;
        this.notifyUpdate = !0;
    
        // Chỉ đăng ký nếu không phải localhost
        if (!window.location.href.includes('localhost') && !window.location.href.includes('127.0.0.1')) {
            navigator.serviceWorker.register(app.config.service_worker_path, {
                scope: "/"
            }).then((e) => this.updateRegistration(e), (e) => console.error("Lỗi đăng ký Service Worker:", e));
        }
    }
    update() {
        if (this.registration)
            return this.notifyUpdate = !0,
            this.registration.update().catch(( () => {}
            ))
    }
    updateInBackground() {
        if (this.registration)
            return this.notifyUpdate = !1,
            this.registration.update().catch(( () => {}
            ))
    }
    reload() {
        return this.updateInBackground().then(( () => app.reboot()))
    }
    updateRegistration(e) {
        this.registration = e,
        $.on(this.registration, "updatefound", ( () => this.onUpdateFound()))
    }
    onUpdateFound() {
        this.installingRegistration && $.off(this.installingRegistration, "statechange", this.onStateChange),
        this.installingRegistration = this.registration.installing,
        $.on(this.installingRegistration, "statechange", this.onStateChange)
    }
    onStateChange() {
        this.installingRegistration && "installed" === this.installingRegistration.state && navigator.serviceWorker.controller && (this.installingRegistration = null,
        this.onUpdateReady())
    }
    onUpdateReady() {
        this.notifyUpdate && this.trigger("updateready")
    }
}
,
app.Settings = class e {
    static PREFERENCE_KEYS = ["hideDisabled", "hideIntro", "manualUpdate", "fastScroll", "arrowScroll", "analyticsConsent", "docs", "dark", "theme", "layout", "size", "tips", "noAutofocus", "autoInstall", "spaceScroll", "spaceTimeout", "noDocSpecificIcon"];
    static INTERNAL_KEYS = ["count", "schema", "version", "news"];
    static LAYOUTS = ["_max-width", "_sidebar-hidden", "_native-scrollbars", "_text-justify-hyphenate"];
    static defaults = {
        count: 0,
        hideDisabled: !1,
        hideIntro: !1,
        news: 0,
        manualUpdate: !1,
        schema: 1,
        analyticsConsent: !1,
        theme: "auto",
        spaceScroll: 1,
        spaceTimeout: .5,
        noDocSpecificIcon: !1
    };
    constructor() {
        this.store = new CookiesStore,
        this.cache = {},
        this.autoSupported = "not all" !== window.matchMedia("(prefers-color-scheme)").media,
        this.autoSupported && (this.darkModeQuery = window.matchMedia("(prefers-color-scheme: light)"),
        this.darkModeQuery.addListener(( () => this.setTheme(this.get("theme")))))
    }
    get(e) {
        let t;
        return this.cache.hasOwnProperty(e) ? this.cache[e] : (this.cache[e] = null != (t = this.store.get(e)) ? t : this.constructor.defaults[e],
        "theme" !== e || "auto" !== this.cache[e] || this.darkModeQuery ? this.cache[e] : this.cache[e] = "default")
    }
    set(e, t) {
        this.store.set(e, t),
        delete this.cache[e],
        "theme" === e && this.setTheme(t)
    }
    del(e) {
        this.store.del(e),
        delete this.cache[e]
    }
    hasDocs() {
        try {
            return !!this.store.get("docs")
        } catch (e) {}
    }
    getDocs() {
        return this.store.get("docs")?.split("/") || app.config.default_docs
    }
    setDocs(e) {
        this.set("docs", e.join("/"))
    }
    getTips() {
        return this.store.get("tips")?.split("/") || []
    }
    setTips(e) {
        this.set("tips", e.join("/"))
    }
    setLayout(e, t) {
        this.toggleLayout(e, t);
        const s = (this.store.get("layout") || "").split(" ");
        $.arrayDelete(s, ""),
        t ? s.includes(e) || s.push(e) : $.arrayDelete(s, e),
        s.length > 0 ? this.set("layout", s.join(" ")) : this.del("layout")
    }
    hasLayout(e) {
        return (this.store.get("layout") || "").split(" ").includes(e)
    }
    setSize(e) {
        this.set("size", e)
    }
    dump() {
        return this.store.dump()
    }
    export() {
        const t = this.dump();
        for (var s of e.INTERNAL_KEYS)
            delete t[s];
        return t
    }
    import(t) {
        let s, a;
        const n = this.export();
        for (s in n)
            a = n[s],
            t.hasOwnProperty(s) || this.del(s);
        for (s in t)
            a = t[s],
            e.PREFERENCE_KEYS.includes(s) && this.set(s, a)
    }
    reset() {
        this.store.reset(),
        this.cache = {}
    }
    initLayout() {
        for (var e of (1 === this.get("dark") && (this.set("theme", "dark"),
        this.del("dark")),
        this.setTheme(this.get("theme")),
        app.Settings.LAYOUTS))
            this.toggleLayout(e, this.hasLayout(e));
        this.initSidebarWidth()
    }
    setTheme(e) {
        "auto" === e && (e = this.darkModeQuery.matches ? "dark" : "default");
        const {classList: t} = document.documentElement;
        t.remove("_theme-default", "_theme-dark"),
        t.add("_theme-" + e),
        this.updateColorMeta()
    }
    updateColorMeta() {
        const e = getComputedStyle(document.documentElement).getPropertyValue("--headerBackground").trim();
        if ($("meta[name=theme-color]")) $("meta[name=theme-color]").setAttribute("content", e)
    }
    toggleLayout(e, t) {
        const {classList: s} = document.body;
        "_sidebar-hidden" === e && app.router?.isSettings || s.toggle(e, t),
        s.toggle("_overlay-scrollbars", $.overlayScrollbarsEnabled())
    }
    initSidebarWidth() {
        const e = this.get("size");
        e && document.documentElement.style.setProperty("--sidebarWidth", e + "px")
    }
}
,
app.Shortcuts = class extends Events {
    constructor() {
        super(),
        this.onKeydown = this.onKeydown.bind(this),
        this.onKeypress = this.onKeypress.bind(this),
        this.isMac = $.isMac(),
        this.start()
    }
    start() {
        $.on(document, "keydown", this.onKeydown),
        $.on(document, "keypress", this.onKeypress)
    }
    stop() {
        $.off(document, "keydown", this.onKeydown),
        $.off(document, "keypress", this.onKeypress)
    }
    swapArrowKeysBehavior() {
        return app.settings.get("arrowScroll")
    }
    spaceScroll() {
        return app.settings.get("spaceScroll")
    }
    showTip() {
        return app.showTip("KeyNav"),
        this.showTip = null
    }
    spaceTimeout() {
        return app.settings.get("spaceTimeout")
    }
    onKeydown(e) {
        if (this.buggyEvent(e))
            return;
        !1 === ( () => {
            if (e.ctrlKey || e.metaKey) {
                if (!e.altKey && !e.shiftKey)
                    return this.handleKeydownSuperEvent(e)
            } else {
                if (!e.shiftKey)
                    return e.altKey ? this.handleKeydownAltEvent(e) : this.handleKeydownEvent(e);
                if (!e.altKey)
                    return this.handleKeydownShiftEvent(e)
            }
        }
        )() && e.preventDefault()
    }
    onKeypress(e) {
        if (!(this.buggyEvent(e) || 63 === e.charCode && "INPUT" === document.activeElement.tagName || e.ctrlKey || e.metaKey)) {
            !1 === this.handleKeypressEvent(e) && e.preventDefault()
        }
    }
    handleKeydownEvent(e, t) {
        if (!t && [37, 38, 39, 40].includes(e.which) && this.swapArrowKeysBehavior())
            return this.handleKeydownAltEvent(e, !0);
        if (e.target.form || !(48 <= e.which && e.which <= 57 || 65 <= e.which && e.which <= 90))
            switch (e.which) {
            case 8:
                if (!e.target.form)
                    return this.trigger("typing");
                break;
            case 13:
                return this.trigger("enter");
            case 27:
                return this.trigger("escape"),
                !1;
            case 32:
                if ("search" === e.target.type && this.spaceScroll() && (!this.lastKeypress || this.lastKeypress < Date.now() - 1e3 * this.spaceTimeout()))
                    return this.trigger("pageDown"),
                    !1;
                break;
            case 33:
                return this.trigger("pageUp");
            case 34:
                return this.trigger("pageDown");
            case 35:
                if (!e.target.form)
                    return this.trigger("pageBottom");
                break;
            case 36:
                if (!e.target.form)
                    return this.trigger("pageTop");
                break;
            case 37:
                if (!e.target.value)
                    return this.trigger("left");
                break;
            case 38:
                return this.trigger("up"),
                "function" == typeof this.showTip && this.showTip(),
                !1;
            case 39:
                if (!e.target.value)
                    return this.trigger("right");
                break;
            case 40:
                return this.trigger("down"),
                "function" == typeof this.showTip && this.showTip(),
                !1;
            case 191:
                if (!e.target.form)
                    return this.trigger("typing"),
                    !1
            }
        else
            this.trigger("typing")
    }
    handleKeydownSuperEvent(e) {
        switch (e.which) {
        case 13:
            return this.trigger("superEnter");
        case 37:
            if (this.isMac)
                return this.trigger("superLeft"),
                !1;
            break;
        case 38:
            return this.trigger("pageTop"),
            !1;
        case 39:
            if (this.isMac)
                return this.trigger("superRight"),
                !1;
            break;
        case 40:
            return this.trigger("pageBottom"),
            !1;
        case 188:
            return this.trigger("preferences"),
            !1
        }
    }
    handleKeydownShiftEvent(e, t) {
        if (!t && [37, 38, 39, 40].includes(e.which) && this.swapArrowKeysBehavior())
            return this.handleKeydownEvent(e, !0);
        if (!e.target.form && 65 <= e.which && e.which <= 90)
            this.trigger("typing");
        else
            switch (e.which) {
            case 32:
                return this.trigger("pageUp"),
                !1;
            case 38:
                if (!getSelection()?.toString())
                    return this.trigger("altUp"),
                    !1;
                break;
            case 40:
                if (!getSelection()?.toString())
                    return this.trigger("altDown"),
                    !1
            }
    }
    handleKeydownAltEvent(e, t) {
        if (!t && [37, 38, 39, 40].includes(e.which) && this.swapArrowKeysBehavior())
            return this.handleKeydownEvent(e, !0);
        switch (e.which) {
        case 9:
            return this.trigger("altRight", e);
        case 37:
            if (!this.isMac)
                return this.trigger("superLeft"),
                !1;
            break;
        case 38:
            return this.trigger("altUp"),
            !1;
        case 39:
            if (!this.isMac)
                return this.trigger("superRight"),
                !1;
            break;
        case 40:
            return this.trigger("altDown"),
            !1;
        case 67:
            return this.trigger("altC"),
            !1;
        case 68:
            return this.trigger("altD"),
            !1;
        case 70:
            return this.trigger("altF", e);
        case 71:
            return this.trigger("altG"),
            !1;
        case 79:
            return this.trigger("altO"),
            !1;
        case 82:
            return this.trigger("altR"),
            !1;
        case 83:
            return this.trigger("altS"),
            !1
        }
    }
    handleKeypressEvent(e) {
        return 63 !== e.which || e.target.value ? this.lastKeypress = Date.now() : (this.trigger("help"),
        !1)
    }
    buggyEvent(e) {
        try {
            return e.target,
            e.ctrlKey,
            e.which,
            !1
        } catch (e) {
            return !0
        }
    }
}
,
app.UpdateChecker = class {
    constructor() {
        this.lastCheck = Date.now(),
        $.on(window, "focus", ( () => this.onFocus())),
        app.serviceWorker && app.serviceWorker.on("updateready", ( () => this.onUpdateReady())),
        setTimeout(( () => this.checkDocs()), 0)
    }
    check() {
        app.serviceWorker ? app.serviceWorker.update() : ajax({
            url: $('script[src*="application"]').getAttribute("src"),
            dataType: "application/javascript",
            error: (e, t) => {
                if (404 === t.status)
                    return this.onUpdateReady()
            }
        })
    }
    onUpdateReady() {
        new app.views.Notif("UpdateReady",{
            autoHide: null
        })
    }
    checkDocs() {
        app.settings.get("manualUpdate") ? app.docs.checkForUpdates((e => {
            if (e > 0)
                return this.onDocsUpdateReady()
        }
        )) : app.docs.updateInBackground()
    }
    onDocsUpdateReady() {
        new app.views.Notif("UpdateDocs",{
            autoHide: null
        })
    }
    onFocus() {
        Date.now() - this.lastCheck > 216e5 && (this.lastCheck = Date.now(),
        this.check())
    }
}
,
app.Collection = class {
    constructor(e) {
        null == e && (e = []),
        this.reset(e)
    }
    model() {
        return app.models[this.constructor.model]
    }
    reset(e) {
        for (var t of (null == e && (e = []),
        this.models = [],
        e))
            this.add(t)
    }
    add(e) {
        if (e instanceof app.Model)
            this.models.push(e);
        else if (e instanceof Array)
            for (var t of e)
                this.add(t);
        else
            e instanceof app.Collection ? this.models.push(...e.all() || []) : this.models.push(new (this.model())(e))
    }
    remove(e) {
        this.models.splice(this.models.indexOf(e), 1)
    }
    size() {
        return this.models.length
    }
    isEmpty() {
        return 0 === this.models.length
    }
    each(e) {
        for (var t of this.models)
            e(t)
    }
    all() {
        return this.models
    }
    contains(e) {
        return this.models.includes(e)
    }
    findBy(e, t) {
        return this.models.find((s => s[e] === t))
    }
    findAllBy(e, t) {
        return this.models.filter((s => s[e] === t))
    }
    countAllBy(e, t) {
        let s = 0;
        for (var a of this.models)
            a[e] === t && (s += 1);
        return s
    }
}
,
app.collections.Docs = class e extends app.Collection {
    static model = "Doc";
    static NORMALIZE_VERSION_RGX = /\.(\d)$/;
    static NORMALIZE_VERSION_SUB = ".0$1";
    static CONCURRENCY = 3;
    findBySlug(e) {
        return this.findBy("slug", e) || this.findBy("slug_without_version", e)
    }
    sort() {
        return this.models.sort(( (t, s) => t.name === s.name ? !t.version || t.version.replace(e.NORMALIZE_VERSION_RGX, e.NORMALIZE_VERSION_SUB) > s.version.replace(e.NORMALIZE_VERSION_RGX, e.NORMALIZE_VERSION_SUB) ? -1 : 1 : t.name.toLowerCase() > s.name.toLowerCase() ? 1 : -1))
    }
    load(t, s, a) {
        let n = 0;
        var i = () => {
            n < this.models.length ? this.models[n].load(i, r, a) : n === this.models.length + e.CONCURRENCY - 1 && t(),
            n++
        }
          , r = function(...e) {
            s && (s(e),
            s = null),
            i()
        };
        for (let t = 0, s = e.CONCURRENCY; t < s; t++)
            i()
    }
    clearCache() {
        for (var e of this.models)
            e.clearCache()
    }
    uninstall(e) {
        let t = 0;
        var s = () => {
            t < this.models.length ? this.models[t++].uninstall(s, s) : e()
        }
        ;
        s()
    }
    getInstallStatuses(e) {
        app.db.versions(this.models, (t => {
            if (t)
                for (var s in t) {
                    var a = t[s];
                    t[s] = {
                        installed: !!a,
                        mtime: a
                    }
                }
            e(t)
        }
        ))
    }
    checkForUpdates(e) {
        this.getInstallStatuses((t => {
            let s = 0;
            if (t)
                for (var a in t) {
                    var n = t[a];
                    this.findBy("slug", a).isOutdated(n) && (s += 1)
                }
            e(s)
        }
        ))
    }
    updateInBackground() {
        this.getInstallStatuses((e => {
            if (e)
                for (var t in e) {
                    var s = e[t]
                      , a = this.findBy("slug", t);
                    a.isOutdated(s) && a.install($.noop, $.noop)
                }
        }
        ))
    }
}
,
app.collections.Entries = class extends app.Collection {
    static model = "Entry"
}
,
app.collections.Types = class e extends app.Collection {
    static model = "Type";
    static GUIDES_RGX = /(^|\()(guides?|tutorials?|reference|book|getting\ started|manual|examples)($|[\):])/i;
    static APPENDIX_RGX = /appendix/i;
    groups() {
        const e = [];
        for (var t of this.models) {
            const s = this._groupFor(t);
            e[s] ||= [],
            e[s].push(t)
        }
        return e.filter((e => e.length > 0))
    }
    _groupFor(t) {
        return e.GUIDES_RGX.test(t.name) ? 0 : e.APPENDIX_RGX.test(t.name) ? 2 : 1
    }
}
,
app.Model = class {
    constructor(e) {
        for (var t in e) {
            var s = e[t];
            this[t] = s
        }
    }
}
,
app.models.Doc = class extends app.Model {
    constructor() {
        super(...arguments),
        this.reset(this),
        this.slug_without_version = this.slug.split("~")[0],
        this.fullName = `${this.name}` + (this.version ? ` ${this.version}` : ""),
        this.icon = this.slug_without_version,
        this.version && (this.short_version = this.version.split(" ")[0]),
        this.text = this.toEntry().text
    }
    reset(e) {
        this.resetEntries(e.entries),
        this.resetTypes(e.types)
    }
    resetEntries(e) {
        this.entries = new app.collections.Entries(e),
        this.entries.each((e => e.doc = this))
    }
    resetTypes(e) {
        this.types = new app.collections.Types(e),
        this.types.each((e => e.doc = this))
    }
    fullPath(e) {
        return null == e && (e = ""),
        "/" !== e[0] && (e = `/${e}`),
        `/${this.slug}${e}`
    }
    fileUrl(e) {
        return `${app.config.docs_origin}${this.fullPath(e)}?${this.mtime}`
    }
    dbUrl() {
        return `${app.config.docs_origin}/${this.slug}/${app.config.db_filename}?${this.mtime}`
    }
    indexUrl() {
        return `${app.indexHost()}/${this.slug}/${app.config.index_filename}?${this.mtime}`
    }
    toEntry() {
        return this.entry || (this.entry = new app.models.Entry({
            doc: this,
            name: this.fullName,
            path: "index"
        }),
        this.version && this.entry.addAlias(this.name)),
        this.entry
    }
    findEntryByPathAndHash(e, t) {
        let s;
        return t && (s = this.entries.findBy("path", `${e}#${t}`)) ? s : "index" === e ? this.toEntry() : this.entries.findBy("path", e)
    }
    load(e, t, s) {
        if (null == s && (s = {}),
        s.readCache && this._loadFromCache(e))
            return;
        const a = t => {
            this.reset(t),
            e(),
            s.writeCache && this._setCache(t)
        }
        ;
        return ajax({
            url: this.indexUrl(),
            success: a,
            error: t
        })
    }
    clearCache() {
        app.localStorage.del(this.slug)
    }
    _loadFromCache(e) {
        let t;
        if (!(t = this._getCache()))
            return;
        return setTimeout(( () => {
            this.reset(t),
            e()
        }
        ), 0),
        !0
    }
    _getCache() {
        let e;
        if (e = app.localStorage.get(this.slug))
            return e[0] === this.mtime ? e[1] : void this.clearCache()
    }
    _setCache(e) {
        app.localStorage.set(this.slug, [this.mtime, e])
    }
    install(e, t, s) {
        if (this.installing)
            return;
        this.installing = !0;
        const a = () => {
            this.installing = null,
            t()
        }
          , n = t => {
            this.installing = null,
            app.db.store(this, t, e, a)
        }
        ;
        ajax({
            url: this.dbUrl(),
            success: n,
            error: a,
            progress: s,
            timeout: 3600
        })
    }
    uninstall(e, t) {
        if (this.installing)
            return;
        this.installing = !0;
        const s = () => {
            this.installing = null,
            e()
        }
          , a = () => {
            this.installing = null,
            t()
        }
        ;
        app.db.unstore(this, s, a)
    }
    getInstallStatus(e) {
        app.db.version(this, (t => e({
            installed: !!t,
            mtime: t
        })))
    }
    isOutdated(e) {
        if (!e)
            return !1;
        return (e.installed || app.settings.get("autoInstall")) && this.mtime !== e.mtime
    }
}
,
app.models.Entry = class e extends app.Model {
    static applyAliases(e) {
        const t = app.config.docs_aliases;
        if (t.hasOwnProperty(e))
            return [e, t[e]];
        {
            const a = e.split(".");
            for (let n = 0; n < a.length; n++) {
                var s = a[n];
                if (t.hasOwnProperty(s))
                    return a[n] = t[s],
                    [e, a.join(".")]
            }
        }
        return e
    }
    constructor() {
        super(...arguments),
        this.text = e.applyAliases(app.Searcher.normalizeString(this.name))
    }
    addAlias(t) {
        const s = e.applyAliases(app.Searcher.normalizeString(t));
        Array.isArray(this.text) || (this.text = [this.text]),
        this.text.push(Array.isArray(s) ? s[1] : s)
    }
    fullPath() {
        return this.doc.fullPath(this.isIndex() ? "" : this.path)
    }
    dbPath() {
        return this.path.replace(/#.*/, "")
    }
    filePath() {
        return this.doc.fullPath(this._filePath())
    }
    fileUrl() {
        return this.doc.fileUrl(this._filePath())
    }
    _filePath() {
        let e = this.path.replace(/#.*/, "");
        return ".html" !== e.slice(-5) && (e += ".html"),
        e
    }
    isIndex() {
        return "index" === this.path
    }
    getType() {
        return this.doc.types.findBy("name", this.type)
    }
    loadFile(e, t) {
        return app.db.load(this, e, t)
    }
}
,
app.models.Type = class extends app.Model {
    fullPath() {
        return `/${this.doc.slug}-${this.slug}/`
    }
    entries() {
        return this.doc.entries.findAllBy("type", this.name)
    }
    toEntry() {
        return new app.models.Entry({
            doc: this.doc,
            name: `${this.doc.name} / ${this.name}`,
            path: ".." + this.fullPath()
        })
    }
}
,
app.View = class extends Events {
    constructor(e) {
        super();
        if (e instanceof HTMLElement) {
            this.el = e;
            this.setupElement();
            if (this.el) { // Kiểm tra lại this.el để tránh null
                this.el.className && (this.originalClassName = this.el.className);
                this.constructor.className && this.resetClass();
                this.refreshElements();
            }
        }
        "function" == typeof this.init && (this.init(), this.refreshElements());
    }
    setupElement() {
        if (null == this.el && (this.el = "string" == typeof this.constructor.el ? $(this.constructor.el) : this.constructor.el ? this.constructor.el : document.createElement(this.constructor.tagName || "div")),
        this.constructor.attributes)
            for (var e in this.constructor.attributes) {
                var t = this.constructor.attributes[e];
                this.el.setAttribute(e, t)
            }
    }
    refreshElements() {
        if (this.constructor.elements)
            for (var e in this.constructor.elements) {
                var t = this.constructor.elements[e];
                this[e] = this.find(t)
            }
    }
    addClass(e) {
        this.el.classList.add(e)
    }
    removeClass(e) {
        this.el.classList.remove(e)
    }
    toggleClass(e) {
        this.el.classList.toggle(e)
    }
    hasClass(e) {
        return this.el.classList.contains(e)
    }
    resetClass() {
        if (this.el.className = this.originalClassName || "",
        this.constructor.className)
            for (var e of Array.from(this.constructor.className.split(" ")))
                this.addClass(e)
    }
    find(e) {
        return $(e, this.el)
    }
    findAll(e) {
        return $$(e, this.el)
    }
    findByClass(e) {
        return this.findAllByClass(e)[0]
    }
    findLastByClass(e) {
        const t = this.findAllByClass(e)[0];
        return t[t.length - 1]
    }
    findAllByClass(e) {
        return this.el.getElementsByClassName(e)
    }
    findByTag(e) {
        return this.findAllByTag(e)[0]
    }
    findLastByTag(e) {
        const t = this.findAllByTag(e);
        return t[t.length - 1]
    }
    findAllByTag(e) {
        return this.el.getElementsByTagName(e)
    }
    append(e) {
        $.append(this.el, e.el || e)
    }
    appendTo(e) {
        $.append(e.el || e, this.el)
    }
    prepend(e) {
        $.prepend(this.el, e.el || e)
    }
    prependTo(e) {
        $.prepend(e.el || e, this.el)
    }
    before(e) {
        $.before(this.el, e.el || e)
    }
    after(e) {
        $.after(this.el, e.el || e)
    }
    remove(e) {
        $.remove(e.el || e)
    }
    empty() {
        $.empty(this.el),
        this.refreshElements()
    }
    html(e) {
        this.empty(),
        this.append(e)
    }
    tmpl(...e) {
        return app.templates.render(...e)
    }
    delay(e, ...t) {
        const s = "number" == typeof t[t.length - 1] ? t.pop() : 0;
        return setTimeout(e.bind(this, ...t), s)
    }
    onDOM(e, t) {
        $.on(this.el, e, t)
    }
    offDOM(e, t) {
        $.off(this.el, e, t)
    }
    bindEvents() {
        let e, t;
        if (this.constructor.events)
            for (t in this.constructor.events)
                e = this.constructor.events[t],
                this[e] = this[e].bind(this),
                this.onDOM(t, this[e]);
        if (this.constructor.routes)
            for (t in this.constructor.routes)
                e = this.constructor.routes[t],
                this[e] = this[e].bind(this),
                app.router.on(t, this[e]);
        if (this.constructor.shortcuts)
            for (t in this.constructor.shortcuts)
                e = this.constructor.shortcuts[t],
                this[e] = this[e].bind(this),
                app.shortcuts.on(t, this[e])
    }
    unbindEvents() {
        let e, t;
        if (this.constructor.events)
            for (t in this.constructor.events)
                e = this.constructor.events[t],
                this.offDOM(t, this[e]);
        if (this.constructor.routes)
            for (t in this.constructor.routes)
                e = this.constructor.routes[t],
                app.router.off(t, this[e]);
        if (this.constructor.shortcuts)
            for (t in this.constructor.shortcuts)
                e = this.constructor.shortcuts[t],
                app.shortcuts.off(t, this[e])
    }
    addSubview(e) {
        return (this.subviews || (this.subviews = [])).push(e)
    }
    activate() {
        if (!this.activated) {
            if (this.bindEvents(),
            this.subviews)
                for (var e of Array.from(this.subviews))
                    e.activate();
            return this.activated = !0,
            !0
        }
    }
    deactivate() {
        if (this.activated) {
            if (this.unbindEvents(),
            this.subviews)
                for (var e of Array.from(this.subviews))
                    e.deactivate();
            return this.activated = !1,
            !0
        }
    }
    detach() {
        this.deactivate(),
        $.remove(this.el)
    }
}
,
app.views.Content = class extends app.View {
    static el = "._content";
    static loadingClass = "_content-loading";
    static events = {
        click: "onClick"
    };
    static shortcuts = {
        altUp: "scrollStepUp",
        altDown: "scrollStepDown",
        pageUp: "scrollPageUp",
        pageDown: "scrollPageDown",
        pageTop: "scrollToTop",
        pageBottom: "scrollToBottom",
        altF: "onAltF"
    };
    static routes = {
        before: "beforeRoute",
        after: "afterRoute"
    };
    init() {
        this.scrollEl = app.isMobile() ? document.scrollingElement || document.body : this.el,
        this.scrollMap = {},
        this.scrollStack = [],
        this.rootPage = new app.views.RootPage,
        this.staticPage = new app.views.StaticPage,
        this.settingsPage = new app.views.SettingsPage,
        this.offlinePage = new app.views.OfflinePage,
        this.typePage = new app.views.TypePage,
        this.entryPage = new app.views.EntryPage,
        this.entryPage.on("loading", ( () => this.onEntryLoading())).on("loaded", ( () => this.onEntryLoaded())),
        app.on("ready", ( () => this.onReady())).on("bootError", ( () => this.onBootError()))
    }
    show(e) {
        this.hideLoading(),
        e !== this.view && (null != this.view && this.view.deactivate(),
        this.html(this.view = e),
        this.view.activate())
    }
    showLoading() {
        this.addClass(this.constructor.loadingClass)
    }
    isLoading() {
        return this.el.classList.contains(this.constructor.loadingClass)
    }
    hideLoading() {
        this.removeClass(this.constructor.loadingClass)
    }
    scrollTo(e) {
        this.scrollEl.scrollTop = e || 0
    }
    smoothScrollTo(e) {
        app.settings.get("fastScroll") ? this.scrollTo(e) : $.smoothScroll(this.scrollEl, e || 0)
    }
    scrollBy(e) {
        this.smoothScrollTo(this.scrollEl.scrollTop + e)
    }
    scrollToTop() {
        this.smoothScrollTo(0)
    }
    scrollToBottom() {
        this.smoothScrollTo(this.scrollEl.scrollHeight)
    }
    scrollStepUp() {
        this.scrollBy(-80)
    }
    scrollStepDown() {
        this.scrollBy(80)
    }
    scrollPageUp() {
        this.scrollBy(40 - this.scrollEl.clientHeight)
    }
    scrollPageDown() {
        this.scrollBy(this.scrollEl.clientHeight - 40)
    }
    scrollToTarget() {
        let e;
        this.routeCtx.hash && (e = this.findTargetByHash(this.routeCtx.hash)) ? ($.scrollToWithImageLock(e, this.scrollEl, "top", {
            margin: this.scrollEl === this.el ? 0 : $.offset(this.el).top
        }),
        $.highlight(e, {
            className: "_highlight"
        })) : this.scrollTo(this.scrollMap[this.routeCtx.state.id])
    }
    onReady() {
        this.hideLoading()
    }
    onBootError() {
        this.hideLoading(),
        this.html(this.tmpl("bootError"))
    }
    onEntryLoading() {
        this.showLoading(),
        this.scrollToTargetTimeout && (clearTimeout(this.scrollToTargetTimeout),
        this.scrollToTargetTimeout = null)
    }
    onEntryLoaded() {
        this.hideLoading(),
        this.scrollToTargetTimeout && (clearTimeout(this.scrollToTargetTimeout),
        this.scrollToTargetTimeout = null),
        this.scrollToTarget()
    }
    beforeRoute(e) {
        this.cacheScrollPosition(),
        this.routeCtx = e,
        this.scrollToTargetTimeout = this.delay(this.scrollToTarget)
    }
    cacheScrollPosition() {
        if (this.routeCtx && !this.routeCtx.hash && "/" !== this.routeCtx.path) {
            if (null == this.scrollMap[this.routeCtx.state.id])
                for (this.scrollStack.push(this.routeCtx.state.id); this.scrollStack.length > app.config.history_cache_size; )
                    delete this.scrollMap[this.scrollStack.shift()];
            this.scrollMap[this.routeCtx.state.id] = this.scrollEl.scrollTop
        }
    }
    afterRoute(e, t) {
        switch ("entry" !== e && "type" !== e && resetFavicon(),
        e) {
        case "root":
            this.show(this.rootPage);
            break;
        case "entry":
            this.show(this.entryPage);
            break;
        case "type":
            this.show(this.typePage);
            break;
        case "settings":
            this.show(this.settingsPage);
            break;
        case "offline":
            this.show(this.offlinePage);
            break;
        default:
            this.show(this.staticPage)
        }
        this.view.onRoute(t),
        app.document.setTitle("function" == typeof this.view.getTitle ? this.view.getTitle() : void 0)
    }
    onClick(e) {
        const t = $.closestLink($.eventTarget(e), this.el);
        t && this.isExternalUrl(t.getAttribute("href")) && ($.stopEvent(e),
        $.popup(t))
    }
    onAltF(e) {
        if (!document.activeElement || !$.hasChild(this.el, document.activeElement))
            return this.find("a:not(:empty)")?.focus(),
            $.stopEvent(e)
    }
    findTargetByHash(e) {
        let t = ( () => {
            try {
                return $.id(decodeURIComponent(e))
            } catch (e) {}
        }
        )();
        return t || (t = ( () => {
            try {
                return $.id(e)
            } catch (e) {}
        }
        )()),
        t
    }
    isExternalUrl(e) {
        return e?.startsWith("http:") || e?.startsWith("https:")
    }
}
,
app.views.EntryPage = class e extends app.View {
    static className = "_page";
    static errorClass = "_page-error";
    static events = {
        click: "onClick"
    };
    static shortcuts = {
        altC: "onAltC",
        altO: "onAltO"
    };
    static routes = {
        before: "beforeRoute"
    };
    static LINKS = {
        home: "Homepage",
        code: "Source code"
    };
    init() {
        this.cacheMap = {},
        this.cacheStack = []
    }
    deactivate() {
        super.deactivate(...arguments) && (this.empty(),
        this.entry = null)
    }
    loading() {
        this.empty(),
        this.trigger("loading")
    }
    render(e, t) {
        null == e && (e = ""),
        null == t && (t = !1),
        this.activated && (this.empty(),
        this.subview = new (this.subViewClass())(this.el,this.entry),
        $.batchUpdate(this.el, ( () => {
            this.subview.render(e, t),
            t || this.addCopyButtons()
        }
        )),
        app.disabledDocs.findBy("slug", this.entry.doc.slug) && (this.hiddenView = new app.views.HiddenPage(this.el,this.entry)),
        setFaviconForDoc(this.entry.doc),
        this.delay(this.polyfillMathML),
        this.trigger("loaded"))
    }
    addCopyButtons() {
        for (var e of (this.copyButton || (this.copyButton = document.createElement("button"),
        this.copyButton.innerHTML = '<svg><use xlink:href="#icon-copy"/></svg>',
        this.copyButton.type = "button",
        this.copyButton.className = "_pre-clip",
        this.copyButton.title = "Copy to clipboard",
        this.copyButton.setAttribute("aria-label", "Copy to clipboard")),
        this.findAllByTag("pre")))
            e.appendChild(this.copyButton.cloneNode(!0))
    }
    polyfillMathML() {
        !1 === window.supportsMathML && !this.polyfilledMathML && this.findByTag("math") && (this.polyfilledMathML = !0,
        $.append(document.head, `<link rel="stylesheet" href="${app.config.mathml_stylesheet}">`))
    }
    prepareContent(t) {
        if (!this.entry.isIndex() || !this.entry.doc.links)
            return t;
        return `<p class="_links">${Object.entries(this.entry.doc.links).map(( ([t,s]) => `<a href="${s}" class="_links-link">${e.LINKS[t]}</a>`)).join("")}</p>${t}`
    }
    empty() {
        null != this.subview && this.subview.deactivate(),
        this.subview = null,
        null != this.hiddenView && this.hiddenView.deactivate(),
        this.hiddenView = null,
        this.resetClass(),
        super.empty(...arguments)
    }
    subViewClass() {
        return app.views[`${$.classify(this.entry.doc.type)}Page`] || app.views.BasePage
    }
    getTitle() {
        return this.entry.doc.fullName + (this.entry.isIndex() ? " documentation" : ` / ${this.entry.name}`)
    }
    beforeRoute() {
        this.cache(),
        this.abort()
    }
    onRoute(e) {
        const t = e.entry.filePath() === this.entry?.filePath?.();
        this.entry = e.entry,
        t || this.restore() || this.load()
    }
    load() {
        this.loading(),
        this.xhr = this.entry.loadFile((e => this.onSuccess(e)), ( () => this.onError()))
    }
    abort() {
        this.xhr && (this.xhr.abort(),
        this.xhr = this.entry = null)
    }
    onSuccess(e) {
        this.activated && (this.xhr = null,
        this.render(this.prepareContent(e)))
    }
    onError() {
        this.xhr = null,
        this.render(this.tmpl("pageLoadError")),
        this.resetClass(),
        this.addClass(this.constructor.errorClass),
        null != app.serviceWorker && app.serviceWorker.update()
    }
    cache() {
        let e;
        if (!this.xhr && this.entry && !this.cacheMap[e = this.entry.filePath()])
            for (this.cacheMap[e] = this.el.innerHTML,
            this.cacheStack.push(e); this.cacheStack.length > app.config.history_cache_size; )
                delete this.cacheMap[this.cacheStack.shift()]
    }
    restore() {
        const e = this.entry.filePath();
        if (this.cacheMap[[e]])
            return this.render(this.cacheMap[e], !0),
            !0
    }
    onClick(e) {
        const t = $.eventTarget(e);
        t.hasAttribute("data-retry") ? ($.stopEvent(e),
        this.load()) : t.classList.contains("_pre-clip") && ($.stopEvent(e),
        navigator.clipboard.writeText(t.parentNode.textContent).then(( () => t.classList.add("_pre-clip-success")), ( () => t.classList.add("_pre-clip-error"))),
        setTimeout(( () => t.className = "_pre-clip"), 2e3))
    }
    onAltC() {
        const e = this.find("._attribution:last-child ._attribution-link");
        e && (console.log(e.href + location.hash),
        navigator.clipboard.writeText(e.href + location.hash))
    }
    onAltO() {
        const e = this.find("._attribution:last-child ._attribution-link");
        e && this.delay(( () => $.popup(e.href + location.hash)))
    }
}
,
app.views.OfflinePage = class extends app.View {
    static className = "_static";
    static events = {
        click: "onClick",
        change: "onChange"
    };
    deactivate() {
        super.deactivate(...arguments) && this.empty()
    }
    render() {
        app.cookieBlocked ? this.html(this.tmpl("offlineError", "cookie_blocked")) : app.docs.getInstallStatuses((e => {
            if (this.activated)
                if (!1 === e)
                    this.html(this.tmpl("offlineError", app.db.reason, app.db.error));
                else {
                    let s = "";
                    for (var t of app.docs.all())
                        s += this.renderDoc(t, e[t.slug]);
                    this.html(this.tmpl("offlinePage", s)),
                    this.refreshLinks()
                }
        }
        ))
    }
    renderDoc(e, t) {
        return app.templates.render("offlineDoc", e, t)
    }
    getTitle() {
        return "Offline"
    }
    refreshLinks() {
        for (var e of ["install", "update", "uninstall"])
            this.find(`[data-action-all='${e}']`).classList[this.find(`[data-action='${e}']`) ? "add" : "remove"]("_show")
    }
    docByEl(e) {
        let t;
        for (; !(t = e.getAttribute("data-slug")); )
            e = e.parentNode;
        return app.docs.findBy("slug", t)
    }
    docEl(e) {
        return this.find(`[data-slug='${e.slug}']`)
    }
    onRoute(e) {
        this.render()
    }
    onClick(e) {
        let t, s = $.eventTarget(e);
        if (t = s.getAttribute("data-action")) {
            const e = this.docByEl(s);
            "update" === t && (t = "install"),
            e[t](this.onInstallSuccess.bind(this, e), this.onInstallError.bind(this, e), this.onInstallProgress.bind(this, e)),
            s.parentNode.innerHTML = `${s.textContent.replace(/e$/, "")}ing\u2026`
        } else if (t = s.getAttribute("data-action-all") || s.parentElement.getAttribute("data-action-all")) {
            if ("uninstall" === t && !window.confirm("Uninstall all docs?"))
                return;
            for (s of (app.db.migrate(),
            Array.from(this.findAll(`[data-action='${t}']`))))
                $.click(s)
        }
    }
    onInstallSuccess(e) {
        this.activated && e.getInstallStatus((t => {
            let s;
            this.activated && (s = this.docEl(e)) && (s.outerHTML = this.renderDoc(e, t),
            $.highlight(s, {
                className: "_highlight"
            }),
            this.refreshLinks())
        }
        ))
    }
    onInstallError(e) {
        let t;
        this.activated && (t = this.docEl(e)) && (t.lastElementChild.textContent = "Error")
    }
    onInstallProgress(e, t) {
        let s;
        if (this.activated && t.lengthComputable && (s = this.docEl(e))) {
            const e = Math.round(100 * t.loaded / t.total);
            s.lastElementChild.textContent = s.lastElementChild.textContent.replace(/(\s.+)?$/, ` (${e}%)`)
        }
    }
    onChange(e) {
        "autoUpdate" === e.target.name && app.settings.set("manualUpdate", !e.target.checked)
    }
}
,
app.views.RootPage = class extends app.View {
    static events = {
        click: "onClick"
    };
    init() {
        this.isHidden() || this.setHidden(!1),
        this.render()
    }
    render() {
        this.empty();
        const e = app.isAndroidWebview() ? "androidWarning" : this.isHidden() ? "splash" : app.isMobile() ? "mobileIntro" : "intro";
        this.append(this.tmpl(e))
    }
    hideIntro() {
        this.setHidden(!0),
        this.render()
    }
    setHidden(e) {
        app.settings.set("hideIntro", e)
    }
    isHidden() {
        return app.isSingleDoc() || app.settings.get("hideIntro")
    }
    onRoute() {}
    onClick(e) {
        $.eventTarget(e).hasAttribute("data-hide-intro") && ($.stopEvent(e),
        this.hideIntro())
    }
}
,
app.views.SettingsPage = class extends app.View {
    static className = "_static";
    static events = {
        click: "onClick",
        change: "onChange"
    };
    render() {
        this.html(this.tmpl("settingsPage", this.currentSettings()))
    }
    currentSettings() {
        const e = {};
        for (var t of (e.theme = app.settings.get("theme"),
        e.smoothScroll = !app.settings.get("fastScroll"),
        e.arrowScroll = app.settings.get("arrowScroll"),
        e.noAutofocus = app.settings.get("noAutofocus"),
        e.autoInstall = app.settings.get("autoInstall"),
        e.analyticsConsent = app.settings.get("analyticsConsent"),
        e.spaceScroll = app.settings.get("spaceScroll"),
        e.spaceTimeout = app.settings.get("spaceTimeout"),
        e.noDocSpecificIcon = app.settings.get("noDocSpecificIcon"),
        e.autoSupported = app.settings.autoSupported,
        app.Settings.LAYOUTS))
            e[t] = app.settings.hasLayout(t);
        return e
    }
    getTitle() {
        return "Preferences"
    }
    setTheme(e) {
        app.settings.set("theme", e)
    }
    toggleLayout(e, t) {
        app.settings.setLayout(e, t)
    }
    toggleSmoothScroll(e) {
        app.settings.set("fastScroll", !e)
    }
    toggleAnalyticsConsent(e) {
        app.settings.set("analyticsConsent", e ? "1" : "0"),
        e || resetAnalytics()
    }
    toggleSpaceScroll(e) {
        app.settings.set("spaceScroll", e ? 1 : 0)
    }
    setScrollTimeout(e) {
        return app.settings.set("spaceTimeout", e)
    }
    toggle(e, t) {
        app.settings.set(e, t)
    }
    export() {
        const e = new Blob([JSON.stringify(app.settings.export())],{
            type: "application/json"
        })
          , t = document.createElement("a");
        t.href = URL.createObjectURL(e),
        t.download = "devdocs.json",
        t.style.display = "none",
        document.body.appendChild(t),
        t.click(),
        document.body.removeChild(t)
    }
    import(e, t) {
        if (!e || "application/json" !== e.type)
            return void new app.views.Notif("ImportInvalid",{
                autoHide: !1
            });
        const s = new FileReader;
        s.onloadend = function() {
            const e = ( () => {
                try {
                    return JSON.parse(s.result)
                } catch (e) {}
            }
            )();
            e && e.constructor === Object ? (app.settings.import(e),
            $.trigger(t.form, "import")) : new app.views.Notif("ImportInvalid",{
                autoHide: !1
            })
        }
        ,
        s.readAsText(e)
    }
    onChange(e) {
        const t = e.target;
        switch (t.name) {
        case "theme":
            this.setTheme(t.value);
            break;
        case "layout":
            this.toggleLayout(t.value, t.checked);
            break;
        case "smoothScroll":
            this.toggleSmoothScroll(t.checked);
            break;
        case "import":
            this.import(t.files[0], t);
            break;
        case "analyticsConsent":
            this.toggleAnalyticsConsent(t.checked);
            break;
        case "spaceScroll":
            this.toggleSpaceScroll(t.checked);
            break;
        case "spaceTimeout":
            this.setScrollTimeout(t.value);
            break;
        default:
            this.toggle(t.name, t.checked)
        }
    }
    onClick(e) {
        if ("export" === $.eventTarget(e).getAttribute("data-action"))
            $.stopEvent(e),
            this.export()
    }
    onRoute(e) {
        this.render()
    }
}
,
app.views.StaticPage = class extends app.View {
    static className = "_static";
    static titles = {
        about: "About",
        news: "News",
        help: "User Guide",
        notFound: "404"
    };
    deactivate() {
        super.deactivate(...arguments) && (this.empty(),
        this.page = null)
    }
    render(e) {
        this.page = e,
        this.html(this.tmpl(`${this.page}Page`))
    }
    getTitle() {
        return this.constructor.titles[this.page]
    }
    onRoute(e) {
        this.render(e.page || "notFound")
    }
}
,
app.views.TypePage = class extends app.View {
    static className = "_page";
    deactivate() {
        super.deactivate(...arguments) && (this.empty(),
        this.type = null)
    }
    render(e) {
        this.type = e,
        this.html(this.tmpl("typePage", this.type)),
        setFaviconForDoc(this.type.doc)
    }
    getTitle() {
        return `${this.type.doc.fullName} / ${this.type.name}`
    }
    onRoute(e) {
        this.render(e.type)
    }
}
,
app.views.Document = class extends app.View {
    static el = document;
    static events = {
        visibilitychange: "onVisibilityChange"
    };
    static shortcuts = {
        help: "onHelp",
        preferences: "onPreferences",
        escape: "onEscape",
        superLeft: "onBack",
        superRight: "onForward"
    };
    static routes = {
        after: "afterRoute"
    };
    init() {
        this.menu = new app.views.Menu,
        this.sidebar = new app.views.Sidebar,
        this.addSubview(this.menu, this.addSubview(this.sidebar)),
        app.views.Resizer.isSupported() && (this.resizer = new app.views.Resizer,
        this.addSubview(this.resizer)),
        this.content = new app.views.Content,
        this.addSubview(this.content),
        app.isSingleDoc() || app.isMobile() || (this.path = new app.views.Path,
        this.addSubview(this.path)),
        app.isSingleDoc() || (this.settings = new app.views.Settings),
        $.on(document.body, "click", this.onClick),
        this.activate()
    }
    setTitle(e) {
        return this.el.title = e ? `${e} \u2014 DevDocs` : "DevDocs API Documentation"
    }
    afterRoute(e) {
        "settings" === e ? null != this.settings && this.settings.activate() : null != this.settings && this.settings.deactivate()
    }
    onVisibilityChange() {
        "visible" === this.el.visibilityState && this.delay(( () => {
            app.isMobile() !== app.views.Mobile.detect() && location.reload()
        }
        ), 300)
    }
    onHelp() {
        app.router.show("/help#shortcuts")
    }
    onPreferences() {
        app.router.show("/settings")
    }
    onEscape() {
        const e = app.isSingleDoc() && location.pathname !== app.doc.fullPath() ? app.doc.fullPath() : "/";
        app.router.show(e)
    }
    onBack() {
        history.back()
    }
    onForward() {
        history.forward()
    }
    onClick(e) {
        const t = $.eventTarget(e);
        if (t.hasAttribute("data-behavior"))
            switch ($.stopEvent(e),
            t.getAttribute("data-behavior")) {
            case "back":
                history.back();
                break;
            case "reload":
                window.location.reload();
                break;
            case "reboot":
                app.reboot();
                break;
            case "hard-reload":
                app.reload();
                break;
            case "reset":
                confirm("Are you sure you want to reset DevDocs?") && app.reset();
                break;
            case "accept-analytics":
                Cookies.set("analyticsConsent", "1", {
                    expires: 1e8
                }) && app.reboot();
                break;
            case "decline-analytics":
                Cookies.set("analyticsConsent", "0", {
                    expires: 1e8
                }) && app.reboot()
            }
    }
}
,
app.views.Menu = class extends app.View {
    static el = "._menu";
    static activeClass = "active";
    static events = {
        click: "onClick"
    };
    init() {
        $.on(document.body, "click", (e => this.onGlobalClick(e)))
    }
    onClick(e) {
        const t = $.eventTarget(e);
        "A" === t.tagName && t.blur()
    }
    onGlobalClick(e) {
        1 === e.which && (("function" == typeof e.target.hasAttribute ? e.target.hasAttribute("data-toggle-menu") : void 0) ? this.toggleClass(this.constructor.activeClass) : this.hasClass(this.constructor.activeClass) && this.removeClass(this.constructor.activeClass))
    }
}
,
app.views.Mobile = class extends app.View {
    static className = "_mobile";
    static elements = {
        body: "body",
        content: "._container",
        sidebar: "._sidebar",
        docPicker: "._settings ._sidebar"
    };
    static shortcuts = {
        escape: "onEscape"
    };
    static routes = {
        after: "afterRoute"
    };
    static detect() {
        if (null != Cookies.get("override-mobile-detect"))
            return JSON.parse(Cookies.get("override-mobile-detect"));
        try {
            return window.matchMedia("(max-width: 480px)").matches || window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(max-height: 767px) and (max-width: 1024px)").matches || navigator.userAgent.includes("Android") && navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("IEMobile")
        } catch (e) {
            return !1
        }
    }
    static detectAndroidWebview() {
        try {
            return /(Android).*( Version\/.\.. ).*(Chrome)/.test(navigator.userAgent)
        } catch (e) {
            return !1
        }
    }
    constructor() {
        super(document.documentElement)
    }
    init() {
        $.on($("._search"), "touchend", ( () => this.onTapSearch())),
        this.toggleSidebar = $("button[data-toggle-sidebar]"),
        this.toggleSidebar.removeAttribute("hidden"),
        $.on(this.toggleSidebar, "click", ( () => this.onClickToggleSidebar())),
        this.back = $("button[data-back]"),
        this.back.removeAttribute("hidden"),
        $.on(this.back, "click", ( () => this.onClickBack())),
        this.forward = $("button[data-forward]"),
        this.forward.removeAttribute("hidden"),
        $.on(this.forward, "click", ( () => this.onClickForward())),
        this.docPickerTab = $('button[data-tab="doc-picker"]'),
        this.docPickerTab.removeAttribute("hidden"),
        $.on(this.docPickerTab, "click", (e => this.onClickDocPickerTab(e))),
        this.settingsTab = $('button[data-tab="settings"]'),
        this.settingsTab.removeAttribute("hidden"),
        $.on(this.settingsTab, "click", (e => this.onClickSettingsTab(e))),
        app.document.sidebar.search.on("searching", ( () => this.showSidebar())),
        this.activate()
    }
    showSidebar() {
        let e;
        if (this.isSidebarShown())
            window.scrollTo(0, 0);
        else if (this.contentTop = window.scrollY,
        this.content.style.display = "none",
        this.sidebar.style.display = "block",
        e = this.findByClass(app.views.ListSelect.activeClass)) {
            const t = window.scrollY === this.body.scrollTop ? this.body : document.documentElement;
            $.scrollTo(e, t, "center")
        } else
            window.scrollTo(0, this.findByClass(app.views.ListFold.activeClass) && this.sidebarTop || 0)
    }
    hideSidebar() {
        this.isSidebarShown() && (this.sidebarTop = window.scrollY,
        this.sidebar.style.display = "none",
        this.content.style.display = "block",
        window.scrollTo(0, this.contentTop || 0))
    }
    isSidebarShown() {
        return "none" !== this.sidebar.style.display
    }
    onClickBack() {
        return history.back()
    }
    onClickForward() {
        return history.forward()
    }
    onClickToggleSidebar() {
        this.isSidebarShown() ? this.hideSidebar() : this.showSidebar()
    }
    onClickDocPickerTab(e) {
        $.stopEvent(e),
        this.showDocPicker()
    }
    onClickSettingsTab(e) {
        $.stopEvent(e),
        this.showSettings()
    }
    showDocPicker() {
        window.scrollTo(0, 0),
        this.docPickerTab.classList.add("active"),
        this.settingsTab.classList.remove("active"),
        this.docPicker.style.display = "block",
        this.content.style.display = "none"
    }
    showSettings() {
        window.scrollTo(0, 0),
        this.docPickerTab.classList.remove("active"),
        this.settingsTab.classList.add("active"),
        this.docPicker.style.display = "none",
        this.content.style.display = "block"
    }
    onTapSearch() {
        return window.scrollTo(0, 0)
    }
    onEscape() {
        return this.hideSidebar()
    }
    afterRoute(e) {
        this.hideSidebar(),
        "settings" === e ? this.showDocPicker() : this.content.style.display = "block",
        page.canGoBack() ? this.back.removeAttribute("disabled") : this.back.setAttribute("disabled", "disabled"),
        page.canGoForward() ? this.forward.removeAttribute("disabled") : this.forward.setAttribute("disabled", "disabled")
    }
}
,
app.views.Path = class extends app.View {
    static className = "_path";
    static attributes = {
        role: "complementary"
    };
    static events = {
        click: "onClick"
    };
    static routes = {
        after: "afterRoute"
    };
    render(...e) {
        this.html(this.tmpl("path", ...e)),
        this.show()
    }
    show() {
        this.el.parentNode || this.prependTo(app.el)
    }
    hide() {
        this.el.parentNode && $.remove(this.el)
    }
    onClick(e) {
        let t;
        (t = $.closestLink(e.target, this.el)) && (this.clicked = !0)
    }
    afterRoute(e, t) {
        t.type ? this.render(t.doc, t.type) : t.entry ? t.entry.isIndex() ? this.render(t.doc) : this.render(t.doc, t.entry.getType(), t.entry) : this.hide(),
        this.clicked && (this.clicked = null,
        app.document.sidebar.reset())
    }
}
,
app.views.Resizer = class e extends app.View {
    static className = "_resizer";
    static events = {
        dragstart: "onDragStart",
        dragend: "onDragEnd"
    };
    static MIN = 260;
    static MAX = 600;
    static isSupported() {
        return "ondragstart"in document.createElement("div") && !app.isMobile()
    }
    init() {
        this.el.setAttribute("draggable", "true"),
        this.appendTo($("._app"))
    }
    resize(t, s) {
        if (!((t -= app.el.offsetLeft) > 0))
            return;
        const a = `${t = Math.min(Math.max(Math.round(t), e.MIN), e.MAX)}px`;
        document.documentElement.style.setProperty("--sidebarWidth", a),
        s && app.settings.setSize(t)
    }
    onDragStart(e) {
        e.dataTransfer.effectAllowed = "link",
        e.dataTransfer.setData("Text", ""),
        this.onDrag = this.onDrag.bind(this),
        $.on(window, "dragover", this.onDrag)
    }
    onDrag(e) {
        const t = e.pageX;
        t > 0 && (this.lastDragValue = t,
        this.lastDrag && this.lastDrag > Date.now() - 50 || (this.lastDrag = Date.now(),
        this.resize(t, !1)))
    }
    onDragEnd(e) {
        $.off(window, "dragover", this.onDrag);
        let t = e.pageX || e.screenX - window.screenX;
        !this.lastDragValue || this.lastDragValue - 5 < t && t < this.lastDragValue + 5 || (t = this.lastDragValue),
        this.resize(t, !0)
    }
}
,
app.views.Settings = class e extends app.View {
    static SIDEBAR_HIDDEN_LAYOUT = "_sidebar-hidden";
    static el = "._settings";
    static elements = {
        sidebar: "._sidebar",
        saveBtn: 'button[type="submit"]',
        backBtn: "button[data-back]"
    };
    static events = {
        import: "onImport",
        change: "onChange",
        submit: "onSubmit",
        click: "onClick"
    };
    static shortcuts = {
        enter: "onEnter"
    };
    init() {
        this.addSubview(this.docPicker = new app.views.DocPicker)
    }
    activate() {
        super.activate(...arguments) && (this.render(),
        document.body.classList.remove(e.SIDEBAR_HIDDEN_LAYOUT))
    }
    deactivate() {
        super.deactivate(...arguments) && (this.resetClass(),
        this.docPicker.detach(),
        app.settings.hasLayout(e.SIDEBAR_HIDDEN_LAYOUT) && document.body.classList.add(e.SIDEBAR_HIDDEN_LAYOUT))
    }
    render() {
        this.docPicker.appendTo(this.sidebar),
        this.refreshElements(),
        this.addClass("_in")
    }
    save(e) {
        if (null == e && (e = {}),
        !this.saving) {
            let t;
            this.saving = !0,
            e.import ? t = app.settings.getDocs() : (t = this.docPicker.getSelectedDocs(),
            app.settings.setDocs(t)),
            this.saveBtn.textContent = "Saving\u2026";
            new app.collections.Docs(( () => {
                const e = [];
                for (var s of app.docs.all())
                    t.includes(s.slug) || e.push(s);
                return e
            }
            )()).uninstall(( () => (app.db.migrate(),
            app.reload())))
        }
    }
    onChange() {
        this.addClass("_dirty")
    }
    onEnter() {
        this.save()
    }
    onSubmit(e) {
        e.preventDefault(),
        this.save()
    }
    onImport() {
        this.addClass("_dirty"),
        this.save({
            import: !0
        })
    }
    onClick(e) {
        1 === e.which && e.target === this.backBtn && ($.stopEvent(e),
        app.router.show("/"))
    }
}
,
app.views.ListFocus = class extends app.View {
    static activeClass = "focus";
    static events = {
        click: "onClick"
    };
    static shortcuts = {
        up: "onUp",
        down: "onDown",
        left: "onLeft",
        enter: "onEnter",
        superEnter: "onSuperEnter",
        escape: "blur"
    };
    constructor(e) {
        super(e),
        this.focusOnNextFrame = e => requestAnimationFrame(( () => this.focus(e)))
    }
    focus(e, t) {
        null == t && (t = {}),
        e && !e.classList.contains(this.constructor.activeClass) && (this.blur(),
        e.classList.add(this.constructor.activeClass),
        !0 !== t.silent && $.trigger(e, "focus"))
    }
    blur() {
        let e;
        (e = this.getCursor()) && (e.classList.remove(this.constructor.activeClass),
        $.trigger(e, "blur"))
    }
    getCursor() {
        return this.findByClass(this.constructor.activeClass) || this.findByClass(app.views.ListSelect.activeClass)
    }
    findNext(e) {
        let t;
        if (t = e.nextSibling) {
            if ("A" === t.tagName)
                return t;
            if ("SPAN" === t.tagName)
                return $.click(t),
                this.findNext(e);
            if ("DIV" === t.tagName)
                return e.className.includes(" open") && this.findFirst(t) || this.findNext(t);
            if ("H6" === t.tagName)
                return this.findNext(t)
        } else if (e.parentNode !== this.el)
            return this.findNext(e.parentNode)
    }
    findFirst(e) {
        let t;
        if (t = e.firstChild)
            return "A" === t.tagName ? t : "SPAN" === t.tagName ? ($.click(t),
            this.findFirst(e)) : void 0
    }
    findPrev(e) {
        let t;
        if (t = e.previousSibling) {
            if ("A" === t.tagName)
                return t;
            if ("SPAN" === t.tagName)
                return $.click(t),
                this.findPrev(e);
            if ("DIV" === t.tagName)
                return t.previousSibling.className.includes("open") && this.findLast(t) || this.findPrev(t);
            if ("H6" === t.tagName)
                return this.findPrev(t)
        } else if (e.parentNode !== this.el)
            return this.findPrev(e.parentNode)
    }
    findLast(e) {
        let t;
        if (t = e.lastChild)
            return "A" === t.tagName ? t : "SPAN" === t.tagName || "H6" === t.tagName ? this.findPrev(t) : "DIV" === t.tagName ? this.findLast(t) : void 0
    }
    onDown() {
        let e;
        (e = this.getCursor()) ? this.focusOnNextFrame(this.findNext(e)) : this.focusOnNextFrame(this.findByTag("a"))
    }
    onUp() {
        let e;
        (e = this.getCursor()) ? this.focusOnNextFrame(this.findPrev(e)) : this.focusOnNextFrame(this.findLastByTag("a"))
    }
    onLeft() {
        const e = this.getCursor();
        if (e && !e.classList.contains(app.views.ListFold.activeClass) && e.parentNode !== this.el) {
            const t = e.parentNode.previousSibling;
            t && t.classList.contains(app.views.ListFold.targetClass) && this.focusOnNextFrame(e.parentNode.previousSibling)
        }
    }
    onEnter() {
        let e;
        (e = this.getCursor()) && $.click(e)
    }
    onSuperEnter() {
        let e;
        (e = this.getCursor()) && $.popup(e)
    }
    onClick(e) {
        if (1 !== e.which || e.metaKey || e.ctrlKey)
            return;
        const t = $.eventTarget(e);
        "A" === t.tagName && this.focus(t, {
            silent: !0
        })
    }
}
,
app.views.ListFold = class extends app.View {
    static targetClass = "_list-dir";
    static handleClass = "_list-arrow";
    static activeClass = "open";
    static events = {
        click: "onClick"
    };
    static shortcuts = {
        left: "onLeft",
        right: "onRight"
    };
    open(e) {
        e && !e.classList.contains(this.constructor.activeClass) && (e.classList.add(this.constructor.activeClass),
        $.trigger(e, "open"))
    }
    close(e) {
        e && e.classList.contains(this.constructor.activeClass) && (e.classList.remove(this.constructor.activeClass),
        $.trigger(e, "close"))
    }
    toggle(e) {
        e.classList.contains(this.constructor.activeClass) ? this.close(e) : this.open(e)
    }
    reset() {
        let e;
        for (; e = this.findByClass(this.constructor.activeClass); )
            this.close(e)
    }
    getCursor() {
        return this.findByClass(app.views.ListFocus.activeClass) || this.findByClass(app.views.ListSelect.activeClass)
    }
    onLeft() {
        const e = this.getCursor();
        e?.classList?.contains(this.constructor.activeClass) && this.close(e)
    }
    onRight() {
        const e = this.getCursor();
        (null != e ? e.classList.contains(this.constructor.targetClass) : void 0) && this.open(e)
    }
    onClick(e) {
        if (1 !== e.which || e.metaKey || e.ctrlKey)
            return;
        if (!e.pageY)
            return;
        let t = $.eventTarget(e);
        "SVG" === t.parentNode.tagName.toUpperCase() && (t = t.parentNode),
        t.classList.contains(this.constructor.handleClass) ? ($.stopEvent(e),
        this.toggle(t.parentNode)) : t.classList.contains(this.constructor.targetClass) && (t.hasAttribute("href") ? t.classList.contains(this.constructor.activeClass) ? t.classList.contains(app.views.ListSelect.activeClass) && this.close(t) : this.open(t) : this.toggle(t))
    }
}
,
app.views.ListSelect = class extends app.View {
    static activeClass = "active";
    static events = {
        click: "onClick"
    };
    deactivate() {
        super.deactivate(...arguments) && this.deselect()
    }
    select(e) {
        this.deselect(),
        e && (e.classList.add(this.constructor.activeClass),
        $.trigger(e, "select"))
    }
    deselect() {
        let e;
        (e = this.getSelection()) && (e.classList.remove(this.constructor.activeClass),
        $.trigger(e, "deselect"))
    }
    selectByHref(e) {
        this.getSelection()?.getAttribute("href") !== e && this.select(this.find(`a[href='${e}']`))
    }
    selectCurrent() {
        this.selectByHref(location.pathname + location.hash)
    }
    getSelection() {
        return this.findByClass(this.constructor.activeClass)
    }
    onClick(e) {
        if (1 !== e.which || e.metaKey || e.ctrlKey)
            return;
        const t = $.eventTarget(e);
        "A" === t.tagName && this.select(t)
    }
}
,
app.views.PaginatedList = class e extends app.View {
    static PER_PAGE = app.config.max_results;
    constructor(e) {
        super(),
        this.data = e,
        this.constructor.events = this.constructor.events || {},
        null == this.constructor.events.click && (this.constructor.events.click = "onClick")
    }
    renderPaginated() {
        this.page = 0,
        this.totalPages() > 1 ? this.paginateNext() : this.html(this.renderAll())
    }
    renderAll() {
        return this.render(this.data)
    }
    renderPage(t) {
        return this.render(this.data.slice((t - 1) * e.PER_PAGE, t * e.PER_PAGE))
    }
    renderPageLink(e) {
        return this.tmpl("sidebarPageLink", e)
    }
    renderPrevLink(t) {
        return this.renderPageLink((t - 1) * e.PER_PAGE)
    }
    renderNextLink(t) {
        return this.renderPageLink(this.data.length - t * e.PER_PAGE)
    }
    totalPages() {
        return Math.ceil(this.data.length / e.PER_PAGE)
    }
    paginate(e) {
        $.lockScroll(e.nextSibling || e.previousSibling, ( () => {
            $.batchUpdate(this.el, ( () => {
                e.nextSibling ? this.paginatePrev(e) : this.paginateNext(e)
            }
            ))
        }
        ))
    }
    paginateNext() {
        this.el.lastChild && this.remove(this.el.lastChild),
        this.page >= 2 && this.hideTopPage(),
        this.page++,
        this.append(this.renderPage(this.page)),
        this.page < this.totalPages() && this.append(this.renderNextLink(this.page))
    }
    paginatePrev() {
        this.remove(this.el.firstChild),
        this.hideBottomPage(),
        this.page--,
        this.prepend(this.renderPage(this.page - 1)),
        this.page >= 3 && this.prepend(this.renderPrevLink(this.page - 1))
    }
    paginateTo(t) {
        const s = this.data.indexOf(t);
        if (s >= e.PER_PAGE)
            for (let t = 0, a = Math.floor(s / e.PER_PAGE); t < a; t++)
                this.paginateNext()
    }
    hideTopPage() {
        for (let t = 0, s = this.page <= 2 ? e.PER_PAGE : e.PER_PAGE + 1; t < s; t++)
            this.remove(this.el.firstChild);
        this.prepend(this.renderPrevLink(this.page))
    }
    hideBottomPage() {
        for (let t = 0, s = this.page === this.totalPages() ? this.data.length % e.PER_PAGE || e.PER_PAGE : e.PER_PAGE + 1; t < s; t++)
            this.remove(this.el.lastChild);
        this.append(this.renderNextLink(this.page - 1))
    }
    onClick(e) {
        const t = $.eventTarget(e);
        "SPAN" === t.tagName && ($.stopEvent(e),
        this.paginate(t))
    }
}
,
app.views.Notif = class e extends app.View {
    static className = "_notif";
    static activeClass = "_in";
    static attributes = {
        role: "alert"
    };
    static defaultOptions = {
        autoHide: 15e3
    };
    static events = {
        click: "onClick"
    };
    constructor(e, t) {
        super(),
        this.type = e,
        this.options = {
            ...this.constructor.defaultOptions,
            ...t || {}
        },
        this.init0(),
        this.refreshElements()
    }
    init0() {
        this.show()
    }
    show() {
        this.timeout ? (clearTimeout(this.timeout),
        this.timeout = this.delay(this.hide, this.options.autoHide)) : (this.render(),
        this.position(),
        this.activate(),
        this.appendTo(document.body),
        this.el.offsetWidth,
        this.addClass(this.constructor.activeClass),
        this.options.autoHide && (this.timeout = this.delay(this.hide, this.options.autoHide)))
    }
    hide() {
        clearTimeout(this.timeout),
        this.timeout = null,
        this.detach()
    }
    render() {
        this.html(this.tmpl(`notif${this.type}`))
    }
    position() {
        const t = $$(`.${e.className}`);
        if (t.length) {
            const e = t[t.length - 1];
            this.el.style.top = e.offsetTop + e.offsetHeight + 16 + "px"
        }
    }
    onClick(e) {
        if (1 !== e.which)
            return;
        const t = $.eventTarget(e);
        t.hasAttribute("data-behavior") || ("A" !== t.tagName || t.classList.contains("_notif-close")) && ($.stopEvent(e),
        this.hide())
    }
}
,
app.views.News = class extends app.views.Notif {
    static className = "_notif _notif-news";
    static defaultOptions = {
        autoHide: 3e4
    };
    init0() {
        this.unreadNews = this.getUnreadNews(),
        this.unreadNews.length && this.show(),
        this.markAllAsRead()
    }
    render() {
        this.html(app.templates.notifNews(this.unreadNews))
    }
    getUnreadNews() {
        const e = this.getLastReadTime();
        if (!e)
            return [];
        const t = [];
        for (var s of app.news) {
            if (new Date(s[0]).getTime() <= e)
                break;
            t.push(s)
        }
        return t
    }
    getLastNewsTime() {
        return new Date(app.news[0][0]).getTime()
    }
    getLastReadTime() {
        return app.settings.get("news")
    }
    markAllAsRead() {
        app.settings.set("news", this.getLastNewsTime())
    }
}
,
app.views.Notice = class extends app.View {
    static className = "_notice";
    static attributes = {
        role: "alert"
    };
    constructor(e, ...t) {
        super(),
        this.type = e,
        this.args = t || [],
        this.init0(),
        this.refreshElements()
    }
    init0() {
        this.activate()
    }
    activate() {
        super.activate(...arguments) && this.show()
    }
    deactivate() {
        super.deactivate(...arguments) && this.hide()
    }
    show() {
        this.html(this.tmpl(`${this.type}Notice`, ...this.args)),
        this.prependTo(app.el)
    }
    hide() {
        $.remove(this.el)
    }
}
,
app.views.Tip = class extends app.views.Notif {
    static className = "_notif _notif-tip";
    static defautOptions = {
        autoHide: !1
    };
    render() {
        this.html(this.tmpl(`tip${this.type}`))
    }
}
,
app.views.Updates = class extends app.views.Notif {
    static className = "_notif _notif-news";
    static defautOptions = {
        autoHide: 3e4
    };
    init0() {
        this.lastUpdateTime = this.getLastUpdateTime(),
        this.updatedDocs = this.getUpdatedDocs(),
        this.updatedDisabledDocs = this.getUpdatedDisabledDocs(),
        (this.updatedDocs.length > 0 || this.updatedDisabledDocs.length > 0) && this.show(),
        this.markAllAsRead()
    }
    render() {
        this.html(app.templates.notifUpdates(this.updatedDocs, this.updatedDisabledDocs))
    }
    getUpdatedDocs() {
        return this.lastUpdateTime ? Array.from(app.docs.all()).filter((e => e.mtime > this.lastUpdateTime)) : []
    }
    getUpdatedDisabledDocs() {
        if (!this.lastUpdateTime)
            return [];
        const e = [];
        for (var t of Array.from(app.disabledDocs.all()))
            t.mtime > this.lastUpdateTime && app.docs.findBy("slug_without_version", t.slug_without_version) && e.push(t);
        return e
    }
    getLastUpdateTime() {
        return app.settings.get("version")
    }
    markAllAsRead() {
        app.settings.set("version", "production" === app.config.env ? app.config.version : Math.floor(Date.now() / 1e3))
    }
}
,
app.views.BasePage = class extends app.View {
    constructor(e, t) {
        super(e),
        this.entry = t
    }
    deactivate() {
        if (super.deactivate(...arguments))
            return this.highlightNodes = []
    }
    render(e, t) {
        null == t && (t = !1),
        this.highlightNodes = [],
        this.previousTiming = null,
        this.constructor.className || this.addClass(`_${this.entry.doc.type}`),
        this.html(e),
        t || this.highlightCode(),
        this.activate(),
        this.afterRender && this.delay(this.afterRender),
        this.highlightNodes.length > 0 && requestAnimationFrame(( () => this.paintCode()))
    }
    highlightCode() {
        for (var e of this.findAll("pre[data-language]")) {
            var t = e.getAttribute("data-language");
            e.classList.add(`language-${t}`),
            this.highlightNodes.push(e)
        }
    }
    paintCode(e) {
        for (var t of (this.previousTiming ? Math.round(1e3 / (e - this.previousTiming)) > 50 ? this.nodesPerFrame = Math.round(Math.min(1.25 * this.nodesPerFrame, 50)) : this.nodesPerFrame = Math.round(Math.max(.8 * this.nodesPerFrame, 10)) : this.nodesPerFrame = 10,
        this.highlightNodes.splice(0, this.nodesPerFrame))) {
            var s;
            (s = t.lastElementChild) && $.remove(s),
            Prism.highlightElement(t),
            s && $.append(t, s)
        }
        this.highlightNodes.length > 0 && requestAnimationFrame(( () => this.paintCode())),
        this.previousTiming = e
    }
}
,
app.views.HiddenPage = class extends app.View {
    static events = {
        click: "onClick"
    };
    constructor(e, t) {
        super(e),
        this.entry = t
    }
    init() {
        this.notice = new app.views.Notice("disabledDoc"),
        this.addSubview(this.notice),
        this.activate()
    }
    onClick(e) {
        let t;
        (t = $.closestLink(e.target, this.el)) && ($.stopEvent(e),
        $.popup(t))
    }
}
,
app.views.JqueryPage = class e extends app.views.BasePage {
    static demoClassName = "_jquery-demo";
    afterRender() {
        for (var e of this.findAllByTag("iframe"))
            e.style.display = "none",
            this.onIframeLoaded = this.onIframeLoaded.bind(this),
            $.on(e, "load", this.onIframeLoaded);
        return this.runExamples()
    }
    onIframeLoaded(e) {
        e.target.style.display = "",
        $.off(e.target, "load", this.onIframeLoaded)
    }
    runExamples() {
        for (var e of this.findAllByClass("entry-example"))
            try {
                this.runExample(e)
            } catch (e) {}
    }
    runExample(t) {
        let s;
        const a = t.getElementsByClassName("syntaxhighlighter")[0];
        if (!a || -1 === a.innerHTML.indexOf("!doctype"))
            return;
        (s = t.getElementsByClassName(e.demoClassName)[0]) || (s = document.createElement("iframe"),
        s.className = e.demoClassName,
        s.width = "100%",
        s.height = 200,
        t.appendChild(s));
        const n = s.contentDocument;
        n.write(this.fixIframeSource(a.textContent)),
        n.close()
    }
    fixIframeSource(e) {
        return (e = (e = e.replace('"/resources/', '"https://api.jquery.com/resources/')).replace("</head>", "<style>\n  html, body { border: 0; margin: 0; padding: 0; }\n  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }\n</style>\n<script>\n  $.ajaxPrefilter(function(opt, opt2, xhr) {\n    if (opt.url.indexOf('http') !== 0) {\n      xhr.abort();\n      document.body.innerHTML = \"<p><strong>This demo cannot run inside DevDocs.</strong></p>\";\n    }\n  });\n</script>\n</head>")).replace(/<script>/gi, '<script nonce="devdocs">')
    }
}
,
app.views.RdocPage = class extends app.views.BasePage {
    static events = {
        click: "onClick"
    };
    onClick(e) {
        if (!e.target.classList.contains("method-click-advice"))
            return;
        $.stopEvent(e);
        const t = $(".method-source-code", e.target.closest(".method-detail"))
          , s = "block" === t.style.display;
        return t.style.display = s ? "none" : "block",
        e.target.textContent = s ? "Show source" : "Hide source"
    }
}
,
app.views.SqlitePage = class extends app.views.BasePage {
    static events = {
        click: "onClick"
    };
    onClick(e) {
        let t, s;
        (s = e.target.getAttribute("data-toggle")) && (t = this.find(`#${s}`)) && ($.stopEvent(e),
        "none" === t.style.display ? (t.style.display = "block",
        e.target.textContent = "hide") : (t.style.display = "none",
        e.target.textContent = "show"))
    }
}
,
app.views.SupportTablesPage = class extends app.views.BasePage {
    static events = {
        click: "onClick"
    };
    onClick(e) {
        if (!e.target.classList.contains("show-all"))
            return;
        $.stopEvent(e);
        let t = e.target;
        for (; "TABLE" !== t.tagName; )
            t = t.parentNode;
        t.classList.add("show-all")
    }
}
,
app.views.Search = class e extends app.View {
    static SEARCH_PARAM = app.config.search_param;
    static el = "._search";
    static activeClass = "_search-active";
    static elements = {
        input: "._search-input",
        resetLink: "._search-clear"
    };
    static events = {
        input: "onInput",
        click: "onClick",
        submit: "onSubmit"
    };
    static shortcuts = {
        typing: "focus",
        altG: "google",
        altS: "stackoverflow",
        altD: "duckduckgo"
    };
    static routes = {
        after: "afterRoute"
    };
    static HASH_RGX = new RegExp(`^#${e.SEARCH_PARAM}=(.*)`);
    init() {
        this.addSubview(this.scope = new app.views.SearchScope(this.el)),
        this.searcher = new app.Searcher,
        this.searcher.on("results", (e => this.onResults(e))).on("end", ( () => this.onEnd())),
        this.scope.on("change", ( () => this.onScopeChange())),
        app.on("ready", ( () => this.onReady())),
        $.on(window, "hashchange", ( () => this.searchUrl())),
        $.on(window, "focus", (e => this.onWindowFocus(e)))
    }
    focus() {
        document.activeElement !== this.input && (app.settings.get("noAutofocus") || this.input.focus())
    }
    autoFocus() {
        app.isMobile() || $.isAndroid() || $.isIOS() || "INPUT" !== document.activeElement?.tagName && (app.settings.get("noAutofocus") || this.input.focus())
    }
    onWindowFocus(e) {
        if (e.target === window)
            return this.autoFocus()
    }
    getScopeDoc() {
        if (this.scope.isActive())
            return this.scope.getScope()
    }
    reset(e) {
        !e && this.input.value || this.scope.reset(),
        this.el.reset(),
        this.onInput(),
        this.autoFocus()
    }
    onReady() {
        this.value = "",
        this.delay(this.onInput)
    }
    onInput() {
        null != this.value && this.value !== this.input.value && (this.value = this.input.value,
        this.value.length ? this.search() : this.clear())
    }
    search(e) {
        null == e && (e = !1),
        this.addClass(this.constructor.activeClass),
        this.trigger("searching"),
        this.hasResults = null,
        this.flags = {
            urlSearch: e,
            initialResults: !0
        },
        this.searcher.find(this.scope.getScope().entries.all(), "text", this.value)
    }
    searchUrl() {
        let e;
        if ("/" === location.pathname)
            this.scope.searchUrl();
        else if (!app.router.isIndex())
            return;
        if (e = this.extractHashValue())
            return this.input.value = this.value = e,
            this.input.setSelectionRange(e.length, e.length),
            this.search(!0),
            !0
    }
    clear() {
        this.removeClass(this.constructor.activeClass),
        this.trigger("clear")
    }
    externalSearch(e) {
        let t;
        (t = this.value) && (this.scope.name() && (t = `${this.scope.name()} ${t}`),
        $.popup(`${e}${encodeURIComponent(t)}`),
        this.reset())
    }
    google() {
        this.externalSearch("https://www.google.com/search?q=")
    }
    stackoverflow() {
        this.externalSearch("https://stackoverflow.com/search?q=")
    }
    duckduckgo() {
        this.externalSearch("https://duckduckgo.com/?t=devdocs&q=")
    }
    onResults(e) {
        e.length && (this.hasResults = !0),
        this.trigger("results", e, this.flags),
        this.flags.initialResults = !1
    }
    onEnd() {
        this.hasResults || this.trigger("noresults")
    }
    onClick(e) {
        e.target === this.resetLink && ($.stopEvent(e),
        this.reset())
    }
    onSubmit(e) {
        $.stopEvent(e)
    }
    onScopeChange() {
        this.value = "",
        this.onInput()
    }
    afterRoute(e, t) {
        "escape" !== app.shortcuts.eventInProgress?.name && (!t.init && app.router.isIndex() && this.reset(!0),
        t.hash && this.delay(this.searchUrl),
        requestAnimationFrame(( () => this.autoFocus())))
    }
    extractHashValue() {
        const e = this.getHashValue();
        if (null != e)
            return app.router.replaceHash(),
            e
    }
    getHashValue() {
        try {
            return e.HASH_RGX.exec($.urlDecode(location.hash))?.[1]
        } catch (e) {}
    }
}
,
app.views.SearchScope = class e extends app.View {
    static SEARCH_PARAM = app.config.search_param;
    static elements = {
        input: "._search-input",
        tag: "._search-tag"
    };
    static events = {
        click: "onClick",
        keydown: "onKeydown",
        textInput: "onTextInput"
    };
    static routes = {
        after: "afterRoute"
    };
    static HASH_RGX = new RegExp(`^#${e.SEARCH_PARAM}=(.+?) .`);
    init() {
        // Đảm bảo this.input tồn tại trước khi sử dụng
        if (!this.input) {
            return;
        }
        
        this.placeholder = this.input.getAttribute("placeholder");
        this.searcher = new app.SynchronousSearcher({
            fuzzy_min_length: 2,
            max_results: 1
        });
        this.searcher.on("results", (e) => this.onResults(e));
    }
    getScope() {
        return this.doc || app
    }
    isActive() {
        return !!this.doc
    }
    name() {
        return this.doc?.name
    }
    search(e, t) {
        null == t && (t = !1),
        this.doc || (this.searcher.find(app.docs.all(), "text", e),
        !this.doc && t && this.searcher.find(app.disabledDocs.all(), "text", e))
    }
    searchUrl() {
        let e;
        (e = this.extractHashValue()) && this.search(e, !0)
    }
    onResults(e) {
        let t;
        (t = e[0]) && (app.docs.contains(t) ? this.selectDoc(t) : this.redirectToDoc(t))
    }
    selectDoc(e) {
        const t = this.doc;
        e !== t && (this.doc = e,
        this.tag.textContent = e.fullName,
        this.tag.style.display = "block",
        this.input.removeAttribute("placeholder"),
        this.input.value = this.input.value.slice(this.input.selectionStart),
        this.input.style.paddingLeft = this.tag.offsetWidth + 10 + "px",
        $.trigger(this.input, "input"),
        this.trigger("change", this.doc, t))
    }
    redirectToDoc(e) {
        const {hash: t} = location;
        app.router.replaceHash(""),
        location.assign(e.fullPath() + t)
    }
    reset() {
        if (!this.doc)
            return;
        const e = this.doc;
        this.doc = null,
        this.tag.textContent = "",
        this.tag.style.display = "none",
        this.input.setAttribute("placeholder", this.placeholder),
        this.input.style.paddingLeft = "",
        this.trigger("change", null, e)
    }
    doScopeSearch(e) {
        this.search(this.input.value.slice(0, this.input.selectionStart)),
        this.doc && $.stopEvent(e)
    }
    onClick(e) {
        e.target === this.tag && (this.reset(),
        $.stopEvent(e))
    }
    onKeydown(e) {
        if (8 === e.which)
            this.doc && 0 === this.input.selectionEnd && (this.reset(),
            $.stopEvent(e));
        else if (!this.doc && this.input.value && !$.isChromeForAndroid()) {
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)
                return;
            (9 === e.which || 32 === e.which && app.isMobile()) && this.doScopeSearch(e)
        }
    }
    onTextInput(e) {
        $.isChromeForAndroid() && !this.doc && this.input.value && " " === e.data && this.doScopeSearch(e)
    }
    extractHashValue() {
        let t;
        if (t = this.getHashValue()) {
            const s = $.urlDecode(location.hash).replace(`#${e.SEARCH_PARAM}=${t} `, `#${e.SEARCH_PARAM}=`);
            return app.router.replaceHash(s),
            t
        }
    }
    getHashValue() {
        try {
            return e.HASH_RGX.exec($.urlDecode(location.hash))?.[1]
        } catch (e) {}
    }
    afterRoute(e, t) {
        !app.isSingleDoc() && t.init && t.doc && this.selectDoc(t.doc)
    }
}
,
app.views.DocList = class extends app.View {
    static className = "_list";
    static attributes = {
        role: "navigation"
    };
    static events = {
        open: "onOpen",
        close: "onClose",
        click: "onClick"
    };
    static routes = {
        after: "afterRoute"
    };
    static elements = {
        disabledTitle: "._list-title",
        disabledList: "._disabled-list"
    };
    init() {
        this.lists = {},
        this.addSubview(this.listFocus = new app.views.ListFocus(this.el)),
        this.addSubview(this.listFold = new app.views.ListFold(this.el)),
        this.addSubview(this.listSelect = new app.views.ListSelect(this.el)),
        app.on("ready", ( () => this.render()))
    }
    activate() {
        if (super.activate(...arguments)) {
            for (var e in this.lists) {
                this.lists[e].activate()
            }
            this.listSelect.selectCurrent()
        }
    }
    deactivate() {
        if (super.deactivate(...arguments))
            for (var e in this.lists) {
                this.lists[e].deactivate()
            }
    }
    render() {
        let e = "";
        for (var t of app.docs.all())
            e += this.tmpl("sidebarDoc", t, {
                fullName: app.docs.countAllBy("name", t.name) > 1
            });
        this.html(e),
        app.isSingleDoc() || 0 === app.disabledDocs.size() || this.renderDisabled()
    }
    renderDisabled() {
        this.append(this.tmpl("sidebarDisabled", {
            count: app.disabledDocs.size()
        })),
        this.refreshElements(),
        this.renderDisabledList()
    }
    renderDisabledList() {
        app.settings.get("hideDisabled") ? this.removeDisabledList() : this.appendDisabledList()
    }
    appendDisabledList() {
        let e, t = "";
        const s = [].concat(...app.disabledDocs.all() || []);
        for (; e = s.shift(); )
            if (null != e.version) {
                for (var a = ""; a += this.tmpl("sidebarDoc", e, {
                    disabled: !0
                }),
                s[0]?.name === e.name; )
                    e = s.shift();
                t += this.tmpl("sidebarDisabledVersionedDoc", e, a)
            } else
                t += this.tmpl("sidebarDoc", e, {
                    disabled: !0
                });
        this.append(this.tmpl("sidebarDisabledList", t)),
        this.disabledTitle.classList.add("open-title"),
        this.refreshElements()
    }
    removeDisabledList() {
        this.disabledList && $.remove(this.disabledList),
        this.disabledTitle.classList.remove("open-title"),
        this.refreshElements()
    }
    reset(e) {
        null == e && (e = {}),
        this.listSelect.deselect(),
        null != this.listFocus && this.listFocus.blur(),
        this.listFold.reset(),
        (e.revealCurrent || app.isSingleDoc()) && this.revealCurrent()
    }
    onOpen(e) {
        $.stopEvent(e);
        const t = app.docs.findBy("slug", e.target.getAttribute("data-slug"));
        t && !this.lists[t.slug] && (this.lists[t.slug] = t.types.isEmpty() ? new app.views.EntryList(t.entries.all()) : new app.views.TypeList(t),
        $.after(e.target, this.lists[t.slug].el))
    }
    onClose(e) {
        $.stopEvent(e);
        const t = app.docs.findBy("slug", e.target.getAttribute("data-slug"));
        t && this.lists[t.slug] && (this.lists[t.slug].detach(),
        delete this.lists[t.slug])
    }
    select(e) {
        this.listSelect.selectByHref(e?.fullPath())
    }
    reveal(e) {
        this.openDoc(e.doc),
        e.type && this.openType(e.getType()),
        this.focus(e),
        this.paginateTo(e),
        this.scrollTo(e)
    }
    focus(e) {
        null != this.listFocus && this.listFocus.focus(this.find(`a[href='${e.fullPath()}']`))
    }
    revealCurrent() {
        let e;
        (e = app.router.context.type || app.router.context.entry) && (this.reveal(e),
        this.select(e))
    }
    openDoc(e) {
        app.disabledDocs.contains(e) && e.version && this.listFold.open(this.find(`[data-slug='${e.slug_without_version}']`)),
        this.listFold.open(this.find(`[data-slug='${e.slug}']`))
    }
    closeDoc(e) {
        this.listFold.close(this.find(`[data-slug='${e.slug}']`))
    }
    openType(e) {
        this.listFold.open(this.lists[e.doc.slug].find(`[data-slug='${e.slug}']`))
    }
    paginateTo(e) {
        null != this.lists[e.doc.slug] && this.lists[e.doc.slug].paginateTo(e)
    }
    scrollTo(e) {
        $.scrollTo(this.find(`a[href='${e.fullPath()}']`), null, "top", {
            margin: app.isMobile() ? 48 : 0
        })
    }
    toggleDisabled() {
        this.disabledTitle.classList.contains("open-title") ? (this.removeDisabledList(),
        app.settings.set("hideDisabled", !0)) : (this.appendDisabledList(),
        app.settings.set("hideDisabled", !1))
    }
    onClick(e) {
        let t;
        const s = $.eventTarget(e);
        if (this.disabledTitle && $.hasChild(this.disabledTitle, s) && "A" !== s.tagName)
            $.stopEvent(e),
            this.toggleDisabled();
        else if (t = s.getAttribute("data-enable")) {
            $.stopEvent(e);
            const s = app.disabledDocs.findBy("slug", t);
            s && (this.onEnabled = this.onEnabled.bind(this),
            app.enableDoc(s, this.onEnabled, this.onEnabled))
        }
    }
    onEnabled() {
        this.reset(),
        this.render()
    }
    afterRoute(e, t) {
        t.init ? this.activated && this.reset({
            revealCurrent: !0
        }) : this.select(t.type || t.entry)
    }
}
,
app.views.DocPicker = class extends app.View {
    static className = "_list _list-picker";
    static events = {
        mousedown: "onMouseDown",
        mouseup: "onMouseUp"
    };
    init() {
        this.addSubview(this.listFold = new app.views.ListFold(this.el))
    }
    activate() {
        super.activate(...arguments) && (this.render(),
        this.onDOMFocus = this.onDOMFocus.bind(this),
        $.on(this.el, "focus", this.onDOMFocus, !0))
    }
    deactivate() {
        super.deactivate(...arguments) && (this.empty(),
        $.off(this.el, "focus", this.onDOMFocus, !0),
        this.focusEl = null)
    }
    render() {
        let e, t = this.tmpl("docPickerHeader"), s = app.docs.all().concat(...app.disabledDocs.all() || []);
        for (; e = s.shift(); ) {
            var a;
            if (null != e.version)
                [s,a] = this.extractVersions(s, e),
                t += this.tmpl("sidebarVersionedDoc", e, this.renderVersions(a), {
                    open: app.docs.contains(e)
                });
            else
                t += this.tmpl("sidebarLabel", e, {
                    checked: app.docs.contains(e)
                })
        }
        this.html(t + this.tmpl("docPickerNote")),
        requestAnimationFrame(( () => this.findByTag("input")?.focus()))
    }
    renderVersions(e) {
        let t = "";
        for (var s of e)
            t += this.tmpl("sidebarLabel", s, {
                checked: app.docs.contains(s)
            });
        return t
    }
    extractVersions(e, t) {
        const s = []
          , a = [t];
        for (var n of e)
            (n.name === t.name ? a : s).push(n);
        return [s, a]
    }
    empty() {
        this.resetClass(),
        super.empty(...arguments)
    }
    getSelectedDocs() {
        return [...this.findAllByTag("input")].filter((e => e?.checked)).map((e => e.name))
    }
    onMouseDown() {
        this.mouseDown = Date.now()
    }
    onMouseUp() {
        this.mouseUp = Date.now()
    }
    onDOMFocus(e) {
        const {target: t} = e;
        if ("INPUT" === t.tagName)
            this.mouseDown && Date.now() < this.mouseDown + 100 || this.mouseUp && Date.now() < this.mouseUp + 100 || $.scrollTo(t.parentNode, null, "continuous");
        else if (t.classList.contains(app.views.ListFold.targetClass) && (t.blur(),
        !(this.mouseDown && Date.now() < this.mouseDown + 100)))
            if (this.focusEl === $("input", t.nextElementSibling)) {
                t.classList.contains(app.views.ListFold.activeClass) && this.listFold.close(t);
                let e = t.previousElementSibling;
                for (; "LABEL" !== e.tagName && !e.classList.contains(app.views.ListFold.targetClass); )
                    e = e.previousElementSibling;
                e.classList.contains(app.views.ListFold.activeClass) && (e = $.makeArray($$("input", e.nextElementSibling)).pop()),
                this.delay(( () => e.focus()))
            } else
                t.classList.contains(app.views.ListFold.activeClass) || this.listFold.open(t),
                this.delay(( () => $("input", t.nextElementSibling).focus()));
        this.focusEl = t
    }
}
,
app.views.EntryList = class extends app.views.PaginatedList {
    static tagName = "div";
    static className = "_list _list-sub";
    constructor(e) {
        super(...arguments),
        this.entries = e,
        this.init0(),
        this.refreshElements()
    }
    init0() {
        this.renderPaginated(),
        this.activate()
    }
    render(e) {
        return this.tmpl("sidebarEntry", e)
    }
}
,
app.views.Results = class extends app.View {
    static className = "_list";
    static events = {
        click: "onClick"
    };
    static routes = {
        after: "afterRoute"
    };
    constructor(e, t) {
        super(),
        this.sidebar = e,
        this.search = t,
        this.init0(),
        this.refreshElements()
    }
    deactivate() {
        super.deactivate(...arguments) && this.empty()
    }
    init0() {
        this.addSubview(this.listFocus = new app.views.ListFocus(this.el)),
        this.addSubview(this.listSelect = new app.views.ListSelect(this.el)),
        this.search.on("results", ( (e, t) => this.onResults(e, t))).on("noresults", ( () => this.onNoResults())).on("clear", ( () => this.onClear()))
    }
    onResults(e, t) {
        t.initialResults && this.listFocus?.blur(),
        t.initialResults && this.empty(),
        this.append(this.tmpl("sidebarResult", e)),
        t.initialResults && (t.urlSearch ? this.openFirst() : this.focusFirst())
    }
    onNoResults() {
        this.html(this.tmpl("sidebarNoResults"))
    }
    onClear() {
        this.empty()
    }
    focusFirst() {
        app.isMobile() || this.listFocus?.focusOnNextFrame(this.el.firstElementChild)
    }
    openFirst() {
        this.el.firstElementChild?.click()
    }
    onDocEnabled(e) {
        return app.router.show(e.fullPath()),
        this.sidebar.onDocEnabled()
    }
    afterRoute(e, t) {
        "entry" === e ? this.listSelect.selectByHref(t.entry.fullPath()) : this.listSelect.deselect()
    }
    onClick(e) {
        let t;
        if (1 === e.which && (t = $.eventTarget(e).getAttribute("data-enable"))) {
            $.stopEvent(e);
            const s = app.disabledDocs.findBy("slug", t);
            if (s)
                return app.enableDoc(s, this.onDocEnabled.bind(this, s), $.noop)
        }
    }
}
,
app.views.Sidebar = class extends app.View {
    static el = "._sidebar";
    static events = {
        focus: "onFocus",
        select: "onSelect",
        click: "onClick"
    };
    static routes = {
        after: "afterRoute"
    };
    static shortcuts = {
        altR: "onAltR",
        escape: "onEscape"
    };
    init() {
        app.isMobile() || this.addSubview(this.hover = new app.views.SidebarHover(this.el)),
        this.addSubview(this.search = new app.views.Search),
        this.search.on("searching", ( () => this.onSearching())).on("clear", ( () => this.onSearchClear())).scope.on("change", ( (e, t) => this.onScopeChange(t))),
        this.results = new app.views.Results(this,this.search),
        this.docList = new app.views.DocList,
        app.on("ready", ( () => this.onReady())),
        $.on(document.documentElement, "mouseleave", ( () => this.hide())),
        $.on(document.documentElement, "mouseenter", ( () => this.resetDisplay({
            forceNoHover: !1
        })))
    }
    hide() {
        this.removeClass("show")
    }
    display() {
        this.addClass("show")
    }
    resetDisplay(e) {
        null == e && (e = {}),
        this.hasClass("show") && (this.removeClass("show"),
        !1 === e.forceNoHover || this.hasClass("no-hover") || (this.addClass("no-hover"),
        this.resetHoverOnMouseMove = this.resetHoverOnMouseMove.bind(this),
        $.on(window, "mousemove", this.resetHoverOnMouseMove)))
    }
    resetHoverOnMouseMove() {
        return $.off(window, "mousemove", this.resetHoverOnMouseMove),
        requestAnimationFrame(( () => this.resetHover()))
    }
    resetHover() {
        return this.removeClass("no-hover")
    }
    showView(e) {
        this.view !== e && (null != this.hover && this.hover.hide(),
        this.saveScrollPosition(),
        null != this.view && this.view.deactivate(),
        this.view = e,
        this.render(),
        this.view.activate(),
        this.restoreScrollPosition())
    }
    render() {
        this.html(this.view)
    }
    showDocList() {
        this.showView(this.docList)
    }
    showResults() {
        this.display(),
        this.showView(this.results)
    }
    reset() {
        this.display(),
        this.showDocList(),
        this.docList.reset(),
        this.search.reset()
    }
    onReady() {
        this.view = this.docList,
        this.render(),
        this.view.activate()
    }
    onScopeChange(e, t) {
        t && this.docList.closeDoc(t),
        e ? this.docList.reveal(e.toEntry()) : this.scrollToTop()
    }
    saveScrollPosition() {
        this.view === this.docList && (this.scrollTop = this.el.scrollTop)
    }
    restoreScrollPosition() {
        this.view === this.docList && this.scrollTop ? (this.el.scrollTop = this.scrollTop,
        this.scrollTop = null) : this.scrollToTop()
    }
    scrollToTop() {
        this.el.scrollTop = 0
    }
    onSearching() {
        this.showResults()
    }
    onSearchClear() {
        this.resetDisplay(),
        this.showDocList()
    }
    onFocus(e) {
        this.display(),
        e.target !== this.el && $.scrollTo(e.target, this.el, "continuous", {
            bottomGap: 2
        })
    }
    onSelect() {
        this.resetDisplay()
    }
    onClick(e) {
        1 === e.which && $.eventTarget(e).hasAttribute?.("data-reset-list") && ($.stopEvent(e),
        this.onAltR())
    }
    onAltR() {
        this.reset(),
        this.docList.reset({
            revealCurrent: !0
        }),
        this.display()
    }
    onEscape() {
        let e;
        this.reset(),
        this.resetDisplay(),
        (e = this.search.getScopeDoc()) ? this.docList.reveal(e.toEntry()) : this.scrollToTop()
    }
    onDocEnabled() {
        this.docList.onEnabled(),
        this.reset()
    }
    afterRoute(e, t) {
        "escape" !== (null != app.shortcuts.eventInProgress ? app.shortcuts.eventInProgress.name : void 0) && (!t.init && app.router.isIndex() && this.reset(),
        this.resetDisplay())
    }
}
,
app.views.SidebarHover = class extends app.View {
    static itemClass = "_list-hover";
    static events = {
        focus: "onFocus",
        blur: "onBlur",
        mouseover: "onMouseover",
        mouseout: "onMouseout",
        scroll: "onScroll",
        click: "onClick"
    };
    static routes = {
        after: "onRoute"
    };
    show(e) {
        e !== this.cursor && (this.hide(),
        this.isTarget(e) && this.isTruncated(e.lastElementChild || e) && (this.cursor = e,
        this.clone = this.makeClone(this.cursor),
        $.append(document.body, this.clone),
        null == this.offsetTop && (this.offsetTop = this.el.offsetTop),
        this.position()))
    }
    hide() {
        this.cursor && ($.remove(this.clone),
        this.cursor = this.clone = null)
    }
    position() {
        if (this.cursor) {
            const e = $.rect(this.cursor);
            e.top >= this.offsetTop ? (this.clone.style.top = e.top + "px",
            this.clone.style.left = e.left + "px") : this.hide()
        }
    }
    makeClone(e) {
        const t = e.cloneNode(!0);
        return t.classList.add("clone"),
        t
    }
    isTarget(e) {
        return e.classList?.contains(this.constructor.itemClass)
    }
    isSelected(e) {
        return e.classList.contains("active")
    }
    isTruncated(e) {
        return e.scrollWidth > e.offsetWidth
    }
    onFocus(e) {
        this.focusTime = Date.now(),
        this.show(e.target)
    }
    onBlur() {
        this.hide()
    }
    onMouseover(e) {
        this.isTarget(e.target) && !this.isSelected(e.target) && this.mouseActivated() && this.show(e.target)
    }
    onMouseout(e) {
        this.isTarget(e.target) && this.mouseActivated() && this.hide()
    }
    mouseActivated() {
        return !this.focusTime || Date.now() - this.focusTime > 500
    }
    onScroll() {
        this.position()
    }
    onClick(e) {
        e.target === this.clone && $.click(this.cursor)
    }
    onRoute() {
        this.hide()
    }
}
,
app.views.TypeList = class extends app.View {
    static tagName = "div";
    static className = "_list _list-sub";
    static events = {
        open: "onOpen",
        close: "onClose"
    };
    constructor(e) {
        super(),
        this.doc = e,
        this.init0(),
        this.refreshElements()
    }
    init0() {
        this.lists = {},
        this.render(),
        this.activate()
    }
    activate() {
        if (super.activate(...arguments))
            for (var e in this.lists) {
                this.lists[e].activate()
            }
    }
    deactivate() {
        if (super.deactivate(...arguments))
            for (var e in this.lists) {
                this.lists[e].deactivate()
            }
    }
    render() {
        let e = "";
        for (var t of this.doc.types.groups())
            e += this.tmpl("sidebarType", t);
        return this.html(e)
    }
    onOpen(e) {
        $.stopEvent(e);
        const t = this.doc.types.findBy("slug", e.target.getAttribute("data-slug"));
        t && !this.lists[t.slug] && (this.lists[t.slug] = new app.views.EntryList(t.entries()),
        $.after(e.target, this.lists[t.slug].el))
    }
    onClose(e) {
        $.stopEvent(e);
        const t = this.doc.types.findBy("slug", e.target.getAttribute("data-slug"));
        t && this.lists[t.slug] && (this.lists[t.slug].detach(),
        delete this.lists[t.slug])
    }
    paginateTo(e) {
        e.type && this.lists[e.getType().slug]?.paginateTo(e)
    }
}
,
app.templates.render = function(e, t, ...s) {
    const a = app.templates[e];
    if (Array.isArray(t)) {
        let e = "";
        for (var n of t)
            e += a(n, ...s);
        return e
    }
    return "function" == typeof a ? a(t, ...s) : a
}
;
const error = function(e, t, s) {
    return null == t && (t = ""),
    null == s && (s = ""),
    t && (t = `<p class="_error-text">${t}</p>`),
    s && (s = `<p class="_error-links">${s}</p>`),
    `<div class="_error"><h1 class="_error-title">${e}</h1>${t}${s}</div>`
}
  , back = '<a href="#" data-behavior="back" class="_error-link">Go back</a>';
app.templates.notFoundPage = () => error(" Page not found. ", " It may be missing from the source documentation or this could be a bug. ", back),
app.templates.pageLoadError = () => error(" The page failed to load. ", " It may be missing from the server (try reloading the app) or you could be offline (try <a href=\"/offline\">installing the documentation for offline usage</a> when online again).<br>\nIf you're online and you keep seeing this, you're likely behind a proxy or firewall that blocks cross-domain requests. ", ` ${back} &middot; <a href="/#${location.pathname}" target="_top" class="_error-link">Reload</a>\n&middot; <a href="#" class="_error-link" data-retry>Retry</a> `),
app.templates.bootError = () => error(" The app failed to load. ", ' Check your Internet connection and try <a href="#" data-behavior="reload">reloading</a>.<br>\nIf you keep seeing this, you\'re likely behind a proxy or firewall that blocks cross-domain requests. '),
app.templates.offlineError = function(e, t) {
    return "cookie_blocked" === e ? error(" Cookies must be enabled to use offline mode. ") : (e = ( () => {
        switch (e) {
        case "not_supported":
            return " DevDocs requires IndexedDB to cache documentations for offline access.<br>\nUnfortunately your browser either doesn't support IndexedDB or doesn't make it available. ";
        case "buggy":
            return " DevDocs requires IndexedDB to cache documentations for offline access.<br>\nUnfortunately your browser's implementation of IndexedDB contains bugs that prevent DevDocs from using it. ";
        case "private_mode":
            return " Your browser appears to be running in private mode.<br>\nThis prevents DevDocs from caching documentations for offline access.";
        case "exception":
            return ` An error occurred when trying to open the IndexedDB database:<br>\n<code class="_label">${t.name}: ${t.message}</code> `;
        case "cant_open":
            return ` An error occurred when trying to open the IndexedDB database:<br>\n<code class="_label">${t.name}: ${t.message}</code><br>\nThis could be because you're browsing in private mode or have disallowed offline storage on the domain. `;
        case "version":
            return ' The IndexedDB database was modified with a newer version of the app.<br>\n<a href="#" data-behavior="reload">Reload the page</a> to use offline mode. ';
        case "empty":
            return ' The IndexedDB database appears to be corrupted. Try <a href="#" data-behavior="reset">resetting the app</a>. '
        }
    }
    )(),
    error("Offline mode is unavailable.", e))
}
,
app.templates.unsupportedBrowser = '<div class="_fail">\n  <h1 class="_fail-title">Your browser is unsupported, sorry.</h1>\n  <p class="_fail-text">DevDocs is an API documentation browser which supports the following browsers:\n  <ul class="_fail-list">\n    <li>Recent versions of Firefox, Chrome, or Opera\n    <li>Safari 11.1+\n    <li>Edge 17+\n    <li>iOS 11.3+\n  </ul>\n  <p class="_fail-text">\n    If you\'re unable to upgrade, we apologize.\n    We decided to prioritize speed and new features over support for older browsers.\n  <p class="_fail-text">\n    Note: if you\'re already using one of the browsers above, check your settings and add-ons.\n    The app uses feature detection, not user agent sniffing.\n  <p class="_fail-text">\n    &mdash; <a href="https://twitter.com/DevDocs">@DevDocs</a>\n</div>';
const notice = e => `<p class="_notice-text">${e}</p>`;
app.templates.singleDocNotice = e => notice(` You're browsing the ${e.fullName} documentation. To browse all docs, go to\n<a href="//${app.config.production_host}" target="_top">${app.config.production_host}</a> (or press <code>esc</code>). `),
app.templates.disabledDocNotice = () => notice(' <strong>This documentation is disabled.</strong>\nTo enable it, go to <a href="/settings" class="_notice-link">Preferences</a>. ');
const notif = function(e, t) {
    return ` <h5 class="_notif-title">${e}</h5>\n${t = t.replace(/<a /g, '<a class="_notif-link" ')}\n<button type="button" class="_notif-close" title="Close"><svg><use xlink:href="#icon-close"/></svg>Close</a>`
}
  , textNotif = (e, t) => notif(e, `<p class="_notif-text">${t}`);
app.templates.notifUpdateReady = () => textNotif('<span data-behavior="reboot">DevDocs has been updated.</span>', '<span data-behavior="reboot"><a href="#" data-behavior="reboot">Reload the page</a> to use the new version.</span>'),
app.templates.notifError = () => textNotif(" Oops, an error occurred. ", ' Try <a href="#" data-behavior="hard-reload">reloading</a>, and if the problem persists,\n<a href="#" data-behavior="reset">resetting the app</a>.<br>\nYou can also report this issue on <a href="https://github.com/freeCodeCamp/devdocs/issues/new" target="_blank" rel="noopener">GitHub</a>. '),
app.templates.notifQuotaExceeded = () => textNotif(" The offline database has exceeded its size limitation. ", " Unfortunately this quota can't be detected programmatically, and the database can't be opened while over the quota, so it had to be reset. "),
app.templates.notifCookieBlocked = () => textNotif(" Please enable cookies. ", " DevDocs will not work properly if cookies are disabled. "),
app.templates.notifImportInvalid = () => textNotif(" Oops, an error occurred. ", " The file you selected is invalid. "),
app.templates.notifNews = e => notif("Changelog", `<div class="_notif-content _notif-news">${app.templates.newsList(e, {
    years: !1
})}</div>`),
app.templates.notifUpdates = function(e, t) {
    let s, a = '<div class="_notif-content _notif-news">';
    if (e.length > 0) {
        for (s of (a += '<div class="_news-row">',
        a += '<ul class="_notif-list">',
        e))
            a += `<li>${s.name}`,
            s.release && (a += ` <code>&rarr;</code> ${s.release}`);
        a += "</ul></div>"
    }
    if (t.length > 0) {
        for (s of (a += '<div class="_news-row"><p class="_news-title">Disabled:',
        a += '<ul class="_notif-list">',
        t))
            a += `<li>${s.name}`,
            s.release && (a += ` <code>&rarr;</code> ${s.release}`),
            a += '<span class="_notif-info"><a href="/settings">Enable</a></span>';
        a += "</ul></div>"
    }
    return notif("Updates", `${a}</div>`)
}
,
app.templates.notifShare = () => textNotif(" Hi there! ", ' Like DevDocs? Help us reach more developers by sharing the link with your friends on\n<a href="https://out.devdocs.io/s/tw" target="_blank" rel="noopener">Twitter</a>, <a href="https://out.devdocs.io/s/fb" target="_blank" rel="noopener">Facebook</a>,\n<a href="https://out.devdocs.io/s/re" target="_blank" rel="noopener">Reddit</a>, etc.<br>Thanks :) '),
app.templates.notifUpdateDocs = () => textNotif(" Documentation updates available. ", ' <a href="/offline">Install them</a> as soon as possible to avoid broken pages. '),
app.templates.notifAnalyticsConsent = () => textNotif(" Tracking cookies ", ' We would like to gather usage data about how DevDocs is used through Google Analytics and Gauges. We only collect anonymous traffic information.\nPlease confirm if you accept our tracking cookies. You can always change your decision in the settings.\n<br><span class="_notif-right"><a href="#" data-behavior="accept-analytics">Accept</a> or <a href="#" data-behavior="decline-analytics">Decline</a></span> '),
app.templates.aboutPage = function() {
    let e;
    const t = app.docs.all().concat(...app.disabledDocs.all() || [])
      , s = [];
    for (e of t)
        s.find((t => t.name === e.name)) || s.push(e);
    return `<nav class="_toc" role="directory">\n  <h3 class="_toc-title">Table of Contents</h3>\n  <ul class="_toc-list">\n    <li><a href="#copyright">Copyright</a>\n    <li><a href="#plugins">Plugins</a>\n    <li><a href="#faq">FAQ</a>\n    <li><a href="#credits">Credits</a>\n    <li><a href="#privacy">Privacy Policy</a>\n  </ul>\n</nav>\n\n<h1 class="_lined-heading">DevDocs: API Documentation Browser</h1>\n<p>DevDocs combines multiple developer documentations in a clean and organized web UI with instant search, offline support, mobile version, dark theme, keyboard shortcuts, and more.\n<p>DevDocs is free and <a href="https://github.com/freeCodeCamp/devdocs">open source</a>. It was created by <a href="https://thibaut.me">Thibaut Courouble</a> and is operated by <a href="https://www.freecodecamp.org/">freeCodeCamp</a>.\n<p>To keep up-to-date with the latest news:\n<ul>\n  <li>Follow <a href="https://twitter.com/DevDocs">@DevDocs</a> on Twitter\n  <li>Watch the repository on <a href="https://github.com/freeCodeCamp/devdocs/subscription">GitHub</a> <iframe class="_github-btn" src="https://ghbtns.com/github-btn.html?user=freeCodeCamp&repo=devdocs&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="100" height="20" tabindex="-1"></iframe>\n  <li>Join the <a href="https://discord.gg/PRyKn3Vbay">Discord</a> chat room\n</ul>\n\n<h2 class="_block-heading" id="copyright">Copyright and License</h2>\n<p class="_note">\n  <strong>Copyright 2013&ndash;2025 Thibaut Courouble and <a href="https://github.com/freeCodeCamp/devdocs/graphs/contributors">other contributors</a></strong><br>\n  This software is licensed under the terms of the Mozilla Public License v2.0.<br>\n  You may obtain a copy of the source code at <a href="https://github.com/freeCodeCamp/devdocs">github.com/freeCodeCamp/devdocs</a>.<br>\n  For more information, see the <a href="https://github.com/freeCodeCamp/devdocs/blob/main/COPYRIGHT">COPYRIGHT</a>\n  and <a href="https://github.com/freeCodeCamp/devdocs/blob/main/LICENSE">LICENSE</a> files.\n\n<h2 class="_block-heading" id="plugins">Plugins and Extensions</h2>\n<ul>\n  <li><a href="https://sublime.wbond.net/packages/DevDocs">Sublime Text package</a>\n  <li><a href="https://atom.io/packages/devdocs">Atom package</a>\n  <li><a href="https://marketplace.visualstudio.com/items?itemName=deibit.devdocs">Visual Studio Code extension</a>\n  <li><a href="https://github.com/yannickglt/alfred-devdocs">Alfred workflow</a>\n  <li><a href="https://github.com/search?q=topic%3Adevdocs&type=Repositories">More\u2026</a>\n</ul>\n\n<h2 class="_block-heading" id="faq">Questions & Answers</h2>\n<dl>\n  <dt>Where can I suggest new docs and features?\n  <dd>You can suggest and vote for new docs on the <a href="https://trello.com/b/6BmTulfx/devdocs-documentation">Trello board</a>.<br>\n      If you have a specific feature request, add it to the <a href="https://github.com/freeCodeCamp/devdocs/issues">issue tracker</a>.<br>\n      Otherwise, come talk to us in the <a href="https://discord.gg/PRyKn3Vbay">Discord</a> chat room.\n  <dt>Where can I report bugs?\n  <dd>In the <a href="https://github.com/freeCodeCamp/devdocs/issues">issue tracker</a>. Thanks!\n</dl>\n\n<h2 class="_block-heading" id="credits">Credits</h2>\n\n<p><strong>Special thanks to:</strong>\n<ul>\n  <li><a href="https://sentry.io/">Sentry</a> and <a href="https://get.gaug.es/?utm_source=devdocs&utm_medium=referral&utm_campaign=sponsorships" title="Real Time Web Analytics">Gauges</a> for offering a free account to DevDocs\n  <li><a href="https://out.devdocs.io/s/maxcdn">MaxCDN</a>, <a href="https://out.devdocs.io/s/shopify">Shopify</a>, <a href="https://out.devdocs.io/s/jetbrains">JetBrains</a> and <a href="https://out.devdocs.io/s/code-school">Code School</a> for sponsoring DevDocs in the past\n  <li><a href="https://www.heroku.com">Heroku</a> and <a href="https://newrelic.com/">New Relic</a> for providing awesome free service\n  <li><a href="https://www.jeremykratz.com/">Jeremy Kratz</a> for the C/C++ logo\n</ul>\n\n<div class="_table">\n  <table class="_credits">\n    <tr>\n      <th>Documentation\n      <th>Copyright/License\n      <th>Source code\n    ${s.map((e => `<tr><td><a href="${e.links?.home}">${e.name}</a></td><td>${e.attribution}</td><td><a href="${e.links?.code}">Source code</a></td></tr>`)).join("")}\n  </table>\n</div>\n\n<h2 class="_block-heading" id="privacy">Privacy Policy</h2>\n<ul>\n  <li><a href="https://devdocs.io">devdocs.io</a> ("App") is operated by <a href="https://www.freecodecamp.org/">freeCodeCamp</a> ("We").\n  <li>We do not collect personal information through the app.\n  <li>We use Google Analytics and Gauges to collect anonymous traffic information if you have given consent to this. You can change your decision in the <a href="/settings">settings</a>.\n  <li>We use Sentry to collect crash data and improve the app.\n  <li>The app uses cookies to store user preferences.\n  <li>By using the app, you signify your acceptance of this policy. If you do not agree to this policy, please do not use the app.\n  <li>If you have any questions regarding privacy, please email <a href="mailto:privacy@freecodecamp.org">privacy@freecodecamp.org</a>.\n</ul>`
}
,
app.templates.helpPage = function() {
    const e = $.isMac() ? "cmd" : "ctrl"
      , t = $.isMac() ? "cmd" : "alt"
      , s = app.settings.get("arrowScroll")
      , a = Object.entries(app.config.docs_aliases)
      , n = Math.ceil(a.length / 2)
      , i = a.slice(0, n)
      , r = a.slice(n);
    return `<nav class="_toc" role="directory">\n  <h3 class="_toc-title">Table of Contents</h3>\n  <ul class="_toc-list">\n    <li><a href="#managing-documentations">Managing Documentations</a>\n    <li><a href="#search">Search</a>\n    <li><a href="#shortcuts">Keyboard Shortcuts</a>\n    <li><a href="#aliases">Search Aliases</a>\n  </ul>\n</nav>\n\n<h1 class="_lined-heading">User Guide</h1>\n\n<h2 class="_block-heading" id="managing-documentations">Managing Documentations</h2>\n<p>\n  Documentations can be enabled and disabled in the <a href="/settings">Preferences</a>.\n  Alternatively, you can enable a documentation by searching for it in the main search\n  and clicking the "Enable" link in the results.\n  For faster and better search, only enable the documentations you plan on actively using.\n<p>\n  Once a documentation is enabled, it becomes part of the search and its content can be downloaded for offline access \u2014 and faster page loads when online \u2014 in the <a href="/offline">Offline</a> area.\n\n<h2 class="_block-heading" id="search">Search</h2>\n<p>\n  The search is case-insensitive and ignores whitespace. It supports fuzzy matching\n  (e.g. <code class="_label">bgcp</code> matches <code class="_label">background-clip</code>)\n  as well as aliases (full list <a href="#aliases">below</a>).\n<dl>\n  <dt id="doc_search">Searching a single documentation\n  <dd>\n    The search can be scoped to a single documentation by typing its name (or an abbreviation)\n    and pressing <code class="_label">tab</code> (<code class="_label">space</code>&nbsp;on mobile).\n    For example, to search the JavaScript documentation, enter <code class="_label">javascript</code>\n    or <code class="_label">js</code>, then <code class="_label">tab</code>.<br>\n    To clear the current scope, empty the search field and hit <code class="_label">backspace</code> or\n    <code class="_label">esc</code>.\n  <dt id="url_search">Prefilling the search field\n  <dd>\n    The search can be prefilled from the URL by visiting <a href="/#q=keyword" target="_top">devdocs.io/#q=keyword</a>.\n    Characters after <code class="_label">#q=</code> will be used as search query.<br>\n    To search a single documentation, add its name (or an abbreviation) and a space before the keyword:\n    <a href="/#q=js%20date" target="_top">devdocs.io/#q=js date</a>.\n  <dt id="browser_search">Searching using the address bar\n  <dd>\n    DevDocs supports OpenSearch. It can easily be installed as a search engine on most web browsers:\n    <ul>\n      <li>On Chrome, the setup is done automatically. Simply press <code class="_label">tab</code> when devdocs.io is autocompleted\n          in the omnibox (to set a custom keyword, click <em>Manage search engines\u2026</em> in Chrome's settings).\n      <li>On Firefox, <a href="https://support.mozilla.org/en-US/kb/add-or-remove-search-engine-firefox#w_add-a-search-engine-from-the-address-bar">add the search from the address bar</a>:\n          Click \u2022\u2022\u2022 in the address bar, and select <em>Add Search Engine</em>. Then, you can add a keyword for this search engine in the preferences.\n</dl>\n<p>\n  <i>Note: the above search features only work for documentations that are enabled.</i>\n\n<h2 class="_block-heading" id="shortcuts">Keyboard Shortcuts</h2>\n<h3 class="_shortcuts-title">Sidebar</h3>\n<dl class="_shortcuts-dl">\n  <dt class="_shortcuts-dt">\n    ${s ? '<code class="_shortcut-code">shift</code> + ' : ""}\n    <code class="_shortcut-code">&darr;</code>\n    <code class="_shortcut-code">&uarr;</code>\n  <dd class="_shortcuts-dd">Move selection\n  <dt class="_shortcuts-dt">\n    ${s ? '<code class="_shortcut-code">shift</code> + ' : ""}\n    <code class="_shortcut-code">&rarr;</code>\n    <code class="_shortcut-code">&larr;</code>\n  <dd class="_shortcuts-dd">Show/hide sub-list\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">enter</code>\n  <dd class="_shortcuts-dd">Open selection\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">${e} + enter</code>\n  <dd class="_shortcuts-dd">Open selection in a new tab\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + r</code>\n  <dd class="_shortcuts-dd">Reveal current page in sidebar\n</dl>\n<h3 class="_shortcuts-title">Browsing</h3>\n<dl class="_shortcuts-dl">\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">${t} + &larr;</code>\n    <code class="_shortcut-code">${t} + &rarr;</code>\n  <dd class="_shortcuts-dd">Go back/forward\n  <dt class="_shortcuts-dt">\n    ${s ? '<code class="_shortcut-code">&darr;</code> <code class="_shortcut-code">&uarr;</code>' : '<code class="_shortcut-code">alt + &darr;</code> <code class="_shortcut-code">alt + &uarr;</code><br><code class="_shortcut-code">shift + &darr;</code> <code class="_shortcut-code">shift + &uarr;</code>'}\n  <dd class="_shortcuts-dd">Scroll step by step<br><br>\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">space</code>\n    <code class="_shortcut-code">shift + space</code>\n  <dd class="_shortcuts-dd">Scroll screen by screen\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">${e} + &uarr;</code>\n    <code class="_shortcut-code">${e} + &darr;</code>\n  <dd class="_shortcuts-dd">Scroll to the top/bottom\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + f</code>\n  <dd class="_shortcuts-dd">Focus first link in the content area<br>(press tab to focus the other links)\n</dl>\n<h3 class="_shortcuts-title">App</h3>\n<dl class="_shortcuts-dl">\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">ctrl + ,</code>\n  <dd class="_shortcuts-dd">Open preferences\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">esc</code>\n  <dd class="_shortcuts-dd">Clear search field / reset UI\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">?</code>\n  <dd class="_shortcuts-dd">Show this page\n</dl>\n<h3 class="_shortcuts-title">Miscellaneous</h3>\n<dl class="_shortcuts-dl">\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + c</code>\n  <dd class="_shortcuts-dd">Copy URL of original page\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + o</code>\n  <dd class="_shortcuts-dd">Open original page\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + g</code>\n  <dd class="_shortcuts-dd">Search on Google\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + s</code>\n  <dd class="_shortcuts-dd">Search on Stack Overflow\n  <dt class="_shortcuts-dt">\n    <code class="_shortcut-code">alt + d</code>\n  <dd class="_shortcuts-dd">Search on DuckDuckGo\n</dl>\n<p class="_note _note-green">\n  <strong>Tip:</strong> If the cursor is no longer in the search field, press <code class="_label">/</code> or\n  continue to type and it will refocus the search field and start showing new results.\n\n<h2 class="_block-heading" id="aliases">Search Aliases</h2>\n<div class="_aliases">\n  <table>\n    <tr>\n      <th>Word\n      <th>Alias\n    ${i.map(( ([e,t]) => `<tr><td class="_code">${e}<td class="_code">${t}`)).join("")}\n  </table>\n  <table>\n    <tr>\n      <th>Word\n      <th>Alias\n      ${r.map(( ([e,t]) => `<tr><td class="_code">${e}<td class="_code">${t}`)).join("")}\n  </table>\n</div>\n<p>Feel free to suggest new aliases on <a href="https://github.com/freeCodeCamp/devdocs/issues/new">GitHub</a>.`
}
,
app.templates.newsPage = () => ` <h1 class="_lined-heading">Changelog</h1>\n<p class="_note">\nFor the latest news, follow <a href="https://twitter.com/DevDocs">@DevDocs</a>.<br>\nFor development updates, follow the project on <a href="https://github.com/freeCodeCamp/devdocs">GitHub</a>.\n<div class="_news">${app.templates.newsList(app.news)}</div> `,
app.templates.newsList = function(e, t={}) {
    let s = (new Date).getUTCFullYear()
      , a = "";
    for (let n of e) {
        const e = new Date(n[0]);
        !1 !== t.years && s !== e.getUTCFullYear() && (s = e.getUTCFullYear(),
        a += `<h2 class="_block-heading">${s}</h2>`),
        a += newsItem(e, n.slice(1))
    }
    return a
}
;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var newsItem = function(e, t) {
    e = `<span class="_news-date">${MONTHS[e.getUTCMonth()]} ${e.getUTCDate()}</span>`;
    let s = "";
    for (let a = 0; a < t.length; a++) {
        let n = t[a];
        n = n.split("\n");
        s += `<div class="_news-row">${0 === a ? e : ""} ${`<span class="_news-title">${n.shift()}</span>`} ${n.join("<br>")}</div>`
    }
    return s
};
app.news = [["2025-02-23", 'New documentation: <a href="/threejs/">Three.js</a>'], ["2025-02-16", 'New documentation: <a href="/openlayers/">OpenLayers</a>'], ["2024-11-23", 'New documentation: <a href="/duckdb/">DuckDB</a>'], ["2024-08-20", 'New documentation: <a href="/man/">Linux man pages</a>'], ["2024-07-28", 'New documentation: <a href="/opengl/">OpenGL</a>'], ["2024-06-12", 'New documentations: <a href="/nextjs/">Next.js</a>, <a href="/click/">click</a>'], ["2024-01-24", 'New documentation: <a href="/playwright/">Playwright</a>'], ["2024-01-20", 'New documentation: <a href="/htmx/">htmx</a>'], ["2024-01-12", 'New documentation: <a href="/hammerspoon/">Hammerspoon</a>'], ["2024-01-05", 'New documentation: <a href="/bazel/">Bazel</a>'], ["2023-10-09", 'New documentations: <a href="/hapi/">hapi</a>, <a href="/joi/">joi</a>, <a href="/nushell/">Nushell</a>, <a href="/varnish/">Varnish</a>'], ["2023-08-24", 'New documentation: <a href="/fluture/">Fluture</a>'], ["2022-12-20", 'New documentations: <a href="/qunit/">QUnit</a>, <a href="/wagtail/">Wagtail</a>'], ["2022-11-04", 'New documentation: <a href="/vueuse/">VueUse</a>'], ["2022-10-10", 'New documentation: <a href="/astro/">Astro</a>'], ["2022-10-09", 'New documentations: <a href="/fastapi/">FastAPI</a>, <a href="/vitest/">Vitest</a>'], ["2022-10-02", 'New documentation: <a href="/svelte/">Svelte</a>'], ["2022-09-21", 'Added HTTP/3 to <a href="/http/">HTTP</a>'], ["2022-09-06", 'New documentation: <a href="/date_fns/">date-fns</a>'], ["2022-08-27", 'New documentations: <a href="/sanctuary/">Sanctuary</a>, <a href="/requests/">Requests</a>, <a href="/axios/">Axios</a>'], ["2022-05-03", 'New documentations: <a href="/kubernetes/">Kubernetes</a>, <a href="/kubectl/">Kubectl</a>'], ["2022-04-25", 'New documentation: <a href="/nix/">Nix</a>'], ["2022-03-31", 'New documentation: <a href="/eigen3/">Eigen3</a>'], ["2022-02-21", 'New documentation: <a href="/tailwindcss/">Tailwind CSS</a>'], ["2022-01-12", 'New documentation: <a href="/react_router/">React Router</a>'], ["2022-01-09", 'New documentation: <a href="/deno/">Deno</a>'], ["2021-12-29", 'New documentation: <a href="/point_cloud_library/">PointCloudLibrary</a>'], ["2021-12-27", 'New documentation: <a href="/zig/">Zig</a>'], ["2021-12-26", 'New documentation: <a href="/gnu_make/">GNU Make</a>'], ["2021-12-07", 'New documentation: <a href="/prettier/">Prettier</a>', 'Renamed documentation: <a href="/dom/">Web APIs</a>'], ["2021-12-05", 'New documentation: <a href="/esbuild/">esbuild</a>'], ["2021-12-04", 'New documentation: <a href="/vite/">Vite</a>'], ["2021-11-29", 'New documentation: <a href="/i3/">i3</a>'], ["2021-06-09", 'New documentation: <a href="/r/">R</a>'], ["2021-05-31", 'New documentation: <a href="/web_extensions/">Web Extensions</a>'], ["2021-05-26", 'New documentations: <a href="/latex/">LaTeX</a>, <a href="/jq/">jq</a>'], ["2021-04-29", 'Added <code class="_label">alt + c</code> shortcut to copy URL of original page.'], ["2021-02-26", 'New documentation: <a href="/react_bootstrap/">React Bootstrap</a>'], ["2021-01-03", 'New documentation: <a href="/ocaml/">OCaml</a>'], ["2020-12-23", 'New documentation: <a href="/gtk/">GTK</a>'], ["2020-12-07", 'New documentations: <a href="/flask/">Flask</a>, <a href="/groovy/">Groovy</a>, <a href="/jinja/">Jinja</a>, <a href="/werkzeug/">Werkzeug</a>'], ["2020-12-04", 'New documentation: <a href="/haproxy/">HAProxy</a>'], ["2020-11-17", 'TensorFlow has been split into <a href="/tensorflow/">TensorFlow Python</a>, <a href="/tensorflow_cpp/">TensorFlow C++</a>'], ["2020-11-14", 'New documentations: <a href="/pytorch/">PyTorch</a>, <a href="/spring_boot/">Spring Boot</a>'], ["2020-01-13", 'New \u201cAutomatic\u201d theme: match your browser or system dark mode setting. <a href="/settings">Enable it in preferences</a>.'], ["2020-01-13", 'New documentation: <a href="/gnuplot/">Gnuplot</a>'], ["2019-10-26", 'New documentation: <a href="/sequelize/">Sequelize</a>'], ["2019-10-20", 'New documentations: <a href="/mariadb/">MariaDB</a> and <a href="/reactivex/">ReactiveX</a>'], ["2019-09-02", 'New documentations added over the last 3 weeks: <a href="/scala~2.13_library/">Scala</a>, <a href="/wordpress/">WordPress</a>, <a href="/cypress/">Cypress</a>, <a href="/saltstack/">SaltStack</a>, <a href="/composer/">Composer</a>, <a href="/vue_router/">Vue Router</a>, <a href="/vuex/">Vuex</a>, <a href="/pony/">Pony</a>, <a href="/rxjs/">RxJS</a>, <a href="/octave/">Octave</a>, <a href="/trio/">Trio</a>, <a href="/django_rest_framework/">Django REST Framework</a>, <a href="/enzyme/">Enzyme</a> and <a href="/gnu_cobol/">GnuCOBOL</a>'], ["2019-07-21", 'Fixed several bugs, added an option to automatically download documentation and <a href="https://github.com/freeCodeCamp/devdocs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed+sort%3Aupdated-desc+closed%3A%3E2019-07-18+977+988+986+870+886+1024+979+975+941+831+1005+848+942" target="_blank">more</a>.'], ["2019-07-19", "Replaced the AppCache with a Service Worker (which makes DevDocs an installable PWA) and fixed layout preferences on Firefox."], ["2018-09-23", 'New documentations: <a href="/puppeteer/">Puppeteer</a> and <a href="/handlebars/">Handlebars.js</a>'], ["2018-08-12", 'New documentations: <a href="/dart/">Dart</a> and <a href="/qt/">Qt</a>'], ["2018-07-29", 'New documentations: <a href="/bash/">Bash</a>, <a href="/graphite/">Graphite</a> and <a href="/pygame/">Pygame</a>'], ["2018-07-08", 'New documentations: <a href="/leaflet/">Leaflet</a>, <a href="/terraform/">Terraform</a> and <a href="/koa/">Koa</a>'], ["2018-03-26", 'DevDocs is joining the freeCodeCamp community. Read the announcement <a href="https://medium.freecodecamp.org/devdocs-is-joining-the-freecodecamp-community-ae185a1c14a6" target="_blank">here</a>.'], ["2018-02-04", 'New documentations: <a href="/babel/">Babel</a>, <a href="/jekyll/">Jekyll</a> and <a href="/jsdoc/">JSDoc</a>'], ["2017-11-26", 'New documentations: <a href="/bluebird/">Bluebird</a>, <a href="/eslint/">ESLint</a> and <a href="/homebrew/">Homebrew</a>'], ["2017-11-18", 'Added print & PDF stylesheet.\nFeedback welcome on <a href="https://twitter.com/DevDocs" target="_blank" rel="noopener">Twitter</a> and <a href="https://github.com/freeCodeCamp/devdocs" target="_blank" rel="noopener">GitHub</a>.'], ["2017-09-10", '<a href="/settings">Preferences</a> can now be exported and imported.'], ["2017-09-03", 'New documentations: <a href="/d/">D</a>, <a href="/nim/">Nim</a> and <a href="/vulkan/">Vulkan</a>'], ["2017-07-23", 'New documentation: <a href="/godot/">Godot</a>'], ["2017-06-04", 'New documentations: <a href="/electron/">Electron</a>, <a href="/pug/">Pug</a>, and <a href="/falcon/">Falcon</a>'], ["2017-05-14", 'New documentations: <a href="/jest/">Jest</a>, <a href="/jasmine/">Jasmine</a> and <a href="/liquid/">Liquid</a>'], ["2017-04-30", 'New documentation: <a href="/openjdk/">OpenJDK</a>'], ["2017-02-26", "Refreshed design.", 'Added <a href="/settings">Preferences</a>.'], ["2017-01-22", 'New <a href="/http/">HTTP</a> documentation (thanks Mozilla)'], ["2016-12-04", 'New documentations: <a href="/sqlite/">SQLite</a>, <a href="/codeception/">Codeception</a> and <a href="/codeceptjs/">CodeceptJS</a>'], ["2016-11-20", 'New documentations: <a href="/yarn/">Yarn</a>, <a href="/immutable/">Immutable.js</a> and <a href="/async/">Async</a>'], ["2016-10-10", 'New documentations: <a href="/scikit_learn/">scikit-learn</a> and <a href="/statsmodels/">Statsmodels</a>'], ["2016-09-18", 'New documentations: <a href="/pandas/">pandas</a> and <a href="/twig/">Twig</a>'], ["2016-09-05", 'New documentations: <a href="/fish/">Fish</a>, <a href="/bottle/">Bottle</a> and <a href="/scikit_image/">scikit-image</a>'], ["2016-08-07", 'New documentation: <a href="/docker/">Docker</a>'], ["2016-07-31", 'New documentations: <a href="/bootstrap~3/">Bootstrap 3</a> and <a href="/bootstrap~4/">Bootstrap 4</a>'], ["2016-07-24", 'New documentations: <a href="/julia/">Julia</a>, <a href="/crystal/">Crystal</a> and <a href="/redux/">Redux</a>'], ["2016-07-03", 'New documentations: <a href="/cmake/">CMake</a> and <a href="/matplotlib/">Matplotlib</a>'], ["2016-06-19", 'New documentation: <a href="/love/">L&Ouml;VE</a>'], ["2016-06-12", 'New documentation: <a href="/angular/">Angular 2</a>'], ["2016-06-05", 'New documentations: <a href="/kotlin/">Kotlin</a> and <a href="/padrino/">Padrino</a>'], ["2016-04-24", 'New documentations: <a href="/numpy/">NumPy</a> and <a href="/apache_pig/">Apache Pig</a>'], ["2016-04-17", 'New documentation: <a href="/perl/">Perl</a>'], ["2016-04-10", 'New documentations: <a href="/browser_support_tables/">Support tables (caniuse.com)</a>, <a href="/gcc/">GCC</a> and <a href="/gnu_fortran/">GNU Fortran</a>'], ["2016-03-27", 'New documentation: <a href="/typescript/">TypeScript</a>'], ["2016-03-06", 'New documentations: <a href="/tensorflow/">TensorFlow</a>, <a href="/haxe/">Haxe</a> and <a href="/ansible/">Ansible</a>'], ["2016-02-28", 'New documentations: <a href="/codeigniter/">CodeIgniter</a>, <a href="/nginx_lua_module/">nginx Lua Module</a> and <a href="/influxdata/">InfluxData</a>'], ["2016-02-15", 'New documentations: <a href="/cakephp/">CakePHP</a>, <a href="/chef/">Chef</a> and <a href="/ramda/">Ramda</a>'], ["2016-01-31", 'New documentations: <a href="/erlang/">Erlang</a> and <a href="/tcl_tk/">Tcl/Tk</a>'], ["2016-01-24", "&ldquo;Multi-version support&rdquo; has landed!"], ["2015-11-22", 'New documentations: <a href="/phoenix/">Phoenix</a>, <a href="/dojo/">Dojo</a>, <a href="/relay/">Relay</a> and <a href="/flow/">Flow</a>'], ["2015-11-08", 'New documentations: <a href="/elixir/">Elixir</a> and <a href="/vagrant/">Vagrant</a>'], ["2015-10-18", 'Added a "Copy to clipboard" button inside each code block.'], ["2015-09-13", 'New documentation: <a href="/phalcon/">Phalcon</a>'], ["2015-08-09", 'New documentation: <a href="/react_native/">React Native</a>'], ["2015-08-03", "Added an icon in the sidebar to constrain the width of the UI (visible when applicable)."], ["2015-08-02", 'New documentations: <a href="/q/">Q</a> and <a href="/opentsdb/">OpenTSDB</a>'], ["2015-07-26", 'Added search aliases (e.g. <code class="_label">$</code> is an alias for <code class="_label">jQuery</code>).\n<a href="/help#aliases">Click here</a> to see the full list. Feel free to suggest more on <a href="https://github.com/freeCodeCamp/devdocs/issues/new" target="_blank" rel="noopener">GitHub</a>.', 'Added <code class="_label">shift + &darr;/&uarr;</code> shortcut for scrolling (same as <code class="_label">alt + &darr;/&uarr;</code>).'], ["2015-07-05", 'New documentations: <a href="/drupal/">Drupal</a>, <a href="/vue/">Vue.js</a>, <a href="/phaser/">Phaser</a> and <a href="/webpack/">webpack</a>'], ["2015-05-24", 'New <a href="/rust/">Rust</a> documentation'], ["2015-04-26", 'New <a href="/apache_http_server/">Apache HTTP Server</a> and <a href="/npm/">npm</a> documentations'], ["2015-03-22", 'New <a href="/meteor/">Meteor</a> and <a href="/mocha/">mocha</a> documentations'], ["2015-02-22", 'Improved <a href="/http/">HTTP</a> documentation', 'New <a href="/minitest/">Minitest</a> documentation'], ["2015-02-16", "The sidebar is now resizable (drag & drop)."], ["2015-02-15", 'New <a href="/iojs/">io.js</a>, <a href="/symfony/">Symfony</a>, <a href="/clojure/">Clojure</a>, <a href="/lua/">Lua</a> and <a href="/yii1/">Yii 1.1</a> documentations'], ["2015-02-08", "New dark theme"], ["2015-01-13", '<a href="/offline">Offline mode</a> has landed!'], ["2014-12-21", 'New <a href="/react/">React</a>, <a href="/rethinkdb/">RethinkDB</a>, <a href="/socketio/">Socket.IO</a>, <a href="/modernizr/">Modernizr</a> and <a href="/bower/">Bower</a> documentations'], ["2014-11-30", 'New <a href="/phpunit/">PHPUnit</a> and <a href="/nokogiri/">Nokogiri</a> documentations'], ["2014-11-16", 'New <a href="/python2/">Python 2</a> documentation'], ["2014-11-09", 'New design\nFeedback welcome on <a href="https://twitter.com/DevDocs" target="_blank" rel="noopener">Twitter</a> and <a href="https://github.com/freeCodeCamp/devdocs" target="_blank" rel="noopener">GitHub</a>.'], ["2014-10-19", 'New <a href="/svg/">SVG</a>, <a href="/marionette/">Marionette.js</a>, and <a href="/mongoose/">Mongoose</a> documentations'], ["2014-10-18", 'New <a href="/nginx/">nginx</a> documentation'], ["2014-10-13", 'New <a href="/xpath/">XPath</a> documentation'], ["2014-09-07", "Updated the HTML, CSS, JavaScript, and DOM documentations with additional content."], ["2014-08-04", 'New <a href="/django/">Django</a> documentation'], ["2014-07-27", 'New <a href="/markdown/">Markdown</a> documentation'], ["2014-07-05", 'New <a href="/cordova/">Cordova</a> documentation'], ["2014-07-01", 'New <a href="/chai/">Chai</a> and <a href="/sinon/">Sinon</a> documentations'], ["2014-06-15", 'New <a href="/requirejs/">RequireJS</a> documentation'], ["2014-06-14", 'New <a href="/haskell/">Haskell</a> documentation'], ["2014-05-25", 'New <a href="/laravel/">Laravel</a> documentation'], ["2014-05-04", 'New <a href="/express/">Express</a>, <a href="/grunt/">Grunt</a>, and <a href="/maxcdn/">MaxCDN</a> documentations'], ["2014-04-06", 'New <a href="/go/">Go</a> documentation'], ["2014-03-30", 'New <a href="/cpp/">C++</a> documentation'], ["2014-03-16", 'New <a href="/yii/">Yii</a> documentation'], ["2014-03-08", "Added path bar."], ["2014-02-22", 'New <a href="/c/">C</a> documentation'], ["2014-02-16", 'New <a href="/moment/">Moment.js</a> documentation'], ["2014-02-12", 'The root/category pages are now included in the search index (e.g. <a href="/#q=CSS">CSS</a>)'], ["2014-01-19", 'New <a href="/d3/">D3.js</a> and <a href="/knockout/">Knockout.js</a> documentations'], ["2014-01-18", 'DevDocs is now available as a <a href="https://marketplace.firefox.com/app/devdocs/">Firefox web app</a>.'], ["2014-01-12", 'Added <code class="_label">alt + g</code> shortcut for searching on Google.', 'Added <code class="_label">alt + r</code> shortcut for revealing the current page in the sidebar.'], ["2013-12-14", 'New <a href="/postgresql/">PostgreSQL</a> documentation'], ["2013-12-13", 'New <a href="/git/">Git</a> and <a href="/redis/">Redis</a> documentations'], ["2013-11-26", 'New <a href="/python/">Python</a> documentation'], ["2013-11-19", 'New <a href="/rails/">Ruby on Rails</a> documentation'], ["2013-11-16", 'New <a href="/ruby/">Ruby</a> documentation'], ["2013-10-24", 'DevDocs is now <a href="https://github.com/freeCodeCamp/devdocs">open source</a>.'], ["2013-10-09", 'DevDocs is now available as a <a href="https://chrome.google.com/webstore/detail/devdocs/mnfehgbmkapmjnhcnbodoamcioleeooe">Chrome web app</a>.'], ["2013-09-22", 'New <a href="/php/">PHP</a> documentation'], ["2013-09-06", 'New <a href="/lodash/">Lo-Dash</a> documentation ', 'On mobile devices you can now search a specific documentation by typing its name and <code class="_label">Space</code>.'], ["2013-09-01", 'New <a href="/jqueryui/">jQuery UI</a> and <a href="/jquerymobile/">jQuery Mobile</a> documentations'], ["2013-08-28", "New smartphone interface\nTested on iOS 6+ and Android 4.1+"], ["2013-08-25", 'New <a href="/ember/">Ember.js</a> documentation'], ["2013-08-18", 'New <a href="/coffeescript/">CoffeeScript</a> documentation', "URL search now automatically opens the first result."], ["2013-08-13", 'New <a href="/angularjs/">Angular.js</a> documentation'], ["2013-08-11", 'New <a href="/sass/">Sass</a> and <a href="/less/">Less</a> documentations'], ["2013-08-05", 'New <a href="/node/">Node.js</a> documentation'], ["2013-08-03", "Added support for OpenSearch"], ["2013-07-30", 'New <a href="/backbone/">Backbone.js</a> documentation'], ["2013-07-27", "You can now customize the list of documentations.\nNew docs will be hidden by default, but you'll see a notification when there are new releases.", 'New <a href="/http/">HTTP</a> documentation'], ["2013-07-15", 'URL search now works with single documentations: <a href="/#q=js%20sort">devdocs.io/#q=js sort</a>'], ["2013-07-13", "Added syntax highlighting", "Added documentation versions"], ["2013-07-11", 'New <a href="/underscore/">Underscore.js</a> documentation ', "Improved compatibility with tablets\nA mobile version is planned as soon as other high priority features have been implemented."], ["2013-07-10", 'You can now search specific documentations.\nSimply type the documentation\'s name and press <code class="_label">Tab</code>.\nThe name is fuzzy matched so you can use abbreviations like <code>js</code> for <code>JavaScript</code>.'], ["2013-07-08", "Improved search with fuzzy matching and better results\nFor example, searching <code>jqmka</code> now returns <code>jQuery.makeArray()</code>.", "DevDocs finally has an icon.", '<code class="_label">space</code> has replaced <code class="_label">alt + space</code> for scrolling down.'], ["2013-07-06", 'New <a href="/dom/">DOM</a> and <a href="/dom_events/">DOM Events</a> documentations\nDevDocs now includes almost all reference documents available on the Mozilla Developer Network.\nBig thank you to Mozilla and all the people that contributed to MDN.', 'Implemented URL search: <a href="/#q=sort">devdocs.io/#q=sort</a>'], ["2013-07-02", 'New <a href="/javascript/">JavaScript</a> documentation'], ["2013-06-28", "DevDocs made the front page of Hacker News!\nHi everyone &mdash; thanks for trying DevDocs.\nPlease bear with me while I fix bugs and scramble to add more docs.\nThis is only v1. There's a lot more to come."], ["2013-06-18", "Initial release"]],
app.templates.offlinePage = e => `<h1 class="_lined-heading">Offline Documentation</h1>\n\n<div class="_docs-tools">\n  <label>\n    <input type="checkbox" name="autoUpdate" value="1" ${app.settings.get("manualUpdate") ? "" : "checked"}>Install updates automatically\n  </label>\n  <div class="_docs-links">\n    <button type="button" class="_btn-link" data-action-all="install">Install all</button><button type="button" class="_btn-link" data-action-all="update"><strong>Update all</strong></button><button type="button" class="_btn-link" data-action-all="uninstall">Uninstall all</button>\n  </div>\n</div>\n\n<div class="_table">\n  <table class="_docs">\n    <tr>\n      <th>Documentation</th>\n      <th class="_docs-size">Size</th>\n      <th>Status</th>\n      <th>Action</th>\n    </tr>\n    ${e}\n  </table>\n</div>\n<p class="_note"><strong>Note:</strong> your browser may delete DevDocs's offline data if your computer is running low on disk space and you haven't used the app in a while. Load this page before going offline to make sure the data is still there.\n<h2 class="_block-heading">Questions & Answers</h2>\n<dl>\n  <dt>How does this work?\n  <dd>Each page is cached as a key-value pair in <a href="https://devdocs.io/dom/indexeddb_api">IndexedDB</a> (downloaded from a single file).<br>\n      The app also uses <a href="https://devdocs.io/dom/service_worker_api/using_service_workers">Service Workers</a> and <a href="https://devdocs.io/dom/web_storage_api">localStorage</a> to cache the assets and index files.\n  <dt>Can I close the tab/browser?\n  <dd>${canICloseTheTab()}\n  <dt>What if I don't update a documentation?\n  <dd>You'll see outdated content and some pages will be missing or broken, because the rest of the app (including data for the search and sidebar) uses a different caching mechanism that's updated automatically.\n  <dt>I found a bug, where do I report it?\n  <dd>In the <a href="https://github.com/freeCodeCamp/devdocs/issues">issue tracker</a>. Thanks!\n  <dt>How do I uninstall/reset the app?\n  <dd>Click <a href="#" data-behavior="reset">here</a>.\n  <dt>Why aren't all documentations listed above?\n  <dd>You have to <a href="/settings">enable</a> them first.\n</dl>`;
var canICloseTheTab = function() {
    if (app.ServiceWorker.isEnabled())
        return ' Yes! Even offline, you can open a new tab, go to <a href="//devdocs.io">devdocs.io</a>, and everything will work as if you were online (provided you installed all the documentations you want to use beforehand). ';
    {
        let e = "aren't available in your browser (or are disabled)";
        return "production" !== app.config.env && (e = "are disabled in your development instance of DevDocs (enable them by setting the <code>ENABLE_SERVICE_WORKER</code> environment variable to <code>true</code>)"),
        ` No. Service Workers ${e}, so loading <a href="//devdocs.io">devdocs.io</a> offline won't work.<br>\nThe current tab will continue to function even when you go offline (provided you installed all the documentations beforehand). `
    }
};
app.templates.offlineDoc = function(e, t) {
    const s = e.isOutdated(t);
    let a = `<tr data-slug="${e.slug}"${s ? ' class="_highlight"' : ""}>\n  <td class="_docs-name _icon-${e.icon}">${e.fullName}</td>\n  <td class="_docs-size">${Math.ceil(e.db_size / 1e5) / 10}&nbsp;<small>MB</small></td>`;
    return a += t && t.installed ? s ? '<td><strong>Outdated</strong></td>\n<td><button type="button" class="_btn-link _bold" data-action="update">Update</button> - <button type="button" class="_btn-link" data-action="uninstall">Uninstall</button></td>' : '<td>Up&#8209;to&#8209;date</td>\n<td><button type="button" class="_btn-link" data-action="uninstall">Uninstall</button></td>' : '<td>-</td>\n<td><button type="button" class="_btn-link" data-action="install">Install</button></td>',
    a + "</tr>"
}
,
app.templates.splash = '<div class="_splash-title">DevDocs</div>',
app.templates.intro = '<div class="_intro"><div class="_intro-message">\n  <a href="#" class="_intro-hide" data-hide-intro>Stop showing this message</a>\n  <h2 class="_intro-title">Welcome!</h2>\n  <p>DevDocs combines multiple API documentations in a fast, organized, and searchable interface.\n     Here\'s what you should know before you start:\n  <ol class="_intro-list">\n    <li>Open the <a href="/settings">Preferences</a> to enable more docs and customize the UI.\n    <li>You don\'t have to use your mouse &mdash; see the list of <a href="/help#shortcuts">keyboard shortcuts</a>.\n    <li>The search supports fuzzy matching (e.g. "bgcp" brings up "background-clip").\n    <li>To search a specific documentation, type its name (or an abbr.), then Tab.\n    <li>You can search using your browser\'s address bar &mdash; <a href="/help#browser_search">learn how</a>.\n    <li>DevDocs works <a href="/offline">offline</a>, on mobile, and can be installed as web app.\n    <li>For the latest news, follow <a href="https://twitter.com/DevDocs">@DevDocs</a>.\n    <li>DevDocs is free and <a href="https://github.com/freeCodeCamp/devdocs">open source</a>.\n        <img src="https://img.shields.io/github/stars/freeCodeCamp/devdocs.svg?style=social" aria-hidden="true" height="20">\n    <li>And if you\'re new to coding, check out <a href="https://www.freecodecamp.org/">freeCodeCamp\'s open source curriculum</a>.\n  </ol>\n  <p>Happy coding!\n</div></div>',
app.templates.mobileIntro = '<div class="_mobile-intro">\n  <h2 class="_intro-title">Welcome!</h2>\n  <p>DevDocs combines multiple API documentations in a fast, organized, and searchable interface.\n     Here\'s what you should know before you start:\n  <ol class="_intro-list">\n    <li>Pick your docs in the <a href="/settings">Preferences</a>.\n    <li>The search supports fuzzy matching.\n    <li>To search a specific documentation, type its name (or an abbr.), then Space.\n    <li>For the latest news, follow <a href="https://twitter.com/DevDocs">@DevDocs</a>.\n    <li>DevDocs is <a href="https://github.com/freeCodeCamp/devdocs">open source</a>.\n  </ol>\n  <p>Happy coding!\n  <a class="_intro-hide" data-hide-intro>Stop showing this message</a>\n</div>',
app.templates.androidWarning = '<div class="_mobile-intro">\n  <h2 class="_intro-title">Hi there</h2>\n  <p>DevDocs is running inside an Android WebView. Some features may not work properly.\n  <p>If you downloaded an app called DevDocs on the Play Store, please uninstall it \u2014 it\'s made by someone who is using (and profiting from) the name DevDocs without permission.\n  <p>To install DevDocs on your phone, visit <a href="https://devdocs.io" target="_blank" rel="noopener">devdocs.io</a> in Chrome and select "Add to home screen" in the menu.\n</div>';
const themeOption = ({label: e, value: t}, s) => `<label class="_settings-label _theme-label">\n  <input type="radio" name="theme" value="${t}"${s.theme === t ? " checked" : ""}>\n  ${e}\n</label>`;
app.templates.settingsPage = e => `<h1 class="_lined-heading">Preferences</h1>\n\n<div class="_settings-fieldset">\n  <h2 class="_settings-legend">Theme:</h2>\n  <div class="_settings-inputs">\n    ${e.autoSupported ? themeOption({
    label: "Automatic <small>Matches system setting</small>",
    value: "auto"
}, e) : ""}\n    ${themeOption({
    label: "Light",
    value: "default"
}, e)}\n    ${themeOption({
    label: "Dark",
    value: "dark"
}, e)}\n  </div>\n</div>\n\n<div class="_settings-fieldset">\n  <h2 class="_settings-legend">General:</h2>\n\n  <div class="_settings-inputs">\n    <label class="_settings-label _setting-max-width">\n      <input type="checkbox" form="settings" name="layout" value="_max-width"${e["_max-width"] ? " checked" : ""}>Enable fixed-width layout\n    </label>\n    <label class="_settings-label _setting-text-justify-hyphenate">\n      <input type="checkbox" form="settings" name="layout" value="_text-justify-hyphenate"${e["_text-justify-hyphenate"] ? " checked" : ""}>Enable justified layout and automatic hyphenation\n    </label>\n    <label class="_settings-label _hide-on-mobile">\n      <input type="checkbox" form="settings" name="layout" value="_sidebar-hidden"${e["_sidebar-hidden"] ? " checked" : ""}>Automatically hide and show the sidebar\n      <small>Tip: drag the edge of the sidebar to resize it.</small>\n    </label>\n    <label class="_settings-label _hide-on-mobile">\n      <input type="checkbox" form="settings" name="noAutofocus" value="_no-autofocus"${e.noAutofocus ? " checked" : ""}>Disable autofocus of search input\n    </label>\n    <label class="_settings-label">\n      <input type="checkbox" form="settings" name="autoInstall" value="_auto-install"${e.autoInstall ? " checked" : ""}>Automatically download documentation for offline use\n      <small>Only enable this when bandwidth isn't a concern to you.</small>\n    </label>\n    <label class="_settings-label _hide-in-development">\n      <input type="checkbox" form="settings" name="analyticsConsent"${e.analyticsConsent ? " checked" : ""}>Enable tracking cookies\n      <small>With this checked, we enable Google Analytics and Gauges to collect anonymous traffic information.</small>\n    </label>\n    <label class="_settings-label _hide-on-mobile">\n      <input type="checkbox" form="settings" name="noDocSpecificIcon"${e.noDocSpecificIcon ? " checked" : ""}>Disable Language-specific Doc Favicons\n      <small>With this checked, we will display the default DevDocs icon for all pages.</small>\n    </label>\n  </div>\n</div>\n\n<div class="_settings-fieldset _hide-on-mobile">\n  <h2 class="_settings-legend">Scrolling:</h2>\n\n  <div class="_settings-inputs">\n    <label class="_settings-label">\n      <input type="checkbox" form="settings" name="smoothScroll" value="1"${e.smoothScroll ? " checked" : ""}>Use smooth scrolling\n    </label>\n    <label class="_settings-label _setting-native-scrollbar">\n      <input type="checkbox" form="settings" name="layout" value="_native-scrollbars"${e["_native-scrollbars"] ? " checked" : ""}>Use native scrollbars\n    </label>\n    <label class="_settings-label">\n      <input type="checkbox" form="settings" name="arrowScroll" value="1"${e.arrowScroll ? " checked" : ""}>Use arrow keys to scroll the main content area\n      <small>With this checked, use <code class="_label">shift</code> + <code class="_label">&uarr;</code><code class="_label">&darr;</code><code class="_label">&larr;</code><code class="_label">&rarr;</code> to navigate the sidebar.</small>\n    </label>\n    <label class="_settings-label">\n      <input type="checkbox" form="settings" name="spaceScroll" value="1"${e.spaceScroll ? " checked" : ""}>Use spacebar to scroll during search\n    </label>\n    <label class="_settings-label">\n      <input type="number" step="0.1" form="settings" name="spaceTimeout" min="0" max="5" value="${e.spaceTimeout}"> Delay until you can scroll by pressing space\n      <small>Time in seconds</small>\n    </label>\n  </div>\n</div>\n\n<p class="_hide-on-mobile">\n  <button type="button" class="_btn" data-action="export">Export</button>\n  <label class="_btn _file-btn"><input type="file" form="settings" name="import" accept=".json">Import</label>\n\n<p>\n  <button type="button" class="_btn-link _reset-btn" data-behavior="reset">Reset all preferences and data</button>`,
app.templates.typePage = e => ` <h1>${e.doc.fullName} / ${e.name}</h1>\n<ul class="_entry-list">${app.templates.render("typePageEntry", e.entries())}</ul> `,
app.templates.typePageEntry = e => `<li><a href="${e.fullPath()}">${$.escape(e.name)}</a></li>`,
app.templates.path = function(e, t, s) {
    const a = '<svg class="_path-arrow"><use xlink:href="#icon-dir"/></svg>';
    let n = `<a href="${e.fullPath()}" class="_path-item _icon-${e.icon}">${e.fullName}</a>`;
    return t && (n += `${a}<a href="${t.fullPath()}" class="_path-item">${t.name}</a>`),
    s && (n += `${a}<span class="_path-item">${$.escape(s.name)}</span>`),
    n
}
;
const {templates: templates} = app
  , arrow = '<svg class="_list-arrow"><use xlink:href="#icon-dir"/></svg>';
templates.sidebarDoc = function(e, t) {
    null == t && (t = {});
    let s = `<a href="${e.fullPath()}" class="_list-item _icon-${e.icon} `;
    return s += t.disabled ? "_list-disabled" : "_list-dir",
    s += `" data-slug="${e.slug}" title="${e.fullName}" tabindex="-1">`,
    t.disabled ? s += `<span class="_list-enable" data-enable="${e.slug}">Enable</span>` : s += arrow,
    e.release && (s += `<span class="_list-count">${e.release}</span>`),
    s += `<span class="_list-text">${e.name}`,
    (t.fullName || t.disabled && e.version) && (s += ` ${e.version}`),
    s + "</span></a>"
}
,
templates.sidebarType = e => `<a href="${e.fullPath()}" class="_list-item _list-dir" data-slug="${e.slug}" tabindex="-1">${arrow}<span class="_list-count">${e.count}</span><span class="_list-text">${$.escape(e.name)}</span></a>`,
templates.sidebarEntry = e => `<a href="${e.fullPath()}" class="_list-item _list-hover" tabindex="-1">${$.escape(e.name)}</a>`,
templates.sidebarResult = function(e) {
    let t = e.isIndex() && app.disabledDocs.contains(e.doc) ? `<span class="_list-enable" data-enable="${e.doc.slug}">Enable</span>` : '<span class="_list-reveal" data-reset-list title="Reveal in list"></span>';
    return e.doc.version && !e.isIndex() && (t += `<span class="_list-count">${e.doc.short_version}</span>`),
    `<a href="${e.fullPath()}" class="_list-item _list-hover _list-result _icon-${e.doc.icon}" tabindex="-1">${t}<span class="_list-text">${$.escape(e.name)}</span></a>`
}
,
templates.sidebarNoResults = function() {
    let e = ' <div class="_list-note">No results.</div> ';
    return app.isSingleDoc() || app.disabledDocs.isEmpty() || (e += '<div class="_list-note">Note: documentations must be <a href="/settings" class="_list-note-link">enabled</a> to appear in the search.</div>'),
    e
}
,
templates.sidebarPageLink = e => `<span role="link" class="_list-item _list-pagelink">Show more\u2026 (${e})</span>`,
templates.sidebarLabel = function(e, t) {
    null == t && (t = {});
    let s = '<label class="_list-item';
    return e.version || (s += ` _icon-${e.icon}`),
    s += `"><input type="checkbox" name="${e.slug}" class="_list-checkbox" `,
    t.checked && (s += "checked"),
    s + `><span class="_list-text">${e.fullName}</span></label>`
}
,
templates.sidebarVersionedDoc = function(e, t, s) {
    null == s && (s = {});
    let a = `<div class="_list-item _list-dir _list-rdir _icon-${e.icon}`;
    return s.open && (a += " open"),
    a + `" tabindex="0">${arrow}${e.name}</div><div class="_list _list-sub">${t}</div>`
}
,
templates.sidebarDisabled = e => `<h6 class="_list-title">${arrow}Disabled (${e.count}) <a href="/settings" class="_list-title-link" tabindex="-1">Customize</a></h6>`,
templates.sidebarDisabledList = e => `<div class="_disabled-list">${e}</div>`,
templates.sidebarDisabledVersionedDoc = (e, t) => `<a class="_list-item _list-dir _icon-${e.icon} _list-disabled" data-slug="${e.slug_without_version}" tabindex="-1">${arrow}${e.name}</a><div class="_list _list-sub">${t}</div>`,
templates.docPickerHeader = '<div class="_list-picker-head"><span>Documentation</span> <span>Enable</span></div>',
templates.docPickerNote = '<div class="_list-note">Tip: for faster and better search results, select only the docs you need.</div>\n<a href="https://trello.com/b/6BmTulfx/devdocs-documentation" class="_list-link" target="_blank" rel="noopener">Vote for new documentation</a>',
app.templates.tipKeyNav = () => `<p class="_notif-text">\n  <strong>ProTip</strong>\n  <span class="_notif-info">(click to dismiss)</span>\n<p class="_notif-text">\n  Hit ${app.settings.get("arrowScroll") ? '<code class="_label">shift</code> +' : ""} <code class="_label">&darr;</code> <code class="_label">&uarr;</code> <code class="_label">&larr;</code> <code class="_label">&rarr;</code> to navigate the sidebar.<br>\n  Hit <code class="_label">space / shift space</code>${app.settings.get("arrowScroll") ? ' or <code class="_label">&darr;/&uarr;</code>' : ', <code class="_label">alt &darr;/&uarr;</code> or <code class="_label">shift &darr;/&uarr;</code>'} to scroll the page.\n<p class="_notif-text">\n  <a href="/help#shortcuts" class="_notif-link">See all keyboard shortcuts</a>`;
try {
    "production" === app.config.env && ("1" === Cookies.get("analyticsConsent") ? (!function(e, t, s, a, n, i, r) {
        e.GoogleAnalyticsObject = n,
        e[n] = e[n] || function() {
            (e[n].q = e[n].q || []).push(arguments)
        }
        ,
        e[n].l = 1 * new Date,
        i = t.createElement(s),
        r = t.getElementsByTagName(s)[0],
        i.async = 1,
        i.src = a,
        r.parentNode.insertBefore(i, r)
    }(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga"),
    ga("create", "UA-5544833-12", "devdocs.io"),
    page.track((function() {
        ga("send", "pageview", {
            page: location.pathname + location.search + location.hash,
            dimension1: app.router.context && app.router.context.doc && app.router.context.doc.slug_without_version
        })
    }
    )),
    page.track((function() {
        window._gauges ? _gauges.push(["track"]) : function() {
            var e = document.createElement("script");
            e.type = "text/javascript",
            e.async = !0,
            e.id = "gauges-tracker",
            e.setAttribute("data-site-id", "51c15f82613f5d7819000067"),
            e.src = "https://secure.gaug.es/track.js";
            var t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(e, t)
        }()
    }
    ))) : resetAnalytics())
} catch (e) {}
var init = function() {
    return document.removeEventListener("DOMContentLoaded", init, !1),
    document.body ? app.init() : setTimeout(init, 42)
};
document.addEventListener("DOMContentLoaded", init, !1);
