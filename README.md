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
- 値は文字列全体が 10 進整数（任意の `-` + ASCII 数字、または ASCII 数字のみ）である必要があります
- 先頭ゼロは許容されます
- 空文字、小数、指数表記、`+` 付き、前後の空白、数字以外を含む値は無効となり、その項目の既定値が使われます
- 有効な整数値は `1` から `200` の範囲に制限され、`0` / 負数は `1`、`200` 超過は `200` に補正されます

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
