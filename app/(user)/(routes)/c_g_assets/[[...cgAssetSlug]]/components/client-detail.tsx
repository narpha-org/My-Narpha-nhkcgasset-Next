import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Download, FileEdit } from "lucide-react";

import {
  ApplyDownload,
  CgAsset, CgaViewingRestriction,
} from "@/graphql/generated/graphql";
import { isServerRoleOther, isServerRoleUser } from "@/lib/check-role-server";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import AssetSpecBlock from './page-detail/asset-spec-block';
import AssetViewingRestrictionBlock from './page-detail/asset-viewing-restriction-block';
import AssetRightsSupplementBlock from './page-detail/asset-rights-supplement-block';
import AssetRevisionHistoryBlock from './page-detail/asset-revision-history-block';
import AssetHeadlineBlock from './page-detail/asset-headline-block';
import AssetsCarouselBlock from './page-detail/assets-carousel-block';
import AssetTagsBlock from './page-detail/asset-tags-block';
import AssetDetailReviewBlock from './page-detail/asset-detail-review-block';
import ApplyDownloadDialog from "./apply-download-dialog";
import { checkGlacierStatus } from '@/lib/check-glacier-status';
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
      <div className="flex items-center justify-between">
        <Heading title="CGアセット詳細" description="" />
        <div className="flex flex-wrap justify-between">
          {downloadable && (
            <div className="ml-2">
              <GlacierDLDialog applyDownloads={applyDownloads} cgAsset={cgAsset} />
            </div>
          )}
          {(await isServerRoleUser() || await isServerRoleOther()) && (
            <div className="ml-2">
              <ApplyDownloadDialog cgAssetId={cgAsset.id} />
            </div>
          )}
          {(!await isServerRoleUser() && !await isServerRoleOther()) && (
            <div className="ml-2">
              <Link href={`/c_g_assets/${cgAsset.id}/edit`}>
                <Button>
                  <FileEdit className="mr-2 h-4 w-4" /> 修正
                </Button>
              </Link>
            </div>
          )}
        </div>
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

export default CGAssetDetailClient