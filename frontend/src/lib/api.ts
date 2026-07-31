const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function analyzeMeeting(transcript: string) {
    console.log("[Frontend API] Sending transcript length:", transcript.length);
    const { transcript: t } = JSON.parse(JSON.stringify({ transcript }));
    console.log("[Frontend API] Transcript starts with:", t.substring(0, 30));
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  console.log("[Frontend API] Response status:", res.status);
  const data = await res.json();
  console.log("[Frontend API] Parsed response:", data);
  if (!res.ok) throw new Error("Failed to analyze meeting");
  return data;
}

export async function fetchTasks(meetingId?: string) {
  const url = meetingId ? `${API_BASE}/tasks?meetingId=${meetingId}` : `${API_BASE}/tasks`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function updateTask(id: string, updates: any) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

export async function fetchMeetings() {
  const res = await fetch(`${API_BASE}/meetings`);
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
}

export async function fetchMeetingById(id: string) {
  const res = await fetch(`${API_BASE}/meetings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch meeting");
  return res.json();
}

export async function deleteMeeting(id: string) {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete meeting");
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
