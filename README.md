# Bookclub

## 概要
URL: [https://bookclub-e4ca9.firebaseapp.com/](https://bookclub-e4ca9.firebaseapp.com/)

このアプリは、教科書や参考書を使った学習の効率化と、読者コミュニティによる学びの深化を目的としています。同じ教材を使う仲間と疑問を共有し、解決し合うことで、一人では得られない理解とモチベーションを提供します。

## 主な機能

### 書籍検索とQ&A機能
楽天ブックスに掲載されている豊富な書籍の中から、興味のある一冊をキーワードやジャンルで手軽に検索できます。疑問があれば質問を投稿し、他のユーザーの質問に回答することで、活発な学びの場を創出します。書籍の概要、著者、レビューなどの基本情報もすぐに確認でき、著者名から関連書籍を簡単に探せます。見つけた本は、そのまま楽天ブックスの販売ページからスムーズに購入可能です。

### SNS機能
質問や回答に対して「いいね」で評価したり、興味のある質問や回答をフォローしたり、コメントで議論を深めたりできます。各ユーザーのプロフィールページでは、自己紹介、総合評価、過去の質問や回答を確認でき、活発なコミュニティ形成を促します。

### 高機能テキストエディタ
文字装飾はもちろん、コードや複雑な数式、画像の挿入、レイアウト編集が可能なリッチテキストエディタを搭載しています。特に数式挿入では、LaTeX構文に対応し、専門的な表現も可能です。さらに、LaTeX構文に不慣れな中高生でも直感的に数式を入力できるよう、専用のUIも用意しました。これにより、より高度で分かりやすい解説の共有を可能にします。

### リアルタイム通知機能
投稿した質問への新しい回答や、興味のあるスレッドの更新をリアルタイムで通知します。アプリ起動中はもちろん、閉じた状態でもバックグラウンド通知で情報を見逃しません。

## 仕様技術

### フロントエンド
- Vue.js 3.2.13
- Vuetify 3.5.17

### バックエンド/データベース
- Firebase
  - Firebase Hosting
  - Cloud Firestore
  - Cloud Storage for Firebase
  - Firebase Authentication
  - Cloud Functions for Firebase
  - Firebase Cloud Messaging (FCM)
 
### 書籍検索
- 楽天Books API (バージョン 2017-04-04)

### テキストエディタ
- tiptap/vue-3 2.3.2

## 工夫した点

### UIとレスポンジブなレイアウト
アプリケーションの全体的なレイアウトやUIはVuetifyのコンポーネントを用いて構築しました。また、Vuetifyのグリッドシステムを使用して、あらゆるデバイスに対応するレスポンシブなデザインになるように心掛けました。

### リッチテキストエディタの作成
エディタのコア機能（テキストの装飾、画像の挿入、レイアウト編集など）はTiptapを用いて、UI（ツールバー、メニュー、ダイアログなど）はVuetifyを用いて構築しました。

### リアルタイムデータベースの実装
質問や回答の内容、「いいね」数、アプリ内通知など、アプリを使用するユーザー間で即時に共有・同期する必要のあるデータは、Cloud Firestoreのリアルタイムデータベースを用いて管理しています。

### ユーザー認証システム
ユーザー認証システムはFirebase Authenticationで用いて構築しました。取得したユーザー情報（ユーザーIDやログイン状態）に基づいて、ページ表示、機能の利用可否の変更や、Cloud Firestoreへのアクセス権限の設定を行いました。

### バックグラウンド通知
バックグラウンド通知はFirebase Cloud Messaging (FCM)を用いて実装しました。ユーザーが投稿した質問に新しい回答が寄せられた際に、質問者のデバイスにリアルタイムで通知を送信します。通知先の各デバイスの登録トークンをFirebase Authenticationのユーザー情報と紐づけることで、ユーザーがプッシュ通知を許可した複数のデバイスに同時に通知を送信しています。









