# IITCプラグイン テンプレート (iitc-plugin-template)
これは、[Ingress Intel Total Conversion (IITC)](https://iitc.app/) のカスタムプラグインを開発するための、高機能なテンプレートです。

テンプレート自体は、外部ライブラリに依存せず、グローバル空間を汚染しないような実装を目指しています。

## テンプレートの機能
このテンプレートは、プラグイン開発で一般的に必要となる以下の機能の雛形を含んでいます。

- 設定管理:
  - localStorage を利用した設定の読み込み (Load) と保存 (Save)。
  - 設定のインポート (.json) とエクスポート (.json) 機能。
- IndexedDB ヘルパー:
  - 大容量データを扱うためのIndexedDBの基本的な操作（Open, Put, Get, GetAll, Delete, Clear）をPromiseベースでラップしたヘルパー関数。
- 設定ダイアログ:
  - IITC標準の dialog() を使用した設定UIの雛形。
- プレースホルダーの定数化:
  - プラグイン名やDOMのIDを冒頭の定数セクションで一元管理し、置換漏れを防ぎ、保守性を向上させます。
- クリーンアップ処理:
  - プラグインが追加した要素（CSSやツールボックスのリンクなど）を削除する cleanup 関数の雛形。
- Web Worker:
  - 重い処理を別スレッドで行うためのWeb Workerの雛形（コメントアウト）。
- CSS挿入:
  - プラグイン専用のCSSを動的に追加する雛形。

## セットアップ手順
1. ファイルのリネーム:
    - iitc-plugin-template.user.js を、あなたのプラグイン名（例: iitc-plugin-my-plugin.user.js）にリネームします。
2. Userscriptヘッダーの編集:
    - ファイル冒頭の ==UserScript== ブロックを、あなたのプラグインの内容に合わせて編集します。
    - @name: IITCのプラグイン一覧に表示される名前。
    - @id: 識別子（通常、iitc-plugin-\[プラグイン名]@\[作者名] の形式）。
    - @description: プラグインの説明。
    - @downloadURL, @updateURL: プラグインを配布するURL（GitHub Rawなど）。
3. プラグイン定義の編集:
    - .user.js ファイル内の // === プラグイン定義 === セクションにある定数を、あなたのプラグイン設定に合わせて書き換えます。
   - PLUGIN\_AUTHOR: あなたの作者名。
   - PLUGIN\_NAME: 内部的に使用するプラグイン名（window.plugin\[PLUGIN\_NAME] となります）。
    - PLUGIN\_ID: @id と合わせる必要はありませんが、識別に使います。
    - PLUGIN\_TITLE: 設定ダイアログのタイトルや、ツールボックスのリンクテキストとして使用されます。
4. デフォルト設定の編集:
    - // === デフォルト設定 === セクションで、あなたのプラグインが使用する設定項目のID（ID\_...）と、そのデフォルト値（DEFAULT\_OPTIONS）を定義します。
5. 開発の開始:
    - self.settingDialog に設定項目を追加し、self.start や self.init にプラグインの主処理を記述します。

## ビルドプロセスについて
\==UserScript== ブロックの @version や、plugin\_info.dateTimeVersion は、リリース時に手動で更新する必要があります。

開発が本格化する場合、npm, Gulp, Rollup などのビルドツールを導入し、これらのバージョン番号の自動更新、コードの最小化 (Minify)、単一ファイルへの結合などを自動化することを推奨します。

## 開発のヒントと参考リンク
プラグイン開発に役立つリソースです。

### IITC 公式
* [**IITC-CE Developer Documentation**](https://iitc-ce.github.io/ingress-intel-total-conversion/ "null") (公式)

  * **（必須）** 公式のデベロッカードキュメント。フック（Hooks）や `window` オブジェクトのAPIリファレンスです。

* [**IITC-CE GitHub Repository**](https://www.google.com/search?q=https://github.com/iitc-ce/ingress-intel-total-conversion "null")

  * IITC本体のソースコードリポジトリです。
  * 特に `plugins/` ディレクトリ内にある**標準プラグインのソースコード**は、機能実装の最も良いお手本となります。
  * Issue（問題）や Pull Request（貢献）も開発の参考になります。

### 内部ライブラリ (IITCが利用しているもの)
* [**Leaflet.js Documentation**](https://leafletjs.com/reference.html "null") (地図)

  * **（必須）** IITCが使用する地図ライブラリ。マーカー、ポリライン、レイヤー操作など、地図上の操作はすべてこれを利用します。

* [**jQuery API Documentation**](https://api.jquery.com/ "null") (UI操作)

  * IITCはUI操作（ダイアログ、サイドバー、DOM操作）の多くにjQueryを利用しています。`$` で始まる関数のリファレンスです。

### 基礎技術

* [**MDN Web Docs (JavaScript)**](https://developer.mozilla.org/ja/docs/Web/JavaScript "null")

  * JavaScriptの文法、`Promise` や `async/await` といった非同期処理、`JSON`、`fetch` APIなど、基本的な技術のリファレンスです。

* [**IndexedDB API (MDN)**](https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API "null")

  * 大容量データを扱う場合（このテンプレートのヘルパー関数がラップしている技術）のリファレンスです。


## ライセンス (License)
### あなたのプラグインのライセンス（開発者向け）
あなた（仕様者）は、このテンプレートを元に作成したあなたのプラグインのライセンスを、自由に決定・変更できます（例：GPL, Apache, 商用ライセンスなど）。

.user.js ファイル内の /\*\* Copyright 2025 \[Author] ... \*/ で始まるコメントブロック全体を、あなた自身が選択した著作権表示とライセンス（例: Copyright 2025 MyName. Licensed under MIT. など）に書き換えてください。

## テンプレートのライセンス
この iitc-plugin-template 自体は、以下の MIT License の下で公開されています。これにより、あなたはこのテンプレートを自由に改変、再配布、商用利用することができます。
