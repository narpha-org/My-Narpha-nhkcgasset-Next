"use client";

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { Download } from "lucide-react";
import { IsRoleAdmin, IsRoleManager, IsRoleUser } from "@/lib/check-role-client";

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

import { CGAssetPageSlug } from "@/app/(user)/(routes)/c_g_assets/[[...cgAssetSlug]]/components/page-slug";
import CGAssetApplyDownloadClientAdmin from "@/app/(user)/(routes)/c_g_assets/[[...cgAssetSlug]]/components/client-apply-download-admin";
import CGAssetApplyDownloadClientManager from "@/app/(user)/(routes)/c_g_assets/[[...cgAssetSlug]]/components/client-apply-download-manager";
import CGAssetApplyDownloadClientUser from "@/app/(user)/(routes)/c_g_assets/[[...cgAssetSlug]]/components/client-apply-download-user";

const ApplyDownloadDialog = ({
  cgAssetId,
  applyDownloadId,
  action,
  variant
}) => {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  const params = {
    cgAssetSlug: [
      cgAssetId,
      CGAssetPageSlug.ApplyDownload,
      applyDownloadId
    ]
  }

  let child;

  if (IsRoleAdmin(session)) {
    child = <CGAssetApplyDownloadClientAdmin params={params} setDialogOpen={setOpen} />
  }
  if (IsRoleManager(session)) {
    child = <CGAssetApplyDownloadClientManager params={params} setDialogOpen={setOpen} />
  }
  if (IsRoleUser(session)) {
    child = <CGAssetApplyDownloadClientUser params={params} setDialogOpen={setOpen} />
  }

  if (!child) {
    child = <div>Not Valid</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
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

export default ApplyDownloadDialog