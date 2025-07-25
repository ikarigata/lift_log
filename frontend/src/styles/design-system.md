# デザインシステム - Lift Log

## 色定義（5色パレット）

### 基本カラー
- **メインカラー**: `#F1EFDF` (クリーム/ベージュ)
- **サブカラー**: `#26272A` (ダークグレー/黒)
- **アクセントカラー**: `#E86029` (オレンジ)
- **コンテナカラー**: `#3B3C3F` (グレー)
- **ホワイト**: `#FFFFFF`

### 用途別色定義

#### Surface (背景色)
```css
bg-surface-primary     /* #F1EFDF - ベース画面背景 */
bg-surface-secondary   /* #26272A - コンポーネント背景 */
bg-surface-container   /* #3B3C3F - 入力欄・内部要素背景 */
```

#### Content (テキスト色)
```css
text-content-primary   /* #26272A - メインテキスト (ベース背景上) */
text-content-secondary /* #F1EFDF - セカンダリテキスト (黒背景上) */
text-content-accent    /* #E86029 - アクセントテキスト */
text-content-inverse   /* #FFFFFF - 反転テキスト (オレンジ背景上) */
```

#### Interactive (インタラクティブ要素)
```css
bg-interactive-primary   /* #E86029 - プライマリボタン */
bg-interactive-secondary /* #3B3C3F - セカンダリボタン */
bg-interactive-surface   /* #26272A - インタラクティブサーフェス */
```

#### Navigation (ナビゲーション)
```css
bg-navigation-bg       /* #E86029 - ナビゲーション背景 */
text-navigation-text   /* #FFFFFF - ナビゲーションテキスト */
text-navigation-active /* #FFFFFF - アクティブ状態 */
```

#### Input (入力要素)
```css
bg-input-bg           /* #3B3C3F - 入力欄背景 */
text-input-text       /* #F1EFDF - 入力テキスト */
```

## コンポーネントパターン

### 基本レイアウト
```jsx
// ベース画面
<div className="bg-surface-primary min-h-screen">
  
  // コンポーネントブロック
  <div className="bg-surface-secondary rounded-lg p-4">
    <h2 className="text-content-secondary">タイトル</h2>
    
    // 入力欄
    <input className="bg-input-bg text-input-text border-none rounded p-2" />
    
    // プライマリボタン
    <button className="bg-interactive-primary text-content-inverse rounded px-4 py-2">
      実行
    </button>
  </div>
</div>
```

### ボトムナビゲーション
```jsx
<nav className="bg-navigation-bg">
  <button className="text-navigation-active">ホーム</button>
  <button className="text-navigation-text">その他</button>
</nav>
```

## デザイン原則
1. **ボーダーなし**: 全ての要素でborder-noneを使用
2. **角丸**: rounded-lgを基本とする
3. **余白**: p-4, px-4 py-2などの標準サイズを使用
4. **フォント**: font-dotgothicを全体で使用
5. **5色制限**: 指定された5色以外は使用しない