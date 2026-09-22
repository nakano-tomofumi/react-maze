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

## Firebase Hosting

デプロイ手順の概要は README を参照する。Hosting は `build` ディレクトリを公開し、SPA 用に全パスを `/index.html` へ rewrite する。
