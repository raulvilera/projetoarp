export type Question = {
  id: string;
  text: string;
};

export type Section = {
  id: number;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
};

export const likertOptions = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Raramente" },
  { value: 2, label: "Ocasionalmente" },
  { value: 3, label: "Frequentemente" },
  { value: 4, label: "Sempre" },
];

export const sections: Section[] = [
  {
    id: 1,
    title: "Assédio",
    description:
      "Avaliar a severidade/gravidade e probabilidade de ocorrência do risco de assédio.",
    icon: "🛡️",
    questions: [
      { id: "1.1", text: "Você já presenciou ou sofreu comentários ofensivos, piadas ou insinuações inadequadas no ambiente de trabalho?" },
      { id: "1.2", text: "Você se sente à vontade para relatar situações de assédio moral ou sexual na empresa sem medo de represálias?" },
      { id: "1.3", text: "Existe um canal seguro e sigiloso para denunciar assédio na empresa?" },
      { id: "1.4", text: "Você já recebeu tratamento desrespeitoso ou humilhante de colegas ou superiores?" },
      { id: "1.5", text: "Você sente que há favoritismo ou perseguição por parte da liderança?" },
      { id: "1.6", text: "Há casos conhecidos de assédio moral ou sexual que não foram devidamente investigados ou punidos?" },
      { id: "1.7", text: "A empresa realiza treinamentos ou campanhas de conscientização sobre assédio?" },
      { id: "1.8", text: "O RH e os gestores demonstram comprometimento real com a prevenção do assédio?" },
      { id: "1.9", text: "Você já foi forçado(a) a realizar tarefas humilhantes ou degradantes?" },
      { id: "1.10", text: "Existe uma cultura de 'brincadeiras' que desrespeitam funcionários? Já foi vítima de alguma delas?" },
    ],
  },
  {
    id: 2,
    title: "Carga Excessiva de Trabalho",
    description:
      "Avaliar a severidade/gravidade e probabilidade de ocorrência do risco de exaustão por carga excessiva de trabalho.",
    icon: "⚡",
    questions: [
      { id: "2.1", text: "Você sente que sua carga de trabalho diária é superior à sua capacidade de execução dentro do horário normal?" },
      { id: "2.2", text: "Você frequentemente precisa fazer horas extras ou levar trabalho para casa?" },
      { id: "2.3", text: "As demandas e prazos estabelecidos são realistas e atingíveis?" },
      { id: "2.4", text: "Você sente que a empresa respeita seus limites físicos e mentais?" },
      { id: "2.5", text: "Você recebe pausas adequadas ao longo do dia?" },
      { id: "2.6", text: "Existe um equilíbrio entre tarefas administrativas e operacionais?" },
      { id: "2.7", text: "Há redistribuição de tarefas quando há sobrecarga em algum setor ou equipe?" },
      { id: "2.8", text: "Você já teve sintomas físicos ou emocionais (como ansiedade, exaustão, insônia) devido ao excesso de trabalho?" },
      { id: "2.9", text: "Existe flexibilidade para gerenciar sua própria carga de trabalho?" },
      { id: "2.10", text: "A equipe é dimensionada (quantidade necessária de funcionários por função) corretamente para a demanda da empresa?" },
    ],
  },
  {
    id: 3,
    title: "Reconhecimento e Recompensas",
    description:
      "Avaliar a severidade/gravidade e probabilidade de ocorrência do risco de desmotivação e tristeza pela falta de reconhecimento e recompensas.",
    icon: "🏆",
    questions: [
      { id: "3.1", text: "Você sente que seu esforço e desempenho são reconhecidos pela liderança?" },
      { id: "3.2", text: "A empresa possui políticas claras de promoção e progressão de carreira?" },
      { id: "3.3", text: "As avaliações de desempenho são justas e transparentes?" },
      { id: "3.4", text: "Você sente que há igualdade no reconhecimento entre diferentes áreas ou equipes?" },
      { id: "3.5", text: "A empresa oferece incentivos financeiros ou não financeiros pelo bom desempenho?" },
      { id: "3.6", text: "Você recebe feedback construtivo regularmente?" },
      { id: "3.7", text: "Existe uma cultura de valorização dos funcionários?" },
      { id: "3.8", text: "Você já se sentiu desmotivado(a) por falta de reconhecimento?" },
      { id: "3.9", text: "A empresa celebra conquistas individuais e coletivas?" },
      { id: "3.10", text: "O plano de benefícios da empresa é condizente com suas necessidades e expectativas?" },
    ],
  },
  {
    id: 4,
    title: "Clima Organizacional",
    description:
      "Avaliar as características do clima organizacional que contribuem para o bem-estar emocional dos colaboradores.",
    icon: "🌤️",
    questions: [
      { id: "4.1", text: "O ambiente de trabalho é amigável e colaborativo?" },
      { id: "4.2", text: "Existe um sentimento de confiança entre os colegas de trabalho?" },
      { id: "4.3", text: "Você se sente confortável para expressar suas opiniões na equipe?" },
      { id: "4.4", text: "Os gestores promovem um ambiente saudável e respeitoso?" },
      { id: "4.5", text: "Existe transparência na comunicação da empresa?" },
      { id: "4.6", text: "Você sente que pode contar com seus colegas em momentos de dificuldade?" },
      { id: "4.7", text: "Há um senso de propósito e pertencimento entre os funcionários?" },
      { id: "4.8", text: "Conflitos são resolvidos de forma justa e eficiente?" },
      { id: "4.9", text: "O ambiente físico do local de trabalho é confortável e seguro?" },
      { id: "4.10", text: "A cultura organizacional da empresa está alinhada com seus valores pessoais?" },
    ],
  },
  {
    id: 5,
    title: "Autonomia e Controle sobre o Trabalho",
    description:
      "Avaliar as características dos processos de trabalho, a fim de averiguar o nível de conforto e liberdade dos colaboradores ao desempenhar suas atividades.",
    icon: "🎯",
    questions: [
      { id: "5.1", text: "Você tem liberdade para tomar decisões sobre suas tarefas diárias?" },
      { id: "5.2", text: "Seu trabalho permite flexibilidade para adaptar sua rotina conforme necessário?" },
      { id: "5.3", text: "Você sente que tem voz ativa na empresa?" },
      { id: "5.4", text: "A empresa confia em sua capacidade de autogestão?" },
      { id: "5.5", text: "Você recebe instruções claras sobre suas responsabilidades?" },
      { id: "5.6", text: "O excesso de controle ou burocracia interfere no seu desempenho?" },
      { id: "5.7", text: "Suas sugestões são ouvidas e consideradas pela liderança?" },
      { id: "5.8", text: "Você tem acesso às ferramentas e recursos necessários para desempenhar bem seu trabalho?" },
      { id: "5.9", text: "Você sente que pode propor melhorias sem medo de represálias?" },
      { id: "5.10", text: "O excesso de supervisão impacta sua produtividade ou bem-estar?" },
    ],
  },
  {
    id: 6,
    title: "Pressão e Metas",
    description:
      "Avaliar como as metas de trabalho afetam a saúde mental dos colaboradores.",
    icon: "📊",
    questions: [
      { id: "6.1", text: "As metas da empresa são realistas e atingíveis?" },
      { id: "6.2", text: "Você sente que há pressão excessiva para alcançar resultados?" },
      { id: "6.3", text: "A cobrança por metas impacta sua saúde mental ou emocional?" },
      { id: "6.4", text: "Existe apoio da liderança para lidar com desafios relacionados às metas?" },
      { id: "6.5", text: "Você sente que pode negociar prazos ou objetivos quando necessário?" },
      { id: "6.6", text: "A competitividade entre os funcionários é estimulada de maneira saudável?" },
      { id: "6.7", text: "Você já sentiu medo de punição por não atingir metas?" },
      { id: "6.8", text: "O sistema de avaliação de metas é transparente?" },
      { id: "6.9", text: "Você tem tempo suficiente para cumprir suas demandas com qualidade?" },
      { id: "6.10", text: "A pressão por resultados impacta negativamente o ambiente de trabalho?" },
    ],
  },
  {
    id: 7,
    title: "Insegurança e Ameaças",
    description:
      "Avaliar o nível de sentimento de insegurança e a presença de fatores ameaçadores à estabilidade emocional dos colaboradores.",
    icon: "🔒",
    questions: [
      { id: "7.1", text: "Você já sentiu que seu emprego está ameaçado sem justificativa clara?" },
      { id: "7.2", text: "A empresa faz cortes ou demissões repentinas sem aviso prévio?" },
      { id: "7.3", text: "Há comunicação clara sobre a estabilidade da empresa e dos empregos?" },
      { id: "7.4", text: "Você já sofreu ameaças veladas ou diretas no ambiente de trabalho?" },
      { id: "7.5", text: "Você sente que há transparência nas políticas de desligamento?" },
      { id: "7.6", text: "Mudanças organizacionais impactaram seu sentimento de segurança no trabalho?" },
      { id: "7.7", text: "Você já presenciou casos de demissões injustas?" },
      { id: "7.8", text: "O medo da demissão afeta seu desempenho?" },
      { id: "7.9", text: "A empresa oferece suporte psicológico para funcionários inseguros?" },
      { id: "7.10", text: "Você já evitou expressar sua opinião por medo de represálias?" },
    ],
  },
  {
    id: 8,
    title: "Conflitos Interpessoais e Falta de Comunicação",
    description:
      "Identificar a presença e severidade de possíveis conflitos no ambiente de trabalho e prejuízos devido à falta de comunicação.",
    icon: "💬",
    questions: [
      { id: "8.1", text: "Conflitos internos são resolvidos de maneira justa?" },
      { id: "8.2", text: "A comunicação entre equipes e departamentos é eficiente?" },
      { id: "8.3", text: "Você já evitou colegas ou superiores devido a desentendimentos?" },
      { id: "8.4", text: "Existe um canal aberto para feedback entre colaboradores e liderança?" },
      { id: "8.5", text: "A falta de comunicação já comprometeu seu trabalho?" },
      { id: "8.6", text: "Você sente que há rivalidade desnecessária entre setores?" },
      { id: "8.7", text: "Há treinamentos sobre comunicação assertiva e gestão de conflitos?" },
      { id: "8.8", text: "Você sente que pode expressar suas dificuldades sem ser julgado?" },
      { id: "8.9", text: "A empresa promove um ambiente de diálogo aberto?" },
      { id: "8.10", text: "O RH está presente e atuante na mediação de conflitos?" },
    ],
  },
  {
    id: 9,
    title: "Alinhamento entre Vida Pessoal e Profissional",
    description:
      "Avaliar o nível de conciliação entre vida pessoal e profissional dos trabalhadores, mediante as condições de trabalho impostas.",
    icon: "⚖️",
    questions: [
      { id: "9.1", text: "Você sente que a sua jornada de trabalho permite equilíbrio com sua vida pessoal?" },
      { id: "9.2", text: "Você sente que tem tempo para sua família e lazer?" },
      { id: "9.3", text: "O trabalho impacta negativamente sua saúde mental?" },
      { id: "9.4", text: "Você tem flexibilidade para lidar com questões pessoais urgentes?" },
      { id: "9.5", text: "A empresa oferece suporte para equilíbrio entre trabalho e vida pessoal?" },
      { id: "9.6", text: "Você consegue se desconectar do trabalho fora do expediente?" },
      { id: "9.7", text: "Você sente que sua vida pessoal é respeitada pela empresa?" },
      { id: "9.8", text: "Há incentivo ao bem-estar e qualidade de vida no trabalho?" },
      { id: "9.9", text: "O estresse profissional afeta sua vida familiar?" },
      { id: "9.10", text: "O ambiente corporativo valoriza o descanso e recuperação dos funcionários?" },
    ],
  },
];
