# Casa Demarchi — apresentação web

## Abrir para apresentar

1. Dê dois cliques em **ABRIR APRESENTACAO.vbs**. Aguarde o navegador abrir.
2. Use o botão de tela cheia no cabeçalho ou **F11**.
3. Comece em **O conceito**. Em **Explorar a casa**, alterne as vistas pelo seletor:
   - **Superior:** foco da Etapa 02; planta, maquete e galerias completas das suítes, closets, banheiros e circulação.
   - **Térreo:** estar, jantar, living e gourmet com uma imagem cada; área externa com duas.
   - **Implantação:** volumetria completa da casa, vista frontal e duas imagens da fachada.

Clique nos pontos da planta ou da maquete para abrir o ambiente. Arraste a maquete para girar; role para aproximar. O botão **▧** mostra a vista superior; **↺** restaura o enquadramento. Na implantação, **⌂** mostra a fachada frontal. O botão **◐** compara a planta humanizada com a base fornecida. Clique no render para ampliá-lo; as setas do teclado percorrem as vistas. **Esc** fecha a ampliação.

O botão **Iniciar visita guiada** conduz da implantação ao térreo e aos ambientes do superior pelo botão de próximo ambiente.

## Tour em escala humana

Em Superior ou Térreo, escolha **Tour humano**. Selecione Lívia, Juli, Ricardo ou Luna. Os personagens são avatares estilizados com proporções de animação minimalista; as alturas de olhar são representativas de cada personagem.

Clique na cena e arraste para olhar. Use **WASD**, as setas do teclado ou os quatro botões na tela para caminhar; **Shift** acelera. A visita começa pela visão do personagem. **Ver meu personagem** alterna para a câmera de acompanhamento, e **Trocar personagem** abre novamente a escolha da família. Use a faixa de ambientes para ir diretamente a um cômodo. A troca de pavimento é feita pelo seletor **Vista**.

O tour permite circulação livre, sem colisões, conforme solicitado. É possível atravessar móveis e paredes para explorar o modelo com liberdade. As maquetes e o tour usam o próprio modelo fornecido, com níveis de detalhe diferentes; os renders são a referência da atmosfera final. A Implantação usa a câmera de órbita para apresentar a casa completa.

## Funcionamento

A apresentação funciona localmente neste computador, sem internet, com bibliotecas, imagens e runtime incluídos. O endereço é **http://127.0.0.1:4173/**. Mantenha a pasta inteira; abrir apenas `dist/index.html` por duplo clique limita o carregamento 3D por regras do navegador. O atalho prepara o serviço local automaticamente.

Neste PC, enquanto o serviço está aberto, os renders do superior da pasta final indicada são importados automaticamente a cada 45 segundos. A página verifica novas versões a cada 30 segundos. O registro está em `dist/assets/render-versions.json`. Em outro computador, os arquivos já copiados continuam disponíveis offline; a sincronização com a pasta original é opcional e depende de ela existir.

## Fontes e preservação

- Interior: exportação `EP-RICARDO-JULI-SEGUNDA-SUPERIOR-R0.glb` fornecida pelo responsável pelo projeto.
- Implantação/fachada: `EP-RICARDO-JULI-R0-FACHADA.glb`. O alinhamento com o interior foi confirmado por 18 grupos arquitetônicos; foi aplicada apenas a translação entre as origens.
- Plantas: JPGs originais fornecidos, humanizados com direção do Olho Mágico e ferramenta integrada ImageGen. As bases e os originais estão preservados para comparação.
- Renders do superior: pasta `RENDERS-REALISTAS-DIA-2026-10-26`, atualizada conforme os arquivos chegam.
- Térreo e fachada: seleção da pasta `02.4 - IMAGENS/APRESENTACAO`, conforme o pedido de limitar imagens desses ambientes.
- Conteúdo conceitual: documento `Conceito_Casa_Demarchi_Rasterizze.docx` e leitura visual dos renders. Descrições de materialidade não substituem o memorial executivo.

As maquetes são cópias simplificadas para navegação, com cortes de leitura e redução de detalhes. Os arquivos SketchUp e GLB de origem não foram alterados. A volumetria de implantação e os interiores são vistas conectadas; cada uma preserva a revisão do arquivo correspondente, sem sobrepor móveis de revisões diferentes.
