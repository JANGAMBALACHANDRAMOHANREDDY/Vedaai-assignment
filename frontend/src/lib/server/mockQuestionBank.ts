import type { ExamPaperContent, ExamQuestion } from "@/types/examPaper";
import type { StoredAssignment } from "./store";

type Difficulty = "easy" | "medium" | "hard";

interface QuestionTemplate {
  type: string;
  difficulty: Difficulty;
  text: string;
}

const SUBJECT_BANKS: Record<string, QuestionTemplate[]> = {
  social: [
    { type: "mcq", difficulty: "easy", text: "Which organ of the United Nations is responsible for maintaining international peace and security?\na) General Assembly\nb) Security Council\nc) International Court of Justice\nd) Secretariat" },
    { type: "mcq", difficulty: "medium", text: "The French Revolution began in which year?\na) 1776\nb) 1789\nc) 1815\nd) 1848" },
    { type: "short_answer", difficulty: "easy", text: "Define the term 'democracy' and name one feature of a democratic government." },
    { type: "short_answer", difficulty: "medium", text: "Explain the difference between direct and representative democracy with one example each." },
    { type: "long_answer", difficulty: "hard", text: "Discuss the main causes of the French Revolution and its impact on modern political thought." },
    { type: "long_answer", difficulty: "medium", text: "Describe the role of the Indian Constitution in protecting fundamental rights. Give at least three examples." },
    { type: "true_false", difficulty: "easy", text: "Statement: The Indus Valley Civilization was primarily located in present-day Pakistan and northwest India. (True / False — justify briefly.)" },
    { type: "true_false", difficulty: "medium", text: "Statement: Globalization has only positive effects on developing economies. (True / False — explain your answer.)" },
    { type: "fill_blank", difficulty: "easy", text: "The Indian National Congress was founded in the year ______." },
    { type: "fill_blank", difficulty: "medium", text: "The process by which citizens choose their representatives through voting is called ______." },
    { type: "mcq", difficulty: "hard", text: "Which economic system is characterized by private ownership of resources and profit motive?\na) Socialism\nb) Capitalism\nc) Mixed economy\nd) Barter system" },
    { type: "short_answer", difficulty: "hard", text: "What is secularism? Why is it important in a diverse country like India?" },
  ],
  physics: [
    { type: "mcq", difficulty: "easy", text: "The SI unit of force is:\na) Joule\nb) Newton\nc) Watt\nd) Pascal" },
    { type: "mcq", difficulty: "medium", text: "According to Newton's Second Law, force equals:\na) mass × velocity\nb) mass × acceleration\nc) weight × gravity\nd) momentum × time" },
    { type: "short_answer", difficulty: "easy", text: "State Newton's First Law of Motion with a real-life example." },
    { type: "short_answer", difficulty: "medium", text: "Differentiate between speed and velocity." },
    { type: "long_answer", difficulty: "hard", text: "Derive the equations of motion for uniformly accelerated motion and solve one numerical problem using them." },
    { type: "true_false", difficulty: "easy", text: "Statement: Light travels faster in vacuum than in water. (True / False)" },
    { type: "fill_blank", difficulty: "easy", text: "The rate of change of velocity with respect to time is called ______." },
    { type: "mcq", difficulty: "hard", text: "Which phenomenon explains the bending of light when it passes from air to glass?\na) Reflection\nb) Refraction\nc) Diffraction\nd) Polarization" },
  ],
  math: [
    { type: "mcq", difficulty: "easy", text: "The value of 15% of 200 is:\na) 20\nb) 25\nc) 30\nd) 35" },
    { type: "short_answer", difficulty: "medium", text: "Find the HCF of 48 and 72 using the prime factorization method." },
    { type: "long_answer", difficulty: "hard", text: "A train travels 360 km in 4 hours. Find its average speed. If it increases speed by 10 km/h, how long will the same journey take?" },
    { type: "fill_blank", difficulty: "easy", text: "The sum of angles in a triangle is ______ degrees." },
    { type: "true_false", difficulty: "easy", text: "Statement: Every square is a rectangle. (True / False — explain.)" },
    { type: "mcq", difficulty: "medium", text: "If x + 5 = 12, then x equals:\na) 5\nb) 6\nc) 7\nd) 8" },
  ],
  english: [
    { type: "mcq", difficulty: "easy", text: "Which part of speech describes a noun?\na) Verb\nb) Adjective\nc) Adverb\nd) Preposition" },
    { type: "short_answer", difficulty: "medium", text: "Identify the figure of speech in: 'The wind whispered through the trees.' Explain your answer." },
    { type: "long_answer", difficulty: "hard", text: "Write a paragraph (120–150 words) on the importance of reading books in the digital age." },
    { type: "fill_blank", difficulty: "easy", text: "The past tense of 'write' is ______." },
    { type: "true_false", difficulty: "medium", text: "Statement: A simile compares two things using 'like' or 'as'. (True / False)" },
  ],
  general: [
    { type: "mcq", difficulty: "easy", text: "Which planet is known as the Red Planet?\na) Venus\nb) Mars\nc) Jupiter\nd) Saturn" },
    { type: "short_answer", difficulty: "medium", text: "Explain the water cycle and name its three main stages." },
    { type: "long_answer", difficulty: "hard", text: "Discuss the importance of environmental conservation and suggest three practical steps students can take." },
    { type: "true_false", difficulty: "easy", text: "Statement: Photosynthesis occurs only during the day. (True / False — explain briefly.)" },
    { type: "fill_blank", difficulty: "easy", text: "The chemical formula of water is ______." },
    { type: "mcq", difficulty: "medium", text: "Who wrote 'Romeo and Juliet'?\na) Charles Dickens\nb) William Shakespeare\nc) Jane Austen\nd) Mark Twain" },
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

  const pool = bank.filter((q) => types.includes(q.type));
  const source = pool.length > 0 ? pool : bank;

  const questions: ExamQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const template = source[i % source.length];
    questions.push({
      question: template.text,
      difficulty: template.difficulty,
      marks: marksList[i],
      type: template.type,
    });
  }

  const sectionsByType = types.length > 1;
  if (!sectionsByType) {
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

  const sections = types.map((type, idx) => {
    const sectionQuestions = questions.filter((q) => q.type === type);
    const assigned =
      sectionQuestions.length > 0
        ? sectionQuestions
        : questions.slice(
            Math.floor((idx * questions.length) / types.length),
            Math.floor(((idx + 1) * questions.length) / types.length)
          );

    return {
      title: `Section ${String.fromCharCode(65 + idx)}`,
      instruction: `${TYPE_LABELS[type] || type}: Attempt all questions in this section.`,
      questions: assigned.length > 0 ? assigned : [questions[idx % questions.length]],
    };
  }).filter((s) => s.questions.length > 0);

  return { sections: sections.length > 0 ? sections : [{ title: "Section A", instruction: "Attempt all questions.", questions }] };
}
