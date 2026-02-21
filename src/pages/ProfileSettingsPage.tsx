import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MySpaceLayout } from "@/components/layout";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import {
  ProfileAvatar,
  AvatarUploadDialog,
  ProfileInfoForm,
  PrivacySettingsForm,
  OposicionSelector,
  BlockedUsersList,
} from "@/components/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { use_my_profile, use_blocked_users } from "@/hooks/use-profile";
import { LoadingState, ErrorState } from "@/components/feedback";
import type { ProfileSettings } from "@/types/profile";

export function ProfileSettingsPage() {
  const { t } = useTranslation('profile');
  const {
    profile,
    is_loading,
    is_error,
    update_profile,
    update_profile_pending,
    update_settings,
    update_settings_pending,
    upload_avatar,
    upload_avatar_pending,
    set_active_oposicion,
    add_oposicion,
    remove_oposicion,
    oposicion_pending,
    available_oposiciones,
    fetch_available_oposiciones,
  } = use_my_profile();

  const {
    blocked_users,
    is_loading: blocked_loading,
    unblock_user,
    unblock_pending,
  } = use_blocked_users();

  const [avatar_dialog_open, set_avatar_dialog_open] = useState(false);

  if (is_loading) {
    return (
      <MySpaceLayout title={t('settings.title')}>
        <LoadingState text={t('settings.loading')} />
      </MySpaceLayout>
    );
  }

  if (is_error || !profile) {
    return (
      <MySpaceLayout title={t('settings.title')}>
        <ErrorState
          description={t('settings.error')}
          on_retry={() => window.location.reload()}
        />
      </MySpaceLayout>
    );
  }

  const handle_setting_change = async (
    key: keyof ProfileSettings,
    value: boolean
  ) => {
    await update_settings({ [key]: value });
  };

  return (
    <MySpaceLayout title={t('settings.title')}>
      <div className="space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('settings.avatar')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProfileAvatar
              name={profile.name}
              avatar={profile.avatar}
              is_own_profile
              on_edit={() => set_avatar_dialog_open(true)}
            />
          </CardContent>
        </Card>

        {/* Profile Info */}
        <ProfileInfoForm
          name={profile.name}
          bio={profile.bio}
          on_submit={async (data) => {
            await update_profile(data);
          }}
          is_loading={update_profile_pending}
        />

        {/* Privacy Settings */}
        <PrivacySettingsForm
          settings={profile.settings}
          on_change={handle_setting_change}
          is_loading={update_settings_pending}
        />

        {/* Oposiciones */}
        <OposicionSelector
          oposiciones={profile.oposiciones}
          active_oposicion={profile.active_oposicion}
          available_oposiciones={available_oposiciones ?? []}
          on_set_active={set_active_oposicion}
          on_add={add_oposicion}
          on_remove={remove_oposicion}
          on_fetch_available={fetch_available_oposiciones}
          is_loading={oposicion_pending}
        />

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('settings.language')}</CardTitle>
            <CardDescription>{t('settings.language_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSelector />
          </CardContent>
        </Card>

        {/* Blocked Users */}
        <BlockedUsersList
          blocked_users={blocked_users}
          on_unblock={unblock_user}
          is_loading={blocked_loading || unblock_pending}
        />

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
