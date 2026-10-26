# Casa Demarchi — experiência web

Apresentação interativa da Rasterizze Arquitetura, Design e Urbanismo, com foco nos interiores da Etapa 02.

**Acessar online:** https://jhonylira.github.io/Esperiencia_web_Casa_demarchi/

Inclui página conceito, plantas humanizadas, maquetes por pavimento, implantação completa, galerias e tour em escala humana com personagens da família.

## Executar localmente

Na entrega completa para Windows, abra **ABRIR APRESENTACAO.vbs**. Em um clone do GitHub, instale Node.js e execute `node server.mjs`; acesse `http://127.0.0.1:4173/`.

Os arquivos da aplicação estão em `dist/`. As bibliotecas são locais; não há etapa de build. O runtime Windows da entrega portátil é mantido fora do Git. O modelo do tour é distribuído em partes binárias, carregadas automaticamente pela aplicação, para respeitar o limite de tamanho de arquivos do repositório.

## Publicação

O workflow `.github/workflows/pages.yml` publica o conteúdo de `dist/` no GitHub Pages.

Leia `LEIA-ME.md` para os controles e `RELATORIO_FINAL.md` para fontes, verificações e critérios de representação.
