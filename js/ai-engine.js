/* =========================================
   EduAI – Demo AI Engine
   No API key required — all responses are
   generated locally using smart templates
   and a curated question/knowledge bank.
   ========================================= */

import { DEMO_MODE, API_KEY, API_ENDPOINT, API_PROVIDER, AI_CONFIG } from './api-config.js';

/* ======================================================
   KNOWLEDGE BASE – Subject responses
   ====================================================== */
const KNOWLEDGE = {
  Mathematics: {
    topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Number Theory', 'Probability'],
    concepts: {
      algebra:      'Algebra is the branch of mathematics dealing with symbols (variables) and the rules for manipulating those symbols. Key concepts include equations, inequalities, polynomials, and functions.',
      quadratic:    'A quadratic equation has the form **ax² + bx + c = 0**. You can solve it using:\n- **Factoring**: Split the middle term\n- **Quadratic Formula**: x = (-b ± √(b²-4ac)) / 2a\n- **Completing the Square**\n\n**Example**: x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2 or x = 3',
      geometry:     'Geometry studies shapes, sizes, and properties of figures. Key formulas:\n- Circle area: **πr²**, Circumference: **2πr**\n- Triangle area: **½ × base × height**\n- Rectangle area: **length × width**\n- Pythagoras: **a² + b² = c²**',
      trigonometry: 'Trigonometry deals with relationships between angles and sides of triangles.\n- **sin θ** = Opposite/Hypotenuse\n- **cos θ** = Adjacent/Hypotenuse\n- **tan θ** = Opposite/Adjacent\n\nMnemonic: **SOH-CAH-TOA**',
      probability:  'Probability = (Favorable outcomes) / (Total outcomes)\n- P(A) is always between 0 and 1\n- P(A) + P(A\') = 1\n- **Example**: Flipping a coin → P(Heads) = 1/2 = 0.5',
    }
  },
  Science: {
    topics: ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Astronomy'],
    concepts: {
      newton:     '**Newton\'s Laws of Motion**:\n1. **Inertia**: An object stays at rest or in motion unless acted upon by a force\n2. **F = ma**: Force equals mass times acceleration\n3. **Action-Reaction**: For every action, there is an equal and opposite reaction\n\n**Example**: When you push a wall, the wall pushes back with the same force.',
      photosynthesis: '**Photosynthesis** is the process plants use to convert light energy into food:\n\n6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n\nIt occurs in the **chloroplasts** using chlorophyll. The two stages are:\n1. **Light Reactions** (in thylakoids)\n2. **Calvin Cycle** (in stroma)',
      cell:       '**Cell Structure**:\n- **Cell Membrane**: Controls what enters/exits\n- **Nucleus**: Contains DNA, controls cell activities\n- **Mitochondria**: Powerhouse – produces ATP energy\n- **Ribosomes**: Produce proteins\n- **Endoplasmic Reticulum**: Transport network',
      atom:       'An **atom** consists of:\n- **Protons** (positive) – in the nucleus\n- **Neutrons** (neutral) – in the nucleus\n- **Electrons** (negative) – orbit the nucleus\n\nAtomic Number = number of protons. Atoms of the same element have the same atomic number.',
    }
  },
  English: {
    topics: ['Grammar', 'Essay Writing', 'Literature', 'Comprehension', 'Vocabulary', 'Poetry'],
    concepts: {
      essay:    '**Essay Writing Structure**:\n1. **Introduction**: Hook + Background + Thesis statement\n2. **Body Paragraph 1**: Topic sentence + Evidence + Analysis\n3. **Body Paragraph 2**: Topic sentence + Evidence + Analysis\n4. **Body Paragraph 3**: (if needed)\n5. **Conclusion**: Restate thesis + Summary + Closing thought\n\n**Tip**: Each paragraph should have ONE main idea.',
      grammar:  '**Key Grammar Rules**:\n- **Noun**: Person, place, thing (dog, city, love)\n- **Verb**: Action or state (run, is, think)\n- **Adjective**: Describes noun (big, red, happy)\n- **Adverb**: Modifies verb/adjective (quickly, very)\n- **Preposition**: Shows relationship (in, on, under)',
      tenses:   '**English Tenses**:\n- **Simple Present**: She *plays* tennis\n- **Present Continuous**: She *is playing* tennis\n- **Simple Past**: She *played* yesterday\n- **Past Perfect**: She *had played* before it rained\n- **Future**: She *will play* tomorrow',
    }
  },
  History: {
    topics: ['Ancient History', 'Medieval History', 'Modern History', 'World Wars', 'Indian History', 'Civilizations'],
    concepts: {
      ww2:    '**World War II (1939-1945)**:\n- **Cause**: Nazi Germany\'s aggression, Hitler\'s expansionism, failure of appeasement\n- **Key Events**: Invasion of Poland (1939), Battle of Britain (1940), Pearl Harbor (1941), D-Day (1944), VE Day / VJ Day (1945)\n- **Result**: ~70 million deaths, UN formed, Cold War began, decolonization accelerated',
      french: '**French Revolution (1789-1799)**:\n- **Cause**: Financial crisis, Enlightenment ideas, inequality between estates\n- **Key Events**: Storming the Bastille (July 14, 1789), Declaration of Rights of Man, Reign of Terror\n- **Impact**: End of monarchy, rise of nationalism, spread of democratic ideals',
    }
  },
  'Computer Science': {
    topics: ['Programming', 'Data Structures', 'Algorithms', 'Networking', 'Databases', 'AI/ML', 'Web Development'],
    concepts: {
      algorithm:  'An **algorithm** is a step-by-step procedure to solve a problem.\n\n**Key Properties**:\n- **Input**: Zero or more inputs\n- **Output**: At least one result\n- **Definiteness**: Each step is clear\n- **Finiteness**: Must terminate\n- **Effectiveness**: Feasible steps\n\n**Example**: Binary Search has O(log n) time complexity.',
      oop:        '**Object-Oriented Programming (OOP)** – 4 Pillars:\n1. **Encapsulation**: Bundling data and methods together (hide internal details)\n2. **Inheritance**: Child class inherits from parent class (reuse code)\n3. **Polymorphism**: Same method name, different behavior\n4. **Abstraction**: Show only essential features, hide complexity',
      python:     '**Python Basics**:\n```python\n# Variables\nname = "Alex"\nage = 16\n\n# List\nsubjects = ["Math", "Science", "English"]\n\n# Loop\nfor subject in subjects:\n    print(f"I study {subject}")\n\n# Function\ndef greet(name):\n    return f"Hello, {name}!"\n```',
    }
  }
};

/* ======================================================
   DEMO QUIZ QUESTION BANK
   ====================================================== */
export const QUIZ_BANK = {
  Mathematics: {
    easy: [
      { q: 'What is 15% of 200?', opts: ['25','30','35','40'], ans: 1, exp: '15% of 200 = (15/100) × 200 = 30' },
      { q: 'What is the value of π (pi) approximately?', opts: ['3.14','3.41','3.17','2.14'], ans: 0, exp: 'π ≈ 3.14159...' },
      { q: 'Solve: 2x + 6 = 14. What is x?', opts: ['3','4','5','6'], ans: 1, exp: '2x = 14 - 6 = 8, so x = 4' },
      { q: 'What is the square root of 144?', opts: ['11','12','13','14'], ans: 1, exp: '√144 = 12 because 12 × 12 = 144' },
      { q: 'Which is a prime number?', opts: ['21','25','29','33'], ans: 2, exp: '29 is prime — only divisible by 1 and 29' },
      { q: 'What is 7³ (7 cubed)?', opts: ['21','49','343','147'], ans: 2, exp: '7³ = 7 × 7 × 7 = 343' },
      { q: 'The sum of angles in a triangle is:', opts: ['90°','180°','270°','360°'], ans: 1, exp: 'All triangles have interior angles summing to 180°' },
      { q: 'What is the HCF of 12 and 18?', opts: ['3','4','6','9'], ans: 2, exp: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6' },
    ],
    medium: [
      { q: 'If a = 3 and b = 4, what is √(a² + b²)?', opts: ['5','6','7','25'], ans: 0, exp: 'a² + b² = 9 + 16 = 25. √25 = 5 (Pythagorean triple!)' },
      { q: 'Solve the quadratic: x² - 7x + 12 = 0. One root is:', opts: ['2','3','5','6'], ans: 1, exp: '(x-3)(x-4) = 0 → x = 3 or x = 4' },
      { q: 'What is sin 30°?', opts: ['1/2','√3/2','1/√2','√3'], ans: 0, exp: 'sin 30° = 0.5 = 1/2. Remember: SOH — sin = opposite/hypotenuse' },
      { q: 'The slope of a line y = 3x - 5 is:', opts: ['-5','3','5','-3'], ans: 1, exp: 'In y = mx + c, m is the slope. Here m = 3' },
      { q: 'What is 5! (5 factorial)?', opts: ['15','25','100','120'], ans: 3, exp: '5! = 5×4×3×2×1 = 120' },
    ],
    hard: [
      { q: 'What is the derivative of f(x) = x³ - 3x²?', opts: ['3x² - 3','3x² - 6x','x² - 6x','3x - 6'], ans: 1, exp: 'd/dx(x³) = 3x², d/dx(-3x²) = -6x. So f\'(x) = 3x² - 6x' },
      { q: 'Evaluate: log₂(128)', opts: ['5','6','7','8'], ans: 2, exp: '2^7 = 128, so log₂(128) = 7' },
      { q: 'A geometric sequence has first term 2 and ratio 3. What is the 5th term?', opts: ['54','81','162','243'], ans: 2, exp: 'a₅ = 2 × 3⁴ = 2 × 81 = 162' },
    ]
  },
  Science: {
    easy: [
      { q: 'What gas do plants absorb during photosynthesis?', opts: ['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'], ans: 2, exp: 'Plants absorb CO₂ and release O₂ during photosynthesis' },
      { q: 'What is the unit of electric current?', opts: ['Volt','Watt','Ohm','Ampere'], ans: 3, exp: 'Electric current is measured in Amperes (A)' },
      { q: 'How many bones are in the adult human body?', opts: ['196','206','216','226'], ans: 1, exp: 'An adult human has exactly 206 bones' },
      { q: 'What is the chemical symbol for Gold?', opts: ['Go','Gd','Au','Ag'], ans: 2, exp: 'Gold\'s symbol Au comes from its Latin name "Aurum"' },
      { q: 'Which planet is closest to the Sun?', opts: ['Venus','Earth','Mars','Mercury'], ans: 3, exp: 'Mercury is the closest planet to the Sun' },
      { q: 'Speed of light is approximately:', opts: ['3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','3×10⁴ m/s'], ans: 1, exp: 'Speed of light c ≈ 3 × 10⁸ m/s in vacuum' },
    ],
    medium: [
      { q: 'What is Newton\'s Second Law of Motion?', opts: ['F = mv','F = ma','F = m/a','F = a/m'], ans: 1, exp: 'F = ma: Force equals mass times acceleration' },
      { q: 'The powerhouse of the cell is:', opts: ['Nucleus','Ribosome','Mitochondria','Lysosome'], ans: 2, exp: 'Mitochondria produce ATP energy — hence called the powerhouse of the cell' },
      { q: 'What is the pH of pure water?', opts: ['6','7','8','9'], ans: 1, exp: 'Pure water has a neutral pH of 7' },
      { q: 'Which gas is most abundant in Earth\'s atmosphere?', opts: ['Oxygen','Carbon Dioxide','Nitrogen','Argon'], ans: 2, exp: 'Nitrogen (N₂) makes up about 78% of the atmosphere' },
    ],
    hard: [
      { q: 'The half-life of Carbon-14 is approximately:', opts: ['2,730 years','5,730 years','10,730 years','1,730 years'], ans: 1, exp: 'Carbon-14 has a half-life of ~5,730 years, used in radiocarbon dating' },
      { q: 'What is Avogadro\'s number?', opts: ['6.02×10²³','6.02×10²²','6.02×10²⁴','6.02×10²¹'], ans: 0, exp: 'Avogadro\'s number = 6.022×10²³ particles per mole' },
    ]
  },
  English: {
    easy: [
      { q: 'Which is a noun?', opts: ['Quickly','Beautiful','Happiness','Run'], ans: 2, exp: '"Happiness" is an abstract noun — it names a feeling/thing' },
      { q: 'What is the past tense of "eat"?', opts: ['Eated','Ate','Eaten','Eat'], ans: 1, exp: '"Eat" is an irregular verb. Past tense = "ate"' },
      { q: '"The dog is very ___ today." Which fits best?', opts: ['happily','quick','excited','ran'], ans: 2, exp: 'We need an adjective to describe the dog. "Excited" is an adjective' },
      { q: 'A metaphor is:', opts: ['A direct comparison using "like"','A direct comparison without "like"','Giving human traits to objects','Exaggeration for effect'], ans: 1, exp: 'A metaphor makes a direct comparison: "Life is a journey" (not using like/as)' },
    ],
    medium: [
      { q: 'Which literary device is used in "The wind whispered through the trees"?', opts: ['Simile','Metaphor','Personification','Hyperbole'], ans: 2, exp: 'Personification gives human qualities (whispering) to a non-human thing (wind)' },
      { q: 'Identify the correct sentence:', opts: ['Their going to the park.','There going to the park.','They\'re going to the park.','Theyre going to the park.'], ans: 2, exp: '"They\'re" is the contraction of "they are". "Their" shows possession. "There" shows place.' },
    ]
  },
  History: {
    easy: [
      { q: 'When did World War II end?', opts: ['1943','1944','1945','1946'], ans: 2, exp: 'WWII ended in 1945 — VE Day (May 8) in Europe and VJ Day (Aug 15) in Asia' },
      { q: 'Who was the first President of the United States?', opts: ['Abraham Lincoln','Thomas Jefferson','George Washington','Benjamin Franklin'], ans: 2, exp: 'George Washington was inaugurated as the 1st President on April 30, 1789' },
      { q: 'The French Revolution began in:', opts: ['1776','1789','1799','1804'], ans: 1, exp: 'The French Revolution started in 1789 with the Storming of the Bastille on July 14' },
    ],
    medium: [
      { q: 'The Treaty of Versailles (1919) ended which war?', opts: ['World War I','World War II','Napoleonic Wars','Crimean War'], ans: 0, exp: 'The Treaty of Versailles signed in 1919 formally ended World War I (1914-1918)' },
      { q: 'Who gave the "I Have a Dream" speech?', opts: ['Malcolm X','Barack Obama','Martin Luther King Jr.','Nelson Mandela'], ans: 2, exp: 'Martin Luther King Jr. delivered this iconic speech on August 28, 1963' },
    ]
  },
  'Computer Science': {
    easy: [
      { q: 'What does CPU stand for?', opts: ['Central Processing Unit','Computer Processing Unit','Central Program Unit','Computer Program Utility'], ans: 0, exp: 'CPU = Central Processing Unit — the "brain" of the computer' },
      { q: 'Which is NOT a programming language?', opts: ['Python','Java','HTML','C++'], ans: 2, exp: 'HTML is a markup language, not a programming language — it defines structure, not logic' },
      { q: 'What does "if-else" represent in programming?', opts: ['Loop','Conditional Statement','Function','Variable'], ans: 1, exp: 'if-else is a conditional statement — it executes different code based on a condition' },
    ],
    medium: [
      { q: 'What is the time complexity of Binary Search?', opts: ['O(1)','O(n)','O(log n)','O(n²)'], ans: 2, exp: 'Binary Search halves the search space each step → O(log n) time complexity' },
      { q: 'In OOP, what is "Encapsulation"?', opts: ['Inheriting from parent class','Binding data and methods together','Multiple forms of a function','Hiding implementation details only'], ans: 1, exp: 'Encapsulation bundles data and methods into a class, hiding internal details' },
      { q: 'Which data structure uses LIFO (Last In, First Out)?', opts: ['Queue','Stack','Array','Linked List'], ans: 1, exp: 'A Stack follows LIFO — the last element pushed is the first to be popped' },
    ],
    hard: [
      { q: 'What is the output of: 5 & 3 in Python (bitwise AND)?', opts: ['1','2','3','8'], ans: 0, exp: '5 = 101, 3 = 011. Bitwise AND: 001 = 1' },
      { q: 'Which sorting algorithm has the best average-case complexity?', opts: ['Bubble Sort','Insertion Sort','Quick Sort','Selection Sort'], ans: 2, exp: 'Quick Sort averages O(n log n), outperforming Bubble (O(n²)), Insertion (O(n²)), and Selection (O(n²))' },
    ]
  }
};

/* ======================================================
   STUDY PLAN GENERATOR
   ====================================================== */
export function generateStudyPlan({ subjects, examDate, hoursPerDay, weakSubjects, strongSubjects }) {
  const today = new Date();
  const exam  = new Date(examDate);
  const daysLeft = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));

  // Weight subjects by weakness/strength
  const weights = {};
  subjects.forEach(s => {
    weights[s] = 1;
    if (weakSubjects.includes(s))   weights[s] = 1.7;
    if (strongSubjects.includes(s)) weights[s] = 0.6;
  });
  const totalWeight = Object.values(weights).reduce((a,b) => a+b, 0);

  const plan = [];
  const dayCount = Math.min(daysLeft, 30);

  const TOPICS_MAP = {};
  subjects.forEach(s => {
    const bank = QUIZ_BANK[s] || QUIZ_BANK['Mathematics'];
    const kb   = KNOWLEDGE[s];
    TOPICS_MAP[s] = kb?.topics || ['Introduction', 'Core Concepts', 'Practice', 'Revision', 'Mock Test'];
  });

  let subjectTopicIndex = {};
  subjects.forEach(s => { subjectTopicIndex[s] = 0; });

  for (let day = 0; day < dayCount; day++) {
    const date = new Date(today); date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    // How many subjects per day (2–3)
    const subjectsToday = day % 2 === 0
      ? subjects.slice(0, Math.min(3, subjects.length))
      : subjects.slice(Math.min(3, subjects.length) - Math.min(2, subjects.length));

    const sessionsToday = subjectsToday.length ? subjectsToday : subjects.slice(0, 2);

    sessionsToday.forEach(subject => {
      const weight = weights[subject] / totalWeight;
      const minutes = Math.round(hoursPerDay * 60 * weight);
      const topics = TOPICS_MAP[subject] || ['Core Concepts'];
      const idx = subjectTopicIndex[subject] % topics.length;
      const topic = topics[idx];
      subjectTopicIndex[subject]++;

      const daysToExam = daysLeft - day;
      const priority = daysToExam <= 3 ? 'high' : (weakSubjects.includes(subject) ? 'high' : (strongSubjects.includes(subject) ? 'low' : 'medium'));

      plan.push({
        id: `plan_${day}_${subject}`,
        date: dateStr,
        day: dayName,
        subject,
        topic,
        duration: Math.max(20, minutes),
        priority,
        completed: false,
      });
    });
  }

  return plan;
}

/* ======================================================
   NOTES SUMMARIZER (Extractive)
   ====================================================== */
export function summarizeNotes(text) {
  if (!text || text.trim().length < 50) return { summary: text, keyPoints: [], keywords: [], questions: [] };

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const stopwords = new Set(['that','this','with','from','have','they','been','were','their','there','would','could','should','which','about','these','those','when','what','where','will','also','more','some','than','then','your','just','into','over','each','both','only','after','first','other','before']);

  // TF-IDF-like scoring
  const freq = {};
  words.forEach(w => { if (!stopwords.has(w)) freq[w] = (freq[w]||0) + 1; });

  const scoreSentence = (s) => {
    const sWords = s.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stopwords.has(w));
    return sWords.reduce((sum, w) => sum + (freq[w]||0), 0) / (sWords.length || 1);
  };

  const scored = sentences.map((s,i) => ({ s: s.trim(), score: scoreSentence(s) + (i === 0 ? 2 : 0), idx: i }));
  scored.sort((a,b) => b.score - a.score);

  const topN = Math.max(2, Math.min(5, Math.ceil(sentences.length * 0.3)));
  const summaryParts = scored.slice(0, topN).sort((a,b) => a.idx - b.idx).map(x => x.s);
  const summary = summaryParts.join(' ');

  // Key points – first sentence of each "section" or high-scored
  const keyPoints = scored.slice(0, Math.min(6, scored.length)).sort((a,b) => a.idx - b.idx).map(x => x.s);

  // Keywords – top-frequency words
  const keywords = Object.entries(freq)
    .filter(([w]) => !stopwords.has(w) && w.length > 4)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 12)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  // Generate questions from top sentences
  const qTemplates = [
    (s) => `What does the text say about ${extractSubject(s)}?`,
    (s) => `Explain the concept of ${extractSubject(s)} in your own words.`,
    (s) => `Why is ${extractSubject(s)} important according to the notes?`,
    (s) => `Define: ${extractSubject(s)}.`,
    (s) => `How does ${extractSubject(s)} relate to the main topic?`,
  ];
  const questions = scored.slice(0, 5).map((item, i) => qTemplates[i % qTemplates.length](item.s));

  return { summary, keyPoints, keywords, questions };
}

function extractSubject(sentence) {
  const words = sentence.split(' ').filter(w => w.length > 3 && /^[A-Z]/.test(w));
  if (words.length) return words[0].replace(/[^a-zA-Z ]/g, '');
  const short = sentence.split(' ').slice(0, 5).join(' ');
  return short.length > 3 ? short : 'this concept';
}

/* ======================================================
   AI TUTOR RESPONSE ENGINE
   ====================================================== */
export async function getAIResponse({ message, subject, mode, chatHistory }) {
  if (!DEMO_MODE && API_KEY) {
    try { return await callRealAPI({ message, subject, mode, chatHistory }); }
    catch { return generateDemoResponse({ message, subject, mode }); }
  }
  // Simulate typing delay
  await sleep(1200 + Math.random() * 800);
  return generateDemoResponse({ message, subject, mode });
}

function generateDemoResponse({ message, subject, mode }) {
  const msg = message.toLowerCase();
  const kb  = KNOWLEDGE[subject] || KNOWLEDGE['Mathematics'];

  let response = '';

  // Check for known concept keywords
  const conceptKeys = Object.keys(kb.concepts || {});
  const matched = conceptKeys.find(k => msg.includes(k));

  if (matched) {
    response = kb.concepts[matched];
  } else if (msg.match(/\bquiz\b|\btest\b|\bpractice q/)) {
    response = generateQuizResponse(subject);
  } else if (msg.match(/\bsimple\b|\bbasic\b|\bbeginner\b|\bwhat is\b/)) {
    response = generateSimpleExplanation(subject, msg);
  } else if (msg.match(/\bexample\b|\bshow me\b|\bdemonstrate\b/)) {
    response = generateExampleResponse(subject, msg);
  } else if (msg.match(/\bhelp\b|\bdon\'t understand\b|\bconfused\b|\bstruggling\b/)) {
    response = `I understand this can be challenging! Let me break it down for you.\n\n**${subject} – Key Ideas to Remember:**\n` +
      (kb.topics || []).slice(0,4).map((t, i) => `${i+1}. **${t}** – A foundational concept you should master`).join('\n') +
      `\n\nWould you like me to explain any of these topics in detail? Just ask! 😊`;
  } else {
    // Generic helpful response
    response = generateGenericResponse(subject, message, kb);
  }

  // Apply mode modifiers
  if (mode === 'simple') {
    response = `**📚 Simple Explanation:**\n\n${simplifyText(response)}`;
  } else if (mode === 'example') {
    response = response + '\n\n**💡 Real-World Example:**\n' + generateRealWorldExample(subject);
  } else if (mode === 'quiz') {
    response = generateQuizResponse(subject);
  }

  return response;
}

function generateSimpleExplanation(subject, msg) {
  const kb = KNOWLEDGE[subject] || KNOWLEDGE['Mathematics'];
  const topics = kb.topics || ['Core Concepts'];
  return `**${subject} – Made Simple!** 🎯\n\nHere are the most important things to understand:\n\n` +
    topics.slice(0,3).map(t => `• **${t}**: This is a key area in ${subject} that you'll use often`).join('\n') +
    `\n\nStart with the basics and build up step by step. Would you like a detailed explanation of any specific topic? I'm here to help! 🚀`;
}

function generateExampleResponse(subject, msg) {
  const examples = {
    Mathematics: '**Example**: If a train travels at 60 km/h for 2.5 hours, distance = 60 × 2.5 = **150 km**. This uses the formula: Distance = Speed × Time.',
    Science: '**Example**: When you drop a ball, gravity (9.8 m/s²) pulls it down. After 1 second, its speed is 9.8 m/s. After 2 seconds, it\'s 19.6 m/s. This is Newton\'s second law in action!',
    English: '**Example of a strong essay paragraph**:\n\n*"Social media has transformed communication. Studies show that 95% of teens use at least one platform daily (Pew Research, 2023). This constant connectivity, while fostering global relationships, also raises concerns about mental health and attention spans."*',
    History: '**Example**: The French Revolution (1789) was caused by three main factors: (1) Financial bankruptcy of France, (2) Enlightenment ideas about equality, (3) Food shortages causing public anger. This "domino effect" of causes is a pattern seen in many revolutions.',
    'Computer Science': '**Example in Python**:\n```python\n# Finding the largest number in a list\nnumbers = [34, 67, 23, 89, 45]\nlargest = max(numbers)\nprint(f"The largest number is {largest}")\n# Output: The largest number is 89\n```',
  };
  return examples[subject] || examples['Mathematics'];
}

function generateGenericResponse(subject, message, kb) {
  const topics = kb.topics || ['Core Concepts'];
  return `Great question about **${subject}**! 🌟\n\nBased on what you're asking, here are some key insights:\n\n` +
    `• ${subject} covers important areas like ${topics.slice(0,3).join(', ')}\n` +
    `• Understanding the fundamentals will help you tackle any problem in this subject\n` +
    `• Practice regularly and review concepts you find difficult\n\n` +
    `**My advice**: Start by reviewing the basics, then gradually move to harder problems. Would you like me to:\n` +
    `1. 📖 Explain a specific topic in ${subject}?\n` +
    `2. ❓ Give you practice questions?\n` +
    `3. 💡 Show you real-world examples?\n\nJust let me know! 😊`;
}

function generateQuizResponse(subject) {
  const bank = QUIZ_BANK[subject]?.easy || QUIZ_BANK['Mathematics'].easy;
  const q = bank[Math.floor(Math.random() * bank.length)];
  return `**🎯 Quick Quiz – ${subject}!**\n\n**Question**: ${q.q}\n\n${q.opts.map((o,i) => `${['A','B','C','D'][i]}) ${o}`).join('\n')}\n\n*(Reply with A, B, C, or D — I'll check your answer!)*`;
}

function generateRealWorldExample(subject) {
  const examples = {
    Mathematics: 'When shopping, you use percentages to calculate discounts. If a ₹500 shirt is 30% off, you save ₹150 and pay ₹350.',
    Science: 'Your phone battery uses chemistry (lithium-ion reactions) to store and release electrical energy — that\'s electrochemistry in everyday life!',
    English: 'Resumes and job applications require perfect grammar. Good writing skills directly impact your career opportunities.',
    History: 'Understanding how the 2008 financial crisis happened (similar to the 1929 crash) helps economists prevent future crashes.',
    'Computer Science': 'Every app you use — Instagram, YouTube, Maps — runs on algorithms. Sorting your feed uses recommendation algorithms.',
  };
  return examples[subject] || 'Every subject you study has applications in the real world — stay curious! 🌍';
}

function simplifyText(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n\n+/g, '\n').trim() + '\n\n_(Explained in the simplest way possible!)_';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ======================================================
   REAL API CALL (if key provided)
   ====================================================== */
async function callRealAPI({ message, subject, mode, chatHistory }) {
  // Simplified – extend for specific providers
  const systemPrompt = AI_CONFIG.systemPrompt + ` Current subject: ${subject}.`;
  const userMessage = mode === 'simple' ? `Explain simply: ${message}` : mode === 'example' ? `Explain with a real example: ${message}` : message;

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';
}

/* ======================================================
   SUGGESTED QUESTIONS
   ====================================================== */
export function getSuggestedQuestions(subject) {
  const questions = {
    Mathematics: ['Explain quadratic equations with examples', 'What is the difference between permutation and combination?', 'How do I find the area of a circle?', 'What are the laws of exponents?', 'Explain the Pythagoras theorem'],
    Science:     ['How does photosynthesis work?', 'What are Newton\'s three laws of motion?', 'Explain the structure of an atom', 'What is DNA and how does it work?', 'How do vaccines protect us?'],
    English:     ['How do I write a good essay?', 'What is the difference between a metaphor and simile?', 'Explain active vs passive voice', 'What are the types of pronouns?', 'How to improve my vocabulary?'],
    History:     ['What caused World War I?', 'Explain the French Revolution', 'What was the Cold War?', 'What led to India\'s independence in 1947?', 'How did the Roman Empire fall?'],
    'Computer Science': ['What is Object-Oriented Programming?', 'Explain how binary search works', 'What is the difference between stack and queue?', 'How does the internet work?', 'Explain recursion with an example'],
    Geography:   ['What causes earthquakes?', 'Explain the water cycle', 'What are the types of rocks?', 'How do ocean currents affect climate?', 'What is the greenhouse effect?'],
    Physics:     ['Explain Newton\'s laws of motion', 'What is the difference between speed and velocity?', 'How does electricity flow?', 'Explain electromagnetic radiation', 'What is nuclear fission?'],
    Chemistry:   ['What is the periodic table?', 'Explain types of chemical bonds', 'What is oxidation and reduction?', 'How does electrolysis work?', 'Explain the mole concept'],
  };
  return questions[subject] || questions['Mathematics'];
}
