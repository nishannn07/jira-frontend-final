import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
function KanbanBoard() {
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState({});
  const [updated, setUpdated] = useState(false);
  const [taskBoard, setTaskBoard] = useState({
    todo: [],
    in_progress: [],
    in_review: [],
    done: []
  });

  const pid = sessionStorage.getItem('p_id');
  const handleProjectStatusChange = async (ProjectId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/api/projects/${ProjectId}/edit_status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setUpdated((pre) => !pre)
      toast.success("Status updated!");
    } catch (err) {
      console.error('Status update error:', err.response?.data || err.message);
      if (err.response?.status === 403) {
          toast.error(err.response?.data.message || "Insufficient permissions")
      }
    }
};

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/projects/${pid}/board`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        })
        .catch(err => console.log(err.message))
        ;

        setProject(res.data.project);
        setStats(res.data.stats);
        setTaskBoard(res.data.task_board);
      } catch (err) {
        console.error('Error fetching Kanban board:', err);
      }
    };

    if (pid) fetchBoardData();
  }, [pid, updated]);

  const renderColumn = (status, tasks) => (
    <div className="w-full md:w-1/5 p-2 text-center">
      <div className="bg-gray-100 rounded-lg shadow">
        <div className="bg-gray-800 text-white text-center py-2 rounded-t">{status.replace('_', ' ').toUpperCase()}</div>
        <div className="p-2 space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="p-2 bg-white rounded shadow">
              <h3 className="font-semibold text-black">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-500">Due: {task.due_date || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {project && (
        <>
          <h2 className="text-2xl font-bold mb-4">{project.project_name} - Kanban Board</h2>
          <div className='flex mb-20'>
            <div className='p-3'>Project Status</div>
              <select
                value={project.status}
                onChange={(e) => handleProjectStatusChange(project.id, e.target.value)}
                className="mt-2 bg-gray-700 text-white p-1 rounded border border-gray-500"
                disabled={project.status === 'done'}
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
        </>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {renderColumn('todo', taskBoard.todo)}
        {renderColumn('in_progress', taskBoard.in_progress)}
        {renderColumn('in_review', taskBoard.in_review)}
        {renderColumn('done', taskBoard.done)}
      </div>
    </div>
  );
}

export default KanbanBoard;
