"use client";

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { Download } from "lucide-react";
import { Plus } from "lucide-react";

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

import { AssetDetailReviewForm } from "./asset-detail-review-form";

const AssetDetailReviewDialog = ({
  cgAsset,
  isClosed,
}) => {
  const [open, setOpen] = useState(false);

  let child = <AssetDetailReviewForm cgAsset={cgAsset} setDialogOpen={setOpen} />

  if (!child) {
    child = <div>Not Valid</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="detail__closebtn" style={isClosed ? { display: 'none' } : {}}>Add <Plus className="h-4 w-4" /></button>
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

export default AssetDetailReviewDialog