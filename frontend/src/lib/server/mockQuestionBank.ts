import type { ExamPaperContent, ExamQuestion } from "@/types/examPaper";
import type { StoredAssignment } from "./store";

type Difficulty = "easy" | "medium" | "hard";

interface QuestionTemplate {
  type: string;
  difficulty: Difficulty;
  text: string;
}

const SUBJECT_BANKS: Record<string, QuestionTemplate[]> = {
  physics: [
    { type: "mcq", difficulty: "easy", text: "The SI unit of force is:\na) Joule\nb) Newton\nc) Watt\nd) Pascal" },
    { type: "mcq", difficulty: "easy", text: "The SI unit of electric current is:\na) Volt\nb) Ampere\nc) Ohm\nd) Coulomb" },
    { type: "mcq", difficulty: "easy", text: "Which of the following is a scalar quantity?\na) Velocity\nb) Force\nc) Mass\nd) Acceleration" },
    { type: "mcq", difficulty: "easy", text: "The speed of light in vacuum is approximately:\na) 3 × 10⁶ m/s\nb) 3 × 10⁸ m/s\nc) 3 × 10¹⁰ m/s\nd) 3 × 10⁴ m/s" },
    { type: "mcq", difficulty: "medium", text: "According to Newton's Second Law, force equals:\na) mass × velocity\nb) mass × acceleration\nc) weight × gravity\nd) momentum × time" },
    { type: "mcq", difficulty: "medium", text: "Which phenomenon explains the bending of light when it passes from air to glass?\na) Reflection\nb) Refraction\nc) Diffraction\nd) Polarization" },
    { type: "mcq", difficulty: "medium", text: "The work done in moving a charge of 2 C through a potential difference of 5 V is:\na) 2.5 J\nb) 5 J\nc) 10 J\nd) 20 J" },
    { type: "mcq", difficulty: "medium", text: "Which law states that the total energy in an isolated system remains constant?\na) Newton's First Law\nb) Law of Conservation of Energy\nc) Ohm's Law\nd) Boyle's Law" },
    { type: "mcq", difficulty: "hard", text: "A body of mass 2 kg is moving with velocity 3 m/s. Its kinetic energy is:\na) 3 J\nb) 6 J\nc) 9 J\nd) 12 J" },
    { type: "mcq", difficulty: "hard", text: "The resistance of a wire depends on:\na) Length and area of cross-section only\nb) Material, length, and area of cross-section\nc) Temperature only\nd) Voltage only" },
    { type: "mcq", difficulty: "hard", text: "Which electromagnetic wave has the highest frequency?\na) Radio waves\nb) Microwaves\nc) X-rays\nd) Infrared" },
    { type: "mcq", difficulty: "easy", text: "Sound cannot travel through:\na) Air\nb) Water\nc) Steel\nd) Vacuum" },
    { type: "short_answer", difficulty: "easy", text: "State Newton's First Law of Motion with a real-life example." },
    { type: "short_answer", difficulty: "easy", text: "Define pressure. Write its SI unit." },
    { type: "short_answer", difficulty: "medium", text: "Differentiate between speed and velocity with one example each." },
    { type: "short_answer", difficulty: "medium", text: "Explain why a person feels lighter at the top of a roller-coaster drop (concept of apparent weight)." },
    { type: "short_answer", difficulty: "medium", text: "State Ohm's Law and write the formula relating voltage, current, and resistance." },
    { type: "short_answer", difficulty: "hard", text: "Explain the difference between series and parallel combinations of resistors." },
    { type: "long_answer", difficulty: "hard", text: "Derive the three equations of motion for uniformly accelerated motion. Solve: A car accelerates from rest at 2 m/s² for 5 s. Find final velocity and distance covered." },
    { type: "long_answer", difficulty: "medium", text: "Describe the laws of reflection with a labelled ray diagram. Give two applications of mirrors in daily life." },
    { type: "true_false", difficulty: "easy", text: "Statement: Light travels faster in vacuum than in water. (True / False — justify briefly.)" },
    { type: "true_false", difficulty: "medium", text: "Statement: A body at rest has zero acceleration. (True / False — explain.)" },
    { type: "fill_blank", difficulty: "easy", text: "The rate of change of velocity with respect to time is called ______." },
    { type: "fill_blank", difficulty: "easy", text: "The SI unit of power is ______." },
    { type: "fill_blank", difficulty: "medium", text: "The device used to measure electric current is called ______." },
  ],
  social: [
    { type: "mcq", difficulty: "easy", text: "Which organ of the United Nations maintains international peace and security?\na) General Assembly\nb) Security Council\nc) ICJ\nd) Secretariat" },
    { type: "mcq", difficulty: "medium", text: "The French Revolution began in:\na) 1776\nb) 1789\nc) 1815\nd) 1848" },
    { type: "mcq", difficulty: "easy", text: "India became independent in:\na) 1945\nb) 1947\nc) 1950\nd) 1942" },
    { type: "mcq", difficulty: "medium", text: "Which river is known as the 'Sorrow of Bengal'?\na) Ganga\nb) Damodar\nc) Yamuna\nd) Brahmaputra" },
    { type: "mcq", difficulty: "hard", text: "The Preamble to the Indian Constitution begins with:\na) We the citizens\nb) We the people of India\nc) In the name of God\nd) Sovereign socialist republic" },
    { type: "short_answer", difficulty: "easy", text: "Define democracy and name one feature of a democratic government." },
    { type: "short_answer", difficulty: "medium", text: "Explain the difference between direct and representative democracy with one example each." },
    { type: "short_answer", difficulty: "medium", text: "What are fundamental rights? Name any three." },
    { type: "long_answer", difficulty: "hard", text: "Discuss the main causes and consequences of the French Revolution." },
    { type: "long_answer", difficulty: "medium", text: "Describe the role of the Indian Constitution in protecting citizens' rights." },
    { type: "true_false", difficulty: "easy", text: "Statement: The Indus Valley Civilization existed in the Indian subcontinent. (True / False)" },
    { type: "true_false", difficulty: "medium", text: "Statement: Globalization affects only developed countries. (True / False — explain.)" },
    { type: "fill_blank", difficulty: "easy", text: "The Indian National Congress was founded in ______." },
    { type: "fill_blank", difficulty: "medium", text: "The process of choosing representatives by voting is called ______." },
    { type: "mcq", difficulty: "hard", text: "Which economic system emphasizes private ownership?\na) Socialism\nb) Capitalism\nc) Communism\nd) Feudalism" },
  ],
  math: [
    { type: "mcq", difficulty: "easy", text: "15% of 200 equals:\na) 20\nb) 25\nc) 30\nd) 35" },
    { type: "mcq", difficulty: "medium", text: "If x + 5 = 12, then x equals:\na) 5\nb) 6\nc) 7\nd) 8" },
    { type: "mcq", difficulty: "easy", text: "The sum of angles in a triangle is:\na) 90°\nb) 180°\nc) 270°\nd) 360°" },
    { type: "mcq", difficulty: "hard", text: "The area of a circle with radius 7 cm is (π = 22/7):\na) 154 cm²\nb) 144 cm²\nc) 124 cm²\nd) 134 cm²" },
    { type: "short_answer", difficulty: "medium", text: "Find the HCF of 48 and 72 using prime factorization." },
    { type: "short_answer", difficulty: "easy", text: "Simplify: 3(x + 2) − 2x." },
    { type: "long_answer", difficulty: "hard", text: "A train travels 360 km in 4 hours. Find average speed. If speed increases by 10 km/h, find new time for the same journey." },
    { type: "true_false", difficulty: "easy", text: "Statement: Every square is a rectangle. (True / False — explain.)" },
    { type: "fill_blank", difficulty: "easy", text: "√144 = ______." },
    { type: "fill_blank", difficulty: "medium", text: "The formula for area of a rectangle is ______." },
  ],
  english: [
    { type: "mcq", difficulty: "easy", text: "Which part of speech describes a noun?\na) Verb\nb) Adjective\nc) Adverb\nd) Preposition" },
    { type: "short_answer", difficulty: "medium", text: "Identify the figure of speech in: 'The wind whispered through the trees.'" },
    { type: "long_answer", difficulty: "hard", text: "Write a paragraph (120–150 words) on the importance of reading in the digital age." },
    { type: "fill_blank", difficulty: "easy", text: "The past tense of 'write' is ______." },
    { type: "true_false", difficulty: "medium", text: "Statement: A simile uses 'like' or 'as'. (True / False)" },
    { type: "mcq", difficulty: "medium", text: "Which is a synonym of 'happy'?\na) Sad\nb) Joyful\nc) Angry\nd) Tired" },
  ],
  general: [
    { type: "mcq", difficulty: "easy", text: "Which planet is known as the Red Planet?\na) Venus\nb) Mars\nc) Jupiter\nd) Saturn" },
    { type: "short_answer", difficulty: "medium", text: "Explain the water cycle and name its three main stages." },
    { type: "long_answer", difficulty: "hard", text: "Discuss environmental conservation and suggest three steps students can take." },
    { type: "true_false", difficulty: "easy", text: "Statement: Photosynthesis requires sunlight. (True / False)" },
    { type: "fill_blank", difficulty: "easy", text: "The chemical formula of water is ______." },
    { type: "mcq", difficulty: "medium", text: "Who wrote 'Romeo and Juliet'?\na) Dickens\nb) Shakespeare\nc) Austen\nd) Twain" },
  ],
};

function resolveSubjectKey(subject?: string): string {
  const s = (subject || "general").toLowerCase();
  if (s.includes("social") || s.includes("history") || s.includes("civics") || s.includes("geography")) return "social";
  if (s.includes("physics")) return "physics";
  if (s.includes("math") || s.includes("maths")) return "math";
  if (s.includes("english") || s.includes("literature")) return "english";
  return "general";
}

function distributeMarks(totalMarks: number, count: number): number[] {
  const base = Math.floor(totalMarks / count);
  const marks = Array(count).fill(base);
  marks[count - 1] += totalMarks - base * count;
  return marks;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick up to `count` unique questions; widen pool if filtered set is too small. */
function pickUniqueTemplates(
  bank: QuestionTemplate[],
  types: string[],
  count: number
): QuestionTemplate[] {
  let pool = bank.filter((q) => types.includes(q.type));
  if (pool.length < count) {
    const extra = bank.filter((q) => !pool.some((p) => p.text === q.text));
    pool = [...pool, ...extra];
  }
  if (pool.length < count) {
    pool = [...bank];
  }

  const shuffled = shuffle(pool);
  const picked: QuestionTemplate[] = [];
  const used = new Set<string>();

  for (const q of shuffled) {
    if (picked.length >= count) break;
    if (!used.has(q.text)) {
      used.add(q.text);
      picked.push(q);
    }
  }

  let variant = 1;
  while (picked.length < count) {
    const base = shuffled[picked.length % shuffled.length];
    picked.push({
      ...base,
      text: `${base.text}\n\n[Application ${variant}] Apply the same concept to a different numerical scenario.`,
    });
    variant++;
  }

  return picked.slice(0, count);
}

const TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice Questions",
  short_answer: "Short Answer Questions",
  long_answer: "Long Answer Questions",
  true_false: "True / False",
  fill_blank: "Fill in the Blanks",
};

export function buildSmartMockPaper(assignment: StoredAssignment): ExamPaperContent {
  const subjectKey = resolveSubjectKey(assignment.subject);
  const bank = SUBJECT_BANKS[subjectKey] ?? SUBJECT_BANKS.general;
  const types = assignment.questionTypes.length > 0 ? assignment.questionTypes : ["short_answer"];
  const count = assignment.numberOfQuestions;
  const marksList = distributeMarks(assignment.totalMarks, count);

  const templates = pickUniqueTemplates(bank, types, count);
  const questions: ExamQuestion[] = templates.map((template, i) => ({
    question: template.text,
    difficulty: template.difficulty,
    marks: marksList[i],
    type: template.type,
  }));

  if (types.length <= 1) {
    return {
      sections: [
        {
          title: "Section A",
          instruction: `Attempt all questions. Total marks: ${assignment.totalMarks}.`,
          questions,
        },
      ],
    };
  }

  const sections = types
    .map((type, idx) => {
      const sectionQuestions = questions.filter((q) => q.type === type);
      if (sectionQuestions.length === 0) return null;
      return {
        title: `Section ${String.fromCharCode(65 + idx)}`,
        instruction: `${TYPE_LABELS[type] || type}: Attempt all questions in this section.`,
        questions: sectionQuestions,
      };
    })
    .filter(Boolean) as ExamPaperContent["sections"];

  return {
    sections:
      sections.length > 0
        ? sections
        : [{ title: "Section A", instruction: "Attempt all questions.", questions }],
  };
}
