import { Dispatch, SetStateAction, Fragment } from "react";
import Image from 'next/image'

import {
  CgAsset, CgaViewingRestriction,
} from "@/graphql/generated/graphql";

// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NavHeaderMypage } from '@/components/nav-header-mypage';
import { checkGlacierStatus } from '@/lib/check-glacier-status';

import AssetSpecBlock from './page-detail/asset-spec-block';
import AssetViewingRestrictionBlock from './page-detail/asset-viewing-restriction-block';
import AssetRightsSupplementBlock from './page-detail/asset-rights-supplement-block';
import AssetRevisionHistoryBlock from './page-detail/asset-revision-history-block';
import AssetHeadlineBlock from './page-detail/asset-headline-block';
import AssetCarouselBlock from './page-detail/asset-carousel-block';
import AssetTagsBlock from './page-detail/asset-tags-block';
import AssetDetailDetailBlock from "./page-detail/asset-detail-detail";
import AssetDetailReviewBlock from "./page-detail/asset-detail-review-block";
import ApplyDownloadDialog from "./apply-download-dialog";
import GlacierDLDialog from './glacier-dl-dialog';

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
      <NavHeaderMypage />

      {/* <!-- main --> */}
      <main className="maincon">
        <div className="detail">
          <div className="detail__inner">
            <div className="detail__mainbox">
              <AssetHeadlineBlock cgAsset={cgAsset} />
              <AssetCarouselBlock cgAsset={cgAsset} />
              <AssetDetailDetailBlock cgAsset={cgAsset} />
              <AssetDetailReviewBlock cgAsset={cgAsset} />
              <AssetTagsBlock cgAsset={cgAsset} />
            </div>
            <div className="detail__side">
              <div className="detail__sidebtn">
                <div className="detail__sidedl">
                  <p>ダウンロード</p><button id="dl-btn01" type="button"
                    className="btn">開始</button>
                </div>
                <div className="detail__sidedl">
                  <button id="dl-btn02" type="button" className="btn">編集</button>
                </div>
              </div>
              <div className="detail__sidecon">
                <AssetSpecBlock cgAsset={cgAsset} />
                <AssetViewingRestrictionBlock
                  cgAsset={cgAsset}
                  cgaViewingRestrictions={cgaViewingRestrictions}
                />
                <AssetRightsSupplementBlock cgAsset={cgAsset} />
              </div>
              <div className="detail__sidelog">
                <AssetRevisionHistoryBlock cgAsset={cgAsset} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CGAssetDetailClientPreview