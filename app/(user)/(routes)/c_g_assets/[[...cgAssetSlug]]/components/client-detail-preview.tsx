import { Dispatch, SetStateAction } from "react";

import {
  CgAsset, CgaViewingRestriction,
} from "@/graphql/generated/graphql";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import AssetSpecBlock from './page-detail/asset-spec-block';
import AssetViewingRestrictionBlock from './page-detail/asset-viewing-restriction-block';
import AssetRightsSupplementBlock from './page-detail/asset-rights-supplement-block';
import AssetRevisionHistoryBlock from './page-detail/asset-revision-history-block';
import AssetHeadlineBlock from './page-detail/asset-headline-block';
import AssetsCarouselBlock from './page-detail/assets-carousel-block';
import AssetTagsBlock from './page-detail/asset-tags-block';
import AssetDetailReviewBlock from './page-detail/asset-detail-review-block';

interface CGAssetDetailClientPreviewProps {
  cgAsset: CgAsset;
  cgaViewingRestrictions: CgaViewingRestriction[]
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const CGAssetDetailClientPreview: React.FC<CGAssetDetailClientPreviewProps> = async ({
  cgAsset,
  cgaViewingRestrictions,
  setDialogOpen
}) => {

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="CGアセット詳細" description="" />
      </div>
      <Separator />
      <div className="flex flex-row">
        <div className="basis-3/4">
          <div className="flex flex-col w-full overflow-hidden h-24 px-3 py-2">
            <AssetHeadlineBlock cgAsset={cgAsset} />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-1/2 px-3 py-2">
            <AssetsCarouselBlock cgAsset={cgAsset} />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-64 px-3 py-2">
            <AssetTagsBlock cgAsset={cgAsset} />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-96 px-3 py-2">
            <AssetDetailReviewBlock cgAsset={cgAsset} />
          </div>
        </div>
        <div className="basis-1/4">
          <div className="flex flex-col w-full overflow-hidden h-96 px-3 py-2">
            <AssetSpecBlock cgAsset={cgAsset} />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-32 px-3 py-2">
            <AssetViewingRestrictionBlock
              cgAsset={cgAsset}
              cgaViewingRestrictions={cgaViewingRestrictions}
            />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-48 px-3 py-2">
            <AssetRightsSupplementBlock cgAsset={cgAsset} />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-96 px-3 py-2">
            <AssetRevisionHistoryBlock cgAsset={cgAsset} />
          </div>
        </div >
      </div>
    </>
  )
}

export default CGAssetDetailClientPreview