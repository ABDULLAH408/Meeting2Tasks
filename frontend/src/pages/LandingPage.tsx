import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, ListTodo, History, LineChart, FileText, Sparkles, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="py-20 md:py-28 px-4 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Turn Meeting Notes into <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                Actionable Tasks
              </span> in Seconds
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Meeting2Tasks uses AI to transform messy meeting transcripts into structured summaries, action items, decisions, risks, and follow-up tasks—saving teams time and ensuring nothing important is missed.
            </p>
            <div className="flex justify-center mt-4">
              <Button size="lg" className="rounded-full w-full sm:w-auto shadow-lg hover:shadow-xl transition-all" onClick={() => navigate("/dashboard")}>
                Analyze Your First Meeting <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to extract the maximum value from your meetings.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Bot className="w-6 h-6" />, title: "AI Meeting Summary", desc: "Generate concise summaries from lengthy meeting notes instantly." },
                { icon: <ListTodo className="w-6 h-6" />, title: "Smart Action Items", desc: "Automatically identify tasks, owners, priorities, and due dates." },
                { icon: <History className="w-6 h-6" />, title: "Meeting History", desc: "Access previous meeting analyses anytime without reprocessing." },
                { icon: <LineChart className="w-6 h-6" />, title: "Analytics", desc: "Track tasks, meetings, completion rates, and overall productivity." },
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-16">How It Works</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10"></div>
              {[
                { icon: <FileText className="w-8 h-8" />, title: "1. Paste Notes", desc: "Paste your transcript or meeting minutes." },
                { icon: <Sparkles className="w-8 h-8" />, title: "2. AI Analysis", desc: "AI extracts summaries, decisions, risks, and tasks." },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "3. Review Results", desc: "View organized tasks, owners, and priorities." },
                { icon: <LayoutDashboard className="w-8 h-8" />, title: "4. Stay Organized", desc: "Save meetings to history and revisit them anytime." },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-50 shadow-sm flex items-center justify-center text-blue-600 mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-20 bg-gray-900 text-white px-4 rounded-3xl mx-4 lg:mx-auto max-w-7xl mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Why use Meeting2Tasks?</h2>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 text-left">
              {[
                "Save time after every meeting.",
                "Never miss an action item.",
                "Organize discussions into clear tasks.",
                "Improve accountability across teams.",
                "Reduce manual note-taking effort."
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-lg text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
