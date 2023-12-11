"use client";

import { useSession } from "next-auth/react";

import { SystemNotice } from "@/graphql/generated/graphql";
import { IsRoleAdmin, IsRoleEditor, IsRoleManager, IsRoleOther, IsRoleUser } from "@/lib/check-role-client";
import { Loader } from '@/components/ui/loader';

import NoticeBlockAdmin from "./notice-block-admin";
import NoticeBlockManager from "./notice-block-manager";
import NoticeBlockEditor from "./notice-block-editor";
import NoticeBlockUser from "./notice-block-user";
import NoticeBlockOther from "./notice-block-other";

interface NoticeBlockProps {
  systemNotices: SystemNotice[]
}

const NoticeBlock: React.FC<NoticeBlockProps> = ({
  systemNotices
}) => {
  const { data: session, status } = useSession();

  if (IsRoleAdmin(session)) {
    return <NoticeBlockAdmin
      systemNotices={systemNotices}
    />
  }
  if (IsRoleManager(session)) {
    return <NoticeBlockManager
      systemNotices={systemNotices}
    />
  }
  if (IsRoleEditor(session)) {
    return <NoticeBlockEditor
      systemNotices={systemNotices}
    />
  }
  if (IsRoleUser(session)) {
    return <NoticeBlockUser
      systemNotices={systemNotices}
    />
  }
  if (IsRoleOther(session)) {
    return <NoticeBlockOther
      systemNotices={systemNotices}
    />
  }

  return <NoticeBlockOther
    systemNotices={systemNotices}
  />
}

export default NoticeBlock