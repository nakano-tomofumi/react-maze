# React Maze

React で作った迷路ゲームです。マウスで通路をなぞると経路が赤く表示され、ゴールに到達すると経路が緑に変わります。

公開先:

- https://dx-locations.com
- https://react-maze-20200309.web.app

## URL パラメータ

迷路のサイズは URL パラメータで指定できます。

```text
https://dx-locations.com/?h=41&w=41
```

- `w`: 迷路の幅
- `h`: 迷路の高さ
- 未指定時は `w=84`, `h=42`
- 指定値は `1` から `200` の範囲に制限されます

## 開発

このプロジェクトは Vite と Yarn v1 を使います。

```sh
yarn start
```

ローカル開発サーバーを起動します。

## ビルド

```sh
yarn build
```

本番用ファイルを `build` に生成します。Firebase Hosting もこの `build` ディレクトリを公開します。

## ローカル確認

```sh
yarn preview
```

ビルド済みファイルをローカルで確認します。

## セキュリティ確認

```sh
yarn audit --json
```

依存関係の脆弱性を確認します。

## デプロイ

```sh
yarn build
firebase deploy --project react-maze-20200309
```
