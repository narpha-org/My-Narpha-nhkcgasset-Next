"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgaViewingRestriction,
  DeleteCgaViewingRestrictionDocument,
} from "@/graphql/generated/graphql";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";

import { CGAViewingRestrictionColumn } from "./columns";

interface CellActionProps {
  data: CGAViewingRestrictionColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        DeleteCgaViewingRestriction: CgaViewingRestriction;
      }> = await apolloClient
        .mutate({
          mutation: DeleteCgaViewingRestrictionDocument,
          variables: {
            id: data.id,
          },
        })

      // console.log("ret", ret);
      if (
        ret.errors &&
        ret.errors[0] &&
        ret.errors[0].extensions &&
        ret.errors[0].extensions.debugMessage
      ) {
        throw new Error(ret.errors[0].extensions.debugMessage as string)
      } else if (
        ret.errors &&
        ret.errors[0]
      ) {
        throw new Error(ret.errors[0].message as string)
      }

      toast.success('閲覧制限が削除されました。');
      router.refresh();
    } catch (error) {
      toast.error('削除できません。この閲覧制限を使用中のCGアセット情報が存在します。');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('閲覧制限のIDがクリップボードにコピーされました。');
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">レコード操作</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>レコード操作</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/c_g_a_viewing_restrictions/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> 編集
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> 削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
