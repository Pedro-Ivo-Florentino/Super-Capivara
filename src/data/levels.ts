export type Riddle = {
  question: string;
  options: string[];
  answerIndex: number;
};

export type Level = {
  id: string;
  name: string;
  enemyId: string;
  enemyName: string;
  enemyImage: string;
  colorPrimary: string;
  colorSecondary: string;
  groundColor: string;
  scenery: 'lake' | 'savanna' | 'jungle' | 'volcano' | 'dark';
  platforms: { x: number; y: number; w: number; h: number }[];
  pits: { start: number; w: number }[];
  spikes: { x: number; y: number; w: number; h: number }[];
  puddles?: { id: string; x: number; y: number; w: number; h: number; targetLevelId: string }[];
  floorY: number;
  enemyPos: { x: number; y: number; w: number; h: number }; // Boss
  enemies: { id: string; x: number; y: number; w: number; h: number; patrolRange: number; speed: number; type: string }[];
  ladders?: { x: number; y: number; w: number; h: number }[];
  broccolis: { id: string; x: number; y: number; w: number; h: number }[];
  tangerines?: { id: string; x: number; y: number; w: number; h: number }[];
  apples?: { id: string; x: number; y: number; w: number; h: number }[];
  bananas?: { id: string; x: number; y: number; w: number; h: number }[];
  riddle: Riddle;
  worldWidth: number;
};

const levels: Level[] = [
  {
    id: "level_1",
    name: "Poça da Meleca Azul",
    enemyId: "crocodilo",
    enemyName: "Crocodilo de Pantufas",
    enemyImage: "🐊",
    colorPrimary: "from-sky-300",
    colorSecondary: "to-blue-400",
    groundColor: "bg-green-400",
    scenery: "lake",
    worldWidth: 12500,
    floorY: 500,
    puddles: [
      {
        id: "puddle_1",
        x: 900,
        y: 490,
        w: 120,
        h: 20,
        targetLevelId: "secret_1"
      }
    ],
    pits: [
      {
        start: 600,
        w: 200
      },
      {
        start: 1200,
        w: 250
      },
      {
        start: 1800,
        w: 300
      },
      {
        start: 2500,
        w: 400
      },
      {
        start: 3400,
        w: 200
      },
      {
        start: 4200,
        w: 200
      },
      {
        start: 5000,
        w: 300
      },
      {
        start: 7100,
        w: 200
      },
      {
        start: 7700,
        w: 250
      },
      {
        start: 8300,
        w: 300
      },
      {
        start: 9000,
        w: 400
      },
      {
        start: 9900,
        w: 200
      },
      {
        start: 10700,
        w: 200
      },
      {
        start: 11500,
        w: 300
      }
    ],
    spikes: [
      {
        x: 950,
        y: 460,
        w: 60,
        h: 40
      },
      {
        x: 1600,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 2200,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 3000,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 4000,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 4800,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 7450,
        y: 460,
        w: 60,
        h: 40
      },
      {
        x: 8100,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 8700,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 9500,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 10500,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 11300,
        y: 460,
        w: 80,
        h: 40
      }
    ],
    platforms: [
      {
        x: 650,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 1250,
        y: 360,
        w: 210,
        h: 40
      },
      {
        x: 1850,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 2000,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 2600,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 2800,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 3450,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 4300,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 5100,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 7150,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 7750,
        y: 360,
        w: 210,
        h: 40
      },
      {
        x: 8350,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 8500,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 9100,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 9300,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 9950,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 10800,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 11600,
        y: 360,
        w: 160,
        h: 40
      }
    ],
    enemyPos: {
      x: 12200,
      y: 360,
      w: 140,
      h: 140
    },
    enemies: [
      {
        id: "e1",
        x: 1050,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 2,
        type: "crab"
      },
      {
        id: "e2",
        x: 2320,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 2,
        type: "crab"
      },
      {
        id: "e3",
        x: 3150,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 200,
        speed: 3,
        type: "crab"
      },
      {
        id: "e4",
        x: 4500,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "crab"
      },
      {
        id: "e1_dup",
        x: 7550,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 2,
        type: "crab"
      },
      {
        id: "e2_dup",
        x: 8820,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 2,
        type: "crab"
      },
      {
        id: "e3_dup",
        x: 9650,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 200,
        speed: 3,
        type: "crab"
      },
      {
        id: "e4_dup",
        x: 11000,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "crab"
      }
    ],
    broccolis: [
      {
        id: "L1",
        x: 700,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L2",
        x: 1300,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L3",
        x: 1900,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L4",
        x: 2050,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L5",
        x: 2650,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L6",
        x: 2850,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L7",
        x: 3500,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L8",
        x: 1500,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L9",
        x: 2100,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L10",
        x: 3300,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L1_dup",
        x: 7200,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L2_dup",
        x: 7800,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L3_dup",
        x: 8400,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L4_dup",
        x: 8550,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L5_dup",
        x: 9150,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L6_dup",
        x: 9350,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L7_dup",
        x: 10000,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L8_dup",
        x: 8000,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L9_dup",
        x: 8600,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L10_dup",
        x: 9800,
        y: 450,
        w: 30,
        h: 30
      }
    ],
    tangerines: [
      {
        id: "T1",
        x: 2600,
        y: 280,
        w: 30,
        h: 30
      },
      {
        id: "T1_dup",
        x: 9100,
        y: 280,
        w: 30,
        h: 30
      }
    ],
    apples: [
      {
        id: "A1",
        x: 1500,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "A1_dup",
        x: 8000,
        y: 350,
        w: 30,
        h: 30
      }
    ],
    bananas: [
      {
        id: "B1",
        x: 3500,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "B1_dup",
        x: 10000,
        y: 350,
        w: 30,
        h: 30
      }
    ],
    riddle: {
      question: "Senhorita Cacau, eu sou o Crocodilo das Águas Turvas. Se você me der 3 maçãs e eu comer 2, o que me sobra?",
      options: [
        "1 maçã",
        "Uma dor de barriga",
        "Lágrimas de crocodilo"
      ],
      answerIndex: 2
    }
  },
  {
    id: "level_2",
    name: "Savana do Calor Suado",
    enemyId: "leao",
    enemyName: "Leão Vegetariano",
    enemyImage: "🦁",
    colorPrimary: "from-orange-300",
    colorSecondary: "to-yellow-400",
    groundColor: "bg-yellow-600",
    scenery: "savanna",
    worldWidth: 17500,
    floorY: 500,
    pits: [
      {
        start: 500,
        w: 300
      },
      {
        start: 1100,
        w: 400
      },
      {
        start: 1800,
        w: 200
      },
      {
        start: 2400,
        w: 500
      },
      {
        start: 3300,
        w: 300
      },
      {
        start: 4200,
        w: 350
      },
      {
        start: 5300,
        w: 400
      },
      {
        start: 6200,
        w: 400
      },
      {
        start: 8000,
        w: 300
      },
      {
        start: 8600,
        w: 400
      },
      {
        start: 9300,
        w: 200
      },
      {
        start: 9900,
        w: 500
      },
      {
        start: 10800,
        w: 300
      },
      {
        start: 11700,
        w: 350
      },
      {
        start: 12800,
        w: 400
      },
      {
        start: 13700,
        w: 400
      }
    ],
    spikes: [
      {
        x: 900,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 1600,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 2100,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 3000,
        y: 460,
        w: 150,
        h: 40
      },
      {
        x: 3800,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 4700,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 8400,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 9100,
        y: 460,
        w: 80,
        h: 40
      },
      {
        x: 9600,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 10500,
        y: 460,
        w: 150,
        h: 40
      },
      {
        x: 11300,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 12200,
        y: 460,
        w: 80,
        h: 40
      }
    ],
    platforms: [
      {
        x: 550,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 1150,
        y: 400,
        w: 160,
        h: 40
      },
      {
        x: 1350,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 2450,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 2650,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 3350,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 3500,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 4250,
        y: 360,
        w: 180,
        h: 40
      },
      {
        x: 4400,
        y: 220,
        w: 140,
        h: 40
      },
      {
        x: 5400,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 6300,
        y: 300,
        w: 160,
        h: 40
      },
      {
        x: 8050,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 8650,
        y: 400,
        w: 160,
        h: 40
      },
      {
        x: 8850,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 9950,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 10150,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 10850,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 11000,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 11750,
        y: 360,
        w: 180,
        h: 40
      },
      {
        x: 11900,
        y: 220,
        w: 140,
        h: 40
      },
      {
        x: 12900,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 13800,
        y: 300,
        w: 160,
        h: 40
      }
    ],
    enemyPos: {
      x: 17200,
      y: 360,
      w: 140,
      h: 140
    },
    enemies: [
      {
        id: "e1",
        x: 1000,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 80,
        speed: 2,
        type: "hyena"
      },
      {
        id: "e2",
        x: 2250,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 120,
        speed: 2,
        type: "hyena"
      },
      {
        id: "e3",
        x: 3650,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "hyena"
      },
      {
        id: "e4",
        x: 4600,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 80,
        speed: 2,
        type: "hyena"
      },
      {
        id: "e5",
        x: 5800,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "hyena"
      },
      {
        id: "e1_dup",
        x: 8500,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 80,
        speed: 2,
        type: "hyena"
      },
      {
        id: "e2_dup",
        x: 9750,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 120,
        speed: 2,
        type: "hyena"
      },
      {
        id: "e3_dup",
        x: 11150,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "hyena"
      },
      {
        id: "e4_dup",
        x: 12100,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 80,
        speed: 2,
        type: "hyena"
      },
      {
        id: "e5_dup",
        x: 13300,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "hyena"
      }
    ],
    broccolis: [
      {
        id: "L1",
        x: 600,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L2",
        x: 1200,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L3",
        x: 1400,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L4",
        x: 2500,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L5",
        x: 2700,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L6",
        x: 3400,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L7",
        x: 3550,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L8",
        x: 4300,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L9",
        x: 4450,
        y: 170,
        w: 30,
        h: 30
      },
      {
        id: "L10",
        x: 1700,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L11",
        x: 3100,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L1_dup",
        x: 8100,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L2_dup",
        x: 8700,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L3_dup",
        x: 8900,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L4_dup",
        x: 10000,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L5_dup",
        x: 10200,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L6_dup",
        x: 10900,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L7_dup",
        x: 11050,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L8_dup",
        x: 11800,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L9_dup",
        x: 11950,
        y: 170,
        w: 30,
        h: 30
      },
      {
        id: "L10_dup",
        x: 9200,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L11_dup",
        x: 10600,
        y: 450,
        w: 30,
        h: 30
      }
    ],
    tangerines: [
      {
        id: "T2_1",
        x: 2700,
        y: 150,
        w: 30,
        h: 30
      },
      {
        id: "T2_2",
        x: 4500,
        y: 250,
        w: 30,
        h: 30
      },
      {
        id: "T2_1_dup",
        x: 10200,
        y: 150,
        w: 30,
        h: 30
      },
      {
        id: "T2_2_dup",
        x: 12000,
        y: 250,
        w: 30,
        h: 30
      }
    ],
    apples: [
      {
        id: "A2",
        x: 1800,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "A2_dup",
        x: 9300,
        y: 300,
        w: 30,
        h: 30
      }
    ],
    bananas: [
      {
        id: "B2",
        x: 3800,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "B2_dup",
        x: 11300,
        y: 300,
        w: 30,
        h: 30
      }
    ],
    riddle: {
      question: "GRAWRRR! Sou o Rei da Savana! Mas me diga... o que é que me faz tremer de medo, é verde, pequenininho e adora pular?",
      options: [
        "O caçador",
        "O grilo cantando à noite",
        "Um espirro de elefante"
      ],
      answerIndex: 1
    }
  },
  {
    id: "level_3",
    name: "Mata do Bicho Estranho",
    enemyId: "onca",
    enemyName: "Onça Pintadinha de Canetinha",
    ladders: [
      { x: 500, y: 250, w: 40, h: 250 },
      { x: 1500, y: 200, w: 40, h: 300 },
      { x: 3200, y: 150, w: 40, h: 350 },
      { x: 5800, y: 250, w: 40, h: 250 },
      { x: 8000, y: 200, w: 40, h: 300 }
    ],
    enemyImage: "🐆",
    colorPrimary: "from-green-400",
    colorSecondary: "to-green-600",
    groundColor: "bg-green-800",
    scenery: "jungle",
    worldWidth: 17500,
    floorY: 500,
    pits: [
      {
        start: 400,
        w: 400
      },
      {
        start: 1200,
        w: 500
      },
      {
        start: 2200,
        w: 300
      },
      {
        start: 3000,
        w: 600
      },
      {
        start: 4000,
        w: 400
      },
      {
        start: 4800,
        w: 300
      },
      {
        start: 5600,
        w: 450
      },
      {
        start: 6600,
        w: 400
      },
      {
        start: 7600,
        w: 500
      },
      {
        start: 8900,
        w: 400
      },
      {
        start: 9700,
        w: 500
      },
      {
        start: 10700,
        w: 300
      },
      {
        start: 11500,
        w: 600
      },
      {
        start: 12500,
        w: 400
      },
      {
        start: 13300,
        w: 300
      },
      {
        start: 14100,
        w: 450
      },
      {
        start: 15100,
        w: 400
      },
      {
        start: 16100,
        w: 500
      }
    ],
    spikes: [
      {
        x: 950,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 1900,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 2700,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 3700,
        y: 460,
        w: 160,
        h: 40
      },
      {
        x: 4500,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 5300,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 6800,
        y: 460,
        w: 150,
        h: 40
      },
      {
        x: 7800,
        y: 460,
        w: 150,
        h: 40
      },
      {
        x: 9450,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 10400,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 11200,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 12200,
        y: 460,
        w: 160,
        h: 40
      },
      {
        x: 13000,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 13800,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 15300,
        y: 460,
        w: 150,
        h: 40
      },
      {
        x: 16300,
        y: 460,
        w: 150,
        h: 40
      }
    ],
    platforms: [
      {
        x: 450,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 650,
        y: 250,
        w: 160,
        h: 40
      },
      {
        x: 1250,
        y: 400,
        w: 160,
        h: 40
      },
      {
        x: 1550,
        y: 300,
        w: 160,
        h: 40
      },
      {
        x: 2250,
        y: 350,
        w: 180,
        h: 40
      },
      {
        x: 3050,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 3250,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 3450,
        y: 150,
        w: 140,
        h: 40
      },
      {
        x: 4050,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 4200,
        y: 240,
        w: 160,
        h: 40
      },
      {
        x: 4850,
        y: 360,
        w: 180,
        h: 40
      },
      {
        x: 5650,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 5850,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 6700,
        y: 350,
        w: 160,
        h: 40
      },
      {
        x: 7700,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 8950,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 9150,
        y: 250,
        w: 160,
        h: 40
      },
      {
        x: 9750,
        y: 400,
        w: 160,
        h: 40
      },
      {
        x: 10050,
        y: 300,
        w: 160,
        h: 40
      },
      {
        x: 10750,
        y: 350,
        w: 180,
        h: 40
      },
      {
        x: 11550,
        y: 380,
        w: 180,
        h: 40
      },
      {
        x: 11750,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 11950,
        y: 150,
        w: 140,
        h: 40
      },
      {
        x: 12550,
        y: 360,
        w: 160,
        h: 40
      },
      {
        x: 12700,
        y: 240,
        w: 160,
        h: 40
      },
      {
        x: 13350,
        y: 360,
        w: 180,
        h: 40
      },
      {
        x: 14150,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 14350,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 15200,
        y: 350,
        w: 160,
        h: 40
      },
      {
        x: 16200,
        y: 380,
        w: 160,
        h: 40
      }
    ],
    enemyPos: {
      x: 17200,
      y: 360,
      w: 140,
      h: 140
    },
    enemies: [
      {
        id: "s1",
        x: 500,
        y: 250,
        w: 40,
        h: 40,
        patrolRange: 200,
        speed: 2,
        type: "spider"
      },
      {
        id: "s2",
        x: 1500,
        y: 200,
        w: 40,
        h: 40,
        patrolRange: 250,
        speed: 3,
        type: "spider"
      },
      {
        id: "s3",
        x: 3200,
        y: 150,
        w: 40,
        h: 40,
        patrolRange: 300,
        speed: 4,
        type: "spider"
      },
      {
        id: "e1",
        x: 2050,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 2,
        type: "snake"
      },
      {
        id: "e2",
        x: 2850,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 120,
        speed: 2,
        type: "snake"
      },
      {
        id: "e3",
        x: 3900,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 3,
        type: "snake"
      },
      {
        id: "e4",
        x: 5120,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "snake"
      },
      {
        id: "e5",
        x: 5450,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 2,
        type: "snake"
      },
      {
        id: "e6",
        x: 7200,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 4,
        type: "snake"
      },
      {
        id: "e1_dup",
        x: 10550,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 2,
        type: "snake"
      },
      {
        id: "e2_dup",
        x: 11350,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 120,
        speed: 2,
        type: "snake"
      },
      {
        id: "e3_dup",
        x: 12400,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 3,
        type: "snake"
      },
      {
        id: "e4_dup",
        x: 13620,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 3,
        type: "snake"
      },
      {
        id: "e5_dup",
        x: 13950,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 2,
        type: "snake"
      },
      {
        id: "e6_dup",
        x: 15700,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 4,
        type: "snake"
      }
    ],
    broccolis: [
      {
        id: "L1",
        x: 500,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L2",
        x: 700,
        y: 200,
        w: 30,
        h: 30
      },
      {
        id: "L3",
        x: 1300,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L4",
        x: 1600,
        y: 250,
        w: 30,
        h: 30
      },
      {
        id: "L5",
        x: 2300,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "L6",
        x: 3100,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L7",
        x: 3300,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L8",
        x: 3500,
        y: 100,
        w: 30,
        h: 30
      },
      {
        id: "L9",
        x: 4100,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L10",
        x: 4250,
        y: 190,
        w: 30,
        h: 30
      },
      {
        id: "L11",
        x: 4900,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L12",
        x: 5700,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L13",
        x: 5900,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L14",
        x: 2550,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L15",
        x: 4650,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L1_dup",
        x: 9000,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L2_dup",
        x: 9200,
        y: 200,
        w: 30,
        h: 30
      },
      {
        id: "L3_dup",
        x: 9800,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L4_dup",
        x: 10100,
        y: 250,
        w: 30,
        h: 30
      },
      {
        id: "L5_dup",
        x: 10800,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "L6_dup",
        x: 11600,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L7_dup",
        x: 11800,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L8_dup",
        x: 12000,
        y: 100,
        w: 30,
        h: 30
      },
      {
        id: "L9_dup",
        x: 12600,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L10_dup",
        x: 12750,
        y: 190,
        w: 30,
        h: 30
      },
      {
        id: "L11_dup",
        x: 13400,
        y: 310,
        w: 30,
        h: 30
      },
      {
        id: "L12_dup",
        x: 14200,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L13_dup",
        x: 14400,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L14_dup",
        x: 11050,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L15_dup",
        x: 13150,
        y: 450,
        w: 30,
        h: 30
      }
    ],
    tangerines: [
      {
        id: "T3_1",
        x: 3450,
        y: 70,
        w: 30,
        h: 30
      },
      {
        id: "T3_2",
        x: 5900,
        y: 130,
        w: 30,
        h: 30
      },
      {
        id: "T3_1_dup",
        x: 11950,
        y: 70,
        w: 30,
        h: 30
      },
      {
        id: "T3_2_dup",
        x: 14400,
        y: 130,
        w: 30,
        h: 30
      }
    ],
    apples: [
      {
        id: "A3",
        x: 2200,
        y: 200,
        w: 30,
        h: 30
      },
      {
        id: "A3_dup",
        x: 10700,
        y: 200,
        w: 30,
        h: 30
      }
    ],
    bananas: [
      {
        id: "B3",
        x: 4200,
        y: 200,
        w: 30,
        h: 30
      },
      {
        id: "B3_dup",
        x: 12700,
        y: 200,
        w: 30,
        h: 30
      }
    ],
    riddle: {
      question: "ROAAAAR! Sou rápida como o vento! Cacau, pense rápido: o que corre a floresta inteira deitada, sem nunca se levantar?",
      options: [
        "A cobra",
        "O vento rasgando as folhas",
        "As raízes das árvores"
      ],
      answerIndex: 0
    }
  },
  {
    id: "level_4",
    name: "Vulcão do Aperreio",
    enemyId: "dragao",
    enemyName: "Dragão Alérgico a Fogo",
    enemyImage: "🐉",
    colorPrimary: "from-red-600",
    colorSecondary: "to-orange-700",
    groundColor: "bg-red-900",
    scenery: "volcano",
    worldWidth: 18000,
    floorY: 500,
    pits: [
      {
        start: 600,
        w: 400
      },
      {
        start: 1400,
        w: 600
      },
      {
        start: 2400,
        w: 400
      },
      {
        start: 3200,
        w: 700
      },
      {
        start: 4200,
        w: 500
      },
      {
        start: 5000,
        w: 400
      },
      {
        start: 5800,
        w: 800
      },
      {
        start: 6800,
        w: 300
      },
      {
        start: 8000,
        w: 500
      },
      {
        start: 9000,
        w: 400
      },
      {
        start: 11100,
        w: 400
      },
      {
        start: 11900,
        w: 600
      },
      {
        start: 12900,
        w: 400
      },
      {
        start: 13700,
        w: 700
      },
      {
        start: 14700,
        w: 500
      },
      {
        start: 15500,
        w: 400
      },
      {
        start: 16300,
        w: 800
      },
      {
        start: 17300,
        w: 300
      },
      {
        start: 18500,
        w: 500
      },
      {
        start: 19500,
        w: 400
      }
    ],
    spikes: [
      {
        x: 1150,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 2150,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 2950,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 4000,
        y: 460,
        w: 160,
        h: 40
      },
      {
        x: 4800,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 5500,
        y: 460,
        w: 140,
        h: 40
      },
      {
        x: 8200,
        y: 460,
        w: 180,
        h: 40
      },
      {
        x: 8800,
        y: 460,
        w: 150,
        h: 40
      },
      {
        x: 11650,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 12650,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 13450,
        y: 460,
        w: 100,
        h: 40
      },
      {
        x: 14500,
        y: 460,
        w: 160,
        h: 40
      },
      {
        x: 15300,
        y: 460,
        w: 120,
        h: 40
      },
      {
        x: 16000,
        y: 460,
        w: 140,
        h: 40
      },
      {
        x: 18700,
        y: 460,
        w: 180,
        h: 40
      },
      {
        x: 19300,
        y: 460,
        w: 150,
        h: 40
      }
    ],
    platforms: [
      {
        x: 700,
        y: 380,
        w: 140,
        h: 40
      },
      {
        x: 880,
        y: 240,
        w: 140,
        h: 40
      },
      {
        x: 1450,
        y: 400,
        w: 140,
        h: 40
      },
      {
        x: 1650,
        y: 300,
        w: 140,
        h: 40
      },
      {
        x: 1850,
        y: 180,
        w: 140,
        h: 40
      },
      {
        x: 2500,
        y: 350,
        w: 160,
        h: 40
      },
      {
        x: 3250,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 3450,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 3650,
        y: 180,
        w: 160,
        h: 40
      },
      {
        x: 4300,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 4500,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 5100,
        y: 350,
        w: 160,
        h: 40
      },
      {
        x: 5900,
        y: 400,
        w: 140,
        h: 40
      },
      {
        x: 6150,
        y: 280,
        w: 140,
        h: 40
      },
      {
        x: 6400,
        y: 160,
        w: 140,
        h: 40
      },
      {
        x: 8100,
        y: 380,
        w: 140,
        h: 40
      },
      {
        x: 8300,
        y: 250,
        w: 140,
        h: 40
      },
      {
        x: 9100,
        y: 350,
        w: 140,
        h: 40
      },
      {
        x: 11200,
        y: 380,
        w: 140,
        h: 40
      },
      {
        x: 11380,
        y: 240,
        w: 140,
        h: 40
      },
      {
        x: 11950,
        y: 400,
        w: 140,
        h: 40
      },
      {
        x: 12150,
        y: 300,
        w: 140,
        h: 40
      },
      {
        x: 12350,
        y: 180,
        w: 140,
        h: 40
      },
      {
        x: 13000,
        y: 350,
        w: 160,
        h: 40
      },
      {
        x: 13750,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 13950,
        y: 280,
        w: 160,
        h: 40
      },
      {
        x: 14150,
        y: 180,
        w: 160,
        h: 40
      },
      {
        x: 14800,
        y: 380,
        w: 160,
        h: 40
      },
      {
        x: 15000,
        y: 260,
        w: 160,
        h: 40
      },
      {
        x: 15600,
        y: 350,
        w: 160,
        h: 40
      },
      {
        x: 16400,
        y: 400,
        w: 140,
        h: 40
      },
      {
        x: 16650,
        y: 280,
        w: 140,
        h: 40
      },
      {
        x: 16900,
        y: 160,
        w: 140,
        h: 40
      },
      {
        x: 18600,
        y: 380,
        w: 140,
        h: 40
      },
      {
        x: 18800,
        y: 250,
        w: 140,
        h: 40
      },
      {
        x: 19600,
        y: 350,
        w: 140,
        h: 40
      }
    ],
    enemyPos: {
      x: 17700,
      y: 360,
      w: 140,
      h: 140
    },
    enemies: [
      {
        id: "e1",
        x: 1280,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 3,
        type: "bat"
      },
      {
        id: "e2",
        x: 2280,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 4,
        type: "bat"
      },
      {
        id: "e3",
        x: 3100,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 3,
        type: "bat"
      },
      {
        id: "e4",
        x: 4180,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 5,
        type: "bat"
      },
      {
        id: "e5",
        x: 4940,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 80,
        speed: 3,
        type: "bat"
      },
      {
        id: "e6",
        x: 5650,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 120,
        speed: 4,
        type: "bat"
      },
      {
        id: "e7",
        x: 8500,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 200,
        speed: 5,
        type: "bat"
      },
      {
        id: "e1_dup",
        x: 11780,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 3,
        type: "bat"
      },
      {
        id: "e2_dup",
        x: 12780,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 4,
        type: "bat"
      },
      {
        id: "e3_dup",
        x: 13600,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 100,
        speed: 3,
        type: "bat"
      },
      {
        id: "e4_dup",
        x: 14680,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 150,
        speed: 5,
        type: "bat"
      },
      {
        id: "e5_dup",
        x: 15440,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 80,
        speed: 3,
        type: "bat"
      },
      {
        id: "e6_dup",
        x: 16150,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 120,
        speed: 4,
        type: "bat"
      },
      {
        id: "e7_dup",
        x: 19000,
        y: 460,
        w: 40,
        h: 40,
        patrolRange: 200,
        speed: 5,
        type: "bat"
      }
    ],
    broccolis: [
      {
        id: "L1",
        x: 750,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L2",
        x: 930,
        y: 190,
        w: 30,
        h: 30
      },
      {
        id: "L3",
        x: 1500,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L4",
        x: 1700,
        y: 250,
        w: 30,
        h: 30
      },
      {
        id: "L5",
        x: 1900,
        y: 130,
        w: 30,
        h: 30
      },
      {
        id: "L6",
        x: 2550,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "L7",
        x: 3300,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L8",
        x: 3500,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L9",
        x: 3700,
        y: 130,
        w: 30,
        h: 30
      },
      {
        id: "L10",
        x: 4350,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L11",
        x: 4550,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L12",
        x: 5150,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "L13",
        x: 5950,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L14",
        x: 6200,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L15",
        x: 6450,
        y: 110,
        w: 30,
        h: 30
      },
      {
        id: "L16",
        x: 2850,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L17",
        x: 6600,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L1_dup",
        x: 11250,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L2_dup",
        x: 11430,
        y: 190,
        w: 30,
        h: 30
      },
      {
        id: "L3_dup",
        x: 12000,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L4_dup",
        x: 12200,
        y: 250,
        w: 30,
        h: 30
      },
      {
        id: "L5_dup",
        x: 12400,
        y: 130,
        w: 30,
        h: 30
      },
      {
        id: "L6_dup",
        x: 13050,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "L7_dup",
        x: 13800,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L8_dup",
        x: 14000,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L9_dup",
        x: 14200,
        y: 130,
        w: 30,
        h: 30
      },
      {
        id: "L10_dup",
        x: 14850,
        y: 330,
        w: 30,
        h: 30
      },
      {
        id: "L11_dup",
        x: 15050,
        y: 210,
        w: 30,
        h: 30
      },
      {
        id: "L12_dup",
        x: 15650,
        y: 300,
        w: 30,
        h: 30
      },
      {
        id: "L13_dup",
        x: 16450,
        y: 350,
        w: 30,
        h: 30
      },
      {
        id: "L14_dup",
        x: 16700,
        y: 230,
        w: 30,
        h: 30
      },
      {
        id: "L15_dup",
        x: 16950,
        y: 110,
        w: 30,
        h: 30
      },
      {
        id: "L16_dup",
        x: 13350,
        y: 450,
        w: 30,
        h: 30
      },
      {
        id: "L17_dup",
        x: 17100,
        y: 450,
        w: 30,
        h: 30
      }
    ],
    tangerines: [
      {
        id: "T4_1",
        x: 3650,
        y: 100,
        w: 30,
        h: 30
      },
      {
        id: "T4_2",
        x: 6400,
        y: 80,
        w: 30,
        h: 30
      },
      {
        id: "T4_1_dup",
        x: 14150,
        y: 100,
        w: 30,
        h: 30
      },
      {
        id: "T4_2_dup",
        x: 16900,
        y: 80,
        w: 30,
        h: 30
      }
    ],
    apples: [
      {
        id: "A4",
        x: 2500,
        y: 200,
        w: 30,
        h: 30
      },
      {
        id: "A4_dup",
        x: 13000,
        y: 200,
        w: 30,
        h: 30
      }
    ],
    bananas: [
      {
        id: "B4",
        x: 4800,
        y: 150,
        w: 30,
        h: 30
      },
      {
        id: "B4_dup",
        x: 15300,
        y: 150,
        w: 30,
        h: 30
      }
    ],
    riddle: {
      question: "FSSSSSS! Sou a Fúria Ancestral, guardião do Fogo! Diga, o que é que devora tudo que toca, mas se beber água... morre?",
      options: [
        "O próprio fogo",
        "A lava escaldante",
        "O monstro da poeira"
      ],
      answerIndex: 0
    }
  },
  {
    id: "secret_1",
    name: "Submundo Obscuro",
    enemyId: "sombra",
    enemyName: "A Sombra",
    enemyImage: "👻",
    colorPrimary: "from-gray-900",
    colorSecondary: "to-black",
    groundColor: "bg-gray-800",
    scenery: "dark",
    worldWidth: 4000,
    floorY: 500,
    pits: [
      { start: 300, w: 200 },
      { start: 700, w: 300 },
      { start: 1200, w: 400 },
      { start: 1800, w: 500 },
      { start: 2500, w: 600 }
    ],
    spikes: [
      { x: 550, y: 460, w: 100, h: 40 },
      { x: 1050, y: 460, w: 100, h: 40 },
      { x: 1650, y: 460, w: 100, h: 40 },
      { x: 2350, y: 460, w: 100, h: 40 }
    ],
    platforms: [
      { x: 350, y: 350, w: 100, h: 40 },
      { x: 750, y: 300, w: 200, h: 40 },
      { x: 1250, y: 250, w: 300, h: 40 },
      { x: 1850, y: 200, w: 400, h: 40 },
      // High-altitude platforms reachable using Super Jump (Apple) or high momentum:
      { x: 2050, y: 60, w: 160, h: 30 },
      { x: 2600, y: 350, w: 400, h: 40 },
      { x: 2800, y: 160, w: 160, h: 30 }
    ],
    enemies: [
      { id: "s1", x: 800, y: 260, w: 50, h: 50, patrolRange: 100, speed: 4, type: "fly" },
      { id: "s2", x: 1300, y: 210, w: 50, h: 50, patrolRange: 150, speed: 5, type: "ground" },
      { id: "s3", x: 1950, y: 160, w: 50, h: 50, patrolRange: 200, speed: 6, type: "fly" },
      // Added a patrolling spider on the last wide platform to create an engaging final puzzle!
      { id: "s4", x: 2700, y: 310, w: 50, h: 40, patrolRange: 160, speed: 3, type: "ground" }
    ],
    puddles: [
      {
        id: "puddle_return",
        x: 3500,
        y: 490,
        w: 120,
        h: 20,
        targetLevelId: "return" // special marker to return
      }
    ],
    broccolis: [
      { id: "sec_l1", x: 400, y: 300, w: 40, h: 40 },
      { id: "sec_l2", x: 850, y: 250, w: 40, h: 40 },
      { id: "sec_l3", x: 1400, y: 200, w: 40, h: 40 },
      // Rare high broccolis sitting on the secret high platforms!
      { id: "sec_l4", x: 2110, y: 10, w: 40, h: 40 },
      { id: "sec_l5", x: 2860, y: 110, w: 40, h: 40 },
      { id: "sec_l6", x: 2800, y: 300, w: 40, h: 40 },
      { id: "sec_l7", x: 3300, y: 450, w: 40, h: 40 }
    ],
    tangerines: [
      // Strategically placed at the beginning so the player can use invincibility for the initial rush
      { id: "sec_t1", x: 200, y: 460, w: 40, h: 40 }
    ],
    apples: [
      // Placed on platform 3 so the player can jump extremely high and reach the vertical bonus paths
      { id: "sec_a1", x: 1380, y: 200, w: 40, h: 40 }
    ],
    bananas: [
      // Placed over the final spikes sequence right before Pit 5 (600px wide)
      { id: "sec_b1", x: 2350, y: 340, w: 40, h: 40 }
    ],
    enemyPos: { x: 3300, y: 400, w: 0, h: 0 }, // no boss here, but required
    riddle: {
      question: "Você sobreviveu à escuridão... Mas sua jornada continua.",
      options: ["Voltar"],
      answerIndex: 0
    }
  }
];

export default levels;
