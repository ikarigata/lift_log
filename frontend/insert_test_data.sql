-- 簡単なテストデータ挿入SQL
-- 既存のテストユーザーと連携したデータ

-- 既存のテストユーザーID: 123e4567-e89b-12d3-a456-426614174000

-- 基本的な筋肉群データ（既存データとの重複を避ける）
INSERT INTO muscle_groups (id, name, created_at) VALUES
('mg-chest-001', '胸', NOW()),
('mg-back-001', '背中', NOW()),
('mg-shoulders-001', '肩', NOW()),
('mg-legs-001', '脚', NOW()),
('mg-arms-001', '腕', NOW()),
('mg-abs-001', '腹筋', NOW())
ON CONFLICT (id) DO NOTHING;

-- 基本的なエクササイズデータ（テストユーザー用）
INSERT INTO exercises (id, user_id, name, description, muscle_group_id, created_at) VALUES
('ex-bench-001', '123e4567-e89b-12d3-a456-426614174000', 'ベンチプレス', '胸の基本種目', 'mg-chest-001', NOW()),
('ex-squat-001', '123e4567-e89b-12d3-a456-426614174000', 'スクワット', '脚の基本種目', 'mg-legs-001', NOW()),
('ex-deadlift-001', '123e4567-e89b-12d3-a456-426614174000', 'デッドリフト', '背中の基本種目', 'mg-back-001', NOW()),
('ex-shoulder-press-001', '123e4567-e89b-12d3-a456-426614174000', 'ショルダープレス', '肩の基本種目', 'mg-shoulders-001', NOW()),
('ex-barbell-curl-001', '123e4567-e89b-12d3-a456-426614174000', 'バーベルカール', '腕の基本種目', 'mg-arms-001', NOW())
ON CONFLICT (id) DO NOTHING;

-- 最近のワークアウト日データ
INSERT INTO workout_days (id, user_id, date, title, notes, created_at, updated_at) VALUES
('wd-today-001', '123e4567-e89b-12d3-a456-426614174000', CURRENT_DATE, '今日のトレーニング', '今日の調子は良好', NOW(), NOW()),
('wd-yesterday-001', '123e4567-e89b-12d3-a456-426614174000', CURRENT_DATE - INTERVAL '1 day', '昨日のトレーニング', 'まずまずの調子', NOW(), NOW()),
('wd-3days-001', '123e4567-e89b-12d3-a456-426614174000', CURRENT_DATE - INTERVAL '3 days', '3日前のトレーニング', '重量アップに挑戦', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ワークアウト記録データ
INSERT INTO workout_records (id, workout_day_id, exercise_id, notes, created_at, updated_at) VALUES
-- 今日のトレーニング
('wr-today-bench-001', 'wd-today-001', 'ex-bench-001', '調子良く重量アップ', NOW(), NOW()),
('wr-today-squat-001', 'wd-today-001', 'ex-squat-001', '', NOW(), NOW()),
-- 昨日のトレーニング
('wr-yesterday-deadlift-001', 'wd-yesterday-001', 'ex-deadlift-001', '', NOW(), NOW()),
('wr-yesterday-shoulder-001', 'wd-yesterday-001', 'ex-shoulder-press-001', '', NOW(), NOW()),
-- 3日前のトレーニング
('wr-3days-bench-001', 'wd-3days-001', 'ex-bench-001', '', NOW(), NOW()),
('wr-3days-curl-001', 'wd-3days-001', 'ex-barbell-curl-001', '', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ワークアウトセットデータ
INSERT INTO workout_sets (id, workout_record_id, reps, sub_reps, weight, created_at, updated_at) VALUES
-- 今日のベンチプレス
('ws-today-bench-set1', 'wr-today-bench-001', 8, 2, 80.0, NOW(), NOW()),
('ws-today-bench-set2', 'wr-today-bench-001', 6, 1, 80.0, NOW(), NOW()),
('ws-today-bench-set3', 'wr-today-bench-001', 8, 0, 75.0, NOW(), NOW()),
-- 今日のスクワット
('ws-today-squat-set1', 'wr-today-squat-001', 10, 0, 90.0, NOW(), NOW()),
('ws-today-squat-set2', 'wr-today-squat-001', 8, 0, 90.0, NOW(), NOW()),
('ws-today-squat-set3', 'wr-today-squat-001', 12, 0, 85.0, NOW(), NOW()),
-- 昨日のデッドリフト
('ws-yesterday-deadlift-set1', 'wr-yesterday-deadlift-001', 5, 0, 100.0, NOW(), NOW()),
('ws-yesterday-deadlift-set2', 'wr-yesterday-deadlift-001', 5, 0, 100.0, NOW(), NOW()),
('ws-yesterday-deadlift-set3', 'wr-yesterday-deadlift-001', 6, 0, 95.0, NOW(), NOW()),
-- 昨日のショルダープレス
('ws-yesterday-shoulder-set1', 'wr-yesterday-shoulder-001', 10, 0, 40.0, NOW(), NOW()),
('ws-yesterday-shoulder-set2', 'wr-yesterday-shoulder-001', 8, 0, 40.0, NOW(), NOW()),
('ws-yesterday-shoulder-set3', 'wr-yesterday-shoulder-001', 12, 0, 35.0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 成功メッセージ
SELECT 'Test data inserted successfully!' as result;