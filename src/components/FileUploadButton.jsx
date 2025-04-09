import { useState } from "react";
import axios from "axios";
import { FaPaperclip } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const FileUploadButton = () => {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const [loading, setLoading] = useState(false);
  const { selectedUser } = useSelector((store) => store.user);
  const { currentDeal } = useSelector((store) => store.deal);
  const { messages } = useSelector((store) => store.message);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("📁 Selected file:", file);
    if (!file || !currentDeal?._id){ 
      console.warn("❌ File or currentDeal ID is missing");
      return
    };

    const token = localStorage.getItem("token")
    if (!token) return console.error("No auth token found");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      console.log("⬆️ Uploading to:", `${baseuri}/document/upload/${currentDeal._id}`);
      const res = await axios.post(
        `${baseuri}/document/upload/${currentDeal._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Cloudinary upload success:", res.data);
      const savedDoc = res.data.document;

      const docMessage = {
        content: savedDoc.fileUrl,
        type: "document",
        fileType: savedDoc.fileType,
        dealId: currentDeal._id,
      };
      console.log("📨 Sending document message payload:", docMessage);

      const messageRes = await axios.post(
        `${baseuri}/message/send/${selectedUser?._id}`,
        docMessage,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Message sent successfully:", messageRes?.data);
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
