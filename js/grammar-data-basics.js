/* Grammar Academy content - Basics (offline, no API). */
(function () {
  'use strict';
  var academy = (window.GrammarAcademy = window.GrammarAcademy || { topics: [] });
  var ex = function (en, hi) { return { en: en, hi: hi }; };

  academy.topics.push({
    id: 'parts-of-speech',
    order: 1,
    category: 'basics',
    title: 'Parts of Speech',
    icon: 'Aa',
    level: 'Beginner',
    minutes: 8,
    summary: 'English ke 8 word-types: noun, verb, adjective aur baaki.',
    intro: [
      'English ke har word ka sentence mein ek kaam hota hai. Is kaam ke hisaab se words ko 8 groups mein baanta gaya hai. Inhe Parts of Speech kehte hain.',
      'Dhyan rakho: ek hi word sentence ke hisaab se alag part of speech ban sakta hai. Jaise “play” kabhi verb hota hai (I play cricket) aur kabhi noun (We watched a play).'
    ],
    rules: [
      {
        title: '1. Noun - naam batata hai',
        text: 'Kisi insaan, jagah, cheez ya idea ke naam ko noun kehte hain.',
        examples: [
          ex('Riya lives in Delhi.', 'Riya Delhi mein rehti hai.'),
          ex('Honesty is important.', 'Imaandaari zaroori hoti hai.')
        ]
      },
      {
        title: '2. Pronoun - noun ki jagah',
        text: 'Baar-baar same noun na bolna pade, isliye pronoun (he, she, it, they...) use hota hai.',
        examples: [
          ex('Riya is smart. She works hard.', 'Riya smart hai. Woh mehnat karti hai.')
        ]
      },
      {
        title: '3. Verb - kaam ya halat',
        text: 'Verb batata hai ki koi kya karta hai ya kaisa hai. Har sentence mein verb zaroori hota hai.',
        examples: [
          ex('Birds fly.', 'Parinde udte hain.'),
          ex('I am happy.', 'Main khush hoon.')
        ]
      },
      {
        title: '4. Adjective - noun ke baare mein batata hai',
        text: 'Adjective noun ya pronoun ki quality batata hai: kaisa, kitna, kaunsa.',
        examples: [
          ex('She has a red bag.', 'Uske paas ek laal bag hai.'),
          ex('The soup is hot.', 'Soup garam hai.')
        ]
      },
      {
        title: '5. Adverb - kaise, kab, kahan',
        text: 'Adverb verb, adjective ya dusre adverb ke baare mein batata hai. Zyada-tar adverb adjective + ly se bante hain.',
        examples: [
          ex('He speaks slowly.', 'Woh dheere bolta hai.'),
          ex('The tea is very hot.', 'Chai bahut garam hai.')
        ]
      },
      {
        title: '6. Preposition - relation batata hai',
        text: 'Preposition noun/pronoun ka dusre word se relation batata hai: jagah, time ya direction.',
        examples: [
          ex('The book is on the table.', 'Kitaab table par hai.')
        ]
      },
      {
        title: '7. Conjunction - jodta hai',
        text: 'Conjunction words, phrases ya sentences ko jodta hai: and, but, or, because.',
        examples: [
          ex('I like tea and coffee.', 'Mujhe chai aur coffee pasand hai.')
        ]
      },
      {
        title: '8. Interjection - achanak feeling',
        text: 'Khushi, hairani ya dard jaisi achanak feeling dikhane ke liye. Aksar iske baad ! lagta hai.',
        examples: [
          ex('Wow! What a goal!', 'Wah! Kya goal tha!')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'She sings beautiful.',
        right: 'She sings beautifully.',
        why: 'Verb “sings” ko describe karna hai, isliye adverb (beautifully) chahiye, adjective (beautiful) nahi.'
      },
      {
        wrong: 'He works hardly.',
        right: 'He works hard.',
        why: '“hard” ka matlab mehnat se. “hardly” ka matlab bilkul kam (barely) hota hai.'
      },
      {
        wrong: 'I want to advice you.',
        right: 'I want to advise you.',
        why: '“advice” noun hai (salaah). Verb (salaah dena) “advise” hota hai.'
      }
    ],
    quiz: [
      {
        q: 'In the sentence “Riya runs fast”, what is the word “fast”?',
        options: ['Noun', 'Adjective', 'Adverb', 'Preposition'],
        answer: 2,
        explain: '“fast” yahan verb “runs” ko describe kar raha hai (kaise daudti hai), isliye adverb. “She has a fast car” mein wahi word adjective hota.'
      },
      {
        q: 'Which word is a preposition in: “The cat is under the table.”?',
        options: ['cat', 'is', 'under', 'table'],
        answer: 2,
        explain: '“under” cat aur table ka position relation batata hai, isliye preposition.'
      },
      {
        q: 'Choose the correct word: He drives very ___.',
        options: ['careful', 'carefully', 'care', 'carefulness'],
        answer: 1,
        explain: 'Verb “drives” ko describe karne ke liye adverb chahiye: carefully.'
      },
      {
        q: '“Wow! That is amazing!” - what is “Wow”?',
        options: ['Conjunction', 'Pronoun', 'Interjection', 'Verb'],
        answer: 2,
        explain: 'Achanak feeling dikhane wale word ko interjection kehte hain.'
      },
      {
        q: 'Which word is a noun in: “Honesty is the best policy.”?',
        options: ['is', 'the', 'Honesty', 'best'],
        answer: 2,
        explain: '“Honesty” ek idea ka naam hai, isliye noun. “is” verb hai, “the” article hai aur “best” adjective.'
      }
    ]
  });

  academy.topics.push({
    id: 'pronouns',
    order: 2,
    category: 'basics',
    title: 'Pronouns',
    icon: 'he/we',
    level: 'Beginner',
    minutes: 8,
    summary: 'I/me/my/mine/myself: kaunsa pronoun kahan lagta hai.',
    intro: [
      'Pronoun woh word hai jo noun ki jagah aata hai, taaki baar-baar naam na dohrana pade.',
      'Pronoun ki alag-alag forms hoti hain. Sentence mein uska kaam (subject, object ya malkiyat) dekhkar sahi form chunni padti hai. Yahi sabse badi confusion hoti hai.'
    ],
    rules: [
      {
        title: '1. Subject pronouns: I, you, he, she, it, we, they',
        text: 'Ye verb se pehle aate hain aur kaam karne wale ko dikhate hain.',
        examples: [
          ex('She is my sister.', 'Woh meri behen hai.'),
          ex('They play cricket.', 'Woh log cricket khelte hain.')
        ]
      },
      {
        title: '2. Object pronouns: me, you, him, her, it, us, them',
        text: 'Ye verb ya preposition ke baad aate hain.',
        examples: [
          ex('Please call me.', 'Please mujhe phone karo.'),
          ex('I met them yesterday.', 'Main kal unse mila.')
        ]
      },
      {
        title: '3. Possessive adjectives: my, your, his, her, its, our, their',
        text: 'Ye noun se pehle aate hain aur batate hain ki cheez kiski hai.',
        examples: [
          ex('This is my bag.', 'Ye mera bag hai.')
        ]
      },
      {
        title: '4. Possessive pronouns: mine, yours, his, hers, ours, theirs',
        text: 'Ye akele aate hain, iske baad noun nahi lagta.',
        examples: [
          ex('This bag is mine.', 'Ye bag mera hai.'),
          ex('The red pen is hers.', 'Laal pen uska hai.')
        ]
      },
      {
        title: '5. Reflexive pronouns: myself, himself, themselves...',
        text: 'Jab kaam karne wala aur jis par kaam hua, dono ek hi hon.',
        examples: [
          ex('I hurt myself.', 'Maine khud ko chot pahunchai.'),
          ex('She made the cake herself.', 'Usne cake khud banaya.')
        ]
      },
      {
        title: '6. Relative pronouns: who, whom, whose, which, that',
        text: 'Ye do sentences ko jodte hain. “who” insaan ke liye, “which” cheez ke liye aur “whose” malkiyat ke liye.',
        examples: [
          ex('The girl who sings is my cousin.', 'Jo ladki gaati hai woh meri cousin hai.'),
          ex('I know a boy whose father is a pilot.', 'Main ek ladke ko jaanta hoon jiske papa pilot hain.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'Me and my friend went to the market.',
        right: 'My friend and I went to the market.',
        why: 'Subject position mein “I” aata hai, “me” nahi. Aur politeness ke liye dusre ka naam pehle bolte hain.'
      },
      {
        wrong: 'This book is my.',
        right: 'This book is mine.',
        why: '“my” ke baad noun chahiye. Akele use karna ho to “mine” lagta hai.'
      },
      {
        wrong: 'The dog wagged it’s tail.',
        right: 'The dog wagged its tail.',
        why: '“it’s” ka matlab “it is” hota hai. Malkiyat ke liye “its” (bina apostrophe) use hota hai.'
      },
      {
        wrong: 'This is between you and I.',
        right: 'This is between you and me.',
        why: 'Preposition (between) ke baad object pronoun “me” aata hai.'
      }
    ],
    quiz: [
      {
        q: 'This pen is not ___. It is hers.',
        options: ['my', 'me', 'mine', 'I'],
        answer: 2,
        explain: 'Yahan noun nahi aa raha, isliye possessive pronoun “mine” chahiye.'
      },
      {
        q: 'The teacher gave ___ a gift.',
        options: ['I', 'my', 'me', 'mine'],
        answer: 2,
        explain: 'Verb “gave” ke baad object pronoun aata hai: me.'
      },
      {
        q: 'She cut ___ while cooking.',
        options: ['her', 'herself', 'she', 'hers'],
        answer: 1,
        explain: 'Kaam karne wali aur chot lagne wali dono wahi ladki hai, isliye reflexive pronoun “herself”.'
      },
      {
        q: 'The man ___ lives next door is a doctor.',
        options: ['whom', 'whose', 'who', 'which'],
        answer: 2,
        explain: 'Insaan ke subject ke liye “who” use hota hai.'
      },
      {
        q: 'Which sentence is correct?',
        options: [
          'Me and my friend went to the market.',
          'My friend and me went to the market.',
          'My friend and I went to the market.',
          'Myself and my friend went to the market.'
        ],
        answer: 2,
        explain: 'Subject ke roop mein “I” sahi hai aur dusre ka naam pehle bolna polite maana jaata hai. “Myself” subject nahi ban sakta.'
      }
    ]
  });

  academy.topics.push({
    id: 'adjectives-adverbs',
    order: 3,
    category: 'basics',
    title: 'Adjectives & Adverbs',
    icon: 'Ad',
    level: 'Beginner',
    minutes: 9,
    summary: 'Good vs well, quick vs quickly aur comparison (-er, -est).',
    intro: [
      'Adjective noun ki quality batata hai (beautiful girl). Adverb batata hai ki kaam kaise, kab ya kitna hua (speaks clearly).',
      'Sabse badi galti: verb ke saath adjective laga dena. Yaad rakho: noun ke liye adjective, verb ke liye adverb.'
    ],
    rules: [
      {
        title: '1. Adjective noun ko describe karta hai',
        text: 'Adjective noun se pehle aata hai ya be-verb (is, am, are, was) ke baad.',
        examples: [
          ex('She lives in a beautiful house.', 'Woh ek khoobsurat ghar mein rehti hai.'),
          ex('The garden is beautiful.', 'Bagicha khoobsurat hai.')
        ]
      },
      {
        title: '2. Adverb of manner: adjective + ly',
        text: 'Zyada-tar adverb adjective ke end mein -ly lagakar bante hain: quick - quickly, careful - carefully.',
        examples: [
          ex('She walks slowly.', 'Woh dheere chalti hai.'),
          ex('Please drive carefully.', 'Please dhyaan se gaadi chalao.')
        ]
      },
      {
        title: '3. Irregular adverbs: good - well, fast - fast, hard - hard',
        text: '“good” adjective hai aur uska adverb “well” hai. “fast”, “hard”, “late” ka adverb wahi rehta hai.',
        examples: [
          ex('He plays well.', 'Woh achha khelta hai.'),
          ex('She runs fast.', 'Woh tez daudti hai.')
        ]
      },
      {
        title: '4. Adverbs ke aur types',
        text: 'Frequency (always, never), time (now, yesterday), place (here, outside) aur degree (very, quite, too).',
        examples: [
          ex('I never eat late at night.', 'Main raat ko der se kabhi nahi khata.'),
          ex('The tea is very hot.', 'Chai bahut garam hai.')
        ]
      },
      {
        title: '5. Comparison: -er / -est aur more / most',
        text: 'Chhote words mein -er, -est lagta hai (tall - taller - tallest). Lambe words mein more, most (interesting - more interesting - most interesting).',
        examples: [
          ex('Ravi is taller than Amit.', 'Ravi Amit se lamba hai.'),
          ex('This is the most interesting book.', 'Ye sabse dilchasp kitaab hai.')
        ]
      },
      {
        title: '6. Adjectives ka order',
        text: 'Kai adjectives saath hon to aam order: opinion, size, age, colour, material. Is order ko badalne se sentence ajeeb lagta hai.',
        examples: [
          ex('She bought a beautiful red silk scarf.', 'Usne ek khoobsurat laal resham ka scarf kharida.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'She sings good.',
        right: 'She sings well.',
        why: '“sings” verb hai, usko describe karne ke liye adverb “well” aata hai, adjective “good” nahi.'
      },
      {
        wrong: 'He is more taller than me.',
        right: 'He is taller than me.',
        why: '“taller” mein pehle se comparison hai. Saath mein “more” lagana double comparison hai.'
      },
      {
        wrong: 'She is the most smartest girl.',
        right: 'She is the smartest girl.',
        why: 'Ya to “smartest” ya “most smart”. Dono ek saath nahi aate.'
      },
      {
        wrong: 'I feel very sleepy, so I will go to bed lately.',
        right: 'I feel very sleepy, so I will go to bed late.',
        why: '“lately” ka matlab haal hi mein hota hai. Der se ke liye “late” use hota hai.'
      }
    ],
    quiz: [
      {
        q: 'She speaks English very ___.',
        options: ['good', 'well', 'best', 'goodly'],
        answer: 1,
        explain: 'Verb “speaks” ko describe karna hai, isliye adverb “well”. “good” adjective hai.'
      },
      {
        q: 'This is the ___ book I have ever read.',
        options: ['more interesting', 'most interesting', 'interestinger', 'much interesting'],
        answer: 1,
        explain: 'Lambe adjective ke saath superlative “most” se banta hai, aur “the” ke baad “most interesting” aata hai.'
      },
      {
        q: 'He drives very ___.',
        options: ['careful', 'care', 'carefully', 'carefulness'],
        answer: 2,
        explain: 'Verb “drives” ko describe karne ke liye adverb carefully.'
      },
      {
        q: 'Which sentence is correct?',
        options: [
          'Ravi is more taller than Amit.',
          'Ravi is taller than Amit.',
          'Ravi is tallest than Amit.',
          'Ravi is more tall than Amit.'
        ],
        answer: 1,
        explain: 'Chhote adjective mein -er lagta hai: taller than. “more taller” double comparison hai.'
      },
      {
        q: 'Which word is an adverb in: “She quickly finished her work.”?',
        options: ['She', 'quickly', 'finished', 'work'],
        answer: 1,
        explain: '“quickly” verb “finished” ke baare mein batata hai ki kaam kaise hua, isliye adverb.'
      }
    ]
  });

  academy.topics.push({
    id: 'articles',
    order: 4,
    category: 'basics',
    title: 'Articles',
    icon: 'a/an',
    level: 'Beginner',
    minutes: 7,
    summary: 'a, an, the: kab lagta hai aur kab bilkul nahi.',
    intro: [
      'Articles teen hain: a, an aur the. Ye noun se pehle aate hain.',
      '“a / an” ka matlab koi ek (pehli baar ya general baat). “the” ka matlab koi khaas, jaana-pehchana ya pehle bataya hua. Kabhi-kabhi koi article lagta hi nahi (zero article).'
    ],
    rules: [
      {
        title: '1. “a” - consonant sound se pehle',
        text: 'Spelling nahi, sound dekho. “university” u se shuru hota hai par sound “yu” (consonant) hai, isliye “a university”.',
        examples: [
          ex('She bought a book.', 'Usne ek kitaab kharidi.'),
          ex('He studies at a university.', 'Woh ek university mein padhta hai.')
        ]
      },
      {
        title: '2. “an” - vowel sound se pehle',
        text: 'a, e, i, o, u ki awaaz se shuru hone wale words se pehle “an”. “hour” aur “honest” mein h silent hai, isliye “an hour”, “an honest man”.',
        examples: [
          ex('I eat an apple every day.', 'Main roz ek seb khata hoon.'),
          ex('He is an honest man.', 'Woh ek imaandaar aadmi hai.')
        ]
      },
      {
        title: '3. “the” - khaas ya pehle bataya hua',
        text: 'Jab sunne wala jaanta ho ki kis cheez ki baat ho rahi hai, ya woh cheez pehle aa chuki ho.',
        examples: [
          ex('I saw a dog. The dog was big.', 'Maine ek kutta dekha. Woh kutta bada tha.'),
          ex('Please close the door.', 'Please darwaza band karo.')
        ]
      },
      {
        title: '4. “the” - unique cheezein aur superlative',
        text: 'Duniya mein ek hi hone wali cheezein (the sun, the moon) aur superlative (the best, the tallest) se pehle “the”. Rivers, oceans aur kuch jagah ke naam se pehle bhi “the” aata hai.',
        examples: [
          ex('The sun rises in the east.', 'Suraj purab mein ugta hai.'),
          ex('She is the tallest girl in the class.', 'Woh class ki sabse lambi ladki hai.')
        ]
      },
      {
        title: '5. Zero article: kuch jagah koi article nahi',
        text: 'General plural/uncountable nouns, khel, bhasha, meals aur zyada-tar shehar/desh ke naam se pehle article nahi lagta.',
        examples: [
          ex('I like music.', 'Mujhe music pasand hai.'),
          ex('She plays cricket.', 'Woh cricket khelti hai.'),
          ex('Breakfast is ready.', 'Naashta taiyaar hai.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'He is a honest man.',
        right: 'He is an honest man.',
        why: '“honest” mein h silent hai, awaaz vowel se shuru hoti hai, isliye “an”.'
      },
      {
        wrong: 'I have a umbrella.',
        right: 'I have an umbrella.',
        why: '“umbrella” vowel sound se shuru hota hai.'
      },
      {
        wrong: 'She is playing the cricket.',
        right: 'She is playing cricket.',
        why: 'Khel ke naam se pehle article nahi lagta.'
      },
      {
        wrong: 'Sun rises in east.',
        right: 'The sun rises in the east.',
        why: 'Unique cheez (sun) aur direction (east) se pehle “the” lagta hai.'
      }
    ],
    quiz: [
      {
        q: 'Choose the correct sentence.',
        options: [
          'She is a honest girl.',
          'She is an honest girl.',
          'She is honest a girl.',
          'She is girl honest.'
        ],
        answer: 1,
        explain: '“honest” mein h silent hai, awaaz vowel se shuru hoti hai, isliye “an honest girl”.'
      },
      {
        q: 'I saw ___ elephant. ___ elephant was huge.',
        options: ['a / The', 'an / The', 'an / An', 'the / A'],
        answer: 1,
        explain: 'Pehli baar zikr mein “an” (vowel sound), dobara usi hathi ki baat mein “The”.'
      },
      {
        q: '___ sun rises in ___ east.',
        options: ['A / the', 'The / the', 'The / an', 'No article / the'],
        answer: 1,
        explain: 'Sun unique hai aur east ek direction hai, dono se pehle “the”.'
      },
      {
        q: 'Choose the correct sentence.',
        options: [
          'She plays the cricket every evening.',
          'She plays cricket every evening.',
          'She plays an cricket every evening.',
          'She plays a cricket every evening.'
        ],
        answer: 1,
        explain: 'Khel ke naam se pehle article nahi lagta.'
      },
      {
        q: 'Which sentence is correct?',
        options: [
          'He is a university student.',
          'He is an university student.',
          'He is the a university student.',
          'He is university a student.'
        ],
        answer: 0,
        explain: '“university” ki awaaz “yu” se shuru hoti hai (consonant sound), isliye “a university”.'
      }
    ]
  });

  academy.topics.push({
    id: 'prepositions',
    order: 5,
    category: 'basics',
    title: 'Prepositions',
    icon: 'in/on',
    level: 'Beginner',
    minutes: 9,
    summary: 'at, on, in, since, for, between aur dependent prepositions.',
    intro: [
      'Preposition noun ya pronoun se pehle aata hai aur time, jagah, direction ya relation batata hai.',
      'Hindi mein ek hi “mein/par/se” kaafi hota hai, lekin English mein in, on, at, from, to jaise alag words hain. Isliye inke pattern yaad karna zaroori hai.'
    ],
    rules: [
      {
        title: '1. Time: at, on, in',
        text: 'at = exact time (at 9 am). on = din aur date (on Monday, on 5 May). in = mahina, saal, season aur din ke hisse (in June, in 2001, in the morning).',
        examples: [
          ex('The class starts at 9 am.', 'Class subah 9 baje shuru hoti hai.'),
          ex('My birthday is on 5 May.', 'Mera janamdin 5 May ko hai.'),
          ex('She was born in 2001.', 'Woh 2001 mein paida hui.')
        ]
      },
      {
        title: '2. Place: at, on, in',
        text: 'at = ek point (bus stop). on = surface ke upar. in = kisi band ya bade area ke andar.',
        examples: [
          ex('He is at the bus stop.', 'Woh bus stop par hai.'),
          ex('The book is on the table.', 'Kitaab table par hai.'),
          ex('The keys are in the bag.', 'Chaabiyan bag ke andar hain.')
        ]
      },
      {
        title: '3. Direction: to, into, from, through',
        text: '“to” kisi jagah ki taraf, “into” andar ghusne ke liye, “from” shuruaat ki jagah, “through” beech se guzarne ke liye.',
        examples: [
          ex('She went to the market.', 'Woh bazaar gayi.'),
          ex('He jumped into the river.', 'Usne nadi mein chhalaang lagayi.')
        ]
      },
      {
        title: '4. Since aur For',
        text: '“since” = shuruaat ka point (since 2018, since Monday). “for” = kitni der/kitne time tak (for six years, for two hours).',
        examples: [
          ex('I have lived here since 2018.', 'Main 2018 se yahan rehta hoon.'),
          ex('I have lived here for six years.', 'Main chhe saal se yahan rehta hoon.')
        ]
      },
      {
        title: '5. Between aur Among',
        text: '“between” do cheezon ke beech. “among” teen ya zyada ke beech.',
        examples: [
          ex('Sit between Ravi and Mohan.', 'Ravi aur Mohan ke beech mein baitho.'),
          ex('She is popular among her classmates.', 'Woh apne classmates mein popular hai.')
        ]
      },
      {
        title: '6. Dependent prepositions (yaad karne wale pairs)',
        text: 'Kuch words ke saath fixed preposition aata hai: good at, afraid of, interested in, depend on, listen to, wait for.',
        examples: [
          ex('She is good at maths.', 'Woh maths mein achhi hai.'),
          ex('I am waiting for you.', 'Main tumhara intezaar kar raha hoon.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'She is good in English.',
        right: 'She is good at English.',
        why: '“good” ke saath “at” aata hai (good at).'
      },
      {
        wrong: 'I will meet you in Monday.',
        right: 'I will meet you on Monday.',
        why: 'Din ke naam se pehle “on” lagta hai.'
      },
      {
        wrong: 'I am waiting you.',
        right: 'I am waiting for you.',
        why: '“wait” ke baad “for” aata hai.'
      },
      {
        wrong: 'We discussed about the plan.',
        right: 'We discussed the plan.',
        why: '“discuss” ke baad preposition nahi lagta.'
      },
      {
        wrong: 'He is married with a doctor.',
        right: 'He is married to a doctor.',
        why: '“married” ke saath “to” aata hai.'
      }
    ],
    quiz: [
      {
        q: 'The class starts ___ 9 o’clock.',
        options: ['on', 'at', 'in', 'by'],
        answer: 1,
        explain: 'Exact time (9 o’clock) se pehle “at” aata hai.'
      },
      {
        q: 'She has been ill ___ Monday.',
        options: ['for', 'since', 'from', 'in'],
        answer: 1,
        explain: 'Monday shuruaat ka point hai, isliye “since”. “for” ke saath duration aata hai (for three days).'
      },
      {
        q: 'He is afraid ___ dogs.',
        options: ['from', 'with', 'of', 'at'],
        answer: 2,
        explain: '“afraid” ke saath fixed preposition “of” aata hai.'
      },
      {
        q: 'I was born ___ 1999.',
        options: ['on', 'at', 'in', 'by'],
        answer: 2,
        explain: 'Saal se pehle “in” aata hai.'
      },
      {
        q: 'Choose the correct sentence.',
        options: [
          'We discussed about the plan.',
          'We discussed the plan.',
          'We discussed on the plan.',
          'We discussed of the plan.'
        ],
        answer: 1,
        explain: '“discuss” khud “baare mein” ka matlab rakhta hai, isliye uske baad koi preposition nahi lagta.'
      }
    ]
  });
})();
