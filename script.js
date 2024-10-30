const ELA_VERSION = "0.2.9INDEV";

window.LoadedError = class extends Error {};
if (window.ELA_VERSION) {
  throw new LoadedError("ELA already loaded");
}
// Bondage Club Mod Development Kit (1.2.0)
// For more info see: https://github.com/Jomshir98/bondage-club-mod-sdk
/** @type {ModSDKGlobalAPI} */
var bcModSDK=function(){"use strict";const o="1.2.0";function e(o){alert("Mod ERROR:\n"+o);const e=new Error(o);throw console.error(e),e}const t=new TextEncoder;function n(o){return!!o&&"object"==typeof o&&!Array.isArray(o)}function r(o){const e=new Set;return o.filter((o=>!e.has(o)&&e.add(o)))}const i=new Map,a=new Set;function c(o){a.has(o)||(a.add(o),console.warn(o))}function s(o){const e=[],t=new Map,n=new Set;for(const r of f.values()){const i=r.patching.get(o.name);if(i){e.push(...i.hooks);for(const[e,a]of i.patches.entries())t.has(e)&&t.get(e)!==a&&c(`ModSDK: Mod '${r.name}' is patching function ${o.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${e}\nPatch1:\n${t.get(e)||""}\nPatch2:\n${a}`),t.set(e,a),n.add(r.name)}}e.sort(((o,e)=>e.priority-o.priority));const r=function(o,e){if(0===e.size)return o;let t=o.toString().replaceAll("\r\n","\n");for(const[n,r]of e.entries())t.includes(n)||c(`ModSDK: Patching ${o.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}(o.original,t);let i=function(e){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookChainExit)||void 0===i?void 0:i.call(t,o.name,n),c=r.apply(this,e);return null==a||a(),c};for(let t=e.length-1;t>=0;t--){const n=e[t],r=i;i=function(e){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookEnter)||void 0===i?void 0:i.call(t,o.name,n.mod),c=n.hook.apply(this,[e,o=>{if(1!==arguments.length||!Array.isArray(e))throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof o}`);return r.call(this,o)}]);return null==a||a(),c}}return{hooks:e,patches:t,patchesSources:n,enter:i,final:r}}function l(o,e=!1){let r=i.get(o);if(r)e&&(r.precomputed=s(r));else{let e=window;const a=o.split(".");for(let t=0;t<a.length-1;t++)if(e=e[a[t]],!n(e))throw new Error(`ModSDK: Function ${o} to be patched not found; ${a.slice(0,t+1).join(".")} is not object`);const c=e[a[a.length-1]];if("function"!=typeof c)throw new Error(`ModSDK: Function ${o} to be patched not found`);const l=function(o){let e=-1;for(const n of t.encode(o)){let o=255&(e^n);for(let e=0;e<8;e++)o=1&o?-306674912^o>>>1:o>>>1;e=e>>>8^o}return((-1^e)>>>0).toString(16).padStart(8,"0").toUpperCase()}(c.toString().replaceAll("\r\n","\n")),d={name:o,original:c,originalHash:l};r=Object.assign(Object.assign({},d),{precomputed:s(d),router:()=>{},context:e,contextProperty:a[a.length-1]}),r.router=function(o){return function(...e){return o.precomputed.enter.apply(this,[e])}}(r),i.set(o,r),e[r.contextProperty]=r.router}return r}function d(){for(const o of i.values())o.precomputed=s(o)}function p(){const o=new Map;for(const[e,t]of i)o.set(e,{name:e,original:t.original,originalHash:t.originalHash,sdkEntrypoint:t.router,currentEntrypoint:t.context[t.contextProperty],hookedByMods:r(t.precomputed.hooks.map((o=>o.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return o}const f=new Map;function u(o){f.get(o.name)!==o&&e(`Failed to unload mod '${o.name}': Not registered`),f.delete(o.name),o.loaded=!1,d()}function g(o,t){o&&"object"==typeof o||e("Failed to register mod: Expected info object, got "+typeof o),"string"==typeof o.name&&o.name||e("Failed to register mod: Expected name to be non-empty string, got "+typeof o.name);let r=`'${o.name}'`;"string"==typeof o.fullName&&o.fullName||e(`Failed to register mod ${r}: Expected fullName to be non-empty string, got ${typeof o.fullName}`),r=`'${o.fullName} (${o.name})'`,"string"!=typeof o.version&&e(`Failed to register mod ${r}: Expected version to be string, got ${typeof o.version}`),o.repository||(o.repository=void 0),void 0!==o.repository&&"string"!=typeof o.repository&&e(`Failed to register mod ${r}: Expected repository to be undefined or string, got ${typeof o.version}`),null==t&&(t={}),t&&"object"==typeof t||e(`Failed to register mod ${r}: Expected options to be undefined or object, got ${typeof t}`);const i=!0===t.allowReplace,a=f.get(o.name);a&&(a.allowReplace&&i||e(`Refusing to load mod ${r}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),u(a));const c=o=>{let e=g.patching.get(o.name);return e||(e={hooks:[],patches:new Map},g.patching.set(o.name,e)),e},s=(o,t)=>(...n)=>{var i,a;const c=null===(a=(i=m.errorReporterHooks).apiEndpointEnter)||void 0===a?void 0:a.call(i,o,g.name);g.loaded||e(`Mod ${r} attempted to call SDK function after being unloaded`);const s=t(...n);return null==c||c(),s},p={unload:s("unload",(()=>u(g))),hookFunction:s("hookFunction",((o,t,n)=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const i=l(o),a=c(i);"number"!=typeof t&&e(`Mod ${r} failed to hook function '${o}': Expected priority number, got ${typeof t}`),"function"!=typeof n&&e(`Mod ${r} failed to hook function '${o}': Expected hook function, got ${typeof n}`);const s={mod:g.name,priority:t,hook:n};return a.hooks.push(s),d(),()=>{const o=a.hooks.indexOf(s);o>=0&&(a.hooks.splice(o,1),d())}})),patchFunction:s("patchFunction",((o,t)=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const i=l(o),a=c(i);n(t)||e(`Mod ${r} failed to patch function '${o}': Expected patches object, got ${typeof t}`);for(const[n,i]of Object.entries(t))"string"==typeof i?a.patches.set(n,i):null===i?a.patches.delete(n):e(`Mod ${r} failed to patch function '${o}': Invalid format of patch '${n}'`);d()})),removePatches:s("removePatches",(o=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const t=l(o);c(t).patches.clear(),d()})),callOriginal:s("callOriginal",((o,t,n)=>{"string"==typeof o&&o||e(`Mod ${r} failed to call a function: Expected function name string, got ${typeof o}`);const i=l(o);return Array.isArray(t)||e(`Mod ${r} failed to call a function: Expected args array, got ${typeof t}`),i.original.apply(null!=n?n:globalThis,t)})),getOriginalHash:s("getOriginalHash",(o=>{"string"==typeof o&&o||e(`Mod ${r} failed to get hash: Expected function name string, got ${typeof o}`);return l(o).originalHash}))},g={name:o.name,fullName:o.fullName,version:o.version,repository:o.repository,allowReplace:i,api:p,loaded:!0,patching:new Map};return f.set(o.name,g),Object.freeze(p)}function h(){const o=[];for(const e of f.values())o.push({name:e.name,fullName:e.fullName,version:e.version,repository:e.repository});return o}let m;const y=void 0===window.bcModSdk?window.bcModSdk=function(){const e={version:o,apiVersion:1,registerMod:g,getModsInfo:h,getPatchingInfo:p,errorReporterHooks:Object.seal({apiEndpointEnter:null,hookEnter:null,hookChainExit:null})};return m=e,Object.freeze(e)}():(n(window.bcModSdk)||e("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==o&&alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk);return"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y),y}();
var ELAstruggleStrength = 1;

(async function () {
  const modApi = bcModSDK.registerMod({ 
    name: "ELA",
    fullName: "Eddii's Little Additions",
    version: ELA_VERSION,
    repository: "https://github.com/Eddiidev/ELA",
  });

  await waitFor(() => ServerIsConnected && ServerSocket);
  
  modApi.patchFunction("StruggleStrengthProcess", {"P = P * (100 / (StruggleProgress + 50));" : "P = P * (ELAstruggleStrength * 100 / (StruggleProgress + 50));"})

  modApi.hookFunction("ChatRoomAddCharacterToChatRoom", 4, (args, next) => {
    var joiningMember = args[0]
    if (!ServerChatRoomGetAllowItem(Player, joiningMember) || !ActivityCheckPrerequisite("UseArms", Player, joiningMember) || !ActivityCheckPrerequisite("UseHands", Player, joiningMember)) {
      next(args); return;
    } 
    var joiningMemberNumber = joiningMember.MemberNumber
    if (!autoHuggedMembers.includes(joiningMemberNumber)) {next(args);return;}

    for (const char of ChatRoomCharacter) {
        if (char.MemberNumber == joiningMemberNumber) {next(args);return;}
    }
    if (hugOnceMembers.includes(joiningMemberNumber)) {
      hugOnceMembers.splice(hugOnceMembers.indexOf(joiningMemberNumber), 1)
      autoHuggedMembers.splice(autoHuggedMembers.indexOf(joiningMemberNumber), 1)
      pushSettings()
    }
    setTimeout(() => {ServerSend("ChatRoomChat", makeGrabPacket(joiningMemberNumber))}, 600)
    setTimeout(() => {ServerSend("ChatRoomChat", makeHugPacket(joiningMember))}, 700)
    if (hugDelay >= 1000) {
      setTimeout(() => {ServerSend("ChatRoomChat", makeReleasePacket(joiningMemberNumber))}, 600 + hugDelay)
    }

    next(args);
    return;
  })
  
  modApi.hookFunction("AnimationRequestDraw", 4, (args, next) => {
    if (animationLimit == "ENABLED") {return;}
    if (animationLimit == "LIMITED") {
      if ((CommonTime() - lastAnimationUpdate) > 500) {
      lastAnimationUpdate = CommonTime()
      } 
      else {return;}
    }
    next(args);
    return;
  })
  function makeHugPacket(target) {
    let pronoun = Player.BCAR?.bcarSettings?.genderDefault?.capPossessive ? Player.BCAR?.bcarSettings?.genderDefault?.capPossessive.toLowerCase() : CharacterPronoun(Player, "Possessive", false); 
    return {
        Content: "Beep",
        Type: "Action",
        Target: null,
        Dictionary: [
            { Tag: "Beep", Text: "msg" },
            { Tag: "Biep", Text: "msg" },
            { Tag: "Sonner", Text: "msg" },
            //{ Tag: "msg", Text: CharacterNickname(Player) + " jumps on " + CharacterNickname(target) + " for a big hug."},
            { Tag: "msg", Text: CharacterNickname(Player) + " wraps " + pronoun + " arms around " + CharacterNickname(target) + " in a big warm hug."}
        ]
    }   
  }

  function makeGrabPacket(target) {
    return {
        Content: "ChatOther-ItemArms-Grope",
        Type: "Activity",
        Dictionary: [
            {
              "SourceCharacter": Player.MemberNumber
            },
            {
              "TargetCharacter": target
            },
            {
              "Tag": "FocusAssetGroup",
              "FocusGroupName": "ItemArms"
            },
            {
              "ActivityName": "Grope"
            },]
    }
  }

  function makeReleasePacket(target) {
    return {
        Content: "ChatOther-ItemArms-LSCG_Release",
        Type: "Activity",
        Dictionary: [
            {
              "SourceCharacter": Player.MemberNumber
            },
            {
              "TargetCharacter": target
            },
            {
              "Tag": "FocusAssetGroup",
              "FocusGroupName": "ItemArms"
            },
            {
              "ActivityName": "LSCG_Release"
            },
            {
                "Tag": "MISSING ACTIVITY DESCRIPTION FOR KEYWORD ChatOther-ItemArms-LSCG_Release",
                "Text": Player.dn + " releases their victim."
            }
        ]
    }
  }
  /*
  function init() {initSettingsScreen()}

  function initSettingsScreen() {
    PreferenceSubscreenList.push("ELAMainMenu");
    modApi.hookFunction("TextGet", 2, (args, next) => {
      if (args[0] == "HomepageELAMainMenu") return "ELA Settings";
      return next(args);
    });
    modApi.hookFunction("DrawButton", 2, (args, next) => {
      if (args[6] == "Icons/ELAMainMenu.png") args[6] = modIcon;// "Icons/Asylum.png";
      return next(args);
    });
  }
  */

  function getFormattedName(name, nickname) {
    if (nickname) {
      return nickname + " [" + name + "]"
    } return name;
  }

  function getSettings() {
    if (Player.ExtensionSettings.ELA !== undefined) {
      settings = JSON.parse(Player.ExtensionSettings.ELA)
      settings = {...defaultSettings, ...settings}
      autoHuggedMembers = settings["autoHuggedMembers"]
      hugDelay = settings["hugDelay"]
      animationLimit = settings["animationLimit"]
      hugOnceMembers = settings["hugOnceMembers"]
      ELAstruggleStrength = settings["struggleStrength"]
    } else {
      pushSettings()
    }
  }
  const defaultSettings = {
    "autoHuggedMembers" : [],
    "hugOnceMembers" : [],
    "hugDelay" : 8000,
    "animationLimit" : "DISABLED",
    "struggleStrength" : 1
  }

  function pushSettings() {
    settings = {"autoHuggedMembers" : autoHuggedMembers, "hugOnceMembers" : hugOnceMembers, "hugDelay" : hugDelay, "animationLimit": animationLimit, "struggleStrength": ELAstruggleStrength}
    Player.ExtensionSettings.ELA = JSON.stringify(settings);
    ServerPlayerExtensionSettingsSync("ELA");
  }
  // Thanks MBS
  function settingsLoaded() {
    return (
        typeof Player !== "undefined"
        && Player.OnlineSharedSettings !== undefined
    );
  }

  var autoHuggedMembers = []
  var hugOnceMembers = []
  var hugDelay = 8000
  var animationLimit = "DISABLED"
  var lastAnimationUpdate = CommonTime()
  const modIcon = "data:image/png;base64,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ICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplYTNhNzRkYi1kZGY3LTQ2ZmMtYWExMC0wYTE3N2U1ZWFkNWMiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMjg0ZWM0NC0zNTI2LTQ2NjktOTA4YS0yMjJkMGJjODg3MDQiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJMaW51eCIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MDM1NjEwMDk0NzYwODEiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MjAzOTljMi1kZjc1LTRkZjYtYWFlNi00MjNhZDQ1MWE3ZmUiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTEyLTI2VDA0OjIzOjI5KzAxOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PuUhbacAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnDBoDFx1ZAo12AAALNklEQVR42uVcZ0xTXxS/bSmCFBBlK0YZUjUorrA+uP5RgxEJSgxxRhRFwBhUHIhRCHGAK464cEQFYsA4UHGvWERkSRSCErCFSktpS6Hto+O9/4ebvDR0+Fr6ykPPB/Le7R3v/u49455zLjQMw8C/TXQbjKFSqdrb2/9pCFpaWrZs2cLn8/9dCHg83pMnT7Zs2SISif5RCL5//w4AKCsry8zMVCqV/xwEGIa9ffsWPl++fPnEiRNarZZaGGAkk1wud3R01B2xpKQEoxKRDkFzc7M+7rW1tdSBgHRGEAgE+oW7du3q6en5S2QBgiBdXV3mQvDq1asLFy5QxCobLASdnZ2RkZEfPnwwNh8ul2uwfP/+/RUVFX+DOPz8+TPs5+LFiwiC6FdYvXq1saGjoqJ6enqGvTh88eIFPqX09HSxWKz7q0ajmTNnjokFuH79+rCH4N69e7pTio2N/f37N/4rgiD29vYmIPD09BQKhcNbIyAIovt6//79+Pj4jo4O+KpUKlUqlYnmQqHw0aNHw1sWFBcX6/cZGRnZ0dGBYVhLS8sfP8DPz08ikQzjXeDg4KBfyOFw0tLSZDKZUCgkcoh68+bNMFaKA4xfnO7du5efny+VSol0cvLkyQEMNZwYwfQCmlYHulRVVTVcNUJDQ4NVVsLf3//MmTNNTU3DD4LW1lbr7sqMjIzm5ubhBIFYLCaDPc+ePSuTyYh8gEajEQgEXC6Xx+MJhUKVSmVrCFAUHT9+PBkoREdHNzY2GhtXq9XW1dUdP358ypQpuq3s7e3v3r1rlt09KAg0Gs3Xr1/DwsJIEtWjR49+//69/rgikWjfvn2wDoPByM/Pr6mpEYlEKIpqtVqBQFBXVzfAVCcFgm/fviUnJ9tAZ718+VJ3XB6Pt3DhQvhTTk4On883tjwoipIFgUKhKCgosKXmfv36NRxaIpEsWrQIFgYHB+fl5ZWWlra1tRmcLSkQdHd3l5SUkLfzjZG9vX1dXR2KooWFhQYrbN++vaamRqPRWLCitAGujt7eXi6X6+7uDs0+BEHkcrlAIODz+ZWVlfn5+SiKDokJN2PGjBkzZjQ1NXE4HGN10tLSkpOTJ0+ePFjrsLe3t6ioKCAggGoOf2dn5x07dpiuw2AwLl68qFAorKARRCLRs2fPUlJSDB6EhoqSkpLGjBnzx2qrVq1qa2uzmkaQSqV79+6lCARRUVGrVq0iUnPy5MkNDQ3WgeDZs2eUYofU1FSCNcePH//169fBQtDY2MhisSgFwbp164hXZrPZra2tlkOgVCpXrFhBNaGYlJRkVv34+Hi5XG4hBI8fPwbUo4SEhHHjxpnVpKCgwBIIEASJioqiIARhYWFjx441q4mLi4sJBWEUgk+fPgFKkp2dnQWtMjMzjdnLRiHIy8ujJgQnT56sqKhgs9nmNvz+/bsZEPT390+cOJGaEFy9ehXDsKKiInMbZmdnmwHB79+/YTNfX18fHx9KQVBUVIRhGEzeIUh79uyZMmXKyJEju7u7icYR8Hj5gQMHqJYd5OHhAQBwcnLy9PQk2KSpqenQoUMKhaKmpoZoHKG7uxs+LFiwgGAswGYUFBQEj0ObN28m2OTdu3dhYWHjxo2rrKwkGkeARvGmTZtUKtWsWbMotQVgCJ/L5X748MHZ2ZlgQx6Pd/ToURcXl/7+fkKMQKPRAADLli1jMpkQdViYkJAwtBDs379/xIgRAAC5XD5hwoQNGzYQbCiRSBYuXCiTyfRd3oYhGDlyJDxmAADwXeDp6ZmcnLx06dIhhGDevHnwQSqVenl5EXdqSCQSNpvt7OysH+Y0DIGvry8AAJ7MQ0NDYSGTyXR1dd29e/dQzT8mJmbq1KnwGUVRJpMJl4oI9fX1sVislStX6mdG0Y2xnKurq4uLCwAAHxVBEC8vr6CgoMTERABAXFxcRkaGLSFISUlhMBgAAJlMBo8JDAYjLS2NSFuFQgF3tFqtJgQBi8Vavnw55Dpvb++4uDgAgFqtZjKZDAZj586dUDJv3bq1qqpq/vz5Nph/fHw8HjURi8WQSREEiYmJ8ff3J7ILAACTJk3STwszGlyPjo6GnlIajbZ+/folS5bIZDIURd3d3QMDAy9dunTs2DE6nT579mwbyMiAgIA1a9a4uLjI5XKVSuXt7Y07ewMDA9esWfPHHjQaDVxa/SOGUQhmzZqFWwShoaE7duyAEQQajcZkMlevXp2SktLY2IirD1IpPT09PDxcIpE4ODhgGIa7M7lcrre3d2Bg4B97YDKZ8K+TkxNRCPz9/SFyAAA/P7/IyMjjx4//+PGDTqdD4ywvL0+hUHR3d+NZ1iRRdnb27NmzOzs7PTw86HQ6ZE/IBUFBQQ4ODkRMeBw1KOkJQUCn00eNGoVbBCwWKzExkcfj4RUcHR1jY2Nv3bp1584d8uYfERHh6+ur1WpHjRrl6OgIxSEkPp8PI2tubm5/7AcPi7i6uhKyDvGAlFqt1i2pr6/HXfRqtTo/P59sFnj58qVYLFYqlfoxwjdv3sDPg/xomjgcDoZh5eXlWq3WjHQrGo2mizoAICQkRPeVpOQCXWIwGP39/b29vSiK6godDMNw2UZEGEGtwWKxICMT3QVE4qsHDx4kFYIXL14YHLqtrU2pVMLn6urqtWvXmuhk0aJFMNxYX19v5aQ7R0fHrKysw4cPkwdBdXX1HyWcVCodsD0H0Lp16xgMRl9fn5+fH9HDslmePNMrMEi6ceOGvsNCLBbrOpGFQqFpiRgeHg4AUCqVBqtZ4UrGhAkTHj58GBERQQYETU1NdXV1uiUoijo5OekKKZlMZsKnnJqaCgUBNA1IgYBGoy1btgzPfLE6lZaW6lq1GIbhpgF8tbOzk8lkxponJCTQaLT+/n545CHqMrGAenp6jhw5Ynoyubm5fD6/vLzcXBRM5F0JBAIOh3P+/HmDDUNCQqDU1NeFpFzPQlH0wYMHBj9l48aN9fX1ULHfv38fAHDu3DmChzwAwK5du4zNoaKiQiqVGtuD0NdqXpbJIAlF0dzcXF1NGRoaeuzYsXnz5uEXExITE7u6uoqLi6VSKfG4UE5ODp1Oh/dd3dzcli9fPm3aNADA69ev586dy2azf/78qVt/+vTp9vb2z58/x21co2T1ZE6BQABTXXx8fG7evCmVSgfkiwGdS3qnT5+2DOunT5/ChJiWlpbOzk59s3rfvn3l5eVDdk/x169fb9++NZj5V1ZWduvWLd3g/WBMpvb2dgzDPn78qPsTm80uLi7Ozs4mmH1F+lXNAUGqa9eu6X6ZWq3+77//LICgsrISRVEYNc/JycHL3d3dCwsLMzMze3t7qXJbVZfa29v1V+bChQsWQNDa2gq7GnBOOXXqVFZW1gDuM012wFaEoqhB4Td9+nQLesOto9raWvx0n5qaimFYRkaGWZkxtoPAwBFNx59jLsFjv0ajwfNgFy9eHBMTM3/+fGMD2U4jmEUWmEmQLl++LJfLX716BQCYO3duaWkpweT9oWQEgy7NM2fOWNY2KSmpuro6ODi4oaFh0qRJpm9DUnoX5ObmWvzlM2fONCvLdMgu75umwfynm5qami9fvlhBSA0tBHjM1jK6ffu2FQz8oWIBtVpdVFREPDpujAZ/l2toINBoNJcuXbJWlIXg1QsKQSASiTIzM63ITZWVlcMGAhRFv3z5YvWMztjYWNybTHUISkpKSBKrRDLOKaEUvby8SOp5MKFdm0Jg1IFJ2gGEchCYmz79F+6C0aNHmw77DMkusN0xCUGQK1euWOuyv1VO3Da1DkUi0bZt28jDl8vlUlopNjc34/mCJJGxm8uUgIDD4ZAnBXHST6slTv8DUIYBSLhZCsAAAAAASUVORK5CYII="
  waitFor(settingsLoaded).then(() => {
    getSettings()
  })

  CommandCombine([{
    Tag: 'hugadd',
    Description: "(Member Number): Add the specified member to be hugged on sight.",
    Action: (args) => {
            member = parseInt(args)
            if (isNaN(member) || member == 0 || args == "") {
                ChatRoomSendLocal("<p style='background-color:#FF4040;color:#000000'>[ELA] Couldn't understand the member number.</p>")
                return
            }
            else if (autoHuggedMembers.includes(member)) {
              if (hugOnceMembers.includes(member)) {
                hugOnceMembers.splice(hugOnceMembers.indexOf(member), 1)
                ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] " + member.toString() + " removed from the Hug Once list, still to be hugged on sight.</p>")  
                pushSettings()
                return
              }
              ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] " + member.toString() + " already in the Auto-Hug list.</p>")      
              return
            }
            autoHuggedMembers.push(member)
            
            ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Added " + member.toString() + " to the Auto-Hug list.</p>")
            pushSettings()
          }
  }])
  CommandCombine([{
    Tag: 'hugremove',
    Description: "(Member Number): Remove the specified member from the auto-hug list.",
    Action: (args) => {
            member = parseInt(args)
            if (isNaN(member) || member == 0 || args == "" || !autoHuggedMembers.includes(member)) {
              ChatRoomSendLocal("<p style='background-color:#FF4040;color:#000000'>[ELA] Couldn't understand the member number or member not in the list.</p>")
              return
            }
            autoHuggedMembers.splice(autoHuggedMembers.indexOf(member), 1)
            ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Removed " + member.toString() + " from the Auto-Hug list.</p>")
            if (hugOnceMembers.includes(member)) {
              hugOnceMembers.splice(hugOnceMembers.indexOf(member), 1)
            }
            pushSettings()
          }
  }])

  CommandCombine([{
    Tag: 'hugonce',
    Description: "(Member Number): Add the specified member to be hugged on sight, but only once.",
    Action: (args) => {
            member = parseInt(args)
            if (isNaN(member) || member == 0 || args == "") {
                ChatRoomSendLocal("<p style='background-color:#FF4040;color:#000000'>[ELA] Couldn't understand the member number.</p>")
                return
            }
            else if (hugOnceMembers.includes(member)) {
              ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] " + member.toString() + " already in the Hug Once list.</p>")
              return
            }
            else if (autoHuggedMembers.includes(member)) {
              ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] " + member.toString() + " already in the Auto-Hug list. Marking them to be removed after a hug.</p>")      
              hugOnceMembers.push(member)
              pushSettings()
              return
            }
            autoHuggedMembers.push(member)
            hugOnceMembers.push(member)
            ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Added " + member.toString() + " to the Auto-Hug and Hug Once lists.</p>")
            pushSettings()
          }
  }])

  CommandCombine([{
    Tag: 'hugduration',
    Description: "(Duration): Set the approximate time between grab and release (in milliseconds). Cannot be shorter than a second. Setting negative numbers disables auto-release.",
    Action: (args) => {
            delay = parseInt(args)
            if (isNaN(delay) || args == "") {
                ChatRoomSendLocal("<p style='background-color:#FF4040;color:#000000'>[ELA] Couldn't understand the entered delay.</p>")
                return
            }
            if (delay < 0) {
                hugDelay = -1
                ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Disabled auto-release.</p>")
                pushSettings()
                return;

              } 
            if (delay <= 1000) {
                delay = 1000
            }
            hugDelay = delay
            ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Set hug duration to " + hugDelay.toString() + " ms.</p>")
            pushSettings()
            return;
            }
  }])
  CommandCombine([{
    Tag: 'strugglestrength',
    Description: "(Multiplier): Sets your struggle strength to be stronger. 1 is default. Whole numbers only.",
    Action: (args) => {
            strength = parseInt(args)
            if (args == "") {
              ChatRoomSendLocal("[ELA] Struggle strength currently set to " + ELAstruggleStrength.toString() +".");
              return;
            }

            if (isNaN(strength) || strength < 1) {
                ChatRoomSendLocal("<p style='background-color:#FF4040;color:#000000'>[ELA] Couldn't understand the entered strength.</p>")
                return
            }
            if (strength == 1) {
                ELAstruggleStrength = strength
                ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Struggle strength set to default.</p>")
                pushSettings()
                return;
              } 
            ELAstruggleStrength = strength
            ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Struggle strength set to " + ELAstruggleStrength.toString() + ".</p>")
            pushSettings()
            return;
            }
  }])

  CommandCombine([{
    Tag: 'hugstatus',
    Description: ": Provides the current auto-hug list and duration.",
    Action: () => {
            memberList = autoHuggedMembers.join(", ")
            hugOnceList = hugOnceMembers.join(", ")
            duration = hugDelay.toString() + " ms"
            if (hugDelay == -1) {
              duration = "Manual Release"
            }
            ChatRoomSendLocal("Hug list : " + memberList)
            ChatRoomSendLocal("To remove after a hug : " + hugOnceList)
            ChatRoomSendLocal("Hug Duration : " + duration)
            }
  }])

  CommandCombine([{
    Tag: 'animationlimit',
    Description: "enabled/limited/disabled: When enabled, disables animations from restraints almost completely. Limited allows for 2 updates/second, Disabled is normal behavior.",
    Action: (args) => {
            if (["ENABLED", "LIMITED", "DISABLED"].includes(args.toUpperCase())) {
                ChatRoomSendLocal("<p style='background-color:#AAFFFF;color:#000000'>[ELA] Changed the animation limit to " + args.toLowerCase() + ".</p>")
                animationLimit = args.toUpperCase()
                pushSettings()
                return
            }
            if (args == "") {
              ChatRoomSendLocal("Animation Limit : " + animationLimit)
              return
            }
          
            ChatRoomSendLocal("<p style='background-color:#FF4040;color:#000000'>[ELA] Couldn't understand the animation limit status entered.</p>")
          }
  }])



  CommandCombine([{
    Tag: 'hug',
    Description: "(Name): Give a nice warm hug !",
    Action: (args) => {
            if (!args) {
              ChatRoomSendLocal("[ELA] Need to specify a target.")
            }
            let targetName = args;
            console.log(targetName)
            let chatRoomMembers = ChatRoomCharacter.map((x) => {return [x.Nickname, x.Name, x]});
            console.log(chatRoomMembers)
            let targets = new Set();
            for (currentTarget of chatRoomMembers) {
              if (currentTarget[0]) {
                if (currentTarget[0].toLowerCase().includes(targetName.toLowerCase())) {
                  targets.add(currentTarget[2])
                }
              } 
              if (currentTarget[1].toLowerCase().includes(targetName.toLowerCase())) {
                targets.add(currentTarget[2])
              }
            }
            if (targets.size == 0) {
              console.log(targets)
              ChatRoomSendLocal("[ELA] No target found.")
              return
            }

            if (targets.size > 1) {
              ChatRoomSendLocal("[ELA] Too many possible targets to hug :" + Array.from(targets.values()).map((x) => " " + getFormattedName(x.Name, x.Nickname)).toString())
              return
            }
            ServerSend("ChatRoomChat", makeHugPacket(targets.values().next().value))
          }
  }])


  async function waitFor(func, cancelFunc = () => false) {
    while (!func()) {
      if (cancelFunc()) return false;
      await sleep(10);
    }
    return true;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  console.log("Eddii's Little Additions " + ELA_VERSION + " loaded");

})();
