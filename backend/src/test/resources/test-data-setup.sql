-- 統合テスト用のテストデータ初期化スクリプト

-- テストユーザーの作成（既存の場合は何もしない）
INSERT INTO users (id, name, email, password_hash, created_at)
VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    'Test User',
    'test@example.com',
    '$2a$10$InbcNyof2Wmy72R6/85afeNYvuyJh3aaYTvb.Sxt3ocooDY9oCu6G',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    created_at = EXCLUDED.created_at;

-- テスト用筋肉群の作成
INSERT INTO muscle_groups (id, name, created_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', '胸', NOW()),
    ('550e8400-e29b-41d4-a716-446655440001', '背中', NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', '脚', NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', '肩', NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', '腕', NOW())
ON CONFLICT (id) DO NOTHING;

-- テスト用エクササイズの作成
INSERT INTO exercises (id, user_id, name, description, muscle_group_id, created_at)
VALUES 
    ('660e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174000', 'ベンチプレス', '胸の基本種目', '550e8400-e29b-41d4-a716-446655440000', NOW()),
    ('660e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174000', 'スクワット', '脚の基本種目', '550e8400-e29b-41d4-a716-446655440002', NOW()),
    ('660e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174000', 'デッドリフト', '背中の基本種目', '550e8400-e29b-41d4-a716-446655440001', NOW())
ON CONFLICT (id) DO NOTHING;