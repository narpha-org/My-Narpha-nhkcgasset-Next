"use client";

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { DownloadCloud } from "lucide-react";
import {
  IsRoleUser,
  IsRoleOther
} from "@/lib/check-role-client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import CGAssetApplyDownloadClientUser from "./client-apply-download-user";
import GlacierDownloadClient from "./client-glacier-download";

const GlacierDLDialog = ({
  applyDownloads,
  cgAsset
}) => {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  let child;

  if (IsRoleUser(session) || IsRoleOther(session)) {
    child = <GlacierDownloadClient
      applyDownloads={applyDownloads}
      cgAsset={cgAsset}
      setDialogOpen={setOpen}
    />
  }

  if (!child) {
    child = <div>Not Valid</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          開始
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl" style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "26.6666666667vw",
        // height: "50vh",
        maxWidth: "26.6666666667vw",
        maxHeight: "100vh",
        overflowY: "auto",
        // zIndex: 1002,
      }}>
        {child}
      </DialogContent>
    </Dialog >
  )
}

export default GlacierDLDialog