/**
 * Sistema de Monitoramento de Vagas de Estacionamento
 *
 * Hardware: ESP32 + 1x HC-SR04
 * - Teto: 4 metros (400 cm)
 * - Carro detectado: distância < 200 cm
 * - Vaga livre: distância >= 200 cm
 *
 * Envia JSON via HTTP POST a cada 2 segundos:
 * {"vagas": [true, false, true, true, false, true, false]}
 * true  = vaga DISPONÍVEL
 * false = vaga OCUPADA
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ─── Configurações de Rede ──────────────────────────────────────────────────
const char* SSID       = "SEU_WIFI_SSID";
const char* PASSWORD   = "SUA_SENHA_WIFI";
const char* SERVER_URL = "http://SEU_SERVIDOR/api/vagas";

// ─── Modo Teste (sem WiFi / sem HTTP) ──────────────────────────────────────
// true  → usa apenas os LEDs, sem conectar ao WiFi nem enviar dados
// false → comportamento normal (WiFi + HTTP)
const bool MODO_TESTE = true;

// ─── Configurações do Sistema ───────────────────────────────────────────────
const int           NUM_VAGAS        = 1;
const long          DISTANCIA_CARRO  = 200;  // cm — abaixo disto há carro
const long          DISTANCIA_TETO   = 400;  // cm — leitura máxima válida
const unsigned long INTERVALO_MS     = 2000; // ms entre cada ciclo de leitura

// ─── Pinagem dos Sensores HC-SR04 ───────────────────────────────────────────
// Vaga:              1
const int TRIG[NUM_VAGAS] = { 4};
const int ECHO[NUM_VAGAS] = {13};

// ─── Pinagem dos LEDs de Status ─────────────────────────────────────────────
const int LED_VERDE    = 25;  // vaga DISPONÍVEL
const int LED_VERMELHO = 26;  // vaga OCUPADA

unsigned long ultimaLeitura = 0;

// ─── Setup ──────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500); // aguarda serial estabilizar

  Serial.println("\n======================================");
  Serial.println("[BOOT] ESP32 iniciado!");
  Serial.printf( "[BOOT] Chip: %s | Rev: %d\n", ESP.getChipModel(), ESP.getChipRevision());
  Serial.printf( "[BOOT] CPU: %d MHz | Flash: %d KB\n", ESP.getCpuFreqMHz(), ESP.getFlashChipSize() / 1024);
  Serial.printf( "[BOOT] Free heap: %d bytes\n", ESP.getFreeHeap());
  Serial.println("======================================");

  Serial.println("[INIT] Configurando pinos dos sensores...");
  for (int i = 0; i < NUM_VAGAS; i++) {
    pinMode(TRIG[i], OUTPUT);
    pinMode(ECHO[i], INPUT);
    digitalWrite(TRIG[i], LOW);
    Serial.printf("[INIT] Sensor %d: TRIG=%d | ECHO=%d\n", i + 1, TRIG[i], ECHO[i]);
  }

  Serial.println("[INIT] Configurando pinos dos LEDs...");
  pinMode(LED_VERDE,    OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);
  digitalWrite(LED_VERDE,    LOW);
  digitalWrite(LED_VERMELHO, LOW);
  Serial.printf("[INIT] LED Verde=%d | LED Vermelho=%d\n", LED_VERDE, LED_VERMELHO);

  if (MODO_TESTE) {
    Serial.println("[MODO] MODO_TESTE ativo — WiFi e HTTP desabilitados.");
    Serial.println("[MODO] Sistema pronto para leitura local.");
    Serial.println("======================================\n");
    return;
  }

  Serial.printf("[WiFi] Conectando a: %s\n", SSID);
  WiFi.begin(SSID, PASSWORD);

  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    tentativas++;
    if (tentativas % 20 == 0) {
      Serial.printf("\n[WiFi] Ainda tentando... (%d s)\n", tentativas / 2);
    }
  }

  Serial.println("\n[WiFi] Conectado com sucesso!");
  Serial.println("[WiFi] IP: " + WiFi.localIP().toString());
  Serial.printf( "[WiFi] RSSI: %d dBm\n", WiFi.RSSI());
  Serial.printf( "[HTTP] Servidor alvo: %s\n", SERVER_URL);
  Serial.println("[INIT] Sistema pronto!");
  Serial.println("======================================\n");
}

// ─── Mede distância em cm via HC-SR04 ───────────────────────────────────────
long medirDistancia(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Timeout de 25 ms ≈ leitura máxima de ~4,25 m
  long duracao = pulseIn(echoPin, HIGH, 25000);

  if (duracao == 0) {
    return DISTANCIA_TETO; // timeout → sem obstáculo (vaga livre)
  }

  return (long)(duracao * 0.01715); // duracao(µs) * (0.0343 cm/µs / 2)
}

// ─── Determina se a vaga está disponível ────────────────────────────────────
bool vagaDisponivel(long distancia) {
  return distancia >= DISTANCIA_CARRO && distancia <= DISTANCIA_TETO;
}

// ─── Monta e envia JSON ao servidor ─────────────────────────────────────────
void enviarDados(bool vagas[]) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Desconectado. Tentando reconectar...");
    WiFi.reconnect();
    return;
  }

  // Monta payload: {"vagas":[true,false,...]}
  String json = "{\"vagas\":[";
  for (int i = 0; i < NUM_VAGAS; i++) {
    json += vagas[i] ? "true" : "false";
    if (i < NUM_VAGAS - 1) {
      json += ",";
    }
  }
  json += "]}";

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(json);

  if (httpCode > 0) {
    Serial.printf("[HTTP] Enviado com sucesso. Código: %d\n", httpCode);
    Serial.println("[HTTP] Payload: " + json);
  } else {
    Serial.printf("[HTTP] Falha no envio. Erro: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

// ─── Loop Principal ─────────────────────────────────────────────────────────
void loop() {
  unsigned long agora = millis();

  if (agora - ultimaLeitura < INTERVALO_MS) {
    return;
  }

  ultimaLeitura = agora;

  bool statusVagas[NUM_VAGAS];

  Serial.println("\n========== Leitura das Vagas ==========");

  for (int i = 0; i < NUM_VAGAS; i++) {
    long distancia = medirDistancia(TRIG[i], ECHO[i]);
    statusVagas[i] = vagaDisponivel(distancia);

    Serial.printf(
      "Vaga %d | %4ld cm | %s\n",
      i + 1,
      distancia,
      statusVagas[i] ? "DISPONIVEL" : "OCUPADA  "
    );

    delay(50); // aguarda entre sensores para evitar interferência de eco
  }

  // Atualiza LEDs com o status da vaga 1
  digitalWrite(LED_VERDE,    statusVagas[0] ? HIGH : LOW);
  digitalWrite(LED_VERMELHO, statusVagas[0] ? LOW  : HIGH);

  Serial.printf("[LED] Verde=%s | Vermelho=%s\n",
    statusVagas[0] ? "ACESO" : "apagado",
    statusVagas[0] ? "apagado" : "ACESO"
  );

  if (!MODO_TESTE) {
    enviarDados(statusVagas);
  }
}
