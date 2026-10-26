# Casa Demarchi — versão web para apresentação

Entrega local em HTML/CSS/JavaScript, com bibliotecas e runtime incluídos. Marca: **Rasterizze Arquitetura, Design e Urbanismo**. Apresentação prevista para 26/10/2026, às 17h, horário de São Paulo.

## Conteúdo entregue

- Página conceito com a narrativa da Etapa 02, materialidade e seções ilustradas dos nove ambientes do pavimento superior.
- Experiência interativa com plantas humanizadas por Olho Mágico / ImageGen, comparação com a planta base, tags, renders ampliáveis e materialidade por ambiente.
- Superior em destaque: 34 imagens finais, incluindo a variação do banho do casal, distribuídas entre suítes, closets, banheiros e circulação.
- Térreo: uma imagem de estar, jantar, living e gourmet; duas imagens da área externa. As duas imagens externas foram substituídas pelos renders atualizados Scene 34 e Scene 35. O closet da Lívia recebeu duas novas imagens e as variantes finais das cenas 15, 22 e 28 também foram incorporadas.
- Implantação: volumetria completa e duas imagens da fachada. O trecho antigo de lazer da exportação da fachada foi recortado e substituído pela área de lazer da revisão atual do modelo R0.
- Tour em escala humana com Lívia, Juli, Ricardo e Luna, avatares 3D estilizados e esguios. Caminhada livre por WASD/setas e botões; Shift acelera. Luna pula com Espaço ou pelo botão Pular.
- Câmeras em primeira pessoa e de acompanhamento. A mudança de pavimento usa o seletor Vista; o percurso guiado também conecta implantação, térreo e superior.
- 15 pontos de exploração e 42 imagens de apresentação vinculadas, com foco editorial no superior.

## Conferência espacial

O GLB R0 atualizado foi lido diretamente. As plantas foram comparadas à maquete em vista superior, com conferência dos conjuntos de suíte, closet e banho, da circulação e da escada. Os pontos da suíte e do banho da Lívia e do closet do casal foram ajustados à posição real no modelo. As plantas base e as imagens originais foram preservadas para consulta.

O GLB da fachada usa outra origem: a translação para o sistema do interior é aproximadamente **−41,156 m no eixo X**, mantendo escala e orientação. Foram encontrados **18 grupos arquitetônicos correspondentes**, com resíduo máximo de aproximadamente **0,00026 m** entre as translações desses grupos. Essa comparação é uma conferência de registro entre arquivos, não um levantamento métrico da obra.

A implantação atual combina a frente da exportação da fachada com o lazer atualizado do R0. O recorte usa interpolação de vértices, normais e UVs na junção, em coordenadas globais; a posição da piscina e dos apoios externos mantém o mesmo sistema do térreo. Os originais SKP e GLB não foram modificados.

## Otimização e funcionamento

O GLB de interiores fornecido tem aproximadamente 548 MiB. Foram criadas cópias de apresentação: maquete superior com cerca de 23 MiB, térreo com cerca de 49 MiB, implantação composta com cerca de 64 MiB e modelo de tour com cerca de 107 MiB. O 3D só é carregado quando solicitado; o tour usa uma cópia mais detalhada para manter paredes e pé-direito completos.

As bibliotecas estão locais, sem fontes ou dependências de CDN. Imagens foram convertidas para WebP, com miniaturas próprias. Cenas estáticas deixam de ser redesenhadas continuamente; durante a caminhada/rotação do tour, o render evita a etapa mais pesada de oclusão ambiente, retomando-a quando a câmera para. A circulação é livre, sem testes de colisão, conforme solicitado.

Os renders finais do superior são sincronizados da pasta indicada enquanto o serviço está aberto neste PC. `render-versions.json` registra a origem e a revisão de cada imagem. O servidor fica restrito ao endereço local 127.0.0.1.

## Conferências realizadas

- Sintaxe dos módulos JavaScript.
- Existência dos renders e das miniaturas referenciados pelos 15 pontos.
- Percurso completo pelos 15 pontos, troca de pavimento, planta/maquete e implantação.
- Galeria, ampliação, setas, materialidade e retorno ao conceito.
- Leitura visual em larguras de 390 px e 680 px, além da tela de desktop.
- Seleção dos quatro personagens, alturas de olhar, mudança de perspectiva e caminhada por teclado.
- Conferência visual da piscina atual na implantação composta e das posições dos pontos no modelo.
- Verificação de console do navegador durante os fluxos principais.

## Uso

Abra **ABRIR APRESENTACAO.vbs** e use F11 ou o botão de tela cheia. Instruções completas em `LEIA-ME.md`.

As representações e avatares são ilustrativos. A materialidade é descrita conforme o conceito e a leitura dos renders; não substitui o memorial executivo. A humanização por IA e a simplificação das cópias 3D não alteram os arquivos técnicos originais.
