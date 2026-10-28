/* Speaking Studio content (offline, local data).
   Each sentence is [English, Roman Hinglish meaning, when to use it].
   Each dialogue line is [speaker index, English, Roman Hinglish meaning].
   Read by js/speaking.js via window.SpeakingStudio. */
window.SpeakingStudio = {
  levels: [
    { id: 'beginner', title: 'Beginner', note: 'Roz ki simple baatein' },
    { id: 'intermediate', title: 'Intermediate', note: 'Safar, khaana, phone aur zyada situations' },
    { id: 'advanced', title: 'Advanced', note: 'Kaam, interview aur professional baat' }
  ],

  topics: [
    {
      id: 'greetings', title: 'Greetings', icon: 'Hi', level: 'beginner',
      tip: 'Greeting se baat ki shuruaat achhi hoti hai. Time ke hisaab se "Good morning", "Good afternoon" ya "Good evening" bolo.',
      real: 'Office ke gate par colleague mile: "Good morning! How are you today?" Jawab: "I\'m fine, thank you. And you?"',
      s: [
        ['Good morning! How are you today?', 'Good morning! Aap aaj kaise ho?', 'Subah kisi se milte waqt.'],
        ['I\'m fine, thank you. And you?', 'Main theek hoon, shukriya. Aur aap?', '"How are you?" ka jawab dene ke liye.'],
        ['Nice to meet you.', 'Aapse milkar achha laga.', 'Kisi se pehli baar milne par.'],
        ['Long time no see!', 'Bahut din baad mile!', 'Purane dost ya jaan-pehchan wale ko dekhkar.'],
        ['How have you been?', 'Aap itne dino se kaise ho?', 'Kuch waqt baad baat karte waqt.'],
        ['Have a great day!', 'Aapka din bahut achha guzre!', 'Alvida kehte waqt.'],
        ['Take care, see you soon.', 'Apna khayal rakhna, jaldi milte hain.', 'Dost ya family ko bye bolte waqt.'],
        ['Good night, sleep well.', 'Shubh ratri, achhe se sona.', 'Raat ko sone se pehle.']
      ]
    },
    {
      id: 'introduction', title: 'Self-introduction', icon: 'Me', level: 'beginner',
      tip: 'Apne baare mein bolte waqt chhote, saaf sentences use karo: naam, sheher, kaam aur pasand.',
      real: 'Naye class mein teacher kehte hain "Please introduce yourself." Aap bolte ho: "My name is Neha, and I\'m from Lucknow."',
      s: [
        ['My name is Neha, and I\'m from Lucknow.', 'Mera naam Neha hai aur main Lucknow se hoon.', 'Apna naam aur sheher batane ke liye.'],
        ['I\'m twenty-two years old.', 'Meri umar bais saal hai.', 'Apni umar batane ke liye.'],
        ['I live in Pune with my family.', 'Main apni family ke saath Pune mein rehta/rehti hoon.', 'Kahan rehte ho yeh batane ke liye.'],
        ['I\'m a college student.', 'Main college student hoon.', 'Apni padhai ke baare mein.'],
        ['I work as a software developer.', 'Main software developer ke roop mein kaam karta/karti hoon.', 'Apna kaam ya profession batane ke liye.'],
        ['In my free time, I like to read and listen to music.', 'Khaali waqt mein mujhe padhna aur music sunna pasand hai.', 'Apne shauk batane ke liye.'],
        ['I\'m learning English to improve my speaking.', 'Main apni speaking behtar karne ke liye English seekh raha/rahi hoon.', 'English seekhne ki wajah batane ke liye.'],
        ['Let me introduce myself.', 'Mujhe apna parichay dene dijiye.', 'Parichay ki shuruaat karne ke liye.']
      ]
    },
    {
      id: 'family', title: 'Family & Friends', icon: 'Fa', level: 'beginner',
      tip: 'Family ke members ke liye simple words: mother, father, brother, sister, grandparents, cousin, friend.',
      real: 'Dost ke ghar jaakar apni family ka parichay dete ho: "This is my mother, and that is my father."',
      s: [
        ['This is my mother, and that is my father.', 'Yeh meri mummy hain aur woh mere papa hain.', 'Kisi ko family se milwate waqt.'],
        ['I have one elder brother and one younger sister.', 'Mere ek bade bhai aur ek chhoti behen hain.', 'Siblings ke baare mein batane ke liye.'],
        ['We are a family of five.', 'Hum paanch logon ka parivar hain.', 'Family ka size batane ke liye.'],
        ['My grandparents live in our village.', 'Mere dada-dadi (ya nana-nani) humare gaon mein rehte hain.', 'Grandparents ke baare mein.'],
        ['She has been my best friend since school.', 'Woh school se meri sabse achhi dost hai.', 'Purani dosti batane ke liye.'],
        ['We often go out together on weekends.', 'Hum aksar weekend par saath bahar jaate hain.', 'Saath time bitane ki aadat batane ke liye.'],
        ['My cousin is getting married next month.', 'Mere cousin ki shaadi agle mahine hai.', 'Family ki khabar batane ke liye.'],
        ['I\'d like you to meet my friend Sara.', 'Main chahta/chahti hoon ki aap meri dost Sara se milein.', 'Kisi dost ko doosre se milwate waqt.']
      ]
    },
    {
      id: 'routine', title: 'Daily Routine', icon: 'Dr', level: 'beginner',
      tip: 'Roz ki aadaton ke liye Present Simple use hota hai: I wake up, I have breakfast, I go to bed. "usually" aur "every day" jaise words saath lagao.',
      real: 'Naye roommate ne poocha "What is your day like?" Aap apna din step-by-step batate ho.',
      s: [
        ['I wake up at six every morning.', 'Main roz subah chhe baje uthta/uthti hoon.', 'Din ki shuruaat batane ke liye.'],
        ['I brush my teeth and take a shower.', 'Main brush karta/karti hoon aur nahata/nahati hoon.', 'Subah ki taiyari batane ke liye.'],
        ['I have breakfast at around eight.', 'Main lagbhag aath baje nashta karta/karti hoon.', 'Nashte ka time batane ke liye.'],
        ['I leave for work at nine.', 'Main nau baje kaam ke liye nikalta/nikalti hoon.', 'Ghar se nikalne ka time batane ke liye.'],
        ['I usually have lunch with my colleagues.', 'Main aam taur par apne colleagues ke saath lunch karta/karti hoon.', 'Aadat batane ke liye "usually" ke saath.'],
        ['In the evening, I go for a walk.', 'Shaam ko main walk par jaata/jaati hoon.', 'Shaam ki routine batane ke liye.'],
        ['I watch a little TV after dinner.', 'Raat ke khaane ke baad main thodi der TV dekhta/dekhti hoon.', 'Raat ki routine batane ke liye.'],
        ['I go to bed by eleven o\'clock.', 'Main gyarah baje tak so jaata/jaati hoon.', 'Sone ka time batane ke liye.']
      ]
    },
    {
      id: 'shopping', title: 'Shopping', icon: 'Sh', level: 'beginner',
      tip: 'Shop par "Can I...?" aur "Could you...?" jaise polite sawal use karo. Keemat poochne ke liye "How much...?" bolo.',
      real: 'Kapde ki dukaan par kurta pasand aaya: "Do you have this in a larger size?"',
      s: [
        ['How much does this cost?', 'Iski keemat kitni hai?', 'Kisi cheez ka daam poochne ke liye.'],
        ['Do you have this in a larger size?', 'Kya yeh bade size mein milega?', 'Size badalwane ke liye.'],
        ['Can I try this on?', 'Kya main ise pehen kar dekh sakta/sakti hoon?', 'Kapde trial karne ke liye.'],
        ['That\'s a bit expensive. Can you give me a discount?', 'Yeh thoda mehenga hai. Kya aap discount denge?', 'Bhaav-taav karne ke liye.'],
        ['I\'m just looking, thank you.', 'Main bas dekh raha/rahi hoon, shukriya.', 'Jab abhi kuch kharidna na ho.'],
        ['I\'ll take this one.', 'Main yeh wala le lunga/lungi.', 'Kharidne ka faisla batane ke liye.'],
        ['Can I pay by card?', 'Kya main card se payment kar sakta/sakti hoon?', 'Payment ka tareeka poochne ke liye.'],
        ['Could I get a receipt, please?', 'Kya mujhe receipt mil sakti hai?', 'Bill ya receipt maangne ke liye.']
      ]
    },
    {
      id: 'travel', title: 'Travel', icon: 'Tr', level: 'intermediate',
      tip: 'Safar mein time, jagah aur booking ke sawal sabse zyada kaam aate hain. "What time...?", "Which platform...?" yaad rakho.',
      real: 'Railway station par enquiry counter par: "What time does the train leave?"',
      s: [
        ['I\'d like to book a ticket to Delhi, please.', 'Mujhe Delhi ka ticket book karna hai.', 'Ticket book karte waqt.'],
        ['What time does the train leave?', 'Train kitne baje chalti hai?', 'Departure ka time poochne ke liye.'],
        ['Which platform does the train arrive on?', 'Train kaunse platform par aati hai?', 'Station par platform poochne ke liye.'],
        ['Excuse me, could you tell me the way to the station?', 'Maaf kijiye, kya aap station ka rasta bata sakte hain?', 'Raasta poochne ke liye.'],
        ['Is this seat taken?', 'Kya yeh seat kisi ne li hui hai?', 'Bus ya train mein seat poochne ke liye.'],
        ['I have a reservation under the name Khan.', 'Meri booking Khan naam se hai.', 'Hotel ya ticket booking confirm karte waqt.'],
        ['How far is the airport from here?', 'Yahan se airport kitni door hai?', 'Doori poochne ke liye.'],
        ['My flight has been delayed by two hours.', 'Meri flight do ghante late ho gayi hai.', 'Delay ki khabar dene ke liye.']
      ]
    },
    {
      id: 'restaurant', title: 'Restaurant', icon: 'Fd', level: 'intermediate',
      tip: 'Order dene ke liye "I\'ll have..." ya "Could I have...?" use karo. Waiter se polite tone mein "please" zaroor lagao.',
      real: 'Dost ke saath cafe mein table lena: "A table for two, please."',
      s: [
        ['A table for two, please.', 'Do logon ke liye ek table chahiye.', 'Restaurant mein pahunch kar.'],
        ['Could we see the menu, please?', 'Kya hum menu dekh sakte hain?', 'Menu maangne ke liye.'],
        ['What do you recommend?', 'Aap kya recommend karenge?', 'Waiter se suggestion lene ke liye.'],
        ['I\'ll have the vegetable biryani, please.', 'Main veg biryani lunga/lungi.', 'Order dene ke liye.'],
        ['Could you make it less spicy?', 'Kya aap ise kam teekha bana sakte hain?', 'Khaane mein badlaav maangne ke liye.'],
        ['Can we have some more water, please?', 'Kya humein thoda aur paani mil sakta hai?', 'Kuch aur maangne ke liye.'],
        ['The food was delicious.', 'Khaana bahut swadisht tha.', 'Khaane ki tareef karne ke liye.'],
        ['Could we have the bill, please?', 'Kya humein bill mil sakta hai?', 'Khaane ke baad bill maangne ke liye.']
      ]
    },
    {
      id: 'phone', title: 'Phone Calls', icon: 'Ph', level: 'intermediate',
      tip: 'Phone par "This is ... speaking" bolte hain, "I am ..." nahi. Awaaz saaf na aaye to polite tareeke se dobara bolne ko kaho.',
      real: 'Office mein call uthate ho: "Hello, this is Rahul speaking. How can I help you?"',
      s: [
        ['Hello, this is Rahul speaking.', 'Hello, main Rahul bol raha hoon.', 'Call par apna naam batane ke liye.'],
        ['May I speak to Mr. Sharma, please?', 'Kya main Sharma ji se baat kar sakta/sakti hoon?', 'Kisi khaas insaan ko maangne ke liye.'],
        ['Could you hold on for a moment?', 'Kya aap thodi der line par ruk sakte hain?', 'Kisi ko intezaar karne ko kehne ke liye.'],
        ['I\'m sorry, I can\'t hear you clearly.', 'Maaf kijiye, aapki awaaz saaf nahi aa rahi.', 'Network ya awaaz ki problem hone par.'],
        ['Could you speak a little slower, please?', 'Kya aap thoda dheere bol sakte hain?', 'Samajh na aaye to.'],
        ['Can I take a message?', 'Kya main koi message le sakta/sakti hoon?', 'Jab wo insaan available na ho.'],
        ['I\'ll call you back in ten minutes.', 'Main das minute mein aapko wapas call karta/karti hoon.', 'Baad mein call karne ka vaada karne ke liye.'],
        ['Thank you for calling. Goodbye!', 'Call karne ke liye shukriya. Alvida!', 'Call khatam karte waqt.']
      ]
    },
    {
      id: 'education', title: 'Education', icon: 'Ed', level: 'intermediate',
      tip: 'Padhai ki baat mein subject, exam, assignment aur notes jaise words zyada kaam aate hain.',
      real: 'Class ke baad teacher se: "Could you please explain this topic again?"',
      s: [
        ['What subjects are you studying this year?', 'Aap is saal kaunse subjects padh rahe ho?', 'Kisi ki padhai ke baare mein poochne ke liye.'],
        ['I have an exam next week, so I need to revise.', 'Mera agle hafte exam hai, isliye mujhe revise karna hai.', 'Exam ki taiyari batane ke liye.'],
        ['Could you please explain this topic again?', 'Kya aap yeh topic dobara samjha sakte hain?', 'Teacher se madad maangne ke liye.'],
        ['I didn\'t understand the last question.', 'Mujhe aakhri sawal samajh nahi aaya.', 'Kuch samajh na aaye to.'],
        ['When is the assignment due?', 'Assignment kab tak jama karna hai?', 'Deadline poochne ke liye.'],
        ['I\'m preparing for a competitive exam.', 'Main ek competitive exam ki taiyari kar raha/rahi hoon.', 'Apni taiyari ke baare mein batane ke liye.'],
        ['Can I borrow your notes, please?', 'Kya main aapke notes le sakta/sakti hoon?', 'Classmate se notes maangne ke liye.'],
        ['I want to graduate with good marks.', 'Main achhe marks ke saath graduate hona chahta/chahti hoon.', 'Apna lakshya batane ke liye.']
      ]
    },
    {
      id: 'health', title: 'Health', icon: 'He', level: 'intermediate',
      tip: 'Doctor ko symptoms saaf batao: kya hua, kab se hua aur kitna. "I have..." aur "I feel..." sabse zyada use hote hain.',
      real: 'Clinic ke reception par: "I\'d like to make an appointment for tomorrow."',
      s: [
        ['I don\'t feel well today.', 'Aaj meri tabiyat theek nahi hai.', 'Bimaar mehsoos hone par.'],
        ['I have a headache and a slight fever.', 'Mujhe sar dard aur halka bukhar hai.', 'Symptoms batane ke liye.'],
        ['How long have you had these symptoms?', 'Yeh symptoms aapko kab se hain?', 'Doctor ka aam sawal.'],
        ['I need to see a doctor.', 'Mujhe doctor ko dikhana hai.', 'Doctor ke paas jaane ki baat karne ke liye.'],
        ['Please take this medicine twice a day after meals.', 'Yeh dawai din mein do baar khaane ke baad lijiye.', 'Dawai lene ka tareeka samjhane ke liye.'],
        ['You should get plenty of rest and drink lots of water.', 'Aapko poora aaram karna chahiye aur bahut paani peena chahiye.', 'Sehat ki salah dene ke liye.'],
        ['I\'m allergic to penicillin.', 'Mujhe penicillin se allergy hai.', 'Doctor ya chemist ko allergy batane ke liye.'],
        ['I\'d like to make an appointment for tomorrow.', 'Mujhe kal ke liye appointment leni hai.', 'Clinic mein appointment lene ke liye.']
      ]
    },
    {
      id: 'social', title: 'Social Conversations', icon: 'So', level: 'intermediate',
      tip: 'Dosti aur meel-jol mein invite karna, manana aur sahanubhuti dikhana zaroori hai. Chhote natural sentences sabse achhe lagte hain.',
      real: 'Colleague ne party par bulaya: "Thanks for inviting me. I had a wonderful time."',
      s: [
        ['What do you do in your free time?', 'Aap khaali waqt mein kya karte ho?', 'Baat shuru karne ke liye.'],
        ['Would you like to join us for coffee?', 'Kya aap coffee ke liye humare saath chalenge?', 'Kisi ko invite karne ke liye.'],
        ['That sounds like a great idea.', 'Yeh to bahut achha idea lagta hai.', 'Kisi ki baat se sehmat hone ke liye.'],
        ['I\'m sorry, I\'m busy this weekend.', 'Maaf kijiye, main is weekend busy hoon.', 'Politely invite se mana karne ke liye.'],
        ['Thanks for inviting me. I had a wonderful time.', 'Bulane ke liye shukriya. Mujhe bahut maza aaya.', 'Party ya gathering ke baad.'],
        ['Let\'s keep in touch.', 'Chalo sampark mein rehte hain.', 'Alvida kehte waqt rishta banaye rakhne ke liye.'],
        ['Congratulations on your new job!', 'Aapki nayi job ki badhai ho!', 'Kisi ki kaamyabi par.'],
        ['I\'m sorry to hear that. I hope you feel better soon.', 'Yeh sunkar afsos hua. Umeed hai aap jaldi theek ho jaoge.', 'Kisi ke bimaar hone par.']
      ]
    },
    {
      id: 'workplace', title: 'Workplace', icon: 'Wk', level: 'advanced',
      tip: 'Office English mein polite aur clear rehna zaroori hai. "Could you...?" aur "I\'ll..." jaise patterns aam hain.',
      real: 'Team lead ko mail ka jawab dene mein deri ho gayi: "I\'m sorry for the delay in replying."',
      s: [
        ['Could you send me the report by the end of the day?', 'Kya aap din ke end tak mujhe report bhej sakte hain?', 'Colleague se kaam maangne ke liye.'],
        ['I\'ll get back to you as soon as possible.', 'Main jitni jaldi ho sake aapko jawab dunga/dungi.', 'Turant jawab na de paane par.'],
        ['I\'m sorry for the delay in replying.', 'Jawab dene mein deri ke liye maaf kijiye.', 'Late reply ke liye.'],
        ['Let\'s schedule a meeting for tomorrow morning.', 'Kal subah ek meeting rakhte hain.', 'Meeting fix karne ke liye.'],
        ['Could you please give me some feedback on my work?', 'Kya aap mere kaam par kuch feedback de sakte hain?', 'Manager se feedback maangne ke liye.'],
        ['I\'m currently working on the project proposal.', 'Main abhi project proposal par kaam kar raha/rahi hoon.', 'Apna current kaam batane ke liye.'],
        ['Could I take a day off next Friday?', 'Kya main agle Friday ek din ki chhutti le sakta/sakti hoon?', 'Chhutti maangne ke liye.'],
        ['We need to finish this before the deadline.', 'Humein yeh deadline se pehle khatam karna hoga.', 'Kaam ki zaroorat batane ke liye.']
      ]
    },
    {
      id: 'interview', title: 'Job Interviews', icon: 'Iv', level: 'advanced',
      tip: 'Interview mein apni skills ke saath example do. Jawab chhote, confident aur saaf rakho.',
      real: 'Interview ke end mein: "Thank you for giving me this opportunity."',
      s: [
        ['Thank you for giving me this opportunity.', 'Mujhe yeh mauka dene ke liye shukriya.', 'Interview ke shuru ya end mein.'],
        ['Could you tell us a little about yourself?', 'Kya aap humein apne baare mein thoda bata sakte hain?', 'Interviewer ka sabse aam sawal.'],
        ['I have three years of experience in customer support.', 'Mujhe customer support mein teen saal ka experience hai.', 'Apna experience batane ke liye.'],
        ['My greatest strength is that I learn quickly.', 'Meri sabse badi taakat yeh hai ki main jaldi seekhta/seekhti hoon.', '"What is your strength?" ke jawab mein.'],
        ['I\'m working on improving my time management.', 'Main apni time management behtar karne par kaam kar raha/rahi hoon.', '"What is your weakness?" ka honest jawab dene ke liye.'],
        ['I\'m interested in this role because it matches my skills.', 'Mujhe is role mein dilchaspi hai kyunki yeh meri skills se match karta hai.', 'Job mein interest dikhane ke liye.'],
        ['Where do you see yourself in five years?', 'Aap apne aap ko paanch saal baad kahan dekhte hain?', 'Interviewer ka aam sawal.'],
        ['I\'m a good team player and I take responsibility for my work.', 'Main achha team player hoon aur apne kaam ki zimmedari leta/leti hoon.', 'Apni personality batane ke liye.']
      ]
    },
    {
      id: 'opinions', title: 'Opinions & Discussion', icon: 'Op', level: 'advanced',
      tip: 'Apni raay dene ke liye "In my opinion" aur sehmat ya asehmat hone ke polite phrases seekho. Asehmat hote waqt bhi respectful raho.',
      real: 'Group discussion mein: "I see your point, but I have a different view."',
      s: [
        ['In my opinion, online classes are very useful.', 'Meri raay mein online classes bahut useful hain.', 'Apni raay shuru karne ke liye.'],
        ['I see your point, but I have a different view.', 'Main aapki baat samajhta/samajhti hoon, lekin meri soch alag hai.', 'Politely asehmat hone ke liye.'],
        ['I completely agree with you.', 'Main aapse poori tarah sehmat hoon.', 'Poori sehmati dikhane ke liye.'],
        ['I\'m not sure I agree with that.', 'Mujhe pakka nahi ki main isse sehmat hoon.', 'Halke tareeke se asehmati dikhane ke liye.'],
        ['That\'s a good point, but have you considered the cost?', 'Yeh achhi baat hai, par kya aapne kharche ke baare mein socha?', 'Doosra pehlu samne rakhne ke liye.'],
        ['Let me explain why I think so.', 'Main samjhata/samjhati hoon ki main aisa kyun sochta/sochti hoon.', 'Apni wajah batane ke liye.'],
        ['It depends on the situation.', 'Yeh halaat par depend karta hai.', 'Jab jawab ek jaisa na ho.'],
        ['On the other hand, there are some risks.', 'Doosri taraf, kuch khatre bhi hain.', 'Do pehlu compare karne ke liye.']
      ]
    },
    {
      id: 'meetings', title: 'Meetings & Presentations', icon: 'Mt', level: 'advanced',
      tip: 'Presentation mein shuruaat, mudde ka badlaav aur nichod saaf shabdon mein bolo: "Let me move on...", "To sum up...".',
      real: 'Team meeting mein sales ka slide dikhate hue: "As you can see on this slide, sales have increased."',
      s: [
        ['Let\'s get started, since everyone is here.', 'Sab aa gaye hain, chalo shuru karte hain.', 'Meeting shuru karne ke liye.'],
        ['Today I\'ll talk about our sales results for this quarter.', 'Aaj main is quarter ke sales results ke baare mein baat karunga/karungi.', 'Presentation ka topic batane ke liye.'],
        ['As you can see on this slide, sales have increased by ten percent.', 'Jaisa aap is slide par dekh sakte hain, sales das percent badhi hain.', 'Slide ka data samjhane ke liye.'],
        ['Let me move on to the next point.', 'Ab main agle point par aata/aati hoon.', 'Topic badalte waqt.'],
        ['Does anyone have any questions?', 'Kya kisi ka koi sawal hai?', 'Audience se sawal maangne ke liye.'],
        ['Could you please repeat the question?', 'Kya aap sawal dobara bol sakte hain?', 'Sawal samajh na aaye to.'],
        ['To sum up, we need to focus on customer satisfaction.', 'Nichod yeh hai ki humein customer satisfaction par dhyan dena hoga.', 'Baat ko khatam karne ke liye.'],
        ['Thank you all for your time and attention.', 'Aap sabke waqt aur dhyan ke liye shukriya.', 'Presentation ke end mein.']
      ]
    }
  ],

  dialogues: [
    {
      id: 'introducing-yourself', title: 'Introducing Yourself', level: 'beginner',
      scene: 'College ke pehle din Riya aur Karan ek doosre se milte hain.',
      roles: ['Riya', 'Karan'],
      lines: [
        [0, 'Hi, I don\'t think we have met. I\'m Riya.', 'Hi, shayad hum pehle nahi mile. Main Riya hoon.'],
        [1, 'Hello, Riya. I\'m Karan. Are you new here?', 'Hello Riya. Main Karan hoon. Kya aap yahan nayi hain?'],
        [0, 'Yes, today is my first day. I just joined the commerce course.', 'Haan, aaj mera pehla din hai. Maine abhi commerce course join kiya hai.'],
        [1, 'That\'s great! Where are you from?', 'Yeh to badhiya hai! Aap kahan se hain?'],
        [0, 'I\'m from Jaipur. What about you?', 'Main Jaipur se hoon. Aur aap?'],
        [1, 'I was born here in Pune. Do you like the city so far?', 'Main yahin Pune mein paida hua hoon. Kya aapko ab tak shehar pasand aaya?'],
        [0, 'Yes, it looks lovely, but I\'m still finding my way around.', 'Haan, achha lagta hai, par main abhi raste samajh rahi hoon.'],
        [1, 'Don\'t worry. I\'ll show you around the campus after class.', 'Chinta mat karo. Class ke baad main aapko campus dikha dunga.']
      ]
    },
    {
      id: 'meeting-someone', title: 'Meeting Someone New', level: 'beginner',
      scene: 'Dost ki birthday party mein Aman ki mulaqat Sana se hoti hai.',
      roles: ['Aman', 'Sana'],
      lines: [
        [0, 'Excuse me, are you a friend of Dev\'s?', 'Excuse me, kya aap Dev ki dost hain?'],
        [1, 'Yes, we studied together in school. How do you know him?', 'Haan, hum school mein saath padhe the. Aap use kaise jaante hain?'],
        [0, 'We work in the same office. I\'m Aman, by the way.', 'Hum ek hi office mein kaam karte hain. Waise, main Aman hoon.'],
        [1, 'Nice to meet you, Aman. I\'m Sana.', 'Aapse milkar achha laga Aman. Main Sana hoon.'],
        [0, 'Nice to meet you too. What do you do, Sana?', 'Mujhe bhi achha laga. Aap kya karti hain Sana?'],
        [1, 'I\'m a graphic designer. I work from home.', 'Main graphic designer hoon. Main ghar se kaam karti hoon.'],
        [0, 'That sounds interesting. Would you like something to drink?', 'Yeh dilchasp lagta hai. Kya aap kuch peena chahengi?'],
        [1, 'Yes, a glass of juice would be nice. Thank you.', 'Haan, ek glass juice achha rahega. Shukriya.']
      ]
    },
    {
      id: 'shopping-clothes', title: 'Shopping for Clothes', level: 'beginner',
      scene: 'Meera ek dukaan par shirt kharidne gayi hai.',
      roles: ['Shopkeeper', 'Meera'],
      lines: [
        [0, 'Good afternoon. May I help you?', 'Good afternoon. Kya main aapki madad kar sakta hoon?'],
        [1, 'Yes, I\'m looking for a blue cotton shirt for my brother.', 'Haan, mujhe apne bhai ke liye ek neeli cotton ki shirt chahiye.'],
        [0, 'Sure. What size does he wear?', 'Zaroor. Woh kaunsa size pehente hain?'],
        [1, 'He wears a medium. Do you have one in stock?', 'Woh medium pehente hain. Kya aapke paas stock mein hai?'],
        [0, 'Yes, this one is new. It costs eight hundred rupees.', 'Haan, yeh nayi aayi hai. Iski keemat aath sau rupaye hai.'],
        [1, 'That\'s slightly over my budget. Is there any offer today?', 'Yeh mere budget se thodi zyada hai. Kya aaj koi offer hai?'],
        [0, 'I can give you ten percent off.', 'Main aapko das percent ki chhoot de sakta hoon.'],
        [1, 'That works for me. I\'ll take it.', 'Yeh theek hai. Main ise le leti hoon.']
      ]
    },
    {
      id: 'ordering-food', title: 'Ordering Food', level: 'intermediate',
      scene: 'Arjun aur uski dost ek restaurant mein khaana order kar rahe hain.',
      roles: ['Waiter', 'Arjun'],
      lines: [
        [0, 'Welcome! Are you ready to order?', 'Swagat hai! Kya aap order dene ke liye taiyaar hain?'],
        [1, 'Almost. Is the paneer butter masala good here?', 'Lagbhag. Kya yahan ka paneer butter masala achha hai?'],
        [0, 'It\'s our most popular dish. I\'d definitely recommend it.', 'Yeh humari sabse mashhoor dish hai. Main ise zaroor recommend karunga.'],
        [1, 'Great. I\'ll have that with two butter naans.', 'Badhiya. Main woh do butter naan ke saath lunga.'],
        [0, 'Would you like anything to drink?', 'Kya aap kuch peena chahenge?'],
        [1, 'Two glasses of sweet lassi, please.', 'Do glass meethi lassi dijiye.'],
        [0, 'Certainly. Your order will be ready in fifteen minutes.', 'Bilkul. Aapka order pandrah minute mein taiyaar ho jayega.'],
        [1, 'Thank you. We\'re not in a hurry.', 'Shukriya. Humein koi jaldi nahi hai.']
      ]
    },
    {
      id: 'asking-directions', title: 'Asking for Directions', level: 'intermediate',
      scene: 'Ek tourist ek naye shehar mein museum ka raasta poochta hai.',
      roles: ['Tourist', 'Local'],
      lines: [
        [0, 'Excuse me, could you help me? I\'m trying to find the City Museum.', 'Excuse me, kya aap meri madad karenge? Mujhe City Museum dhoondhna hai.'],
        [1, 'Of course. Go straight on this road for about two hundred metres.', 'Zaroor. Is sadak par lagbhag do sau meter seedha chaliye.'],
        [0, 'Straight for two hundred metres. And then?', 'Do sau meter seedha. Phir?'],
        [1, 'Turn left at the traffic light. You will see a big park.', 'Traffic light se baayein mudiye. Aapko ek bada park dikhega.'],
        [0, 'Is the museum next to the park?', 'Kya museum park ke bagal mein hai?'],
        [1, 'Yes, it is just opposite the park, beside the bank.', 'Haan, yeh park ke bilkul saamne, bank ke bagal mein hai.'],
        [0, 'How long will it take to walk there?', 'Wahan paidal pahunchne mein kitna time lagega?'],
        [1, 'About ten minutes. You can\'t miss it.', 'Lagbhag das minute. Aap ise miss nahi kar sakte.']
      ]
    },
    {
      id: 'job-interview', title: 'Job Interview', level: 'advanced',
      scene: 'Priya ek marketing executive ki post ke liye interview de rahi hai.',
      roles: ['Interviewer', 'Priya'],
      lines: [
        [0, 'Good morning, Priya. Please have a seat.', 'Good morning Priya. Kripya baithiye.'],
        [1, 'Good morning, sir. Thank you for inviting me today.', 'Good morning sir. Aaj mujhe bulane ke liye shukriya.'],
        [0, 'Why did you apply for this position?', 'Aapne is post ke liye apply kyun kiya?'],
        [1, 'I enjoy creative work, and I believe my digital marketing skills suit this role.', 'Mujhe creative kaam pasand hai aur mujhe lagta hai meri digital marketing skills is role ke liye sahi hain.'],
        [0, 'Can you describe a project you are proud of?', 'Kya aap koi aisa project bata sakti hain jis par aapko garv hai?'],
        [1, 'Last year, I led a social media campaign that doubled our followers in six months.', 'Pichhle saal maine ek social media campaign lead kiya jisne chhe mahine mein humare followers do guna kar diye.'],
        [0, 'That\'s impressive. How do you handle pressure at work?', 'Yeh prabhavshali hai. Aap kaam ke dabaav ko kaise sambhalti hain?'],
        [1, 'I make a plan, set priorities and take short breaks to stay focused.', 'Main ek plan banati hoon, priorities tay karti hoon aur dhyan banaye rakhne ke liye chhote break leti hoon.']
      ]
    },
    {
      id: 'workplace-chat', title: 'Workplace Conversation', level: 'advanced',
      scene: 'Manager Mr. Verma aur employee Nisha ek project ke baare mein baat karte hain.',
      roles: ['Mr. Verma', 'Nisha'],
      lines: [
        [0, 'Nisha, do you have a few minutes? I\'d like to discuss the client project.', 'Nisha, kya aapke paas kuch minute hain? Main client project par baat karna chahta hoon.'],
        [1, 'Certainly, sir. I\'ve just finished the first draft.', 'Bilkul sir. Maine abhi pehla draft khatam kiya hai.'],
        [0, 'Excellent. Is everything on schedule?', 'Bahut badhiya. Kya sab kuch schedule par hai?'],
        [1, 'Mostly, yes. However, the design team needs two more days.', 'Zyadatar haan. Lekin design team ko do din aur chahiye.'],
        [0, 'Two more days could be a problem. The client expects the final version on Friday.', 'Do din aur lagna problem ho sakta hai. Client ko final version Friday tak chahiye.'],
        [1, 'I understand. I\'ll speak to them and ask them to prioritise this work.', 'Main samajhti hoon. Main unse baat karti hoon aur is kaam ko pehle karne ko kehti hoon.'],
        [0, 'Good. Please send me an update by this evening.', 'Theek hai. Kripya aaj shaam tak mujhe update bhej dijiye.'],
        [1, 'Sure, I\'ll email it before five o\'clock.', 'Zaroor, main paanch baje se pehle email kar dungi.']
      ]
    }
  ]
};
