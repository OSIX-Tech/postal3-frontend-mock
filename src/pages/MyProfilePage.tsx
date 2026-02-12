import { useState } from "react";
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
      <MySpaceLayout title="Mi cuenta">
        <LoadingState text="Cargando perfil..." />
      </MySpaceLayout>
    );
  }

  if (is_error || !profile) {
    return (
      <MySpaceLayout title="Mi cuenta">
        <ErrorState
          description="No se pudo cargar el perfil"
          on_retry={() => window.location.reload()}
        />
      </MySpaceLayout>
    );
  }

  return (
    <MySpaceLayout title="Mi cuenta">
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
              Insignias ({profile.badges.length})
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1">
              Estadísticas
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
