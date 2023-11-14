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
          <DownloadCloud className="mr-2 h-4 w-4" /> ダウンロード
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl" style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        maxWidth: "350px",
        maxHeight: "50vh",
        overflowY: "auto",
      }}>
        {child}
      </DialogContent>
    </Dialog >
  )
}

export default GlacierDLDialog