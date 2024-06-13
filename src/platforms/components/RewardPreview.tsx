import {
  Circle,
  HStack,
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Question } from "phosphor-react"
import rewards from "platforms/rewards"
import { PropsWithChildren } from "react"
import { PlatformName } from "types"

type Props = {
  isLoading?: boolean
  type?: PlatformName
  image?: JSX.Element | string
  name?: string
}

const RewardPreview = ({
  isLoading,
  type,
  image,
  name,
  children,
}: PropsWithChildren<Props>) => {
  const circleBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <HStack spacing={4}>
      <SkeletonCircle boxSize={12} isLoaded={!isLoading} flexShrink={0}>
        {image ? (
          typeof image === "string" ? (
            <Img boxSize={12} src={image} alt="Reward image" borderRadius="full" />
          ) : (
            image
          )
        ) : (
          <Circle
            size={12}
            bgColor={circleBg}
            alignItems="center"
            justifyContent="center"
          >
            {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
            <Icon as={rewards[type]?.icon ?? Question} size={6} />
          </Circle>
        )}
      </SkeletonCircle>

      <Stack spacing={0.5} fontFamily="body">
        <Skeleton isLoaded={!isLoading}>
          <Text as="span" fontSize="lg" noOfLines={1}>
            {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
            {name ?? `${rewards[type]?.name ?? "Unknown"} reward`}
          </Text>
        </Skeleton>

        {children}
      </Stack>
    </HStack>
  )
}

export default RewardPreview
