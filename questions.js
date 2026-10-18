/* =====================================================================
   QUESTION BANK  ·  edit THIS file for each class / semester
   The game engine (game.js) never needs to change.

   LEVELS  (see below the header)  every question can have  level: 1 | 2 | 3
     level 1 = was / were · level 2 = regular verbs (started, moved) ·
     level 3 = irregular verbs (sang, wrote, won). No "level" → level 1.
     A game on level N uses the questions of level N and lower. Keep the
     number of TRUE and FALSE statements equal inside EACH level, so every
     level stays balanced (the game warns you if they are not).

   MULTIPLE_CHOICE  { topics, level?, q, options: [4 strings], answer, why, keepOrder? }
     - every question must have exactly OPTIONS_PER_QUESTION options
     - "answer" must be written exactly like one of the options
     - keepOrder: true  → options are NOT shuffled (good for numbers)

   TRUE_FALSE       { topics, level?, q, answer: true | false, why, labels? }
     - keep the number of true and false statements EQUAL, so each team
       gets a balanced mix of true and false statements
     - labels: ["CORRECT", "INCORRECT"]  → the two buttons say CORRECT /
       INCORRECT instead of TRUE / FALSE. Use it when students judge a
       sentence ("Freddie Mercury were born in Zanzibar."). answer: true
       means the first label (CORRECT) is the right button.
     - prompt: "Is the GRAMMAR correct?"  → an instruction line shown above
       the sentence. Use it together with labels, so students know what
       CORRECT / INCORRECT refers to (the grammar, not the fact).

   "topics" lists every fact the question states or gives away: in its text,
   in its options, or in its "why" feedback (which the whole class sees).
   The game never puts two questions that share a topic in the same game,
   so one question can't give away the answer to another. If you add a
   question, give it the same topic id as any other question about that fact.
   Topics starting with "verb-" (verb-wrote, verb-moved ...) mark the past
   tense verb a question uses or shows. From level 2 on, the game never puts
   two questions with the same verb in one game, because the correct form
   appears in the other question's options or feedback. Give a new verb
   question the topic "verb-<past form>" too.
   focus: "grammar" | "facts"   (optional) the teacher can play "Grammar only".
     A question is about FACTS when students need to know a fact from the
     cards, not a grammar point. Multiple choice: default is "grammar"; give
     the fact ones  focus: "facts". True/false: a sentence with "labels"
     (CORRECT / INCORRECT) is grammar, a plain TRUE / FALSE statement is
     about facts. Keep TRUE and FALSE equal among the grammar ones too.
   "why" is the explanation shown when the feedback is revealed.
   ===================================================================== */

const GAME_TITLE = "Simple Past Quiz";
const OPTIONS_PER_QUESTION = 4;

/* LEVELS: the teacher picks one on the setup screen. A level includes the
   questions of the levels before it, so level 3 = everything.
   Each question below has  level: 1 | 2 | 3  (no "level" means 1).
   "mix" says how much of a game comes from each kind of question:
   level 3 = 50% irregular verbs (3), 30% regular verbs (2), 20% was / were (1).
   Every team gets exactly the same amount of every kind (fair rounds). */
const LEVELS = [
  { id: 1, name: "Level 1: was / were",                  mix: { 1: 1 } },
  { id: 2, name: "Level 2: was / were + regular verbs",  mix: { 2: 0.6, 1: 0.4 } },
  { id: 3, name: "Level 3: all (+ irregular verbs)",     mix: { 3: 0.5, 2: 0.3, 1: 0.2 } }
];

const MULTIPLE_CHOICE = [

  /* ---------- was / were / wasn't / weren't ---------- */
  {
    topics: ["freddie-born-zanzibar"],
    q: "Freddie Mercury ______ born in Zanzibar.",
    options: ["was", "were", "did", "do"],
    answer: "was",
    why: "Freddie Mercury = he → WAS. “Born” pede be no passado: He was born. (did / do não combinam com “born”.)"
  },

  {
    topics: ["ella-apollo-17", "verb-sang"],
    q: "Ella Fitzgerald ______ 17 years old when she sang at the Apollo Theater.",
    options: ["was", "were", "is", "are"],
    answer: "was",
    why: "Ella = she → WAS. Para idade, usamos be: She was 17. “Sang” está no passado, então was."
  },

  {
    topics: ["tina-ike-duo"],
    q: "In the 1970s, Tina Turner and Ike Turner ______ a famous duo.",
    options: ["was", "were", "is", "are"],
    answer: "were",
    why: "Tina and Ike = they → WERE. “In the 1970s” é passado, então were (não are)."
  },

  {
    topics: ["prince-cash-brazilian"],
    q: "Prince and Johnny Cash ______ Brazilian.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "weren't",
    why: "Prince and Johnny Cash = they → WEREN'T (were + not). Eles eram americanos."
  },

  {
    topics: ["barbra-born", "chicago"],
    q: "Barbra Streisand ______ born in Chicago.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Barbra = she → WASN'T (was + not). Ela nasceu no Brooklyn, não em Chicago."
  },

  {
    topics: ["dolly-9to5"],
    q: "In 1980, Dolly Parton ______ in the film “9 to 5”.",
    options: ["was", "were", "is", "are"],
    answer: "was",
    why: "Dolly Parton = she → WAS. “In 1980” é passado, então was (não is)."
  },

  {
    topics: ["elis-rita-brazil"],
    q: "Elis Regina and Rita Lee ______ born in Brazil.",
    options: ["was", "were", "did", "do"],
    answer: "were",
    why: "Elis and Rita = they → WERE. “Born” pede be no passado: They were born."
  },

  {
    topics: ["tim-born"],
    q: "Tim Maia ______ born in São Paulo.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Tim Maia = he → WASN'T (was + not). Ele nasceu no Rio de Janeiro (Tijuca)."
  },

  {
    topics: ["louis-trumpeter"],
    q: "In the 1950s, Louis Armstrong ______ a trumpeter and a singer.",
    options: ["was", "were", "is", "are"],
    answer: "was",
    why: "Louis Armstrong = he → WAS. “In the 1950s” é passado, então was (não is)."
  },

  {
    topics: ["cash-folsom"],
    q: "In 1968, Johnny Cash ______ in Folsom Prison (inside a prison!).",
    options: ["was", "were", "is", "are"],
    answer: "was",
    why: "Johnny Cash = he → WAS. “In 1968” é passado, então was (não is)."
  },


  /* ---------- questions and short answers ---------- */
  {
    topics: ["cash-born"],
    q: "______ Johnny Cash born in Arkansas?",
    options: ["Was", "Were", "Did", "Do"],
    answer: "Was",
    why: "Pergunta com be: WAS + he/she/it + ...? Johnny Cash = he → Was Johnny Cash born...? (Sim, ele nasceu em Kingsland, Arkansas.)"
  },
  {
    topics: ["prince-elton-singers"],
    q: "______ Prince and Elton John singers?",
    options: ["Were", "Was", "Did", "Do"],
    answer: "Were",
    why: "Pergunta com be: WERE + they/we/you + ...? Prince and Elton = they → Were Prince and Elton singers?"
  },
  {
    topics: ["louis-trumpeter"],
    q: "Was Louis Armstrong a trumpeter? Yes, he ______.",
    options: ["was", "were", "did", "do"],
    answer: "was",
    why: "A resposta curta repete o verbo da pergunta: Was...? → Yes, he WAS."
  },

  {
    topics: ["prince-elton-singers"],
    q: "Were Prince and Elton John singers? Yes, they ______.",
    options: ["were", "was", "did", "do"],
    answer: "were",
    why: "A resposta curta repete o verbo da pergunta: Were...? → Yes, they WERE."
  },

  {
    topics: ["tim-born"],
    q: "Was Tim Maia born in São Paulo? No, he ______.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Resposta curta negativa: No, he WASN'T. Tim Maia nasceu no Rio de Janeiro."
  },


  /* ---------- there was / there were ---------- */
  {
    topics: ["dolly-12-kids", "family-size"],
    q: "In the 1950s, in Dolly Parton's family, there ______ 12 children.",
    options: ["was", "were", "is", "are"],
    answer: "were",
    why: "THERE + WERE + 2 ou mais coisas: 12 children → were. “In the 1950s” é passado (não are)."
  },

  {
    topics: ["queen-four"],
    q: "In 1975, in the band Queen, there ______ four musicians.",
    options: ["was", "were", "is", "are"],
    answer: "were",
    why: "THERE + WERE + 2 ou mais coisas: four musicians → were. “In 1975” é passado (não are)."
  },

  {
    topics: ["zanzibar-1964", "freddie-born-zanzibar"],
    q: "In 1964, there ______ a revolution in Zanzibar.",
    options: ["was", "were", "is", "are"],
    answer: "was",
    why: "THERE + WAS + 1 coisa: a revolution → was. “In 1964” é passado (não is)."
  },

  {
    topics: ["wembley-concert"],
    q: "In 1985, there ______ a huge concert at Wembley: Live Aid.",
    options: ["was", "were", "is", "are"],
    answer: "was",
    why: "THERE + WAS + 1 coisa: a huge concert → was. “In 1985” é passado (não is)."
  },

  {
    topics: ["wembley-people"],
    q: "In 1985, there ______ thousands of people at Wembley.",
    options: ["was", "were", "is", "are"],
    answer: "were",
    why: "THERE + WERE + várias coisas: thousands of people → were. “In 1985” é passado (não are)."
  },

  {
    topics: ["tim-19-kids", "family-size"],
    q: "In the 1940s, there ______ 19 children in Tim Maia's family.",
    options: ["was", "were", "is", "are"],
    answer: "were",
    why: "THERE + WERE + várias coisas: 19 children → were. “In the 1940s” é passado (não are)."
  },


  /* ---------- there / they / it ---------- */

  {
    topics: ["wembley-people", "wembley-concert"],
    q: "There were thousands of people at Wembley. ______ were at the Live Aid concert.",
    options: ["They", "There", "It", "He"],
    answer: "They",
    why: "THEY = as pessoas que já citamos (thousands of people). THERE significaria “havia”, mas não existe um substantivo depois do verbo: They were at the concert = Eles estavam no show."
  },
  {
    topics: ["g-elis-japan"],
    q: "Elis Regina ______ born in Japan.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Elis = she → WASN'T (was + not). Ela nasceu em Porto Alegre."
  },

  {
    topics: ["g-freddie-brazilian"],
    q: "Freddie Mercury ______ a Brazilian singer.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Freddie Mercury = he → WASN'T (was + not)."
  },

  {
    topics: ["g-louis-guitarist"],
    q: "Louis Armstrong ______ a guitarist.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Louis Armstrong = he → WASN'T (was + not). Ele tocava trompete."
  },

  {
    topics: ["g-rita-elis-argentinian"],
    q: "Rita Lee and Elis Regina ______ Argentinian.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "weren't",
    why: "Rita and Elis = they → WEREN'T (were + not). Elas eram brasileiras."
  },

  {
    topics: ["g-freddie-singer"],
    q: "Was Freddie Mercury a singer? Yes, he ______.",
    options: ["was", "were", "did", "do"],
    answer: "was",
    why: "A resposta curta repete o verbo da pergunta: Was...? → Yes, he WAS."
  },

  {
    topics: ["g-elis-argentinian-q"],
    q: "Was Elis Regina Argentinian? No, she ______.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Resposta curta negativa: No, she WASN'T. Elis Regina era brasileira."
  },

  {
    topics: ["prince-cash-brazilian"],
    q: "Were Prince and Johnny Cash Brazilian? No, they ______.",
    options: ["weren't", "wasn't", "didn't", "don't"],
    answer: "weren't",
    why: "Resposta curta negativa: No, they WEREN'T. Eles eram americanos."
  },

  {
    topics: ["g-dolly-singer"],
    q: "Was Dolly Parton a singer? Yes, she ______.",
    options: ["was", "were", "did", "do"],
    answer: "was",
    why: "A resposta curta repete o verbo da pergunta: Was...? → Yes, she WAS."
  },

  {
    topics: ["g-elton-taupin-partners"],
    q: "Were Elton John and Bernie Taupin partners? Yes, they ______.",
    options: ["were", "was", "did", "do"],
    answer: "were",
    why: "A resposta curta repete o verbo da pergunta: Were...? → Yes, they WERE."
  },

  {
    topics: ["g-ella-trumpeter"],
    q: "Was Ella Fitzgerald a trumpeter? No, she ______.",
    options: ["wasn't", "weren't", "didn't", "don't"],
    answer: "wasn't",
    why: "Resposta curta negativa: No, she WASN'T. Ela era cantora, não trompetista."
  },

  {
    topics: ["g-tim-maia-singer"],
    q: "______ Tim Maia a singer?",
    options: ["Was", "Were", "Did", "Do"],
    answer: "Was",
    why: "Pergunta com be: WAS + he/she/it + ...? Tim Maia = he → Was Tim Maia a singer?"
  },
  {
    topics: ["g-elis-rita-singers"],
    q: "______ Elis Regina and Rita Lee singers?",
    options: ["Were", "Was", "Did", "Do"],
    answer: "Were",
    why: "Pergunta com be: WERE + they/we/you + ...? Elis and Rita = they → Were Elis and Rita singers?"
  },

  {
    topics: ["prince-elton-singers"],
    q: "Prince and Elton John were singers. ______ were famous in the 1980s.",
    options: ["They", "There", "It", "He"],
    answer: "They",
    why: "THEY = Prince and Elton John (as pessoas que já citamos). THERE significaria “havia”, mas aqui falamos de pessoas: They were famous = Eles eram famosos."
  },

  /* ---------- facts from the Artist Cards ---------- */
  {
    topics: ["barbra-born", "chicago"],
    focus: "facts",
    q: "Where was Barbra Streisand born?",
    options: ["Brooklyn", "Chicago", "Los Angeles", "Nashville"],
    answer: "Brooklyn",
    why: "Barbra Streisand was born in Brooklyn, New York."
  },
  {
    topics: ["elis-rita-brazil"],
    focus: "facts",
    q: "Where was Elis Regina born?",
    options: ["Porto Alegre", "Rio de Janeiro", "São Paulo", "Salvador"],
    answer: "Porto Alegre",
    why: "Elis Regina was born in Porto Alegre, Rio Grande do Sul."
  },
  {
    topics: ["prince-first-song-age", "age-seven", "verb-wrote"],
    focus: "facts",
    q: "How old was Prince when he wrote his first song?",
    options: ["5", "7", "12", "17"],
    keepOrder: true,
    answer: "7",
    why: "Prince was seven years old when he wrote his first song, on his father's piano."
  },
  {
    topics: ["ella-apollo-17", "verb-sang"],
    focus: "facts",
    q: "How old was Ella Fitzgerald when she sang at the Apollo Theater?",
    options: ["12", "17", "25", "30"],
    keepOrder: true,
    answer: "17",
    why: "Em 1934, aos 17 anos, Ella cantou no Apollo Theater (Amateur Night), no Harlem."
  },
  {
    topics: ["louis-cornet"],
    focus: "facts",
    q: "What was Louis Armstrong's first instrument?",
    options: ["the cornet", "the piano", "the guitar", "the drums"],
    answer: "the cornet",
    why: "His first instrument was the cornet. Ele aprendeu a tocar na banda do Colored Waif's Home."
  },
  {
    topics: ["prince-first-song"],
    focus: "facts",
    q: "What was Prince's first song?",
    options: ["“Funk Machine”", "“Purple Rain”", "“Kiss”", "“1999”"],
    answer: "“Funk Machine”",
    why: "His first song was “Funk Machine”. As outras são músicas famosas dele, mas não a primeira."
  },
  {
    topics: ["queen-four"],
    focus: "facts",
    q: "How many musicians were there in Queen?",
    options: ["three", "four", "five", "six"],
    keepOrder: true,
    answer: "four",
    why: "There were four musicians in Queen: Freddie, Brian May, Roger Taylor and John Deacon."
  },
  {
    topics: ["tim-19-kids", "family-size"],
    focus: "facts",
    q: "How many children were there in Tim Maia's family?",
    options: ["9", "12", "19", "29"],
    keepOrder: true,
    answer: "19",
    why: "There were 19 children in Tim Maia's family."
  },
  {
    topics: ["ella-nickname"],
    focus: "facts",
    q: "What was Ella Fitzgerald's nickname?",
    options: ["“the First Lady of Song”", "“the Queen of Soul”", "“the Queen of Pop”", "“the Queen of Rock”"],
    answer: "“the First Lady of Song”",
    why: "Her nickname was “the First Lady of Song”."
  },
  {
    topics: ["real-names"],
    focus: "facts",
    q: "What was Freddie Mercury's real name?",
    options: ["Farrokh Bulsara", "Reginald Dwight", "Anna Mae Bullock", "Sebastião Maia"],
    answer: "Farrokh Bulsara",
    why: "O nome verdadeiro de Freddie era Farrokh Bulsara. Reginald Dwight é Elton John, Anna Mae Bullock é Tina Turner e Sebastião Maia é Tim Maia."
  },
  {
    topics: ["rita-parents"],
    focus: "facts",
    q: "Rita Lee's mother was a ______.",
    options: ["pianist", "dentist", "singer", "teacher"],
    answer: "pianist",
    why: "Her father was a dentist and her mother was a pianist."
  },
  {
    topics: ["clube-do-guri", "verb-sang"],
    focus: "facts",
    q: "What was “Clube do Guri”?",
    options: ["a children's radio show", "a football team", "a TV cooking show", "a music school"],
    answer: "a children's radio show",
    why: "“Clube do Guri” was a children's radio show, and Elis Regina sang on it."
  },
  {
    topics: ["cash-born"],
    focus: "facts",
    q: "In which US state was Johnny Cash born?",
    options: ["Arkansas", "Tennessee", "Texas", "Alabama"],
    answer: "Arkansas",
    why: "Johnny Cash was born in Kingsland, Arkansas."
  },
  {
    topics: ["freddie-born-zanzibar"],
    focus: "facts",
    q: "Where was Freddie Mercury born?",
    options: ["Zanzibar", "England", "India", "Switzerland"],
    answer: "Zanzibar",
    why: "Freddie Mercury was born in Stone Town, Zanzibar."
  },
  {
    topics: ["louis-born", "chicago"],
    focus: "facts",
    q: "Where was Louis Armstrong born?",
    options: ["New Orleans", "Chicago", "New York", "Memphis"],
    answer: "New Orleans",
    why: "Louis Armstrong was born in New Orleans, Louisiana. Ele se mudou para Chicago em 1922."
  },

  /* ---------- LEVEL 2 · regular verbs (-ed): started, moved, played ... ---------- */
  {
    topics: ["freddie-moved-england", "verb-moved"],
    level: 2,
    q: "In 1964, Freddie Mercury ______ to England with his family.",
    options: ["moved", "move", "moveed", "moving"],
    answer: "moved",
    why: "Move já termina em -e: só adicionamos -d → MOVED (passado, “In 1964”)."
  },

  {
    topics: ["queen-formed-1970", "rita-band", "verb-formed"],
    level: 2,
    q: "In 1970, Freddie Mercury ______ the band Queen with Brian May and Roger Taylor.",
    options: ["formed", "form", "formmed", "forming"],
    answer: "formed",
    why: "Verbo regular: form + ed = FORMED. Em 1970 ele formou a banda Queen."
  },
  {
    topics: ["tina-picked-cotton", "verb-picked"],
    level: 2,
    q: "As a child, Tina Turner ______ cotton with her family.",
    options: ["picked", "pick", "pickt", "picking"],
    answer: "picked",
    why: "Verbo regular: pick + ed = PICKED. Ela colhia algodão com a família."
  },
  {
    topics: ["cash-worked-fields", "cash-parents", "verb-worked"],
    level: 2,
    q: "Johnny Cash ______ in the cotton fields from age 5.",
    options: ["worked", "work", "workt", "working"],
    answer: "worked",
    why: "Verbo regular: work + ed = WORKED. Ele trabalhou nos campos de algodão desde os 5 anos."
  },
  {
    topics: ["ella-joined-webb", "verb-joined"],
    level: 2,
    q: "In 1935, Ella Fitzgerald ______ Chick Webb's orchestra.",
    options: ["joined", "join", "joind", "joining"],
    answer: "joined",
    why: "Verbo regular: join + ed = JOINED. Em 1935 ela entrou na orquestra de Chick Webb."
  },
  {
    topics: ["louis-cornet", "verb-learned"],
    level: 2,
    q: "In 1912, Louis Armstrong ______ to play the cornet in a band.",
    options: ["learned", "learn", "learnd", "learning"],
    answer: "learned",
    why: "Verbo regular: learn + ed = LEARNED. Ele aprendeu a tocar corneta numa banda."
  },
  {
    topics: ["barbra-graduated", "verb-graduated"],
    level: 2,
    q: "Barbra Streisand ______ from high school in 1959, at age 16.",
    options: ["graduated", "graduate", "graduatd", "graduating"],
    answer: "graduated",
    why: "Verbo regular terminado em -e: graduate + d = GRADUATED. Ela se formou no ensino médio em 1959."
  },
  {
    topics: ["prince-1984-film", "prince-first-song", "verb-starred"],
    level: 2,
    q: "In 1984, Prince ______ in the film “Purple Rain”.",
    options: ["starred", "star", "stared", "starring"],
    answer: "starred",
    why: "Verbo regular: star + ed = STARRED (dobramos o r). Em 1984 Prince estrelou o filme “Purple Rain”. (stared é outro verbo: olhar fixamente.)"
  },
  {
    topics: ["prince-signed", "verb-signed"],
    level: 2,
    q: "In 1977, Prince ______ a contract with Warner Bros. Records.",
    options: ["signed", "sign", "signd", "signing"],
    answer: "signed",
    why: "Verbo regular: sign + ed = SIGNED. Em 1977 ele assinou um contrato com a Warner Bros. Records."
  },
  {
    topics: ["elton-hall-of-fame", "verb-entered"],
    level: 2,
    q: "In 1994, Elton John ______ the Rock and Roll Hall of Fame.",
    options: ["entered", "enter", "enterd", "entering"],
    answer: "entered",
    why: "Enter + ed = ENTERED (passado, “In 1994”)."
  },

  {
    topics: ["rita-studied-piano", "rita-parents", "verb-studied"],
    level: 2,
    q: "Rita Lee ______ classical piano.",
    options: ["studied", "study", "studyed", "studying"],
    answer: "studied",
    why: "Verbo regular terminado em consoante + y: tiramos o y e colocamos -ied: study → STUDIED. (studyed está errado.)"
  },
  {
    topics: ["tim-lived-us", "verb-lived"],
    level: 2,
    q: "From 1959 to 1964, Tim Maia ______ in the United States.",
    options: ["lived", "live", "livd", "living"],
    answer: "lived",
    why: "Verbo regular terminado em -e: live + d = LIVED. Ele morou nos Estados Unidos de 1959 a 1964."
  },
  {
    topics: ["rita-received-grammy", "verb-received"],
    level: 2,
    q: "In 2022, Rita Lee ______ a Latin Grammy Lifetime Achievement Award.",
    options: ["received", "receive", "recieved", "receiving"],
    answer: "received",
    why: "Verbo regular terminado em -e: receive + d = RECEIVED. Atenção: depois do c, escrevemos “ei” (receive), não “ie”."
  },
  {
    topics: ["elis-dois-na-bossa", "verb-recorded"],
    level: 2,
    q: "In 1965, Elis Regina ______ “Dois na Bossa” with Jair Rodrigues.",
    options: ["recorded", "record", "recordd", "recording"],
    answer: "recorded",
    why: "Verbo regular: record + ed = RECORDED. Em 1965 ela gravou “Dois na Bossa” com Jair Rodrigues."
  },
  {
    topics: ["elton-released-empty-sky", "verb-released"],
    level: 2,
    q: "In 1969, Elton John ______ his first album, “Empty Sky”.",
    options: ["released", "release", "releasd", "releasing"],
    answer: "released",
    why: "Verbo regular terminado em -e: release + d = RELEASED. Em 1969 ele lançou seu primeiro álbum."
  },
  {
    topics: ["ella-mother-died", "verb-died"],
    level: 2,
    q: "Ella Fitzgerald's mother ______ in 1932.",
    options: ["died", "die", "dieed", "dying"],
    answer: "died",
    why: "Verbo regular terminado em -e: die + d = DIED. A mãe de Ella morreu em 1932."
  },

  {
    topics: ["tina-name-1960", "real-names", "verb-started"],
    level: 2,
    q: "In 1960, Tina Turner ______ to use the name Tina.",
    options: ["started", "start", "startd", "starting"],
    answer: "started",
    why: "Verbo regular: start + ed = STARTED. Em 1960 ela começou a usar o nome Tina."
  },
  {
    topics: ["prince-superbowl-2007", "verb-played"],
    level: 2,
    q: "In 2007, Prince ______ at the Super Bowl halftime show.",
    options: ["played", "play", "playd", "playing"],
    answer: "played",
    why: "Verbo regular terminado em vogal + y: play + ed = PLAYED (o y não muda). Em 2007 Prince tocou no show do intervalo do Super Bowl."
  },
  {
    topics: ["dolly-9to5", "verb-acted"],
    level: 2,
    q: "In 1980, Dolly Parton ______ in the film “9 to 5”.",
    options: ["acted", "act", "actd", "acting"],
    answer: "acted",
    why: "Verbo regular: act + ed = ACTED. Em 1980 Dolly Parton atuou no filme “9 to 5”."
  },

  /* ---------- LEVEL 3 · irregular verbs: sang, wrote, won, went ... ---------- */
  {
    topics: ["freddie-went-boarding", "verb-went"],
    level: 3,
    q: "At age 8, Freddie Mercury ______ to a boarding school in India.",
    options: ["went", "go", "goed", "going"],
    answer: "went",
    why: "Verbo irregular: go → WENT (não existe “goed”). Aos 8 anos Freddie foi para um internato na Índia."
  },
  {
    topics: ["zanzibar-1964", "freddie-born-zanzibar", "verb-left"],
    level: 3,
    q: "In 1964, Freddie Mercury ______ Zanzibar after a revolution.",
    options: ["left", "leave", "leaved", "leaving"],
    answer: "left",
    why: "Leave é irregular: o passado é LEFT (“In 1964” = passado)."
  },

  {
    topics: ["louis-born", "verb-grew"],
    level: 3,
    q: "Louis Armstrong ______ up in a poor neighborhood in New Orleans.",
    options: ["grew", "grow", "growed", "growing"],
    answer: "grew",
    why: "Verbo irregular: grow → GREW (não existe “growed”). Ele cresceu num bairro pobre de New Orleans."
  },
  {
    topics: ["ella-apollo-17", "verb-sang"],
    level: 3,
    q: "In 1934, Ella Fitzgerald ______ at the Apollo Theater in Harlem.",
    options: ["sang", "sing", "singed", "singing"],
    answer: "sang",
    why: "Verbo irregular: sing → SANG (não existe “singed”). Em 1934 ela cantou no Apollo Theater."
  },
  {
    topics: ["barbra-grammy-1963", "verb-won"],
    level: 3,
    q: "In 1963, Barbra Streisand ______ the Grammy for Album of the Year.",
    options: ["won", "win", "winned", "winning"],
    answer: "won",
    why: "Verbo irregular: win → WON (não existe “winned”). Em 1963 ela ganhou o Grammy de Álbum do Ano."
  },
  {
    topics: ["prince-first-song-age", "age-seven", "verb-wrote"],
    level: 3,
    q: "At age 7, Prince ______ his first song on his father's piano.",
    options: ["wrote", "write", "writed", "writing"],
    answer: "wrote",
    why: "Verbo irregular: write → WROTE (não existe “writed”). Aos 7 anos ele escreveu sua primeira música."
  },
  {
    topics: ["dolly-wrote-jolene", "verb-wrote"],
    level: 3,
    q: "In 1973, Dolly Parton ______ “Jolene” and “I Will Always Love You”.",
    options: ["wrote", "write", "writed", "writing"],
    answer: "wrote",
    why: "Verbo irregular: write → WROTE. Em 1973 Dolly Parton escreveu as duas músicas."
  },
  {
    topics: ["elton-taupin", "verb-met"],
    level: 3,
    q: "In 1967, Elton John ______ the lyricist Bernie Taupin.",
    options: ["met", "meet", "meeted", "meeting"],
    answer: "met",
    why: "Verbo irregular: meet → MET (não existe “meeted”). Em 1967 ele conheceu o letrista Bernie Taupin."
  },
  {
    topics: ["rita-1979", "verb-became"],
    level: 3,
    q: "In 1979, Rita Lee ______ Brazil's first pop superstar.",
    options: ["became", "become", "becomed", "becoming"],
    answer: "became",
    why: "Verbo irregular: become → BECAME (não existe “becomed”). Em 1979 ela se tornou a primeira superestrela pop do Brasil."
  },
  {
    topics: ["elis-dois-na-bossa", "verb-sold"],
    level: 3,
    q: "Elis Regina's album “Dois na Bossa” ______ over 1 million copies.",
    options: ["sold", "sell", "selled", "selling"],
    answer: "sold",
    why: "Verbo irregular: sell → SOLD (não existe “selled”). O álbum vendeu mais de 1 milhão de cópias."
  },
  {
    topics: ["dolly-guitar-8", "verb-got"],
    level: 3,
    q: "At age 8, Dolly Parton ______ her first real guitar.",
    options: ["got", "get", "getted", "getting"],
    answer: "got",
    why: "Verbo irregular: get → GOT (não existe “getted”). Aos 8 anos ela ganhou seu primeiro violão de verdade."
  },
  {
    topics: ["cash-began-guitar", "verb-began"],
    level: 3,
    q: "At age 12, Johnny Cash ______ to play the guitar and write songs.",
    options: ["began", "begin", "beginned", "beginning"],
    answer: "began",
    why: "Verbo irregular: begin → BEGAN (não existe “beginned”). Aos 12 anos ele começou a tocar violão e a compor."
  },
  {
    topics: ["cash-sun-1955", "verb-made"],
    level: 3,
    q: "In 1955, Johnny Cash ______ his first recordings for Sun Records.",
    options: ["made", "make", "maked", "making"],
    answer: "made",
    why: "Verbo irregular: make → MADE (não existe “maked”). Em 1955 ele fez suas primeiras gravações para a Sun Records."
  },
  {
    topics: ["elton-candle-1997", "verb-sang"],
    level: 3,
    q: "In 1997, Elton John ______ “Candle in the Wind 1997”.",
    options: ["sang", "sing", "singed", "singing"],
    answer: "sang",
    why: "Verbo irregular: sing → SANG (não existe “singed”). Em 1997 ele cantou “Candle in the Wind 1997”."
  },
  {
    topics: ["elis-festival-1965", "verb-won"],
    level: 3,
    q: "In 1965, Elis Regina ______ a TV music festival with “Arrastão”.",
    options: ["won", "win", "winned", "winning"],
    answer: "won",
    why: "Verbo irregular: win → WON. Em 1965 ela ganhou um festival de música da TV com “Arrastão”."
  },
  {
    topics: ["louis-waifs-home", "verb-went"],
    level: 3,
    q: "In 1912, Louis Armstrong ______ to the Colored Waif's Home for boys.",
    options: ["went", "go", "goed", "going"],
    answer: "went",
    why: "Verbo irregular: go → WENT. Em 1912 ele foi para o Colored Waif's Home (um lar para meninos)."
  },
];

const TRUE_FALSE = [

  /* ---------- TRUE statements ---------- */
  {
    topics: ["freddie-born-zanzibar"],
    q: "Freddie Mercury was born in Zanzibar.",
    answer: true,
    why: "Verdadeiro. Ele nasceu em Stone Town, Zanzibar."
  },
  {
    topics: ["ella-apollo-17", "verb-sang"],
    q: "Ella Fitzgerald was 17 years old when she sang at the Apollo Theater.",
    answer: true,
    why: "Verdadeiro. Foi em 1934, quando ela tinha 17 anos."
  },
  {
    topics: ["elton-piano", "age-seven", "verb-started"],
    q: "Elton John was seven years old when he started piano lessons.",
    answer: true,
    why: "Verdadeiro. Ele começou as aulas de piano aos 7 anos."
  },
  {
    topics: ["dolly-9to5"],
    q: "In 1980, Dolly Parton was in the film “9 to 5”.",
    answer: true,
    why: "Verdadeiro. Em 1980 ela atuou no filme e escreveu a música-tema."
  },
  {
    topics: ["tina-ike-duo"],
    q: "Tina Turner and Ike Turner were a famous duo.",
    answer: true,
    why: "Verdadeiro. Tina and Ike = they → were."
  },
  {
    topics: ["rita-parents"],
    q: "Rita Lee's father was a dentist and her mother was a pianist.",
    answer: true,
    why: "Verdadeiro. Her father was a dentist and her mother was a pianist."
  },
  {
    topics: ["elis-rita-brazil"],
    q: "Elis Regina was born in Porto Alegre.",
    answer: true,
    why: "Verdadeiro. Elis Regina nasceu em Porto Alegre."
  },
  {
    topics: ["tim-born"],
    q: "Tim Maia wasn't born in São Paulo. He was born in Rio de Janeiro.",
    answer: true,
    why: "Verdadeiro. Tim Maia nasceu no Rio de Janeiro (Tijuca), não em São Paulo."
  },
  {
    topics: ["cash-parents"],
    q: "Johnny Cash's parents were poor cotton farmers.",
    answer: true,
    why: "Verdadeiro. His parents were poor cotton farmers."
  },
  {
    topics: ["louis-cornet"],
    q: "Louis Armstrong's first instrument was the cornet.",
    answer: true,
    why: "Verdadeiro. His first instrument was the cornet."
  },
  {
    topics: ["ella-nickname"],
    q: "Ella Fitzgerald's nickname was “the First Lady of Song”.",
    answer: true,
    why: "Verdadeiro. Esse era o apelido dela."
  },
  {
    topics: ["tim-19-kids", "family-size"],
    q: "There were 19 children in Tim Maia's family.",
    answer: true,
    why: "Verdadeiro. There were 19 children in his family."
  },
  {
    topics: ["prince-cash-brazilian"],
    q: "Prince and Johnny Cash weren't Brazilian.",
    answer: true,
    why: "Verdadeiro. Os dois eram americanos."
  },
  {
    topics: ["clube-do-guri"],
    q: "“Clube do Guri” was a children's radio show.",
    answer: true,
    why: "Verdadeiro. Elis Regina cantou nesse programa quando era criança."
  },
  {
    topics: ["roslyn-kind"],
    q: "Barbra Streisand's half-sister, Roslyn Kind, was a singer too.",
    answer: true,
    why: "Verdadeiro. Roslyn Kind também era cantora."
  },
  {
    topics: ["elton-taupin"],
    q: "Elton John and Bernie Taupin were songwriting partners.",
    answer: true,
    why: "Verdadeiro. Bernie Taupin era o letrista e parceiro de composição de Elton John."
  },
  {
    topics: ["freddie-age-death", "verb-died"],
    q: "Freddie Mercury was 45 years old when he died.",
    answer: true,
    why: "Verdadeiro. Ele morreu em 1991, aos 45 anos."
  },
  {
    topics: ["real-names"],
    q: "Tina Turner's real name was Anna Mae Bullock.",
    answer: true,
    why: "Verdadeiro. Tina Turner nasceu Anna Mae Bullock."
  },
  {
    topics: ["rita-age-death", "verb-died"],
    q: "Rita Lee was 75 years old when she died.",
    answer: true,
    why: "Verdadeiro. Ela morreu em 2023, aos 75 anos."
  },
  {
    topics: ["zanzibar-1964", "freddie-born-zanzibar"],
    q: "In 1964, there was a revolution in Zanzibar.",
    answer: true,
    why: "Verdadeiro. THERE + WAS + 1 coisa: a revolution → was."
  },
  {
    topics: ["cash-folsom"],
    q: "In 1968, Johnny Cash was in Folsom Prison.",
    answer: true,
    why: "Verdadeiro. Em 1968 ele gravou o álbum “At Folsom Prison” dentro da prisão de Folsom."
  },
  {
    topics: ["louis-trumpeter"],
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Was Louis Armstrong a trumpeter? Yes, he was.”",
    answer: true,
    why: "Correta. Was + he...? → Yes, he was."
  },

  /* ---------- FALSE statements ---------- */
  {
    topics: ["barbra-born", "chicago"],
    q: "Barbra Streisand was born in Chicago.",
    answer: false,
    why: "Falso. Ela nasceu no Brooklyn, New York."
  },
  {
    topics: ["cash-born"],
    q: "Johnny Cash was born in Texas.",
    answer: false,
    why: "Falso. Ele nasceu em Kingsland, Arkansas."
  },
  {
    topics: ["real-names"],
    q: "Freddie Mercury's real name was Reginald Dwight.",
    answer: false,
    why: "Falso. Reginald Dwight é o nome verdadeiro de Elton John. O de Freddie era Farrokh Bulsara."
  },
  {
    topics: ["queen-four"],
    q: "There were five musicians in the band Queen.",
    answer: false,
    why: "Falso. There were four musicians in Queen."
  },
  {
    topics: ["prince-first-song-age", "age-seven", "verb-wrote"],
    q: "Prince was 12 years old when he wrote his first song.",
    answer: false,
    why: "Falso. Ele tinha 7 anos quando escreveu sua primeira música."
  },
  {
    topics: ["louis-trumpeter"],
    q: "Louis Armstrong was a pianist.",
    answer: false,
    why: "Falso. Louis Armstrong was a trumpeter and a singer."
  },
  {
    topics: ["prince-first-song"],
    q: "Prince's first song was “Purple Rain”.",
    answer: false,
    why: "Falso. His first song was “Funk Machine”."
  },
  {
    topics: ["elis-rita-brazil"],
    q: "Rita Lee was born in Rio de Janeiro.",
    answer: false,
    why: "Falso. Rita Lee nasceu em São Paulo."
  },
  {
    topics: ["prince-elton-singers"],
    q: "Dolly Parton and Elton John weren't singers.",
    answer: false,
    why: "Falso. Os dois eram cantores: they WERE singers."
  },
  {
    topics: ["tim-born-year"],
    q: "Tim Maia was born in 1952.",
    answer: false,
    why: "Falso. Tim Maia nasceu em 1942."
  },
  {
    topics: ["prince-1984-film", "dolly-9to5", "prince-first-song"],
    q: "In 1984, Prince was in the film “9 to 5”.",
    answer: false,
    why: "Falso. Em 1984 ele estrelou “Purple Rain”. “9 to 5” é o filme de Dolly Parton."
  },
  {
    topics: ["dolly-12-kids", "family-size"],
    q: "There were six children in Dolly Parton's family.",
    answer: false,
    why: "Falso. There were 12 children in her family."
  },
  {
    topics: ["elton-piano"],
    q: "Elton John's first instrument was the guitar.",
    answer: false,
    why: "Falso. His first instrument was the piano."
  },
  {
    topics: ["elis-age-death", "verb-died"],
    q: "Elis Regina was 60 years old when she died.",
    answer: false,
    why: "Falso. Ela morreu em 1982, aos 36 anos."
  },
  {
    topics: ["louis-born", "chicago"],
    q: "Louis Armstrong was born in Chicago.",
    answer: false,
    why: "Falso. Ele nasceu em New Orleans. Se mudou para Chicago em 1922."
  },
  {
    topics: ["tina-born"],
    q: "Tina Turner was born in London.",
    answer: false,
    why: "Falso. Ela nasceu em Brownsville, Tennessee (EUA)."
  },
  {
    topics: ["rita-band"],
    q: "Rita Lee was a member of the band Queen.",
    answer: false,
    why: "Falso. Rita Lee was a member of the band Os Mutantes."
  },
  {
    topics: ["dolly-born"],
    q: "Dolly Parton was born in Nashville.",
    answer: false,
    why: "Falso. Ela nasceu em Pittman Center, Tennessee, e se mudou para Nashville em 1964."
  },
  {
    topics: ["freddie-born-zanzibar"],
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Freddie Mercury were born in Zanzibar.”",
    answer: false,
    why: "Incorreta. Freddie Mercury = he → WAS, não were."
  },
  {
    topics: ["prince-elton-singers"],
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Were Prince and Elton singers? Yes, they was.”",
    answer: false,
    why: "Incorreta. A resposta curta repete o verbo: Were...? → Yes, they WERE."
  },
  {
    topics: ["wembley-people"],
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“There was thousands of people at Wembley.”",
    answer: false,
    why: "Incorreta. thousands of people (vários) → There WERE thousands of people."
  },
  {
    topics: ["rita-parents"],
    q: "Rita Lee's father was a pianist.",
    answer: false,
    why: "Falso. Her father was a dentist. Her mother was the pianist."
  },

  /* ---------- LEVEL 1 · more grammar judgements (CORRECT / INCORRECT) ---------- */
  {
    topics: ["elton-taupin"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Elton John and Bernie Taupin were songwriting partners.”",
    answer: true,
    why: "Correta. Elton John and Bernie Taupin = they → WERE."
  },
  {
    topics: ["dolly-family-rich"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Dolly Parton's family wasn't rich.”",
    answer: true,
    why: "Correta. Family = it → WASN'T (was + not). A família de Dolly Parton não era rica."
  },
  {
    topics: ["prince-elton-singers"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Were Prince and Elton John singers? Yes, they were.”",
    answer: true,
    why: "Correta. Were + they...? → Yes, they were."
  },
  {
    topics: ["wembley-people"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“There were thousands of people at Wembley.”",
    answer: true,
    why: "Correta. Thousands of people (várias pessoas) → there WERE."
  },
  {
    topics: ["wembley-concert", "freddie-liveaid"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1985, Freddie Mercury was at Live Aid.”",
    answer: true,
    why: "Correta. Freddie Mercury = he → WAS."
  },
  {
    topics: ["elton-taupin"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Elton John and Bernie Taupin was songwriting partners.”",
    answer: false,
    why: "Incorreta. Elton John and Bernie Taupin = they → WERE (não was)."
  },
  {
    topics: ["prince-cash-brazilian"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Prince and Johnny Cash wasn't Brazilian.”",
    answer: false,
    why: "Incorreta. Prince and Johnny Cash = they → WEREN'T."
  },
  {
    topics: ["wembley-concert"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1985, there were a huge concert at Wembley: Live Aid.”",
    answer: false,
    why: "Incorreta. A concert (um show) é uma coisa só → there WAS."
  },
  {
    topics: ["g-elis-brazilian-singer"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Elis Regina was a Brazilian singer.”",
    answer: true,
    why: "Correta. Elis = she → WAS."
  },
  {
    topics: ["g-queen-not-brazilian"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Queen wasn't a Brazilian band.”",
    answer: true,
    why: "Correta. Queen = it (uma banda) → WASN'T (was + not)."
  },
  {
    topics: ["g-fans-concert"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“There were many fans at the concert.”",
    answer: true,
    why: "Correta. Many fans (vários) → there WERE."
  },
  {
    topics: ["g-tina-born"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Tina Turner were born in Tennessee.”",
    answer: false,
    why: "Incorreta. Tina Turner = she → WAS, não were."
  },
  {
    topics: ["g-ella-louis-singers"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Ella Fitzgerald and Louis Armstrong was singers.”",
    answer: false,
    why: "Incorreta. Ella and Louis = they → WERE (não was)."
  },
  {
    topics: ["g-elis-singer-short"],
    level: 1,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Was Elis Regina a singer? Yes, she were.”",
    answer: false,
    why: "Incorreta. A resposta curta repete o verbo: Was...? → Yes, she WAS."
  },
  {
    topics: ["louis-cornet"],
    level: 1,
    q: "Louis Armstrong's first instrument was the piano.",
    answer: false,
    why: "Falso. O primeiro instrumento dele foi a corneta (the cornet)."
  },
  {
    topics: ["cash-parents"],
    level: 1,
    q: "Johnny Cash's parents were rich lawyers.",
    answer: false,
    why: "Falso. Os pais de Johnny Cash eram fazendeiros pobres de algodão (poor cotton farmers)."
  },

  /* ---------- LEVEL 2 · regular verbs: TRUE statements first, then FALSE ---------- */
  {
    topics: ["prince-signed", "verb-signed"],
    level: 2,
    q: "In 1977, Prince signed a contract with Warner Bros. Records.",
    answer: true,
    why: "Verdadeiro. Prince assinou (sign → signed) um contrato com a Warner Bros. Records em 1977."
  },
  {
    topics: ["cash-worked-fields", "cash-parents", "verb-worked"],
    level: 2,
    q: "Johnny Cash worked in the cotton fields from age 5.",
    answer: true,
    why: "Verdadeiro. Johnny Cash trabalhou (work → worked) nos campos de algodão desde os 5 anos."
  },
  {
    topics: ["elton-released-empty-sky", "verb-released"],
    level: 2,
    q: "Elton John released his first album, “Empty Sky”, in 1969.",
    answer: true,
    why: "Verdadeiro. Elton John lançou (release → released) “Empty Sky” em 1969."
  },
  {
    topics: ["tim-lived-us", "verb-lived"],
    level: 2,
    q: "Tim Maia lived in the United States from 1959 to 1964.",
    answer: true,
    why: "Verdadeiro. Tim Maia morou (live → lived) nos Estados Unidos de 1959 a 1964."
  },
  {
    topics: ["dolly-moved-nashville", "dolly-born", "verb-moved"],
    level: 2,
    q: "Dolly Parton moved to Nashville in 1964.",
    answer: true,
    why: "Verdadeiro. Dolly Parton se mudou (move → moved) para Nashville em 1964."
  },
  {
    topics: ["rita-studied-piano", "rita-parents", "verb-studied"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Rita Lee studied classical piano.”",
    answer: true,
    why: "Correta. Study termina em consoante + y: study → STUDIED."
  },
  {
    topics: ["barbra-graduated", "verb-graduated"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Barbra Streisand graduated from high school in 1959.”",
    answer: true,
    why: "Correta. Graduate + d = GRADUATED."
  },
  {
    topics: ["queen-entered-2001", "verb-entered"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 2001, Queen entered the Rock and Roll Hall of Fame.”",
    answer: true,
    why: "Correta. Enter + ed = ENTERED."
  },
  {
    topics: ["prince-signed", "verb-signed"],
    level: 2,
    q: "In 1987, Prince signed a contract with Warner Bros. Records.",
    answer: false,
    why: "Falso. Foi em 1977, não em 1987."
  },
  {
    topics: ["cash-worked-fields", "cash-parents", "verb-worked"],
    level: 2,
    q: "Johnny Cash worked in the cotton fields from age 15.",
    answer: false,
    why: "Falso. Ele começou a trabalhar aos 5 anos (age 5)."
  },
  {
    topics: ["elton-released-empty-sky", "verb-released"],
    level: 2,
    q: "Elton John released his first album, “Empty Sky”, in 1979.",
    answer: false,
    why: "Falso. O primeiro álbum saiu em 1969."
  },
  {
    topics: ["tim-lived-us", "verb-lived"],
    level: 2,
    q: "Tim Maia lived in Argentina from 1959 to 1964.",
    answer: false,
    why: "Falso. Ele morou nos Estados Unidos."
  },
  {
    topics: ["dolly-moved-nashville", "dolly-born", "verb-moved"],
    level: 2,
    q: "Dolly Parton moved to Memphis in 1964.",
    answer: false,
    why: "Falso. Ela se mudou para Nashville."
  },
  {
    topics: ["freddie-moved-england", "verb-moved"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1964, Freddie Mercury's family moveed to England.”",
    answer: false,
    why: "Incorreta. Move já termina em -e: só adicionamos -d → MOVED."
  },
  {
    topics: ["queen-formed-1970", "rita-band", "verb-formed"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1970, Freddie Mercury form the band Queen.”",
    answer: false,
    why: "Incorreta. É um fato no passado: precisa de -ed → FORMED."
  },
  {
    topics: ["ella-joined-webb", "verb-joined"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1935, Ella Fitzgerald join Chick Webb's orchestra.”",
    answer: false,
    why: "Incorreta. Passado de verbo regular: join + ed = JOINED."
  },

  {
    topics: ["tina-name-1960", "real-names", "verb-started"],
    level: 2,
    q: "In 1960, Tina Turner started to use the name Tina.",
    answer: true,
    why: "Verdadeiro. Tina Turner começou (start → started) a usar o nome Tina em 1960."
  },
  {
    topics: ["prince-superbowl-2007", "verb-played"],
    level: 2,
    q: "Prince played at the Super Bowl halftime show in 2007.",
    answer: true,
    why: "Verdadeiro. Prince tocou (play → played) no show do intervalo do Super Bowl em 2007."
  },
  {
    topics: ["dolly-9to5", "verb-acted"],
    level: 2,
    q: "In 1980, Dolly Parton acted in the film “9 to 5”.",
    answer: true,
    why: "Verdadeiro. Dolly Parton atuou (act → acted) no filme “9 to 5” em 1980."
  },
  {
    topics: ["tina-name-1960", "real-names", "verb-started"],
    level: 2,
    q: "In 1990, Tina Turner started to use the name Tina.",
    answer: false,
    why: "Falso. Foi em 1960, não em 1990."
  },
  {
    topics: ["prince-superbowl-2007", "verb-played"],
    level: 2,
    q: "Prince played at the Super Bowl halftime show in 1987.",
    answer: false,
    why: "Falso. Foi em 2007, não em 1987."
  },
  {
    topics: ["dolly-9to5", "verb-acted"],
    level: 2,
    q: "In 1990, Dolly Parton acted in the film “9 to 5”.",
    answer: false,
    why: "Falso. O filme é de 1980, não de 1990."
  },

  /* ---------- LEVEL 2 · more grammar judgements ---------- */
  {
    topics: ["prince-signed", "verb-signed"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1977, Prince signed a contract with Warner Bros. Records.”",
    answer: true,
    why: "Correta. Sign + ed = SIGNED."
  },
  {
    topics: ["tina-picked-cotton", "verb-picked"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Tina Turner picked cotton with her family.”",
    answer: true,
    why: "Correta. Pick + ed = PICKED."
  },
  {
    topics: ["tina-name-1960", "real-names", "verb-started"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1960, Tina Turner started to use the name Tina.”",
    answer: true,
    why: "Correta. Start + ed = STARTED."
  },
  {
    topics: ["prince-superbowl-2007", "verb-played"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 2007, Prince play at the Super Bowl halftime show.”",
    answer: false,
    why: "Incorreta. É um fato no passado: play + ed = PLAYED."
  },
  {
    topics: ["cash-worked-fields", "cash-parents", "verb-worked"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Johnny Cash work in the cotton fields from age 5.”",
    answer: false,
    why: "Incorreta. Passado de verbo regular: work + ed = WORKED."
  },
  {
    topics: ["elton-released-empty-sky", "verb-released"],
    level: 2,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1969, Elton John release his first album.”",
    answer: false,
    why: "Incorreta. Release termina em -e: release + d = RELEASED."
  },

  /* ---------- LEVEL 3 · irregular verbs: TRUE statements first, then FALSE ---------- */
  {
    topics: ["barbra-grammy-1963", "verb-won"],
    level: 3,
    q: "Barbra Streisand won the Grammy for Album of the Year in 1963.",
    answer: true,
    why: "Verdadeiro. Barbra Streisand ganhou (win → won) o Grammy de Álbum do Ano em 1963."
  },
  {
    topics: ["dolly-wrote-jolene", "verb-wrote"],
    level: 3,
    q: "Dolly Parton wrote “Jolene” in 1973.",
    answer: true,
    why: "Verdadeiro. Dolly Parton escreveu (write → wrote) “Jolene” em 1973."
  },
  {
    topics: ["elton-taupin", "verb-met"],
    level: 3,
    q: "Elton John met the lyricist Bernie Taupin in 1967.",
    answer: true,
    why: "Verdadeiro. Elton John conheceu (meet → met) Bernie Taupin em 1967."
  },
  {
    topics: ["cash-sun-1955", "verb-made"],
    level: 3,
    q: "In 1955, Johnny Cash made his first recordings for Sun Records.",
    answer: true,
    why: "Verdadeiro. Johnny Cash fez (make → made) suas primeiras gravações em 1955."
  },
  {
    topics: ["elis-dois-na-bossa", "verb-sold"],
    level: 3,
    q: "Elis Regina's album “Dois na Bossa” sold over 1 million copies.",
    answer: true,
    why: "Verdadeiro. O álbum vendeu (sell → sold) mais de 1 milhão de cópias."
  },
  {
    topics: ["rita-1979", "verb-became"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1979, Rita Lee became Brazil's first pop superstar.”",
    answer: true,
    why: "Correta. Become é irregular: become → BECAME."
  },
  {
    topics: ["cash-began-guitar", "verb-began"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“At age 12, Johnny Cash began to play the guitar.”",
    answer: true,
    why: "Correta. Begin é irregular: begin → BEGAN."
  },
  {
    topics: ["dolly-guitar-8", "verb-got"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Dolly Parton got her first real guitar at age 8.”",
    answer: true,
    why: "Correta. Get é irregular: get → GOT."
  },
  {
    topics: ["barbra-grammy-1963", "verb-won"],
    level: 3,
    q: "Barbra Streisand won the Grammy for Album of the Year in 1983.",
    answer: false,
    why: "Falso. Foi em 1963, não em 1983."
  },
  {
    topics: ["dolly-wrote-jolene", "verb-wrote"],
    level: 3,
    q: "Dolly Parton wrote “Jolene” in 1993.",
    answer: false,
    why: "Falso. Ela escreveu “Jolene” em 1973."
  },
  {
    topics: ["elton-taupin", "verb-met"],
    level: 3,
    q: "Elton John met the lyricist Bernie Taupin in 1987.",
    answer: false,
    why: "Falso. Eles se conheceram em 1967."
  },
  {
    topics: ["cash-sun-1955", "verb-made"],
    level: 3,
    q: "In 1975, Johnny Cash made his first recordings for Sun Records.",
    answer: false,
    why: "Falso. As primeiras gravações foram em 1955."
  },
  {
    topics: ["elis-dois-na-bossa", "verb-sold"],
    level: 3,
    q: "Elis Regina's album “Dois na Bossa” sold over 10 million copies.",
    answer: false,
    why: "Falso. O álbum vendeu mais de 1 milhão (1 million) de cópias."
  },
  {
    topics: ["ella-apollo-17", "verb-sang"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1934, Ella Fitzgerald singed at the Apollo Theater.”",
    answer: false,
    why: "Incorreta. Sing é irregular: o passado é SANG (não existe “singed”)."
  },
  {
    topics: ["freddie-went-boarding", "verb-went"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“At age 8, Freddie Mercury goed to a boarding school in India.”",
    answer: false,
    why: "Incorreta. Go é irregular: o passado é WENT (não existe “goed”)."
  },
  {
    topics: ["prince-first-song-age", "age-seven", "verb-wrote"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“At age 7, Prince writed his first song.”",
    answer: false,
    why: "Incorreta. Write é irregular: o passado é WROTE (não existe “writed”)."
  },
  /* ---------- LEVEL 3 · more grammar judgements ---------- */
  {
    topics: ["elton-taupin", "verb-met"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1967, Elton John met Bernie Taupin.”",
    answer: true,
    why: "Correta. Meet é irregular: meet → MET."
  },
  {
    topics: ["cash-sun-1955", "verb-made"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1955, Johnny Cash made his first recordings.”",
    answer: true,
    why: "Correta. Make é irregular: make → MADE."
  },
  {
    topics: ["elis-dois-na-bossa", "verb-sold"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Elis Regina's album sold over 1 million copies.”",
    answer: true,
    why: "Correta. Sell é irregular: sell → SOLD."
  },
  {
    topics: ["elis-festival-1965", "verb-won"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1965, Elis Regina winned a TV music festival.”",
    answer: false,
    why: "Incorreta. Win é irregular: o passado é WON (não existe “winned”)."
  },
  {
    topics: ["louis-born", "verb-grew"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“Louis Armstrong growed up in New Orleans.”",
    answer: false,
    why: "Incorreta. Grow é irregular: o passado é GREW (não existe “growed”)."
  },
  {
    topics: ["zanzibar-1964", "freddie-born-zanzibar", "verb-left"],
    level: 3,
    labels: ["CORRECT", "INCORRECT"],
    prompt: "Is the GRAMMAR correct? (A GRAMÁTICA está correta?)",
    q: "“In 1964, Freddie Mercury's family leaved Zanzibar.”",
    answer: false,
    why: "Incorreta. Leave é irregular: o passado é LEFT (não existe “leaved”)."
  },
];
