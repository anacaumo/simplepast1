/* =====================================================================
   QUESTION BANK  ·  edit THIS file for each class / semester
   The game engine (game.js) never needs to change.

   MULTIPLE_CHOICE  { topic, q, options: [4 strings], answer, why, keepOrder? }
     - every question must have exactly OPTIONS_PER_QUESTION options
     - "answer" must be written exactly like one of the options
     - keepOrder: true  → options are NOT shuffled (good for numbers)

   TRUE_FALSE       { topic, q, answer: true | false, why }
     - keep the number of true and false statements EQUAL, so each team
       gets a balanced mix of true and false statements

   "topic" is a short id for the fact being tested. The game avoids using
   two questions with the same topic in one game (so one question doesn't
   give away the answer to another).
   "why" is the explanation shown when the feedback is revealed.
   ===================================================================== */

const GAME_TITLE = "Was or Were?";
const OPTIONS_PER_QUESTION = 4;

const MULTIPLE_CHOICE = [

  /* ---------- was / were / wasn't / weren't ---------- */
  {
    topic: "freddie-born-zanzibar",
    q: "Freddie Mercury ______ born in Zanzibar.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "Freddie Mercury = he → WAS. A frase é afirmativa: ele nasceu em Zanzibar."
  },
  {
    topic: "ella-apollo-17",
    q: "Ella Fitzgerald ______ 17 years old when she sang at the Apollo Theater.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "Ella = she → WAS. Para idade, usamos be: She was 17 (ela tinha 17 anos)."
  },
  {
    topic: "tina-ike-duo",
    q: "Tina Turner and Ike Turner ______ a famous duo.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "were",
    why: "Tina and Ike = they → WERE. Eles eram uma dupla famosa."
  },
  {
    topic: "prince-cash-brazilian",
    q: "Prince and Johnny Cash ______ Brazilian. They were American.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "weren't",
    why: "Dois sujeitos (they) + frase negativa → WEREN'T. Eles eram americanos, não brasileiros."
  },
  {
    topic: "barbra-born",
    q: "Barbra Streisand ______ born in Chicago. She was born in Brooklyn.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "wasn't",
    why: "Barbra = she + frase negativa → WASN'T. Ela nasceu no Brooklyn, não em Chicago."
  },
  {
    topic: "dolly-9to5",
    q: "In 1980, Dolly Parton ______ in the film “9 to 5”.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "Dolly Parton = she → WAS. Em 1980 ela estava no filme “9 to 5”."
  },
  {
    topic: "elis-rita-brazil",
    q: "Elis Regina and Rita Lee ______ born in Brazil.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "were",
    why: "Elis and Rita = they → WERE. As duas nasceram no Brasil."
  },
  {
    topic: "tim-born",
    q: "Tim Maia ______ born in São Paulo. He was born in Rio de Janeiro.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "wasn't",
    why: "Tim Maia = he + frase negativa → WASN'T. Ele nasceu no Rio de Janeiro (Tijuca)."
  },
  {
    topic: "louis-trumpeter",
    q: "Louis Armstrong ______ a trumpeter and a singer.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "Louis Armstrong = he → WAS. Ele era trompetista e cantor."
  },
  {
    topic: "cash-folsom",
    q: "In 1968, Johnny Cash ______ in Folsom Prison (inside a prison!).",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "Johnny Cash = he → WAS. Em 1968 ele estava na prisão de Folsom, onde gravou um álbum."
  },

  /* ---------- questions and short answers ---------- */
  {
    topic: "cash-born",
    q: "______ Johnny Cash born in Arkansas?",
    options: ["Was", "Were", "Did", "Do"],
    answer: "Was",
    why: "Pergunta com be: WAS + he/she/it + ...? Johnny Cash = he → Was Johnny Cash born...? (Sim, ele nasceu em Kingsland, Arkansas.)"
  },
  {
    topic: "prince-elton-singers",
    q: "______ Prince and Elton John singers?",
    options: ["Were", "Was", "Did", "Do"],
    answer: "Were",
    why: "Pergunta com be: WERE + they/we/you + ...? Prince and Elton = they → Were Prince and Elton singers?"
  },
  {
    topic: "louis-trumpeter",
    q: "Was Louis Armstrong a trumpeter? Yes, he ______.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "A resposta curta repete o verbo da pergunta: Was...? → Yes, he WAS."
  },
  {
    topic: "prince-elton-singers",
    q: "Were Prince and Elton John singers? Yes, they ______.",
    options: ["were", "was", "weren't", "wasn't"],
    answer: "were",
    why: "A resposta curta repete o verbo da pergunta: Were...? → Yes, they WERE."
  },
  {
    topic: "tim-born",
    q: "Was Tim Maia born in São Paulo? No, he ______. (He was born in Rio.)",
    options: ["wasn't", "weren't", "was", "were"],
    answer: "wasn't",
    why: "Resposta curta negativa: No, he WASN'T. Tim Maia nasceu no Rio de Janeiro."
  },

  /* ---------- there was / there were ---------- */
  {
    topic: "dolly-12-kids",
    q: "In Dolly Parton's family, there ______ 12 children.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "were",
    why: "THERE + WERE + 2 ou mais coisas: 12 children → were."
  },
  {
    topic: "queen-four",
    q: "In the band Queen, there ______ four musicians.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "were",
    why: "THERE + WERE + 2 ou mais coisas: four musicians → were."
  },
  {
    topic: "zanzibar-1964",
    q: "In 1964, there ______ a revolution in Zanzibar.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "THERE + WAS + 1 coisa: a revolution → was. (A família de Freddie Mercury saiu de Zanzibar.)"
  },
  {
    topic: "wembley-concert",
    q: "In 1985, there ______ a huge concert at Wembley: Live Aid.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "was",
    why: "THERE + WAS + 1 coisa: a huge concert → was."
  },
  {
    topic: "wembley-people",
    q: "There ______ thousands of people at Wembley.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "were",
    why: "THERE + WERE + várias coisas: thousands of people → were."
  },
  {
    topic: "tim-19-kids",
    q: "There ______ 19 children in Tim Maia's family.",
    options: ["was", "were", "wasn't", "weren't"],
    answer: "were",
    why: "THERE + WERE + várias coisas: 19 children → were."
  },

  /* ---------- there / they / it ---------- */
  {
    topic: "queen-four",
    q: "Queen was a famous band. ______ were four musicians in it.",
    options: ["There", "They", "It", "He"],
    answer: "There",
    why: "THERE + were = “havia”. THERE não é “they”! O verbo concorda com o que vem depois: four musicians."
  },
  {
    topic: "elton-taupin",
    q: "Elton John and Bernie Taupin were songwriting partners. ______ were friends too.",
    options: ["They", "There", "It", "He"],
    answer: "They",
    why: "THEY = as pessoas que já citamos (Elton e Bernie). THERE significaria “havia”."
  },

  /* ---------- facts from the Artist Cards ---------- */
  {
    topic: "barbra-born",
    q: "Where was Barbra Streisand born?",
    options: ["Brooklyn", "Chicago", "Los Angeles", "Nashville"],
    answer: "Brooklyn",
    why: "Barbra Streisand was born in Brooklyn, New York, in 1942."
  },
  {
    topic: "elis-born",
    q: "Where was Elis Regina born?",
    options: ["Porto Alegre", "Rio de Janeiro", "São Paulo", "Salvador"],
    answer: "Porto Alegre",
    why: "Elis Regina was born in Porto Alegre, Rio Grande do Sul, in 1945."
  },
  {
    topic: "prince-first-song-age",
    q: "How old was Prince when he wrote his first song?",
    options: ["5", "7", "12", "17"],
    keepOrder: true,
    answer: "7",
    why: "Prince was seven years old when he wrote his first song, on his father's piano."
  },
  {
    topic: "ella-apollo-17",
    q: "How old was Ella Fitzgerald when she sang at the Apollo Theater?",
    options: ["12", "17", "25", "30"],
    keepOrder: true,
    answer: "17",
    why: "Em 1934, aos 17 anos, Ella cantou no Apollo Theater (Amateur Night), no Harlem."
  },
  {
    topic: "louis-cornet",
    q: "What was Louis Armstrong's first instrument?",
    options: ["the cornet", "the piano", "the guitar", "the drums"],
    answer: "the cornet",
    why: "His first instrument was the cornet. Ele aprendeu a tocar na banda do Colored Waif's Home."
  },
  {
    topic: "prince-first-song",
    q: "What was Prince's first song?",
    options: ["“Funk Machine”", "“Purple Rain”", "“Kiss”", "“1999”"],
    answer: "“Funk Machine”",
    why: "His first song was “Funk Machine”. As outras são músicas famosas dele, mas vieram depois."
  },
  {
    topic: "queen-four",
    q: "How many musicians were there in Queen?",
    options: ["three", "four", "five", "six"],
    keepOrder: true,
    answer: "four",
    why: "There were four musicians in Queen: Freddie, Brian May, Roger Taylor and John Deacon."
  },
  {
    topic: "tim-19-kids",
    q: "How many children were there in Tim Maia's family?",
    options: ["9", "12", "19", "29"],
    keepOrder: true,
    answer: "19",
    why: "There were 19 children in Tim Maia's family. (12 é o número de filhos da família de Dolly Parton.)"
  },
  {
    topic: "ella-nickname",
    q: "What was Ella Fitzgerald's nickname?",
    options: ["“the First Lady of Song”", "“the Queen of Soul”", "“the Queen of Pop”", "“the Queen of Rock”"],
    answer: "“the First Lady of Song”",
    why: "Her nickname was “the First Lady of Song”."
  },
  {
    topic: "freddie-real-name",
    q: "What was Freddie Mercury's real name?",
    options: ["Farrokh Bulsara", "Reginald Dwight", "Anna Mae Bullock", "Sebastião Maia"],
    answer: "Farrokh Bulsara",
    why: "O nome verdadeiro de Freddie era Farrokh Bulsara. Reginald Dwight é Elton John, Anna Mae Bullock é Tina Turner e Sebastião Maia é Tim Maia."
  },
  {
    topic: "rita-parents",
    q: "Rita Lee's mother was a ______.",
    options: ["pianist", "dentist", "singer", "teacher"],
    answer: "pianist",
    why: "Her father was a dentist and her mother was a pianist."
  },
  {
    topic: "clube-do-guri",
    q: "What was “Clube do Guri”?",
    options: ["a children's radio show", "a football team", "a TV cooking show", "a music school"],
    answer: "a children's radio show",
    why: "“Clube do Guri” was a children's radio show, and Elis Regina sang on it."
  },
  {
    topic: "cash-born",
    q: "In which US state was Johnny Cash born?",
    options: ["Arkansas", "Tennessee", "Texas", "Alabama"],
    answer: "Arkansas",
    why: "Johnny Cash was born in Kingsland, Arkansas, in 1932."
  },
  {
    topic: "freddie-born-zanzibar",
    q: "Where was Freddie Mercury born?",
    options: ["Zanzibar", "England", "India", "Switzerland"],
    answer: "Zanzibar",
    why: "Freddie Mercury was born in Stone Town, Zanzibar. A família se mudou para a Inglaterra em 1964."
  },
  {
    topic: "louis-born",
    q: "Where was Louis Armstrong born?",
    options: ["New Orleans", "Chicago", "New York", "Memphis"],
    answer: "New Orleans",
    why: "Louis Armstrong was born in New Orleans, Louisiana. Ele se mudou para Chicago em 1922."
  }
];

const TRUE_FALSE = [

  /* ---------- TRUE statements ---------- */
  {
    topic: "freddie-born-zanzibar",
    q: "Freddie Mercury was born in Zanzibar.",
    answer: true,
    why: "Verdadeiro. Ele nasceu em Stone Town, Zanzibar."
  },
  {
    topic: "ella-apollo-17",
    q: "Ella Fitzgerald was 17 years old when she sang at the Apollo Theater.",
    answer: true,
    why: "Verdadeiro. Foi em 1934, quando ela tinha 17 anos."
  },
  {
    topic: "elton-piano-7",
    q: "Elton John was seven years old when he started piano lessons.",
    answer: true,
    why: "Verdadeiro. Ele começou as aulas de piano aos 7 anos."
  },
  {
    topic: "dolly-9to5",
    q: "In 1980, Dolly Parton was in the film “9 to 5”.",
    answer: true,
    why: "Verdadeiro. Em 1980 ela atuou no filme e escreveu a música-tema."
  },
  {
    topic: "tina-ike-duo",
    q: "Tina Turner and Ike Turner were a famous duo.",
    answer: true,
    why: "Verdadeiro. Tina and Ike = they → were."
  },
  {
    topic: "rita-parents",
    q: "Rita Lee's father was a dentist and her mother was a pianist.",
    answer: true,
    why: "Verdadeiro. Her father was a dentist and her mother was a pianist."
  },
  {
    topic: "elis-born",
    q: "Elis Regina was born in Porto Alegre.",
    answer: true,
    why: "Verdadeiro. Elis Regina nasceu em Porto Alegre, em 1945."
  },
  {
    topic: "tim-born",
    q: "Tim Maia wasn't born in São Paulo. He was born in Rio de Janeiro.",
    answer: true,
    why: "Verdadeiro. Tim Maia nasceu no Rio de Janeiro (Tijuca), não em São Paulo."
  },
  {
    topic: "cash-parents",
    q: "Johnny Cash's parents were poor cotton farmers.",
    answer: true,
    why: "Verdadeiro. His parents were poor cotton farmers."
  },
  {
    topic: "louis-cornet",
    q: "Louis Armstrong's first instrument was the cornet.",
    answer: true,
    why: "Verdadeiro. A cornet é parecida com um trompete."
  },
  {
    topic: "ella-nickname",
    q: "Ella Fitzgerald's nickname was “the First Lady of Song”.",
    answer: true,
    why: "Verdadeiro. Esse era o apelido dela."
  },
  {
    topic: "tim-19-kids",
    q: "There were 19 children in Tim Maia's family.",
    answer: true,
    why: "Verdadeiro. There were 19 children in his family."
  },
  {
    topic: "prince-cash-brazilian",
    q: "Prince and Johnny Cash weren't Brazilian.",
    answer: true,
    why: "Verdadeiro. Os dois eram americanos."
  },
  {
    topic: "clube-do-guri",
    q: "“Clube do Guri” was a children's radio show.",
    answer: true,
    why: "Verdadeiro. Elis Regina cantou nesse programa quando era criança."
  },
  {
    topic: "roslyn-kind",
    q: "Barbra Streisand's half-sister, Roslyn Kind, was a singer too.",
    answer: true,
    why: "Verdadeiro. Roslyn Kind também era cantora."
  },
  {
    topic: "elton-taupin",
    q: "Elton John and Bernie Taupin were songwriting partners.",
    answer: true,
    why: "Verdadeiro. Bernie Taupin era o letrista e parceiro de composição de Elton John."
  },
  {
    topic: "freddie-age-death",
    q: "Freddie Mercury was 45 years old when he died.",
    answer: true,
    why: "Verdadeiro. Ele morreu em 1991, aos 45 anos."
  },
  {
    topic: "tina-real-name",
    q: "Tina Turner's real name was Anna Mae Bullock.",
    answer: true,
    why: "Verdadeiro. Tina Turner nasceu Anna Mae Bullock."
  },
  {
    topic: "elis-rita-brazil",
    q: "Elis Regina and Rita Lee were born in Brazil.",
    answer: true,
    why: "Verdadeiro. Elis nasceu em Porto Alegre e Rita Lee em São Paulo."
  },
  {
    topic: "zanzibar-1964",
    q: "In 1964, there was a revolution in Zanzibar.",
    answer: true,
    why: "Verdadeiro. Depois da revolução, a família de Freddie Mercury saiu de Zanzibar."
  },
  {
    topic: "grammar-were-plural",
    q: "We use WERE with “you”, “we” and “they”.",
    answer: true,
    why: "Verdadeiro. you / we / they + WERE. (I / he / she / it + WAS.)"
  },
  {
    topic: "louis-trumpeter",
    q: "This question and short answer are correct: “Was Louis Armstrong a trumpeter? Yes, he was.”",
    answer: true,
    why: "Verdadeiro. Was + he...? → Yes, he was."
  },

  /* ---------- FALSE statements ---------- */
  {
    topic: "barbra-born",
    q: "Barbra Streisand was born in Chicago.",
    answer: false,
    why: "Falso. Ela nasceu no Brooklyn, New York."
  },
  {
    topic: "cash-born",
    q: "Johnny Cash was born in Texas.",
    answer: false,
    why: "Falso. Ele nasceu em Kingsland, Arkansas."
  },
  {
    topic: "freddie-real-name",
    q: "Freddie Mercury's real name was Reginald Dwight.",
    answer: false,
    why: "Falso. Reginald Dwight é o nome verdadeiro de Elton John. O de Freddie era Farrokh Bulsara."
  },
  {
    topic: "queen-four",
    q: "There were five musicians in the band Queen.",
    answer: false,
    why: "Falso. There were four musicians in Queen."
  },
  {
    topic: "prince-first-song-age",
    q: "Prince was 12 years old when he wrote his first song.",
    answer: false,
    why: "Falso. Ele tinha 7 anos quando escreveu sua primeira música."
  },
  {
    topic: "louis-trumpeter",
    q: "Louis Armstrong was a pianist.",
    answer: false,
    why: "Falso. Louis Armstrong was a trumpeter and a singer."
  },
  {
    topic: "prince-first-song",
    q: "Prince's first song was “Purple Rain”.",
    answer: false,
    why: "Falso. His first song was “Funk Machine”."
  },
  {
    topic: "rita-born",
    q: "Rita Lee was born in Rio de Janeiro.",
    answer: false,
    why: "Falso. Rita Lee nasceu em São Paulo."
  },
  {
    topic: "singers-negative",
    q: "Dolly Parton and Elton John weren't singers.",
    answer: false,
    why: "Falso. Os dois eram cantores: they WERE singers."
  },
  {
    topic: "brazilian-artists",
    q: "Tim Maia and Elis Regina weren't Brazilian.",
    answer: false,
    why: "Falso. Os dois eram brasileiros."
  },
  {
    topic: "prince-1984-film",
    q: "In 1984, Prince was in the film “9 to 5”.",
    answer: false,
    why: "Falso. Em 1984 ele estrelou “Purple Rain”. “9 to 5” é o filme de Dolly Parton."
  },
  {
    topic: "dolly-12-kids",
    q: "There were six children in Dolly Parton's family.",
    answer: false,
    why: "Falso. There were 12 children in her family."
  },
  {
    topic: "elton-first-instrument",
    q: "Elton John's first instrument was the guitar.",
    answer: false,
    why: "Falso. His first instrument was the piano."
  },
  {
    topic: "elis-age-death",
    q: "Elis Regina was 60 years old when she died.",
    answer: false,
    why: "Falso. Ela morreu em 1982, aos 36 anos."
  },
  {
    topic: "louis-born",
    q: "Louis Armstrong was born in Chicago.",
    answer: false,
    why: "Falso. Ele nasceu em New Orleans. Se mudou para Chicago em 1922."
  },
  {
    topic: "tina-born",
    q: "Tina Turner was born in London.",
    answer: false,
    why: "Falso. Ela nasceu em Brownsville, Tennessee (EUA)."
  },
  {
    topic: "rita-band",
    q: "Rita Lee was a member of the band Queen.",
    answer: false,
    why: "Falso. Rita Lee was a member of the band Os Mutantes."
  },
  {
    topic: "dolly-born",
    q: "Dolly Parton was born in Nashville.",
    answer: false,
    why: "Falso. Ela nasceu em Pittman Center, Tennessee, e se mudou para Nashville em 1964."
  },
  {
    topic: "grammar-he-were",
    q: "This sentence is correct: “Freddie Mercury were born in Zanzibar.”",
    answer: false,
    why: "Falso. Freddie Mercury = he → WAS, não were."
  },
  {
    topic: "grammar-yes-they-was",
    q: "This short answer is correct: “Were Prince and Elton singers? Yes, they was.”",
    answer: false,
    why: "Falso. A resposta curta repete o verbo: Were...? → Yes, they WERE."
  },
  {
    topic: "grammar-there-was-thousands",
    q: "This sentence is correct: “There was thousands of people at Wembley.”",
    answer: false,
    why: "Falso. thousands of people (vários) → There WERE thousands of people."
  },
  {
    topic: "grammar-werent-singular",
    q: "We use WEREN'T with “he”, “she” and “it”.",
    answer: false,
    why: "Falso. he / she / it → WASN'T. (you / we / they → weren't.)"
  }
];
