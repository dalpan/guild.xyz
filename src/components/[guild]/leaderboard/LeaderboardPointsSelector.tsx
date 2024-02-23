import { Center, Img, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { CaretDown } from "@phosphor-icons/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "next/link"
import { useRouter } from "next/router"
import Star from "static/icons/star.svg"
import { useAccessedGuildPoints } from "../AccessHub/hooks/useAccessedGuildPoints"
import useGuild from "../hooks/useGuild"

const LeaderboardPointsSelector = () => {
  const { urlName } = useGuild()
  const router = useRouter()

  const pointsRewards = useAccessedGuildPoints("ALL")
  if (pointsRewards.length < 2) return null

  const pointsRewardsData = pointsRewards.map((gp) => ({
    id: gp.id.toString(),
    name: gp.platformGuildData.name || "points",
    image: gp.platformGuildData.imageUrl ? (
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
          leftIcon={currentPoints.image}
        >
          {currentPoints.name}
        </MenuButton>
        <MenuList>
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
      </Menu>
    </Card>
  )
}

export default LeaderboardPointsSelector
