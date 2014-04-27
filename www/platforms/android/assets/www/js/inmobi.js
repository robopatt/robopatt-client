(function () {
    if (!window._inmobi) {
        var A = "http://i.w.inmobi.com/showad",
            z = "http://cf.cdn.inmobi.com/ad/adFormats/",
            G = "pr-JSAC-CTCTA-20130617",
            h = function () {
                var J = "",
                    H = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                    I;
                for (I = 0; I < 6; I++) {
                    J += H.charAt(Math.floor(Math.random() * H.length))
                }
                return J
            }, n = function () {
                return F + h()
            }, y = {
                siteid: "mk-siteid",
                slot: "mk-ad-slot",
                age: "u-age",
                gender: "u-gender",
                location: "u-location",
                interests: "u-interests",
                postalCode: "u-postalCode",
                areaCode: "u-areaCode",
                dateOfBirth: "u-dateOfBirth",
                income: "u-income",
                latlong: "u-latlong-accu",
                education: "u-education",
                ethnicity: "u-ethnicity",
                adtype: "adtype",
                targetWindow: "targetWindow",
                testdeviceid: "d_tdid"
            }, w = {
                "1": {
                    width: 120,
                    height: 20
                },
                "2": {
                    width: 168,
                    height: 28
                },
                "3": {
                    width: 216,
                    height: 36
                },
                "4": {
                    width: 300,
                    height: 50
                },
                "9": {
                    width: 320,
                    height: 48
                },
                "10": {
                    width: 300,
                    height: 250
                },
                "11": {
                    width: 728,
                    height: 90
                },
                "12": {
                    width: 468,
                    height: 60
                },
                "13": {
                    width: 120,
                    height: 600
                },
                "14": {
                    width: 320,
                    height: 480
                },
                "15": {
                    width: 320,
                    height: 50
                },
                "16": {
                    width: 768,
                    height: 1024
                },
                "17": {
                    width: 800,
                    height: 1280
                }
            }, r = ["slot", "siteid"],
            F = "inmobi-iframe-",
            C = "",
            j = [],
            l = function (H) {
                for (var I = 0; I < j.length; I++) {
                    if (j[I].iFrameRef === H) {
                        return j[I]
                    }
                }
                return null
            }, D = function (J) {
                try {
                    J.iFrameRef.parentNode.parentNode.removeChild(J.iFrameRef.parentNode)
                } catch (K) {}
                var I, H = j.length;
                for (I = 0; I < H; I++) {
                    if (j[I] === J) {
                        j.splice(I, 1);
                        I--
                    }
                }
            }, f = function (I) {
                for (var H = 0; H < j.length; H++) {
                    if (j[H].iFrameRef.parentNode.parentNode == I) {
                        return j[H]
                    }
                }
                return null
            }, a = function (H) {
                if (typeof (H) == "object") {
                    return H
                }
                if (JSON) {
                    return JSON.parse(H)
                } else {
                    return _inmobi.globalEval("(" + H + ")")
                }
            }, E = function (H) {
                return w["" + H.config.slot]
            }, v = function (K) {
                var J, H, I = K.config;
                if (I === null) {
                    throw "Expected config object, got null, make sure inmobi_conf variable is set for each ad slot."
                }
                if (typeof I !== "object") {
                    throw "Expected config object, got " + (typeof I) + " make sure inmobi_conf variable is set for each ad slot."
                }
                for (J = 0; J < r.length; J++) {
                    H = r[J];
                    if (!I.hasOwnProperty(H) || I[H] === null || I[H].length === 0) {
                        throw "inmobi.js: ERROR: missing required config parameter '" + H + "'"
                    }
                }
                if (!w["" + I.slot]) {
                    throw "inmobi.js: ERROR: inmobi_vars config slot param, '" + I.slot + "', is not a valid slot number."
                }
            }, x = function (J) {
                var K = [],
                    H, I = J.config;
                for (H in I) {
                    if (y.hasOwnProperty(H)) {
                        K.push(encodeURIComponent(y[H]) + "=" + encodeURIComponent(I[H]))
                    }
                }
                K.push("mk-ads=1");
                K.push("mk-version=" + encodeURIComponent(G));
                K.push("format=html");
                K.push("__t=" + (new Date()).getTime() + "-" + h());
                return K.join("&")
            }, t = function (H) {
                return A + (A.indexOf("?") === -1 ? "?" : "&") + x(H)
            }, m = function (K, J) {
                if (typeof J == "object" && J != null) {
                    K.config = J
                }
                if (typeof K.config == "undefined" && typeof inmobi_conf == "object") {
                    K.config = inmobi_conf
                }
                var M, H, I;
                console.log("load new ad called");
                window.clearTimeout(K.refresh);
                if (typeof (K.config) == "object" && typeof (K.config.autoRefresh) != "undefined") {
                    H = K.config.autoRefresh - 0;
                    if (!isNaN(H)) {
                        if (H < 20) {
                            console.log("Minimum refresh interval is 20")
                        } else {
                            K.refresh = window.setTimeout(function (N) {
                                N.getNewAd()
                            }, H * 1000, K)
                        }
                    } else {
                        console.log("Refresh interval is invalid")
                    }
                }
                try {
                    if (!window.navigator.onLine) {
                        return
                    }
                } catch (L) {}
                if (K.adData.state == "expanded" || (K.adData.state == "loading" && typeof (K.config.adtype) != "undefined" && K.config.adtype == "int")) {
                    return
                }
                try {
                    M = K.iFrame.parentNode.getElementsByClassName("inmobi-rm")[0];
                    if (M) {
                        M.parentNode.removeChild(M)
                    }
                } catch (L) {}
                v(K);
                I = E(K);
                if (!K.iFrameRef) {
                    K.iFrameRef = document.createElement("iframe");
                    K.iFrameRef.style.border = "none";
                    K.iFrameRef.style.overflow = "hidden";
                    K.iFrameRef.id = _inmobi.generateIframeId();
                    K.iFrameRef.setAttribute("class", "inmobi-ad");
                    K.iFrameRef.setAttribute("scrolling", "no")
                } else {
                    K.iFrameRef.style.width = I.width + "px";
                    K.iFrameRef.style.height = I.height + "px"
                }
                K.iFrameRef.src = t(K) + "&iframe=" + K.iFrameRef.id;
                K.iFrameRef.style.display = "block";
                K.iFrameRef.style.width = K.iFrameRef.parentNode.style.width = I.width + "px";
                K.iFrameRef.style.height = K.iFrameRef.parentNode.style.height = I.height + "px";
                return K
            }, p = function (J, I) {
                var K = J.iFrameRef.parentNode.getElementsByClassName("inmobi-rm")[0],
                    H = J.iFrameRef.id.replace(/iframe/, "div");
                if (!K) {
                    K = J.iFrameRef.parentNode.insertBefore(document.createElement("div"), J.iFrameRef);
                    K.id = H;
                    K.className = "inmobi-rm"
                }
                K.innerHTML = I.html;
                scripts = K.getElementsByTagName("script");
                for (i = 0; i < scripts.length; i++) {
                    script = scripts[i];
                    if (script.src) {
                        newScript = K.ownerDocument.createElement("script");
                        newScript.src = script.src;
                        if (script.parentNode) {
                            script.parentNode.replaceChild(newScript, script)
                        }
                    } else {
                        _inmobi.globalEval(script.textContent)
                    }
                }
                K.style.width = I.width + "px";
                K.style.height = I.height + "px";
                J.iFrameRef.style.display = "none"
            }, c = function (J, K, L) {
                var I = document.createElement("script"),
                    H;
                if ((J.adData.state != "default") && (J.adData.state != "init")) {
                    console.log("InMobi: adFormat cannot be changed when in not in default or init state");
                    return
                }
                if (J.format) {
                    J.format.deinit(J);
                    delete J.format
                }
                if (K == "") {
                    return
                }
                if (_inmobi.adFormats[K]) {
                    H = _inmobi.adFormats[K]();
                    H.init(J, L);
                    J.format = H;
                    return
                }
                I.setAttribute("src", z + K + ".js");
                I.onload = function () {
                    H = _inmobi.adFormats[K]();
                    H.init(J, L);
                    J.format = H
                };
                document.head.appendChild(I)
            }, q = function (O, M) {
                var N = O.adData,
                    I = M.url,
                    L = M.expandProperties,
                    J, P, K = O.config,
                    H = O.iFrameRef;
                if (N.state == "expanded") {
                    O.postToContainer("fireEvent", {
                        event: "error",
                        eventData: "Can expanded when in expanded state."
                    });
                    return
                }
                if (typeof (I) != "undefined" && I != null && I != "") {
                    H.src = I
                }
                if (typeof (L.width) == "undefined") {
                    L.width = 0
                }
                if (typeof (L.height) == "undefined") {
                    L.height = 0
                }
                if (typeof (L.useCustomClose) == "undefined") {
                    L.useCustomClose = false
                }
                if (typeof (L.isModal) == "undefined") {
                    L.isModal = false
                }
                if (isNaN(parseInt(L.width))) {
                    L.width = 0
                }
                if (isNaN(parseInt(L.height))) {
                    L.height = 0
                }
                if (L.width == 0) {
                    L.width = window.innerWidth
                }
                if (L.height == 0) {
                    L.height = window.innerHeight
                }
                if (L.width > 0) {
                    H.parentNode.style.width = H.style.width = L.width + "px"
                }
                if (L.height > 0) {
                    H.parentNode.style.height = H.style.height = L.height + "px"
                }
                if (!L.useCustomClose) {
                    J = document.createElement("div");
                    J.setAttribute("class", "inmobi-close-button");
                    P = (parseInt(H.style.width) - 50);
                    P = (P > 0 ? P : 0) + "px";
                    J.setAttribute("style", "position: absolute; margin-left:" + P + ";");
                    J.innerHTML = "<img src='http://inmobi-sandbox.s3.amazonaws.com/image/close.png' width='50px' height='50px' onclick='window._inmobi.closeAd(window._inmobi.getAd(event.target.parentNode.parentNode.getElementsByTagName(\"iframe\")[0]));' />";
                    H.parentNode.insertBefore(J, H.parentNode.firstChild)
                }
                if ((typeof (K.adtype) == "undefined") || K.adtype != "int") {
                    O.setState("expanded");
                    O.postToContainer("fireEvent", {
                        event: "stateChange",
                        eventData: "expanded"
                    })
                }
            }, e = function (I) {
                var H = E(I);
                I.iFrameRef.parentNode.style.width = I.iFrameRef.style.width = H.width + "px";
                I.iFrameRef.parentNode.style.height = I.iFrameRef.style.height = H.height + "px"
            }, b = function (H) {
                k(H)
            }, k = function (J) {
                var K = J.iFrameRef.parentNode.getElementsByClassName("inmobi-close-button"),
                    I = J.config,
                    H = J.adData;
                if (K.length > 0) {
                    K[0].parentNode.removeChild(K[0])
                }
                if ((typeof (I.adtype) == "undefined") || I.adtype != "int") {
                    if (H.state != "expanded") {
                        J.postToContainer("fireEvent", {
                            event: "error",
                            eventData: "Can't close a non-expanded ad."
                        });
                        return
                    }
                    e(J);
                    J.setState("default");
                    J.postToContainer("fireEvent", {
                        event: "stateChange",
                        eventData: "default"
                    })
                } else {
                    J.setState("init");
                    J.iFrameRef.parentNode.style.height = J.iFrameRef.style.height = "0px";
                    J.iFrameRef.src = "";
                    _inmobi.dispatchEvent("close", {
                        container: J.iFrameRef.parentNode
                    })
                }
            }, o = function (H, I) {
                return {
                    iFrameRef: H,
                    config: I,
                    adData: {
                        state: "init"
                    },
                    refresh: null,
                    getNewAd: function (J) {
                        return m(this, J)
                    },
                    setState: function (J) {
                        this.adData.state = J;
                        if (typeof this.stateChanged == "function") {
                            this.stateChanged(J)
                        }
                    },
                    stateChanged: function (J) {},
                    postToContainer: function (K, J) {
                        this.iFrameRef.contentWindow.postMessage({
                            action: K,
                            data: J,
                            inmobiMessage: true
                        }, "*")
                    }
                }
            }, g = function (J) {
                var H, K, I = null;
                for (H = 0; H < j.length; H++) {
                    if (j[H].iFrameRef.contentWindow === J.source) {
                        I = j[H]
                    }
                }
                if (I != null) {
                    K = a(J.data);
                    if (K.action != undefined) {
                        C = K.action
                    }
                    switch (K.topic) {
                        case "showAdInParent":
                            p(I, K.ad);
                            break;
                        case "nfr":
                            if (typeof I.config.onError == "function") {
                                I.config.onError("nfr")
                            }
                            break
                    }
                    switch (K.action) {
                        case "error":
                            if (typeof I.config.onError == "function") {
                                I.config.onError(K.data.message)
                            }
                            break;
                        case "collapse":
                            b(I);
                            break;
                        case "close":
                            b(I);
                            break;
                        case "expand":
                            q(I, K.data);
                            break;
                        case "log":
                            console.log(K.data);
                            break;
                        case "useAdFormat":
                            c(I, K.data.format, K.data.params);
                            break
                    }
                }
            }, B = function (H) {
                var I = "";
                if (typeof (H) != "undefined" && typeof (H.sticky) != "undefined") {
                    switch (H.sticky) {
                        case "top":
                        case "left":
                            I = "top:0px;left:0px;";
                            break;
                        case "right":
                            I = "top:0px;right:0px;";
                            break;
                        case "bottom":
                            I = "bottom:0px;left:0px;";
                            break
                    }
                }
                if (I == "") {
                    return ""
                }
                return "position:fixed;" + I
            }, d = function (H) {
                var K = n(),
                    L = "",
                    J, I;
                L = B(H);
                document.write('<div style="display:inline-block;' + L + '"><iframe scrolling="no" class="inmobi-ad" id="' + K + '" style="border:none;overflow:hidden;"></iframe></div>');
                J = document.getElementById(K);
                I = o(J, H);
                u(I, H)
            }, s = function (H) {
                var K = n(),
                    L = "",
                    J, I;
                L = B(H);
                J = document.createElement("iframe"), div = document.createElement("div");
                div.setAttribute("style", "display:inline-block;" + L);
                J.setAttribute("scrolling", "no");
                J.setAttribute("class", "inmobi-ad");
                J.setAttribute("id", K);
                J.setAttribute("style", "border:none;overflow:hidden;");
                div.appendChild(J);
                I = o(J, H);
                I.getNewAd(H);
                u(I, H);
                return div
            }, u = function (I, H) {
                I.iFrameRef.width = I.iFrameRef.style.width = "0px";
                I.iFrameRef.height = I.iFrameRef.style.height = "0px";
                I.iFrameRef.style.backgroundColor = "white";
                j.push(I);
                if (!(typeof (H) != "undefined" && typeof (H.manual) != "undefined" && H.manual)) {
                    I.getNewAd()
                }
                if (typeof H.onLoad == "function") {
                    iframe.addEventListener("load", function (J) {
                        H.onLoad(J)
                    }, false)
                }
            };
        window._inmobi = {
            events: ["close"],
            listeners: {},
            getNewAd: function (J, H) {
                var I = f(J);
                if (I == null) {
                    try {
                        if (typeof H != "object") {
                            H = window.inmobi_conf
                        }
                        delete window.inmobi_conf.manual;
                        J.appendChild(s(H))
                    } catch (K) {
                        console.log("IM: Something went wrong. Please check integration. Error: " + K)
                    }
                } else {
                    if (typeof I == "object") {
                        I.getNewAd(H)
                    }
                }
            },
            getAd: function (I, H) {
                return l(I)
            },
            closeAd: function (H) {
                k(H)
            },
            addEventListener: function (H, I) {
                if (this.events.indexOf(H) == -1) {
                    throw "inmobi.js: ERROR: Unknown event type '" + H + "'"
                }
                if (!this.listeners[H]) {
                    this.listeners[H] = []
                }
                this.listeners[H].push(I)
            },
            dispatchEvent: function (J, H) {
                var I;
                if (this.events.indexOf(J) == -1) {
                    throw "inmobi.js: ERROR: Unknown event type '" + J + "'"
                }
                if (!this.listeners[J]) {
                    return
                }
                for (I = 0; I < this.listeners[J].length; I++) {
                    (this.listeners[J][I])(H)
                }
            },
            writeIframe: function (H) {
                d(H)
            },
            removeAd: function (H) {
                D(H)
            },
            adFormats: {}
        };
        window.addEventListener("message", g, false)
    }
    if (typeof inmobi_conf == "undefined") {
        inmobi_conf = {
            manual: true
        }
    }
    if (!inmobi_conf.manual) {
        _inmobi.writeIframe(inmobi_conf)
    }
})();
(function () {
    if (!window._inmobi.globalEval) {
        window._inmobi.globalEval = function (a) {
            return eval(a)
        }
    }
})();