import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MySpaceLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProfileHeader,
  BadgeGrid,
  StatsSection,
  AvatarUploadDialog,
} from "@/components/profile";
import { use_my_profile } from "@/hooks/use-profile";
import { LoadingState, ErrorState } from "@/components/feedback";

export function MyProfilePage() {
  const { t } = useTranslation('profile');
  const {
    profile,
    is_loading,
    is_error,
    upload_avatar,
    upload_avatar_pending,
  } = use_my_profile();
  const [avatar_dialog_open, set_avatar_dialog_open] = useState(false);

  if (is_loading) {
    return (
      <MySpaceLayout title={t('my_account.title')}>
        <LoadingState text={t('my_account.loading')} />
      </MySpaceLayout>
    );
  }

  if (is_error || !profile) {
    return (
      <MySpaceLayout title={t('my_account.title')}>
        <ErrorState
          description={t('my_account.error')}
          on_retry={() => window.location.reload()}
        />
      </MySpaceLayout>
    );
  }

  return (
    <MySpaceLayout title={t('my_account.title')}>
      <div className="space-y-8">
        <ProfileHeader
          name={profile.name}
          avatar={profile.avatar}
          bio={profile.bio}
          oposicion={profile.active_oposicion}
          elo={profile.elo}
          league={profile.league}
          streak_days={profile.streak_days}
          is_own_profile
          on_edit_avatar={() => set_avatar_dialog_open(true)}
        />

        <Tabs defaultValue="badges">
          <TabsList className="w-full">
            <TabsTrigger value="badges" className="flex-1">
              {t('my_account.badges')} ({profile.badges.length})
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1">
              {t('my_account.statistics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-6">
            <BadgeGrid badges={profile.badges} />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <StatsSection stats={profile.stats} />
          </TabsContent>
        </Tabs>

        <AvatarUploadDialog
          open={avatar_dialog_open}
          on_open_change={set_avatar_dialog_open}
          current_avatar={profile.avatar}
          name={profile.name}
          on_upload={async (file) => {
            await upload_avatar(file);
          }}
          is_uploading={upload_avatar_pending}
        />
      </div>
    </MySpaceLayout>
  );
}
