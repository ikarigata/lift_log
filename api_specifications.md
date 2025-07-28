# API仕様書

## 認証
すべてのリクエストには、認証のために `Authorization` ヘッダーに `Bearer <token>` を含める必要があります。

---

## エクササイズ管理 (Exercises)

### 1. エクササイズ一覧取得
- **エンドポイント:** `GET /api/exercises`
- **説明:** 登録されているすべてのエクササイズの一覧を取得します。
- **レスポンスボディ (200 OK):**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "muscleGroup": "string",
      "isFavorite": "boolean"
    }
  ]
  ```
  - `Exercise[]` 型 (frontend/src/types/index.ts)

### 2. エクササイズ追加
- **エンドポイント:** `POST /api/exercises`
- **説明:** 新しいエクササイズを登録します。
- **リクエストボディ:**
  ```json
  {
    "name": "string",
    "muscleGroup": "string",
    "isFavorite": "boolean"
  }
  ```
  - `Omit<Exercise, 'id'>` 型
- **レスポンスボディ (201 Created):**
  ```json
  {
    "id": "string",
    "name": "string",
    "muscleGroup": "string",
    "isFavorite": "boolean"
  }
  ```
  - `Exercise` 型

### 3. エクササイズ削除
- **エンドポイント:** `DELETE /api/exercises/{exerciseId}`
- **説明:** 指定されたIDのエクササイズを削除します。
- **URLパラメータ:**
  - `exerciseId` (string): 削除するエクササイズのID
- **レスポンス (204 No Content):**
  - ボディなし

---

## ワークアウト記録 (Workout Records)

### 4. ワークアウト記録一覧取得
- **エンドポイント:** `GET /api/workout-records`
- **説明:** すべてのワークアウト記録を取得します。
- **レスポンスボディ (200 OK):**
  ```json
  [
    {
      "id": "string",
      "workoutDayId": "string",
      "exerciseId": "string",
      "exerciseName": "string",
      "sets": [
        {
          "setNumber": "number",
          "weight": "number",
          "reps": "number",
          "subReps": "number"
        }
      ],
      "memo": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ```
  - `WorkoutRecord[]` 型 (frontend/src/types/index.ts)

### 5. ワークアウト記録追加
- **エンドポイント:** `POST /api/workout-records`
- **説明:** 新しいワークアウト記録を保存します。
- **リクエストボディ:**
  ```json
  {
    "workoutDayId": "string",
    "exerciseId": "string",
    "sets": [
      {
        "setNumber": "number",
        "weight": "number",
        "reps": "number",
        "subReps": "number"
      }
    ],
    "memo": "string"
  }
  ```
- **レスポンスボディ (201 Created):**
  - `WorkoutRecord` 型

### 6. ワークアウト記録更新
- **エンドポイント:** `PUT /api/workout-records/{recordId}`
- **説明:** 既存のワークアウト記録を更新します。
- **URLパラメータ:**
  - `recordId` (string): 更新するワークアウト記録のID
- **リクエストボディ:**
  ```json
  {
    "workoutDayId": "string",
    "exerciseId": "string",
    "sets": [
      {
        "setNumber": "number",
        "weight": "number",
        "reps": "number",
        "subReps": "number"
      }
    ],
    "memo": "string"
  }
  ```
- **レスポンスボディ (200 OK):**
  - `WorkoutRecord` 型

---

## 統計 (Statistics)

### 7. エクササイズの進捗取得
- **エンドポイント:** `GET /api/users/{userId}/statistics/progress/{exerciseId}`
- **説明:** 特定のユーザーとエクササイズに関する進捗（最大重量、総ボリュームなど）を取得します。
- **URLパラメータ:**
  - `userId` (string): ユーザーのID
  - `exerciseId` (string): エクササイズのID
- **レスポンスボディ (200 OK):**
  ```json
  {
    "userId": "string",
    "exerciseId": "string",
    "exerciseName": "string",
    "progress": [
      {
        "date": "string",
        "maxWeight": "number",
        "totalVolume": "number",
        "max1RM": "number"
      }
    ]
  }
  ```
  - `ExerciseProgressResponse` 型 (frontend/src/types/index.ts)

---

## ワークアウト日 (Workout Days)

### 8. ワークアウト日一覧取得
- **エンドポイント:** `GET /api/workout-days`
- **説明:** すべてのワークアウト日を取得します。
- **レスポンスボディ (200 OK):**
  ```json
  [
    {
      "id": "string",
      "date": "string",
      "name": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ```
  - `WorkoutDay[]` 型

### 9. ワークアウト日追加
- **エンドポイント:** `POST /api/workout-days`
- **説明:** 新しいワークアウト日を追加します。
- **リクエストボディ:**
  ```json
  {
    "date": "string",
    "name": "string"
  }
  ```
  - `Omit<WorkoutDay, 'id' | 'createdAt' | 'updatedAt'>` 型
- **レスポンスボディ (201 Created):**
  - `WorkoutDay` 型

### 10. 月ごとのワークアウト日取得
- **エンドポイント:** `GET /api/workout-days/calendar`
- **説明:** 指定された年月に含まれるワークアウト日をカレンダー表示用に取得します。
- **クエリパラメータ:**
  - `year` (number): 年
  - `month` (number): 月
- **レスポンスボディ (200 OK):**
  - `WorkoutDay[]` 型
