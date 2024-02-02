"use client";

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
// import { Download } from "lucide-react";
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
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { checkGlacierStatus } from "@/lib/check-glacier-status";

import { CGAssetPageSlug } from "./page-slug";
import CGAssetApplyDownloadClientAdmin from "./client-apply-download-admin";
import CGAssetApplyDownloadClientManager from "./client-apply-download-manager";
import CGAssetApplyDownloadClientEditor from "./client-apply-download-editor";
import CGAssetApplyDownloadClientUser from "./client-apply-download-user";
import CGAssetApplyDownloadClientOther from "./client-apply-download-other";

const ApplyDownloadDialog = ({
  cgAssetId,
  applyDownloads,
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

  if (checkGlacierStatus(applyDownloads) === 0) {
    return <Dialog open={open} onOpenChange={setOpen}>
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
        width: "26.6666666667vw",
        // height: "50vh",
        maxWidth: "26.6666666667vw",
        maxHeight: "100vh",
        overflowY: "auto",
        // zIndex: 1002,
      }}>
        <div className="dialog__text">
          <div className="dialog__text-main">
            <p>ダウンロード用データを再構築中です<br />
              再構築には時間を要する可能性がございます</p>
            <p>データを、マイページのダウンロード申請リストの<br />
              「ダウンロード」ボタンから、ダウンロードしてください</p>
          </div>
        </div>
      </DialogContent>
    </Dialog >
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