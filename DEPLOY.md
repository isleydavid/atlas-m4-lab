# Publicar no GitHub Pages

O projeto já vem com deploy automático: todo `push` na branch `main` builda e publica
no GitHub Pages (workflow em `.github/workflows/deploy.yml`).

## 1. Criar o repositório
No GitHub, crie um repositório novo (ex.: `atlas-m4-lab`). Pode ser **privado** —
o Pages funciona em repositório privado em contas Pro/Team/org.

## 2. Subir o código
No terminal, dentro da pasta `atlas-m4-lab`:

```bash
git init
git add .
git commit -m "Atlas M4 Lab — laboratório de componentes"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/atlas-m4-lab.git
git push -u origin main
```

## 3. Ligar o Pages via Actions
No repositório: **Settings → Pages → Build and deployment → Source = GitHub Actions**.

Pronto. A cada push, a aba **Actions** roda o build e publica. O link aparece em
**Settings → Pages** (algo como `https://SEU-USUARIO.github.io/atlas-m4-lab/`).

## Observações
- `vite.config.js` usa `base: './'` (caminhos relativos), que funciona tanto no
  Pages quanto ao abrir o `dist/` localmente.
- Não precisa commitar `node_modules` nem `dist` — o `.gitignore` já cuida disso;
  o build roda no servidor do GitHub.
- Sem terminal? Dá para subir pela web (Add file → Upload files), mas aí suba
  **todos os arquivos do projeto** (menos `node_modules`/`dist`), incluindo a pasta
  oculta `.github`. O caminho por terminal acima é mais simples.
