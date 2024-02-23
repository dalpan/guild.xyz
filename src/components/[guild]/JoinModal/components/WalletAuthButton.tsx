import { Wallet } from "@phosphor-icons/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import shortenHex from "utils/shortenHex"
import ConnectAccount from "./ConnectAccount"

const WalletAuthButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useWeb3ConnectionManager()
  const { address } = useWeb3ConnectionManager()

  return (
    <ConnectAccount
      account={address ? "Wallet" : "wallet"}
      isRequired
      icon={<Wallet />}
      isConnected={address && shortenHex(address, 3)}
      colorScheme="gray"
      onClick={openWalletSelectorModal}
    />
  )
}

export default WalletAuthButton
