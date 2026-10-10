# Interface do EngAcademy

Anotações sobre o visual da plataforma. Os valores usados no código ficam em `src/app/globals.css`.

## Cores

| Uso | Cor |
|---|---|
| Fundo das telas | #F5F3FA |
| Texto principal | #1F1B2E |
| Texto secundário | #585170 |
| Cor principal (botões, módulo atual) | #5534C2 |
| Sequência de dias | #FF8A00 |
| XP | #FFC21A |
| Acerto e módulo concluído | #1C7F37 |
| Erro | #C8233A |
| Módulo bloqueado | #E6E2EF |

O laranja e o dourado não são usados em texto, porque não têm contraste suficiente sobre o branco.

## Fonte

Rubik, carregada pelo `next/font`, nos pesos 400 a 800.

## Formas

Botões, cartões e módulos da trilha têm cantos arredondados (12 a 22 px) e uma borda inferior mais escura, que dá volume. Ao clicar, o botão afunda alguns pixels.

## Trilha

Os módulos ficam em zigue-zague, ligados por pedras. As pedras ficam verdes até o último módulo concluído, roxas até o módulo atual e cinza no restante.

## Telas

- Nível, sequência e XP aparecem só na tela inicial.
- Cada lição abre em uma tela própria, com a questão de um lado e o rascunho do outro.

## Acessibilidade

- Texto com contraste de pelo menos 4,5:1.
- O estado do módulo aparece escrito, e não só pela cor (RNF-004).
- Com o movimento reduzido ativado no sistema, as animações são desligadas.
