import { Fragment } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CgAsset,
} from "@/graphql/generated/graphql";
import AssetDetailReviewList from "./asset-detail-review-list";
import { AssetDetailReviewForm } from "./asset-detail-review-form";

interface AssetDetailReviewBlockProps {
  cgAsset: CgAsset;
}

const AssetDetailReviewBlock: React.FC<AssetDetailReviewBlockProps> = ({
  cgAsset
}) => {
  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        アセット詳細説明
      </div>
      <Tabs defaultValue="asset_detail" className="flex flex-col w-full basis-2/3">
        <TabsList>
          <TabsTrigger value="asset_detail">アセット詳細説明</TabsTrigger>
          <TabsTrigger value="review_list">コメント・レビュー一覧</TabsTrigger>
          <TabsTrigger value="review_form">コメント・レビューを書く</TabsTrigger>
        </TabsList>
        <TabsContent value="asset_detail" className="flex-grow h-72 overflow-y-auto">
          {cgAsset.asset_detail.split("\n").map((item, index) => {
            return (
              <Fragment key={index}>{item}<br /></Fragment>
            );
          })}
        </TabsContent>
        <TabsContent value="review_list" className="flex-grow h-72 overflow-y-auto">
          <AssetDetailReviewList cgAsset={cgAsset} />
        </TabsContent>
        <TabsContent value="review_form" className="flex-grow h-72 overflow-y-auto">
          <AssetDetailReviewForm cgAsset={cgAsset} />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetDetailReviewBlock