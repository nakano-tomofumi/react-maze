# AGENTS.md

このファイルは、AI エージェントや開発者が最初に参照するための短いインデックスである。詳細なルールは `docs/` に分離し、このファイル自体を肥大化させない。

## 基本原則

- 原則として日本語で回答する。
- 作業内容、確認結果、未実施の検証がある場合は簡潔に明記する。
- 既存のコードスタイルと構成に合わせ、変更範囲を目的達成に必要な範囲へ限定する。
- 無関係な変更や大規模なリファクタリングを同じ作業へ混在させない。

## 開発ドキュメント

- [Development workflow](docs/development/workflow.md)  
  Issue / PR 中心の開発フロー、変更範囲、検証、ドキュメント運用を確認するときに参照する。
- [Repository safety](docs/development/repository-safety.md)  
  公開リポジトリへ追加してよい情報か、機密情報や生成物の扱いを確認するときに参照する。
- [Development tooling](docs/development/tooling.md)  
  Yarn、Vite、Firebase Hosting、build / preview / audit の手順を確認するときに参照する。

## 開発履歴の置き場所

開発タスク、検討経緯、進捗、変更履歴は GitHub Issue / Pull Request / commit history に残す。現在も有効な仕様、設計判断、開発・運用ルールだけを必要に応じて `docs/` へ反映する。
