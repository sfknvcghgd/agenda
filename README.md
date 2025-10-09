# Agenda de Tarefas com Notificações

## 1. Lógica de funcionamento
Este projeto é um aplicativo de agenda de tarefas que permite ao usuário organizar suas atividades diárias.  
A lógica é a seguinte:

- O usuário pode adicionar tarefas para qualquer dia da semana, definindo a hora e os minutos.
- Cada tarefa adicionada é automaticamente agendada para gerar uma **notificação** no dia e horário definidos, lembrando o usuário da atividade.
- O usuário pode **marcar uma tarefa como concluída** ou **remover** tarefas.
- É possível filtrar as tarefas por dia da semana, clicando nos botões de cada dia, para visualizar apenas as tarefas daquele dia.
- A lista de tarefas é ordenada pelo horário, para que seja fácil visualizar a sequência das atividades.

## 2. Linguagens e ferramentas
O projeto foi desenvolvido utilizando **JavaScript/TypeScript** com **React Native**:

- **VSCode:** É o editor de código onde o projeto é criado e editado.
- **React Native:** Um framework que permite criar aplicativos móveis para Android e iOS usando JavaScript.
- **Expo Go:** Um aplicativo que permite executar o código do React Native diretamente no celular, sem precisar instalar nada complicado.
- **Expo Notifications:** Biblioteca usada para criar e gerenciar notificações no aplicativo.

Não é necessário ter conhecimento avançado em programação para usar o app; ele foi feito para ser intuitivo.

## 3. Execução do projeto
Para executar o aplicativo, siga estes passos:

1. **Instale o Node.js** e o **VSCode** no seu computador, se ainda não tiver.
2. **Baixe o projeto** ou clone do repositório.
3. Abra o projeto no **VSCode**.
4. Abra o terminal dentro do VSCode e execute:
   ```bash
   npx create-expo-app@latest Cronograma
   cd Cronograma
   npm run reset-project
   npm install expo-notifications
   npx expo start
