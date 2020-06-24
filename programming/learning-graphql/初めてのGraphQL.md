初めてのGraphQL Webサービスを作って学ぶ新世代API
===

1章 GraphQLへようこそ
---
### 1.1 GraphQLとは
- GraphQLとはAPIのための問い合わせ言語です
- 通信プロトコルは指定していないが、一般的にはHTTPプロトコルが用いられる
- GraphQLとはクラサバのための言語仕様。ECMAScriptみたいなもの。graphql.jsだけGraphQL開発チームが作った

### 1.2 GraphQLの誕生
- 2012年、Facebookがモバイルアプリの作り直しように作ったクエリ言語
- 2015年、言語仕様を公開。graphql.jsを公開

### 1.3 データ通信の歴史
RPC → SOAP → REST → RESTつらいみたいな話

### 1.4 RESTの課題
GraphQLでたとき「RESTの時代は終わりだ」みたいな話が出たけど行き過ぎ。
Webの発達により、RESTが適合しない状況が生まれてきている。
- 過剰な取得
- 過少な取得
- エンドポイント増えすぎ問題

### 1.5 GraphQLの実情
- クライアント側でよく使われているのはRelay(FaceBokk)とApollo(Meteorコミュニティ).

2章 グラフ理論
---
### 2.1 グラフ理論の用語
- ノード(node), 頂点(vertex): データ
- エッジ(edge): コネクション
- 無向グラフ：ノードの関係に階層構造や方向がないグラフ
- 有向グラフ：エッジが線ではなく矢印で、ノード間に流れ、向きがあるグラフ

### 2.2 グラフ理論の歴史
オイラーのケーニヒスベルクの橋が原点

### 2.3 木というグラフ
木構造の話（唐突）
GraphQLのQueryのデータ構造が木構造になってるから？

### 2.4 実世界でのグラフ
- Facebookの友達は無向グラフ
- Twitterのフォローフォロワーは有向グラフ
- Facebookの友人関係は木構造

3章 GraphQLの問い合わせ言語
---
- GraphQLはSQLの考え方をインターネットに適応したもの。どちらもQueryLanguage(問い合わせ言語)
- GraphQLではSQLのSELECTの代わりに**Query**をデータの取得に利用する
- GraphQLではSQLのINSERT,UPDATE,DELETEの代わりに**Mutation**という単一のコマンドを使用する
- ソケット通信を使ってデータの変更を監視する**Subscription**というコマンドも用意されている
- クエリはただの文字列なのでHTTP POSTリクエストのボディに詰め込んで送信できる

### 3.1 GraphQL APIの便利なツール
- GraphiQL
- GraphQL Playground

### 3.2 GraphQLのクエリ
- **query**オペレーションを使用しAPIからデータを取得できる
- 取得したいデータは**field**で指定する
- オペレーションは1つしかおくれない。1回のリクエストで両方のデータが欲しい時は一つのクエリで書く必要がある。
- QueryはGraphQLの型の一つで**ルート型**
- ルート型はオペレーションに対するGraphQLの方で、入れ子になっているクエリのドキュメントの一番上位には必ずルート型が指定される
- GraphQL APIでクエリできるフィールドはAPIのスキーマで定義されている
- クエリを作成する時は必要なフィールドを波かっこで囲んで指定する。波かっこで囲まれたブロックは**選択セット**と呼ばれる。
- エイリアスを指定することでJSONレスポンスのフィールド名を任意のものに置き換えることができる
- GraphQLのクエリで結果をフィルタリングしたい時は**クエリ引数**を利用する
``` graphql
↓ query
query liftsAndTrails {
    open ←エイリアス: liftCount(status: OPEN ←クエリ引数)
    allLifts { ←選択セット
        name ←field
        status
    }
    allTrails {
        name
        difficulty
    }
}
```

- GraphQLには**スカラー型**と**オブジェクト型** が存在する
  - スカラ型はプリミティブ型に近い概念。選択セットに対しては葉の要素にあたる
  - 整数型(Int), 不動小数点型(Float), 文字列型(String), 論理型(Boolean), ID型(ID)の5つがある
  - Int,FloatはJSONでnumber, StringとIDはstringを返す。IDはGraphQLの使用上ユニークでなければならない。
  - オブジェクト型は一つ以上のスキーマで定義されているフィールドの集合
- **フラグメント**:  複数の場所で使い回すことができる選択セット
``` graphql
fragment liftInfo on Lift {
    name
    status
    capacity
}

query {
    Lift(id: "jazz-cat"'){
        ...liftInfo
    }
}
```

- GraphQLには2つ異なるオブジェクトをまとめる **ユニオン型** を定義できる
  - 複数の型を返しうる型に関しては下記のように両方のケースの選択セットを記述できる
``` graphql
query schedule {
    agenda {
        ...on Workout {
            name
            reps
        }
        ...on StudyGroup {
            name
            subject
            students
        }
    }
}

```

- **インターフェース**は複数のオブジェクト型を扱うためのもう一つの選択肢
  - インタフェースは類似したオブジェクト型が実装すべきフィールドのリストを指定する抽象型

### 3.3 ミューテーション
- 書き込み操作は**mutation**が担当する
- **Mutation**はルート型
- 変数名の頭に$がついた**変数**が利用できる

``` graphql
↓ mutation
mutation createSong(変数→ $title: String!) {
    addSong(title: $title) {
        id   ←戻り値
        title
    }
}
```

### 3.4 サブスクリプション
- リアルタイムに情報を受け取ることができる
- サブスクリプションをリクエストするとデータの変更を関しするようになる

### 3.5 イントロスペクション
- APIスキーマの詳細を取得できる機能
- GraphQLのドキュメントも、イントロスペクションを利用して実現している
- `__schema`を指定することでスキーマの取得ができる
- 特定の型の詳細を知りたい時は`__type`を引く数とともに指定してクエリを送る

### 3.6 抽象構文木
- クエリドキュメントは文字列で、GraphQL APIにクエリを送信すると抽象構文木にパースされる

4章 スキーマの設計
---
- データ型の集合を**スキーマ**と呼ぶ
- 型を簡単に定義できるようGraphQLはスキーマを定義するための言語を用意している。これを**スキーマ定義言語**(Schema Definition Language: SDL)と呼ぶ。

### 4.1 型定義
- **型**は固有のオブジェクトでアプリケーションの特性を反映する
- それぞれの**型**はデータに対応するフィールドを持つ
- スカラ型以外にも独自の型であるカスタムスカラー型を定義できる
  - 定義しておけば実装時に独自のバリデーションを定義できる
- **Enum**:予め定められた特定の文字列の一つを返すスカラ型

``` graphql
↓型
type Photo {
↓フィールド
    id: ID! ←スカラ型（これはID型）
    name: String!
    category: Category
}

↓ 列挙型
enum Category {
    SELFIE
    PORTRAIT
}
```

### 4.2 コネクションとリスト
- フィールドにはGraphQLの型のリストを指定できる
- リストはGraphQLの型を[]で囲むことで表現される e.g: [String]
- リストを定義するときに!(エクスクラメーションマーク)を付けれる。これは必須を表す。
- カスタムオブジェクトの型のフィールドを定義すること = 2のオブジェクトを接続すること
``` graphql
# 1対1の接続
# 有向グラフ 接続が単方向
type User {
    name: String
}

type Photo {
    id: ID!
    name: String
    postedBy: User ← 1ユーザのみ
}

# 1対他の接続
# 無向グラフ 接続は両方向
type User {
    name: String
    postedPhotos: [Photo!]! ← 多数のPhotoと紐付けしてる
}

type Photo {
    id: ID!
    name: String
    postedBy: User
}

# 他対他の接続
type User {
    ....
    inPhotos: [Photo!]!
}

type Photo {
    ....
    taggedUsers: [User!]!
}
```

- スルー型: 他対他の関係を定義する時それぞれの関係自体に意味合いを持たせたくなる場合がある。
  - 例えば、ユーザ同志の他対他の関係にて知り合ってからの帰還のような関係性の情報を保存したい時利用する
``` graphql
type User {
    friends: [User!]!
}

type Friendship {
    friends: [User!]!
    howLong: Int!
    whereWeMet: Location
}
```

- ユニオン型: 複数の型のうちの一つを返す型
``` graphql
union AgendaItem = StudyGroup | Workout

type StudyGroup {
    name: String!
    subject: String
}

type Workout {
    name: String!
    reps: Int!
}

type Query {
    agenda: [AgendaItem!]!
}
```

- インターフェース: オブジェクト型に実装できる抽象型
``` graphql
scalar DateTime

interface AgendaItem {
    name: String!
 }

type StudyGroup implements AgendaItem {
    name: String!
    topc: String
}

type Workout implements AgendaItem {
    name: String!
    reps: Int!
}

type Query {
    agenda: [AgendaItem!]!
}

```
- ユニオン型とインターフェースの使い分け
  - ユニオン型: 含まれる複数の型が全く異なるものである場合
  - インターフェース: 複数の型い共通のフィールドがある場合

### 4.3 引数
- 引数はGraphQLのどのフィールドにも追加できる
- 引数は必須にも任意にもすることができる
``` graphql
type Query {
    .....
    User(githubLogin: ID!): User! ←引数必須
    allPhotos(category: PhotoCategory): [Photo!]! ←引数じゃない,戻り値は必須
}
```
- データページング・ソートも引数でできる
``` graphql
enum SortDirection {
    ASCENDING
    DESCENDING
}

enum SortablePhotoField {
    name
    description
    category
    created
}

type Query {
    .....
    allUsers(first: Int=50, start: Int=0): [User!]! ←データページングできるフィールド
    allPhotos (
        sort: SortDirection = DESCENDING
        sortBy: SortablePhotoField = created
    ): [Photo!]! ← ソートできるフィールド
}
```

### 4.4 ミューテーション
- アプリケーションで使われる動詞と対応づくのが望ましい
- サービスに対してできることがミューテーションとして定義される
``` graphql
type Mutation {
    postPhoto(
        name: String!
        description: String
        category: PhotoCategory=PORTRAIT
    ): Photo!
}
```

### 4.5 入力型
- 多数の引数をうまく扱うためには入力型(input型)を利用する
- mutationを作成する時`$input`クエリ変数はPostPhotoInput!入力値と一致している必要がある
``` graphql
input PostPhotoInput {
    name: String!
    description: String
    category: PhotoCategory=PORTRAIT
}

type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
}

mutation newPhoto
```

### 4.6 返却型
- 返却時にもカスタムした型を定義することができる

### 4.7 サブスクリプション
- Subscription型はGraphQLというスキーマ定義言語の他のオブジェクト型と同じ

### 4.8 スキーマのドキュメント化
- GraphQLのスキーマを作成する時、それぞれのフィールドにスキーマの型やフィールドに対する説明を付与できる

``` graphql
"""
最低一度はGitHubで認可されたユーザ
"""
type User {
    """
    ユーザのログインID
    """
    githubLogin: ID!
}
```

5章 GraphQLサーバーの実装
---
下記に実装
https://github.com/hyakt/book-report/tree/master/programming/learning-graphql/photo-share-client

6章 GraphQLクライアントの実装
---
下記に実装
https://github.com/hyakt/book-report/tree/master/programming/learning-graphql/photo-share-client

7章 GraphQLの実戦投入にあたって
---
### 7.1 サブスクリプション
### 7.2 ファイルアップロード
### 7.3 セキュリティ
### 7.4 次の段階にすすむ
