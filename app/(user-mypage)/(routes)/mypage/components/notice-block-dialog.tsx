"use client";

import { useState } from "react"
import { useSession } from "next-auth/react";
import { IsRoleAdmin, IsRoleManager } from "@/lib/check-role-client";

import { Button } from "@/components/ui/button-raw"
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
  id,
  className,
  systemNoticeId,
  action,
}: {
  id: string | undefined;
  className: string;
  systemNoticeId: string | null;
  action: string;
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
          id={id}
          className={className}
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
        // height: "90vh",
        maxWidth: "1250px",
        maxHeight: "90vh",
        overflowY: "auto",
        // zIndex: 1002,
      }}>
        {child}
      </DialogContent>
    </Dialog >
  )
}

export default NoticeBlockDialog