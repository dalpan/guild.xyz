import ExistingPointsTypeSelect from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { useWatch } from "react-hook-form"
import GuildSelect from "requirements/common/GuildSelect"
import { PlatformType, Requirement } from "types"
import MaxMinAmount from "./MaxMinAmount"

type Props = {
  baseFieldPath: string
  field?: Requirement
}

const PointsRank = ({ baseFieldPath, field }: Props): JSX.Element => {
  const guildId = useWatch({ name: `${baseFieldPath}.data.guildId` })
  const guildPlatformId = useWatch({ name: `${baseFieldPath}.data.guildPlatformId` })

  const { guildPlatforms, isLoading } = useGuild(guildId)

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  return (
    <>
      <GuildSelect baseFieldPath={baseFieldPath} />

      <ExistingPointsTypeSelect
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        existingPointsRewards={existingPointsRewards}
        selectedExistingId={guildPlatformId}
        isLoading={isLoading}
      />

      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      <MaxMinAmount baseFieldPath={baseFieldPath} field={field} label="rank" />
    </>
  )
}

export default PointsRank
