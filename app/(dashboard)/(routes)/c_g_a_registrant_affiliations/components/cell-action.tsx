"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { apolloClient } from "@/lib/apollo-client";
import {
  DeleteCgaRegistrantAffiliationDocument,
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

import { CGARegistrantAffiliationColumn } from "./columns";

interface CellActionProps {
  data: CGARegistrantAffiliationColumn;
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
      await apolloClient
        .mutate({
          mutation: DeleteCgaRegistrantAffiliationDocument,
          variables: {
            id: data.id,
          },
        })
      toast.success('登録者所属が削除されました。');
      router.refresh();
    } catch (error) {
      toast.error('この登録者所属を使用中のCGアセット情報が存在します。');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('登録者所属のIDがクリップボードにコピーされました。');
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
            onClick={() => router.push(`/c_g_a_registrant_affiliations/${data.id}`)}
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
