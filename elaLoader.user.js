// ==UserScript==
// @name ELA
// @namespace https://www.bondageprojects.com/
// @version 0.1INDEV
// @description Eddii's Little Additions
// @author Eddii
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @run-at document-end
// @grant none
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement("script");
    script.language = "JavaScript";
    script.setAttribute("crossorigin", "anonymous");
    script.src = `https://eddiidev.github.io/ELA/script.js?{Date.now()}`;
    document.head.appendChild(script);
})();
