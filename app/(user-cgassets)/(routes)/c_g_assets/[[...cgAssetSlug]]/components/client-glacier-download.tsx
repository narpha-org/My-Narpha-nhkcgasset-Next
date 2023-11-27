"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { DownloadCloud, X } from "lucide-react";
// import { apolloClient } from "@/lib/apollo-client";
// import { ApolloQueryResult } from "@apollo/client";
import {
  ApplyDownload, ApplyDownloadGlacier, CgAsset,
} from "@/graphql/generated/graphql";
import { Loader } from "@/components/ui/loader";

import { getAppDLGlaciers } from "@/lib/check-glacier-status";
import { isPastDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GlacierDownloadClientProps {
  applyDownloads: ApplyDownload[];
  cgAsset: CgAsset;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const GlacierDownloadClient: React.FC<GlacierDownloadClientProps> = ({ applyDownloads, cgAsset, setDialogOpen }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {

    (async () => {
      if (isMounted) {
        return;
      }

      if (!applyDownloads) {
        /* 不正パラメータ */
        return null
      }

      setIsMounted(true);
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>;
  }

  if (!applyDownloads) {
    /* 不正パラメータ */
    return null
  }

  const download = (filename, content) => {
    var element = document.createElement("a");
    element.setAttribute("href", content);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const handleDownload = async (e, presigned_url: string, file_name: string) => {
    try {
      const result = await fetch(presigned_url, {
        method: "GET",
        headers: {}
      });
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      download(file_name || cgAsset.asset_name, url);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const appDLGlaciers = getAppDLGlaciers(applyDownloads);

  return (
    <div className="flex flex-col justify-items-center">
      {appDLGlaciers && appDLGlaciers.map((elem: ApplyDownloadGlacier | null) => {
        if (elem) {

          if (isPastDate(elem.expiry_date) || !elem.presigned_url) {
            return <div key={elem.id} className="mx-auto my-2">
              <Button
                variant="ghost"
                className="opacity-50"
                type="button"
                style={{ cursor: "default" }}
              >
                <X className="mr-2 h-4 w-4" /> ダウンロード期限切れ
              </Button>
            </div>
          }

          return <div key={elem.id} className="mx-auto my-2">
            <Button
              className=""
              type="button"
              onClick={(event) => handleDownload(
                event,
                elem.presigned_url as string,
                elem.file_name as string
              )}
            >
              <DownloadCloud className="mr-2 h-4 w-4" /> ダウンロード
            </Button>
          </div>
        }
      })}
    </div>
  );
}

export default GlacierDownloadClient;
