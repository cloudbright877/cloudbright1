import toast from "react-hot-toast";

const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied");

};

export default copyText;
