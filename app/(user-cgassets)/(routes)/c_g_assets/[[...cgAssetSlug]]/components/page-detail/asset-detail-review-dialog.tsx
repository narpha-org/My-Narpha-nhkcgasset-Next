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

import { Button } from "@/components/ui/button-raw"
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
import { CgAsset } from "@/graphql/generated/graphql";

const AssetDetailReviewDialog = ({
  id,
  className,
  cgAssetReviewId,
  action,
  cgAsset,
  isClosed,
}: {
  id: string | undefined;
  className: string;
  cgAssetReviewId: string | null;
  action: string;
  cgAsset: CgAsset;
  isClosed: boolean;

}) => {
  const [open, setOpen] = useState(false);

  let child = <AssetDetailReviewForm
    cgAssetReviewId={cgAssetReviewId}
    cgAsset={cgAsset}
    setDialogOpen={setOpen}
  />

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
          style={action === 'Add' && isClosed ? { display: 'none' } : {}}
        >
          {action === 'Add' ?
            <>
              Add <Plus className="h-4 w-4" />
            </>
            : <>{action}</>
          }
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

export default AssetDetailReviewDialog