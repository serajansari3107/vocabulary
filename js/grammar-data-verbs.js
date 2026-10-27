/* Grammar Academy content - Verbs & Tenses (offline, no API). */
(function () {
  'use strict';
  var academy = (window.GrammarAcademy = window.GrammarAcademy || { topics: [] });
  var ex = function (en, hi) { return { en: en, hi: hi }; };

  academy.topics.push({
    id: 'tenses',
    order: 6,
    category: 'verbs',
    title: '12 Tenses',
    icon: '12',
    level: 'Beginner',
    minutes: 20,
    summary: 'Present, Past, Future x Simple, Continuous, Perfect, Perfect Continuous.',
    intro: [
      'Tense batata hai ki kaam kis time par hua. Time 3 hain: Present (abhi), Past (beeta hua) aur Future (aane wala). Har time ke 4 type hote hain, isliye kul 12 tenses bante hain.',
      'Type ka matlab: Simple = aadat ya fact, Continuous = kaam abhi chal raha hai, Perfect = kaam pura ho chuka hai, Perfect Continuous = kaam kuch time se lagataar chal raha hai.'
    ],
    rules: [
      {
        title: '1. 3 time x 4 type = 12 tenses',
        text: 'Pehle time pehchano (present / past / future), phir type (simple / continuous / perfect / perfect continuous). Neeche har tense ka formula aur examples diye hain.',
        examples: [
          ex('I study every day.', 'Main roz padhta hoon. (Present Simple)'),
          ex('I am studying now.', 'Main abhi padh raha hoon. (Present Continuous)')
        ]
      },
      {
        title: '2. Verb ki 4 forms yaad rakho',
        text: 'V1 = base (eat), V2 = past (ate), V3 = past participle (eaten), V-ing = eating. Regular verbs mein V2 aur V3 dono verb + ed hote hain (play - played - played). Irregular verbs yaad karne padte hain: go - went - gone, write - wrote - written.',
        examples: [
          ex('She has eaten lunch.', 'Usne lunch kha liya hai. (has + V3)'),
          ex('He went home early.', 'Woh jaldi ghar gaya. (V2)')
        ]
      },
      {
        title: '3. Signal words se tense pehchano',
        text: 'Kuch words tense ka hint dete hain: always, every day (Present Simple), now, at the moment (Present Continuous), already, just, yet (Present Perfect), yesterday, ago (Past Simple), tomorrow, next week (Future).',
        examples: [
          ex('I met her yesterday.', 'Main usse kal mila.'),
          ex('I will meet her tomorrow.', 'Main usse kal milunga.')
        ]
      }
    ],
    tenses: [
      {
        group: 'Present',
        name: 'Present Simple',
        use: 'Aadat, routine, sachchai (facts) aur time-table ke liye.',
        formula: {
          positive: 'S + V1 (he/she/it ke saath V1 + s/es)',
          negative: 'S + do/does + not + V1',
          question: 'Do/Does + S + V1 ?'
        },
        examples: {
          positive: ex('She drinks tea every morning.', 'Woh roz subah chai peeti hai.'),
          negative: ex('She does not drink coffee.', 'Woh coffee nahi peeti.'),
          question: ex('Does she drink tea every morning?', 'Kya woh roz subah chai peeti hai?')
        },
        signals: 'always, usually, often, every day, never'
      },
      {
        group: 'Present',
        name: 'Present Continuous',
        use: 'Jo kaam abhi ho raha hai ya in dino chal raha hai.',
        formula: {
          positive: 'S + am/is/are + V-ing',
          negative: 'S + am/is/are + not + V-ing',
          question: 'Am/Is/Are + S + V-ing ?'
        },
        examples: {
          positive: ex('They are playing cricket now.', 'Woh log abhi cricket khel rahe hain.'),
          negative: ex('They are not playing cricket now.', 'Woh log abhi cricket nahi khel rahe.'),
          question: ex('Are they playing cricket now?', 'Kya woh log abhi cricket khel rahe hain?')
        },
        signals: 'now, right now, at the moment, currently, look!'
      },
      {
        group: 'Present',
        name: 'Present Perfect',
        use: 'Kaam abhi-abhi pura hua ya uska asar abhi bhi hai. Kab hua, ye important nahi.',
        formula: {
          positive: 'S + has/have + V3',
          negative: 'S + has/have + not + V3',
          question: 'Has/Have + S + V3 ?'
        },
        examples: {
          positive: ex('I have finished my homework.', 'Maine apna homework khatam kar liya hai.'),
          negative: ex('I have not finished my homework yet.', 'Maine abhi tak homework khatam nahi kiya.'),
          question: ex('Have you finished your homework?', 'Kya tumne apna homework khatam kar liya?')
        },
        signals: 'already, just, yet, ever, never, so far'
      },
      {
        group: 'Present',
        name: 'Present Perfect Continuous',
        use: 'Kaam kuch time pehle shuru hua aur ab tak lagataar chal raha hai.',
        formula: {
          positive: 'S + has/have + been + V-ing',
          negative: 'S + has/have + not + been + V-ing',
          question: 'Has/Have + S + been + V-ing ?'
        },
        examples: {
          positive: ex('He has been studying for two hours.', 'Woh do ghante se padh raha hai.'),
          negative: ex('He has not been sleeping well lately.', 'Woh aajkal achhi neend nahi le raha.'),
          question: ex('Has he been studying for two hours?', 'Kya woh do ghante se padh raha hai?')
        },
        signals: 'for, since, all day, how long, lately'
      },
      {
        group: 'Past',
        name: 'Past Simple',
        use: 'Beete hue time mein pura ho chuka kaam.',
        formula: {
          positive: 'S + V2',
          negative: 'S + did not + V1',
          question: 'Did + S + V1 ?'
        },
        examples: {
          positive: ex('We watched a movie yesterday.', 'Humne kal movie dekhi.'),
          negative: ex('We did not watch a movie yesterday.', 'Humne kal movie nahi dekhi.'),
          question: ex('Did you watch a movie yesterday?', 'Kya tumne kal movie dekhi?')
        },
        signals: 'yesterday, last week, ago, in 2020'
      },
      {
        group: 'Past',
        name: 'Past Continuous',
        use: 'Beete time mein kisi khaas moment par jo kaam chal raha tha.',
        formula: {
          positive: 'S + was/were + V-ing',
          negative: 'S + was/were + not + V-ing',
          question: 'Was/Were + S + V-ing ?'
        },
        examples: {
          positive: ex('She was cooking dinner at 8 pm.', 'Woh raat 8 baje dinner bana rahi thi.'),
          negative: ex('She was not cooking dinner at 8 pm.', 'Woh raat 8 baje dinner nahi bana rahi thi.'),
          question: ex('Was she cooking dinner at 8 pm?', 'Kya woh raat 8 baje dinner bana rahi thi?')
        },
        signals: 'while, when, at 8 pm yesterday, all evening'
      },
      {
        group: 'Past',
        name: 'Past Perfect',
        use: 'Do beete kaamon mein jo pehle ho chuka tha.',
        formula: {
          positive: 'S + had + V3',
          negative: 'S + had + not + V3',
          question: 'Had + S + V3 ?'
        },
        examples: {
          positive: ex('The train had left before we reached the station.', 'Hamare station pahunchne se pehle train ja chuki thi.'),
          negative: ex('The train had not left before we reached the station.', 'Hamare station pahunchne se pehle train nahi gayi thi.'),
          question: ex('Had the train left before you reached the station?', 'Kya tumhare station pahunchne se pehle train ja chuki thi?')
        },
        signals: 'before, after, by the time, already'
      },
      {
        group: 'Past',
        name: 'Past Perfect Continuous',
        use: 'Beete hue kisi moment tak jo kaam kuch der se lagataar chal raha tha.',
        formula: {
          positive: 'S + had + been + V-ing',
          negative: 'S + had + not + been + V-ing',
          question: 'Had + S + been + V-ing ?'
        },
        examples: {
          positive: ex('She had been waiting for an hour when the bus came.', 'Bus aane tak woh ek ghante se intezaar kar rahi thi.'),
          negative: ex('She had not been waiting for long when the bus came.', 'Bus aane tak woh zyada der se intezaar nahi kar rahi thi.'),
          question: ex('Had she been waiting for an hour when the bus came?', 'Kya bus aane tak woh ek ghante se intezaar kar rahi thi?')
        },
        signals: 'for, since, before, until, how long'
      },
      {
        group: 'Future',
        name: 'Future Simple',
        use: 'Aage hone wala kaam, faisla ya promise.',
        formula: {
          positive: 'S + will + V1',
          negative: 'S + will + not (won\u2019t) + V1',
          question: 'Will + S + V1 ?'
        },
        examples: {
          positive: ex('I will call you tomorrow.', 'Main tumhe kal phone karunga.'),
          negative: ex('I will not call you tomorrow.', 'Main tumhe kal phone nahi karunga.'),
          question: ex('Will you call me tomorrow?', 'Kya tum mujhe kal phone karoge?')
        },
        signals: 'tomorrow, next week, soon, tonight, probably'
      },
      {
        group: 'Future',
        name: 'Future Continuous',
        use: 'Future ke kisi khaas moment par jo kaam chal raha hoga.',
        formula: {
          positive: 'S + will + be + V-ing',
          negative: 'S + will + not + be + V-ing',
          question: 'Will + S + be + V-ing ?'
        },
        examples: {
          positive: ex('At 6 pm tomorrow, I will be travelling.', 'Kal shaam 6 baje main safar kar raha hounga.'),
          negative: ex('I will not be travelling at 6 pm tomorrow.', 'Kal shaam 6 baje main safar nahi kar raha hounga.'),
          question: ex('Will you be travelling at 6 pm tomorrow?', 'Kya tum kal shaam 6 baje safar kar rahe hoge?')
        },
        signals: 'at this time tomorrow, this time next week, at 5 pm tomorrow'
      },
      {
        group: 'Future',
        name: 'Future Perfect',
        use: 'Future ke kisi point tak jo kaam pura ho chuka hoga.',
        formula: {
          positive: 'S + will + have + V3',
          negative: 'S + will + not + have + V3',
          question: 'Will + S + have + V3 ?'
        },
        examples: {
          positive: ex('By next month, he will have finished the course.', 'Agle mahine tak woh course khatam kar chuka hoga.'),
          negative: ex('He will not have finished the course by next month.', 'Agle mahine tak woh course khatam nahi kar chuka hoga.'),
          question: ex('Will he have finished the course by next month?', 'Kya woh agle mahine tak course khatam kar chuka hoga?')
        },
        signals: 'by tomorrow, by next year, by the time'
      },
      {
        group: 'Future',
        name: 'Future Perfect Continuous',
        use: 'Future ke kisi point tak ek kaam kitne time se chal raha hoga.',
        formula: {
          positive: 'S + will + have + been + V-ing',
          negative: 'S + will + not + have + been + V-ing',
          question: 'Will + S + have + been + V-ing ?'
        },
        examples: {
          positive: ex('By June, she will have been working here for five years.', 'June tak woh yahan paanch saal se kaam kar rahi hogi.'),
          negative: ex('She will not have been working here for five years by June.', 'June tak use yahan kaam karte hue paanch saal nahi hue honge.'),
          question: ex('Will she have been working here for five years by June?', 'Kya June tak woh yahan paanch saal se kaam kar rahi hogi?')
        },
        signals: 'by ... for, by next year + for'
      }
    ],
    mistakes: [
      {
        wrong: 'She go to school every day.',
        right: 'She goes to school every day.',
        why: 'Present Simple mein he/she/it ke saath verb mein s/es lagta hai.'
      },
      {
        wrong: 'I am knowing the answer.',
        right: 'I know the answer.',
        why: 'know, like, love, want, need jaise state verbs aam taur par continuous (-ing) mein nahi aate.'
      },
      {
        wrong: 'I am living here since 2019.',
        right: 'I have been living here since 2019.',
        why: '“since” aur “for” ke saath Perfect ya Perfect Continuous tense aata hai.'
      },
      {
        wrong: 'Did you went to school?',
        right: 'Did you go to school?',
        why: '“did” ke baad hamesha V1 aata hai, kyunki past ka signal “did” mein pehle se hai.'
      }
    ],
    quiz: [
      {
        q: 'Choose the correct word: She ___ to school every day.',
        options: ['go', 'goes', 'going', 'is go'],
        answer: 1,
        explain: 'Routine ke liye Present Simple aata hai aur “she” ke saath verb mein s/es lagta hai: goes.'
      },
      {
        q: 'I ___ here since 2019.',
        options: ['live', 'am living', 'have been living', 'lived'],
        answer: 2,
        explain: '“since 2019” se pata chalta hai ki kaam 2019 se ab tak chal raha hai, isliye Present Perfect Continuous: have been living.'
      },
      {
        q: 'Which sentence is in the Past Perfect tense?',
        options: [
          'He had finished the work.',
          'He has finished the work.',
          'He finished the work.',
          'He was finishing the work.'
        ],
        answer: 0,
        explain: 'Past Perfect ka formula had + V3 hai: had finished.'
      },
      {
        q: 'Which is the formula of the Future Continuous tense?',
        options: [
          'S + will + V1',
          'S + will + be + V-ing',
          'S + will + have + V3',
          'S + will + have + been + V-ing'
        ],
        answer: 1,
        explain: 'Future Continuous = will + be + V-ing. Baaki teen formulas Future Simple, Future Perfect aur Future Perfect Continuous ke hain.'
      },
      {
        q: 'Choose the correct question.',
        options: [
          'Did she went to the party?',
          'Does she went to the party?',
          'Did she go to the party?',
          'Did she goes to the party?'
        ],
        answer: 2,
        explain: 'Past Simple ke question mein did + subject + V1 aata hai: Did she go?'
      }
    ]
  });

  academy.topics.push({
    id: 'subject-verb-agreement',
    order: 7,
    category: 'verbs',
    title: 'Subject-Verb Agreement',
    icon: 'S+V',
    level: 'Beginner',
    minutes: 9,
    summary: 'Subject singular ho ya plural, verb usi ke hisaab se.',
    intro: [
      'Subject aur verb ko number mein match karna padta hai. Singular subject ke saath singular verb, plural subject ke saath plural verb.',
      'Present Simple mein sabse zaroori baat: he/she/it jaise singular subject ke saath verb mein s/es lagta hai (plays), aur plural ke saath nahi (play).'
    ],
    rules: [
      {
        title: '1. Singular subject + singular verb',
        text: 'Present Simple mein he, she, it aur ek cheez/insaan ke saath verb mein s/es lagta hai.',
        examples: [
          ex('The boy plays football.', 'Ladka football khelta hai.'),
          ex('She goes to school.', 'Woh school jaati hai.')
        ]
      },
      {
        title: '2. Plural subject + plural verb',
        text: 'Plural subject (boys, they, we) ke saath verb mein s/es nahi lagta.',
        examples: [
          ex('The boys play football.', 'Ladke football khelte hain.')
        ]
      },
      {
        title: '3. I aur You ke saath',
        text: 'I ke saath am (I am, I play) aur you ke saath are (You are, You play). Inke saath verb mein s nahi lagta.',
        examples: [
          ex('I am ready.', 'Main taiyaar hoon.'),
          ex('You play well.', 'Tum achha khelte ho.')
        ]
      },
      {
        title: '4. “and” se jude subjects = plural',
        text: 'Do subjects “and” se jude hon to verb plural hota hai. Jab do cheezein milkar ek hi cheez maani jaye to verb singular hota hai.',
        examples: [
          ex('Ravi and Amit are friends.', 'Ravi aur Amit dost hain.'),
          ex('Bread and butter is my favourite breakfast.', 'Bread-butter mera pasandida naashta hai.')
        ]
      },
      {
        title: '5. Each, every, everyone, someone, nobody = singular',
        text: 'Ye words bhale hi “sab” ka matlab dete hon, grammar mein singular maane jaate hain.',
        examples: [
          ex('Each student has a book.', 'Har student ke paas ek kitaab hai.'),
          ex('Everyone is ready.', 'Sab taiyaar hain.')
        ]
      },
      {
        title: '6. Either...or / Neither...nor',
        text: 'Verb us subject ke hisaab se aata hai jo verb ke sabse nazdeek ho.',
        examples: [
          ex('Neither the teacher nor the students are present.', 'Na teacher na students maujood hain.'),
          ex('Either you or he is wrong.', 'Ya tum ya woh galat hai.')
        ]
      },
      {
        title: '7. Collective aur singular-looking nouns',
        text: 'team, family, news, mathematics, physics jaise words aam taur par singular verb lete hain (news plural dikhta hai par singular hai).',
        examples: [
          ex('The team is winning.', 'Team jeet rahi hai.'),
          ex('The news is good.', 'Khabar achhi hai.'),
          ex('Mathematics is my favourite subject.', 'Mathematics mera pasandida subject hai.')
        ]
      },
      {
        title: '8. “The number of” vs “A number of”',
        text: '“The number of” singular verb leta hai. “A number of” (kai) plural verb leta hai.',
        examples: [
          ex('The number of students is increasing.', 'Students ki sankhya badh rahi hai.'),
          ex('A number of students are absent.', 'Kai students gair-haazir hain.')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'She don’t like tea.',
        right: 'She doesn’t like tea.',
        why: 'he/she/it ke saath do ka singular form “does” aata hai.'
      },
      {
        wrong: 'The news are good.',
        right: 'The news is good.',
        why: '“news” s par khatam hota hai par singular hai.'
      },
      {
        wrong: 'Each of the boys have a pen.',
        right: 'Each of the boys has a pen.',
        why: 'Subject “each” hai, jo singular hai. “boys” sirf beech ka word hai.'
      },
      {
        wrong: 'My friends is coming.',
        right: 'My friends are coming.',
        why: '“friends” plural hai, isliye are.'
      }
    ],
    quiz: [
      {
        q: 'The children ___ playing in the park.',
        options: ['is', 'are', 'am', 'has'],
        answer: 1,
        explain: '“children” plural hai, isliye are.'
      },
      {
        q: 'Everyone ___ ready for the exam.',
        options: ['are', 'were', 'is', 'have'],
        answer: 2,
        explain: '“everyone” singular maana jaata hai, isliye is.'
      },
      {
        q: 'Neither the teacher nor the students ___ present.',
        options: ['is', 'are', 'was', 'has'],
        answer: 1,
        explain: 'Verb sabse nazdeek subject “students” (plural) ke hisaab se aata hai: are.'
      },
      {
        q: 'The news ___ shocking.',
        options: ['are', 'were', 'is', 'have been'],
        answer: 2,
        explain: '“news” singular noun hai, isliye is.'
      },
      {
        q: 'He ___ not like spicy food.',
        options: ['do', 'does', 'did not', 'is'],
        answer: 1,
        explain: '“he” ke saath Present Simple negative mein does + not aata hai.'
      }
    ]
  });

  academy.topics.push({
    id: 'modals',
    order: 8,
    category: 'verbs',
    title: 'Modals',
    icon: 'can',
    level: 'Intermediate',
    minutes: 9,
    summary: 'can, could, may, might, must, should, will, would, shall.',
    intro: [
      'Modal verbs (can, could, may, might, must, should, will, would, shall) main verb ko extra matlab dete hain, jaise ability, permission, zaroorat ya salaah.',
      'Sabse zaroori rule: modal ke baad hamesha verb ki base form (V1) aati hai. Modal ke saath s, es ya to nahi lagta.'
    ],
    rules: [
      {
        title: '1. Form: Modal + V1',
        text: 'Negative mein modal ke baad not lagta hai (cannot / can’t). Question mein modal sentence ke shuru mein aata hai. Do/does/did nahi lagta.',
        examples: [
          ex('She can swim.', 'Woh tair sakti hai.'),
          ex('She cannot swim.', 'Woh tair nahi sakti.'),
          ex('Can she swim?', 'Kya woh tair sakti hai?')
        ]
      },
      {
        title: '2. Can / Could: ability, permission, request',
        text: '“can” = kar sakna (ability). “could” = past ability ya zyada polite request.',
        examples: [
          ex('I can speak English.', 'Main English bol sakta hoon.'),
          ex('Could you help me, please?', 'Kya aap meri madad kar sakte hain?')
        ]
      },
      {
        title: '3. May / Might: permission aur possibility',
        text: '“may” polite permission maangne ke liye. “may/might” se sambhavna (ho sakta hai) bhi batate hain. “might” mein sambhavna kam hoti hai.',
        examples: [
          ex('May I come in?', 'Kya main andar aa sakta hoon?'),
          ex('It might rain today.', 'Aaj baarish ho sakti hai.')
        ]
      },
      {
        title: '4. Must / Have to: zaroorat',
        text: '“must” = zaroor karna hai. “must not” = mana hai (prohibition). “have to” = majboori ya rule ki wajah se karna padta hai.',
        examples: [
          ex('You must wear a helmet.', 'Tumhe helmet pehenna hi chahiye.'),
          ex('You must not smoke here.', 'Yahan smoking karna mana hai.'),
          ex('I have to submit it today.', 'Mujhe ise aaj jama karna hai.')
        ]
      },
      {
        title: '5. Should / Ought to: salaah',
        text: '“should” achhi salaah ya sahi kaam batata hai. “must” se kam zor hota hai.',
        examples: [
          ex('You should drink more water.', 'Tumhe zyada paani peena chahiye.')
        ]
      },
      {
        title: '6. Will / Would / Shall: future, offer, polite request',
        text: '“will” = future ya faisla. “shall” zyada-tar I/we ke saath offer ya suggestion ke liye. “would” = polite request ya offer.',
        examples: [
          ex('Shall I open the window?', 'Kya main khidki khol doon?'),
          ex('Would you like some tea?', 'Kya aap thodi chai lenge?')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'She can sings very well.',
        right: 'She can sing very well.',
        why: 'Modal ke baad base verb (V1) aata hai, s lagakar nahi.'
      },
      {
        wrong: 'You should to go now.',
        right: 'You should go now.',
        why: 'Modal ke baad “to” nahi lagta.'
      },
      {
        wrong: 'He cans swim.',
        right: 'He can swim.',
        why: 'Modal verbs mein he/she/it ke saath bhi s nahi lagta.'
      },
      {
        wrong: 'Do you can swim?',
        right: 'Can you swim?',
        why: 'Modal khud question banata hai, do/does ki zaroorat nahi.'
      }
    ],
    quiz: [
      {
        q: 'She can ___ very well.',
        options: ['sings', 'singing', 'to sing', 'sing'],
        answer: 3,
        explain: 'Modal “can” ke baad base form (V1) aata hai: sing.'
      },
      {
        q: 'You want to ask permission politely. ___ I use your phone?',
        options: ['May', 'Must', 'Should', 'Will'],
        answer: 0,
        explain: 'Polite permission maangne ke liye “May I...?” sabse sahi hai.'
      },
      {
        q: 'You ___ wear a seatbelt. It is the law.',
        options: ['might', 'must', 'may', 'could'],
        answer: 1,
        explain: 'Kanoon ya zaroori niyam ke liye “must” aata hai.'
      },
      {
        q: 'Which sentence gives advice?',
        options: [
          'You must pay tax.',
          'You should take rest.',
          'You can take rest.',
          'You will take rest.'
        ],
        answer: 1,
        explain: 'Salaah dene ke liye “should” use hota hai. “can” permission deta hai aur “must” zaroorat batata hai.'
      },
      {
        q: 'Choose the correct sentence.',
        options: [
          'Do you can swim?',
          'Can you swim?',
          'Can you to swim?',
          'You can swims?'
        ],
        answer: 1,
        explain: 'Modal ka question modal se shuru hota hai aur uske baad V1 aata hai: Can you swim?'
      }
    ]
  });

  academy.topics.push({
    id: 'active-passive',
    order: 9,
    category: 'verbs',
    title: 'Active / Passive Voice',
    icon: 'A\u21C4P',
    level: 'Intermediate',
    minutes: 12,
    summary: 'Active se passive banana: be + V3 ka formula.',
    intro: [
      'Active voice mein subject kaam karta hai (Riya writes a letter). Passive voice mein kaam object par hota hai aur focus us kaam ya cheez par jaata hai (A letter is written by Riya).',
      'Passive ka formula: Object + be (tense ke hisaab se) + V3 + (by + doer). Passive sirf unhi verbs ka banta hai jinka object ho.'
    ],
    rules: [
      {
        title: '1. Active aur Passive ka fark',
        text: 'Active mein doer pehle aata hai. Passive mein jis par kaam hua woh pehle aata hai.',
        examples: [
          ex('Riya writes a letter.', 'Riya ek khat likhti hai. (Active)'),
          ex('A letter is written by Riya.', 'Ek khat Riya dwara likha jaata hai. (Passive)')
        ]
      },
      {
        title: '2. Passive banane ke 4 steps',
        text: '(1) Object ko subject ki jagah rakho. (2) Tense ke hisaab se be-verb lagao. (3) Main verb ko V3 karo. (4) Purane subject ko “by” ke baad rakho (agar zaroori ho).',
        examples: [
          ex('The chef cooks the meal.', 'Chef khana pakata hai.'),
          ex('The meal is cooked by the chef.', 'Khana chef dwara pakaya jaata hai.')
        ]
      },
      {
        title: '3. Simple tenses: is/am/are, was/were, will be',
        text: 'Present Simple: is/am/are + V3. Past Simple: was/were + V3. Future Simple: will be + V3.',
        examples: [
          ex('They clean the room daily.', 'Woh log roz kamra saaf karte hain.'),
          ex('The room is cleaned daily.', 'Kamra roz saaf kiya jaata hai.'),
          ex('Someone stole my bag.', 'Kisi ne mera bag chura liya.'),
          ex('My bag was stolen.', 'Mera bag chura liya gaya.'),
          ex('She will finish the work.', 'Woh kaam khatam karegi.'),
          ex('The work will be finished by her.', 'Kaam uske dwara khatam kiya jaayega.')
        ]
      },
      {
        title: '4. Continuous aur Perfect: being / been',
        text: 'Present Continuous: is/am/are + being + V3. Present Perfect: has/have + been + V3.',
        examples: [
          ex('The wall is being painted by him.', 'Deewar uske dwara paint ki ja rahi hai.'),
          ex('The match has been won by them.', 'Match unke dwara jeeta gaya hai.')
        ]
      },
      {
        title: '5. “by + doer” kab hata dein',
        text: 'Jab doer pata na ho ya zaroori na ho, “by ...” hata dete hain.',
        examples: [
          ex('My phone was stolen.', 'Mera phone chura liya gaya.'),
          ex('English is spoken all over the world.', 'English poori duniya mein boli jaati hai.')
        ]
      },
      {
        title: '6. Intransitive verbs ka passive nahi banta',
        text: 'sleep, arrive, go, die jaise verbs ka object nahi hota, isliye unka passive nahi banta.',
        examples: [
          ex('She sleeps.', 'Woh soti hai. (Passive nahi ban sakta)')
        ]
      }
    ],
    mistakes: [
      {
        wrong: 'The letter was wrote by him.',
        right: 'The letter was written by him.',
        why: 'Passive mein hamesha V3 (written) aata hai, V2 (wrote) nahi.'
      },
      {
        wrong: 'The cake is eat by children.',
        right: 'The cake is eaten by children.',
        why: 'be-verb ke baad V3 chahiye: eaten.'
      },
      {
        wrong: 'The work will done by me.',
        right: 'The work will be done by me.',
        why: 'Future passive mein will ke baad “be” zaroori hai: will be done.'
      },
      {
        wrong: 'The window was broke by the boy.',
        right: 'The window was broken by the boy.',
        why: 'break - broke - broken. Passive mein V3 broken aata hai.'
      }
    ],
    quiz: [
      {
        q: 'Passive voice of “She writes a poem.” is:',
        options: [
          'A poem is written by her.',
          'A poem was written by her.',
          'A poem is wrote by her.',
          'A poem writes her.'
        ],
        answer: 0,
        explain: 'Present Simple ka passive: is/am/are + V3. Isliye “is written”.'
      },
      {
        q: 'The window ___ by the boy yesterday.',
        options: ['broke', 'was broken', 'is broken', 'has broke'],
        answer: 1,
        explain: '“yesterday” past ka signal hai, isliye was + V3: was broken.'
      },
      {
        q: 'Which sentence is in the passive voice?',
        options: [
          'The cat chased the mouse.',
          'The mouse was chased by the cat.',
          'The cat is chasing the mouse.',
          'The mouse ran away.'
        ],
        answer: 1,
        explain: 'Passive mein kaam jis par hua woh subject banta hai aur be + V3 aata hai: was chased.'
      },
      {
        q: 'Passive voice of “They will build a bridge.” is:',
        options: [
          'A bridge will build by them.',
          'A bridge will be built by them.',
          'A bridge is built by them.',
          'A bridge would be build by them.'
        ],
        answer: 1,
        explain: 'Future Simple passive: will be + V3, yani “will be built”.'
      },
      {
        q: 'Passive voice of “He is repairing the car.” is:',
        options: [
          'The car is repaired by him.',
          'The car is being repaired by him.',
          'The car was being repair by him.',
          'The car has been repaired by him.'
        ],
        answer: 1,
        explain: 'Present Continuous ka passive: is/am/are + being + V3, yani “is being repaired”.'
      }
    ]
  });
})();
