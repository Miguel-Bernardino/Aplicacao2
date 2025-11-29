import { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/guitar-hero.css';

interface Note {
  id: number;
  lane: number; // 0-5 for 6 buttons
  position: number; // Y position
  timestamp: number;
}

interface SongNote {
  time: number; // Tempo em ms quando a nota deve ser tocada
  lane: number; // 0-5
}

interface Song {
  name: string;
  bpm: number;
  audioUrl: string;
  notes: SongNote[];
}

const LANES = 6;
const NOTE_SPEED = 3; // pixels per frame
const HIT_ZONE = 200; // pixels from bottom where notes can be hit
const SPAWN_INTERVAL = 1000; // ms between notes (modo aleatório)
const HIT_ZONE_BOTTOM = 600; // Position of hit zone from top
const SCROLL_TIME = 2000; // Tempo em ms que a nota leva para cair

// Músicas disponíveis
const SONGS: Song[] = [
  {
    name: "One Last Breath - Rock",
    bpm: 120,
    audioUrl: "/audio/One_Last_Breath.mp3", // Coloque o arquivo em public/audio/
    notes: [
      // Intro (0-4s)
      { time: 0, lane: 0 },
      { time: 500, lane: 2 },
      { time: 1000, lane: 4 },
      { time: 1500, lane: 5 },
      
      // Verso 1 (4-8s)
      { time: 2000, lane: 0 },
      { time: 2000, lane: 3 },
      { time: 2500, lane: 1 },
      { time: 3000, lane: 2 },
      { time: 3500, lane: 4 },
      
      // Refrão (8-12s)
      { time: 4000, lane: 0 },
      { time: 4000, lane: 5 },
      { time: 4300, lane: 1 },
      { time: 4600, lane: 2 },
      { time: 4900, lane: 3 },
      { time: 5200, lane: 4 },
      
      // Break (12-16s)
      { time: 6000, lane: 2 },
      { time: 6500, lane: 3 },
      { time: 7000, lane: 1 },
      { time: 7000, lane: 4 },
      { time: 7500, lane: 0 },
      { time: 7500, lane: 5 },
      
      // Final (16-20s)
      { time: 8000, lane: 0 },
      { time: 8000, lane: 2 },
      { time: 8000, lane: 4 },
      { time: 8500, lane: 1 },
      { time: 8500, lane: 3 },
      { time: 8500, lane: 5 },
      { time: 9000, lane: 0 },
      { time: 9000, lane: 2 },
      { time: 9000, lane: 4 },
    ],

  },
  {
    name: "HINO DO MELHOR TIME DA BAHIA",
    bpm: 100,
    audioUrl: "/audio/HINO_DO_BAHIA.mp3",
    notes: [
      // Intro - 0-10s
      { time: 0, lane: 2 },
      { time: 600, lane: 2 },
      { time: 1200, lane: 3 },
      { time: 1800, lane: 3 },
      { time: 2400, lane: 1 },
      { time: 3000, lane: 1 },
      { time: 3600, lane: 4 },
      { time: 4200, lane: 4 },
      { time: 4800, lane: 0 },
      { time: 5400, lane: 5 },
      { time: 6000, lane: 2 },
      { time: 6600, lane: 3 },
      { time: 7200, lane: 1 },
      { time: 7800, lane: 4 },
      { time: 8400, lane: 0 },
      { time: 9000, lane: 5 },
      { time: 9600, lane: 2 },
      
      // Primeira estrofe - 10-30s
      { time: 10200, lane: 0 },
      { time: 10800, lane: 1 },
      { time: 11400, lane: 2 },
      { time: 12000, lane: 3 },
      { time: 12600, lane: 4 },
      { time: 13200, lane: 5 },
      { time: 13800, lane: 0 },
      { time: 14400, lane: 1 },
      { time: 15000, lane: 2 },
      { time: 15600, lane: 3 },
      { time: 16200, lane: 4 },
      { time: 16800, lane: 5 },
      { time: 17400, lane: 0 },
      { time: 18000, lane: 1 },
      { time: 18600, lane: 2 },
      { time: 19200, lane: 3 },
      { time: 19800, lane: 4 },
      { time: 20400, lane: 5 },
      { time: 21000, lane: 0 },
      { time: 21600, lane: 1 },
      { time: 22200, lane: 2 },
      { time: 22800, lane: 3 },
      { time: 23400, lane: 4 },
      { time: 24000, lane: 5 },
      { time: 24600, lane: 0 },
      { time: 25200, lane: 1 },
      { time: 25800, lane: 2 },
      { time: 26400, lane: 3 },
      { time: 27000, lane: 4 },
      { time: 27600, lane: 5 },
      { time: 28200, lane: 0 },
      { time: 28800, lane: 1 },
      { time: 29400, lane: 2 },
      
      // Segunda estrofe - 30-50s
      { time: 30000, lane: 3 },
      { time: 30600, lane: 4 },
      { time: 31200, lane: 5 },
      { time: 31800, lane: 0 },
      { time: 32400, lane: 1 },
      { time: 33000, lane: 2 },
      { time: 33600, lane: 3 },
      { time: 34200, lane: 4 },
      { time: 34800, lane: 5 },
      { time: 35400, lane: 0 },
      { time: 36000, lane: 1 },
      { time: 36600, lane: 2 },
      { time: 37200, lane: 3 },
      { time: 37800, lane: 4 },
      { time: 38400, lane: 5 },
      { time: 39000, lane: 0 },
      { time: 39600, lane: 1 },
      { time: 40200, lane: 2 },
      { time: 40800, lane: 3 },
      { time: 41400, lane: 4 },
      { time: 42000, lane: 5 },
      { time: 42600, lane: 0 },
      { time: 43200, lane: 1 },
      { time: 43800, lane: 2 },
      { time: 44400, lane: 3 },
      { time: 45000, lane: 4 },
      { time: 45600, lane: 5 },
      { time: 46200, lane: 0 },
      { time: 46800, lane: 1 },
      { time: 47400, lane: 2 },
      { time: 48000, lane: 3 },
      { time: 48600, lane: 4 },
      { time: 49200, lane: 5 },
      { time: 49800, lane: 0 },
      
      // Refrão - 50-70s
      { time: 50400, lane: 1 },
      { time: 51000, lane: 2 },
      { time: 51600, lane: 3 },
      { time: 52200, lane: 4 },
      { time: 52800, lane: 5 },
      { time: 53400, lane: 0 },
      { time: 54000, lane: 1 },
      { time: 54600, lane: 2 },
      { time: 55200, lane: 3 },
      { time: 55800, lane: 4 },
      { time: 56400, lane: 5 },
      { time: 57000, lane: 0 },
      { time: 57600, lane: 1 },
      { time: 58200, lane: 2 },
      { time: 58800, lane: 3 },
      { time: 59400, lane: 4 },
      { time: 60000, lane: 5 },
      { time: 60600, lane: 0 },
      { time: 61200, lane: 1 },
      { time: 61800, lane: 2 },
      { time: 62400, lane: 3 },
      { time: 63000, lane: 4 },
      { time: 63600, lane: 5 },
      { time: 64200, lane: 0 },
      { time: 64800, lane: 1 },
      { time: 65400, lane: 2 },
      { time: 66000, lane: 3 },
      { time: 66600, lane: 4 },
      { time: 67200, lane: 5 },
      { time: 67800, lane: 0 },
      { time: 68400, lane: 1 },
      { time: 69000, lane: 2 },
      { time: 69600, lane: 3 },
      
      // Terceira parte - 70-90s
      { time: 70200, lane: 4 },
      { time: 70800, lane: 5 },
      { time: 71400, lane: 0 },
      { time: 72000, lane: 1 },
      { time: 72600, lane: 2 },
      { time: 73200, lane: 3 },
      { time: 73800, lane: 4 },
      { time: 74400, lane: 5 },
      { time: 75000, lane: 0 },
      { time: 75600, lane: 1 },
      { time: 76200, lane: 2 },
      { time: 76800, lane: 3 },
      { time: 77400, lane: 4 },
      { time: 78000, lane: 5 },
      { time: 78600, lane: 0 },
      { time: 79200, lane: 1 },
      { time: 79800, lane: 2 },
      { time: 80400, lane: 3 },
      { time: 81000, lane: 4 },
      { time: 81600, lane: 5 },
      { time: 82200, lane: 0 },
      { time: 82800, lane: 1 },
      { time: 83400, lane: 2 },
      { time: 84000, lane: 3 },
      { time: 84600, lane: 4 },
      { time: 85200, lane: 5 },
      { time: 85800, lane: 0 },
      { time: 86400, lane: 1 },
      { time: 87000, lane: 2 },
      { time: 87600, lane: 3 },
      { time: 88200, lane: 4 },
      { time: 88800, lane: 5 },
      { time: 89400, lane: 0 },
      
      // Quarta parte - 90-110s
      { time: 90000, lane: 1 },
      { time: 90600, lane: 2 },
      { time: 91200, lane: 3 },
      { time: 91800, lane: 4 },
      { time: 92400, lane: 5 },
      { time: 93000, lane: 0 },
      { time: 93600, lane: 1 },
      { time: 94200, lane: 2 },
      { time: 94800, lane: 3 },
      { time: 95400, lane: 4 },
      { time: 96000, lane: 5 },
      { time: 96600, lane: 0 },
      { time: 97200, lane: 1 },
      { time: 97800, lane: 2 },
      { time: 98400, lane: 3 },
      { time: 99000, lane: 4 },
      { time: 99600, lane: 5 },
      { time: 100200, lane: 0 },
      { time: 100800, lane: 1 },
      { time: 101400, lane: 2 },
      { time: 102000, lane: 3 },
      { time: 102600, lane: 4 },
      { time: 103200, lane: 5 },
      { time: 103800, lane: 0 },
      { time: 104400, lane: 1 },
      { time: 105000, lane: 2 },
      { time: 105600, lane: 3 },
      { time: 106200, lane: 4 },
      { time: 106800, lane: 5 },
      { time: 107400, lane: 0 },
      { time: 108000, lane: 1 },
      { time: 108600, lane: 2 },
      { time: 109200, lane: 3 },
      { time: 109800, lane: 4 },
      
      // Quinta parte - 110-130s
      { time: 110400, lane: 5 },
      { time: 111000, lane: 0 },
      { time: 111600, lane: 1 },
      { time: 112200, lane: 2 },
      { time: 112800, lane: 3 },
      { time: 113400, lane: 4 },
      { time: 114000, lane: 5 },
      { time: 114600, lane: 0 },
      { time: 115200, lane: 1 },
      { time: 115800, lane: 2 },
      { time: 116400, lane: 3 },
      { time: 117000, lane: 4 },
      { time: 117600, lane: 5 },
      { time: 118200, lane: 0 },
      { time: 118800, lane: 1 },
      { time: 119400, lane: 2 },
      { time: 120000, lane: 3 },
      { time: 120600, lane: 4 },
      { time: 121200, lane: 5 },
      { time: 121800, lane: 0 },
      { time: 122400, lane: 1 },
      { time: 123000, lane: 2 },
      { time: 123600, lane: 3 },
      { time: 124200, lane: 4 },
      { time: 124800, lane: 5 },
      { time: 125400, lane: 0 },
      { time: 126000, lane: 1 },
      { time: 126600, lane: 2 },
      { time: 127200, lane: 3 },
      { time: 127800, lane: 4 },
      { time: 128400, lane: 5 },
      { time: 129000, lane: 0 },
      { time: 129600, lane: 1 },
      
      // Final - 130-164s (2:44)
      { time: 130200, lane: 2 },
      { time: 130800, lane: 3 },
      { time: 131400, lane: 4 },
      { time: 132000, lane: 5 },
      { time: 132600, lane: 0 },
      { time: 133200, lane: 1 },
      { time: 133800, lane: 2 },
      { time: 134400, lane: 3 },
      { time: 135000, lane: 4 },
      { time: 135600, lane: 5 },
      { time: 136200, lane: 0 },
      { time: 136800, lane: 1 },
      { time: 137400, lane: 2 },
      { time: 138000, lane: 3 },
      { time: 138600, lane: 4 },
      { time: 139200, lane: 5 },
      { time: 139800, lane: 0 },
      { time: 140400, lane: 1 },
      { time: 141000, lane: 2 },
      { time: 141600, lane: 3 },
      { time: 142200, lane: 4 },
      { time: 142800, lane: 5 },
      { time: 143400, lane: 0 },
      { time: 144000, lane: 1 },
      { time: 144600, lane: 2 },
      { time: 145200, lane: 3 },
      { time: 145800, lane: 4 },
      { time: 146400, lane: 5 },
      { time: 147000, lane: 0 },
      { time: 147600, lane: 1 },
      { time: 148200, lane: 2 },
      { time: 148800, lane: 3 },
      { time: 149400, lane: 4 },
      { time: 150000, lane: 5 },
      { time: 150600, lane: 0 },
      { time: 151200, lane: 1 },
      { time: 151800, lane: 2 },
      { time: 152400, lane: 3 },
      { time: 153000, lane: 4 },
      { time: 153600, lane: 5 },
      { time: 154200, lane: 0 },
      { time: 154800, lane: 1 },
      { time: 155400, lane: 2 },
      { time: 156000, lane: 3 },
      { time: 156600, lane: 4 },
      { time: 157200, lane: 5 },
      { time: 157800, lane: 0 },
      { time: 158400, lane: 1 },
      { time: 159000, lane: 2 },
      { time: 159600, lane: 3 },
      { time: 160200, lane: 4 },
      { time: 160800, lane: 5 },
      { time: 161400, lane: 0 },
      { time: 162000, lane: 1 },
      { time: 162600, lane: 2 },
      { time: 163200, lane: 3 },
      { time: 163800, lane: 4 },
      { time: 164000, lane: 5 },
    ], 
  }
];

export default function GuitarHero() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pressedButtons, setPressedButtons] = useState<Set<number>>(new Set());
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>("guest");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [gameMode, setGameMode] = useState<'random' | 'song'>('random');
  const noteIdCounter = useRef(0);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastSpawnRef = useRef(0);
  const bluetoothCharacteristic = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const processedButtons = useRef<Set<number>>(new Set());
  const gameStartedRef = useRef(false);
  const comboRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const songStartTime = useRef(0);
  const spawnedNotes = useRef<Set<number>>(new Set());
  const resultSentRef = useRef(false);

  // Sync refs with state
  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]);

  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  const laneColors = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];

  // Generate random notes
  const spawnNote = () => {
    const lane = Math.floor(Math.random() * LANES);
    const newNote: Note = {
      id: noteIdCounter.current++,
      lane,
      position: 0,
      timestamp: Date.now(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  // Connect to ESP32 via Web Bluetooth
  const connectBluetooth = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'ESP32' }],
        optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
      const characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
      
      bluetoothCharacteristic.current = characteristic;

      // Listen for button presses from ESP32
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleBluetoothData);

      setIsBluetoothConnected(true);
      console.log('Bluetooth connected!');
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      alert('Erro ao conectar Bluetooth. Certifique-se que o ESP32 está ligado.');
    }
  };

  // Handle data from ESP32
  const handleBluetoothData = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    const buttonState = value.getUint8(0); // Byte with button states (bits 0-5)
    const pressed = new Set<number>();

    for (let i = 0; i < LANES; i++) {
      if (buttonState & (1 << i)) {
        pressed.add(i);
        // Only check hit if button wasn't already pressed
        if (!processedButtons.current.has(i)) {
          checkHit(i);
          processedButtons.current.add(i);
        }
      }
    }

    // Remove buttons that are no longer pressed
    for (const btn of processedButtons.current) {
      if (!pressed.has(btn)) {
        processedButtons.current.delete(btn);
      }
    }

    setPressedButtons(pressed);
  };

  // Check if a note was hit
  const checkHit = useCallback((lane: number) => {
    console.log(`🎮 Button pressed: Lane ${lane + 1}, Game started: ${gameStartedRef.current}`);
    
    if (!gameStartedRef.current) {
      console.log('⚠️ Game not started yet!');
      return;
    }

    const hitZoneTop = HIT_ZONE_BOTTOM - HIT_ZONE;
    const hitZoneBottom = HIT_ZONE_BOTTOM + 20;

    setNotes(prev => {
      console.log(`📝 Current notes:`, prev.map(n => `Lane ${n.lane + 1} at ${n.position}px`));
      
      const notesInLane = prev.filter(note => note.lane === lane);
      console.log(`🎯 Notes in Lane ${lane + 1}:`, notesInLane.map(n => `${n.position}px`));
      console.log(`📍 Hit zone: ${hitZoneTop}px - ${hitZoneBottom}px`);
      
      // Find the closest note in the hit zone
      const eligibleNotes = prev.filter(
        note => note.lane === lane && note.position >= hitZoneTop && note.position <= hitZoneBottom
      );

      if (eligibleNotes.length > 0) {
        // Get the note closest to the center of hit zone
        const hitZoneCenter = (hitZoneTop + hitZoneBottom) / 2;
        const hitNote = eligibleNotes.reduce((closest, note) => {
          const closestDist = Math.abs(closest.position - hitZoneCenter);
          const noteDist = Math.abs(note.position - hitZoneCenter);
          return noteDist < closestDist ? note : closest;
        });

        const points = 100 * (comboRef.current + 1);
        console.log(`✓ HIT! Lane ${lane + 1}, Note at ${hitNote.position}px, Score +${points}`);
        setScore(s => s + points);
        setCombo(c => c + 1);
        return prev.filter(n => n.id !== hitNote.id);
      } else {
        console.log(`✗ MISS! Lane ${lane + 1}, no note in hit zone`);
      }
      
      return prev;
    });
  }, []);

  // Handle keyboard input (for testing without ESP32)
  useEffect(() => {
    const keyMap: { [key: string]: number } = {
      'a': 0, 's': 1, 'd': 2, 'j': 3, 'k': 4, 'l': 5,
      'A': 0, 'S': 1, 'D': 2, 'J': 3, 'K': 4, 'L': 5,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const lane = keyMap[e.key];
      if (lane !== undefined && !pressedButtons.has(lane)) {
        setPressedButtons(prev => new Set(prev).add(lane));
        checkHit(lane);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const lane = keyMap[e.key];
      if (lane !== undefined) {
        setPressedButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(lane);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedButtons, checkHit]);

  // Spawn notes for song mode
  const spawnSongNotes = useCallback(() => {
    if (!selectedSong || gameMode !== 'song') return;

    const currentTime = Date.now() - songStartTime.current;
    
    selectedSong.notes.forEach((songNote, index) => {
      const spawnTime = songNote.time - SCROLL_TIME;
      
      if (currentTime >= spawnTime && !spawnedNotes.current.has(index)) {
        const newNote: Note = {
          id: noteIdCounter.current++,
          lane: songNote.lane,
          position: 0,
          timestamp: Date.now(),
        };
        setNotes(prev => [...prev, newNote]);
        spawnedNotes.current.add(index);
      }
    });
  }, [selectedSong, gameMode]);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = () => {
      const now = Date.now();

      if (gameMode === 'random') {
        // Modo aleatório (original)
        if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
          spawnNote();
          lastSpawnRef.current = now;
        }
      } else if (gameMode === 'song') {
        // Modo música sincronizada
        spawnSongNotes();
      }

      // Move notes down
      setNotes(prev => {
        const updated = prev.map(note => ({
          ...note,
          position: note.position + NOTE_SPEED,
        }));

        // Remove missed notes and reset combo
        const missed = updated.filter(note => note.position > 650);
        if (missed.length > 0) {
          setCombo(0);
        }

        return updated.filter(note => note.position <= 650);
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameMode, spawnSongNotes]);

  const startGame = (mode: 'random' | 'song' = 'random', song?: Song) => {
    setGameMode(mode);
    setSelectedSong(song || null);
    setGameStarted(true);
    setScore(0);
    setCombo(0);
    setNotes([]);
    noteIdCounter.current = 0;
    lastSpawnRef.current = Date.now();
    processedButtons.current.clear();
    spawnedNotes.current.clear();
    songStartTime.current = Date.now();
    
    // Play audio if song mode
    if (mode === 'song' && song?.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(song.audioUrl);
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      // Reset flag to allow sending result at song end
      resultSentRef.current = false;
    }
    
    console.log(`🎮 GAME STARTED! Mode: ${mode}`);
  };

  const stopGame = () => {
    setGameStarted(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Send result to backend
  const sendResult = useCallback(async () => {
    if (resultSentRef.current) return;
    resultSentRef.current = true;

    const payload = {
      userIdentifier,
      score,
      music: selectedSong?.name || "Random Mode",
    };

    try {
      console.log(import.meta.env.VITE_API_URL);
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api/playbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("✅ Resultado enviado ao backend:", payload);
    } catch (err) {
      console.error("❌ Falha ao enviar resultado:", err);
    }
  }, [userIdentifier, score, selectedSong]);

  // Attach audio end listener to send result when song finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      console.log("🔚 Música finalizada, enviando resultado...");
      sendResult();
    };
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef.current, sendResult]);

  return (
    <div className="guitar-hero-container">
      <div className="header">
        <h1>Guitar Hero</h1>
        <div className="stats">
          <div className="score">Score: {score}</div>
          <div className="combo">Combo: {combo}x</div>
          <div className={`bluetooth-status ${isBluetoothConnected ? 'connected' : ''}`}>
            {isBluetoothConnected ? '🔵 Conectado' : '⚪ Desconectado'}
          </div>
        </div>
      </div>

      <div className="controls">
        {!isBluetoothConnected && (
          <button onClick={connectBluetooth} className="btn-bluetooth">
            Conectar Bluetooth ESP32
          </button>
        )}
        {!gameStarted ? (
          <div className="game-mode-selection">
            <h3>Selecione o Modo:</h3>
            <button onClick={() => startGame('random')} className="btn-start">
              🎲 Modo Aleatório
            </button>
            <div className="song-list">
              <h4>Ou escolha uma música:</h4>
              {SONGS.map((song, idx) => (
                <button 
                  key={idx}
                  onClick={() => startGame('song', song)} 
                  className="btn-song"
                >
                  🎵 {song.name} ({song.bpm} BPM)
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="game-info">
            <div className="mode-display">
              Modo: {gameMode === 'random' ? '🎲 Aleatório' : `🎵 ${selectedSong?.name}`}
            </div>
            <button onClick={sendResult} className="btn-bluetooth">
              💾 Enviar Resultado Agora
            </button>
            <button onClick={stopGame} className="btn-stop">
              ⏹️ Parar
            </button>
          </div>
        )}
      </div>

      <div className="game-area">
        <div className="lanes">
          {Array.from({ length: LANES }).map((_, i) => (
            <div
              key={i}
              className={`lane ${pressedButtons.has(i) ? 'pressed' : ''}`}
              style={{ backgroundColor: laneColors[i] }}
            >
              <div className="lane-number">{i + 1}</div>
              <div className="hit-zone"></div>
            </div>
          ))}
        </div>

        <div className="notes-container">
          {notes.map(note => (
            <div
              key={note.id}
              className="note"
              style={{
                left: `${(note.lane * 100 / LANES)}%`,
                top: `${note.position}px`,
                backgroundColor: laneColors[note.lane],
              }}
            />
          ))}
        </div>
      </div>

      <div className="instructions">
        <p>Teclado (teste): A S D J K L</p>
        <p>Ou conecte o ESP32 S3 via Bluetooth!</p>
      </div>
    </div>
  );
}
