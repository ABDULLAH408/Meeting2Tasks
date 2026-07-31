import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeMeeting, fetchMeetingById, fetchTasks, updateTask, deleteTask } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Loader2, Check, Trash2, ArrowLeft, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const queryClient = useQueryClient();
  
  const [transcript, setTranscript] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "summary">("tasks");

  // Fetch meeting details if meetingId exists in URL
  const { data: meeting, isLoading: isLoadingMeeting } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => fetchMeetingById(meetingId!),
    enabled: !!meetingId,
  });

  // Fetch tasks for the specific meeting
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks", meetingId],
    queryFn: () => fetchTasks(meetingId),
    enabled: !!meetingId,
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeMeeting,
    onSuccess: (data) => {
      toast.success("Meeting analyzed and saved to history.");
      setTranscript("");
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      // Redirect to the newly created meeting view
      navigate(`/dashboard/${data.meetingId}`);
    },
    onError: () => {
      toast.error("Failed to analyze meeting. Please try again.");
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", meetingId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", meetingId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const handleAnalyze = () => {
    if (!transcript.trim()) return;
    analyzeMutation.mutate(transcript);
  };

  // View: NEW MEETING
  if (!meetingId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Meeting</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Paste a transcript to generate tasks and summary.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your meeting transcript here..."
              className="min-h-[300px]"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={analyzeMutation.isPending}
            />
            <Button 
              className="w-full" 
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending || !transcript.trim()}
            >
              {analyzeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {analyzeMutation.isPending ? "Analyzing meeting..." : "Analyze Transcript"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View: LOADING SPECIFIC MEETING
  if (isLoadingMeeting || isLoadingTasks) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-500">Loading meeting data...</p>
      </div>
    );
  }

  // View: SPECIFIC MEETING LOADED
  if (!meeting) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Meeting not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to New Meeting
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> New Meeting
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
            {meeting.Summary}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Analyzed on {new Date(meeting.CreatedAt).toLocaleString()}
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800 pb-2">
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === "tasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              onClick={() => setActiveTab("tasks")}
            >
              Action Items
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === "summary" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              onClick={() => setActiveTab("summary")}
            >
              Full Summary & Transcript
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "tasks" ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {tasks?.length === 0 && (
                  <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-900 border rounded-xl">
                    No tasks generated for this meeting.
                  </div>
                )}
                {tasks?.map((task: any) => (
                  <Card key={task.TaskID} className={`transition-all ${task.Status === "Completed" ? "opacity-60" : ""}`}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <button
                        onClick={() => updateTaskMutation.mutate({ id: task.TaskID, updates: { Status: task.Status === "Completed" ? "Pending" : "Completed" } })}
                        className={`mt-1 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${task.Status === "Completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 dark:border-gray-600 hover:border-blue-500"}`}
                      >
                        {task.Status === "Completed" && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${task.Status === "Completed" ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>{task.Title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.Description}</p>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">Owner: {task.Owner}</span>
                          <span className={`px-2 py-1 rounded-md ${task.Priority === "High" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                            Priority: {task.Priority}
                          </span>
                          {task.DueDate && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">Due: {task.DueDate}</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => { if(confirm("Delete task?")) deleteTaskMutation.mutate(task.TaskID); }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-semibold text-base">
                    <MessageSquare className="w-5 h-5" /> Summary
                  </div>
                  <p className="leading-relaxed">{meeting.Summary}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Original Transcript</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-sm whitespace-pre-wrap max-h-96 overflow-y-auto font-mono text-gray-600 dark:text-gray-400">
                    {meeting.Transcript}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-gray-500">Sentiment: </span>
                <span className="font-medium text-gray-900 dark:text-white">{meeting.Sentiment}</span>
              </div>
              
              {meeting.Decisions?.length > 0 && (
                <div>
                  <span className="text-gray-500 font-medium mb-1 block">Key Decisions:</span>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {meeting.Decisions.map((d: string, i: number) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
              
              {meeting.Risks?.length > 0 && (
                <div>
                  <span className="text-red-500 font-medium mb-1 block">Identified Risks:</span>
                  <ul className="list-disc pl-5 space-y-1 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">
                    {meeting.Risks.map((d: string, i: number) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
