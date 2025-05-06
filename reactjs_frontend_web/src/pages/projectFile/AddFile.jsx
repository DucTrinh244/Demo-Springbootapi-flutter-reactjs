import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  File,
  FileText,
  Folder,
  Info,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const AddFile = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Maximum file size in MB
  const MAX_FILE_SIZE = 50;
  // Supported file types
  const supportedFileTypes = {
    image: ["jpg", "jpeg", "png", "gif", "svg", "webp"],
    document: ["pdf", "doc", "docx", "txt", "rtf"],
    spreadsheet: ["xls", "xlsx", "csv"],
    code: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "json",
      "xml",
      "py",
      "java",
      "php",
      "sql",
    ],
    archive: ["zip", "rar", "7z", "tar", "gz"],
  };

  // Optional file description field
  const [fileDescriptions, setFileDescriptions] = useState({});
  // Optional folder selection
  const [selectedFolder, setSelectedFolder] = useState("Documents");
  const availableFolders = ["Documents", "Images", "Code", "Other"];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    processSelectedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processSelectedFiles(files);
  };

  const processSelectedFiles = (files) => {
    // Filter out any files larger than the max size
    const validFiles = files.filter((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > MAX_FILE_SIZE) {
        toast.error(
          `${file.name} exceeds the maximum file size of ${MAX_FILE_SIZE}MB`
        );
        return false;
      }
      return true;
    });

    // Add files to the selected files list with metadata
    const newSelectedFiles = validFiles.map((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      let fileType = "other";

      // Determine file type based on extension
      Object.entries(supportedFileTypes).forEach(([type, extensions]) => {
        if (extensions.includes(extension)) {
          fileType = type;
        }
      });

      return {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension,
        fileType,
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
    });

    setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);

    // Initialize description for each file
    newSelectedFiles.forEach((file) => {
      setFileDescriptions((prev) => ({
        ...prev,
        [file.id]: "",
      }));
    });
  };

  const removeFile = (fileId) => {
    setSelectedFiles(selectedFiles.filter((file) => file.id !== fileId));

    // Remove description for this file
    const newDescriptions = { ...fileDescriptions };
    delete newDescriptions[fileId];
    setFileDescriptions(newDescriptions);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image":
        return <File className="text-blue-400" />;
      case "document":
        return <FileText className="text-red-400" />;
      case "spreadsheet":
        return <FileText className="text-green-400" />;
      case "code":
        return <FileText className="text-yellow-400" />;
      case "archive":
        return <FileText className="text-purple-400" />;
      default:
        return <FileText className="text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const handleDescriptionChange = (fileId, value) => {
    setFileDescriptions((prev) => ({
      ...prev,
      [fileId]: value,
    }));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    let successCount = 0;

    // Create initial progress for all files
    const initialProgress = {};
    selectedFiles.forEach((file) => {
      initialProgress[file.id] = 0;
    });
    setUploadProgress(initialProgress);

    for (const fileData of selectedFiles) {
      try {
        // Create form data
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("projectId", projectId);
        formData.append("folder", selectedFolder);
        formData.append("description", fileDescriptions[fileData.id] || "");

        // In a real app, you would send this to your API
        // Simulate upload progress
        await simulateFileUpload(fileData.id);

        // In production, you would use something like this:

        await api.post("/project-files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [fileData.id]: percentCompleted,
            }));
          },
        });

        successCount++;
      } catch (error) {
        console.error(`Error uploading file ${fileData.name}:`, error);
        toast.error(`Failed to upload ${fileData.name}`);
      }
    }

    // Show success message
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} files`);
      setUploadSuccess(true);
    }

    setIsUploading(false);
  };

  const simulateFileUpload = async (fileId) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: progress,
          }));
          setTimeout(resolve, 500);
        } else {
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: progress,
          }));
        }
      }, 300);
    });
  };

  const averageProgress = () => {
    if (selectedFiles.length === 0) return 0;

    const sum = Object.values(uploadProgress).reduce(
      (acc, val) => acc + val,
      0
    );
    return Math.floor(sum / selectedFiles.length);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Upload Files" />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        {/* Back button */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
            onClick={() => navigate(`/home/projects/${projectId}/detail`)}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Project
          </button>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Card Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Upload className="mr-2" size={24} />
              Upload Files to Project
            </h1>
            <p className="text-gray-400 mt-1">
              Select files from your device or drag & drop them below
            </p>
          </div>

          {/* Upload Area */}
          {!uploadSuccess && (
            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-900 bg-opacity-10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="mx-auto text-indigo-400 mb-4" size={42} />
                <p className="text-white font-medium mb-2">
                  {dragActive ? "Drop files here" : "Drag & Drop files here"}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  or click to browse files
                </p>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Select Files
                </button>
              </div>

              {/* File type information */}
              <div className="mt-4 text-sm text-gray-400 flex items-start">
                <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1">
                    Supported file types: images (.jpg, .png, .gif), documents
                    (.pdf, .doc, .docx), spreadsheets (.xls, .xlsx, .csv), code
                    files, and archives (.zip, .rar)
                  </p>
                  <p>Maximum file size: {MAX_FILE_SIZE}MB per file</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Success View */}
          {uploadSuccess && (
            <div className="p-6 text-center">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Upload Complete!
              </h2>
              <p className="text-gray-400 mb-6">
                All {selectedFiles.length} files have been successfully uploaded
                to the project.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => {
                    setSelectedFiles([]);
                    setUploadProgress({});
                    setUploadSuccess(false);
                    setFileDescriptions({});
                  }}
                >
                  Upload More Files
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => navigate(`/home/file/${projectId}`)}
                >
                  View Project Files
                </button>
              </div>
            </div>
          )}

          {/* File list */}
          {selectedFiles.length > 0 && !uploadSuccess && (
            <div className="px-6 pb-6">
              <div className="mt-4 mb-4">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Selected Files
                </h2>
                <p className="text-gray-400 text-sm">
                  {selectedFiles.length}{" "}
                  {selectedFiles.length === 1 ? "file" : "files"} selected
                </p>
              </div>

              {/* Folder selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Select Folder
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFolders.map((folder) => (
                    <button
                      key={folder}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition ${
                        selectedFolder === folder
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedFolder(folder)}
                    >
                      <Folder className="mr-1" size={14} />
                      {folder}
                    </button>
                  ))}
                </div>
              </div>

              {/* File cards with progress */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {selectedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getFileIcon(file.fileType)}
                        <div className="ml-2">
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      {!isUploading && (
                        <button
                          className="text-gray-400 hover:text-red-400 transition"
                          onClick={() => removeFile(file.id)}
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    {/* File description input */}
                    {!isUploading && (
                      <input
                        type="text"
                        placeholder="Add a description (optional)"
                        value={fileDescriptions[file.id] || ""}
                        onChange={(e) =>
                          handleDescriptionChange(file.id, e.target.value)
                        }
                        className="w-full mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    )}

                    {/* Progress bar if uploading */}
                    {isUploading && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Uploading...</span>
                          <span className="text-indigo-400">
                            {uploadProgress[file.id]}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total progress during upload */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total Progress</span>
                    <span className="text-white">{averageProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${averageProgress()}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Warning for large uploads */}
              {selectedFiles.length > 5 && !isUploading && (
                <div className="flex items-center mt-4 p-3 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg text-sm">
                  <AlertTriangle
                    className="text-yellow-500 mr-2 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-yellow-200">
                    You're uploading {selectedFiles.length} files. Large uploads
                    may take some time to complete.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                {!isUploading ? (
                  <>
                    <button
                      className="px-4 py-2 text-gray-300 hover:text-white transition"
                      onClick={() => navigate(`/home/projects/${projectId}`)}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={uploadFiles}
                      disabled={selectedFiles.length === 0 || isUploading}
                    >
                      <Upload className="mr-2" size={18} />
                      {selectedFiles.length === 0
                        ? "Select Files to Upload"
                        : `Upload ${selectedFiles.length} Files`}
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center cursor-not-allowed"
                    disabled={true}
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AddFile;
