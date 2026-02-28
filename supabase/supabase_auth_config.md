# Configuração de E-mail — Supabase Dashboard

Para que o e-mail de **Redefinição de Senha** e **Confirmação de Cadastro** fiquem com o visual premium da plataforma, siga estes passos:

## 1. Localização no Supabase
1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard/project/vzszzdeqbrjrepbzeiqq).
2. No menu lateral, clique em **Authentication** (ícone de cadeado).
3. Vá em **Email Templates**.

---

## 2. Template de "Reset Password" (Redefinição de Senha)
No campo **Message**, apague tudo e cole o código abaixo:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; background-color: #020617; font-family: 'Segoe UI', sans-serif; color: #f8fafc; text-align: center; }
        .container { padding: 50px 20px; }
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 32px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .logo { font-size: 24px; font-weight: 900; color: #3b82f6; margin-bottom: 30px; font-style: italic; }
        .btn { background: #2563eb; color: white !important; padding: 18px 35px; text-decoration: none; border-radius: 16px; font-weight: bold; display: inline-block; margin: 30px 0; }
        .footer { margin-top: 30px; color: #475569; font-size: 11px; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">DRPS MANAGER</div>
            <h2 style="font-size: 24px; margin-bottom: 10px;">Recuperação de Acesso</h2>
            <p style="color: #94a3b8; line-height: 1.6;">Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para escolher suas novas credenciais:</p>
            <a href="{{ .ConfirmationURL }}" class="btn">REDEFINIR SENHA AGORA</a>
            <p style="color: #475569; font-size: 12px;">Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
            <div class="footer">SISTEMA DE GESTÃO DE RISCOS PSICOSSOCIAIS</div>
        </div>
    </div>
</body>
</html>
```

## 3. Template de "Confirm Signup" (Confirmação de E-mail)
No campo **Message**, cole este código:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; background-color: #020617; font-family: 'Segoe UI', sans-serif; color: #f8fafc; text-align: center; }
        .container { padding: 50px 20px; }
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 32px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .logo { font-size: 24px; font-weight: 900; color: #3b82f6; margin-bottom: 30px; font-style: italic; }
        .btn { background: #2563eb; color: white !important; padding: 18px 35px; text-decoration: none; border-radius: 16px; font-weight: bold; display: inline-block; margin: 30px 0; }
        .footer { margin-top: 30px; color: #475569; font-size: 11px; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">DRPS MANAGER</div>
            <h2 style="font-size: 24px; margin-bottom: 10px;">Bem-vindo à Plataforma!</h2>
            <p style="color: #94a3b8; line-height: 1.6;">Obrigado por se juntar à nossa rede de consultoria em SST. Confirme seu e-mail para ativar sua conta:</p>
            <a href="{{ .ConfirmationURL }}" class="btn">CONFIRMAR MINHA CONTA</a>
            <div class="footer">© 2024 DRPS | INTELIGÊNCIA EM SAÚDE OCUPACIONAL</div>
        </div>
    </div>
</body>
</html>
```

---

> [!IMPORTANT]
> Lembre-se de clicar em **Save** no canto inferior direito de cada template após colar o código.
