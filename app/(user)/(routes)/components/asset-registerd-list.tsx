"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAsset,
  DeleteCgAssetDocument,
} from "@/graphql/generated/graphql";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"

interface AssetRegisterdListProps {
  cgAssets: CgAsset[]
}

const AssetRegisterdList: React.FC<AssetRegisterdListProps> = ({
  cgAssets,
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteCgAssetId, setDeleteCgAssetId] = useState('');

  useEffect(() => {
    setLoading(false)
  }, [])

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        DeleteCgAsset: CgAsset;
      }> = await apolloClient
        .mutate({
          mutation: DeleteCgAssetDocument,
          variables: {
            id: deleteCgAssetId,
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

      router.refresh();
      router.push(`/c_g_assets`);
      toast.success('CGアセットが削除されました。');
    } catch (error: any) {
      toast.error('CGアセットの削除に失敗しました。');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <Table>
        <TableCaption>登録一覧</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Asset ID</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cgAssets && cgAssets.map((elem: CgAsset | null) => {

            if (elem) {

              return <TableRow key={elem.id}>
                <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                <TableCell>{elem.asset_id}</TableCell>
                <TableCell>{elem.asset_name}</TableCell>
                <TableCell className="flex items-center justify-between">
                  <Button
                    variant="default"
                    disabled={loading}
                    className="ml-auto"
                    type="button"
                    onClick={() => router.push(`/c_g_assets/${elem.id}/edit`)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={loading}
                    className="ml-auto"
                    type="button"
                    onClick={() => {
                      setDeleteCgAssetId(elem.id);
                      setOpen(true);
                    }}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            }

          })}
        </TableBody>
      </Table>
    </>
  )
}

export default AssetRegisterdList