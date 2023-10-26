"use client";

import { Fragment } from "react";
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CgAsset,
  CgAssetReview
} from "@/graphql/generated/graphql";

interface AssetDetailReviewListProps {
  cgAsset: CgAsset;
}

const AssetDetailReviewList: React.FC<AssetDetailReviewListProps> = ({
  cgAsset
}) => {
  return (
    <Table>
      <TableCaption>コメント・レビュー一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>コメント・レビュー</TableHead>
          <TableHead>レビューユーザ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cgAsset.reviews?.map((elem: CgAssetReview | null) => {

          if (elem) {
            return <TableRow key={elem.id}>
              <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd HH:mm")}</TableCell>
              <TableCell>{elem.review.split("\n").map((item, index) => {
                return (
                  <Fragment key={index}>{item}<br /></Fragment>
                );
              })}</TableCell>
              <TableCell>{elem.reviewedUser?.name}</TableCell>
            </TableRow>
          }

        })}
      </TableBody>
    </Table>
  )
}

export default AssetDetailReviewList