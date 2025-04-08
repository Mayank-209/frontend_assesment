import { useState } from "react";
import axios from "axios";
import { FaPaperclip } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const FileUploadButton = () => {
  const [loading, setLoading] = useState(false);
  const { selectedUser } = useSelector((store) => store.user);
  const { currentDeal } = useSelector((store) => store.deal);
  const { messages } = useSelector((store) => store.message);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentDeal?._id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/v1/document/upload/${currentDeal._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Upload response:", res.data);
      const savedDoc = res.data.document;
      console.log("Saved doc:", savedDoc);
      const docMessage = {
        content: savedDoc.fileUrl,
        type: "document",
        fileType: savedDoc.fileType,
        dealId: currentDeal._id,
      };

      // Send this as a normal message
      const messageRes = await axios.post(
        `http://localhost:5000/api/v1/message/send/${selectedUser?._id}`,
        docMessage,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("testing",messageRes);
      
      dispatch(setMessages([...messages, messageRes.data.newMessage]));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="cursor-pointer mr-2">
      <FaPaperclip className="text-xl text-white" />
      <input
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
        onChange={handleFileChange}
      />
      {loading && <span className="text-xs text-white ml-2">Uploading...</span>}
    </label>
  );
};

export default FileUploadButton;
