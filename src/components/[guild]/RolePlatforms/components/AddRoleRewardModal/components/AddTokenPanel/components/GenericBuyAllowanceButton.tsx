import { Collapse, Icon, Tooltip } from "@chakra-ui/react"
import { Chain } from "@guildxyz/types"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import Button from "components/common/Button"
import useTokenData from "hooks/useTokenData"
import { Question, Warning } from "phosphor-react"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"

type Props = {
  chain: Chain
  token: `0x${string}`
  amount: bigint
  contract: `0x${string}`
}

const GenericBuyAllowanceButton = ({ chain, token, amount, contract }: Props) => {
  const {
    data: { symbol: tokenSymbol, name: tokenName },
  } = useTokenData(chain, token)

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    allowSpendingTokens,
  } = useAllowance(token, contract)

  const tokenIsNative = token === NULL_ADDRESS

  return (
    <Collapse in={!allowance && !tokenIsNative}>
      <Button
        width="full"
        size="lg"
        onClick={allowSpendingTokens}
        colorScheme={allowanceError ? "red" : "blue"}
        isLoading={isAllowanceLoading || isAllowing}
        loadingText={
          isAllowanceLoading
            ? "Checking allowance"
            : isAllowing
            ? "Allowing"
            : "Check your wallet"
        }
        leftIcon={allowanceError ? <Icon as={Warning} /> : null}
        rightIcon={
          <Tooltip
            label={`You have to give the Guild smart contracts permission to use your ${tokenName}. You only have to do this once per token.`}
          >
            <Icon as={Question} />
          </Tooltip>
        }
      >
        {allowanceError
          ? "Couldn't fetch allowance"
          : `Allow Guild to use your ${tokenSymbol}`}
      </Button>
    </Collapse>
  )
}

export default GenericBuyAllowanceButton
