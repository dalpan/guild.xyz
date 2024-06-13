import {
  Center,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "next/link"
import { useRouter } from "next/router"
import { CaretDown } from "phosphor-react"
import Star from "static/icons/star.svg"
import { useAccessedGuildPoints } from "../AccessHub/hooks/useAccessedGuildPoints"
import useGuild from "../hooks/useGuild"

const LeaderboardPointsSelector = () => {
  const { urlName } = useGuild()
  const router = useRouter()

  const pointsRewards = useAccessedGuildPoints("ALL")
  if (pointsRewards.length < 2) return null

  const pointsRewardsData = pointsRewards.map((gp) => ({
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    id: gp.id.toString(),
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    name: gp.platformGuildData.name || "points",
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    image: gp.platformGuildData.imageUrl ? (
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      <Img src={gp.platformGuildData.imageUrl} boxSize={5} borderRadius={"full"} />
    ) : (
      <Center boxSize={5}>
        <Star />
      </Center>
    ),
  }))

  const currentPoints = pointsRewardsData.find(
    (points) => points.id === router.query.pointsId
  )

  return (
    <Card borderRadius="xl" flexShrink={0}>
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          size="sm"
          variant="ghost"
          rightIcon={<CaretDown />}
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          leftIcon={currentPoints.image}
        >
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          {currentPoints.name}
        </MenuButton>
        <Portal>
          <MenuList zIndex={9999}>
            {pointsRewardsData.map((points) => (
              <Link
                key={points.id}
                passHref
                href={`/${urlName}/leaderboard/${points.id}`}
              >
                <MenuItem as="a" icon={points.image}>
                  {points.name}
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </Portal>
      </Menu>
    </Card>
  )
}

export default LeaderboardPointsSelector
