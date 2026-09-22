# Development tooling

React Maze の開発・検証で使用する主要なツールとコマンドをまとめる。

## Package manager

`yarn.lock` に合わせて Yarn v1 を使用する。

ローカル環境に `yarn` がない場合は、利用可能であれば Corepack 経由で Yarn を有効化してから実行する。

## Development server

```sh
yarn start
```

Vite の開発サーバーを起動する。

## Build

```sh
yarn build
```

Vite の本番ビルドを実行する。

`vite.config.mjs` の `build.outDir` は `build` であり、Firebase Hosting の公開ディレクトリも `firebase.json` で `build` に設定されている。

## Lint

```sh
yarn lint
```

ESLint でリポジトリ内の JavaScript / JSX を検証する。JavaScript の基本的な問題に加え、React 固有の推奨ルールと `react/no-direct-mutation-state` を有効にしている。

現時点では JSDoc / TypeScript / `checkJs` による型ベース静的検証は導入しない。現行コードは小規模な JavaScript / JSX 構成であり、型注釈や移行コストに対して得られる効果が限定的なため、まず lint と既存テストを CI の必須ゲートとする。型情報が必要な変更規模になった場合は別 Issue で再評価する。

## Test

```sh
yarn test
```

Node.js 標準テストランナーで迷路ロジック、Canvas helper、URL サイズ解析の回帰テストを実行する。

## CI と同等のローカル検証

Pull Request の GitHub Actions では Node.js 22 を使用し、次の順序で依存関係の固定インストール、lint、テスト、ビルドを実行する。

```sh
corepack enable
yarn install --frozen-lockfile
yarn lint
yarn test
yarn build
```

ローカルでも PR 作成前に同じコマンドを実行する。依存関係が既に lockfile と一致してインストール済みの場合でも、少なくとも `yarn lint`、`yarn test`、`yarn build` は実行する。

## Maze generation benchmark

```sh
yarn benchmark:maze
```

既定サイズ `84x42` と最大サイズ `200x200` の迷路生成時間を、warm-up 後に複数回計測して中央値と各 run の値を表示する。

性能値は実行環境によって変動するため、この benchmark の絶対時間を CI の合否判定には使用しない。性能変更の PR では、Node.js バージョンなどの実行環境と計測結果を記録し、同一環境で変更前後を比較する。

## Trace redraw benchmark

```sh
yarn benchmark:trace
```

最大サイズ相当の 401×401 グリッドについて、Canvas API を模した軽量 context を使い、迷路全体の `drawMaze()` と追加 trace セルだけの `drawTraceCells()` を同じプロセスで繰り返し計測する。

この benchmark はブラウザや GPU 固有の実描画時間ではなく、通常操作で全 160,801 セルを再走査する方式と、追加セル数だけを処理する方式の JavaScript 側の相対コストを比較するためのものとする。絶対時間は CI の合否条件にしない。

## Local preview

```sh
yarn preview
```

ビルド済みの出力を Vite preview で確認する。

## Dependency audit

依存関係を更新した場合は、少なくとも次を確認する。

```sh
yarn audit --json
yarn build
```

audit の結果に既知の問題が含まれる場合は、変更との関係と対応方針を PR に記載する。

通常の CI では audit を必須ゲートにしない。registry 側の一時障害や既存脆弱性により、アプリ本体の回帰と無関係に PR を停止させないためである。

## Firebase Hosting

デプロイ手順の概要は README を参照する。Hosting は `build` ディレクトリを公開し、SPA 用に全パスを `/index.html` へ rewrite する。
