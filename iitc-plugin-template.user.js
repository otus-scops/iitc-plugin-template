// ==UserScript==
// @id             iitc-plugin-[myPluginName]@[Author]
// @name           IITC Plugin: [myPluginName]
// @category       [Plugin category]
// @version        [Plugin version]
// @namespace      iitc-plugin-[myPluginName]
// @description    [Plugin description]
// @downloadURL    [downloadURL]
// @updateURL      [updateURL]
// @include        https://*.ingress.com/*
// @include        http://*.ingress.com/*
// @match          https://*.ingress.com/*
// @match          http://*.ingress.com/*
// @grant          none
// ==/UserScript==

/**
 * Copyright 2024 [Author]
 *
 * Licensed under xxx
 */

(function () {
  "use strict";

  const wrapper = function (plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== "function") {
      window.plugin = function () {};
    }

    plugin_info.buildName = "iitc-ja-[Author]"; // Name of the IITC build for first-party plugins
    plugin_info.dateTimeVersion = "YYYYMMDDHHmmss"; // Datetime-derived version of the plugin
    plugin_info.pluginId = "[myPluginId]"; // ID/name of the plugin

    // PLUGIN START ////////////////////////////////////////////////////////

    // プラグイン自身の名前空間（[myPluginName] は実際のプラグイン名に置き換えてください）
    if (typeof window.plugin[myPluginName] === "undefined") {
      window.plugin[myPluginName] = {};
    }
    const self = window.plugin[myPluginName];

    /* プラグイン内でグローバルに用いる定数や変数の定義 */
    const STORAGE_KEY = "[myPluginName]-option";

    // --- グローバル変数（プラグインスコープ） ---
    // 例: let myGlobalVariable = null;

    // --- カスタムレイヤー ---
    // 例: self.myLayerGroup = null;

    // --- Web worker用 ---
    // 例: let objWorker = null;

    // --- 設定値の保持用 ---
    // デフォルト設定（[textInputId] や [checkboxId] は設定項目に合わせて変更してください）
    const DEFAULT_OPTIONS = {
      [textInputId]: "default text",
      [checkboxId]: false,
    };
    // 現在の設定値（起動時に loadOption で読み込まれます）
    let OptionData = { ...DEFAULT_OPTIONS };

    // (Web workerを用いる場合のコード例)
    /*
        const myWorker = `
            // Worker code here.
            // 本体側へのpost
            // postMessage({});

            // 本体からpostされたメッセージの処理
            // self.addEventListener('message', function(e){ }, false);
        `;
        */

    /**
     * 初期処理（プラグイン起動時や設定変更時に呼ばれる）
     */
    self.init = function () {
      // 例: 設定値に基づいて何かを再描画する
      console.log("[myPluginName] init called. Options:", OptionData);
      // window.map.fire('mapdataanchorchanged'); // 必要ならマップの再描画をトリガー
    };

    /**
     * 設定の読み込み (localStorageから)
     */
    self.loadOption = function () {
      try {
        const stream = localStorage.getItem(STORAGE_KEY);
        if (stream) {
          const parsedData = JSON.parse(stream);
          // デフォルト値とマージして、不足しているキーがあってもエラーにならないようにする
          OptionData = { ...DEFAULT_OPTIONS, ...parsedData };
        } else {
          // 保存されている設定がない場合はデフォルト値を使用
          OptionData = { ...DEFAULT_OPTIONS };
        }
      } catch (e) {
        console.error("[myPluginName] Failed to parse settings:", e);
        // パース失敗時はデフォルト値に戻す
        OptionData = { ...DEFAULT_OPTIONS };
      }
    };

    /**
     * 設定の保存 (localStorageへ)
     */
    self.saveOption = function () {
      try {
        const stream = JSON.stringify(OptionData);
        localStorage.setItem(STORAGE_KEY, stream);
      } catch (e) {
        console.error("[myPluginName] Failed to save settings:", e);
      }
    };

    /**
     * 設定のエクスポート
     */
    self.exportOption = function () {
      // 現在のlocalStorageに保存されているデータをエクスポート
      const stream = localStorage.getItem(STORAGE_KEY);
      if (stream === null) {
        alert("保存されている設定データがありません。");
        return;
      }
      try {
        const blob = new Blob([stream], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = STORAGE_KEY + ".json";
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("[myPluginName] Export failed:", e);
      }
    };

    /**
     * 設定のインポート
     * @param {File} file - インポートする .json ファイル
     */
    self.importOption = function (file) {
      if (!file || !file.name.endsWith(".json")) {
        alert("無効なファイルです（.jsonファイルを選択してください）。");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const importedData = JSON.parse(event.target.result);
          // TODO: ここでインポートするデータのバリデーション（形式チェック）を行うとより安全です

          // localStorageに保存
          localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData));

          self.loadOption(); // インポートした設定を読み込む
          self.init(); // 設定を反映する
          alert("設定をインポートしました。");
        } catch (e) {
          console.error("[myPluginName] Failed to parse imported settings:", e);
          alert("設定ファイルの読み込みに失敗しました。");
        }
      };
      reader.readAsText(file);
    };

    /**
     * 設定ダイアログの表示
     */
    self.settingDialog = function () {
      // [textInputId] や [checkboxId] は実際のIDに置き換えてください
      const html = `
                <div>
                    <p>設定をインポートまたはエクスポートできます。</p>
                </div>
                <hr>
                <table>
                    <tr>
                        <th>テキスト入力：</th>
                        <td><input type="text" id="[textInputId]" size="26"></td>
                    </tr>
                    <tr>
                        <th>チェックボックス：</th>
                        <td><input type="checkbox" id="[checkboxId]"><label for="[checkboxId]">チェック</label></td>
                    </tr>
                </table>
            `;

      dialog({
        html: html,
        id: "[myPluginName]-Options",
        title: "[myPluginName] 設定",
        width: 500,
        modal: true, // ダイアログ以外を操作不可にする
        focusCallback: function () {
          // ダイアログ表示時に現在の設定値をフォームに反映
          document.getElementById("[textInputId]").value =
            OptionData["[textInputId]"] || "";
          document.getElementById("[checkboxId]").checked =
            OptionData["[checkboxId]"] || false;
        },
        buttons: [
          {
            text: "Import",
            class: "[myPluginName]-import-button",
            click: function () {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".json";
              input.onchange = function (event) {
                if (event.target.files && event.target.files[0]) {
                  self.importOption(event.target.files[0]);
                }
              };
              input.click();
              // インポートが完了したらダイアログを閉じる
              $(this).dialog("close");
            },
          },
          {
            text: "Export",
            class: "[myPluginName]-export-button",
            click: function () {
              self.exportOption();
              // エクスポートはダイアログを閉じない
            },
          },
          {
            text: "OK",
            class: "[myPluginName]-ok-button",
            click: function () {
              // フォームから値を取得してOptionDataに保存
              OptionData["[textInputId]"] =
                document.getElementById("[textInputId]").value;
              OptionData["[checkboxId]"] =
                document.getElementById("[checkboxId]").checked;

              self.saveOption(); // localStorageに保存
              self.init(); // 設定を反映

              $(this).dialog("close");
            },
          },
          {
            text: "Cancel",
            class: "[myPluginName]-cancel-button",
            click: function () {
              $(this).dialog("close");
            },
          },
        ],
      });
    };

    /* (Workerのセットアップ例) */
    /*
        self.setupWorker = function(){
            try {
                const b = new Blob([myWorker], { type: "text/javascript" });
                return new Worker(window.URL.createObjectURL(b));
            } catch (e) {
                console.error('[myPluginName] Failed to setup worker:', e);
                return null;
            }
        }
        */

    /* (Workerからの応答処理例) */
    /*
        self.workerResponse = function(e){
            if(!!e.data){
                // Workerからのデータ処理
            }
        }
        */

    /**
     * プラグインのメインエントリーポイント (IITC起動時に1回だけ呼ばれる)
     */
    self.start = function () {
      // 1. 設定値の読み込み
      self.loadOption();

      // (Web workerを用いる場合の初期化例)
      /*
            objWorker = self.setupWorker();
            if (objWorker) {
                objWorker.addEventListener('message', self.workerResponse, false);
                // plugin内からworkerへのメッセージはpostMessageにて行う
                // objWorker.postMessage({ command: 'start', data: {} });
            }
            */

      // (EventListenerのフック例)
      // https://iitc-ce.github.io/ingress-intel-total-conversion/module-hooks.html
      // 例: addHook('publicChatDataAvailable', self.listenerFunction);

      // (カスタムレイヤーの追加例)
      /*
            self.myLayerGroup = new L.FeatureGroup();
            window.addLayerGroup('[レイヤー名]', self.myLayerGroup, true);
            // self.myLayerGroup.bringToBack(); // レイヤーを最背面に移動

            // レイヤーへのアイコン追加例 (Leaflet)
            // https://leafletjs.com/reference.html
            const myIcon = L.divIcon({
                className: "myMarkerClass",
                html:'<div class="myMarkerClass"></div>',
                iconSize: [10, 10]
            });
            const myMarker = L.marker([lat, lng], { icon: myIcon });
            myMarker.addTo(self.myLayerGroup);
            */

      // 2. ツールボックスへの項目追加
      // (例：設定ボタン)
      $("#toolbox").append(
        ' <a onclick="window.plugin.[myPluginName].settingDialog();" title="[myPluginName] の設定を開きます">[myPluginName] 設定</a>',
      );

      // 3. CSSの適用
      const cssData = `
/* CSS */
/* override (必要に応じて) */
@media (min-width: 1000px) {
    .ui-dialog.[myPluginName]-Options {
        /* max-width: 900px; */
    }
}

/* plugin specific */
.[myPluginName]-export-button {
    margin-right: 10px; /* Exportボタンの右側にマージン */
}
            `;
      const styleTag = document.createElement("style");
      styleTag.setAttribute("type", "text/css");
      styleTag.innerHTML = cssData; // innerTextよりinnerHTMLの方が一般的
      document.getElementsByTagName("head")[0].appendChild(styleTag);

      // 4. 初期処理の実行
      self.init();
    };

    // IITCの起動処理
    const setup = self.start;
    // PLUGIN END //////////////////////////////////////////////////////////

    setup.info = plugin_info; // Add an info property for IITC's plugin system
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === "function") {
      setup();
    }
  }; // wrapper end

  // inject code into site context
  const script = document.createElement("script");
  const info = {};
  if (typeof GM_info !== "undefined" && GM_info && GM_info.script) {
    info.script = {
      version: GM_info.script.version,
      name: GM_info.script.name,
      description: GM_info.script.description,
    };
  }
  script.appendChild(
    document.createTextNode(`(${wrapper})(${JSON.stringify(info)});`),
  );
  (document.body || document.head || document.documentElement).appendChild(
    script,
  );
})();
