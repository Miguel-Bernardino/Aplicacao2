# Pasta de Áudios para Guitar Hero

Coloque aqui os arquivos de áudio das músicas do jogo.

## Formatos suportados:
- `.mp3` (recomendado)
- `.ogg`
- `.wav`

## Como adicionar uma música:

1. **Coloque o arquivo de áudio nesta pasta**
   - Exemplo: `minha-musica.mp3`

2. **Atualize o código em `app/routes/guitar-hero.tsx`**
   
   Adicione no array `SONGS`:
   ```tsx
   {
     name: "Minha Música",
     bpm: 120,
     audioUrl: "/audio/minha-musica.mp3",
     notes: [
       { time: 0, lane: 0 },
       { time: 500, lane: 2 },
       // ... suas notas
     ]
   }
   ```

## Exemplo de estrutura:
```
public/
  audio/
    demo-rock.mp3
    metal-song.mp3
    pop-music.ogg
```

## Dicas:
- Use áudios com boa qualidade mas não muito grandes (< 5MB)
- Prefira MP3 com bitrate de 128-192 kbps
- Normalize o volume dos áudios para consistência
