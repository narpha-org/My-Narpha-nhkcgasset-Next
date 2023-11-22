import { Fragment } from "react";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Download, FileEdit } from "lucide-react";
import Image from 'next/image'

import {
  ApplyDownload,
  CgAsset, CgaViewingRestriction,
} from "@/graphql/generated/graphql";
import { isServerRoleOther, isServerRoleUser } from "@/lib/check-role-server";

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

interface CGAssetDetailClientProps {
  cgAsset: CgAsset;
  cgaViewingRestrictions: CgaViewingRestriction[]
  applyDownloads: ApplyDownload[]
}

const CGAssetDetailClient: React.FC<CGAssetDetailClientProps> = async ({
  cgAsset,
  cgaViewingRestrictions,
  applyDownloads
}) => {

  if (!cgAsset) {
    redirect('/c_g_assets');
  }

  const downloadable = checkGlacierStatus(applyDownloads) === 1;

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
                {downloadable && (
                  <div className="detail__sidedl">
                    <p>ダウンロード</p><GlacierDLDialog applyDownloads={applyDownloads} cgAsset={cgAsset} />
                  </div>
                )}
                {(await isServerRoleUser() || await isServerRoleOther()) && (
                  <div className="detail__sidedl">
                    <ApplyDownloadDialog cgAssetId={cgAsset.id} />
                  </div>
                )}
                {(!await isServerRoleUser() && !await isServerRoleOther()) && (
                  <div className="detail__sidedl">
                    <Link href={`/c_g_assets/${cgAsset.id}/edit`}>
                      <Button>
                        <FileEdit className="mr-2 h-4 w-4" /> 修正
                      </Button>
                    </Link>
                  </div>
                )}
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

export default CGAssetDetailClient