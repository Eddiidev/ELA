const ELA_VERSION = "0.2INDEV";

window.LoadedError = class extends Error {};
if (window.ELA_VERSION) {
  throw new LoadedError("ELA already loaded");
}

var bcModSDK = (function () {
  "use strict";
  const e = "1.1.0";
  function o(e) {
    alert("Mod ERROR:\n" + e);
    const o = new Error(e);
    throw (console.error(o), o);
  }
  const t = new TextEncoder();
  function n(e) {
    return !!e && "object" == typeof e && !Array.isArray(e);
  }
  function r(e) {
    const o = new Set();
    return e.filter((e) => !o.has(e) && o.add(e));
  }
  const i = new Map(),
    a = new Set();
  function d(e) {
    a.has(e) || (a.add(e), console.warn(e));
  }
  function s(e) {
    const o = [],
      t = new Map(),
      n = new Set();
    for (const r of p.values()) {
      const i = r.patching.get(e.name);
      if (i) {
        o.push(...i.hooks);
        for (const [o, a] of i.patches.entries())
          t.has(o) &&
            t.get(o) !== a &&
            d(
              `ModSDK: Mod '${r.name}' is patching function ${e.name
              } with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${o}\nPatch1:\n${t.get(o) || ""
              }\nPatch2:\n${a}`
            ),
            t.set(o, a),
            n.add(r.name);
      }
    }
    o.sort((e, o) => o.priority - e.priority);
    const r = (function (e, o) {
      if (0 === o.size) return e;
      let t = e.toString().replaceAll("\r\n", "\n");
      for (const [n, r] of o.entries())
        t.includes(n) ||
          d(`ModSDK: Patching ${e.name}: Patch ${n} not applied`),
          (t = t.replaceAll(n, r));
      return (0, eval)(`(${t})`);
    })(e.original, t);
    let i = function (o) {
      var t, i;
      const a =
        null === (i = (t = m.errorReporterHooks).hookChainExit) ||
          void 0 === i
          ? void 0
          : i.call(t, e.name, n),
        d = r.apply(this, o);
      return null == a || a(), d;
    };
    for (let t = o.length - 1; t >= 0; t--) {
      const n = o[t],
        r = i;
      i = function (o) {
        var t, i;
        const a =
          null === (i = (t = m.errorReporterHooks).hookEnter) || void 0 === i
            ? void 0
            : i.call(t, e.name, n.mod),
          d = n.hook.apply(this, [
            o,
            (e) => {
              if (1 !== arguments.length || !Array.isArray(o))
                throw new Error(
                  `Mod ${n.mod
                  } failed to call next hook: Expected args to be array, got ${typeof e}`
                );
              return r.call(this, e);
            },
          ]);
        return null == a || a(), d;
      };
    }
    return { hooks: o, patches: t, patchesSources: n, enter: i, final: r };
  }
  function c(e, o = !1) {
    let r = i.get(e);
    if (r) o && (r.precomputed = s(r));
    else {
      let o = window;
      const a = e.split(".");
      for (let t = 0; t < a.length - 1; t++)
        if (((o = o[a[t]]), !n(o)))
          throw new Error(
            `ModSDK: Function ${e} to be patched not found; ${a
              .slice(0, t + 1)
              .join(".")} is not object`
          );
      const d = o[a[a.length - 1]];
      if ("function" != typeof d)
        throw new Error(`ModSDK: Function ${e} to be patched not found`);
      const c = (function (e) {
        let o = -1;
        for (const n of t.encode(e)) {
          let e = 255 & (o ^ n);
          for (let o = 0; o < 8; o++)
            e = 1 & e ? -306674912 ^ (e >>> 1) : e >>> 1;
          o = (o >>> 8) ^ e;
        }
        return ((-1 ^ o) >>> 0).toString(16).padStart(8, "0").toUpperCase();
      })(d.toString().replaceAll("\r\n", "\n")),
        l = { name: e, original: d, originalHash: c };
      (r = Object.assign(Object.assign({}, l), {
        precomputed: s(l),
        router: () => { },
        context: o,
        contextProperty: a[a.length - 1],
      })),
        (r.router = (function (e) {
          return function (...o) {
            return e.precomputed.enter.apply(this, [o]);
          };
        })(r)),
        i.set(e, r),
        (o[r.contextProperty] = r.router);
    }
    return r;
  }
  function l() {
    const e = new Set();
    for (const o of p.values()) for (const t of o.patching.keys()) e.add(t);
    for (const o of i.keys()) e.add(o);
    for (const o of e) c(o, !0);
  }
  function f() {
    const e = new Map();
    for (const [o, t] of i)
      e.set(o, {
        name: o,
        original: t.original,
        originalHash: t.originalHash,
        sdkEntrypoint: t.router,
        currentEntrypoint: t.context[t.contextProperty],
        hookedByMods: r(t.precomputed.hooks.map((e) => e.mod)),
        patchedByMods: Array.from(t.precomputed.patchesSources),
      });
    return e;
  }
  const p = new Map();
  function u(e) {
    p.get(e.name) !== e &&
      o(`Failed to unload mod '${e.name}': Not registered`),
      p.delete(e.name),
      (e.loaded = !1),
      l();
  }
  function g(e, t, r) {
    "string" == typeof e &&
      "string" == typeof t &&
      (alert(
        `Mod SDK warning: Mod '${e}' is registering in a deprecated way.\nIt will work for now, but please inform author to update.`
      ),
        (e = { name: e, fullName: e, version: t }),
        (t = { allowReplace: !0 === r })),
      (e && "object" == typeof e) ||
      o("Failed to register mod: Expected info object, got " + typeof e),
      ("string" == typeof e.name && e.name) ||
      o(
        "Failed to register mod: Expected name to be non-empty string, got " +
        typeof e.name
      );
    let i = `'${e.name}'`;
    ("string" == typeof e.fullName && e.fullName) ||
      o(
        `Failed to register mod ${i}: Expected fullName to be non-empty string, got ${typeof e.fullName}`
      ),
      (i = `'${e.fullName} (${e.name})'`),
      "string" != typeof e.version &&
      o(
        `Failed to register mod ${i}: Expected version to be string, got ${typeof e.version}`
      ),
      e.repository || (e.repository = void 0),
      void 0 !== e.repository &&
      "string" != typeof e.repository &&
      o(
        `Failed to register mod ${i}: Expected repository to be undefined or string, got ${typeof e.version}`
      ),
      null == t && (t = {}),
      (t && "object" == typeof t) ||
      o(
        `Failed to register mod ${i}: Expected options to be undefined or object, got ${typeof t}`
      );
    const a = !0 === t.allowReplace,
      d = p.get(e.name);
    d &&
      ((d.allowReplace && a) ||
        o(
          `Refusing to load mod ${i}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`
        ),
        u(d));
    const s = (e) => {
      ("string" == typeof e && e) ||
        o(
          `Mod ${i} failed to patch a function: Expected function name string, got ${typeof e}`
        );
      let t = g.patching.get(e);
      return (
        t || ((t = { hooks: [], patches: new Map() }), g.patching.set(e, t)),
        t
      );
    },
      f = {
        unload: () => u(g),
        hookFunction: (e, t, n) => {
          g.loaded ||
            o(`Mod ${i} attempted to call SDK function after being unloaded`);
          const r = s(e);
          "number" != typeof t &&
            o(
              `Mod ${i} failed to hook function '${e}': Expected priority number, got ${typeof t}`
            ),
            "function" != typeof n &&
            o(
              `Mod ${i} failed to hook function '${e}': Expected hook function, got ${typeof n}`
            );
          const a = { mod: g.name, priority: t, hook: n };
          return (
            r.hooks.push(a),
            l(),
            () => {
              const e = r.hooks.indexOf(a);
              e >= 0 && (r.hooks.splice(e, 1), l());
            }
          );
        },
        patchFunction: (e, t) => {
          g.loaded ||
            o(`Mod ${i} attempted to call SDK function after being unloaded`);
          const r = s(e);
          n(t) ||
            o(
              `Mod ${i} failed to patch function '${e}': Expected patches object, got ${typeof t}`
            );
          for (const [n, a] of Object.entries(t))
            "string" == typeof a
              ? r.patches.set(n, a)
              : null === a
                ? r.patches.delete(n)
                : o(
                  `Mod ${i} failed to patch function '${e}': Invalid format of patch '${n}'`
                );
          l();
        },
        removePatches: (e) => {
          g.loaded ||
            o(`Mod ${i} attempted to call SDK function after being unloaded`);
          s(e).patches.clear(), l();
        },
        callOriginal: (e, t, n) => (
          g.loaded ||
          o(`Mod ${i} attempted to call SDK function after being unloaded`),
          ("string" == typeof e && e) ||
          o(
            `Mod ${i} failed to call a function: Expected function name string, got ${typeof e}`
          ),
          Array.isArray(t) ||
          o(
            `Mod ${i} failed to call a function: Expected args array, got ${typeof t}`
          ),
          (function (e, o, t = window) {
            return c(e).original.apply(t, o);
          })(e, t, n)
        ),
        getOriginalHash: (e) => (
          ("string" == typeof e && e) ||
          o(
            `Mod ${i} failed to get hash: Expected function name string, got ${typeof e}`
          ),
          c(e).originalHash
        ),
      },
      g = {
        name: e.name,
        fullName: e.fullName,
        version: e.version,
        repository: e.repository,
        allowReplace: a,
        api: f,
        loaded: !0,
        patching: new Map(),
      };
    return p.set(e.name, g), Object.freeze(f);
  }
  function h() {
    const e = [];
    for (const o of p.values())
      e.push({
        name: o.name,
        fullName: o.fullName,
        version: o.version,
        repository: o.repository,
      });
    return e;
  }
  let m;
  const y = (function () {
    if (void 0 === window.bcModSdk)
      return (window.bcModSdk = (function () {
        const o = {
          version: e,
          apiVersion: 1,
          registerMod: g,
          getModsInfo: h,
          getPatchingInfo: f,
          errorReporterHooks: Object.seal({
            hookEnter: null,
            hookChainExit: null,
          }),
        };
        return (m = o), Object.freeze(o);
      })());
    if (
      (n(window.bcModSdk) || o("Failed to init Mod SDK: Name already in use"),
        1 !== window.bcModSdk.apiVersion &&
        o(
          `Failed to init Mod SDK: Different version already loaded ('1.1.0' vs '${window.bcModSdk.version}')`
        ),
        window.bcModSdk.version !== e &&
        (alert(
          `Mod SDK warning: Loading different but compatible versions ('1.1.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`
        ),
          window.bcModSdk.version.startsWith("1.0.") &&
          void 0 === window.bcModSdk._shim10register))
    ) {
      const e = window.bcModSdk,
        o = Object.freeze(
          Object.assign(Object.assign({}, e), {
            registerMod: (o, t, n) =>
              o &&
                "object" == typeof o &&
                "string" == typeof o.name &&
                "string" == typeof o.version
                ? e.registerMod(
                  o.name,
                  o.version,
                  "object" == typeof t && !!t && !0 === t.allowReplace
                )
                : e.registerMod(o, t, n),
            _shim10register: !0,
          })
        );
      window.bcModSdk = o;
    }
    return window.bcModSdk;
  })();
  return (
    "undefined" != typeof exports &&
    (Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.default = y)),
    y
  );
})();

(async function () {
  const modApi = bcModSDK.registerMod({
    name: "ELA",
    fullName: "Eddii's Little Additions",
    version: ELA_VERSION,
    repository: "https://github.com/Eddiidev/ELA",
  });

  await waitFor(() => ServerIsConnected && ServerSocket);
  
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
    return {
        Content: "Beep",
        Type: "Action",
        Target: null,
        Dictionary: [
            { Tag: "Beep", Text: "msg" },
            { Tag: "Biep", Text: "msg" },
            { Tag: "Sonner", Text: "msg" },
            { Tag: "msg", Text: CharacterNickname(Player) + " jumps on " + target.dn + " for a big hug."}
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
  

  function getSettings() {
    if (Player.ExtensionSettings.ELA !== undefined) {
      settings = JSON.parse(Player.ExtensionSettings.ELA)
      autoHuggedMembers = settings["autoHuggedMembers"]
      hugDelay = settings["hugDelay"]
      animationLimit = settings["animationLimit"]
    } else {
      pushSettings()
    }
  }

  function pushSettings() {
    settings = {"autoHuggedMembers" : autoHuggedMembers, "hugDelay" : hugDelay, "animationLimit": animationLimit}
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
  var hugDelay = 8000
  var animationLimit = "DISABLED"
  var lastAnimationUpdate = CommonTime()

  waitFor(settingsLoaded).then(() => {
    getSettings()
  })

  CommandCombine([{
    Tag: 'hugadd',
    Description: "(Member Number): Add the specified member to be hugged on sight.",
    Action: (args) => {
            member = parseInt(args)
            if (isNaN(member) || member == 0 || args == "") {
                ChatRoomSendLocal("<p style='background-color:#FF4040'>[ELA] Couldn't understand the member number.</p>")
                return
            }
            else if (autoHuggedMembers.includes(member)) {
              ChatRoomSendLocal("<p style='background-color:#AAFFFF'>[ELA] " + member.toString() + " already in the Auto-Hug list.</p>")      
              return
            }
            autoHuggedMembers.push(member)
            ChatRoomSendLocal("<p style='background-color:#AAFFFF'>[ELA] Added " + member.toString() + " to the Auto-Hug list.</p>")
            pushSettings()
          }
  }])
  CommandCombine([{
    Tag: 'hugremove',
    Description: "(Member Number): Remove the specified member from the auto-hug list.",
    Action: (args) => {
            member = parseInt(args)
            if (isNaN(member) || member == 0 || args == "" || !autoHuggedMembers.includes(member)) {
                ChatRoomSendLocal("<p style='background-color:#FF4040'>[ELA] Couldn't understand the member number or member not in the list.</p>")
                return
            }
            autoHuggedMembers.splice(autoHuggedMembers.indexOf(member), 1)
            ChatRoomSendLocal("<p style='background-color:#AAFFFF'>[ELA] Removed " + member.toString() + " from the Auto-Hug list.</p>")
            pushSettings()
          }
  }])

  CommandCombine([{
    Tag: 'hugduration',
    Description: "(Duration): Set the approximate time between grab and release (in milliseconds). Cannot be shorter than a second. Setting negative numbers disables auto-release.",
    Action: (args) => {
            delay = parseInt(args)
            if (isNaN(delay) || args == "") {
                ChatRoomSendLocal("<p style='background-color:#FF4040'>[ELA] Couldn't understand the entered delay.</p>")
                return
            }
            if (delay < 0) {
                hugDelay = -1
                ChatRoomSendLocal("<p style='background-color:#AAFFFF'>[ELA] Disabled auto-release.</p>")
                pushSettings()
                return;

              } 
            if (delay <= 1000) {
                delay = 1000
            }
            hugDelay = delay
            ChatRoomSendLocal("<p style='background-color:#AAFFFF'>[ELA] Set hug duration to " + hugDelay.toString() + " ms.</p>")
            pushSettings()
            return;
            }
  }])

  CommandCombine([{
    Tag: 'hugstatus',
    Description: ": Provides the current auto-hug list and duration.",
    Action: () => {
            memberList = autoHuggedMembers.join(", ")
            duration = hugDelay.toString() + " ms"
            if (hugDelay == -1) {
              duration = "Manual Release"
            }
            ChatRoomSendLocal("Hug list : " + memberList)
            ChatRoomSendLocal("Hug Duration : " + duration)
            }
  }])

  CommandCombine([{
    Tag: 'animationlimit',
    Description: "enabled/limited/disabled: When enabled, disables animations from restraints almost completely. Limited allows for 2 updates/second, Disabled is normal behavior.",
    Action: (args) => {
            if (["ENABLED", "LIMITED", "DISABLED"].includes(args.toUpperCase())) {
                ChatRoomSendLocal("<p style='background-color:#AAFFFF'>[ELA] Changed the animation limit to " + args.toLowerCase() + ".</p>")
                animationLimit = args.toUpperCase()
                pushSettings()
                return
            }
            if (args == "") {
              ChatRoomSendLocal("Animation Limit : " + animationLimit)
              return
            }
          
            ChatRoomSendLocal("<p style='background-color:#FF4040'>[ELA] Couldn't understand the animation limit status entered.</p>")
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
  console.log("Eddii's Little Additions loaded");
})();
