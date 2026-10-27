/* Grammar Academy content - Sentence Building and Advanced (offline, no API). */
(function () {
  'use strict';
  var academy = (window.GrammarAcademy = window.GrammarAcademy || { topics: [] });
  var ex = function (en, hi) { return { en: en, hi: hi }; };

  academy.topics.push({
    id: 'sentence-structure',
    order: 10,
    category: 'sentences',
    title: 'Sentence Structure',
    icon: 'SVO',
    level: 'Beginner',
    minutes: 10,
    summary: 'Word order, clauses aur simple/compound/complex sentences.',
    intro: [
      'English mein word order bahut important hai. Hindi mein verb aakhir mein aata hai (Main cricket khelta hoon), lekin English mein basic order Subject + Verb + Object hota hai (I play cricket).',
      'Sentence ke andar clauses hote hain. Clause = subject + verb wala word group. Clauses ko kaise jodte hain, uske hisaab se sentence simple, compound ya complex banta hai.'
    ],
    rules: [
      {
        title: '1. Basic order: Subject + Verb + Object',
        text: 'Pehle kaam karne wala (subject), phir kaam (verb), phir jis par kaam hua (object).',
        examples: [
          ex('Riya reads books.', 'Riya kitaabein padhti hai.'),
          ex('The teacher praised the student.', 'Teacher ne student ki tareef ki.')
        ]
      },
      {
        title: '2. Be-verb ke baad complement',
        text: 'is, am, are, was, were ke baad noun ya adjective aata hai jo subject ke baare mein batata hai.',
        examples: [
          ex('She is a doctor.', 'Woh doctor hai.'),
          ex('The room is clean.', 'Kamra saaf hai.')
        ]
      },
      {
        title: '3. Adverbs ki jagah: manner, place, time',
        text: 'Aam order: kaise, kahan, kab. Frequency adverb (always, never) aam taur par main verb se pehle aata hai.',
        examples: [
          ex('I met him in the park yesterday.', 'Main kal use park mein mila.'),
          ex('I always drink tea in the morning.', 'Main subah hamesha chai peeta hoon.')
        ]
      },
      {
        title: '4. Simple sentence: ek clause',
        text: 'Simple sentence mein ek hi independent clause hota hai.',
        examples: [
          ex('The sun rises in the east.', 'Suraj purab mein ugta hai.')
        ]
      },
      {
        title: '5. Compound sentence: clause + FANBOYS + clause',
        text: 'Do independent clauses ko for, and, nor, but, or, yet, so se jodte hain. Inse pehle aam taur par comma lagta hai.',
        examples: [
          ex('I was tired, so I went to bed.', 'Main thaka hua tha, isliye so gaya.'),
          ex('She wanted to go, but it was raining.', 'Woh jaana chahti thi, lekin baarish ho rahi thi.')
        ]
      },
      {
        title: '6. Complex sentence: independent + dependent clause',
        text: 'Dependent clause akele pura matlab nahi deta. Ye because, when, if, although jaise words se shuru hota hai.',
        examples: [
          ex('When the bell rang, the students left.', 'Jab ghanti baji, students chale gaye.'),
          ex('I stayed home because it was raining.', 'Main ghar par raha kyunki baarish ho rahi thi.')
        ]
      },
      {
        title: '7. Fragment aur run-on',
        text: 'Fragment = adhoora sentence (Because he was late.). Run-on = do sentences bina conjunction ya full stop ke jude hue (I like tea I like coffee.). Dono se bachna chahiye.',
        examples: [
          ex('He missed the bus because he was late.', 'Usse bus chhoot gayi kyunki woh late tha.'),
          ex('I like tea, and I like coffee.', 'Mujhe chai pasand hai aur coffee bhi pasand hai.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'Always I drink tea in morning.',
        right: 'I always drink tea in the morning.',
        why: 'Frequency adverb subject ke baad aur main verb se pehle aata hai. “morning” se pehle “the” bhi lagta hai.'
      },
      {
        wrong: 'I like very much cricket.',
        right: 'I like cricket very much.',
        why: 'Verb aur object ke beech mein adverb nahi aata. Object ke baad “very much” aata hai.'
      },
      {
        wrong: 'Because I was late.',
        right: 'I missed the bus because I was late.',
        why: 'Akela dependent clause adhoora sentence (fragment) hota hai. Main clause jodna zaroori hai.'
      },
      {
        wrong: 'She is a doctor she works in Delhi.',
        right: 'She is a doctor, and she works in Delhi.',
        why: 'Do clauses ko conjunction ya full stop se jodna padta hai, warna run-on sentence banta hai.'
      }
    ],
    quiz: [
      {
        q: 'Which sentence has the correct word order?',
        options: [
          'I like very much cricket.',
          'I like cricket very much.',
          'Very much I like cricket.',
          'Cricket I very much like.'
        ],
        answer: 1,
        explain: 'Subject + Verb + Object ke baad adverb aata hai: I like cricket very much.'
      },
      {
        q: '“When it rains, I stay at home.” is a ___ sentence.',
        options: ['simple', 'compound', 'complex', 'fragment'],
        answer: 2,
        explain: '“When it rains” dependent clause hai aur “I stay at home” independent clause, isliye complex sentence.'
      },
      {
        q: '“Because she was late.” is a ___.',
        options: ['complete sentence', 'sentence fragment', 'compound sentence', 'question'],
        answer: 1,
        explain: 'Ye sirf dependent clause hai aur akele pura matlab nahi deta, isliye fragment.'
      },
      {
        q: 'Which is a compound sentence?',
        options: [
          'I was tired, so I went to bed.',
          'Although I was tired, I worked.',
          'The tired boy slept.',
          'Sleeping on the sofa.'
        ],
        answer: 0,
        explain: 'Do independent clauses ko “so” (FANBOYS) se joda gaya hai, isliye compound sentence.'
      },
      {
        q: 'What is the subject in: “The little boy kicked the ball.”?',
        options: ['kicked', 'the ball', 'The little boy', 'little'],
        answer: 2,
        explain: 'Kaam karne wala “The little boy” subject hai. “kicked” verb hai aur “the ball” object.'
      }
    ]
  });

  academy.topics.push({
    id: 'question-formation',
    order: 11,
    category: 'sentences',
    title: 'Question Formation',
    icon: '?',
    level: 'Beginner',
    minutes: 10,
    summary: 'Yes/No, Wh-questions, question tags aur auxiliary verbs.',
    intro: [
      'Hindi mein sawal “kya” se shuru hota hai ya sirf awaaz se. English mein auxiliary verb (do, does, did, is, are, have, can...) sentence ke shuru mein aata hai aur word order badal jaata hai.',
      'Do tarah ke questions hote hain: Yes/No questions (jinka jawab haan/na) aur Wh-questions (what, where, why... se shuru).'
    ],
    rules: [
      {
        title: '1. Yes/No question: Auxiliary + Subject + Verb',
        text: 'Present Simple mein do/does, Past Simple mein did lagta hai. Uske baad verb V1 mein aata hai.',
        examples: [
          ex('Do you like tea?', 'Kya tumhe chai pasand hai?'),
          ex('Did she call you?', 'Kya usne tumhe phone kiya?')
        ]
      },
      {
        title: '2. Be-verb aur modal ke saath do/does nahi',
        text: 'is, am, are, was, were, have, can, will jaise verbs khud sentence ke shuru mein aa jaate hain.',
        examples: [
          ex('Is he a teacher?', 'Kya woh teacher hai?'),
          ex('Can you swim?', 'Kya tum tair sakte ho?'),
          ex('Have they arrived?', 'Kya woh pahunch gaye?')
        ]
      },
      {
        title: '3. Wh-question: Wh-word + auxiliary + subject + verb',
        text: 'Wh-words: what, when, where, who, whom, whose, which, why, how.',
        examples: [
          ex('Where do you live?', 'Tum kahan rehte ho?'),
          ex('What are you doing?', 'Tum kya kar rahe ho?'),
          ex('Why did she leave early?', 'Woh jaldi kyun gayi?')
        ]
      },
      {
        title: '4. Jab Who/What khud subject ho',
        text: 'Agar who ya what hi subject hai to do/does/did nahi lagta aur word order statement jaisa rehta hai.',
        examples: [
          ex('Who broke the window?', 'Khidki kisne todi?'),
          ex('What happened?', 'Kya hua?')
        ]
      },
      {
        title: '5. How ke combinations',
        text: 'how many (ginti wale nouns), how much (uncountable ya keemat), how long, how often, how far.',
        examples: [
          ex('How many books do you have?', 'Tumhare paas kitni kitaabein hain?'),
          ex('How much water do you drink?', 'Tum kitna paani peete ho?')
        ]
      },
      {
        title: '6. Question tags',
        text: 'Statement ke end mein chhota sawal. Positive statement ke baad negative tag, negative ke baad positive tag.',
        examples: [
          ex('You like tea, don’t you?', 'Tumhe chai pasand hai, hai na?'),
          ex('She isn’t here, is she?', 'Woh yahan nahi hai, hai kya?')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'Where you are going?',
        right: 'Where are you going?',
        why: 'Wh-word ke baad auxiliary (are) pehle aata hai, phir subject.'
      },
      {
        wrong: 'What you want?',
        right: 'What do you want?',
        why: 'Present Simple question mein do/does zaroori hai.'
      },
      {
        wrong: 'Does she likes tea?',
        right: 'Does she like tea?',
        why: 'does ke baad verb V1 aata hai. “does” mein pehle se singular ka signal hai.'
      },
      {
        wrong: 'Who did break the window?',
        right: 'Who broke the window?',
        why: 'Jab who subject ho to did nahi lagta.'
      },
      {
        wrong: 'You are coming, isn’t it?',
        right: 'You are coming, aren’t you?',
        why: 'Tag mein wahi auxiliary aur subject pronoun aata hai (aren’t you). “isn’t it” har jagah nahi lagta.'
      }
    ],
    quiz: [
      {
        q: '___ do you live?',
        options: ['Where', 'Who', 'Which', 'Whose'],
        answer: 0,
        explain: 'Jagah poochne ke liye “where” aata hai.'
      },
      {
        q: '(Present Simple) ___ she like coffee?',
        options: ['Do', 'Does', 'Is', 'Did'],
        answer: 1,
        explain: '“she” ke saath Present Simple question mein does aata hai. “Did” Past Simple ke liye hai.'
      },
      {
        q: 'She is a teacher, ___?',
        options: ['is she', 'isn’t she', 'doesn’t she', 'isn’t it'],
        answer: 1,
        explain: 'Positive statement ke baad negative tag aata hai aur same auxiliary use hota hai: isn’t she.'
      },
      {
        q: 'Who ___ the window?',
        options: ['did break', 'broke', 'does break', 'has broke'],
        answer: 1,
        explain: 'Jab who subject ho to normal statement order rehta hai aur did nahi lagta: Who broke...?'
      },
      {
        q: 'Choose the correct question.',
        options: [
          'What you are doing?',
          'What are you doing?',
          'What do you doing?',
          'What you doing are?'
        ],
        answer: 1,
        explain: 'Wh-word + auxiliary + subject + verb-ing: What are you doing?'
      }
    ]
  });

  academy.topics.push({
    id: 'conjunctions',
    order: 12,
    category: 'sentences',
    title: 'Conjunctions',
    icon: '&',
    level: 'Beginner',
    minutes: 8,
    summary: 'and, but, because, although, either...or aur pairs.',
    intro: [
      'Conjunction woh word hai jo words, phrases ya sentences ko jodta hai. Isse hamare sentences lambe aur smooth ban jaate hain.',
      'Teen types hain: Coordinating (barabar clauses jodte hain), Subordinating (ek clause ko dusre par depend banate hain) aur Correlative (pairs mein aate hain).'
    ],
    rules: [
      {
        title: '1. Coordinating: for, and, nor, but, or, yet, so',
        text: 'Ye do barabar clauses ya words ko jodte hain. Yaad karne ka tareeka: FANBOYS.',
        examples: [
          ex('I was tired, but I finished the work.', 'Main thaka hua tha, lekin maine kaam khatam kiya.'),
          ex('Do you want tea or coffee?', 'Tumhe chai chahiye ya coffee?')
        ]
      },
      {
        title: '2. Subordinating: because, although, if, when, while, unless',
        text: 'Ye dependent clause ko main clause se jodte hain. Agar dependent clause pehle aaye to uske baad comma lagta hai.',
        examples: [
          ex('I stayed home because it was raining.', 'Main ghar par raha kyunki baarish ho rahi thi.'),
          ex('Although it was cold, we went out.', 'Thand hone ke bawajood hum bahar gaye.')
        ]
      },
      {
        title: '3. Correlative pairs: either...or, neither...nor, both...and',
        text: 'Ye jodi mein aate hain aur dono hisse zaroori hote hain: either...or, neither...nor, both...and, not only...but also, whether...or.',
        examples: [
          ex('She is both smart and kind.', 'Woh smart bhi hai aur dayalu bhi.'),
          ex('Neither Ravi nor Amit came to the party.', 'Na Ravi aaya na Amit party mein.')
        ]
      },
      {
        title: '4. Although/Though ke saath “but” nahi',
        text: 'Hindi mein “halanki...lekin” bolte hain, par English mein although ke saath but nahi lagta. Ek hi conjunction kaafi hai.',
        examples: [
          ex('Although he was tired, he kept working.', 'Thaka hone ke bawajood woh kaam karta raha.')
        ]
      },
      {
        title: '5. Because ke saath “so” nahi',
        text: 'Because aur so dono ek hi sentence mein saath nahi aate. Ya to because use karo, ya so.',
        examples: [
          ex('I was late because the bus broke down.', 'Main late hua kyunki bus kharab ho gayi.'),
          ex('The bus broke down, so I was late.', 'Bus kharab ho gayi, isliye main late hua.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'Although he was tired, but he worked.',
        right: 'Although he was tired, he worked.',
        why: 'Although ke saath but nahi lagta.'
      },
      {
        wrong: 'Because it was raining, so we stayed home.',
        right: 'Because it was raining, we stayed home.',
        why: 'Because ke saath so nahi lagta.'
      },
      {
        wrong: 'Neither he or I knew.',
        right: 'Neither he nor I knew.',
        why: 'neither ke saath nor aata hai, or nahi.'
      },
      {
        wrong: 'She is both smart or kind.',
        right: 'She is both smart and kind.',
        why: 'both ke saath and aata hai.'
      }
    ],
    quiz: [
      {
        q: 'She was tired, ___ she kept working.',
        options: ['because', 'yet', 'unless', 'or'],
        answer: 1,
        explain: 'Do viprit baatein (thaki hui, phir bhi kaam kiya) jodne ke liye “yet” (phir bhi) aata hai.'
      },
      {
        q: 'I stayed at home ___ it was raining.',
        options: ['because', 'but', 'or', 'so'],
        answer: 0,
        explain: 'Wajah batane ke liye because aata hai.'
      },
      {
        q: 'Neither Ravi ___ Amit came to the party.',
        options: ['or', 'and', 'nor', 'but'],
        answer: 2,
        explain: '“neither” ka pair “nor” hota hai.'
      },
      {
        q: 'Choose the correct sentence.',
        options: [
          'Although it was cold, but we went out.',
          'Although it was cold, we went out.',
          'Although it was cold, so we went out.',
          'Although it was cold, because we went out.'
        ],
        answer: 1,
        explain: 'Although ek hi conjunction kaafi hai. But, so ya because saath nahi lagta.'
      },
      {
        q: 'You can have either tea ___ coffee.',
        options: ['nor', 'and', 'or', 'but'],
        answer: 2,
        explain: '“either” ka pair “or” hota hai.'
      }
    ]
  });

  academy.topics.push({
    id: 'conditionals',
    order: 13,
    category: 'sentences',
    title: 'Conditionals',
    icon: 'if',
    level: 'Intermediate',
    minutes: 11,
    summary: 'Zero, First, Second aur Third conditional (if sentences).',
    intro: [
      'If-sentence mein ek shart (condition) hoti hai aur uska natija (result). Jaise: If it rains, we will stay at home.',
      'Chaar types hain. Type is baat se tay hota hai ki baat sach/possible hai ya sirf imagination ya beeta hua afsos.'
    ],
    rules: [
      {
        title: '1. Zero Conditional: sachchai aur facts',
        text: 'Formula: If + Present Simple, Present Simple. Jo cheez hamesha sach hoti hai.',
        examples: [
          ex('If you heat ice, it melts.', 'Agar barf ko garam karo to woh pighalti hai.')
        ]
      },
      {
        title: '2. First Conditional: possible future',
        text: 'Formula: If + Present Simple, will + V1. Jo cheez hone ki asli sambhavna ho.',
        examples: [
          ex('If it rains, we will stay at home.', 'Agar baarish hui to hum ghar par rahenge.')
        ]
      },
      {
        title: '3. Second Conditional: imaginary present',
        text: 'Formula: If + Past Simple, would + V1. Jo abhi sach nahi hai, bas kalpana hai. Be-verb mein sabhi subjects ke saath “were” aa sakta hai.',
        examples: [
          ex('If I had a car, I would drive to work.', 'Agar mere paas car hoti to main kaam par car se jaata.'),
          ex('If I were you, I would apologise.', 'Agar main tumhari jagah hota to maafi maang leta.')
        ]
      },
      {
        title: '4. Third Conditional: beeta hua afsos',
        text: 'Formula: If + Past Perfect, would have + V3. Jo beet chuka hai aur ab badal nahi sakte.',
        examples: [
          ex('If she had studied, she would have passed.', 'Agar usne padhai ki hoti to woh pass ho jaati.')
        ]
      },
      {
        title: '5. Unless = if not',
        text: 'Unless ke saath positive verb lagta hai, kyunki “unless” khud negative matlab rakhta hai.',
        examples: [
          ex('Unless you hurry, you will miss the bus.', 'Agar tum jaldi nahi karoge to bus chhoot jaayegi.')
        ]
      },
      {
        title: '6. If-clause mein will/would nahi',
        text: 'Aam taur par if wale hisse mein will ya would nahi aata. Future ke liye bhi Present Simple use hota hai.',
        examples: [
          ex('If you come early, I will help you.', 'Agar tum jaldi aaoge to main tumhari madad karunga.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'If it will rain, we will stay home.',
        right: 'If it rains, we will stay home.',
        why: 'If-clause mein will nahi lagta. Present Simple use hota hai.'
      },
      {
        wrong: 'If I would be rich, I would buy a house.',
        right: 'If I were rich, I would buy a house.',
        why: 'Second conditional ke if-clause mein would nahi, Past Simple (were) aata hai.'
      },
      {
        wrong: 'If he studied hard, he would have passed.',
        right: 'If he had studied hard, he would have passed.',
        why: 'Third conditional mein if ke saath Past Perfect (had studied) aata hai.'
      },
      {
        wrong: 'Unless you don’t hurry, you will miss the train.',
        right: 'Unless you hurry, you will miss the train.',
        why: '“unless” = if not. Saath mein dobara not lagane se double negative ho jaata hai.'
      }
    ],
    quiz: [
      {
        q: 'If it ___ tomorrow, we will cancel the trip.',
        options: ['will rain', 'rains', 'rained', 'would rain'],
        answer: 1,
        explain: 'First conditional mein if ke baad Present Simple aata hai: rains.'
      },
      {
        q: 'If I ___ you, I would take that job.',
        options: ['am', 'was being', 'were', 'will be'],
        answer: 2,
        explain: 'Imaginary situation mein “If I were you” bolte hain.'
      },
      {
        q: 'If she had left earlier, she ___ the train.',
        options: ['would catch', 'will catch', 'would have caught', 'had caught'],
        answer: 2,
        explain: 'Third conditional: If + had + V3, would have + V3. Yahan “would have caught”.'
      },
      {
        q: 'The Zero Conditional is used for ___.',
        options: [
          'general truths and facts',
          'imaginary situations',
          'past regrets',
          'future plans only'
        ],
        answer: 0,
        explain: 'Zero conditional (If + Present Simple, Present Simple) hamesha sach rehne wali baat ke liye hai.'
      },
      {
        q: 'Choose the correct sentence.',
        options: [
          'Unless you don’t study, you will fail.',
          'Unless you study, you will fail.',
          'If you will not study, you will fail.',
          'Unless you will study, you will fail.'
        ],
        answer: 1,
        explain: '“Unless you study” ka matlab “if you don’t study”. Unless ke saath positive verb aata hai.'
      }
    ]
  });

  academy.topics.push({
    id: 'direct-indirect',
    order: 14,
    category: 'advanced',
    title: 'Direct / Indirect Speech',
    icon: '\u201C \u201D',
    level: 'Intermediate',
    minutes: 13,
    summary: 'Kisi ki baat quotes mein ya report karke kaise batate hain.',
    intro: [
      'Direct speech mein kisi ke exact shabd quotes mein likhte hain: He said, “I am tired.” Indirect speech mein hum wahi baat apne shabdon mein batate hain: He said that he was tired.',
      'Indirect speech mein teen cheezein badalti hain: tense (aksar ek step peeche), pronoun aur time/place ke words.'
    ],
    rules: [
      {
        title: '1. Statement: “that” lagta hai',
        text: 'Quotes hat jaate hain, “that” judta hai, aur pronoun reporting ke hisaab se badal jaata hai.',
        examples: [
          ex('He said, “I am tired.”', 'Usne kaha, “Main thaka hua hoon.” (Direct)'),
          ex('He said that he was tired.', 'Usne kaha ki woh thaka hua tha. (Indirect)')
        ]
      },
      {
        title: '2. Tense ek step peeche (backshift)',
        text: 'Present Simple - Past Simple, Present Continuous - Past Continuous, Present Perfect - Past Perfect, Past Simple - Past Perfect, will - would, can - could, may - might.',
        examples: [
          ex('She said, “I will help you.”', 'Usne kaha, “Main tumhari madad karungi.”'),
          ex('She said that she would help me.', 'Usne kaha ki woh meri madad karegi.')
        ]
      },
      {
        title: '3. Time aur place ke words badalte hain',
        text: 'now - then, today - that day, tomorrow - the next day, yesterday - the previous day, here - there, this - that.',
        examples: [
          ex('He said, “I will come tomorrow.”', 'Usne kaha, “Main kal aaunga.”'),
          ex('He said that he would come the next day.', 'Usne kaha ki woh agle din aayega.')
        ]
      },
      {
        title: '4. Questions: if/whether ya wh-word, statement order',
        text: 'Yes/No question mein if ya whether lagta hai. Wh-question mein wahi wh-word rehta hai. Dono mein verb statement ke order mein aata hai (do/does/did hat jaata hai).',
        examples: [
          ex('He asked, “Do you like tea?”', 'Usne poocha, “Kya tumhe chai pasand hai?”'),
          ex('He asked if I liked tea.', 'Usne poocha ki kya mujhe chai pasand hai.'),
          ex('She asked, “Where do you live?”', 'Usne poocha, “Tum kahan rehte ho?”'),
          ex('She asked where I lived.', 'Usne poocha ki main kahan rehta hoon.')
        ]
      },
      {
        title: '5. Commands aur requests: to + V1',
        text: 'Hukum ke liye told/ordered, request ke liye asked/requested aur uske baad to + V1 aata hai. Negative command mein “not to” aata hai.',
        examples: [
          ex('The teacher said to the boy, “Sit down.”', 'Teacher ne ladke se kaha, “Baith jao.”'),
          ex('The teacher told the boy to sit down.', 'Teacher ne ladke ko baithne ko kaha.')
        ]
      },
      {
        title: '6. Kab tense nahi badalta',
        text: 'Agar reporting verb present mein ho (He says) ya baat universal truth ho, to tense aam taur par nahi badalta.',
        examples: [
          ex('He says, “I am busy.”', 'Woh kehta hai, “Main busy hoon.”'),
          ex('He says that he is busy.', 'Woh kehta hai ki woh busy hai.'),
          ex('The teacher said that the earth moves around the sun.', 'Teacher ne kaha ki prithvi suraj ke chaaron taraf ghumti hai.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'She asked me where did I live.',
        right: 'She asked me where I lived.',
        why: 'Indirect question mein statement order aata hai. did/does nahi lagta.'
      },
      {
        wrong: 'He told that he was busy.',
        right: 'He said that he was busy. / He told me that he was busy.',
        why: '“tell” ke baad person (me, him...) zaroori hai. Bina person ke “said” use karo.'
      },
      {
        wrong: 'She asked if did I know him.',
        right: 'She asked if I knew him.',
        why: 'if ke baad bhi statement order aata hai: if + subject + verb.'
      },
      {
        wrong: 'He said me to go.',
        right: 'He told me to go.',
        why: 'Command ke liye “told + person + to + V1” aata hai.'
      }
    ],
    quiz: [
      {
        q: 'Indirect speech of: He said, “I am happy.”',
        options: [
          'He said that he was happy.',
          'He said that he will be happy.',
          'He said that I was happy.',
          'He said that he had been happy.'
        ],
        answer: 0,
        explain: 'Present Simple (am) Past Simple (was) ban jaata hai aur pronoun I - he.'
      },
      {
        q: 'Indirect speech of: She said, “I will call tomorrow.”',
        options: [
          'She said that she would call the next day.',
          'She said that she will call tomorrow.',
          'She said that I would call the next day.',
          'She says that she would call the next day.'
        ],
        answer: 0,
        explain: 'will - would aur tomorrow - the next day ho jaata hai.'
      },
      {
        q: 'Indirect speech of: He asked me, “Where do you live?”',
        options: [
          'He asked me where did I live.',
          'He asked me where I lived.',
          'He asked me that where I lived.',
          'He asked me where do I live.'
        ],
        answer: 1,
        explain: 'Wh-question mein wh-word rehta hai, order statement jaisa ho jaata hai aur tense ek step peeche jaata hai.'
      },
      {
        q: 'In indirect speech, “today” usually changes to ___.',
        options: ['tomorrow', 'that day', 'yesterday', 'now'],
        answer: 1,
        explain: 'today - that day. Baaki changes: tomorrow - the next day, yesterday - the previous day.'
      },
      {
        q: 'Indirect speech of: The teacher said to the boy, “Sit down.”',
        options: [
          'The teacher told the boy to sit down.',
          'The teacher told the boy that sit down.',
          'The teacher said the boy to sit down.',
          'The teacher asked the boy sits down.'
        ],
        answer: 0,
        explain: 'Command ke liye “told + person + to + V1” aata hai.'
      }
    ]
  });

  academy.topics.push({
    id: 'common-mistakes',
    order: 15,
    category: 'advanced',
    title: 'Common Grammar Mistakes',
    icon: '\u2717\u2713',
    level: 'Intermediate',
    minutes: 10,
    summary: 'Aam galtiyan jo bolchaal aur writing mein baar-baar hoti hain.',
    intro: [
      'Hindi ya Hinglish mein sochkar English bolne par kuch galtiyan baar-baar hoti hain. Ye lesson unhi aam patterns ko pakadta hai.',
      'Har rule ke saath sahi example hai. Agar aap in 7 baaton ko yaad rakhenge to aapki English kaafi saaf ho jaayegi.'
    ],
    rules: [
      {
        title: '1. In verbs ke baad preposition nahi',
        text: 'discuss, enter, reach, attend, marry, answer jaise verbs ke baad about/to/in/on lagane ki zaroorat nahi hoti.',
        examples: [
          ex('We discussed the plan.', 'Humne plan par baat ki.'),
          ex('He entered the room.', 'Woh kamre mein daakhil hua.'),
          ex('We reached Delhi at noon.', 'Hum dopahar mein Delhi pahunche.')
        ]
      },
      {
        title: '2. Uncountable nouns: advice, information, furniture, news',
        text: 'Inke saath a/an nahi lagta aur inka plural (s) nahi banta. Ginti ke liye “a piece of” use hota hai.',
        examples: [
          ex('She gave me good advice.', 'Usne mujhe achhi salaah di.'),
          ex('I need some information.', 'Mujhe kuch jaankari chahiye.'),
          ex('That is a piece of good news.', 'Ye ek achhi khabar hai.')
        ]
      },
      {
        title: '3. State verbs -ing mein nahi',
        text: 'know, like, love, want, need, believe, understand jaise verbs aam taur par continuous (-ing) mein nahi aate.',
        examples: [
          ex('I know the answer.', 'Mujhe jawab pata hai.'),
          ex('She wants a new phone.', 'Use naya phone chahiye.')
        ]
      },
      {
        title: '4. Their / There / They’re aur Its / It’s',
        text: 'their = unka. there = wahan. they’re = they are. its = uska. it’s = it is.',
        examples: [
          ex('They’re going to their house over there.', 'Woh log wahan apne ghar ja rahe hain.'),
          ex('The dog wagged its tail. It’s happy.', 'Kutte ne poonchh hilayi. Woh khush hai.')
        ]
      },
      {
        title: '5. Fewer / Less aur Many / Much',
        text: 'Ginne yogya cheezein (books, students): fewer, many. Na ginne yogya (water, time): less, much.',
        examples: [
          ex('There are fewer books on the shelf.', 'Shelf par kam kitaabein hain.'),
          ex('I have less time today.', 'Aaj mere paas kam time hai.'),
          ex('How many students are there? How much water do you need?', 'Kitne students hain? Tumhe kitna paani chahiye?')
        ]
      },
      {
        title: '6. Double negative se bacho',
        text: 'Ek sentence mein ek hi negative kaafi hai. “Not” ke saath nothing, nobody, never mat lagao; uski jagah anything, anybody, ever lagao.',
        examples: [
          ex('I don’t know anything.', 'Mujhe kuch nahi pata.'),
          ex('She never says anything.', 'Woh kabhi kuch nahi kehti.')
        ]
      },
      {
        title: '7. Hinglish se aaye phrases',
        text: 'Light “open/close” nahi hoti, “turn on/off” hoti hai. “Return back” mein back extra hai, kyunki return ka matlab hi wapas aana hai.',
        examples: [
          ex('Please turn off the light.', 'Please light band karo.'),
          ex('She returned home late.', 'Woh der se ghar lauti.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'I am having a car.',
        right: 'I have a car.',
        why: '“have” jab malkiyat batata hai to continuous mein nahi aata.'
      },
      {
        wrong: 'He told me a good news.',
        right: 'He told me some good news.',
        why: '“news” uncountable hai, isliye a nahi lagta.'
      },
      {
        wrong: 'I am agree with you.',
        right: 'I agree with you.',
        why: '“agree” khud verb hai. Iske saath am/is/are nahi lagta.'
      },
      {
        wrong: 'Open the light, please.',
        right: 'Turn on the light, please.',
        why: 'Light, fan, TV ke liye turn on / turn off kehte hain.'
      },
      {
        wrong: 'Please return back to your seat.',
        right: 'Please return to your seat.',
        why: '“return” ka matlab hi wapas jaana hai, “back” extra hai.'
      }
    ],
    quiz: [
      {
        q: 'Choose the correct sentence.',
        options: [
          'We discussed about the problem.',
          'We discussed the problem.',
          'We discussed on the problem.',
          'We discussed over the problem.'
        ],
        answer: 1,
        explain: '“discuss” ke baad preposition nahi lagta.'
      },
      {
        q: 'She gave me some good ___.',
        options: ['advices', 'advice', 'an advice', 'advise'],
        answer: 1,
        explain: '“advice” uncountable noun hai: na a/an, na plural s. “advise” verb hai.'
      },
      {
        q: 'I ___ the answer.',
        options: ['am knowing', 'know', 'knowing', 'knowed'],
        answer: 1,
        explain: '“know” state verb hai, isliye continuous (-ing) nahi banta. Sahi: I know.'
      },
      {
        q: 'The students said ___ going to the museum.',
        options: ['their', 'there', 'they’re', 'theirs'],
        answer: 2,
        explain: '“they’re” = they are. Yahan “they are going to the museum” bana hai.'
      },
      {
        q: 'There are ___ students in class today than yesterday.',
        options: ['less', 'fewer', 'little', 'lesser'],
        answer: 1,
        explain: 'Students ginne yogya hain, isliye “fewer”. “less” uncountable nouns ke saath aata hai.'
      }
    ]
  });
})();
