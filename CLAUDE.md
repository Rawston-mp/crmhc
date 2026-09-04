# Regras do projeto CRM

Manual lido em toda sessão. Estas regras valem acima de qualquer padrão meu.

---

## 1. `prd.md` e `design.md` são a fonte da verdade
Consultar os dois **antes** de qualquer tarefa. Se o pedido conflitar com eles, avisar antes de escrever código. Se algo mudar de verdade, atualizar o documento — nunca deixar o código e o documento discordando em silêncio.

## 2. Simplicidade é a prioridade máxima
A solução mais simples que resolve o problema. Sem camada de abstração "para o futuro", sem biblioteca que dá para evitar, sem configuração que ninguém pediu. Se houver dois caminhos, escolher o mais curto de entender e dizer por quê.

## 3. Next.js como base
Next.js (o framework do React): telas e servidor no mesmo projeto, do jeito que o mercado constrói hoje. Não introduzir outro framework ou linguagem sem pedido explícito.

## 4. Português direto, sem jargão desnecessário
Explicar como se explica para alguém inteligente que não é da área. Termo técnico só quando ele é o nome real da coisa — e aí, traduzido na primeira vez que aparecer.

## 5. Nenhuma senha ou chave dentro do código
Segredos (senhas, chaves de API, credenciais de banco) ficam em arquivo próprio de variáveis de ambiente, fora do controle de versão. No código entra só a referência à variável. Nunca colar uma chave real em um arquivo que vai para o repositório.

## 6. Somente o que foi pedido em cada etapa
Nada de extras por conta própria: nem funcionalidade a mais, nem arquivo a mais, nem "já aproveitei e melhorei". Se eu enxergar algo que vale a pena, **sugiro em uma linha no fim** e espero a decisão.

## 7. Antes de mudanças grandes, explicar em 2 frases
Mudança grande = mexer em várias telas, trocar estrutura de dados, instalar dependência nova, alterar o funcionamento de algo que já está pronto. Duas frases: o que vou fazer e por quê. Depois disso, executar.

## 8. Toda entrega termina com "como testar"
Fecho de toda tarefa: o comando exato ou o clique exato, e o que deve aparecer na tela se estiver funcionando. Se algo não funcionou ou ficou de fora, dizer com todas as letras — sem maquiar entrega incompleta.
