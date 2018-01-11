var flagInjectChromeBridge = true;

if (window.PP_CB_INJECTED || document && document.getElementById("cb-injected")) {
    if (!window.PP) {
        flagInjectChromeBridge = true;
    } else {
        flagInjectChromeBridge = false;
        console.log("Chrome bridge code already injected - not doing it again!");
    }
}

if (flagInjectChromeBridge) {
    console.log("Injecting Chrome bridge code.");
    window.PP_CB_INJECTED = true;
    window.doNotClobber = true;
    window.PP_CB_ID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
        var b = Math.random() * 16 | 0, c = a == "x" ? b : b & 3 | 8;
        return c.toString(16);
    });
    if (document && document.getElementById("cb-injected")) {
        var cbj = document.getElementById("cb-injected");
        cbj.setAttribute("cb-id", window.PP_CB_ID);
        var cbc = parseInt(cbj.getAttribute("cb-count")) + 1;
        cbj.setAttribute("cb-count", cbc);
    }
    window.setTimeout(function() {
        if (document && !document.getElementById("cb-injected")) {
            var a = document.createElement("div");
            if (a && a.style) {
                a.id = "cb-injected";
                a.setAttribute("cb-id", window.PP_CB_ID);
                a.setAttribute("cb-count", "1");
                a.style.display = "none";
                var b = document.getElementsByTagName("body");
                if (b && b.length) {
                    b[0].appendChild(a);
                }
            }
        }
    }, 5e3);
    var namespace = {
        addon: {},
        attach: {},
        backend: {},
        bg: {
            task: {}
        },
        cb: {},
        cloud: {},
        crawling: {},
        cs: {},
        files: {},
        fg: {},
        format: {},
        iframe: {},
        library: {},
        pdf: {},
        plugin: {},
        pop: {},
        guru: {
            crawling: {},
            db: {},
            format: {},
            deduplication: {}
        },
        scratch: {},
        target: {},
        test: {},
        upload: {},
        webimport: {},
        wizard: {},
        write: {}
    };
    function isBrowserEnvironment() {
        return typeof window === "object" && typeof window.document === "object" && !isNodeEnvironment();
    }
    function isNodeEnvironment() {
        return typeof module == "object" && module && typeof module.exports === "object";
    }
    function isChromeEnvironment() {
        return typeof window === "object" && typeof window.chrome === "object";
    }
    if (isNodeEnvironment()) {
        var PP = namespace;
        PP.ent = require("ent");
        module.exports = PP;
    }
    if (!isBrowserEnvironment()) {
        var window = {};
        if (!global.isPaperpileCiteServerInstance) {
            var $ = require("cheerio");
            $.prototype.filterNode = function(a) {
                var b = a.toLowerCase();
                return this.find("*").filter(function() {
                    var a = this.name.toLowerCase();
                    return a === b;
                });
            };
            var $xmlNodeJs = $.load("XMLSTRING", {
                xmlMode: true
            });
            var xhrc = require("xmlhttprequest-cookie");
            var XMLHttpRequest = xhrc.XMLHttpRequest;
            var CookieJar = xhrc.CookieJar;
            var userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36";
        }
    }
    if (window.ppAlreadyExists === undefined) {
        window.ppAlreadyExists = false;
    }
    if (window.PP) {
        console.log("window.PP already exists -- not loading singletons");
        window.ppAlreadyExists = true;
    } else {
        window.PP = namespace;
        var PP = window.PP;
    }
    if (window.document) {
        var runningNode = document.getElementById("pp-extension-running");
        if (runningNode) {
            window.extensionExists = true;
        }
    }
    if (window.isWorker) {
        var PP = namespace;
    }
    var extV = "344";
    var webappV = "344";
    var urlBase = "https://paperpile.com";
    var placeholderRegex = /^__PP_/;
    if (extV.match(placeholderRegex) && webappV.match(placeholderRegex)) {
        window.PP_EXTENSION_VERSION = 0;
        window.PP_WEBAPP_VERSION = 0;
        window.PP_URL_BASE = "http://127.0.0.1:8080";
    } else {
        window.PP_EXTENSION_VERSION = extV;
        window.PP_WEBAPP_VERSION = webappV;
        window.PP_URL_BASE = urlBase;
    }
    if (typeof require !== "undefined" && typeof module !== "undefined" && "exports" in module) {
        module.exports = PP;
    } else {
        if (!window.isWorker) {}
    }
    if (!window.ppAlreadyExists && window.$) {
        $.fn.filterNode = function(a) {
            var b = a.toLowerCase();
            return this.find("*").filter(function() {
                var a = this.nodeName.toLowerCase();
                return a === b;
            });
        };
    }
    function createSingleton(a, b, c) {
        if (isBrowserEnvironment()) {
            if (window.ppAlreadyExists === true && window.doNotClobber === true) {
                return;
            }
        }
        a[c] = new a[b]();
    }
    PP.Class = function() {};
    PP.Class.extend = function(a) {
        var b = function(a) {
            if (a && PP.Utils.isObject(a)) {
                PP.Utils.apply(this, a);
            }
            if (this.debug === true) {
                this.c = console;
            } else {
                this.c = {
                    log: function() {},
                    warn: function() {},
                    error: function() {
                        console.error(arguments);
                    }
                };
            }
            if (this.initialize) {
                this.initialize.apply(this, arguments);
                if (this.debug === true) {
                    this.c = console;
                }
            }
        };
        var c = function() {};
        c.prototype = this.prototype;
        var d = new c();
        d.constructor = b;
        b.prototype = d;
        for (var e in this) {
            if (this.hasOwnProperty(e) && e !== "prototype") {
                b[e] = this[e];
            }
        }
        if (a.statics) {
            PP.Utils.extend(b, a.statics);
            delete a.statics;
        }
        if (a.includes) {
            PP.Utils.extend.apply(null, [ d ].concat(a.includes));
            delete a.includes;
        }
        if (a.options && d.options) {
            a.options = PP.Utils.extend({}, d.options, a.options);
        }
        PP.Utils.extend(d, a);
        return b;
    };
    (function() {
        var a = Object.prototype, b = a.toString, c = function() {}, d;
        PP.Utils = {
            languages: {
                aa: {
                    n: [ "Afar" ],
                    a3: "aar"
                },
                ab: {
                    n: [ "Abkhazian" ],
                    a3: "abk"
                },
                af: {
                    n: [ "Afrikaans" ],
                    a3: "afr"
                },
                ak: {
                    n: [ "Akan" ],
                    a3: "aka"
                },
                sq: {
                    n: [ "Albanian" ],
                    a3: "alb"
                },
                am: {
                    n: [ "Amharic" ],
                    a3: "amh"
                },
                ar: {
                    n: [ "Arabic" ],
                    a3: "ara"
                },
                an: {
                    n: [ "Aragonese" ],
                    a3: "arg"
                },
                hy: {
                    n: [ "Armenian" ],
                    a3: "arm"
                },
                as: {
                    n: [ "Assamese" ],
                    a3: "asm"
                },
                av: {
                    n: [ "Avaric" ],
                    a3: "ava"
                },
                ae: {
                    n: [ "Avestan" ],
                    a3: "ave"
                },
                ay: {
                    n: [ "Aymara" ],
                    a3: "aym"
                },
                az: {
                    n: [ "Azerbaijani" ],
                    a3: "aze"
                },
                ba: {
                    n: [ "Bashkir" ],
                    a3: "bak"
                },
                bm: {
                    n: [ "Bambara" ],
                    a3: "bam"
                },
                eu: {
                    n: [ "Basque" ],
                    a3: "baq"
                },
                be: {
                    n: [ "Belarusian" ],
                    a3: "bel"
                },
                bn: {
                    n: [ "Bengali" ],
                    a3: "ben"
                },
                bh: {
                    n: [ "Bihari languages" ],
                    a3: "bih"
                },
                bi: {
                    n: [ "Bislama" ],
                    a3: "bis"
                },
                bs: {
                    n: [ "Bosnian" ],
                    a3: "bos"
                },
                br: {
                    n: [ "Breton" ],
                    a3: "bre"
                },
                bg: {
                    n: [ "Bulgarian" ],
                    a3: "bul"
                },
                my: {
                    n: [ "Burmese" ],
                    a3: "bur"
                },
                ca: {
                    n: [ "Catalan", "Valencian" ],
                    a3: "cat"
                },
                ch: {
                    n: [ "Chamorro" ],
                    a3: "cha"
                },
                ce: {
                    n: [ "Chechen" ],
                    a3: "che"
                },
                zh: {
                    n: [ "Chinese" ],
                    a3: "chi"
                },
                cu: {
                    n: [ "Church Slavic", "Old Slavonic", "Church Slavonic", "Old Bulgarian", "Old Church Slavonic" ],
                    a3: "chu"
                },
                cv: {
                    n: [ "Chuvash" ],
                    a3: "chv"
                },
                kw: {
                    n: [ "Cornish" ],
                    a3: "cor"
                },
                co: {
                    n: [ "Corsican" ],
                    a3: "cos"
                },
                cr: {
                    n: [ "Cree" ],
                    a3: "cre"
                },
                cs: {
                    n: [ "Czech" ],
                    a3: "cze"
                },
                da: {
                    n: [ "Danish" ],
                    a3: "dan"
                },
                dv: {
                    n: [ "Divehi", "Dhivehi", "Maldivian" ],
                    a3: "div"
                },
                nl: {
                    n: [ "Dutch", "Flemish" ],
                    a3: "dut"
                },
                dz: {
                    n: [ "Dzongkha" ],
                    a3: "dzo"
                },
                en: {
                    n: [ "English", "Englisch", "Inglese", "Anglais" ],
                    a3: "eng"
                },
                eo: {
                    n: [ "Esperanto" ],
                    a3: "epo"
                },
                et: {
                    n: [ "Estonian" ],
                    a3: "est"
                },
                ee: {
                    n: [ "Ewe" ],
                    a3: "ewe"
                },
                fo: {
                    n: [ "Faroese" ],
                    a3: "fao"
                },
                fj: {
                    n: [ "Fijian" ],
                    a3: "fij"
                },
                fi: {
                    n: [ "Finnish" ],
                    a3: "fin"
                },
                fr: {
                    n: [ "French", "Fran\xe7ais" ],
                    a3: "fre"
                },
                fy: {
                    n: [ "Western Frisian" ],
                    a3: "fry"
                },
                ff: {
                    n: [ "Fulah" ],
                    a3: "ful"
                },
                ka: {
                    n: [ "Georgian" ],
                    a3: "geo"
                },
                de: {
                    n: [ "German" ],
                    a3: [ "ger", "deu" ]
                },
                gd: {
                    n: [ "Gaelic", "Scottish Gaelic" ],
                    a3: "gla"
                },
                ga: {
                    n: [ "Irish" ],
                    a3: "gle"
                },
                gl: {
                    n: [ "Galician" ],
                    a3: "glg"
                },
                gv: {
                    n: [ "Manx" ],
                    a3: "glv"
                },
                el: {
                    n: [ "Greek" ],
                    a3: "gre"
                },
                gn: {
                    n: [ "Guarani" ],
                    a3: "grn"
                },
                gu: {
                    n: [ "Gujarati" ],
                    a3: "guj"
                },
                ht: {
                    n: [ "Haitian", "Haitian Creole" ],
                    a3: "hat"
                },
                ha: {
                    n: [ "Hausa" ],
                    a3: "hau"
                },
                he: {
                    n: [ "Hebrew" ],
                    a3: "heb"
                },
                hz: {
                    n: [ "Herero" ],
                    a3: "her"
                },
                hi: {
                    n: [ "Hindi" ],
                    a3: "hin"
                },
                ho: {
                    n: [ "Hiri Motu" ],
                    a3: "hmo"
                },
                hr: {
                    n: [ "Croatian" ],
                    a3: "hrv"
                },
                hu: {
                    n: [ "Hungarian" ],
                    a3: "hun"
                },
                ig: {
                    n: [ "Igbo" ],
                    a3: "ibo"
                },
                is: {
                    n: [ "Icelandic" ],
                    a3: "ice"
                },
                io: {
                    n: [ "Ido" ],
                    a3: "ido"
                },
                ii: {
                    n: [ "Sichuan Yi", "Nuosu" ],
                    a3: "iii"
                },
                iu: {
                    n: [ "Inuktitut" ],
                    a3: "iku"
                },
                ie: {
                    n: [ "Interlingue", "Occidental" ],
                    a3: "ile"
                },
                id: {
                    n: [ "Indonesian" ],
                    a3: "ind"
                },
                ik: {
                    n: [ "Inupiaq" ],
                    a3: "ipk"
                },
                it: {
                    n: [ "Italian", "Italiano" ],
                    a3: "ita"
                },
                jv: {
                    n: [ "Javanese" ],
                    a3: "jav"
                },
                ja: {
                    n: [ "Japanese" ],
                    a3: "jpn"
                },
                kl: {
                    n: [ "Kalaallisut", "Greenlandic" ],
                    a3: "kal"
                },
                kn: {
                    n: [ "Kannada" ],
                    a3: "kan"
                },
                ks: {
                    n: [ "Kashmiri" ],
                    a3: "kas"
                },
                kr: {
                    n: [ "Kanuri" ],
                    a3: "kau"
                },
                kk: {
                    n: [ "Kazakh" ],
                    a3: "kaz"
                },
                km: {
                    n: [ "Central Khmer" ],
                    a3: "khm"
                },
                ki: {
                    n: [ "Kikuyu", "Gikuyu" ],
                    a3: "kik"
                },
                rw: {
                    n: [ "Kinyarwanda" ],
                    a3: "kin"
                },
                ky: {
                    n: [ "Kirghiz", "Kyrgyz" ],
                    a3: "kir"
                },
                kv: {
                    n: [ "Komi" ],
                    a3: "kom"
                },
                kg: {
                    n: [ "Kongo" ],
                    a3: "kon"
                },
                ko: {
                    n: [ "Korean" ],
                    a3: "kor"
                },
                kj: {
                    n: [ "Kuanyama", "Kwanyama" ],
                    a3: "kua"
                },
                ku: {
                    n: [ "Kurdish" ],
                    a3: "kur"
                },
                lo: {
                    n: [ "Lao" ],
                    a3: "lao"
                },
                la: {
                    n: [ "Latin" ],
                    a3: "lat"
                },
                lv: {
                    n: [ "Latvian" ],
                    a3: "lav"
                },
                li: {
                    n: [ "Limburgan", "Limburger", "Limburgish" ],
                    a3: "lim"
                },
                ln: {
                    n: [ "Lingala" ],
                    a3: "lin"
                },
                lt: {
                    n: [ "Lithuanian" ],
                    a3: "lit"
                },
                lb: {
                    n: [ "Luxembourgish", "Letzeburgesch" ],
                    a3: "ltz"
                },
                lu: {
                    n: [ "Luba-Katanga" ],
                    a3: "lub"
                },
                lg: {
                    n: [ "Ganda" ],
                    a3: "lug"
                },
                mk: {
                    n: [ "Macedonian" ],
                    a3: "mac"
                },
                mh: {
                    n: [ "Marshallese" ],
                    a3: "mah"
                },
                ml: {
                    n: [ "Malayalam" ],
                    a3: "mal"
                },
                mi: {
                    n: [ "Maori" ],
                    a3: "mao"
                },
                mr: {
                    n: [ "Marathi" ],
                    a3: "mar"
                },
                ms: {
                    n: [ "Malay" ],
                    a3: "may"
                },
                mg: {
                    n: [ "Malagasy" ],
                    a3: "mlg"
                },
                mt: {
                    n: [ "Maltese" ],
                    a3: "mlt"
                },
                mn: {
                    n: [ "Mongolian" ],
                    a3: "mon"
                },
                na: {
                    n: [ "Nauru" ],
                    a3: "nau"
                },
                nv: {
                    n: [ "Navajo", "Navaho" ],
                    a3: "nav"
                },
                nr: {
                    n: [ "Ndebele, South", "South Ndebele" ],
                    a3: "nbl"
                },
                nd: {
                    n: [ "Ndebele, North", "North Ndebele" ],
                    a3: "nde"
                },
                ng: {
                    n: [ "Ndonga" ],
                    a3: "ndo"
                },
                ne: {
                    n: [ "Nepali" ],
                    a3: "nep"
                },
                nn: {
                    n: [ "Norwegian Nynorsk", "Nynorsk, Norwegian" ],
                    a3: "nno"
                },
                nb: {
                    n: [ "Bokm\xe5l, Norwegian", "Norwegian Bokm\xe5l" ],
                    a3: "nob"
                },
                no: {
                    n: [ "Norwegian" ],
                    a3: "nor"
                },
                ny: {
                    n: [ "Chichewa", "Chewa", "Nyanja" ],
                    a3: "nya"
                },
                oc: {
                    n: [ "Occitan", "Proven\xe7al" ],
                    a3: "oci"
                },
                oj: {
                    n: [ "Ojibwa" ],
                    a3: "oji"
                },
                or: {
                    n: [ "Oriya" ],
                    a3: "ori"
                },
                om: {
                    n: [ "Oromo" ],
                    a3: "orm"
                },
                os: {
                    n: [ "Ossetian", "Ossetic" ],
                    a3: "oss"
                },
                pa: {
                    n: [ "Panjabi", "Punjabi" ],
                    a3: "pan"
                },
                fa: {
                    n: [ "Persian" ],
                    a3: "per"
                },
                pi: {
                    n: [ "Pali" ],
                    a3: "pli"
                },
                pl: {
                    n: [ "Polish" ],
                    a3: "pol"
                },
                pt: {
                    n: [ "Portuguese" ],
                    a3: "por"
                },
                ps: {
                    n: [ "Pushto", "Pashto" ],
                    a3: "pus"
                },
                qu: {
                    n: [ "Quechua" ],
                    a3: "que"
                },
                rm: {
                    n: [ "Romansh" ],
                    a3: "roh"
                },
                ro: {
                    n: [ "Romanian", "Moldavian", "Moldovan" ],
                    a3: "rum"
                },
                rn: {
                    n: [ "Rundi" ],
                    a3: "run"
                },
                ru: {
                    n: [ "Russian" ],
                    a3: "rus"
                },
                sg: {
                    n: [ "Sango" ],
                    a3: "sag"
                },
                sa: {
                    n: [ "Sanskrit" ],
                    a3: "san"
                },
                si: {
                    n: [ "Sinhala", "Sinhalese" ],
                    a3: "sin"
                },
                sk: {
                    n: [ "Slovak" ],
                    a3: "slo"
                },
                sl: {
                    n: [ "Slovenian" ],
                    a3: "slv"
                },
                se: {
                    n: [ "Northern Sami" ],
                    a3: "sme"
                },
                sm: {
                    n: [ "Samoan" ],
                    a3: "smo"
                },
                sn: {
                    n: [ "Shona" ],
                    a3: "sna"
                },
                sd: {
                    n: [ "Sindhi" ],
                    a3: "snd"
                },
                so: {
                    n: [ "Somali" ],
                    a3: "som"
                },
                st: {
                    n: [ "Sotho, Southern" ],
                    a3: "sot"
                },
                es: {
                    n: [ "Spanish", "Castilian" ],
                    a3: "spa"
                },
                sc: {
                    n: [ "Sardinian" ],
                    a3: "srd"
                },
                sr: {
                    n: [ "Serbian" ],
                    a3: "srp"
                },
                ss: {
                    n: [ "Swati" ],
                    a3: "ssw"
                },
                su: {
                    n: [ "Sundanese" ],
                    a3: "sun"
                },
                sw: {
                    n: [ "Swahili" ],
                    a3: "swa"
                },
                sv: {
                    n: [ "Swedish" ],
                    a3: "swe"
                },
                ty: {
                    n: [ "Tahitian" ],
                    a3: "tah"
                },
                ta: {
                    n: [ "Tamil" ],
                    a3: "tam"
                },
                tt: {
                    n: [ "Tatar" ],
                    a3: "tat"
                },
                te: {
                    n: [ "Telugu" ],
                    a3: "tel"
                },
                tg: {
                    n: [ "Tajik" ],
                    a3: "tgk"
                },
                tl: {
                    n: [ "Tagalog" ],
                    a3: "tgl"
                },
                th: {
                    n: [ "Thai" ],
                    a3: "tha"
                },
                bo: {
                    n: [ "Tibetan" ],
                    a3: "tib"
                },
                ti: {
                    n: [ "Tigrinya" ],
                    a3: "tir"
                },
                to: {
                    n: [ "Tonga" ],
                    a3: "ton"
                },
                tn: {
                    n: [ "Tswana" ],
                    a3: "tsn"
                },
                ts: {
                    n: [ "Tsonga" ],
                    a3: "tso"
                },
                tk: {
                    n: [ "Turkmen" ],
                    a3: "tuk"
                },
                tr: {
                    n: [ "Turkish" ],
                    a3: "tur"
                },
                tw: {
                    n: [ "Twi" ],
                    a3: "twi"
                },
                ug: {
                    n: [ "Uighur", "Uyghur" ],
                    a3: "uig"
                },
                uk: {
                    n: [ "Ukrainian" ],
                    a3: "ukr"
                },
                ur: {
                    n: [ "Urdu" ],
                    a3: "urd"
                },
                uz: {
                    n: [ "Uzbek" ],
                    a3: "uzb"
                },
                ve: {
                    n: [ "Venda" ],
                    a3: "ven"
                },
                vi: {
                    n: [ "Vietnamese" ],
                    a3: "vie"
                },
                vo: {
                    n: [ "Volap\xfck" ],
                    a3: "vol"
                },
                cy: {
                    n: [ "Welsh" ],
                    a3: "wel"
                },
                wa: {
                    n: [ "Walloon" ],
                    a3: "wln"
                },
                wo: {
                    n: [ "Wolof" ],
                    a3: "wol"
                },
                xh: {
                    n: [ "Xhosa" ],
                    a3: "xho"
                },
                yi: {
                    n: [ "Yiddish" ],
                    a3: "yid"
                },
                yo: {
                    n: [ "Yoruba" ],
                    a3: "yor"
                },
                za: {
                    n: [ "Zhuang", "Chuang" ],
                    a3: "zha"
                },
                zu: {
                    n: [ "Zulu" ],
                    a3: "zul"
                }
            },
            diacriticsMap: {
                A: "A",
                "\u24b6": "A",
                "\uff21": "A",
                "\xc0": "A",
                "\xc1": "A",
                "\xc2": "A",
                "\u1ea6": "A",
                "\u1ea4": "A",
                "\u1eaa": "A",
                "\u1ea8": "A",
                "\xc3": "A",
                "\u0100": "A",
                "\u0102": "A",
                "\u1eb0": "A",
                "\u1eae": "A",
                "\u1eb4": "A",
                "\u1eb2": "A",
                "\u0226": "A",
                "\u01e0": "A",
                "\xc4": "A",
                "\u01de": "A",
                "\u1ea2": "A",
                "\xc5": "A",
                "\u01fa": "A",
                "\u01cd": "A",
                "\u0200": "A",
                "\u0202": "A",
                "\u1ea0": "A",
                "\u1eac": "A",
                "\u1eb6": "A",
                "\u1e00": "A",
                "\u0104": "A",
                "\u023a": "A",
                "\u2c6f": "A",
                "\ua732": "AA",
                "\xc6": "AE",
                "\u01fc": "AE",
                "\u01e2": "AE",
                "\ua734": "AO",
                "\ua736": "AU",
                "\ua738": "AV",
                "\ua73a": "AV",
                "\ua73c": "AY",
                B: "B",
                "\u24b7": "B",
                "\uff22": "B",
                "\u1e02": "B",
                "\u1e04": "B",
                "\u1e06": "B",
                "\u0243": "B",
                "\u0182": "B",
                "\u0181": "B",
                C: "C",
                "\u24b8": "C",
                "\uff23": "C",
                "\u0106": "C",
                "\u0108": "C",
                "\u010a": "C",
                "\u010c": "C",
                "\xc7": "C",
                "\u1e08": "C",
                "\u0187": "C",
                "\u023b": "C",
                "\ua73e": "C",
                D: "D",
                "\u24b9": "D",
                "\uff24": "D",
                "\u1e0a": "D",
                "\u010e": "D",
                "\u1e0c": "D",
                "\u1e10": "D",
                "\u1e12": "D",
                "\u1e0e": "D",
                "\u0110": "D",
                "\u018b": "D",
                "\u018a": "D",
                "\u0189": "D",
                "\ua779": "D",
                "\u01f1": "DZ",
                "\u01c4": "DZ",
                "\u01f2": "Dz",
                "\u01c5": "Dz",
                E: "E",
                "\u24ba": "E",
                "\uff25": "E",
                "\xc8": "E",
                "\xc9": "E",
                "\xca": "E",
                "\u1ec0": "E",
                "\u1ebe": "E",
                "\u1ec4": "E",
                "\u1ec2": "E",
                "\u1ebc": "E",
                "\u0112": "E",
                "\u1e14": "E",
                "\u1e16": "E",
                "\u0114": "E",
                "\u0116": "E",
                "\xcb": "E",
                "\u1eba": "E",
                "\u011a": "E",
                "\u0204": "E",
                "\u0206": "E",
                "\u1eb8": "E",
                "\u1ec6": "E",
                "\u0228": "E",
                "\u1e1c": "E",
                "\u0118": "E",
                "\u1e18": "E",
                "\u1e1a": "E",
                "\u0190": "E",
                "\u018e": "E",
                F: "F",
                "\u24bb": "F",
                "\uff26": "F",
                "\u1e1e": "F",
                "\u0191": "F",
                "\ua77b": "F",
                G: "G",
                "\u24bc": "G",
                "\uff27": "G",
                "\u01f4": "G",
                "\u011c": "G",
                "\u1e20": "G",
                "\u011e": "G",
                "\u0120": "G",
                "\u01e6": "G",
                "\u0122": "G",
                "\u01e4": "G",
                "\u0193": "G",
                "\ua7a0": "G",
                "\ua77d": "G",
                "\ua77e": "G",
                H: "H",
                "\u24bd": "H",
                "\uff28": "H",
                "\u0124": "H",
                "\u1e22": "H",
                "\u1e26": "H",
                "\u021e": "H",
                "\u1e24": "H",
                "\u1e28": "H",
                "\u1e2a": "H",
                "\u0126": "H",
                "\u2c67": "H",
                "\u2c75": "H",
                "\ua78d": "H",
                I: "I",
                "\u24be": "I",
                "\uff29": "I",
                "\xcc": "I",
                "\xcd": "I",
                "\xce": "I",
                "\u0128": "I",
                "\u012a": "I",
                "\u012c": "I",
                "\u0130": "I",
                "\xcf": "I",
                "\u1e2e": "I",
                "\u1ec8": "I",
                "\u01cf": "I",
                "\u0208": "I",
                "\u020a": "I",
                "\u1eca": "I",
                "\u012e": "I",
                "\u1e2c": "I",
                "\u0197": "I",
                J: "J",
                "\u24bf": "J",
                "\uff2a": "J",
                "\u0134": "J",
                "\u0248": "J",
                K: "K",
                "\u24c0": "K",
                "\uff2b": "K",
                "\u1e30": "K",
                "\u01e8": "K",
                "\u1e32": "K",
                "\u0136": "K",
                "\u1e34": "K",
                "\u0198": "K",
                "\u2c69": "K",
                "\ua740": "K",
                "\ua742": "K",
                "\ua744": "K",
                "\ua7a2": "K",
                L: "L",
                "\u24c1": "L",
                "\uff2c": "L",
                "\u013f": "L",
                "\u0139": "L",
                "\u013d": "L",
                "\u1e36": "L",
                "\u1e38": "L",
                "\u013b": "L",
                "\u1e3c": "L",
                "\u1e3a": "L",
                "\u0141": "L",
                "\u023d": "L",
                "\u2c62": "L",
                "\u2c60": "L",
                "\ua748": "L",
                "\ua746": "L",
                "\ua780": "L",
                "\u01c7": "LJ",
                "\u01c8": "Lj",
                M: "M",
                "\u24c2": "M",
                "\uff2d": "M",
                "\u1e3e": "M",
                "\u1e40": "M",
                "\u1e42": "M",
                "\u2c6e": "M",
                "\u019c": "M",
                N: "N",
                "\u24c3": "N",
                "\uff2e": "N",
                "\u01f8": "N",
                "\u0143": "N",
                "\xd1": "N",
                "\u1e44": "N",
                "\u0147": "N",
                "\u1e46": "N",
                "\u0145": "N",
                "\u1e4a": "N",
                "\u1e48": "N",
                "\u0220": "N",
                "\u019d": "N",
                "\ua790": "N",
                "\ua7a4": "N",
                "\u01ca": "NJ",
                "\u01cb": "Nj",
                O: "O",
                "\u24c4": "O",
                "\uff2f": "O",
                "\xd2": "O",
                "\xd3": "O",
                "\xd4": "O",
                "\u1ed2": "O",
                "\u1ed0": "O",
                "\u1ed6": "O",
                "\u1ed4": "O",
                "\xd5": "O",
                "\u1e4c": "O",
                "\u022c": "O",
                "\u1e4e": "O",
                "\u014c": "O",
                "\u1e50": "O",
                "\u1e52": "O",
                "\u014e": "O",
                "\u022e": "O",
                "\u0230": "O",
                "\xd6": "O",
                "\u022a": "O",
                "\u1ece": "O",
                "\u0150": "O",
                "\u01d1": "O",
                "\u020c": "O",
                "\u020e": "O",
                "\u01a0": "O",
                "\u1edc": "O",
                "\u1eda": "O",
                "\u1ee0": "O",
                "\u1ede": "O",
                "\u1ee2": "O",
                "\u1ecc": "O",
                "\u1ed8": "O",
                "\u01ea": "O",
                "\u01ec": "O",
                "\xd8": "O",
                "\u01fe": "O",
                "\u0186": "O",
                "\u019f": "O",
                "\ua74a": "O",
                "\ua74c": "O",
                "\u01a2": "OI",
                "\ua74e": "OO",
                "\u0222": "OU",
                P: "P",
                "\u24c5": "P",
                "\uff30": "P",
                "\u1e54": "P",
                "\u1e56": "P",
                "\u01a4": "P",
                "\u2c63": "P",
                "\ua750": "P",
                "\ua752": "P",
                "\ua754": "P",
                Q: "Q",
                "\u24c6": "Q",
                "\uff31": "Q",
                "\ua756": "Q",
                "\ua758": "Q",
                "\u024a": "Q",
                R: "R",
                "\u24c7": "R",
                "\uff32": "R",
                "\u0154": "R",
                "\u1e58": "R",
                "\u0158": "R",
                "\u0210": "R",
                "\u0212": "R",
                "\u1e5a": "R",
                "\u1e5c": "R",
                "\u0156": "R",
                "\u1e5e": "R",
                "\u024c": "R",
                "\u2c64": "R",
                "\ua75a": "R",
                "\ua7a6": "R",
                "\ua782": "R",
                S: "S",
                "\u24c8": "S",
                "\uff33": "S",
                "\u1e9e": "S",
                "\u015a": "S",
                "\u1e64": "S",
                "\u015c": "S",
                "\u1e60": "S",
                "\u0160": "S",
                "\u1e66": "S",
                "\u1e62": "S",
                "\u1e68": "S",
                "\u0218": "S",
                "\u015e": "S",
                "\u2c7e": "S",
                "\ua7a8": "S",
                "\ua784": "S",
                T: "T",
                "\u24c9": "T",
                "\uff34": "T",
                "\u1e6a": "T",
                "\u0164": "T",
                "\u1e6c": "T",
                "\u021a": "T",
                "\u0162": "T",
                "\u1e70": "T",
                "\u1e6e": "T",
                "\u0166": "T",
                "\u01ac": "T",
                "\u01ae": "T",
                "\u023e": "T",
                "\ua786": "T",
                "\ua728": "TZ",
                U: "U",
                "\u24ca": "U",
                "\uff35": "U",
                "\xd9": "U",
                "\xda": "U",
                "\xdb": "U",
                "\u0168": "U",
                "\u1e78": "U",
                "\u016a": "U",
                "\u1e7a": "U",
                "\u016c": "U",
                "\xdc": "U",
                "\u01db": "U",
                "\u01d7": "U",
                "\u01d5": "U",
                "\u01d9": "U",
                "\u1ee6": "U",
                "\u016e": "U",
                "\u0170": "U",
                "\u01d3": "U",
                "\u0214": "U",
                "\u0216": "U",
                "\u01af": "U",
                "\u1eea": "U",
                "\u1ee8": "U",
                "\u1eee": "U",
                "\u1eec": "U",
                "\u1ef0": "U",
                "\u1ee4": "U",
                "\u1e72": "U",
                "\u0172": "U",
                "\u1e76": "U",
                "\u1e74": "U",
                "\u0244": "U",
                V: "V",
                "\u24cb": "V",
                "\uff36": "V",
                "\u1e7c": "V",
                "\u1e7e": "V",
                "\u01b2": "V",
                "\ua75e": "V",
                "\u0245": "V",
                "\ua760": "VY",
                W: "W",
                "\u24cc": "W",
                "\uff37": "W",
                "\u1e80": "W",
                "\u1e82": "W",
                "\u0174": "W",
                "\u1e86": "W",
                "\u1e84": "W",
                "\u1e88": "W",
                "\u2c72": "W",
                X: "X",
                "\u24cd": "X",
                "\uff38": "X",
                "\u1e8a": "X",
                "\u1e8c": "X",
                Y: "Y",
                "\u24ce": "Y",
                "\uff39": "Y",
                "\u1ef2": "Y",
                "\xdd": "Y",
                "\u0176": "Y",
                "\u1ef8": "Y",
                "\u0232": "Y",
                "\u1e8e": "Y",
                "\u0178": "Y",
                "\u1ef6": "Y",
                "\u1ef4": "Y",
                "\u01b3": "Y",
                "\u024e": "Y",
                "\u1efe": "Y",
                Z: "Z",
                "\u24cf": "Z",
                "\uff3a": "Z",
                "\u0179": "Z",
                "\u1e90": "Z",
                "\u017b": "Z",
                "\u017d": "Z",
                "\u1e92": "Z",
                "\u1e94": "Z",
                "\u01b5": "Z",
                "\u0224": "Z",
                "\u2c7f": "Z",
                "\u2c6b": "Z",
                "\ua762": "Z",
                a: "a",
                "\u24d0": "a",
                "\uff41": "a",
                "\u1e9a": "a",
                "\xe0": "a",
                "\xe1": "a",
                "\xe2": "a",
                "\u1ea7": "a",
                "\u1ea5": "a",
                "\u1eab": "a",
                "\u1ea9": "a",
                "\xe3": "a",
                "\u0101": "a",
                "\u0103": "a",
                "\u1eb1": "a",
                "\u1eaf": "a",
                "\u1eb5": "a",
                "\u1eb3": "a",
                "\u0227": "a",
                "\u01e1": "a",
                "\xe4": "a",
                "\u01df": "a",
                "\u1ea3": "a",
                "\xe5": "a",
                "\u01fb": "a",
                "\u01ce": "a",
                "\u0201": "a",
                "\u0203": "a",
                "\u1ea1": "a",
                "\u1ead": "a",
                "\u1eb7": "a",
                "\u1e01": "a",
                "\u0105": "a",
                "\u2c65": "a",
                "\u0250": "a",
                "\ua733": "aa",
                "\xe6": "ae",
                "\u01fd": "ae",
                "\u01e3": "ae",
                "\ua735": "ao",
                "\ua737": "au",
                "\ua739": "av",
                "\ua73b": "av",
                "\ua73d": "ay",
                b: "b",
                "\u24d1": "b",
                "\uff42": "b",
                "\u1e03": "b",
                "\u1e05": "b",
                "\u1e07": "b",
                "\u0180": "b",
                "\u0183": "b",
                "\u0253": "b",
                c: "c",
                "\u24d2": "c",
                "\uff43": "c",
                "\u0107": "c",
                "\u0109": "c",
                "\u010b": "c",
                "\u010d": "c",
                "\xe7": "c",
                "\u1e09": "c",
                "\u0188": "c",
                "\u023c": "c",
                "\ua73f": "c",
                "\u2184": "c",
                d: "d",
                "\u24d3": "d",
                "\uff44": "d",
                "\u1e0b": "d",
                "\u010f": "d",
                "\u1e0d": "d",
                "\u1e11": "d",
                "\u1e13": "d",
                "\u1e0f": "d",
                "\u0111": "d",
                "\u018c": "d",
                "\u0256": "d",
                "\u0257": "d",
                "\ua77a": "d",
                "\u01f3": "dz",
                "\u01c6": "dz",
                e: "e",
                "\u24d4": "e",
                "\uff45": "e",
                "\xe8": "e",
                "\xe9": "e",
                "\xea": "e",
                "\u1ec1": "e",
                "\u1ebf": "e",
                "\u1ec5": "e",
                "\u1ec3": "e",
                "\u1ebd": "e",
                "\u0113": "e",
                "\u1e15": "e",
                "\u1e17": "e",
                "\u0115": "e",
                "\u0117": "e",
                "\xeb": "e",
                "\u1ebb": "e",
                "\u011b": "e",
                "\u0205": "e",
                "\u0207": "e",
                "\u1eb9": "e",
                "\u1ec7": "e",
                "\u0229": "e",
                "\u1e1d": "e",
                "\u0119": "e",
                "\u1e19": "e",
                "\u1e1b": "e",
                "\u0247": "e",
                "\u025b": "e",
                "\u01dd": "e",
                f: "f",
                "\u24d5": "f",
                "\uff46": "f",
                "\u1e1f": "f",
                "\u0192": "f",
                "\ua77c": "f",
                g: "g",
                "\u24d6": "g",
                "\uff47": "g",
                "\u01f5": "g",
                "\u011d": "g",
                "\u1e21": "g",
                "\u011f": "g",
                "\u0121": "g",
                "\u01e7": "g",
                "\u0123": "g",
                "\u01e5": "g",
                "\u0260": "g",
                "\ua7a1": "g",
                "\u1d79": "g",
                "\ua77f": "g",
                h: "h",
                "\u24d7": "h",
                "\uff48": "h",
                "\u0125": "h",
                "\u1e23": "h",
                "\u1e27": "h",
                "\u021f": "h",
                "\u1e25": "h",
                "\u1e29": "h",
                "\u1e2b": "h",
                "\u1e96": "h",
                "\u0127": "h",
                "\u2c68": "h",
                "\u2c76": "h",
                "\u0265": "h",
                "\u0195": "hv",
                i: "i",
                "\u24d8": "i",
                "\uff49": "i",
                "\xec": "i",
                "\xed": "i",
                "\xee": "i",
                "\u0129": "i",
                "\u012b": "i",
                "\u012d": "i",
                "\xef": "i",
                "\u1e2f": "i",
                "\u1ec9": "i",
                "\u01d0": "i",
                "\u0209": "i",
                "\u020b": "i",
                "\u1ecb": "i",
                "\u012f": "i",
                "\u1e2d": "i",
                "\u0268": "i",
                "\u0131": "i",
                j: "j",
                "\u24d9": "j",
                "\uff4a": "j",
                "\u0135": "j",
                "\u01f0": "j",
                "\u0249": "j",
                k: "k",
                "\u24da": "k",
                "\uff4b": "k",
                "\u1e31": "k",
                "\u01e9": "k",
                "\u1e33": "k",
                "\u0137": "k",
                "\u1e35": "k",
                "\u0199": "k",
                "\u2c6a": "k",
                "\ua741": "k",
                "\ua743": "k",
                "\ua745": "k",
                "\ua7a3": "k",
                l: "l",
                "\u24db": "l",
                "\uff4c": "l",
                "\u0140": "l",
                "\u013a": "l",
                "\u013e": "l",
                "\u1e37": "l",
                "\u1e39": "l",
                "\u013c": "l",
                "\u1e3d": "l",
                "\u1e3b": "l",
                "\u017f": "l",
                "\u0142": "l",
                "\u019a": "l",
                "\u026b": "l",
                "\u2c61": "l",
                "\ua749": "l",
                "\ua781": "l",
                "\ua747": "l",
                "\u01c9": "lj",
                m: "m",
                "\u24dc": "m",
                "\uff4d": "m",
                "\u1e3f": "m",
                "\u1e41": "m",
                "\u1e43": "m",
                "\u0271": "m",
                "\u026f": "m",
                n: "n",
                "\u24dd": "n",
                "\uff4e": "n",
                "\u01f9": "n",
                "\u0144": "n",
                "\xf1": "n",
                "\u1e45": "n",
                "\u0148": "n",
                "\u1e47": "n",
                "\u0146": "n",
                "\u1e4b": "n",
                "\u1e49": "n",
                "\u019e": "n",
                "\u0272": "n",
                "\u0149": "n",
                "\ua791": "n",
                "\ua7a5": "n",
                "\u01cc": "nj",
                o: "o",
                "\u24de": "o",
                "\uff4f": "o",
                "\xf2": "o",
                "\xf3": "o",
                "\xf4": "o",
                "\u1ed3": "o",
                "\u1ed1": "o",
                "\u1ed7": "o",
                "\u1ed5": "o",
                "\xf5": "o",
                "\u1e4d": "o",
                "\u022d": "o",
                "\u1e4f": "o",
                "\u014d": "o",
                "\u1e51": "o",
                "\u1e53": "o",
                "\u014f": "o",
                "\u022f": "o",
                "\u0231": "o",
                "\xf6": "o",
                "\u022b": "o",
                "\u1ecf": "o",
                "\u0151": "o",
                "\u01d2": "o",
                "\u020d": "o",
                "\u020f": "o",
                "\u01a1": "o",
                "\u1edd": "o",
                "\u1edb": "o",
                "\u1ee1": "o",
                "\u1edf": "o",
                "\u1ee3": "o",
                "\u1ecd": "o",
                "\u1ed9": "o",
                "\u01eb": "o",
                "\u01ed": "o",
                "\xf8": "o",
                "\u01ff": "o",
                "\u0254": "o",
                "\ua74b": "o",
                "\ua74d": "o",
                "\u0275": "o",
                "\u01a3": "oi",
                "\u0223": "ou",
                "\ua74f": "oo",
                p: "p",
                "\u24df": "p",
                "\uff50": "p",
                "\u1e55": "p",
                "\u1e57": "p",
                "\u01a5": "p",
                "\u1d7d": "p",
                "\ua751": "p",
                "\ua753": "p",
                "\ua755": "p",
                q: "q",
                "\u24e0": "q",
                "\uff51": "q",
                "\u024b": "q",
                "\ua757": "q",
                "\ua759": "q",
                r: "r",
                "\u24e1": "r",
                "\uff52": "r",
                "\u0155": "r",
                "\u1e59": "r",
                "\u0159": "r",
                "\u0211": "r",
                "\u0213": "r",
                "\u1e5b": "r",
                "\u1e5d": "r",
                "\u0157": "r",
                "\u1e5f": "r",
                "\u024d": "r",
                "\u027d": "r",
                "\ua75b": "r",
                "\ua7a7": "r",
                "\ua783": "r",
                s: "s",
                "\u24e2": "s",
                "\uff53": "s",
                "\xdf": "s",
                "\u015b": "s",
                "\u1e65": "s",
                "\u015d": "s",
                "\u1e61": "s",
                "\u0161": "s",
                "\u1e67": "s",
                "\u1e63": "s",
                "\u1e69": "s",
                "\u0219": "s",
                "\u015f": "s",
                "\u023f": "s",
                "\ua7a9": "s",
                "\ua785": "s",
                "\u1e9b": "s",
                t: "t",
                "\u24e3": "t",
                "\uff54": "t",
                "\u1e6b": "t",
                "\u1e97": "t",
                "\u0165": "t",
                "\u1e6d": "t",
                "\u021b": "t",
                "\u0163": "t",
                "\u1e71": "t",
                "\u1e6f": "t",
                "\u0167": "t",
                "\u01ad": "t",
                "\u0288": "t",
                "\u2c66": "t",
                "\ua787": "t",
                "\ua729": "tz",
                u: "u",
                "\u24e4": "u",
                "\uff55": "u",
                "\xf9": "u",
                "\xfa": "u",
                "\xfb": "u",
                "\u0169": "u",
                "\u1e79": "u",
                "\u016b": "u",
                "\u1e7b": "u",
                "\u016d": "u",
                "\xfc": "u",
                "\u01dc": "u",
                "\u01d8": "u",
                "\u01d6": "u",
                "\u01da": "u",
                "\u1ee7": "u",
                "\u016f": "u",
                "\u0171": "u",
                "\u01d4": "u",
                "\u0215": "u",
                "\u0217": "u",
                "\u01b0": "u",
                "\u1eeb": "u",
                "\u1ee9": "u",
                "\u1eef": "u",
                "\u1eed": "u",
                "\u1ef1": "u",
                "\u1ee5": "u",
                "\u1e73": "u",
                "\u0173": "u",
                "\u1e77": "u",
                "\u1e75": "u",
                "\u0289": "u",
                v: "v",
                "\u24e5": "v",
                "\uff56": "v",
                "\u1e7d": "v",
                "\u1e7f": "v",
                "\u028b": "v",
                "\ua75f": "v",
                "\u028c": "v",
                "\ua761": "vy",
                w: "w",
                "\u24e6": "w",
                "\uff57": "w",
                "\u1e81": "w",
                "\u1e83": "w",
                "\u0175": "w",
                "\u1e87": "w",
                "\u1e85": "w",
                "\u1e98": "w",
                "\u1e89": "w",
                "\u2c73": "w",
                x: "x",
                "\u24e7": "x",
                "\uff58": "x",
                "\u1e8b": "x",
                "\u1e8d": "x",
                y: "y",
                "\u24e8": "y",
                "\uff59": "y",
                "\u1ef3": "y",
                "\xfd": "y",
                "\u0177": "y",
                "\u1ef9": "y",
                "\u0233": "y",
                "\u1e8f": "y",
                "\xff": "y",
                "\u1ef7": "y",
                "\u1e99": "y",
                "\u1ef5": "y",
                "\u01b4": "y",
                "\u024f": "y",
                "\u1eff": "y",
                z: "z",
                "\u24e9": "z",
                "\uff5a": "z",
                "\u017a": "z",
                "\u1e91": "z",
                "\u017c": "z",
                "\u017e": "z",
                "\u1e93": "z",
                "\u1e95": "z",
                "\u01b6": "z",
                "\u0225": "z",
                "\u0240": "z",
                "\u2c6c": "z",
                "\ua763": "z"
            },
            stopwords: {
                about: 1,
                again: 1,
                all: 1,
                almost: 1,
                also: 1,
                although: 1,
                always: 1,
                among: 1,
                and: 1,
                another: 1,
                any: 1,
                are: 1,
                because: 1,
                been: 1,
                before: 1,
                being: 1,
                between: 1,
                both: 1,
                but: 1,
                can: 1,
                could: 1,
                did: 1,
                does: 1,
                done: 1,
                due: 1,
                during: 1,
                each: 1,
                either: 1,
                enough: 1,
                especially: 1,
                etc: 1,
                for: 1,
                found: 1,
                from: 1,
                further: 1,
                had: 1,
                has: 1,
                have: 1,
                having: 1,
                here: 1,
                how: 1,
                however: 1,
                into: 1,
                its: 1,
                itself: 1,
                just: 1,
                made: 1,
                mainly: 1,
                make: 1,
                may: 1,
                might: 1,
                most: 1,
                mostly: 1,
                must: 1,
                nearly: 1,
                neither: 1,
                nor: 1,
                not: 1,
                obtained: 1,
                often: 1,
                our: 1,
                overall: 1,
                perhaps: 1,
                quite: 1,
                rather: 1,
                really: 1,
                regarding: 1,
                seem: 1,
                seen: 1,
                several: 1,
                should: 1,
                show: 1,
                showed: 1,
                shown: 1,
                shows: 1,
                since: 1,
                some: 1,
                such: 1,
                than: 1,
                that: 1,
                the: 1,
                their: 1,
                theirs: 1,
                them: 1,
                then: 1,
                there: 1,
                therefore: 1,
                these: 1,
                they: 1,
                this: 1,
                those: 1,
                through: 1,
                thus: 1,
                upon: 1,
                use: 1,
                used: 1,
                using: 1,
                various: 1,
                very: 1,
                was: 1,
                were: 1,
                what: 1,
                when: 1,
                which: 1,
                while: 1,
                with: 1,
                within: 1,
                without: 1,
                would: 1,
                "[": 1,
                "]": 1,
                "{": 1,
                "}": 1,
                "(": 1,
                ")": 1,
                _: 1,
                $: 1,
                "!": 1,
                "#": 1,
                "^": 1,
                "&": 1,
                "*": 1,
                "'": 1,
                '"': 1,
                ":": 1,
                "?": 1,
                ".": 1,
                ",": 1,
                ";": 1,
                "%": 1,
                "|": 1,
                "@": 1
            },
            decode: function(a) {
                try {
                    var b = JSON.parse(a);
                } catch (b) {
                    PP.log({
                        type: "exception",
                        subtype: "Follow up: Invalid JSON",
                        msg: "Could not decode JSON string in Utils.decode ",
                        str: PP.Utils.escape(a),
                        stack: PP.Utils.stackTrace(),
                        error: b
                    });
                    throw b;
                }
                return b;
            },
            encode: function(a) {
                return JSON.stringify(a);
            },
            convertHtmlEntitiesToUnicode: function(a) {
                var b = a.split(/(&[^;]+;)/);
                for (var c = 0; c < b.length; c++) {
                    if (b[c].match(/^&[^;]+;$/)) {
                        if (typeof document != "undefined") {
                            var d = document.createElement("div");
                            d.innerHTML = b[c];
                            b[c] = d.textContent;
                        } else {
                            b[c] = $("<textarea />").html(b[c]).text();
                        }
                    }
                }
                return b.join("");
            },
            escapeXML: function(a) {
                if (PP.Utils.isString(a)) {
                    var b = a || "";
                    return b.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
                } else {
                    return a;
                }
            },
            escape: function(a, b) {
                var c = {
                    exclude: []
                };
                PP.Utils.apply(c, b || {});
                a = a.replace(/&lt;/g, "<");
                a = a.replace(/&gt;/g, ">");
                a = a.replace(/&amp;/g, "&");
                var d = document.createElement("div");
                d.appendChild(document.createTextNode(a));
                var e = d.innerHTML;
                for (var f = 0; f < c.exclude.length; f++) {
                    var g = new RegExp("&lt;" + c.exclude[f] + "&gt;", "g");
                    e = e.replace(g, "<" + c.exclude[f] + ">");
                    g = new RegExp("&lt;\\/" + c.exclude[f] + "&gt;", "g");
                    e = e.replace(g, "</" + c.exclude[f] + ">");
                }
                return e;
            },
            escapeAttributeValue: function(a) {
                var b = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;"
                };
                return String(a).replace(/[&<>"'\/]/g, function(a) {
                    return b[a];
                });
            },
            addAllDiacritics: function(a) {
                var b = this;
                if (!b.reversedDiacriticsMap) {
                    b.reversedDiacriticsMap = {};
                    for (var c in b.diacriticsMap) {
                        if (!(b.diacriticsMap[c] in b.reversedDiacriticsMap)) {
                            b.reversedDiacriticsMap[b.diacriticsMap[c]] = [];
                        }
                        b.reversedDiacriticsMap[b.diacriticsMap[c]].push(c);
                    }
                    for (var c in b.reversedDiacriticsMap) {
                        b.reversedDiacriticsMap[c] = "[" + b.reversedDiacriticsMap[c].join("") + "]";
                    }
                }
                var d = a.split("");
                var e = "";
                for (var f = 0; f < d.length; f++) {
                    e += d[f] in b.reversedDiacriticsMap ? b.reversedDiacriticsMap[d[f]] : d[f];
                }
                return e;
            },
            replaceDiacritics: function(a) {
                var b = this;
                var c = a.split("");
                var d = "";
                for (var e = 0; e < c.length; e++) {
                    d += c[e] in b.diacriticsMap ? b.diacriticsMap[c[e]] : c[e];
                }
                return d;
            },
            replaceU0308: function(a) {
                if (!a) return a;
                if (!a.match(/\u0308/)) return a;
                var b = new RegExp("(.*)([AEIOUaeiouy])(\u0308)(.*)", "g");
                var c;
                var d = 0;
                var e = {
                    a: "\xe4",
                    e: "\xeb",
                    i: "\xef",
                    o: "\xf6",
                    u: "\xfc",
                    y: "\xff",
                    A: "\xc4",
                    E: "\xcb",
                    I: "\xcf",
                    O: "\xd6",
                    U: "\xdc"
                };
                while ((c = b.exec(a)) !== null) {
                    if (d++ > 50) break;
                    a = c[1] + e[c[2]] + c[4];
                    b.lastIndex = 0;
                }
                a = a.replace(/\u0308/g, "");
                return a;
            },
            replaceControlChars: function(a) {
                if (!a) return a;
                a = a.replace(/[\u0000-\u0008\u000B-\u001F]/g, "");
                return a;
            },
            addWbrs: function(a) {
                if (!a) return a;
                var b, c, d;
                var e = [];
                var f = 0;
                var g = {};
                var h = 30;
                var i = new RegExp("(.{" + h + "})");
                a += "";
                d = a.replace(/\s+$/g, "").replace(/^\s+/g, "").split(/(<\/?(?:span|i|sub|sup)[^>]*>)/);
                d.forEach(function(a) {
                    if (a.match(/^<\/?(?:span|i|sub|sup)[^>]*>$/)) {
                        e.push({
                            str: a,
                            type: "html"
                        });
                    } else {
                        a.split(/(\s+)/).forEach(function(a) {
                            if (a.match(/^\s+$/)) {
                                e.push({
                                    str: " <wbr>",
                                    type: "space"
                                });
                                f++;
                            } else {
                                if (a != "") {
                                    e.push({
                                        str: a,
                                        type: "text",
                                        wbrs: []
                                    });
                                    if (!(f in g)) g[f] = [];
                                    g[f].push(e.length - 1);
                                }
                            }
                        });
                    }
                });
                for (var j in g) {
                    var k = "";
                    g[j].forEach(function(a) {
                        k += e[a].str;
                    });
                    if (k.length >= h) {
                        d = k.split(/([_\/\-]+)/);
                        for (c = 0; c < d.length; c++) {
                            if (d[c].match(/^[_\/\-]+$/)) {
                                d[c] = d[c] + "<wbr>";
                            } else if (d[c].length >= h) {
                                d[c] = d[c].split(i).join("<wbr>").replace(/^<wbr>/, "");
                            }
                        }
                        var l = 0;
                        d.join("").split(/(<wbr>)/).forEach(function(a) {
                            if (a == "<wbr>") {
                                var b = 0;
                                g[j].forEach(function(a) {
                                    if (l > b && l <= b + e[a].str.length) {
                                        e[a].wbrs.push(l - b - 1);
                                    }
                                    b += e[a].str.length;
                                });
                            } else {
                                l += a.length;
                            }
                        });
                    }
                }
                a = [];
                e.forEach(function(b) {
                    if (b.type == "text" && b.wbrs.length) {
                        d = b.str.split("");
                        b.wbrs.forEach(function(a) {
                            d[a] += "<wbr>";
                        });
                        b.str = d.join("");
                    }
                    a.push(b.str);
                });
                return a.join("");
            },
            escapeRegex: function(a) {
                if (!a) return a;
                a = a.replace(/\\/g, "\\\\");
                a = a.replace(/\^/g, "\\^");
                a = a.replace(/\|/g, "\\|");
                a = a.replace(/\$/g, "\\$");
                a = a.replace(/\?/g, "\\?");
                a = a.replace(/\+/g, "\\+");
                a = a.replace(/\(/g, "\\(");
                a = a.replace(/\)/g, "\\)");
                a = a.replace(/\[/g, "\\[");
                a = a.replace(/\]/g, "\\]");
                a = a.replace(/\*/g, "\\*");
                return a;
            },
            removeQuotationMarksAndPunctation: function(a) {
                if (!a) return "";
                var b = "[\u2018\u2019\u201b\u201c\u201d\u201e\u201f\xa8\"'`\\-\\(\\[\\{\\)\\]\\}\\.,;:\\?\\!]+";
                return a.replace(new RegExp("^" + b, "i"), "").replace(new RegExp(b + "$", "i"), "");
            },
            normalizeIdsForSearch: function(a) {
                if (!a) return a;
                a = this.removeQuotationMarksAndPunctation(a);
                if (a.match(/^(pmid|doi|pmc|arxivid|isbn):/i)) {
                    return a;
                }
                if (a.match(/^10\.[^\/]+\/[^\s\>\<]+/)) {
                    return "doi:" + a;
                }
                if (a.match(/^\d{7,8}$/)) {
                    return "pmid:" + a;
                }
                if (a.match(/PMC\d+/i)) {
                    return "pmc:" + a;
                }
                if (a.match(/\d{4}\.\d{4}/)) {
                    return "arxivid:" + a;
                }
                var b = a.replace(/[-\s\.]/g, "");
                if (b.match(/^\d{10}$/) || b.match(/^\d{13}$/) || b.match(/^\d{9}X$/i) || b.match(/^\d{12}X$/i)) {
                    return "isbn:" + a;
                }
                if (a.toLowerCase() in this.stopwords) a = "";
                return a;
            },
            pp: function(a) {
                console.warn(this.prettyPrint(a));
            },
            prettyPrint: function(a) {
                return JSON.stringify(PP.Utils.clone(a), null, 4);
            },
            getPath: function(a, b) {
                var c = b.split(".");
                var d = a;
                var e;
                for (var f = 0; f < c.length; f++) {
                    var g = c[f];
                    if (d[g] !== undefined) {
                        e = d[g];
                        d = e;
                    } else {
                        return d[g];
                    }
                }
                return e;
            },
            setPath: function(a, b, c) {
                var d = b.split(".");
                var e = a;
                var f;
                var g;
                for (var h = 0; h < d.length; h++) {
                    g = d[h];
                    if (h == d.length - 1) {
                        e[g] = c;
                        break;
                    }
                    if (e[g]) {
                        f = e[g];
                        e = f;
                    } else {
                        e[g] = {};
                        f = e[g];
                        e = f;
                    }
                }
            },
            getCslLocales: function() {
                var a = [ {
                    abbr: "default",
                    name: "Language: Default"
                }, {
                    abbr: "af-ZA",
                    name: "Afrikaans"
                }, {
                    abbr: "ar",
                    name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629"
                }, {
                    abbr: "bg-BG",
                    name: "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438"
                }, {
                    abbr: "ca-AD",
                    name: "Catal\xe0"
                }, {
                    abbr: "cs-CZ",
                    name: "\u010ce\u0161tina"
                }, {
                    abbr: "cy-GB",
                    name: "Cymraeg"
                }, {
                    abbr: "da-DK",
                    name: "Dansk"
                }, {
                    abbr: "de-AT",
                    name: "Deutsch (\xd6sterreich)"
                }, {
                    abbr: "de-CH",
                    name: "Deutsch (Schweiz)"
                }, {
                    abbr: "de-DE",
                    name: "Deutsch (Deutschland)"
                }, {
                    abbr: "el-GR",
                    name: "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac"
                }, {
                    abbr: "en-GB",
                    name: "English (UK)"
                }, {
                    abbr: "en-US",
                    name: "English (US)"
                }, {
                    abbr: "es-CL",
                    name: "Espa\xf1ol (Chile)"
                }, {
                    abbr: "es-ES",
                    name: "Espa\xf1ol (Espa\xf1a)"
                }, {
                    abbr: "es-MX",
                    name: "Espa\xf1ol (M\xe9xico)"
                }, {
                    abbr: "et-EE",
                    name: "Eesti"
                }, {
                    abbr: "eu",
                    name: "Euskara"
                }, {
                    abbr: "fa-IR",
                    name: "\u0641\u0627\u0631\u0633\u06cc"
                }, {
                    abbr: "fi-FI",
                    name: "Suomi"
                }, {
                    abbr: "fr-CA",
                    name: "Fran\xe7ais (Canada)"
                }, {
                    abbr: "fr-FR",
                    name: "Fran\xe7ais (France)"
                }, {
                    abbr: "he-IL",
                    name: "\u05e2\u05d1\u05e8\u05d9\u05ea"
                }, {
                    abbr: "hr-HR",
                    name: "Hrvatski"
                }, {
                    abbr: "hu-HU",
                    name: "Magyar"
                }, {
                    abbr: "id-ID",
                    name: "Bahasa Indonesia"
                }, {
                    abbr: "is-IS",
                    name: "\xcdslenska"
                }, {
                    abbr: "it-IT",
                    name: "Italiano"
                }, {
                    abbr: "ja-JP",
                    name: "\u65e5\u672c\u8a9e"
                }, {
                    abbr: "km-KH",
                    name: "\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a"
                }, {
                    abbr: "ko-KR",
                    name: "\ud55c\uad6d\uc5b4"
                }, {
                    abbr: "lt-LT",
                    name: "Lietuvi\u0173"
                }, {
                    abbr: "lv-LV",
                    name: "Latvie\u0161u"
                }, {
                    abbr: "mn-MN",
                    name: "\u041c\u043e\u043d\u0433\u043e\u043b"
                }, {
                    abbr: "nb-NO",
                    name: "Norsk bokm\xe5l"
                }, {
                    abbr: "nl-NL",
                    name: "Nederlands"
                }, {
                    abbr: "nn-NO",
                    name: "Norsk nynorsk"
                }, {
                    abbr: "pl-PL",
                    name: "Polski"
                }, {
                    abbr: "pt-BR",
                    name: "Portugu\xeas (Brasil)"
                }, {
                    abbr: "pt-PT",
                    name: "Portugu\xeas (Portugal)"
                }, {
                    abbr: "ro-RO",
                    name: "Rom\xe2n\u0103"
                }, {
                    abbr: "ru-RU",
                    name: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439"
                }, {
                    abbr: "sk-SK",
                    name: "Sloven\u010dina"
                }, {
                    abbr: "sl-SI",
                    name: "Sloven\u0161\u010dina"
                }, {
                    abbr: "sr-RS",
                    name: "\u0421\u0440\u043f\u0441\u043a\u0438 / Srpski"
                }, {
                    abbr: "sv-SE",
                    name: "Svenska"
                }, {
                    abbr: "th-TH",
                    name: "\u0e44\u0e17\u0e22"
                }, {
                    abbr: "tr-TR",
                    name: "T\xfcrk\xe7e"
                }, {
                    abbr: "uk-UA",
                    name: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430"
                }, {
                    abbr: "vi-VN",
                    name: "Ti\u1ebfng Vi\u1ec7t"
                }, {
                    abbr: "zh-CN",
                    name: "\u4e2d\u6587 (\u4e2d\u56fd\u5927\u9646)"
                }, {
                    abbr: "zh-TW",
                    name: "\u4e2d\u6587 (\u53f0\u7063)"
                } ];
                return a;
            },
            merge: function(a, b) {
                var c = Object.keys(b);
                for (var d = 0; d < c.length; d++) {
                    var e = c[d];
                    if (a[e] && b[e] && this.isObject(a[e]) && this.isObject(b[e])) {
                        this.merge(a[e], b[e]);
                    } else if (b[e] !== undefined) {
                        a[e] = b[e];
                    }
                }
            },
            extend: function(a) {
                var b = Array.prototype.slice.call(arguments, 1);
                for (var c = 0, d = b.length, e; c < d; c++) {
                    e = b[c] || {};
                    for (var f in e) {
                        if (e.hasOwnProperty(f)) {
                            a[f] = e[f];
                        }
                    }
                }
                return a;
            },
            extendIf: function(a, b) {
                var c;
                if (a) {
                    for (c in b) {
                        if (a[c] === undefined) {
                            a[c] = b[c];
                        }
                    }
                }
                return a;
            },
            objectEach: function(a, b, c) {
                for (var d in a) {
                    if (a.hasOwnProperty(d)) {
                        if (b.call(c || a, d, a[d], a) === false) {
                            return;
                        }
                    }
                }
            },
            bind: function(a, b, c, d) {
                if (arguments.length === 2) {
                    return function() {
                        return a.apply(b, arguments);
                    };
                }
                if (d === undefined) {
                    d = true;
                }
                var e = a, f = Array.prototype.slice;
                return function() {
                    var a = c || arguments;
                    if (d === true && c !== undefined) {
                        a = f.call(arguments, 0);
                        a = a.concat(c);
                    }
                    return e.apply(b, a);
                };
            },
            strip: function(a) {
                a = a.replace(/^\s*/, "");
                a = a.replace(/\s*$/, "");
                return a;
            },
            normalizeString: function(a) {
                if (a) {
                    a = a.replace(/[\t\n\s\r]+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
                } else {
                    a = "";
                }
                return a;
            },
            isPdfRestricted: function(a) {
                var b = false;
                if (a === "restricted") {
                    b = true;
                } else if (a === "loginrequired") {
                    b = true;
                } else if (a === "proxyrestricted") {
                    b = true;
                }
                return b;
            },
            ellipsis: function(a, b, c, d) {
                if (c === undefined) {
                    c = false;
                }
                if (d === undefined) {
                    d = "&hellip;";
                }
                var e = Math.abs(b);
                if (a && a.length > e) {
                    if (c && b > 0) {
                        var f = a.substr(0, e - 2), g = Math.max(f.lastIndexOf(" "), f.lastIndexOf("."), f.lastIndexOf("!"), f.lastIndexOf("?"));
                        if (g !== -1 && g >= e - 15) {
                            return f.substr(0, g) + d;
                        }
                    } else if (c && b < 0) {
                        var f = a.substr(2);
                        var h = [ " ", ".", "!", "?" ];
                        var i = a.length;
                        for (var j = 0; j < h.length; j++) {
                            if (f.indexOf(h[j]) !== -1) {
                                i = Math.min(i, f.indexOf(h[j]));
                            }
                        }
                        if (i < 15) {
                            return d + f.substr(i + 1);
                        }
                    }
                    if (b > 0) {
                        return a.substr(0, b - 3) + d;
                    } else {
                        return d + a.substr(a.length - e);
                    }
                }
                return a;
            },
            midEllipsis: function(a, b, c) {
                if (!a) return a;
                if (b < 1) return a;
                a = a + "";
                if (a.length <= b) return a;
                if (c === undefined) {
                    c = false;
                }
                var d = c ? 0 : 1;
                var e = [];
                var f = [];
                var g;
                if (c) {
                    g = a.split("");
                } else {
                    g = a.split(/\s/);
                }
                var h = 0;
                for (var i = 0; i < g.length; i++) {
                    if (h > a.length / 2) {
                        break;
                    }
                    e.push(g[i]);
                    h += g[i].length + d;
                }
                f = f.concat(g.slice(e.length));
                var j = e.join(" ").length;
                var k = f.join(" ").length;
                var l = a.length;
                var m = k > j;
                var n;
                while (l > b) {
                    if (m) {
                        n = f.shift();
                        k -= n.length + d;
                    } else {
                        n = e.pop();
                        j -= n.length + d;
                    }
                    l -= n.length + d;
                    m = k > j;
                }
                if (c) {
                    return e.join("") + " ... " + f.join("");
                } else {
                    return e.join(" ") + " ... " + f.join(" ");
                }
            },
            getFilenameFromUrl: function(a, b) {
                var c = a.split("/");
                var d = "";
                if (c.length > 1) {
                    var e = c[c.length - 1];
                    d = e;
                    if (e.match(/\./)) {
                        if (!e.match(/[&\?"']/)) {
                            return e;
                        }
                    }
                }
                if (b) {
                    return d;
                } else {
                    return null;
                }
            },
            getDomainSuffix: function(a) {
                if (!a) {
                    return "";
                }
                a = a.replace(/^(http|https|ftp):\/\//g, "");
                a = a.replace(/^www\./g, "");
                a = a.split("/")[0];
                a = this.ellipsis(a, -20, true);
                a = a.replace(/\.\.\./, "");
                a = a.replace("&hellip;", "");
                return a;
            },
            isArray: "isArray" in Array ? Array.isArray : function(a) {
                return b.call(a) === "[object Array]";
            },
            isObject: b.call(null) === "[object Object]" ? function(a) {
                return a !== null && a !== undefined && b.call(a) === "[object Object]" && a.ownerDocument === undefined;
            } : function(a) {
                return b.call(a) === "[object Object]";
            },
            isString: function(a) {
                return typeof a === "string";
            },
            isFunction: typeof document !== "undefined" && typeof document.getElementsByTagName("body") === "function" ? function(a) {
                return b.call(a) === "[object Function]";
            } : function(a) {
                return typeof a === "function";
            },
            isNumeric: function(a) {
                return !isNaN(parseFloat(a)) && isFinite(a);
            },
            isUrlLike: function(a) {
                if (!a || !this.isString(a)) {
                    return false;
                }
                var b = /^(www|http|ftp|file|evernote)/i;
                var c = /\.(com|org|net|gov|edu|uk|de)/i;
                if (a.match(b) || a.match(c)) {
                    return true;
                } else {
                    return false;
                }
            },
            clone: function(a) {
                var c, d, e, f, g, h;
                if (a === null || a === undefined) {
                    return a;
                }
                if (a.nodeType && a.cloneNode) {
                    return a.cloneNode(true);
                }
                c = b.call(a);
                if (c === "[object Date]") {
                    return new Date(a.getTime());
                }
                if (c === "[object Array]") {
                    d = a.length;
                    g = [];
                    while (d--) {
                        g[d] = PP.Utils.clone(a[d]);
                    }
                } else if (c === "[object Object]" && a.constructor === Object) {
                    g = {};
                    for (h in a) {
                        if (a[h] !== undefined) {
                            g[h] = PP.Utils.clone(a[h]);
                        }
                    }
                }
                return g || a;
            },
            stamp: function() {
                var a = 0, b = "_leaflet_id";
                return function(c) {
                    c[b] = c[b] || ++a;
                    return c[b];
                };
            }(),
            limitExecByInterval: function(a, b, c) {
                var d, e;
                return function f() {
                    var g = arguments;
                    if (d) {
                        e = true;
                        return;
                    }
                    d = true;
                    setTimeout(function() {
                        d = false;
                        if (e) {
                            f.apply(c, g);
                            e = false;
                        }
                    }, b);
                    a.apply(c, g);
                };
            },
            throttle: function(a, b, c, d) {
                var e, f = 0;
                if (typeof c !== "boolean") {
                    d = a;
                    a = c;
                    c = undefined;
                }
                function g() {
                    var g = this, h = +new Date() - f, i = arguments;
                    function j() {
                        f = +new Date();
                        a.apply(g, i);
                    }
                    function k() {
                        e = undefined;
                    }
                    if (d && !e) {
                        j();
                    }
                    e && clearTimeout(e);
                    if (d === undefined && h > b) {
                        j();
                    } else if (c !== true) {
                        e = setTimeout(d ? k : j, d === undefined ? b - h : b);
                    }
                }
                return g;
            },
            debounce: function(a, b, c) {
                var d;
                return function() {
                    var e = this, f = arguments;
                    var g = function() {
                        d = null;
                        if (!c) a.apply(e, f);
                    };
                    var h = c && !d;
                    clearTimeout(d);
                    d = setTimeout(g, b);
                    if (h) a.apply(e, f);
                };
            },
            falseFn: function() {
                return false;
            },
            formatNum: function(a, b) {
                var c = Math.pow(10, b || 5);
                return Math.round(a * c) / c;
            },
            splitWords: function(a) {
                return a.replace(/^\s+|\s+$/g, "").split(/\s+/);
            },
            setOptions: function(a, b) {
                a.options = PP.Utils.extend({}, a.options, b);
                return a.options;
            },
            getParamString: function(a) {
                var b = [];
                for (var c in a) {
                    if (a.hasOwnProperty(c)) {
                        b.push(c + "=" + a[c]);
                    }
                }
                return "?" + b.join("&");
            },
            template: function(a, b) {
                return a.replace(/\{ *([\w_]+) *\}/g, function(a, c) {
                    var d = b[c];
                    if (!b.hasOwnProperty(c)) {
                        throw new Error("No value provided for variable " + a);
                    }
                    return d;
                });
            },
            callback: function(a, b, c) {
                if (a === undefined) {
                    return;
                }
                if (!PP.Utils.isFunction(a)) {
                    return;
                }
                a.apply(b, c);
            },
            getRegex: function(a) {
                if (a instanceof RegExp) {
                    return a;
                }
                a = a.replace(/^!/, "");
                a = a.replace(/!$/, "");
                a = a.replace(/&quot;/g, '"');
                a = a.replace(/&amp;/g, "&");
                a = a.replace(/\//g, "\\/");
                return new RegExp(a);
            },
            defer: function(a, b, c, d) {
                d = d || [];
                c = c || {};
                a = PP.Utils.bind(a, c, d, true);
                var e = setTimeout(a, b);
                return e;
            },
            emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            objectToHtml: function(a) {
                var b = JSON.stringify(a, null, 4);
                b = b.replace(/^\s+/gm, function(a) {
                    return new Array(a.length + 1).join("&nbsp;");
                });
                b = b.replace(/\n/g, "<br/>");
                return b;
            },
            ensureAbsoluteUrl: function(a, b) {
                if (b && !b.match(/^(http|www|ftp)/gi)) {
                    var c = new URI(b);
                    var d = c.resolve(new URI(a)).toString();
                    return d;
                } else {
                    return b;
                }
            },
            keySummary: function(a) {
                var b = Object.keys(a);
                var c = "[" + PP.Utils.ellipsis(b.join(", "), 150, null, "") + "]";
                return c;
            },
            progressModulus: function(a, b) {
                if (a < 100) {
                    return 1;
                } else if (a < 500) {
                    return 5;
                } else if (a < 1e3) {
                    return 10;
                } else if (a < 2e3) {
                    return 20;
                } else {
                    return Math.floor(Math.round(a / 100 / 10) * 10);
                }
            },
            extractISBNs: function(a, b) {
                var c = this;
                var d = [];
                b = b || {};
                if (!("convert" in b)) b.convert = false;
                if (!("unique" in b)) b.unique = false;
                if (a && PP.Utils.isString(a)) {
                    a.split(/[^\dxX\-]/).forEach(function(a) {
                        if (a.length > 1) {
                            if (c.isISBN10(a)) {
                                d.push(a);
                            } else if (c.isISBN13(a)) {
                                d.push(a);
                            }
                        }
                    });
                }
                if (b.convert) {
                    var e = [];
                    d.forEach(function(a) {
                        if (a.length == 10) {
                            e.push(c.isbn10To13(a));
                        } else {
                            e.push(a);
                        }
                    });
                    d = e;
                }
                if (b.unique) {
                    d = PP.Array.unique(d);
                }
                return d;
            },
            isISBN10: function(a) {
                var b = false;
                if (a && PP.Utils.isString(a)) {
                    a = a.toUpperCase().replace(/[\n\r\t\s\-]+/g, "");
                    if (a.match(/^\d{9}[\dX]$/)) {
                        var c = parseInt(a.charAt(0)) * 1;
                        c += parseInt(a.charAt(1)) * 2;
                        c += parseInt(a.charAt(2)) * 3;
                        c += parseInt(a.charAt(3)) * 4;
                        c += parseInt(a.charAt(4)) * 5;
                        c += parseInt(a.charAt(5)) * 6;
                        c += parseInt(a.charAt(6)) * 7;
                        c += parseInt(a.charAt(7)) * 8;
                        c += parseInt(a.charAt(8)) * 9;
                        var d = a.charAt(9) == "X" ? 10 : parseInt(a.charAt(9));
                        c += d * 10;
                        c = c % 11;
                        if (c === 0) b = true;
                    }
                }
                return b;
            },
            isISBN13: function(a) {
                var b = false;
                if (a && PP.Utils.isString(a)) {
                    a = a.toUpperCase().replace(/[\n\r\t\s\-]+/g, "");
                    if (a.match(/^978\d{10}$/)) {
                        var c = parseInt(a.charAt(0));
                        c += parseInt(a.charAt(1)) * 3;
                        c += parseInt(a.charAt(2));
                        c += parseInt(a.charAt(3)) * 3;
                        c += parseInt(a.charAt(4));
                        c += parseInt(a.charAt(5)) * 3;
                        c += parseInt(a.charAt(6));
                        c += parseInt(a.charAt(7)) * 3;
                        c += parseInt(a.charAt(8));
                        c += parseInt(a.charAt(9)) * 3;
                        c += parseInt(a.charAt(10));
                        c += parseInt(a.charAt(11)) * 3;
                        c = (10 - c % 10) % 10;
                        if (parseInt(a.charAt(12)) == c) b = true;
                    }
                }
                return b;
            },
            isbn10To13: function(a) {
                if (!PP.Utils.isString(a)) {
                    return "";
                }
                if (a.length != 10) {
                    return "";
                }
                var b = 38 + 3 * (parseInt(a[0]) + parseInt(a[2]) + parseInt(a[4]) + parseInt(a[6]) + parseInt(a[8])) + parseInt(a[1]) + parseInt(a[3]) + parseInt(a[5]) + parseInt(a[7]);
                var c = (10 - b % 10) % 10;
                return "978" + a.substring(0, 9) + c;
            },
            normalizeLanguage: function(a) {
                if (!PP.Utils.isString(a)) {
                    return "";
                }
                a = PP.Utils.normalizeString(a);
                if (a.toLowerCase() in PP.Utils.languages) {
                    return a.toLowerCase();
                }
                if (!PP.Utils.languagesHelper) {
                    PP.Utils.languagesHelper = {};
                    for (var b in PP.Utils.languages) {
                        if (PP.Utils.languages[b].a3) {
                            if (PP.Utils.isString(PP.Utils.languages[b].a3)) {
                                PP.Utils.languagesHelper[PP.Utils.languages[b].a3] = b;
                            } else {
                                PP.Utils.languages[b].a3.forEach(function(a) {
                                    PP.Utils.languagesHelper[a] = b;
                                });
                            }
                        }
                        if (PP.Utils.languages[b].n) {
                            PP.Utils.languages[b].n.forEach(function(a) {
                                PP.Utils.languagesHelper[a.toLowerCase()] = b;
                            });
                        }
                    }
                }
                if (a.toLowerCase() in PP.Utils.languagesHelper) {
                    return PP.Utils.languagesHelper[a.toLowerCase()];
                }
                return "";
            },
            formatFileSize: function(a) {
                var b = 1024 * 1024 * 1024;
                var c = 1024 * 1024;
                var d = 1024;
                var e = a;
                var f = "KB";
                if (e > b) {
                    a = e / b;
                    f = "GB";
                } else if (e > c) {
                    a = e / c;
                    f = "MB";
                } else {
                    a = e / d;
                    f = "KB";
                }
                return Math.round(a * 10) / 10 + " " + f;
            },
            createErrorStatus: function(a, b) {
                var c = {
                    cls: "error",
                    text: "Something went wrong &mdash; " + a
                };
                if (b) {
                    c.links = b;
                }
                this.createStatus(c);
            },
            createStatus: function(a) {
                if (PP.Globals.isWebApp() && typeof Paperpile !== "undefined" && Paperpile.Utils) {
                    return Paperpile.Utils.createStatus(a);
                } else {
                    PP.Msg.sendMessage({
                        fn: "createStatus",
                        args: [ a ]
                    });
                }
            },
            createErrorWindow: function(a) {
                PP.Msg.sendMessage({
                    fn: "createErrorWindow",
                    args: [ {
                        type: a
                    } ]
                });
            },
            callSerially: function(a, b) {
                if (a.length === 0) {
                    PP.Utils.callback(b);
                } else {
                    var c = a.shift();
                    c(function(c, d) {
                        if (d) {
                            PP.Utils.callback(b, null, [ null, d ]);
                        } else {
                            PP.Utils.callSerially(a, b);
                        }
                    });
                }
            },
            cleanFileName: function(a) {
                a = a.replace(/[\/\\?:|]/g, " - ");
                a = a.replace(/[<>*]/g, " ");
                a = a.replace(/(\w)(\.\.)(\w)/g, function(a, b, c, d) {
                    return b + "." + d;
                });
                a = a.replace(/"/g, "'");
                a = a.replace(/\s*-\s*$/g, "");
                a = a.replace(/\s*-\s*\./g, ".");
                a = a.replace(/(\s*\.)([^\.])/g, function(a, b, c) {
                    return "." + c;
                });
                a = a.replace(/-[- ]*-/g, "-");
                a = a.replace(/-+/g, "-");
                a = a.replace(/ +/g, " ");
                a = a.replace(/^\s*/, "");
                a = a.replace(/\s*$/, "");
                if (a.length > 150) {
                    a = PP.Utils.midEllipsis(a, 145, true);
                }
                return a;
            },
            createLogLevel: function(a) {
                return function() {
                    return a;
                };
            },
            verifyPubResult: function(a, b) {
                var c = [];
                for (var d in a) {
                    if (d.match(/^test_/g)) {
                        continue;
                    }
                    var e = a[d];
                    var f = PP.Utils.getPath(b, d);
                    e = "" + e;
                    f = "" + f;
                    var g = false;
                    if (e.match(/!.+!/)) {
                        var h = PP.Utils.getRegex(e);
                        if (f && f.match(h)) {
                            g = true;
                        }
                    } else {
                        g = e === f;
                    }
                    if (e === "__require_set__") {
                        if (!f) {
                            c.push(d + " not set");
                        }
                    } else if (!g) {
                        c.push(d + " does not match (WANTED: " + e + " GOT: " + f + ")");
                    }
                }
                return c;
            },
            deepEquals: function(a, b) {
                var c;
                for (c in a) {
                    if (typeof b[c] == "undefined") {
                        return false;
                    }
                }
                for (c in a) {
                    if (a[c]) {
                        switch (typeof a[c]) {
                          case "object":
                            if (!this.deepEquals(a[c], b[c])) {
                                return false;
                            }
                            break;

                          case "function":
                            if (typeof b[c] == "undefined" || c != "equals" && a[c].toString() != b[c].toString()) return false;
                            break;

                          default:
                            if (a[c] != b[c]) {
                                return false;
                            }
                        }
                    } else {
                        if (b[c]) return false;
                    }
                }
                for (c in b) {
                    if (typeof a[c] == "undefined") {
                        return false;
                    }
                }
                return true;
            },
            getTabId: function(a) {
                if (a && a.tab && a.tab.id !== -1) {
                    return a.tab.id;
                } else if (a) {
                    return a.tabId;
                } else {
                    return undefined;
                }
            },
            logToBg: function(a) {
                if (!PP.Globals.isBackgroundPage()) {
                    PP.Msg.sendMessage({
                        fn: "logToBg",
                        args: [ a ]
                    });
                }
            },
            decodeProxyString: function(a) {
                var b = [];
                if (a && PP.Utils.isString(a)) {
                    a.split(/\^/).forEach(function(a) {
                        var c = a.split(/\|/);
                        if (c && c.length == 3) {
                            var d = {
                                name: c[0],
                                url: c[1],
                                active: false
                            };
                            if (c[2] == "1") d.active = true;
                            b.push(d);
                        }
                    });
                }
                return b;
            },
            getProxyLoginUrl: function() {
                var a = PP.backend.Settings.getSetting("proxy_list");
                if (!a) return;
                var b = PP.Utils.decodeProxyString(a);
                if (b.length) {
                    var c = b[0].url;
                    return c;
                }
            },
            getPermalink: function(a) {
                var b = PP.Globals.getUrlBase();
                return b + "/app/p/" + a._id;
            },
            encodeProxyString: function(a) {
                var b = [];
                a.forEach(function(a) {
                    b.push([ a.name, a.url, a.active ? "1" : "0" ].join("|"));
                });
                return b.join("^");
            },
            encode64: function(a) {
                var b = "", c = 0, d = a.length, e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", f, g, h, i, j, k, l;
                while (c < d) {
                    f = a.charCodeAt(c++);
                    g = a.charCodeAt(c++);
                    h = a.charCodeAt(c++);
                    i = f >> 2;
                    j = (f & 3) << 4 | g >> 4;
                    k = (g & 15) << 2 | h >> 6;
                    l = h & 63;
                    if (isNaN(g)) k = l = 64; else if (isNaN(h)) l = 64;
                    b = b + e.charAt(i) + e.charAt(j) + e.charAt(k) + e.charAt(l);
                }
                return b;
            },
            stackTrace: function() {
                var a = new Error("Custom");
                var b = "";
                if (a && a.stack) {
                    b = a.stack;
                }
                return b;
            },
            getCookie: function(a) {
                if (!a) {
                    return null;
                }
                return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(a).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            },
            makeAlphaNumericID: function(a) {
                var b = "";
                var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var d = 0; d < a; d++) {
                    b += c.charAt(Math.floor(Math.random() * c.length));
                }
                return b;
            },
            convertInlineLatexToHtml: function(a) {
                var b = function(a) {
                    var b = 0;
                    var c = [];
                    var d = "";
                    var e = 0;
                    if (a.indexOf("{") == -1) {
                        return [ {
                            level: 0,
                            pre: "",
                            value: a,
                            close: false
                        } ];
                    }
                    while (a.indexOf("{") != -1 | a.indexOf("}") != -1 && e < 100) {
                        e += 1;
                        var f = "", d = "";
                        if (a.indexOf("{") != -1 && a.indexOf("{") < a.indexOf("}")) {
                            b += 1;
                            d = a.substring(0, a.indexOf("{"));
                            a = a.substring(a.indexOf("{") + 1);
                            if (a.indexOf("{") != -1 && a.indexOf("{") < a.indexOf("}")) {
                                c.push({
                                    level: b,
                                    pre: d,
                                    value: f,
                                    close: false
                                });
                            } else if (a.indexOf("}") != -1) {
                                f = a.substring(0, a.indexOf("}"));
                                c.push({
                                    level: b,
                                    pre: d,
                                    value: f,
                                    close: true
                                });
                                a = a.substring(a.indexOf("}") + 1);
                                b -= 1;
                            } else {
                                c.push({
                                    level: b,
                                    pre: d,
                                    value: a,
                                    close: false
                                });
                                a = "";
                                b -= 1;
                            }
                        } else if (a.indexOf("}") != -1) {
                            f = a.substring(0, a.indexOf("}"));
                            c.push({
                                level: b,
                                pre: d,
                                value: f,
                                close: true
                            });
                            a = a.substring(a.indexOf("}") + 1);
                            b -= 1;
                        } else {
                            c.push({
                                level: b,
                                pre: d,
                                value: a,
                                close: false
                            });
                            a = "";
                            b -= 1;
                        }
                    }
                    return c;
                };
                var c = a.split("$");
                var d = "";
                for (var e = 0; e < c.length; e++) {
                    if (c[e].length) {
                        var f = b(c[e]);
                        var g = 0;
                        var h = [];
                        for (var i = 0; i < f.length; i++) {
                            if (f[i].level >= g) {
                                g = f[i].level;
                                switch (f[i].pre) {
                                  case "_":
                                    h.push("sub");
                                    d += "<sub>";
                                    d += f[i].value;
                                    if (f[i].close) {
                                        d += "</" + h.pop() + ">";
                                    }
                                    break;

                                  case "^":
                                    h.push("sup");
                                    d += "<sup>";
                                    d += f[i].value;
                                    if (f[i].close) {
                                        d += "</" + h.pop() + ">";
                                    }
                                    break;

                                  case "\\emph":
                                    h.push("i");
                                    d += "<i>";
                                    d += f[i].value;
                                    if (f[i].close) {
                                        d += "</" + h.pop() + ">";
                                    }
                                    break;

                                  case "\\textit":
                                    h.push("i");
                                    d += "<i>";
                                    d += f[i].value;
                                    if (f[i].close) {
                                        d += "</" + h.pop() + ">";
                                    }
                                    break;

                                  case "\\textbf":
                                    h.push("b");
                                    d += "<b>";
                                    d += f[i].value;
                                    if (f[i].close) {
                                        d += "</" + h.pop() + ">";
                                    }
                                    break;

                                  case "\\text":
                                    d += f[i].value;
                                    break;

                                  default:
                                    d += f[i].value;
                                    if (f[i].close && h.length) {
                                        d += "</" + h.pop() + ">";
                                    }
                                    break;
                                }
                            } else {
                                g -= 1;
                                d += f[i].value;
                                if (f[i].close && h.length) {
                                    d += "</" + h.pop() + ">";
                                }
                            }
                        }
                        while (h.length) {
                            pre = h.pop();
                            if (pre !== "") d += "</" + pre + ">";
                        }
                    }
                }
                return d;
            },
            getHtmlAttribute: function(a, b) {
                var c;
                if ("attribs" in a) {
                    if (b in a.attribs) c = a.attribs[b];
                } else {
                    c = a.getAttribute(b);
                }
                return c;
            }
        };
        function e(a) {
            var b, c, d = [ "webkit", "moz", "o", "ms" ];
            for (b = 0; b < d.length && !c; b++) {
                c = window[d[b] + a];
            }
            return c;
        }
        function f(a) {
            return window.setTimeout(a, 1e3 / 60);
        }
    })();
    PP.Utils.apply = PP.Utils.extend;
    PP.Utils.applyIf = PP.Utils.extendIf;
    PP.pp = PP.Utils.prettyPrint;
    var l1 = PP.Utils.createLogLevel([ "font-weight: bold;", "color: rgb(50, 50, 100)" ].join(""));
    var l2 = PP.Utils.createLogLevel([ "color: rgb(50, 50, 50);", "margin-left: 2em;" ].join(""));
    var l3 = PP.Utils.createLogLevel([ "color: rgb(150, 150, 150);", "margin-left: 4em;" ].join(""));
    var l4 = PP.Utils.createLogLevel([ "font-style: italic;", "color: rgb(150, 150, 150);", "margin-left: 6em;" ].join(""));
    var e1 = PP.Utils.createLogLevel([ "font-weight: bold;", "color: rgb(255, 50, 50);" ].join(""));
    PP.UUID = {
        parts: [],
        salt: {},
        timestamp: {}
    };
    (function() {
        var a = Math.pow(2, 14), b = Math.pow(2, 16), c = Math.pow(2, 28), d = Math.pow(2, 32);
        function e(a, b, c) {
            var d = String(a);
            c = c || " ";
            while (d.length < b) {
                d = c + d;
            }
            return d;
        }
        function f(a, b) {
            var c = a.toString(16);
            if (c.length > b) {
                c = c.substring(c.length - b);
            } else if (c.length < b) {
                c = e(c, b, "0");
            }
            return c;
        }
        function g(a, b) {
            var c = Math.random() * (b - a + 1);
            return Math.floor(c) + a;
        }
        function h(a) {
            if (typeof a === "number") {
                var b = Math.floor(a / d);
                return {
                    lo: Math.floor(a - b * d),
                    hi: b
                };
            }
            return a;
        }
        PP.UUID.init = function() {
            var e = this, f, h;
            e.clockSeq = g(0, a - 1);
            f = e.salt || (e.salt = {});
            h = e.timestamp || (e.timestamp = {});
            f.lo = g(0, d - 1);
            f.hi = g(0, b - 1);
            h.lo = g(0, d - 1);
            h.hi = g(0, c - 1);
        };
        PP.UUID.generate = function() {
            var a = this, b = a.parts, c = a.timestamp;
            b[0] = f(c.lo, 8);
            b[1] = f(c.hi & 65535, 4);
            b[2] = f(c.hi >>> 16 & 4095 | a.version << 12, 4);
            b[3] = f(128 | a.clockSeq >>> 8 & 63, 2) + f(a.clockSeq & 255, 2);
            b[4] = f(a.salt.hi, 4) + f(a.salt.lo, 8);
            a.init();
            return b.join("-").toLowerCase();
        };
    })();
    PP.UUID.init();
    var PP_EVENTS_KEY = "_pp_events";
    var protectErrors = function(a) {
        var b = this;
        return function() {
            try {
                a.apply(b, arguments);
            } catch (a) {
                logError(a);
            }
        };
    };
    PP.Events = {
        addEventListener: function(a, b, c) {
            var d = this[PP_EVENTS_KEY] = this[PP_EVENTS_KEY] || {}, e, f, g;
            if (typeof a === "object") {
                for (e in a) {
                    if (a.hasOwnProperty(e)) {
                        this.addEventListener(e, a[e], b);
                    }
                }
                return;
            }
            a = PP.Utils.splitWords(a);
            for (f = 0, g = a.length; f < g; f++) {
                d[a[f]] = d[a[f]] || [];
                d[a[f]].push({
                    action: b,
                    context: c || this
                });
            }
            return;
        },
        hasEventListeners: function(a) {
            return PP_EVENTS_KEY in this && a in this[PP_EVENTS_KEY] && this[PP_EVENTS_KEY][a].length > 0;
        },
        removeEventListener: function(a, b, c) {
            var d = this[PP_EVENTS_KEY], e, f, g, h, i;
            if (typeof a === "object") {
                for (e in a) {
                    if (a.hasOwnProperty(e)) {
                        this.removeEventListener(e, a[e], b);
                    }
                }
                return this;
            }
            a = PP.Utils.splitWords(a);
            for (f = 0, g = a.length; f < g; f++) {
                if (this.hasEventListeners(a[f])) {
                    h = d[a[f]];
                    for (i = h.length - 1; i >= 0; i--) {
                        if ((!b || h[i].action === b) && (!c || h[i].context === c)) {
                            h.splice(i, 1);
                        }
                    }
                }
            }
            return this;
        },
        fireEvent: function(a, b) {
            if (!this.hasEventListeners(a)) {
                return this;
            }
            var c = PP.Utils.extend({
                type: a,
                target: this
            }, b);
            var d = this[PP_EVENTS_KEY][a].slice();
            for (var e = 0, f = d.length; e < f; e++) {
                try {
                    d[e].action.call(d[e].context || this, c);
                } catch (a) {
                    if (PP.Errors) {
                        PP.Errors.logErrorObject(a);
                    } else {
                        throw new Error("Error calling listener", a);
                    }
                }
            }
            return this;
        },
        clearListeners: function() {
            var a = this[PP_EVENTS_KEY], b;
            for (var b in a) {
                if (a.hasOwnProperty(b)) {
                    delete a[b];
                }
            }
        },
        removeAllListeners: function() {
            this.clearListeners();
        }
    };
    PP.Events.on = PP.Events.addEventListener;
    PP.Events.un = PP.Events.removeEventListener;
    PP.Events.fire = PP.Events.fireEvent;
    PP.Messenger = PP.Class.extend({
        includes: [ PP.Events ],
        passSelfMessages: false,
        logMessages: false,
        debug: false,
        disabled: false,
        initialize: function() {
            this.ports = {};
            this.portsTimesReconnected = {};
            this.callbacks = {};
            this.receiptExpected = {};
            this.receiptTimeout = {};
            this.timeouts = {};
            this.persistentPorts = {};
            this.listening = false;
            this.listenForCallbacks = true;
        },
        disableAllMessaging: function() {
            this.disabled = true;
        },
        handleAppFunctionMessages: function(a) {
            var b = this;
            b.on("message", function(c) {
                var d = c.msg;
                if (d.fn) {
                    if (!a[d.fn]) {
                        b.c.log([ "No app function", d.fn ]);
                    } else {
                        if (d.args === undefined) {
                            d.args = [];
                        } else if (!PP.Utils.isArray(d.args)) {
                            d.args = [ d.args ];
                        }
                        var e = PP.Utils.clone(d.args);
                        delete d.args;
                        e.push(d);
                        b.c.log("Calling fn", d.fn, "with args", e);
                        PP.Utils.callback(a[d.fn], a, e);
                    }
                }
            });
        },
        getId: function() {
            return window.PP_WINDOW_ID;
        },
        connectPort: function(a, b) {
            if (this.ports[a]) {
                console.error("  already have a port by the name " + a + " - not connecting!");
                return;
            }
            this.c.log("Trying to connect to port " + a);
            if (typeof window.chrome !== "undefined" && chrome.runtime && chrome.runtime.onConnect) {
                var c;
                try {
                    c = chrome.runtime.connect(chrome.runtime.id, {
                        name: a
                    });
                } catch (a) {
                    this.c.log(a);
                }
                if (c) {
                    this._listenConnect(c);
                    if (b === true) {
                        this.persistentPorts[a] = true;
                    }
                    return true;
                } else {
                    this.c.log("Failed to connect to port ", a);
                }
            } else {
                this.c.error("Can't connect port: not running as a Chrome extension!");
            }
            return false;
        },
        listen: function() {
            if (typeof window.chrome !== "undefined" && chrome.runtime && chrome.runtime.onConnect && !this.listening) {
                this.listening = true;
                chrome.runtime.onConnect.addListener(PP.Utils.bind(this._listenConnect, this));
            }
        },
        listenPost: function() {
            var a = new Date().getTime();
            window._postListener = PP.Utils.bind(this.onPostMessage, this, [ a ]);
            window.addEventListener("message", window._postListener, false);
        },
        stopListenPost: function() {
            window.removeEventListener("message", window._postListener, false);
        },
        listenForSingleMessages: function() {
            var a = this;
            chrome.runtime.onMessage.addListener(function(b, c, d) {
                var e = {};
                console.log("Heard one-off message", b, c);
                PP.Utils.apply(e, b);
                e.tab = c.tab;
                a._onMessage(e);
            });
        },
        onPostMessage: function(a, b) {
            if (this.destroyed) {
                return;
            }
            var c = a.data;
            this._onMessage(c);
        },
        _onMessage: function(a) {
            if (a.targetId !== undefined) {
                if (a.targetId !== this.getId()) {
                    return;
                }
            }
            if (a.fromOutsideExtension && !a.tab) {
                if (!this.passSelfMessages) {
                    return;
                }
            } else {}
            if (!PP.Utils.isObject(a)) {
                console.log("Extension message is not an object", a);
                return;
            }
            var b = Object.keys(a);
            var c = "[" + PP.Utils.ellipsis(b.join(", "), 150, null, "") + "]";
            if (a.fn) {
                c += ', app function "' + a.fn + '"';
            }
            if (this.logMessages) {
                if (a.crudResponse) {}
                console.log("<\tmsg " + c + " from " + a.source);
            }
            if (this.listenForCallbacks && a.isCallbackResponse) {
                var d = a.callbackId;
                var e = a.callbackArgs;
                if (this.callbacks[d]) {
                    PP.Utils.callback(this.callbacks[d], this, e);
                    delete this.callbacks[d];
                    var f = this.timeouts[d];
                    if (f) {
                        window.clearTimeout(f);
                        delete this.timeouts[a.callbackId];
                    }
                    this.clearLoadingMessage();
                } else {
                    this.c.log("CALLBACK NOT FOUND", d);
                }
                return;
            }
            this.fire("message", {
                msg: a
            });
        },
        clearLoadingMessage: function() {
            if (this.loadingMessageTimeout) {
                window.clearTimeout(this.loadingMessageTimeout);
                delete this.loadingMessageTimeout;
            }
            if (this.loadingMessageObject) {
                PP.backend.Utils.clearLoadingMessage(this.loadingMessageObject);
                delete this.loadingMessageObject;
            }
        },
        onMessage: function(a, b) {
            if (this.destroyed) {
                return;
            }
            if (a) {
                var c = b.name;
                if (a.requestReceipt) {
                    this.c.log("Got message with requested receipt", a.requestReceipt);
                    b.postMessage({
                        sendReceipt: a.requestReceipt
                    });
                }
                if (a.sendReceipt) {
                    this.c.log("Got receipt with id and clear timeout", a.sendReceipt, this.receiptExpected[c]);
                    if (a.sendReceipt === this.receiptExpected[c]) {
                        this.c.log("Clearing receipt timeout", this.receiptTimeout[c]);
                        window.clearTimeout(this.receiptTimeout[c]);
                        this.receiptExpected[c] = null;
                        this.receiptTimeout[c] = null;
                    }
                }
            }
            if (b.sender) {
                a.tab = b.sender.tab;
            }
            this._onMessage(a);
        },
        callback: function(a, b) {
            if (!PP.Utils.isArray(b)) {
                b = [ b ];
            }
            var c = {
                isCallbackResponse: true,
                callbackId: a.callbackId,
                callbackArgs: b
            };
            this.sendMessage(c);
        },
        sendMessage: function(a) {
            var b = this;
            if (this.destroyed) {
                return;
            }
            if (this.disabled === true) {
                return;
            }
            if (!a.source) {
                a.source = this.getId();
            }
            a.isFromPaperpile = true;
            if (!this.guid) {
                this.guid = PP.UUID.generate();
            }
            a.source_guid = this.guid;
            if (a.callback) {
                if (a.loadingMessage) {
                    var b = this;
                    var c = a.loadingMessageDelay || 1e3;
                    this.loadingMessageTimeout = window.setTimeout(function() {
                        b.loadingMessageObject = PP.backend.Utils.showLoadingMessage(a.loadingMessage);
                    }, c);
                }
                var d = PP.UUID.generate();
                var e = a.callback;
                this.callbacks[d] = e;
                delete a.callback;
                a.callbackId = d;
                if (a.timeout) {
                    var f = PP.Utils.bind(function() {
                        this.clearLoadingMessage();
                        PP.Utils.callback(e, this, [ null, "Callback timed out." ]);
                    }, this);
                    var g = window.setTimeout(f, a.timeout);
                    delete a.timeout;
                    this.timeouts[d] = g;
                }
            }
            if (typeof window.chrome === "undefined" || !chrome.runtime || !chrome.runtime.getManifest) {
                a.fromOutsideExtension = true;
                this.sendPostMessage(a);
                var h = Object.keys(a);
                if (a.crudResponse) {}
                var i = "[" + PP.Utils.ellipsis(h.join(", "), 150, null, "") + "]";
                if (this.logMessages) {}
                return;
            }
            if (a.targetTab !== undefined) {
                for (var j in this.ports) {
                    if (this.ports.hasOwnProperty(j)) {
                        var k = this.ports[j];
                        if (k.sender && k.sender.tab && k.sender.tab.id === a.targetTab) {
                            this.c.log("--> Sending msg", a, "to target tab: ", a.targetTab);
                            this._addReceiptTimeout(k, a);
                            k.postMessage(a);
                        }
                    }
                }
            } else {
                var l = false;
                for (var j in this.ports) {
                    if (this.ports.hasOwnProperty(j)) {
                        l = true;
                        var k = this.ports[j];
                        j = PP.Utils.ellipsis(j, -30, null, "");
                        var h = Object.keys(a);
                        var i = "[" + PP.Utils.ellipsis(h.join(", "), 150, null, "") + "]";
                        if (a.fn) {
                            i += ', app function "' + a.fn + '"';
                        }
                        if (this.logMessages) {
                            console.log(" >\tmsg " + i + " to port " + j);
                        }
                        this._addReceiptTimeout(k, a);
                        k.postMessage(a);
                    }
                }
            }
            if (!l) {
                if (a.source && a.source == "webapp") {
                    if (!a.backgroundPing) {
                        b.fire("disconnect", {
                            portName: "background-dummy",
                            info: "port disconnected; no ports available"
                        });
                    }
                }
            }
        },
        _addReceiptTimeout: function(a, b) {
            var c = this;
            var d = a.name;
            if (!this.receiptExpected[d] && PP.Msg.getId() !== "bg") {
                c.receiptExpected[d] = PP.UUID.generate();
                c.receiptTimeout[d] = window.setTimeout(function() {
                    c.c.log("Did not get response for", c.receiptExpected[d], b, d);
                    c.reconnect(d, b);
                    c.receiptExpected[d] = null;
                    c.receiptTimeout[d] = null;
                }, 1e3);
                b.requestReceipt = c.receiptExpected[d];
                c.c.log("Setting up receipt timeout", c.receiptTimeout[d], b.requestReceipt);
            }
        },
        sendPostMessage: function(a) {
            if (!a.source) {
                a.source = this.getId();
            }
            a.isFromPaperpile = true;
            if (window.isWorker) {
                postMessage(a);
            } else {
                window.postMessage(a, "*");
            }
        },
        _listenConnect: function(a) {
            var b = this;
            this.ports[a.name] = a;
            if (!(a.name in b.portsTimesReconnected)) {
                b.portsTimesReconnected[a.name] = 0;
            }
            for (var c in this.ports) {
                this.c.log("  [port summary ]" + c);
            }
            var d = PP.Utils.bind(this.onMessage, this, [ a ]);
            var e = a.name;
            var f = function(a) {
                delete b.ports[e];
                b.c.log("Port disconnected ", e);
                if (window._postListener) {}
                var c = true;
                if (b.persistentPorts[e]) {
                    if (e in b.portsTimesReconnected && b.portsTimesReconnected[e] < 3) {
                        c = false;
                        b.portsTimesReconnected[e]++;
                        console.log("Disconnect from port received. Trying to reconnect persistent port " + e + " for the " + b.portsTimesReconnected[e] + " time");
                        b.reconnect(e, null, 500);
                    }
                }
                if (c) {
                    b.fire("disconnect", {
                        portName: e,
                        info: "port disconnected; tried 3 times to reconnect"
                    });
                }
            };
            a.onMessage.addListener(d);
            a.onDisconnect.addListener(f);
            this.fire("connect", {
                port: a
            });
            this.c.log("Port successfully connected ", e);
        },
        reconnect: function(a, b, c) {
            if (c === null || c === undefined) {
                c = 100;
            }
            var d = this;
            delete this.ports[a];
            PP.Utils.defer(function() {
                var c = d.connectPort(a, true);
                if (!c) {
                    d.fire("lost_connection", {
                        portName: a
                    });
                } else {
                    d.c.log("Connected again to port", a);
                    d.fire("reconnected", {
                        portName: a
                    });
                    if (b) {
                        d.sendMessage(b);
                    }
                }
            }, c);
        },
        old_reconnect: function(a, b) {
            var c = this;
            if (b === undefined) {
                b = {
                    retryCount: 0,
                    delay: 250
                };
            }
            if (c.ports[a]) {
                c.c.log("  reconnected to port ", a, " -- stopping reconnect loop!");
                return;
            }
            if (b.retryCount === 5) {
                c.fire("lost_connection", {
                    portName: a
                });
            }
            if (b.retryCount > 10) {
                c.c.log("  taking a long time to reconnect... maybe it's really gone");
            } else {
                c.c.log("  reconnection try #", b.retryCount);
            }
            PP.Utils.defer(function() {
                b.retryCount += 1;
                b.delay *= 2;
                var d = c.connectPort(a, true);
                if (!d) {
                    c.reconnect(a, b);
                } else {
                    c.c.log("  Connected again to port", a);
                }
            }, b.delay);
        },
        destroy: function() {
            this.destroyed = true;
        }
    });
    createSingleton(PP, "Messenger", "Msg");
    var app = {
        id: null,
        onMessage: function(a) {
            if (a.msg.source === "cb") {
                return;
            }
            var b = a.msg;
            if (!b.forwarded) {
                b.forwarded = true;
                if (b.fromOutsideExtension) {
                    b.fromOutsideExtension = false;
                    PP.Msg.sendMessage(b);
                } else {
                    PP.Msg.sendPostMessage(b);
                }
            }
        },
        onDisconnect: function(a) {
            var b = this;
            var c = a.portName;
            if (c.match(/background/i)) {
                PP.Msg.sendPostMessage({
                    backgroundDisconnected: true,
                    extid: b.extid,
                    info: a.info
                });
            }
        },
        onLostConnection: function() {
            console.log(this.id + ": onLostConnection called.");
            var a = Object.keys(PP.Msg.ports).length;
            if (a === 0) {
                console.log(this.id + ": no active ports found. Also calling disconnected.");
                this.onDisconnect({
                    portName: "background-dummy"
                });
                PP.Utils.defer(function() {
                    PP.Msg.stopListenPost();
                }, 500);
            } else {
                PP.Msg.stopListenPost();
            }
        },
        createExtensionRunningNode: function() {
            var a = document.createElement("div");
            a.id = "pp-extension-running";
            a.style.display = "none";
            document.body.appendChild(a);
        }
    };
    PP.cb.App = app;
    PP.cb.App.id = window.PP_CB_ID;
    PP.cb.App.extid = chrome.runtime.id;
    console.log("New CB injected with ID:" + PP.cb.App.id);
    window.PP_WINDOW_ID = "cb";
    PP.Msg.listen();
    PP.Msg.listenPost();
    PP.Msg.listenForCallbacks = false;
    PP.Msg.passSelfMessages = true;
    PP.Msg.on("message", app.onMessage, app);
    var guid = PP.UUID.generate();
    PP.Msg.connectPort("background--" + window.location.href + "--" + guid, true);
    PP.Msg.on("disconnect", app.onDisconnect, app);
    PP.Msg.on("lost_connection", app.onLostConnection, app);
    function init() {
        app.createExtensionRunningNode();
    }
    if (/loaded|complete|interactive/.test(document.readyState)) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
}