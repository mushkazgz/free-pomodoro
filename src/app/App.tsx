import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Timer } from './components/Timer';
import { TimeOptions } from './components/TimeOptions';
import { ProjectExplorer } from './components/ProjectExplorer';
import { AboutModal } from './components/AboutModal';
import { FolderOpen, Sun, Moon, Volume2, VolumeX, Info, Zap, Waves } from 'lucide-react';
import { useSound } from './hooks/useSound';
import { useWhiteNoise } from './hooks/useWhiteNoise';

interface Project {
  id: string;
  name: string;
  pomodorosCompleted: number;
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const { isMuted, toggleMute, playSound, startAlarm, stopAlarm } = useSound();
  const { isPlaying: isNoisePlaying, toggleNoise } = useWhiteNoise();
  const [mounted, setMounted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(25);
  const [baseDuration, setBaseDuration] = useState(25);

  const krishnaQuotes = [
    "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    "Change is the law of the universe. You can be a millionaire or a pauper in an instant.",
    "The soul is neither born, and does it die.",
    "Man is made by his belief. As he believes, so he is.",
    "There is neither this world, nor the world beyond, nor happiness for the one who doubts.",
    "Delusion arises from anger. The mind is bewildered by delusion.",
    "Perform your obligatory duty, because action is indeed better than inaction.",
    "The mind is restless and difficult to restrain, but it is subdued by practice.",
    "Better indeed is knowledge than mechanical practice. Better than knowledge is meditation.",
    "A person can rise through the efforts of his own mind; or draw himself down, in the same manner. Because each person is his own friend or enemy."
  ];

  const getRandomQuote = () => krishnaQuotes[Math.floor(Math.random() * krishnaQuotes.length)];
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());

  useEffect(() => {
    setMounted(true);
  }, []);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Load projects from localStorage or use defaults
  const loadProjects = (): Project[] => {
    const saved = localStorage.getItem('pomodoroProjects');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  };

  const [projects, setProjects] = useState<Project[]>(loadProjects());
  const [currentProject, setCurrentProject] = useState<Project | null>(() => {
    const savedCurrentId = localStorage.getItem('currentProjectId');
    const allProjects = loadProjects();
    if (savedCurrentId) {
      return allProjects.find(p => p.id === savedCurrentId) || null;
    }
    return null;
  });

  // Save projects to localStorage whenever they change
  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('pomodoroProjects', JSON.stringify(newProjects));
  };

  // Save current project to localStorage
  const updateCurrentProject = (project: Project | null) => {
    setCurrentProject(project);
    if (project) {
      localStorage.setItem('currentProjectId', project.id);
    } else {
      localStorage.removeItem('currentProjectId');
    }
  };

  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [pomodorosCompletedSession, setPomodorosCompletedSession] = useState(0);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  useEffect(() => {
    // Update timer when mode changes
    if (mode === 'pomodoro') setSelectedTime(baseDuration);
    else if (mode === 'shortBreak') {
      if (baseDuration === 25) setSelectedTime(5);
      else if (baseDuration === 50) setSelectedTime(10);
      else if (baseDuration === 90) setSelectedTime(20);
      else setSelectedTime(5); // Fallback
    }
    else if (mode === 'longBreak') {
      if (baseDuration === 25) setSelectedTime(15);
      else if (baseDuration === 50) setSelectedTime(25);
      else if (baseDuration === 90) setSelectedTime(30);
      else setSelectedTime(15); // Fallback
    }
  }, [mode, baseDuration]);

  const handleTimeSelect = (minutes: number) => {
    stopAlarm();
    setBaseDuration(minutes);
    setSelectedTime(minutes);
    setMode('pomodoro');
    setIsRunning(false);
    setIsAlarmActive(false);
    setPomodorosCompletedSession(0); // Reset session count on time change? Probably good idea.
  };

  const handleToggleTimer = () => {
    if (isAlarmActive) {
      stopAlarm();
      setIsAlarmActive(false);
      setIsRunning(true); // Start the break/next timer immediately
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    stopAlarm();
    setIsRunning(false);
    setIsAlarmActive(false);
  };

  const handleAddProject = (name: string) => {
    const newProject = {
      id: Date.now().toString(),
      name,
      pomodorosCompleted: 0,
    };
    updateProjects([...projects, newProject]);
  };

  const handleUpdateProject = (id: string, name: string) => {
    updateProjects(projects.map((p) => (p.id === id ? { ...p, name } : p)));
    if (currentProject?.id === id) {
      updateCurrentProject({ ...currentProject, name });
    }
  };

  const handleDeleteProject = (id: string) => {
    updateProjects(projects.filter((p) => p.id !== id));
    if (currentProject?.id === id) {
      updateCurrentProject(projects[0] || null);
    }
  };

  const handleSelectProject = (project: Project) => {
    updateCurrentProject(project);
    setIsExplorerOpen(false);
  };

  const handlePomodoroComplete = () => {
    startAlarm(); // Persistent alarm
    setIsRunning(false);
    setIsAlarmActive(true);
    setCurrentQuote(getRandomQuote());

    if (mode === 'pomodoro') {
      // Completed a pomodoro
      const newCompleted = pomodorosCompletedSession + 1;
      setPomodorosCompletedSession(newCompleted);

      // Update project stats
      if (currentProject) {
        const updatedProjects = projects.map((p) =>
          p.id === currentProject.id
            ? { ...p, pomodorosCompleted: p.pomodorosCompleted + 1 }
            : p
        );
        updateProjects(updatedProjects);
        updateCurrentProject({
          ...currentProject,
          pomodorosCompleted: currentProject.pomodorosCompleted + 1,
        });
      }

      // Determine next break
      if (newCompleted % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      // Completed a break, go back to pomodoro
      setMode('pomodoro');
    }
  };

  const handleIncrementPomodoro = (id: string) => {
    const updatedProjects = projects.map((p) =>
      p.id === id
        ? { ...p, pomodorosCompleted: p.pomodorosCompleted + 1 }
        : p
    );
    updateProjects(updatedProjects);

    // Update current project if it's the one being incremented
    if (currentProject?.id === id) {
      updateCurrentProject({
        ...currentProject,
        pomodorosCompleted: currentProject.pomodorosCompleted + 1,
      });
    }
  };

  return (
    <div className={`h-screen overflow-hidden flex flex-col items-center justify-center p-0 md:p-4 transition-all duration-700 ${theme === 'dark'
      ? isRunning
        ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1f1f1f] animate-breathing-bg'
        : 'bg-gradient-to-br from-[#2C2C2C] via-[#3D3D3D] to-[#2C2C2C]'
      : isRunning
        ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1f1f1f] animate-breathing-bg'
        : 'bg-gradient-to-br from-[#FFF8E7] via-[#F5DEB3] to-[#DEB887]'
      }`}>
      <div className="w-full max-w-lg md:max-w-2xl landscape:max-w-5xl flex flex-col h-full md:max-h-[95vh] justify-center">
        {/* Main Card */}
        <div className={`backdrop-blur-sm rounded-none md:rounded-3xl shadow-none md:shadow-2xl p-6 md:p-12 landscape:p-2 transition-all duration-700 flex flex-col justify-between h-full md:h-auto ${theme === 'dark'
          ? isRunning
            ? 'bg-gradient-to-br from-[#1F1F1F]/95 to-[#121212]/95 md:border border-white/5' // Dark + Running (Deper)
            : 'bg-gradient-to-br from-[#2D2D2D]/95 to-[#242424]/95 md:border border-white/5' // Dark + Stopped (Relaxed)
          : isRunning
            ? 'bg-gradient-to-br from-[#2a2a2a]/95 to-[#1a1a1a]/95' // Light + Running (Focus)
            : 'bg-gradient-to-br from-[#FFF8E7]/95 to-[#F5E6D3]/95' // Light + Stopped (Cozy)
          }`}>
          {/* Header with Project Explorer Button */}
          <div className="flex justify-between items-center mb-4 md:mb-8 landscape:mb-1 shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => {
                  stopAlarm();
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
                className={`p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-700 ${theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : isRunning ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
                  }`}
                title="Toggle Theme"
              >
                {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
              </button>
              <button
                onClick={() => {
                  stopAlarm();
                  toggleMute();
                  if (isNoisePlaying) {
                    toggleNoise();
                  }
                }}
                className={`p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-700 ${theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : isRunning ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
                  }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  toggleNoise();
                }}
                className={`p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-700 ${theme === 'dark'
                  ? isNoisePlaying ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-white/10 hover:bg-white/20 text-white'
                  : isRunning
                    ? isNoisePlaying ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-white/10 hover:bg-white/20 text-white'
                    : isNoisePlaying ? 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30' : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
                  }`}
                title={isNoisePlaying ? "Stop Noise" : "Play Brown Noise"}
              >
                <Waves className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  stopAlarm();
                  setIsAboutOpen(true);
                }}
                className={`p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-700 ${theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : isRunning ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
                  }`}
                title="About FreePomodoro"
              >
                <Info className="w-5 h-5" />
              </button>
              {/* <button
                onClick={() => {
                  stopAlarm();
                  setSelectedTime(0.05); // 3 seconds
                  setIsRunning(false);
                  setIsAlarmActive(false);
                  setTimeout(() => setIsRunning(true), 100);
                }}
                className={`p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-700 ${theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : isRunning ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
                  }`}
                title="Test 3s Timer"
              >
                <Zap className="w-5 h-5" />
              </button> */}
            </div>

            <div className="flex-1" />

            <button
              onClick={() => {
                stopAlarm();
                setIsExplorerOpen(true);
              }}
              className={`p-3 md:px-6 md:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-700 flex items-center gap-2 ${theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : isRunning ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-[#5D4037]'
                }`}
              title="Projects"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="hidden md:inline">Projects</span>
            </button>
          </div>

          <div className="flex flex-col landscape:flex-row landscape:items-center landscape:justify-evenly w-full flex-1 min-h-0">
            <div className="flex justify-center items-center mb-8 landscape:mb-0 flex-1">
              <Timer
                duration={selectedTime}
                isRunning={isRunning}
                onToggle={handleToggleTimer}
                onReset={handleResetTimer}
                onComplete={handlePomodoroComplete}
                mode={mode}
                isAlarmActive={isAlarmActive}
              />
            </div>

            <div className="flex flex-col gap-6 landscape:gap-2 shrink-0 landscape:w-1/3 items-center">
              {/* Time Options */}
              <div className="flex justify-center w-full">
                <TimeOptions selectedTime={selectedTime} onSelectTime={handleTimeSelect} isRunning={isRunning} />
              </div>

              {/* Current Project Name */}
              {projects.length > 0 && (
                <div className="text-center w-full">
                  <div className={`inline-block px-6 py-3 rounded-full shadow-md transition-all duration-700 ${theme === 'dark'
                    ? 'bg-white/10 text-gray-300'
                    : isRunning ? 'bg-white/10 text-gray-300' : 'bg-white/60'
                    }`}>
                    <span className={`transition-colors duration-700 ${theme === 'dark' ? 'text-gray-400' : isRunning ? 'text-gray-400' : 'text-[#8D6E63]'
                      }`}>Current Project: </span>
                    <span
                      onClick={() => {
                        stopAlarm();
                        setIsExplorerOpen(true);
                      }}
                      className={`transition-colors duration-700 cursor-pointer hover:opacity-70 ${theme === 'dark' ? 'text-white' : isRunning ? 'text-white' : 'text-[#5D4037]'
                        }`}
                    >
                      {currentProject?.name || 'Select a project'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cozy Quote - Hidden on mobile to prevent scroll */}
        <div className={`hidden md:block text-center mt-6 opacity-70 transition-colors duration-700 max-w-lg mx-auto shrink-0 ${theme === 'dark' ? 'text-gray-400' : isRunning ? 'text-gray-400' : 'text-[#8D6E63]'
          }`}>
          <p className="italic">"{currentQuote}"</p>
        </div>
      </div>

      {/* Project Explorer Modal */}
      <ProjectExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        projects={projects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onIncrementPomodoro={handleIncrementPomodoro}
        onImportProjects={updateProjects}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        isDark={theme === 'dark'}
      />
    </div>
  );
}