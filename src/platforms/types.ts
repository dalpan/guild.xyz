import type { ThemingProps } from "@chakra-ui/react"
import type { RewardProps } from "components/[guild]/RoleCard/components/Reward"
import type { IconProps } from "phosphor-react"
import type {
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react"
import type {
  GuildPlatformWithOptionalId,
  PlatformName,
  Requirement,
  RoleFormType,
} from "types"

export type CardSettingsComponent = () => JSX.Element

export enum PlatformAsRewardRestrictions {
  /**
   * @example
   *   Twitter
   */
  NOT_APPLICABLE,
  /**
   * @example
   *   Telegram
   */
  SINGLE_ROLE,
  /**
   * @example
   *   Discord
   */
  MULTIPLE_ROLES,
}

export type RewardData = {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  imageUrl?: string
  name: string
  colorScheme: ThemingProps["colorScheme"]
  gatedEntity: string
  cardPropsHook?: CardPropsHook
  /**
   * True when the AddRewardPanel just automatically adds the platform without any
   * user input
   */
  autoRewardSetup?: boolean
  cardSettingsComponent?: CardSettingsComponent
  cardMenuComponent?: (props) => JSX.Element
  cardWarningComponent?: (props) => JSX.Element
  cardButton?: (props) => JSX.Element
  AddRewardPanel?: ComponentType<AddRewardPanelProps>
  RewardPreview?: ComponentType<PropsWithChildren<unknown>>
  RoleCardComponent?: ComponentType<RewardProps>
  isPlatform?: boolean
  asRewardRestriction: PlatformAsRewardRestrictions
}

export type Rewards = Readonly<Record<PlatformName, RewardData>>

export type AddRewardPanelProps = {
  onAdd: (
    data: NonNullable<RoleFormType["rolePlatforms"]>[number] & {
      requirements?: Requirement[]
      roleName?: string
    }
  ) => void
  onCancel?: () => void
  skipSettings?: boolean
}

export type CardPropsHook = (guildPlatform: GuildPlatformWithOptionalId) => {
  type: PlatformName
  name: string
  image?: string | JSX.Element
  info?: string | JSX.Element
  link?: string
  shouldHide?: boolean
}
