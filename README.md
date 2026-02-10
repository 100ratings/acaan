# Tamariz Trainer

Um webapp simples e eficiente para treinar a mnemônica de Tamariz, sem dependências de build ou instalação.

## 🎯 O que é?

**Tamariz Trainer** é um flashcard interativo que ajuda você a memorizar a ordem das 52 cartas da mnemônica de Tamariz. A aplicação:

- Gera combinações aleatórias de **carta + posição** (2704 possibilidades)
- Mostra o **peek correto** (qual carta você deveria cortar)
- Rastreia seu **progresso** entre sessões
- Permite **rotacionar o baralho** (mudar a carta do topo)
- Funciona **100% offline** com localStorage

## 🚀 Como usar?

### Opção 1: Abrir localmente
1. Baixe ou clone este repositório
2. Abra o arquivo `index.html` no navegador
3. Pronto! A aplicação está funcionando

### Opção 2: Usar em um servidor
Se quiser servir via HTTP:
```bash
# Python 3
python -m http.server 8000

# Node.js (com http-server)
npx http-server

# PHP
php -S localhost:8000
```

Depois acesse `http://localhost:8000`

## 📁 Estrutura de arquivos

```
tamariz-trainer/
├── index.html      # Estrutura HTML
├── styles.css      # Estilos CSS
├── app.js          # Lógica JavaScript
└── README.md       # Este arquivo
```

## 🎮 Como funciona?

### Flashcard
- **Carta**: Exibida em emoji com nome em português
- **Número**: Posição aleatória (1-52)
- **Peek**: Clique para ver qual carta você deveria cortar

### Seletor de Cartas
- Clique no botão "Topo: 4♣" para abrir o seletor
- Escolha uma carta para rotacionar o baralho
- As posições serão recalculadas automaticamente

### Progresso
- Cada combinação é rastreada
- Progresso é salvo no localStorage
- Ao recarregar a página, continua de onde parou

### Reset
- Clique em "Resetar Tudo" para começar do zero
- Limpa o localStorage e reinicia o progresso

## 💾 Armazenamento

O progresso é salvo em `localStorage` sob a chave `tamariz_trainer_state`:
```json
{
  "usedCombinations": ["4♣:1:4♣", "2♥:15:4♣", ...],
  "topCard": "4♣"
}
```

A cada 100 combinações, o estado é automaticamente salvo.

## 🔧 Tecnologia

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com gradientes e animações
- **JavaScript Vanilla**: Sem dependências, sem build tools
- **LocalStorage API**: Persistência de dados

## 📱 Compatibilidade

- ✅ Chrome/Edge (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)
- ✅ Dispositivos móveis (iOS/Android)

## 🎨 Design

- Interface limpa e intuitiva
- Tema claro com gradientes azuis
- Responsivo para desktop e mobile
- Animações suaves

## 📝 Notas

- A mnemônica de Tamariz é uma sequência de 52 cartas em ordem específica
- Cada posição (1-52) corresponde a uma carta na sequência
- Ao rotacionar o baralho (mudar o topo), as posições são recalculadas
- Não há limite de combinações - você pode treinar infinitamente

## 🤝 Contribuições

Sinta-se livre para fazer fork, modificar e melhorar!

## 📄 Licença

MIT - Use livremente para fins pessoais e comerciais.

---

**Desenvolvido para memoristas e entusiastas de cartas!** 🎴
