export const WELCOME_EMAIL_TEMPLATE = (name: string, company: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao DRPS Manager</title>
    <style>
        body { margin: 0; padding: 0; background-color: #020617; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 32px; padding: 40px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .logo-text { font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 30px; font-style: italic; }
        .blue { color: #3b82f6; }
        .title { font-size: 28px; font-weight: 800; margin-bottom: 20px; }
        .description { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 30px; }
        .button { display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px; transition: all 0.3s ease; }
        .footer { margin-top: 40px; font-size: 12px; color: #475569; letter-spacing: 2px; text-transform: uppercase; }
        .highlight-box { background: #1e293b; border-radius: 16px; padding: 20px; margin: 30px 0; text-align: left; border-left: 4px solid #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo-text">AVALIAÇÃO <span class="blue">ARP</span></div>
            <h1 class="title">Seja bem-vindo, ${name}!</h1>
            <p class="description">
                É uma honra ter a <strong>${company}</strong> utilizando o <strong>DRPS Manager</strong>. 
                Sua conta está ativa e pronta para transformar a saúde ocupacional da sua empresa com inteligência e conformidade (NR-01).
            </p>
            
            <div class="highlight-box">
                <div style="font-weight: bold; margin-bottom: 10px; color: #f8fafc;">💡 Por onde começar?</div>
                <div style="font-size: 14px; color: #94a3b8;">
                    • Acesse seu dashboard exclusivo.<br>
                    • Cadastre sua primeira empresa e setores.<br>
                    • Gere o link oficial de coleta e inicie a avaliação.
                </div>
            </div>

            <a href="https://drps-manager.vercel.app/dashboard" class="button">ENTRAR NO DASHBOARD</a>
            
            <div class="footer">
                © 2024 DRPS - INTELIGÊNCIA EM SAÚDE OCUPACIONAL
            </div>
        </div>
    </div>
</body>
</html>
`;

export const RESET_PASSWORD_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; background-color: #020617; font-family: sans-serif; color: #f8fafc; text-align: center; }
        .container { padding: 50px 20px; }
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; }
        .btn { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; margin-top: 20px; }
        .footer { margin-top: 30px; color: #475569; font-size: 11px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h2 style="color: #3b82f6;">Recuperação de Acesso</h2>
            <p style="color: #94a3b8;">Recebemos uma solicitação para redefinir a senha da sua conta no DRPS Manager.</p>
            <p style="color: #94a3b8;">Clique no botão abaixo para escolher sua nova senha:</p>
            <a href="{{ .ConfirmationURL }}" class="btn">REDEFINIR SENHA AGORA</a>
            <p style="color: #475569; font-size: 12px; margin-top: 30px;">Se você não solicitou esta alteração, pode ignorar este e-mail.</p>
            <div class="footer">DRPS MANAGER — SISTEMA DE GESTÃO NR-01</div>
        </div>
    </div>
</body>
</html>
`;
