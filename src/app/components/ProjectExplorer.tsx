import { useState } from "react";
import { useTheme } from "next-themes";
import { X, Plus, Edit2, Trash2, Check, Download, Upload } from "lucide-react";

interface Project {
  id: string;
  name: string;
  pomodorosCompleted: number;
}

interface ProjectExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (project: Project) => void;
  onAddProject: (name: string) => void;
  onUpdateProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onIncrementPomodoro: (id: string) => void;
  onImportProjects: (projects: Project[]) => void;
}

export function ProjectExplorer({
  isOpen,
  onClose,
  projects,
  currentProject,
  onSelectProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onIncrementPomodoro,
  onImportProjects,
}: ProjectExplorerProps) {
  const [newProjectName, setNewProjectName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName("");
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (editingName.trim()) {
      onUpdateProject(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pomodoroDataImportMe.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target?.result) {
          try {
            const imported = JSON.parse(e.target.result as string);
            if (Array.isArray(imported)) {
              if (window.confirm("This will overwrite your current projects. Are you sure?")) {
                onImportProjects(imported);
              }
            } else {
              alert("Invalid file format");
            }
          } catch (error) {
            alert("Error parsing JSON");
          }
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-3xl shadow-2xl w-full max-w-md p-8 relative transition-colors duration-300 ${theme === 'dark'
        ? 'bg-[#1a1a1a] border border-white/10'
        : 'bg-gradient-to-br from-[#FFF8E7] to-[#F5E6D3]'
        }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${theme === 'dark'
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
            }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className={`mb-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#5D4037]'}`}>
          Project Explorer
        </h2>

        {/* Project List */}
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 rounded-xl transition-all duration-300 ${currentProject?.id === project.id
                ? "bg-gradient-to-br from-[#D2691E] to-[#A0522D] text-white shadow-lg"
                : theme === 'dark'
                  ? "bg-white/5 text-gray-200 hover:bg-white/10"
                  : "bg-white/70 text-[#5D4037] hover:bg-white hover:shadow-md"
                }`}
            >
              {editingId === project.id ? (
                <div
                  className="flex items-center gap-2"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setEditingId(null);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) =>
                      setEditingName(e.target.value)
                    }
                    className="flex-1 px-3 py-1 rounded-lg bg-white/90 text-[#5D4037] outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleUpdate(project.id);
                      if (e.key === "Escape")
                        setEditingId(null);
                    }}
                  />
                  <button
                    onClick={() => handleUpdate(project.id)}
                    className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex-1 text-left flex items-center gap-3"
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 whitespace-nowrap ${currentProject?.id === project.id
                        ? "bg-white/20"
                        : "bg-[#D2691E]/20"
                        }`}
                    >
                      {project.pomodorosCompleted} 🍅
                    </span>
                    <span>{project.name}</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onIncrementPomodoro(project.id)
                      }
                      className={`w-8 h-8 rounded-lg ${currentProject?.id === project.id
                        ? "bg-white/20 hover:bg-white/30"
                        : theme === 'dark'
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-[#F5E6D3] hover:bg-[#E8D4BD]"
                        } flex items-center justify-center transition-colors`}
                      title="Add pomodoro"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(project.id);
                        setEditingName(project.name);
                      }}
                      className={`w-8 h-8 rounded-lg ${currentProject?.id === project.id
                        ? "bg-white/20 hover:bg-white/30"
                        : theme === 'dark'
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-[#F5E6D3] hover:bg-[#E8D4BD]"
                        } flex items-center justify-center transition-colors`}
                      title="Edit project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Are you sure you want to delete this project?")) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className={`w-8 h-8 rounded-lg ${currentProject?.id === project.id
                        ? "bg-white/20 hover:bg-white/30"
                        : theme === 'dark'
                          ? "bg-red-500/20 hover:bg-red-500/30 text-red-200"
                          : "bg-red-100 hover:bg-red-200 text-red-600"
                        } flex items-center justify-center transition-colors`}
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Project */}
        {isAdding ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) =>
                setNewProjectName(e.target.value)
              }
              placeholder="Project name..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/70 text-[#5D4037] placeholder-[#8D6E63] outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setIsAdding(false);
              }}
            />
            <button
              onClick={handleAdd}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#D2691E] to-[#A0522D] hover:from-[#CD5C5C] hover:to-[#8B4513] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setIsAdding(true)}
              className={`w-full px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-white/70 hover:bg-white text-[#5D4037]'
                }`}
            >
              <Plus className="w-5 h-5" />
              Add New Project
            </button>

            <div className={`flex gap-2 pt-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#5D4037]/10'}`}>
              <button
                onClick={handleExport}
                className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                  : 'bg-[#5D4037]/10 hover:bg-[#5D4037]/20 text-[#5D4037]'
                  }`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                : 'bg-[#5D4037]/10 hover:bg-[#5D4037]/20 text-[#5D4037]'
                }`}>
                <Upload className="w-4 h-4" />
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}