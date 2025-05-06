import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  Download,
  Edit,
  File,
  FilePlus,
  FileText,
  FolderOpen,
  Search,
  Settings,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const ProjectFilesManager = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All Files");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");

  // Define folder structure
  const folders = ["All Files", "Documents", "Images", "Code", "Other"];

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // Fetch project details
        const projectResponse = await api.get(`/projects/${projectId}`);
        setProject(projectResponse.data);

        // Fetch files for this project
        const filesResponse = await api.get(`/project-files/${projectId}`);
        setFiles(filesResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
        navigate(`/home/projects/${projectId}/detail`);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) {
      return <File className="text-blue-400" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="text-red-400" />;
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="text-indigo-400" />;
    } else if (
      fileType.includes("spreadsheet") ||
      fileType.includes("excel") ||
      fileType.includes("xlsx")
    ) {
      return <FileText className="text-green-400" />;
    } else if (fileType.includes("code") || fileType.includes("text")) {
      return <FileText className="text-yellow-400" />;
    } else {
      return <FileText className="text-gray-400" />;
    }
  };

  const getFileSize = (file) => {
    // In a real application, you would get file size from the backend
    // This is a placeholder
    const sizeMap = {
      pdf: 2.4,
      png: 0.8,
      jpg: 1.2,
      sql: 0.3,
      docx: 1.2,
      xlsx: 0.5,
    };

    const extension = file.fileName.split(".").pop().toLowerCase();
    return sizeMap[extension] || 1.0;
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    processFiles(newFiles);
    event.target.value = null; // Reset input
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

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (newFiles) => {
    // Add uploading status to new files
    const filesWithStatus = newFiles.map((file) => ({
      id: `temp-${Date.now()}-${file.name}`,
      fileName: file.name,
      fileType: file.type,
      size: (file.size / (1024 * 1024)).toFixed(2), // Convert to MB
      progress: 0,
      status: "uploading",
      file: file,
      folder: guessFileFolder(file.type),
    }));

    setUploadingFiles([...uploadingFiles, ...filesWithStatus]);

    // Simulate file upload with progress
    filesWithStatus.forEach((fileWithStatus) => {
      simulateFileUpload(fileWithStatus);
    });
  };

  const guessFileFolder = (fileType) => {
    if (fileType.includes("image")) {
      return "Images";
    } else if (
      fileType.includes("pdf") ||
      fileType.includes("doc") ||
      fileType.includes("word")
    ) {
      return "Documents";
    } else if (
      fileType.includes("code") ||
      fileType.includes("text") ||
      fileType.includes("javascript") ||
      fileType.includes("html") ||
      fileType.includes("css")
    ) {
      return "Code";
    } else {
      return "Other";
    }
  };

  const simulateFileUpload = (fileWithStatus) => {
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(intervalId);

        // Mock successful upload after a delay
        setTimeout(() => {
          // Remove from uploading files
          setUploadingFiles((current) =>
            current.filter((item) => item.id !== fileWithStatus.id)
          );

          // Add to completed files - match the ProjectFile model
          const uploadedFile = {
            fileId: `file-${Date.now()}`,
            projectId: projectId,
            fileName: fileWithStatus.fileName,
            folder: fileWithStatus.folder,
            description: "", // Empty description by default
            filePath: `/storage/files/${fileWithStatus.fileName
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            fileType: fileWithStatus.fileType,
            uploadedBy: "current.user@example.com", // Current user's email
            uploadedAt: new Date().toISOString(),
          };

          setFiles((currentFiles) => [...currentFiles, uploadedFile]);

          // Show description modal for the newly uploaded file
          setCurrentFile(uploadedFile);
          setFileDescription("");
          setShowDescriptionModal(true);

          toast.success(`${fileWithStatus.fileName} uploaded successfully`);
        }, 500);
      }

      // Update progress
      setUploadingFiles((current) =>
        current.map((item) =>
          item.id === fileWithStatus.id ? { ...item, progress } : item
        )
      );
    }, 300);
  };

  const saveFileDescription = async () => {
    if (!currentFile) return;

    try {
      // In a real app, you would call your API to update the file
      // await api.put(`/files/${currentFile.fileId}`, { description: fileDescription });

      // Update local state
      setFiles(
        files.map((file) =>
          file.fileId === currentFile.fileId
            ? { ...file, description: fileDescription }
            : file
        )
      );

      toast.success("File description saved successfully");
      setShowDescriptionModal(false);
    } catch (error) {
      console.error("Error saving file description:", error);
      toast.error("Failed to save description");
    }
  };

  const deleteFile = async (fileId) => {
    try {
      // In a real app, you would call your API to delete the file
      // await api.delete(`/files/${fileId}`);

      setFiles(files.filter((file) => file.fileId !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const downloadFile = async (fileId) => {
    try {
      const response = await api.get(`/project-files/download/${fileId}`, {
        responseType: "blob",
      });

      // Tạo URL từ blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Tạo link để tải
      const link = document.createElement("a");
      link.href = url;

      // Lấy tên file từ content-disposition header (nếu có)
      let fileName = `download-${fileId}`;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      } else {
        // fallback tên + extension từ MIME type
        const mimeType = response.data.type;
        const extension = mimeType.split("/")[1] || "bin";
        fileName += `.${extension}`;
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // toast.success(`Downloading ${fileName} to your device.`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
  };

  const openDescriptionModal = (file) => {
    setCurrentFile(file);
    setFileDescription(file.description || "");
    setShowDescriptionModal(true);
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === "All Files" || file.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Project Files" />
        <main className="max-w-5xl mx-auto py-6 px-4 lg:px-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 text-center">
            <X size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Project Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              onClick={() => navigate("/home/projects")}
            >
              Back to Projects
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Project Files" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Back button and actions */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
            onClick={() => navigate(`/home/projects/${projectId}`)}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Project
          </button>

          <div className="flex space-x-3">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center"
              onClick={() => navigate(`/home/file/${projectId}/upload`)}
            >
              <Upload className="mr-2" size={18} />
              Upload Files
            </button>
          </div>
        </motion.div>

        {/* Project Info Banner */}
        <motion.div
          className="mb-6 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-xl font-bold text-white">
                {project.projectName}
              </h1>
              <p className="text-gray-400 text-sm">
                Files and Documents Repository
              </p>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <span className="text-gray-400 text-sm mr-2">
                Project Timeline:
              </span>
              <span className="text-white text-sm flex items-center">
                <Calendar className="mr-1" size={14} />
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          className="mb-6 flex flex-col md:flex-row justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            {folders.map((folder) => (
              <button
                key={folder}
                className={`px-3 py-2 rounded-lg transition text-sm ${
                  selectedFolder === folder
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSelectedFolder(folder)}
              >
                {folder}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folder sidebar */}
          <motion.div
            className="col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Folders</h2>
              <ul className="space-y-2">
                {folders.map((folder) => (
                  <li key={folder}>
                    <button
                      className={`flex items-center w-full px-3 py-2 rounded-lg transition ${
                        selectedFolder === folder
                          ? "bg-indigo-600 bg-opacity-20 text-indigo-400 border border-indigo-600 border-opacity-30"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedFolder(folder)}
                    >
                      <FolderOpen className="mr-2" size={18} />
                      <span>{folder}</span>
                      <span className="ml-auto bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {folder === "All Files"
                          ? files.length
                          : files.filter((file) => file.folder === folder)
                              .length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project information */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Project Info
              </h2>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-gray-400">Manager</p>
                  <p className="text-white font-medium">
                    {project.projectOwnerId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-30">
                    {project.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Timeline</p>
                  <p className="text-white">
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate)}
                  </p>
                </div>
                <button
                  className="flex items-center text-indigo-400 hover:text-indigo-300 transition mt-2"
                  onClick={() => navigate(`/home/projects/${projectId}/detail`)}
                >
                  <Settings className="mr-1" size={14} />
                  View Project Details
                </button>
              </div>
            </div>
          </motion.div>

          {/* Files list */}
          <motion.div
            className="col-span-1 lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FolderOpen className="mr-2" size={20} />
                  {selectedFolder}
                  <span className="ml-2 text-sm text-gray-400">
                    ({filteredFiles.length}{" "}
                    {filteredFiles.length === 1 ? "file" : "files"})
                  </span>
                </h2>
              </div>

              {/* Uploads in progress */}
              {uploadingFiles.length > 0 && (
                <div className="px-6 mb-4">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <Upload className="mr-2" size={16} />
                    Uploads in Progress
                  </h3>
                  <div className="space-y-3">
                    {uploadingFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-gray-700 rounded-lg p-3 border border-gray-600"
                      >
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            {getFileIcon(file.fileType)}
                            <span className="ml-2 text-white text-sm font-medium">
                              {file.fileName}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {file.size} MB
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400">
                            {file.folder}
                          </span>
                          <span className="text-xs text-indigo-400">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files table */}
              <div className="px-6 overflow-x-auto">
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FilePlus
                      className="mx-auto text-gray-500 mb-4"
                      size={48}
                    />
                    <p className="text-gray-400">
                      No files found. Upload files to get started.
                    </p>
                    <button
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center mx-auto"
                      onClick={() => navigate(`/home/file/${projectId}/upload`)}
                    >
                      <Upload className="mr-2" size={16} />
                      Upload Files
                    </button>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Type
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Description
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Size
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Uploaded by
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr
                          key={file.fileId}
                          className="border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {getFileIcon(file.fileType)}
                              <span className="ml-2 text-white font-medium">
                                {file.fileName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {file.fileType.split("/")[1] || file.fileType}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {file.description ? (
                              <span title={file.description}>
                                {file.description.length > 20
                                  ? `${file.description.substring(0, 20)}...`
                                  : file.description}
                              </span>
                            ) : (
                              <span className="text-gray-500 italic">
                                No description
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {getFileSize(file)} MB
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {file.uploadedBy}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {formatDateTime(file.uploadedAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-blue-400 hover:text-blue-300 transition"
                                onClick={() => downloadFile(file.fileId)}
                                title="Download"
                              >
                                <Download size={16} />
                              </button>

                              {file.uploadedBy ===
                                localStorage.getItem("email") && (
                                <button
                                  className="p-1 text-indigo-400 hover:text-indigo-300 transition"
                                  onClick={() => openDescriptionModal(file)}
                                  title="Edit Description"
                                >
                                  <Edit size={16} />
                                </button>
                              )}
                              {file.uploadedBy ===
                                localStorage.getItem("email") && (
                                <button
                                  className="p-1 text-red-400 hover:text-red-300 transition"
                                  onClick={() => deleteFile(file.fileId)}
                                  title="Delete"
                                >
                                  <Trash size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
                {filteredFiles.length > 0 && (
                  <p>
                    Showing {filteredFiles.length} of {files.length} files
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4">
          <motion.div
            className="bg-gray-800 rounded-xl border border-gray-700 max-w-lg w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Upload Files</h3>
              <button
                className="text-gray-400 hover:text-white transition"
                onClick={() => navigate(`/home/file/${projectId}/upload`)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-900 bg-opacity-10"
                    : "border-gray-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto text-indigo-400 mb-4" size={36} />
                <p className="text-white font-medium mb-2">
                  Drag and drop files here
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  or select files from your computer
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition cursor-pointer inline-block"
                >
                  Browse Files
                </label>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-white mb-3">
                  Upload Guidelines
                </h4>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <Check
                      className="text-green-400 mr-2 mt-0.5 flex-shrink-0"
                      size={14}
                    />
                    <span>Maximum file size: 50MB</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-green-400 mr-2 mt-0.5 flex-shrink-0"
                      size={14}
                    />
                    <span>
                      Supported formats: PDF, DOCX, XLSX, PNG, JPG, GIF, CSV,
                      TXT
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-green-400 mr-2 mt-0.5 flex-shrink-0"
                      size={14}
                    />
                    <span>Files will be automatically organized by type</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-700">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition mr-3"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                onClick={() => {
                  setShowUploadModal(false);
                  toast.success("Files uploaded successfully");
                }}
                disabled={uploadingFiles.length === 0}
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* File Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4">
          <motion.div
            className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {currentFile?.fileName}
              </h3>
              <button
                className="text-gray-400 hover:text-white transition"
                onClick={() => setShowDescriptionModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  File Description
                </label>
                <textarea
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Add a description for this file..."
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center text-xs text-gray-400 mb-4">
                <AlertTriangle className="mr-1" size={14} />
                <span>
                  Descriptions help team members understand the file's purpose.
                </span>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-700">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition mr-3"
                onClick={() => setShowDescriptionModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                onClick={saveFileDescription}
              >
                Save Description
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilesManager;
