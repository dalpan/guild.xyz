import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import GithubCardMenu from "./GithubCardMenu"
import useGithubCardProps from "./useGithubCardProps"
import { GithubLogo } from "phosphor-react"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

export default {
  icon: GithubLogo,
  imageUrl: "/platforms/github.png",
  name: "GitHub",
  colorScheme: "GITHUB",
  gatedEntity: "repo",
  cardPropsHook: useGithubCardProps,
  cardMenuComponent: GithubCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  isPlatform: true,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/GitHubPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} as const satisfies RewardData
