import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Z_INDEX } from "../lib/zIndex";

export interface NoticeProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
}

export const InAppNotice: React.FC<NoticeProps> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-emerald-800/80 bg-zinc-900";
      case "error":
        return "border-rose-800/80 bg-zinc-900";
      default:
        return "border-amber-800/80 bg-zinc-900";
    }
  };

  return (
    <div
      style={{ zIndex: Z_INDEX.TOAST }}
      className={`fixed bottom-4 right-4 max-w-sm w-full p-4 rounded-xl border shadow-2xl flex items-start space-x-3 text-xs text-white ${getBorderColor()}`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1 leading-relaxed">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
