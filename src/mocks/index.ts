import { StudentProfile, LearningModule, QuizQuestion } from '../types';

export const mockStudentProfile: StudentProfile = {
  id: 'student-123',
  name: 'João Pedro',
  experiencePoints: 0,
  currentLevel: 1,
  currentStreak: 0,
  lastStudyDate: null,
  longestStreak: 0
};

export const mockMathModules: LearningModule[] = [
  {
    id: 'math-1',
    title: 'Limites e Continuidade',
    subject: 'MATEMATICA',
    isUnlocked: true,
    progress: 0
  },
  {
    id: 'math-2',
    title: 'Derivadas e Regras de Derivação',
    subject: 'MATEMATICA',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'math-3',
    title: 'Integrais Definidas e Áreas',
    subject: 'MATEMATICA',
    isUnlocked: false,
    progress: 0
  }
];

export const mockPhysicsModules: LearningModule[] = [
  {
    id: 'phys-1',
    title: 'Cinemática e Vetores',
    subject: 'FISICA',
    isUnlocked: true,
    progress: 0
  },
  {
    id: 'phys-2',
    title: 'Dinâmica e Leis de Newton',
    subject: 'FISICA',
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'phys-3',
    title: 'Trabalho, Energia e Conservação',
    subject: 'FISICA',
    isUnlocked: false,
    progress: 0
  }
];

export const mockQuizzes: Record<string, QuizQuestion[]> = {
  'math-1': [
    {
      id: 'q-math-1-1',
      questionText: 'Determine o valor do limite: lim (x -> 2) [ (x² - 4) / (x - 2) ]',
      options: ['0', '2', '4', 'Não existe ou é infinito'],
      correctOptionIndex: 2,
      explanation: 'Passo 1: Identificamos uma indeterminação do tipo 0/0 ao substituir x por 2 diretamente.\n\nPasso 2: Fatoramos o numerador como diferença de quadrados: x² - 4 = (x - 2)(x + 2).\n\nPasso 3: Simplificamos a expressão para x ≠ 2: (x - 2)(x + 2) / (x - 2) = x + 2.\n\nPasso 4: Calculamos o limite substituindo o valor restante: lim (x -> 2) (x + 2) = 2 + 2 = 4.'
    },
    {
      id: 'q-math-1-2',
      questionText: 'Determine o limite fundamental trigonométrico: lim (x -> 0) [ sen(3x) / x ]',
      options: ['1', '3', '0', '1/3'],
      correctOptionIndex: 1,
      explanation: 'Passo 1: O limite fundamental trigonométrico nos diz que lim (u -> 0) [ sen(u) / u ] = 1.\n\nPasso 2: Fazemos uma mudança de variável para termos o mesmo argumento em cima e embaixo. Multiplicamos e dividimos a fração original por 3: 3 * [ sen(3x) / (3x) ].\n\nPasso 3: Aplicamos a propriedade do limite: lim (x -> 0) 3 * [ sen(3x) / 3x ] = 3 * lim (3x -> 0) [ sen(3x) / 3x ].\n\nPasso 4: Como 3x tende a 0 quando x tende a 0, a parte trigonométrica tende a 1. Logo, 3 * 1 = 3.'
    }
  ],
  'math-2': [
    {
      id: 'q-math-2-1',
      questionText: 'Seja f(x) = x * ln(x). Calcule a primeira derivada f\'(x) em relação a x.',
      options: ['1', '1 + ln(x)', 'ln(x)', 'x + ln(x)'],
      correctOptionIndex: 1,
      explanation: 'Passo 1: A função f(x) é um produto de duas funções: u(x) = x e v(x) = ln(x).\n\nPasso 2: Aplicamos a Regra do Produto: (u * v)\' = u\' * v + u * v\'.\n\nPasso 3: Calculamos as derivadas individuais: u\'(x) = 1 e v\'(x) = 1/x.\n\nPasso 4: Substituímos na fórmula: f\'(x) = 1 * ln(x) + x * (1/x) = ln(x) + 1.'
    },
    {
      id: 'q-math-2-2',
      questionText: 'Encontre a derivada da função composta g(x) = cos(x²) em relação a x.',
      options: ['-2x * sen(x²)', '2x * cos(x²)', '-sen(x²)', '-2x * cos(x²)'],
      correctOptionIndex: 0,
      explanation: 'Passo 1: Identificamos que g(x) é uma função composta do tipo f(u(x)), onde f(u) = cos(u) e u(x) = x².\n\nPasso 2: Aplicamos a Regra da Cadeia: g\'(x) = f\'(u) * u\'(x).\n\nPasso 3: Derivamos cada parte: a derivada de cos(u) é -sen(u), e a derivada de x² é 2x.\n\nPasso 4: Substituímos as partes de volta: g\'(x) = -sen(x²) * 2x = -2x * sen(x²).'
    }
  ],
  'math-3': [
    {
      id: 'q-math-3-1',
      questionText: 'Calcule a integral definida: ∫ [de 1 a 2] (3x² - 2x) dx',
      options: ['2', '4', '5', '7'],
      correctOptionIndex: 1,
      explanation: 'Passo 1: Encontramos a integral indefinida (primitiva) de f(x) = 3x² - 2x termo a termo.\n\nPasso 2: A primitiva de 3x² é x³ e a de 2x é x². Logo, F(x) = x³ - x².\n\nPasso 3: Aplicamos o Teorema Fundamental do Cálculo avaliando F(2) e F(1):\n- F(2) = 2³ - 2² = 8 - 4 = 4\n- F(1) = 1³ - 1² = 1 - 1 = 0.\n\nPasso 4: Subtraímos os valores obtidos: F(2) - F(1) = 4 - 0 = 4.'
    },
    {
      id: 'q-math-3-2',
      questionText: 'Determine a área sob a curva y = e^x no intervalo fechado [0, ln(2)].',
      options: ['e - 1', '1', '2', 'ln(2)'],
      correctOptionIndex: 1,
      explanation: 'Passo 1: A área sob uma curva contínua e positiva no intervalo [a, b] é dada pela integral definida ∫ [de a a b] f(x) dx.\n\nPasso 2: Montamos a integral: ∫ [de 0 a ln(2)] e^x dx.\n\nPasso 3: A primitiva de e^x é a própria e^x. Avaliamos a integral nos limites:\n- e^(ln(2)) = 2 (propriedade do logaritmo natural)\n- e^0 = 1.\n\nPasso 4: Calculamos a diferença dos limites: 2 - 1 = 1.'
    }
  ],
  'phys-1': [
    {
      id: 'q-phys-1-1',
      questionText: 'Um projétil é lançado a partir do solo plano com velocidade inicial v0 sob um ângulo θ com a horizontal. Desprezando a resistência do ar, qual a equação para o tempo necessário para atingir o ponto mais alto de sua trajetória?',
      options: ['v0 * sen(θ) / g', 'v0 * cos(θ) / g', '2 * v0 * sen(θ) / g', 'v0² * sen²(θ) / (2g)'],
      correctOptionIndex: 0,
      explanation: 'Passo 1: Analisamos o movimento bidimensional decompondo a velocidade no eixo vertical y: vy(t) = v0y - g*t.\n\nPasso 2: No ponto mais alto da trajetória parabólica, a componente vertical da velocidade é nula (vy = 0).\n\nPasso 3: A componente inicial vertical da velocidade é dada por v0y = v0 * sen(θ).\n\nPasso 4: Substituímos na equação horária da velocidade: 0 = v0 * sen(θ) - g*t => g*t = v0 * sen(θ) => t = v0 * sen(θ) / g.'
    },
    {
      id: 'q-phys-1-2',
      questionText: 'A equação de posição de uma partícula é dada vetorialmente por r(t) = (2t³) i + (5t) j no Sistema Internacional. Encontre o módulo da aceleração da partícula no instante t = 2 s.',
      options: ['12 m/s²', '24 m/s²', '24.5 m/s²', '6 m/s²'],
      correctOptionIndex: 1,
      explanation: 'Passo 1: Para obter o vetor aceleração a(t), devemos derivar o vetor posição r(t) duas vezes em relação ao tempo.\n\nPasso 2: Primeira derivada (vetor velocidade): v(t) = dr/dt = [d/dt (2t³)] i + [d/dt (5t)] j = (6t²) i + 5 j.\n\nPasso 3: Segunda derivada (vetor aceleração): a(t) = dv/dt = [d/dt (6t²)] i + [d/dt (5)] j = (12t) i + 0 j = (12t) i.\n\nPasso 4: Avaliamos o vetor aceleração em t = 2 s: a(2) = 12 * 2 i = 24 i m/s².\nO módulo do vetor a(2) é simplesmente 24 m/s².'
    }
  ],
  'phys-2': [
    {
      id: 'q-phys-2-1',
      questionText: 'Dois blocos A (mA = 3 kg) e B (mB = 2 kg) estão em contato sobre um plano horizontal perfeitamente liso. Uma força externa constante F = 10 N empurra o bloco A horizontalmente contra B. Qual o módulo da força de contato exercida de A sobre B?',
      options: ['10 N', '6 N', '4 N', '2 N'],
      correctOptionIndex: 2,
      explanation: 'Passo 1: Como não há atrito, os dois blocos se movem juntos com a mesma aceleração (a). Aplicando a 2ª Lei de Newton ao sistema completo: F = (mA + mB) * a.\n\nPasso 2: Calculamos a aceleração do conjunto: 10 = (3 + 2) * a => 10 = 5a => a = 2 m/s².\n\nPasso 3: Isolamos o bloco B para analisar as forças que atuam nele. A única força horizontal que atua no bloco B é a força de contato F_AB exercida pelo bloco A.\n\nPasso 4: Aplicamos a 2ª Lei de Newton para o bloco B: F_AB = mB * a = 2 kg * 2 m/s² = 4 N.'
    },
    {
      id: 'q-phys-2-2',
      questionText: 'Um bloco desce um plano inclinado rígido de inclinação θ com a horizontal sob velocidade constante. Determine o coeficiente de atrito cinético (μc) entre as superfícies.',
      options: ['sen(θ)', 'cos(θ)', 'tan(θ)', '1 / tan(θ)'],
      correctOptionIndex: 2,
      explanation: 'Passo 1: Velocidade constante significa que a aceleração é zero. Pela 1ª Lei de Newton, a força resultante é nula (Fr = 0).\n\nPasso 2: Decompomos as forças. No eixo perpendicular ao plano inclinado, temos Equilíbrio: N = P * cos(θ), onde N é a normal e P é o peso.\n\nPasso 3: No eixo paralelo ao plano, o componente do peso que puxa para baixo é P * sen(θ) e a força de atrito que se opõe é fat = μc * N.\nComo Fr = 0 no movimento ao longo do plano: P * sen(θ) - fat = 0 => P * sen(θ) = μc * N.\n\nPasso 4: Substituímos a normal N na igualdade: P * sen(θ) = μc * P * cos(θ). Simplificamos o peso P de ambos os lados: sen(θ) = μc * cos(θ) => μc = sen(θ) / cos(θ) = tan(θ).'
    }
  ],
  'phys-3': [
    {
      id: 'q-phys-3-1',
      questionText: 'A energia potencial de uma partícula sob a ação de uma força conservativa unidimensional é descrita por U(x) = x² - 4x (em Joules). Encontre a força resultante F(x) atuando sobre a partícula no ponto x = 3 m.',
      options: ['-2 N', '2 N', '3 N', '-3 N'],
      correctOptionIndex: 0,
      explanation: 'Passo 1: Em sistemas conservativos, a força está relacionada ao gradiente da energia potencial pela relação: F(x) = -dU/dx.\n\nPasso 2: Calculamos a derivada da função energia potencial U(x) em relação a x: dU/dx = d/dx (x² - 4x) = 2x - 4.\n\nPasso 3: Aplicamos o sinal negativo para obter a função da força: F(x) = -(2x - 4) = 4 - 2x.\n\nPasso 4: Substituímos a posição x = 3 m na equação de força obtida: F(3) = 4 - 2*(3) = 4 - 6 = -2 N.'
    },
    {
      id: 'q-phys-3-2',
      questionText: 'Um bloco de massa m é solto a partir do repouso de uma altura h em uma rampa sem atrito. Ao final da rampa, o bloco colide de forma ideal com uma mola linear de constante elástica k disposta no plano horizontal. Qual o valor da compressão máxima x da mola?',
      options: ['√(2mgh / k)', '√(mgh / k)', '2mgh / k', '√(mgh / 2k)'],
      correctOptionIndex: 0,
      explanation: 'Passo 1: Como o sistema não tem atrito nem forças dissipativas, a energia mecânica total se conserva (Em_inicial = Em_final).\n\nPasso 2: Na posição inicial (topo da rampa), a energia mecânica é puramente potencial gravitacional: Em_inicial = m * g * h.\n\nPasso 3: No ponto de compressão máxima da mola, o bloco para momentaneamente, o que zera sua energia cinética. Toda a energia se transformou em energia potencial elástica acumulada na mola: Em_final = 1/2 * k * x².\n\nPasso 4: Igualamos as energias: m * g * h = 1/2 * k * x² => 2mgh = k * x² => x² = 2mgh / k => x = √(2mgh / k).'
    }
  ]
};
