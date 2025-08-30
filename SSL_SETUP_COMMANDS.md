# SSL証明書 Parameter Store 設定手順

## 前提条件
- AWS CLIが設定済み（`aws configure`実行済み）
- 適切なIAM権限（SSM Parameter Store書き込み権限）
- SSL証明書ファイルが `ssl/` ディレクトリに配置済み

## 1. SSL証明書をParameter Storeに登録

### 証明書の登録
```bash
aws ssm put-parameter \
  --name "/vol-log/ssl/certificate" \
  --type "SecureString" \
  --value "$(cat ssl/certs/cert.pem)" \
  --description "SSL Certificate for Vol Log application (Cloudflare Origin Certificate)" \
  --overwrite
```

### 秘密鍵の登録
```bash
aws ssm put-parameter \
  --name "/vol-log/ssl/private-key" \
  --type "SecureString" \
  --value "$(cat ssl/private/key.pem)" \
  --description "SSL Private Key for Vol Log application (Cloudflare Origin Certificate)" \
  --overwrite
```

### クライアント証明書の登録（Cloudflare Origin Pull用）
```bash
aws ssm put-parameter \
  --name "/vol-log/ssl/client-certificate" \
  --type "SecureString" \
  --value "$(cat ssl/certs/cloudflare-origin-pull-ca.pem)" \
  --description "SSL Client Certificate for Cloudflare Origin Pull authentication" \
  --overwrite
```

## 2. 登録確認

### Parameter Store一覧確認
```bash
aws ssm describe-parameters \
  --parameter-filters "Key=Name,Option=BeginsWith,Values=/vol-log/ssl/"
```

### 証明書内容確認（復号化）
```bash
aws ssm get-parameter \
  --name "/vol-log/ssl/certificate" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text
```

### 秘密鍵内容確認（復号化）
```bash
aws ssm get-parameter \
  --name "/vol-log/ssl/private-key" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text
```

### クライアント証明書内容確認（復号化）
```bash
aws ssm get-parameter \
  --name "/vol-log/ssl/client-certificate" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text
```

## 3. 証明書更新時の手順

証明書を更新する場合は、上記のput-parameterコマンドを再実行してください。
`--overwrite` フラグにより既存の値が上書きされます。

## 4. セキュリティ注意事項

- SecureString型で暗号化されて保存されます
- 秘密鍵は`chmod 600`で権限制限されて配置されます
- 証明書は`chmod 644`で配置されます
- EC2起動時に自動で取得・配置されます

## 5. トラブルシューティング

### Parameter Storeアクセス権限エラー
IAMロールに以下のポリシーが必要です：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters"
      ],
      "Resource": "arn:aws:ssm:*:*:parameter/vol-log/ssl/*"
    }
  ]
}
```

### 証明書フォーマットエラー
- 証明書は PEM 形式である必要があります
- 改行コードが正しく含まれていることを確認してください
- `-----BEGIN CERTIFICATE-----` と `-----END CERTIFICATE-----` で囲まれている必要があります

## 実行例

```bash
# 現在のディレクトリが /home/ikarigata/dev/lift_log であることを確認
pwd

# SSL証明書の登録
aws ssm put-parameter \
  --name "/vol-log/ssl/certificate" \
  --type "SecureString" \
  --value "$(cat ssl/certs/cert.pem)" \
  --description "SSL Certificate for Vol Log application (Cloudflare Origin Certificate)" \
  --overwrite

# 秘密鍵の登録  
aws ssm put-parameter \
  --name "/vol-log/ssl/private-key" \
  --type "SecureString" \
  --value "$(cat ssl/private/key.pem)" \
  --description "SSL Private Key for Vol Log application (Cloudflare Origin Certificate)" \
  --overwrite

# クライアント証明書の登録
aws ssm put-parameter \
  --name "/vol-log/ssl/client-certificate" \
  --type "SecureString" \
  --value "$(cat ssl/certs/cloudflare-origin-pull-ca.pem)" \
  --description "SSL Client Certificate for Cloudflare Origin Pull authentication" \
  --overwrite

echo "SSL証明書のParameter Store登録が完了しました"
```