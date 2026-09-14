# Missão Setembro Amarelo 🌻 - Colégio Franciscano Sant'Anna

Aplicação educacional interativa de acolhimento, empatia e valorização da vida para os estudantes do **Colégio Franciscano Sant'Anna** (Santa Maria - RS), sob a coordenação do **Prof. Ederson Braga Mello**.

---

## 🌟 Funcionalidades
- **8 Desafios Dinâmicos**: Vídeo de acolhimento, quiz de empatia, jogo dos 7 erros, caça-palavras da esperança, labirinto das emoções, ligue os pontos, reflexões e mural coletivo.
- **Mural da Esperança 🌻**: Espaço onde os estudantes compartilham palavras de incentivo e empatia (com filtro de palavras e reação de girassol).
- **Certificado Personalizado**: Emissão de certificado com o nome e turma do estudante ao concluir os 8 desafios.
- **Painel do Professor**: Acesso exclusivo para o corpo docente acompanhar respostas, alunos participantes e gerenciar o mural.
- **Hospedagem Híbrida**: Compatível tanto com backend em Node/Express quanto com hospedagem estática via **GitHub Pages** (`https://edersonbmteo-alt.github.io/saudemental/`).

---

## 🚀 Publicação no GitHub Pages
Este repositório está configurado com o GitHub Actions em `.github/workflows/deploy-pages.yml`:
1. No repositório GitHub, acesse **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. A cada commit na branch `main`, o build é executado automaticamente com o caminho base `/saudemental/` e publicado em produção.
