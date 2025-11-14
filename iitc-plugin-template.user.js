// ==UserScript==
// @id             iitc-plugin-[myPluginName]@[PLUGIN_AUTHOR]
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
 * iitc-plugin-template
 * Copyright 2025 otus-scopes
 * (テンプレートのライセンスです。あなたのプラグインのライセンスは下記に記載してください)
 *
 * This template is licensed under MIT.
 * https://opensource.org/licenses/MIT
 *
 *
 * (↓↓ このブロックを、あなたのプラグインの著作権表示とライセンスに書き換えてください ↓↓)
 * Copyright 2025 [Author]
 *
 * Licensed under [Your License]
 * (↑↑ ここまでを書き換えてください ↑↑)
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
    const PLUGIN_AUTHOR = "[PLUGIN_AUTHOR]"; // @id の作者名と合わせる
    const PLUGIN_NAME = "[myPluginName]"; // 内部的なプラグイン名 (window.plugin[PLUGIN_NAME])
    const PLUGIN_ID = "[myPluginId]"; // @id と合わせる必要はない
    const PLUGIN_TITLE = "[myPluginName]"; // 設定ダイアログのタイトルやツールボックスの表示名

    // === ストレージ定義 ===
    /* --- ストレージの使い分け ---
     * 1. localStorage (当テンプレートで使用): 永続的な「設定」の保存に最適。
     * 2. sessionStorage: ブラウザタブを閉じたら消えて良い「一時的な状態」の保存に。
     * 3. IndexedDB: ポータルデータやログなど、「大量の構造化データ」を保存する場合に検討。
     */
    const STORAGE_KEY = `${PLUGIN_NAME}-option`; // localStorageのキー

    // --- IndexedDB 定義 (例) ---
    // (IndexedDBを使用する場合、これらの値を適宜変更してください)
    const IDB_NAME = `${PLUGIN_NAME}-database`;
    const IDB_VERSION = 1;
    const IDB_STORE_NAME_LOGS = "logs"; // 例: ログストア
    const IDB_STORE_NAME_DATA = "data"; // 例: データストア
    // ======================

    // === デフォルト設定 ===
    // 開発者は、このセクションにプラグインの設定項目IDとデフォルト値を定義してください
    // (例)
    const ID_TEXT_INPUT = `${PLUGIN_NAME}-text-input`;
    const ID_CHECKBOX = `${PLUGIN_NAME}-checkbox`;
    const ID_SHOW_IN_SIDEBAR = `${PLUGIN_NAME}-show-in-sidebar`; // (New) サイドバー表示設定

    // (New) モバイル環境 (isSmartphone) かどうかを判定
    // (window.isSmartphone は IITC Mobile 環境で true を返す関数)
    const isMobile = typeof window.isSmartphone === "function" && window.isSmartphone();

    // デフォルト設定
    const DEFAULT_OPTIONS = {
      [ID_TEXT_INPUT]: "default text",
      [ID_CHECKBOX]: false,
      [ID_SHOW_IN_SIDEBAR]: isMobile, // (New) モバイルならtrue, PCならfalseをデフォルトにする
    };
    // ======================

    // === CSS定義 ===
    // (プラグインが使用するCSSをここに定義します)
    // (モバイルフレンドリー対応)
    const CSS_STYLE = `
/* CSS */
/* override (IITC標準スタイル上書き) */
@media (max-width: 600px) {
    /* スマホ表示の際、ダイアログのデフォルトパディングを少し減らす */
    .ui-dialog.${PLUGIN_NAME}-Options-dialog {
        padding: 0.5em !important;
    }
}

/* plugin specific */
/* モバイル対応: ダイアログの幅を画面幅に合わせる */
.${PLUGIN_NAME}-Options-dialog {
    max-width: 500px;  /* PCでの最大幅 */
    width: 90vw;       /* 画面幅の90% */
}

/* フォーム要素のスタイル */
.${PLUGIN_NAME}-Options-dialog .form-group {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column; /* スマホでは縦並びを基本 */
    align-items: flex-start;
}

.${PLUGIN_NAME}-Options-dialog label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

/* テキスト入力欄 */
.${PLUGIN_NAME}-Options-dialog input[type="text"] {
    width: 100%;       /* 幅を親要素に合わせる */
    box-sizing: border-box; /* paddingを含めて幅100%にする */
    padding: 8px;      /* タップしやすくする */
    font-size: 1em;    /* フォントサイズを確保 */
}

/* チェックボックス（タップ領域の確保） */
.${PLUGIN_NAME}-Options-dialog .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 0; /* 上下のタップ領域 */
}
.${PLUGIN_NAME}-Options-dialog input[type="checkbox"] {
    margin-right: 10px;
    /* タップしやすくするため、少し大きくする */
    transform: scale(1.2);
}

/* ボタンのスタイル調整 */
.${PLUGIN_NAME}-Options-dialog .ui-dialog-buttonset button {
    font-size: 1em;    /* フォントサイズ確保 */
    padding: 8px 12px; /* タップしやすく */
    margin-left: 5px;
}

/* Import/Exportボタンが横に並ぶように調整 */
.${PLUGIN_NAME}-Options-dialog .button-group {
    display: flex;
    flex-wrap: wrap; /* スマホでボタンがはみ出たら折り返す */
    gap: 8px; /* ボタン間の隙間 */
}

/* (New) サイドバー用ボタンのスタイル */
.${PLUGIN_NAME}-sidebar-button {
    display: block;
    width: 95%; /* 少しマージンを持たせる */
    margin: 5px auto;
    padding: 8px 10px;
    box-sizing: border-box;
    text-align: center;
    background: #002244;
    border: 1px solid #20A8B1;
    color: #20A8B1;
    cursor: pointer;
    text-decoration: none;
}
.${PLUGIN_NAME}-sidebar-button:hover {
    background: #20A8B1;
    color: #002244;
}

/* (New) ボタンの表示/非表示を制御 (ラッパー) */
.${PLUGIN_NAME}-toolbox-button-wrapper,
.${PLUGIN_NAME}-sidebar-button-wrapper {
    display: none; /* initで切り替えるまで非表示 */
}
            `;
    // ======================

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
     * ボタンの表示/非表示の切り替えなどを行う
     * @returns {void}
     */
    self.init = function () {
      console.log(`[${PLUGIN_NAME}] init called. Options:`, OptionData);

      // --- (New) ボタン表示制御 ---
      // CSSの display を切り替える
      if (OptionData[ID_SHOW_IN_SIDEBAR]) {
        // サイドバーボタンを表示
        $(`.${PLUGIN_NAME}-toolbox-button-wrapper`).css("display", "none");
        $(`.${PLUGIN_NAME}-sidebar-button-wrapper`).css("display", "block");
        // もし 'info' ペインが表示中なら、ボタンがまだなければ追加する
        if (window.selected_pane === "info") {
          self.addSidebarButton();
        }
      } else {
        // ツールボックスボタンを表示
        $(`.${PLUGIN_NAME}-toolbox-button-wrapper`).css("display", "inline"); // spanなのでinline
        $(`.${PLUGIN_NAME}-sidebar-button-wrapper`).css("display", "none");
      }

      // 例: 設定値に基づいて何かを再描画する
      // window.map.fire('mapdataanchorchanged'); // 必要ならマップの再描画をトリガー
    };

    /**
     * 設定の読み込み (localStorageから)
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
     * 設定の保存 (localStorageへ)
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
     * 設定のエクスポート
     * @returns {void}
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
        console.error(`[${PLUGIN_NAME}] Export failed:`, e);
      }
    };

    /**
     * 設定のインポート
     * @param {File} file - インポートする .json ファイル
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
          console.error(
            `[${PLUGIN_NAME}] Failed to parse imported settings:`,
            e,
          );
          alert("設定ファイルの読み込みに失敗しました。");
        }
      };
      reader.readAsText(file);
    };

    /**
     * 設定ダイアログの表示 (モバイルフレンドリー対応)
     * @returns {void}
     */
    self.settingDialog = function () {
      // <table> をやめ、div と label を使用
      const html = `
                <div>
                    <p>設定をインポートまたはエクスポートできます。</p>
                </div>
                <hr>
                
                <div class="form-group">
                    <label for="${ID_TEXT_INPUT}">テキスト入力：</label>
                    <input type="text" id="${ID_TEXT_INPUT}" placeholder="デフォルトのテキスト">
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label" for="${ID_CHECKBOX}">
                        <input type="checkbox" id="${ID_CHECKBOX}">
                        <span>チェックボックス</span>
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox-label" for="${ID_SHOW_IN_SIDEBAR}">
                        <input type="checkbox" id="${ID_SHOW_IN_SIDEBAR}">
                        <span>設定ボタンをサイドバー(情報タブ)に表示</span>
                    </label>
                    <small style="margin-left: 30px; margin-top: 4px; opacity: 0.8;">(デフォルト: ${isMobile ? "ON (モバイル検出)" : "OFF (PC検出)"})</small>
                </div>
            `;

      dialog({
        html: html,
        id: `${PLUGIN_NAME}-Options`,
        title: `${PLUGIN_TITLE} 設定`,
        // width: 500, // 固定幅を削除
        dialogClass: `${PLUGIN_NAME}-Options-dialog`, // CSS適用のためクラスを指定
        modal: true,
        focusCallback: function () {
          // ダイアログ表示時に現在の設定値をフォームに反映
          document.getElementById(ID_TEXT_INPUT).value =
            OptionData[ID_TEXT_INPUT] || "";
          document.getElementById(ID_CHECKBOX).checked =
            OptionData[ID_CHECKBOX] || false;
          document.getElementById(ID_SHOW_IN_SIDEBAR).checked =
            OptionData[ID_SHOW_IN_SIDEBAR] || false;
        },
        buttons: [
          // ボタンをグループ化してCSSでレイアウト調整
          {
            text: "Import",
            class: "button-group", // CSSで .button-group を参照
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
            class: "button-group",
            click: function () {
              self.exportOption();
              // エクスポートはダイアログを閉じない
            },
          },
          {
            text: "OK",
            click: function () {
              // フォームから値を取得してOptionDataに保存
              OptionData[ID_TEXT_INPUT] =
                document.getElementById(ID_TEXT_INPUT).value;
              OptionData[ID_CHECKBOX] =
                document.getElementById(ID_CHECKBOX).checked;
              OptionData[ID_SHOW_IN_SIDEBAR] =
                document.getElementById(ID_SHOW_IN_SIDEBAR).checked;

              self.saveOption(); // localStorageに保存
              self.init(); // 設定を反映

              $(this).dialog("close");
            },
          },
          {
            text: "Cancel",
            click: function () {
              $(this).dialog("close");
            },
          },
        ],
      });
    }; // self.settingDialog end

    // --- IndexedDB ヘルパー関数 ---
    /**
     * IndexedDBを開き、必要に応じてアップグレードを実行します。
     * @param {string} dbName データベース名
     * @param {number} dbVersion データベースのバージョン
     * @returns {Promise<IDBDatabase>} データベースインスタンス
     */
    self.idbOpen = function (dbName, dbVersion) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          // (開発者向け)
          // オブジェクトストア（テーブル）やインデックスの定義をここで行います。
          // 例:
          if (!db.objectStoreNames.contains(IDB_STORE_NAME_LOGS)) {
            // keyPath: 'id' (主キー)
            // autoIncrement: true (主キーを自動採番)
            db.createObjectStore(IDB_STORE_NAME_LOGS, {
              keyPath: "id",
              autoIncrement: true,
            });
          }
          if (!db.objectStoreNames.contains(IDB_STORE_NAME_DATA)) {
            // keyPathを指定しない場合、put/get時にキーを明示的に指定する必要があります
            db.createObjectStore(IDB_STORE_NAME_DATA);
          }
          // インデックスの作成例:
          // const store = event.target.transaction.objectStore(IDB_STORE_NAME_LOGS);
          // store.createIndex('timestamp', 'timestamp', { unique: false });
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };

    /**
     * データをIndexedDBに保存（追加または更新）します。
     * @param {string} dbName データベース名
     * @param {string} storeName ストア名
     * @param {any} value 保存する値
     * @param {any} [key] オブジェクトストアがkeyPathを持たない場合のキー
     * @returns {Promise<void>}
     */
    self.idbPut = async function (dbName, storeName, value, key) {
      const db = await self.idbOpen(dbName, IDB_VERSION);
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const request = key ? store.put(value, key) : store.put(value);

          request.onsuccess = () => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
          transaction.oncomplete = () => {
            db.close();
          };
          transaction.onerror = (event) => {
            reject(event.target.error);
          };
        } catch (e) {
          reject(e);
          db.close();
        }
      });
    };

    /**
     * IndexedDBからキーを指定してデータを取得します。
     * @param {string} dbName データベース名
     * @param {string} storeName ストア名
     * @param {any} key 取得するデータのキー
     * @returns {Promise<any>} 取得したデータ
     */
    self.idbGet = async function (dbName, storeName, key) {
      const db = await self.idbOpen(dbName, IDB_VERSION);
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([storeName], "readonly");
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onsuccess = (event) => {
            resolve(event.target.result);
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
          transaction.oncomplete = () => {
            db.close();
          };
          transaction.onerror = (event) => {
            reject(event.target.error);
          };
        } catch (e) {
          reject(e);
          db.close();
        }
      });
    };

    /**
     * IndexedDBからストア内のすべてのデータを取得します。
     * @param {string} dbName データベース名
     * @param {string} storeName ストア名
     * @returns {Promise<any[]>} データの配列
     */
    self.idbGetAll = async function (dbName, storeName) {
      const db = await self.idbOpen(dbName, IDB_VERSION);
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([storeName], "readonly");
          const store = transaction.objectStore(storeName);
          const request = store.getAll();

          request.onsuccess = (event) => {
            resolve(event.target.result);
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
          transaction.oncomplete = () => {
            db.close();
          };
          transaction.onerror = (event) => {
            reject(event.target.error);
          };
        } catch (e) {
          reject(e);
          db.close();
        }
      });
    };

    /**
     * IndexedDBからキーを指定してデータを削除します。
     * @param {string} dbName データベース名
     * @param {string} storeName ストア名
     * @param {any} key 削除するデータのキー
     * @returns {Promise<void>}
     */
    self.idbDelete = async function (dbName, storeName, key) {
      const db = await self.idbOpen(dbName, IDB_VERSION);
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);

          request.onsuccess = () => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
          transaction.oncomplete = () => {
            db.close();
          };
          transaction.onerror = (event) => {
            reject(event.target.error);
          };
        } catch (e) {
          reject(e);
          db.close();
        }
      });
    };

    /**
     * IndexedDBのストア内のすべてのデータを削除します。
     * @param {string} dbName データベース名
     * @param {string} storeName ストア名
     * @returns {Promise<void>}
     */
    self.idbClear = async function (dbName, storeName) {
      const db = await self.idbOpen(dbName, IDB_VERSION);
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const request = store.clear();

          request.onsuccess = () => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
          transaction.oncomplete = () => {
            db.close();
          };
          transaction.onerror = (event) => {
            reject(event.target.error);
          };
        } catch (e) {
          reject(e);
          db.close();
        }
      });
    };

    // --- IndexedDB ヘルパーここまで ---

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
     * (New) サイドバーの「情報」タブに設定ボタンを追加します。
     * @returns {void}
     */
    self.addSidebarButton = function () {
      // 既にボタンがないか確認
      if ($(`.${PLUGIN_NAME}-sidebar-button-wrapper`).length > 0) return;

      // 'plugin-info-options' セクションを探す
      let container = $("#sidebar #info .plugin-info-options");
      if (container.length === 0) {
        // セクションがない場合は、'info' タブの最後に追加
        container = $("#sidebar #info");
      }

      container.append(
        `<div class="${PLUGIN_NAME}-sidebar-button-wrapper">
            <a class="${PLUGIN_NAME}-sidebar-button" onclick="window.plugin.${PLUGIN_NAME}.settingDialog();">${PLUGIN_TITLE} 設定</a>
        </div>`,
      );

      // init() を呼んで、現在の設定に基づいた表示状態を再適用
      self.init();
    };

    /**
     * (New) 'paneChanged' フックのコールバック
     * @param {string} pane - 表示されたペインのID
     */
    self.onPaneChanged = function (pane) {
      if (pane === "info") {
        self.addSidebarButton();
      }
    };

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
      $(`.${PLUGIN_NAME}-toolbox-button-wrapper`).remove();

      // 1b. (New) サイドバーからリンクを削除
      $(`.${PLUGIN_NAME}-sidebar-button-wrapper`).remove();

      // 2. CSSの削除
      const styleTag = document.getElementById(`${PLUGIN_NAME}-style`);
      if (styleTag) {
        styleTag.remove();
      }

      // 3. カスタムレイヤーの削除
      /*
            if (self.myLayerGroup) {
                window.removeLayerGroup(self.myLayerGroup);
                self.myLayerGroup = null;
            }
            */

      // 4. (New) フックの解除
      window.removeHook("paneChanged", self.onPaneChanged);

      // 5. Workerの終了
      /*
            if (objWorker) {
                objWorker.terminate();
                objWorker = null;
            }
            */
      console.log(`[${PLUGIN_NAME}] cleanup complete.`);
    };

    /**
     * プラグインのメインエントリーポイント (IITC起動時に1回だけ呼ばれる)
     * @returns {void}
     */
    self.start = function () {
      // 1. 設定値の読み込み
      self.loadOption();

      // (IndexedDBの使用例)
      /*
            (async function() {
                try {
                    // 1. データベースの初期化（自動アップグレード）
                    console.log(`[${PLUGIN_NAME}] Opening IDB...`);
                    await self.idbOpen(IDB_NAME, IDB_VERSION);
                    
                    // 2. データの保存 (keyPathなしのストア)
                    await self.idbPut(IDB_NAME, IDB_STORE_NAME_DATA, { info: 'some data' }, 'myDataKey');
                    
                    // 3. データの保存 (autoIncrementのストア)
                    await self.idbPut(IDB_NAME, IDB_STORE_NAME_LOGS, { timestamp: Date.now(), event: 'plugin started' });

                    // 4. データの取得
                    const data = await self.idbGet(IDB_NAME, IDB_STORE_NAME_DATA, 'myDataKey');
                    console.log(`[${PLUGIN_NAME}] IDB 'myDataKey':`, data);

                    // 5. 全データの取得
                    const allLogs = await self.idbGetAll(IDB_NAME, IDB_STORE_NAME_LOGS);
                    console.log(`[${PLUGIN_NAME}] IDB all logs:`, allLogs);

                    // 6. データの削除
                    // await self.idbDelete(IDB_NAME, IDB_STORE_NAME_DATA, 'myDataKey');

                    // 7. ストアの全削除
                    // await self.idbClear(IDB_NAME, IDB_STORE_NAME_LOGS);

                } catch (e) {
                    console.error(`[${PLUGIN_NAME}] IndexedDB Example failed:`, e);
                }
            })();
            */

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

            // --- アイコンの例 ---
            // 1. インラインSVG (ライセンス問題を回避しやすい)
            const mySvgIcon = L.divIcon({
                html: `<svg width="10" height="10" viewBox="0 0 10 10" style="fill: #ff0000; stroke: #fff; stroke-width: 2px;">
                           <circle cx="5" cy="5" r="4" />
                       </svg>`,
                className: "my-custom-div-icon", // CSSでスタイルを当てるためのクラス
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            });
            // L.marker([lat, lng], { icon: mySvgIcon }).addTo(self.myLayerGroup);

            // 2. Base64エンコード (パブリックドメインまたは適切なライセンスの画像をエンコードして使用)
            // (例: 1x1の赤い点)
            const myBase64IconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
            const myBase64Icon = L.icon({
                iconUrl: myBase64IconUrl,
                iconSize: [5, 5] // 表示サイズ
            });
            // L.marker([lat, lng], { icon: myBase64Icon }).addTo(self.myLayerGroup);
            */

      // 2. ツールボックスへの項目追加 (ラッパーで囲む)
      $("#toolbox").append(
        `<span class="${PLUGIN_NAME}-toolbox-button-wrapper">
            <a onclick="window.plugin.${PLUGIN_NAME}.settingDialog();" title="${PLUGIN_TITLE} の設定を開きます">${PLUGIN_TITLE} 設定</a>
        </span>`,
      );

      // 2b. (New) サイドバーへの項目追加 (フック)
      // (self.onPaneChanged をコールバックとして登録)
      window.addHook("paneChanged", self.onPaneChanged);

      // 3. CSSの適用
      const styleTag = document.createElement("style");
      styleTag.setAttribute("type", "text/css");
      styleTag.id = `${PLUGIN_NAME}-style`; // クリーンアップ用にIDを付与
      styleTag.innerHTML = CSS_STYLE;
      document.getElementsByTagName("head")[0].appendChild(styleTag);

      // 4. 初期処理の実行 (ボタンの表示切替など)
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
