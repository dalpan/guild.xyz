import { UseRadioGroupProps } from "@chakra-ui/react"
import { CircleWavyCheck, UserCircleMinus } from "@phosphor-icons/react"
import RadioSelect from "components/common/RadioSelect"

type Props = {
  keepAccessDescription: string
  revokeAccessDescription: string
} & UseRadioGroupProps

const ShouldKeepPlatformAccesses = ({
  keepAccessDescription,
  revokeAccessDescription,
  onChange,
  value,
}: Props) => {
  const options = [
    {
      value: false,
      title: "Keep accesses",
      description: keepAccessDescription,
      icon: CircleWavyCheck,
    },
    {
      value: true,
      title: "Revoke accesses",
      description: revokeAccessDescription,
      icon: UserCircleMinus,
      disabled: "Soon",
    },
  ]

  return (
    <RadioSelect
      options={options}
      colorScheme="DISCORD"
      name={`removePlatformAccess`}
      {...{ onChange, value }}
    />
  )
}

export default ShouldKeepPlatformAccesses
