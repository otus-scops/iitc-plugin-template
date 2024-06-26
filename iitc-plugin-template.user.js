// ==UserScript==
// @id             iitc-plugin-[myPluginName]@[Auther]
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
* Copyright 2024 [Auther]
*
* Licensed here
*/


var wrapper = function(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'iitc-ja-[Auther]'; // Name of the IITC build for first-party plugins
    plugin_info.dateTimeVersion = 'YYYYMMDDHHmmss'; // Datetime-derived version of the plugin
    plugin_info.pluginId = '[myPluginId]'; // ID/name of the plugin
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== "function") window.plugin = function () { };
    // ensure plugin framework is there, even if kiwi plugin is not yet loaded
    if (typeof window.plugin.[myPluginName]!== "function")
        window.plugin.[myPluginName] = function () { };
    // use own namespace for plugin
    window.plugin.[myPluginName] = function () {};
    
    let self = window.plugin.[myPluginName];
    
    
    /* プラグイン内でグローバルに用いる定数や変数の定義 */
    // const myGlobalConst = 'const';
    // let myGlobalVariable = null;
    
    
    // カスタムレイヤー
    // self.myLayerGroup = null;
    
    // Web worker用
    // let objWorker = null;
    
    // 設定値の保持用
    let OptionData = {};
    
    // Web workerを用いる場合
    const myWorker = `
        // Worker cord here.
        // 本体側へのpost
        // postMessage({});
        
        // 本体からpostされたメッセージの処理
        // self.addEventListener('message', function(e){ }, false);
    `;

	// エンドポイントから起動される初期処理用
	// セットアップ以外の処理で、設定変更時等に再度コールされる想定
    self.init = function(){

    };

    // 設定の読み込み
    self.loadOption = function(){
        let stream = localStorage.getItem(STORAGE_KEY);
        let _data = (stream === null) ? {} : JSON.parse(stream);
        OptionData = _data;
    };

    // 設定の保存
    self.saveOption = function(){
        let stream = JSON.stringify(OptionData);
        localStorage.setItem(STORAGE_KEY,stream);
    };

    self.settingDialog = function() {
        let html = `
            <table>
                <tr>
                    <th>text入力：</th>
                    <td><input type="text" id="[texxInputId]" size="26"></td>
                </tr>
                <tr>
                    <th>チェックボックス：</th>
                    <td><input type="checkbox" id="[checkboxId]"><label for="[checkboxId]">check</label></td>
                </tr>
            </table>
        `;

        dialog({
            html: html,
            id: 'myPluginOptions',
            title: '設定ダイアログ',
            width: 500,
            focusCallback: function() {
                // ダイアログ表示時に規定値を設定
                document.getElementById('[texxInputId]').value = OptionData.[texxInputId];
                document.getElementById('[checkboxId]').checked = OptionData.[checkboxId];
            },
             buttons: {
                 'OK' : async function() {
                     OptionData.[texxInputId] = document.getElementById('[texxInputId]').value;
                     OptionData.[checkboxId] = document.getElementById('[checkboxId]').checked;

                     self.saveOption();
                     
                     $(this).dialog('close');
                 },
                 'Cancel' : function() { $(this).dialog('close'); }
             },
        });
    };
    
    /* worker */
    /*
    self.setupWorker = function(){
        let b = new Blob([myWorker], { type: "text/javascript" });
        return new Worker(window.URL.createObjectURL(b));
    }
    
    // workerからpostされたメッセージの処理
    self.workerResponse = function(e){
        if(!!e.data){
        	
        }
    }
    */

    // The entry point for this plugin.
    self.start = async function() {
        // 設定値の読み込み
        //self.loadOption();
        
        // Web workerを用いる場合
        // objWorker = new self.setupWorker();
        // objWorker.addEventListener('message', self.workerResponse, false);
        // plugin内からworkerへのメッセージはpostMessageにて行う
        // objWorker.postMessage({});
        
        // EventListener
        // https://iitc-ce.github.io/ingress-intel-total-conversion/module-hooks.html
        // addHook('publicChatDataAvailable',self.listnerFunction);

        // カスタムレイヤーの追加
        // self.myLayerGroup = new L.LayerGroup();
        // window.addLayerGroup('[レイヤー名]', self.myLayerGroup, true);
        // レイヤーへのアイコン追加例
        // 詳細はLeafletのドキュメント参照
        // https://leafletjs.com/reference.html
        /*
        let myMarker = L.icon([lat, lng], {
            icon: L.divIcon({
	            className: "myMarkerWrapper",
	            html:'<div class="myMarkerClass"></div>',
	        });
        });
        myMarker.addTo(self.myLayerGroup);.
        */

        /* ツールボックスの項目追加 */
        // $('#toolbox').append('<a onclick="javascript:window.plugin.[myPluginName].settingDialog();">設定</a>');


        let cssData = `
/* CSS */
        `;
        let styleTag = document.createElement('style');
        styleTag.setAttribute('type', 'text/css')
        styleTag.innerText = cssData;
        document.getElementsByTagName('head')[0].insertAdjacentElement('beforeend', styleTag);
        
        // 初期設定
        self.init() 
    };


    const setup = self.start;
    // PLUGIN END //////////////////////////////////////////////////////////



    setup.info = plugin_info; // Add an info property for IITC's plugin system
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
}


var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode(`(${wrapper})(${JSON.stringify(info)});`));
(document.body || document.head || document.documentElement).appendChild(script);