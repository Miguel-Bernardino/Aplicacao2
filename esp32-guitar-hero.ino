/*
 * ESP32 S3 Guitar Hero Controller
 * 
 * Este código cria um controle Bluetooth com 6 botões para o jogo Guitar Hero.
 * Conecte os botões nos pinos GPIO abaixo.
 * 
 * Bibliotecas necessárias:
 * - BLE (incluída no ESP32)
 * 
 * Como usar:
 * 1. Faça upload deste código para o ESP32 S3
 * 2. Abra o jogo no navegador (Chrome ou Edge)
 * 3. Clique em "Conectar Bluetooth ESP32"
 * 4. Selecione "ESP32 Guitar Hero" na lista
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUIDs para o serviço BLE (mesmos usados no código web)
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Pinos dos 6 botões (ajuste conforme sua conexão)
const int BUTTON_PINS[6] = {
  4,   // Botão 1 (Lane 0) - Vermelho
  5,   // Botão 2 (Lane 1) - Laranja
  6,   // Botão 3 (Lane 2) - Amarelo
  7,   // Botão 4 (Lane 3) - Verde
  15,  // Botão 5 (Lane 4) - Azul
  16   // Botão 6 (Lane 5) - Roxo
};

// LED interno para indicar status
const int LED_PIN = 2;

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint8_t buttonState = 0;
uint8_t lastButtonState = 0;

// Callback para eventos de conexão
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      digitalWrite(LED_PIN, HIGH);
      Serial.println("Cliente conectado!");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      digitalWrite(LED_PIN, LOW);
      Serial.println("Cliente desconectado!");
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando ESP32 Guitar Hero Controller...");

  // Configura LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Configura pinos dos botões com pull-up interno
  for (int i = 0; i < 6; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
  }

  // Inicializa BLE
  BLEDevice::init("ESP32 Guitar Hero");
  
  // Cria servidor BLE
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Cria serviço BLE
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Cria característica para enviar dados dos botões
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  // Adiciona descritor para notificações
  pCharacteristic->addDescriptor(new BLE2902());

  // Inicia o serviço
  pService->start();

  // Inicia advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();
  
  Serial.println("Aguardando conexão Bluetooth...");
  Serial.println("Procure por 'ESP32 Guitar Hero' no seu dispositivo");

  // Pisca LED para indicar que está pronto
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}

void loop() {
  // Lê estado dos botões
  buttonState = 0;
  for (int i = 0; i < 6; i++) {
    // Lógica invertida porque usamos pull-up (LOW = pressionado)
    if (digitalRead(BUTTON_PINS[i]) == LOW) {
      buttonState |= (1 << i); // Define o bit correspondente
      Serial.print("Botão ");
      Serial.print(i + 1);
      Serial.print(" ");
    }
  }

  // Se houver mudança no estado dos botões e estiver conectado
  if (deviceConnected && (buttonState != lastButtonState)) {
    // Envia estado dos botões via BLE
    pCharacteristic->setValue(&buttonState, 1);
    pCharacteristic->notify();
    
    if (buttonState > 0) {
      Serial.println("Pressionado!");
    }
    
    lastButtonState = buttonState;
  }

  // Gerenciamento de reconexão
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("Reiniciando advertising...");
    oldDeviceConnected = deviceConnected;
  }
  
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }

  delay(20); // Pequeno delay para debounce
}
