"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
  btnCancelVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  btnDoVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  btnDoText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "実行してもよろしいですか？",
  description = "この操作は取り消せません。",
  btnCancelVariant = "outline",
  btnDoVariant = "destructive",
  btnDoText = "実行"
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={btnCancelVariant} onClick={onClose}>
          キャンセル
        </Button>
        <Button disabled={loading} variant={btnDoVariant} onClick={onConfirm}>{btnDoText}</Button>
      </div>
    </Modal>
  );
};
