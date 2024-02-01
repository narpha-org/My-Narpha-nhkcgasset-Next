"use client";

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { Download } from "lucide-react";
import {
  IsRoleAdmin,
  IsRoleManager,
  IsRoleEditor,
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

import { CGAssetPageSlug } from "./page-slug";
import CGAssetApplyDownloadClientAdmin from "./client-apply-download-admin";
import CGAssetApplyDownloadClientManager from "./client-apply-download-manager";
import CGAssetApplyDownloadClientEditor from "./client-apply-download-editor";
import CGAssetApplyDownloadClientUser from "./client-apply-download-user";
import CGAssetApplyDownloadClientOther from "./client-apply-download-other";

const ApplyDownloadDialog = ({
  cgAssetId,
  title
}) => {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  const params = {
    cgAssetSlug: [
      cgAssetId,
      CGAssetPageSlug.ApplyDownload
    ]
  }

  let child;

  if (IsRoleAdmin(session)) {
    child = <CGAssetApplyDownloadClientAdmin params={params} setDialogOpen={setOpen} />
  }
  if (IsRoleManager(session)) {
    child = <CGAssetApplyDownloadClientManager params={params} setDialogOpen={setOpen} />
  }
  if (IsRoleEditor(session)) {
    child = <CGAssetApplyDownloadClientEditor params={params} setDialogOpen={setOpen} />
  }
  if (IsRoleUser(session)) {
    child = <CGAssetApplyDownloadClientUser params={params} setDialogOpen={setOpen} />
  }
  if (IsRoleOther(session)) {
    child = <CGAssetApplyDownloadClientOther params={params} setDialogOpen={setOpen} />
  }

  if (!child) {
    child = <div>Not Valid</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl" style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "95vw",
        // height: "90vh",
        maxWidth: "1250px",
        maxHeight: "95vh",
        overflowY: "auto",
        // zIndex: 1002,
      }}>
        {child}
      </DialogContent>
    </Dialog >
  )
}

export default ApplyDownloadDialog