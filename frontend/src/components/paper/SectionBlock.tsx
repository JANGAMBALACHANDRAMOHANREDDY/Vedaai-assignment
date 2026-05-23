import type { ExamSection } from "@/types/examPaper";
import { Badge } from "@/components/ui/Badge";

interface SectionBlockProps {
  section: ExamSection;
  sectionIndex: number;
  questionOffset: number;
}

export function SectionBlock({
  section,
  sectionIndex,
  questionOffset,
}: SectionBlockProps) {
  return (
    <section className="mt-8">
      <div className="mb-4 border-b border-slate-200 pb-2">
        <h2 className="font-display text-lg font-bold text-slate-900">
          {section.title}
        </h2>
        <p className="mt-1 text-sm italic text-slate-600">{section.instruction}</p>
      </div>

      <ol className="space-y-6" start={questionOffset + 1}>
        {section.questions.map((q, qi) => (
          <li key={qi} className="flex gap-3">
            <span className="shrink-0 font-semibold text-slate-800">
              Q{questionOffset + qi + 1}.
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-relaxed text-slate-800">{q.question}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge difficulty={q.difficulty}>{q.difficulty}</Badge>
                <span className="text-xs font-medium text-slate-500">
                  [{q.marks} mark{q.marks !== 1 ? "s" : ""}]
                </span>
              </div>
              <div className="mt-4 min-h-[4rem] rounded border border-dashed border-slate-200 bg-slate-50/50" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
