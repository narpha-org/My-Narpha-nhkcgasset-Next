import {
  ApplyDownload,
  ApplyDownloadGlacier,
} from "@/graphql/generated/graphql";

export const checkGlacierStatus = (elems: ApplyDownload[]) => {
  if (!elems) {
    return -1;
  }

  const appDLGlaciers = getAppDLGlaciers(elems);

  if (!appDLGlaciers || appDLGlaciers.length === 0) {
    return -1;
  }

  const result = appDLGlaciers.find(
    (glacier) => glacier?.ongoing_request === false
  );

  if (result) {
    return 1;
  }

  return 0;
};

export const getAppDLGlaciers = (elems: ApplyDownload[]) => {
  if (!elems) {
    return null;
  }

  return elems.reduce((sum: ApplyDownloadGlacier[], appDL) => {
    if (appDL.applyDownloadGlaciers && appDL.applyDownloadGlaciers.length) {
      sum = sum.concat(appDL.applyDownloadGlaciers as ApplyDownloadGlacier[]);
    }
    return sum;
  }, []);
};
