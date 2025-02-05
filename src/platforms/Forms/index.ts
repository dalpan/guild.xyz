import { PencilSimpleLine } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useFormCardProps from "./useFormCardProps"
import FormCardLinkButton from "./FormCardLinkButton"
import FormCardMenu from "./FormCardMenu"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

export default {
  icon: PencilSimpleLine,
  name: "Form",
  colorScheme: "primary",
  gatedEntity: "",
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  cardPropsHook: useFormCardProps,
  cardButton: FormCardLinkButton,
  cardMenuComponent: FormCardMenu,
  RoleCardComponent: dynamic(() => import("platforms/components/FormReward"), {
    ssr: false,
  }),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/FormPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} as const satisfies RewardData
