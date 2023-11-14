"use client";

import { useState } from "react"
import { useSession } from "next-auth/react";
import { IsRoleAdmin, IsRoleManager } from "@/lib/check-role-client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import NoticeClientAdmin from "./notice-client-admin";

const NoticeBlockDialog = ({
  systemNoticeId,
  action,
  variant,
  size
}) => {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  const params = {
    systemNoticeId
  }

  let child;

  if (IsRoleAdmin(session) || IsRoleManager(session)) {
    child = <NoticeClientAdmin
      setDialogOpen={setOpen}
      params={params}
    />
  }

  if (!child) {
    child = <div>Not Valid</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="ml-auto"
          type="button"
        >
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl" style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        maxWidth: "1250px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        {child}
      </DialogContent>
    </Dialog >
  )
}

export default NoticeBlockDialog