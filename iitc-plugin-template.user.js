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
// @license        MIT
// ==/UserScript==

/**
 * このテンプレート自体は MIT License です。
 * (This template itself is licensed under MIT License.)
 * Copyright (c) 2025 otus-scops
 *
 * ---
 *
 * (利用者は、このセクションに自身の著作権表示とライセンスを追加してください)
 * (Users should add their own copyright notice and license in this section)
 *
 * 例 (Example):
 * Copyright (c) 2025 [Your Name]
 * Licensed under [Your Chosen License, e.g., MIT, GPLv3]
 */

(function () {
  "use strict";

  const wrapper = function (plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== "function") {
      window.plugin = function () {};
    }

    // === プラグイン定義 ===
    // プレースホルダー: 開発者はこのセクションの値を書き換えてください
    const PLUGIN_AUTHOR = "[Author]"; // @id の @ 以降と合わせる
    const PLUGIN_NAME = "[myPluginName]"; // 内部的なプラグイン名 (window.plugin[PLUGIN_NAME])
    const PLUGIN_ID = "[myPluginId]"; // @id と合わせる必要はない
    const PLUGIN_TITLE = "[myPluginName]"; // 設定ダイアログのタイトルやツールボックスの表示名

    /* --- ストレージの使い分け ---
     * 1. localStorage (当テンプレートで使用): 永続的な「設定」の保存に最適。
     * 2. sessionStorage: ブラウザタブを閉じたら消えて良い「一時的な状態」の保存に。
     * 3. IndexedDB: ポータルデータやログなど、「大量の構造化データ」を保存する場合に検討。
     */
    const STORAGE_KEY = `${PLUGIN_NAME}-option`; // localStorageのキー

    // === デフォルト設定 ===
    // (設定項目に合わせてIDとデフォルト値を変更してください)
    const ID_TEXT_INPUT = `${PLUGIN_NAME}-text-input`;
    const ID_CHECKBOX = `${PLUGIN_NAME}-checkbox`;

    // デフォルト設定
    const DEFAULT_OPTIONS = {
      [ID_TEXT_INPUT]: "default text",
      [ID_CHECKBOX]: false,
    };
    // ======================

    // === CSSスタイル ===
    // (プラグインが使用するCSSをここに定義します)
    const CSS_STYLE = `
/* CSS */
/* override (必要に応じて) */
@media (min-width: 1000px) {
    .ui-dialog.${PLUGIN_NAME}-Options {
        /* max-width: 900px; */
    }
}

/* plugin specific */
.${PLUGIN_NAME}-export-button {
    margin-right: 10px; /* Exportボタンの右側にマージン */
}
    `;
    // =================

    plugin_info.buildName = `iitc-ja-${PLUGIN_AUTHOR}`; // Name of the IITC build for first-party plugins
    plugin_info.dateTimeVersion = "YYYYMMDDHHmmss"; // Datetime-derived version of the plugin
    plugin_info.pluginId = PLUGIN_ID; // ID/name of the plugin

    // PLUGIN START ////////////////////////////////////////////////////////

    // プラグイン自身の名前空間
    if (typeof window.plugin[PLUGIN_NAME] === "undefined") {
      window.plugin[PLUGIN_NAME] = {};
    }
    const self = window.plugin[PLUGIN_NAME];

    // --- グローバル変数（プラグインスコープ） ---
    // 例: let myGlobalVariable = null;

    // --- カスタムレイヤー ---
    // 例: self.myLayerGroup = null;

    // --- Web worker用 ---
    // 例: let objWorker = null;

    // --- 設定値の保持用 ---
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
     * 設定値 (OptionData) に基づいて、レイヤーの再描画などを行います。
     * @returns {void}
     */
    self.init = function () {
      // 例: 設定値に基づいて何かを再描画する
      console.log(`[${PLUGIN_NAME}] init called. Options:`, OptionData);
      // window.map.fire('mapdataanchorchanged'); // 必要ならマップの再描画をトリガー
    };

    /**
     * 設定をlocalStorageから読み込み、OptionDataに格納します。
     * @returns {void}
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
        console.error(`[${PLUGIN_NAME}] Failed to parse settings:`, e);
        // パース失敗時はデフォルト値に戻す
        OptionData = { ...DEFAULT_OPTIONS };
      }
    };

    /**
     * 現在のOptionDataをlocalStorageに保存します。
     * @returns {void}
     */
    self.saveOption = function () {
      try {
        const stream = JSON.stringify(OptionData);
        localStorage.setItem(STORAGE_KEY, stream);
      } catch (e) {
        console.error(`[${PLUGIN_NAME}] Failed to save settings:`, e);
      }
    };

    /**
     * 現在のlocalStorageに保存されている設定を .json ファイルとしてエクスポートします。
     * @returns {void}
     */
    self.exportOption = function () {
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
        console.error(`[${PLUGIN_NAME}] Export failed:`, e);
      }
    };

    /**
     * .json ファイルから設定をインポートし、localStorageに保存・適用します。
     * @param {File} file - インポートする .json ファイル (Input要素から取得)
     * @returns {void}
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
          console.error(`[${PLUGIN_NAME}] Failed to parse imported settings:`, e);
          alert("設定ファイルの読み込みに失敗しました。");
        }
      };
      reader.readAsText(file);
    };

    /**
     * 設定ダイアログを表示します。
     * @returns {void}
     */
    self.settingDialog = function () {
      const html = `
                <div>
                    <p>設定をインポートまたはエクスポートできます。</p>
                </div>
                <hr>
                <table>
                    <tr>
                        <th>テキスト入力：</th>
                        <td><input type="text" id="${ID_TEXT_INPUT}" size="26"></td>
                    </tr>
                    <tr>
                        <th>チェックボックス：</th>
                        <td><input type="checkbox" id="${ID_CHECKBOX}"><label for="${ID_CHECKBOX}">チェック</label></td>
                    </tr>
                </table>
            `;

      dialog({
        html: html,
        id: `${PLUGIN_NAME}-Options`,
        title: `${PLUGIN_TITLE} 設定`,
        width: 500,
        modal: true, // ダイアログ以外を操作不可にする
        focusCallback: function () {
          // ダイアログ表示時に現在の設定値をフォームに反映
          document.getElementById(ID_TEXT_INPUT).value =
            OptionData[ID_TEXT_INPUT] || "";
          document.getElementById(ID_CHECKBOX).checked =
            OptionData[ID_CHECKBOX] || false;
        },
        buttons: [
          {
            text: "Import",
            class: `${PLUGIN_NAME}-import-button`,
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
            class: `${PLUGIN_NAME}-export-button`,
            click: function () {
              self.exportOption();
              // エクスポートはダイアログを閉じない
            },
          },
          {
            text: "OK",
            class: `${PLUGIN_NAME}-ok-button`,
            click: function () {
              // フォームから値を取得してOptionDataに保存
              OptionData[ID_TEXT_INPUT] =
                document.getElementById(ID_TEXT_INPUT).value;
              OptionData[ID_CHECKBOX] =
                document.getElementById(ID_CHECKBOX).checked;

              self.saveOption(); // localStorageに保存
              self.init(); // 設定を反映

              $(this).dialog("close");
            },
          },
          {
            text: "Cancel",
            class: `${PLUGIN_NAME}-cancel-button`,
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
                console.error(`[${PLUGIN_NAME}] Failed to setup worker:`, e);
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
     * プラグインが追加した要素やフックを破棄します。
     * (注: 現状のIITCではこの関数は自動的には呼ばれませんが、
     * デバッグコンソールから手動実行 (window.plugin.[PLUGIN_NAME].cleanup()) することで、
     * リロードせずにプラグインを無効化するのに役立ちます)
     * @returns {void}
     */
    self.cleanup = function () {
      console.log(`[${PLUGIN_NAME}] cleaning up...`);

      // 1. ツールボックスからリンクを削除
      $(`#toolbox a[onclick="window.plugin.${PLUGIN_NAME}.settingDialog();"]`).remove();

      // 2. CSSの削除
      $(`#${PLUGIN_NAME}-style`).remove();

      // 3. カスタムレイヤーの削除
      // if (self.myLayerGroup) {
      //   window.removeLayerGroup(self.myLayerGroup);
      //   self.myLayerGroup = null;
      // }

      // 4. フックの解除
      // (例: window.removeHook('publicChatDataAvailable', self.listenerFunction);)

      // 5. Workerの終了
      // if (objWorker) {
      //   objWorker.terminate();
      //   objWorker = null;
      // }

      // 6. プラグイン名前空間のクリーンアップ（推奨されませんが、最終手段として）
      // delete window.plugin[PLUGIN_NAME];

      console.log(`[${PLUGIN_NAME}] cleanup complete.`);
    };

    /**
     * プラグインのメインエントリーポイント (IITC起動時に1回だけ呼ばれる)
     * @returns {void}
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
            */

      // 2. ツールボックスへの項目追加
      $("#toolbox").append(
        ` <a onclick="window.plugin.${PLUGIN_NAME}.settingDialog();" title="${PLUGIN_TITLE} の設定を開きます">${PLUGIN_TITLE} 設定</a>`,
      );

      // 3. CSSの適用
      const styleTag = document.createElement("style");
      styleTag.setAttribute("type", "text/css");
      styleTag.id = `${PLUGIN_NAME}-style`; // クリーンアップ用にIDを付与
      styleTag.innerHTML = CSS_STYLE; // innerTextよりinnerHTMLの方が一般的
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
