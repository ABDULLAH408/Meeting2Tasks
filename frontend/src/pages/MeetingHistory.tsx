import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMeetings, deleteMeeting } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Loader2, Trash2, Calendar, CheckSquare, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function MeetingHistory() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: meetings, isLoading } = useQuery({ queryKey: ["meetings"], queryFn: fetchMeetings });

  const delMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      toast.success("Meeting deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: () => {
      toast.error("Failed to delete meeting");
    }
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this meeting and all its tasks?")) {
      delMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Meeting History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review past analyzed meetings</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid gap-4">
          {meetings?.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
              No meetings analyzed yet.
            </div>
          )}

          {meetings?.map((meeting: any) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={meeting.MeetingID}>
              <Card 
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate(`/dashboard/${meeting.MeetingID}`)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
                        {meeting.Summary || "Untitled Meeting"}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(meeting.CreatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4" />
                          {meeting.TasksCount} Tasks
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          Sentiment: {meeting.Sentiment}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleDelete(e, meeting.MeetingID)}
                      disabled={delMutation.isPending}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
