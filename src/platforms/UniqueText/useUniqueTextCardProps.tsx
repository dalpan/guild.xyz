import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { useClaimedReward } from "hooks/useClaimedReward"
import rewards from "platforms/rewards"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

const useUniqueTextCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const { roles } = useGuild()
  const platformGuildData = guildPlatform.platformGuildData

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  const { isAdmin } = useGuildPermission()
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { claimed } = useClaimedReward(rolePlatform?.id)

  return {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    name: platformGuildData.name ?? "Unique secret",
    type: "UNIQUE_TEXT" as PlatformName,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    image: platformGuildData.imageUrl ?? (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={rewards.UNIQUE_TEXT.icon} boxSize={5} color="white" />
      </Circle>
    ),
    info: rolePlatform && <AvailabilityTags rolePlatform={rolePlatform} mt={1} />,
    shouldHide: !isAdmin && claimed,
  }
}

export default useUniqueTextCardProps
