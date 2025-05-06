import { ChevronDown, Globe, ListChecks } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SubtasksSection = ({
  task,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
}) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(null);

  // Common language options
  const languageOptions = [
    { code: "en", name: "English" },
    { code: "vi", name: "Vietnamese" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
  ];

  const toggleLanguageMenu = (subtaskId) => {
    setLanguageMenuOpen(languageMenuOpen === subtaskId ? null : subtaskId);
  };

  const handleLanguageSelect = (subtaskId, languageCode) => {
    onUpdateSubtask(subtaskId, { language: languageCode });
    setLanguageMenuOpen(null);
  };

  const getLanguageName = (code) => {
    const language = languageOptions.find((lang) => lang.code === code);
    return language ? language.name : "Not set";
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <ListChecks className="mr-2" size={20} />
          Subtasks
        </h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={onAddSubtask}
        >
          Add Subtask
        </button>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="space-y-3">
          {task.subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex items-center justify-between bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={subtask.status === "completed"}
                  onChange={() =>
                    onUpdateSubtask(subtask.id, {
                      status:
                        subtask.status === "completed"
                          ? "in-progress"
                          : "completed",
                    })
                  }
                  className="mr-3 w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/subtask/${encodeURIComponent(subtask.id)}`}
                      className={`text-white hover:underline ${
                        subtask.status === "completed"
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
                      {subtask.subtaskName}
                    </Link>
                    <div className="relative">
                      <button
                        className="flex items-center text-gray-300 hover:text-white px-2 py-1 rounded border border-gray-600 text-sm"
                        onClick={() => toggleLanguageMenu(subtask.id)}
                      >
                        <Globe size={16} className="mr-1" />
                        <span className="mr-1">
                          {subtask.language
                            ? getLanguageName(subtask.language)
                            : "Set Language"}
                        </span>
                        <ChevronDown size={14} />
                      </button>
                      {languageMenuOpen === subtask.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-10">
                          <ul className="py-1">
                            {languageOptions.map((language) => (
                              <li key={language.code}>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                                  onClick={() =>
                                    handleLanguageSelect(
                                      subtask.id,
                                      language.code
                                    )
                                  }
                                >
                                  {language.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    <p>{subtask.description || "No description"}</p>
                    <div className="flex justify-between mt-1">
                      <p>
                        Start:{" "}
                        {subtask.startDate
                          ? new Date(subtask.startDate).toLocaleDateString()
                          : "N/A"}
                        {" | "}
                        End:{" "}
                        {subtask.endDate
                          ? new Date(subtask.endDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      {subtask.language && (
                        <p className="text-blue-300 flex items-center">
                          <Globe size={14} className="mr-1" />
                          {getLanguageName(subtask.language)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => onEditSubtask(subtask.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => onDeleteSubtask(subtask.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubtasksSection;
