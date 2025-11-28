# Guitar Hero com Web Bluetooth e ESP32 S3

Jogo estilo Guitar Hero com 6 botões controlados via **Web Bluetooth** conectando seu computador/Android ao **ESP32 S3**.

## 🎮 Funcionalidades

- ✅ 6 botões/lanes coloridos
- ✅ Notas caindo em tempo real
- ✅ Sistema de pontuação e combo
- ✅ Comunicação via **Web Bluetooth API**
- ✅ Suporte para teclado (modo teste)
- ✅ Interface responsiva para desktop e mobile
- ✅ Código Arduino completo para ESP32 S3

## 🚀 Como Jogar

### No Navegador (Web)

1. Execute o projeto:
   ```bash
   npm install
   npm run dev
   ```

2. Acesse no navegador: `http://localhost:5173/guitar-hero`

3. Clique em **"Conectar Bluetooth ESP32"** (ou use o teclado para testar)

4. Selecione **"ESP32 Guitar Hero"** na lista de dispositivos

5. Clique em **"Iniciar Jogo"**

### Controles de Teclado (Teste)
- Botão 1 (Vermelho): **A**
- Botão 2 (Laranja): **S**
- Botão 3 (Amarelo): **D**
- Botão 4 (Verde): **J**
- Botão 5 (Azul): **K**
- Botão 6 (Roxo): **L**

## 🔧 Configuração do ESP32 S3

### Hardware Necessário
- ESP32 S3
- 6 botões push (normalmente abertos)
- Fios jumper
- Protoboard (opcional)

### Conexões dos Botões

Conecte cada botão entre um pino GPIO e GND:

| Botão | Cor    | Pino GPIO | Conexão         |
|-------|--------|-----------|-----------------|
| 1     | 🔴 Vermelho | GPIO 4    | Botão → GND |
| 2     | 🟠 Laranja  | GPIO 5    | Botão → GND |
| 3     | 🟡 Amarelo  | GPIO 6    | Botão → GND |
| 4     | 🟢 Verde    | GPIO 7    | Botão → GND |
| 5     | 🔵 Azul     | GPIO 15   | Botão → GND |
| 6     | 🟣 Roxo     | GPIO 16   | Botão → GND |

**Nota:** O código usa `INPUT_PULLUP`, então os botões devem conectar o pino ao GND quando pressionados.

### Upload do Código

1. Instale o [Arduino IDE](https://www.arduino.cc/en/software)

2. Instale o suporte para ESP32:
   - Vá em **File → Preferences**
   - Em **Additional Board Manager URLs**, adicione:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Vá em **Tools → Board → Boards Manager**
   - Procure por "esp32" e instale

3. Selecione a placa:
   - **Tools → Board → ESP32 Arduino → ESP32S3 Dev Module**

4. Abra o arquivo `esp32-guitar-hero.ino`

5. Conecte o ESP32 via USB e selecione a porta em **Tools → Port**

6. Clique em **Upload**

### Teste do ESP32

Após o upload, abra o **Serial Monitor** (115200 baud) e você verá:
```
Iniciando ESP32 Guitar Hero Controller...
Aguardando conexão Bluetooth...
Procure por 'ESP32 Guitar Hero' no seu dispositivo
```

## 🌐 Compatibilidade Web Bluetooth

### Navegadores Suportados
- ✅ Chrome (Desktop e Android)
- ✅ Edge (Desktop e Android)
- ✅ Opera (Desktop e Android)
- ❌ Firefox (não suporta Web Bluetooth)
- ❌ Safari (não suporta Web Bluetooth)

### Sistemas Operacionais
- ✅ Windows 10/11
- ✅ Android 6.0+
- ✅ macOS (Chrome/Edge)
- ✅ Linux (com BlueZ)

**Importante:** Para usar Bluetooth, o site deve estar em:
- `localhost` (desenvolvimento)
- HTTPS (produção)

## 📱 Como Conectar

1. Certifique-se que o Bluetooth está ativado no seu dispositivo
2. Ligue o ESP32 S3
3. Abra o jogo no navegador suportado
4. Clique em "Conectar Bluetooth ESP32"
5. Selecione "ESP32 Guitar Hero" na janela
6. Aguarde a conexão (LED do ESP32 acenderá)

## 🎯 Gameplay

- Notas caem pelas 6 lanes coloridas
- Pressione o botão correspondente quando a nota estiver na **zona de acerto** (área tracejada na parte inferior)
- Cada acerto aumenta sua pontuação e combo
- Errar uma nota reseta seu combo
- Quanto maior o combo, mais pontos você ganha!

## 🛠️ Personalização

### Ajustar Dificuldade

No arquivo `guitar-hero.tsx`, modifique:

```typescript
const NOTE_SPEED = 2; // Velocidade das notas (maior = mais difícil)
const SPAWN_INTERVAL = 1000; // Intervalo entre notas em ms (menor = mais difícil)
const HIT_ZONE = 50; // Tamanho da zona de acerto (menor = mais difícil)
```

### Mudar Pinos do ESP32

No arquivo `esp32-guitar-hero.ino`, modifique:

```cpp
const int BUTTON_PINS[6] = {4, 5, 6, 7, 15, 16}; // Seus pinos
```

### Alterar UUIDs Bluetooth

Se tiver conflito com outros dispositivos, mude os UUIDs em ambos os arquivos:
- `guitar-hero.tsx` (linha 49-50)
- `esp32-guitar-hero.ino` (linha 19-20)

## 🐛 Solução de Problemas

### "Bluetooth connection failed"
- Verifique se o Bluetooth está ativado
- Certifique-se que o ESP32 está ligado
- Use Chrome ou Edge
- Recarregue a página

### Botões não respondem
- Verifique as conexões dos botões
- Abra o Serial Monitor e veja se os botões são detectados
- Verifique se os pinos GPIO estão corretos

### Notas não aparecem
- Clique em "Iniciar Jogo"
- Recarregue a página se necessário

## 📦 Tecnologias Usadas

- React 19
- TypeScript
- Web Bluetooth API
- Vite
- Arduino (ESP32)

## 📄 Licença

Livre para uso pessoal e educacional.

---

**Divirta-se jogando! 🎸🎮**
