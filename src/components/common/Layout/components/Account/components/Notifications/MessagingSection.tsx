import {
  Divider,
  HStack,
  Icon,
  IconButton,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { XMTPProvider, useCanMessage } from "@xmtp/react-sdk"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareOut, Gear } from "phosphor-react"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import SubscriptionPromptSkeleton from "../MessageSkeleton/SubscriptionPromptSkeleton"
import { SubscriptionPrompt } from "./SubscriptionPrompt"
import NotificationsSection from "./components/NotificationsSection"
import { useWeb3InboxSubscription } from "./components/web3Inbox"
import { useSubscribeToXMTP } from "./hooks/useSubscribeToXMTP"

const Messages = dynamic(() => import("./Messages"))

const MessagingSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    isWeb3InboxLoading,
    subscribeWeb3Inbox,
    web3InboxSubscription,
  } = useWeb3InboxSubscription()
  const { canMessageStatic } = useCanMessage()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()

  const {
    isLoading: isCheckingXMTPAccess,
    onSubmit: checkXMTPAccess,
    response: hasXMTPAccess,
  } = useSubmit(async () => canMessageStatic(address), {
    onError: () => showErrorToast("Error happened during checking XMTP access"),
  })

  useEffect(() => {
    checkXMTPAccess()
  }, [])

  const { subscribeToXMTP, isSubscribing } = useSubscribeToXMTP(checkXMTPAccess)

  return (
    <>
      <NotificationsSection
        title={
          <>
            Messages
            <IconButton
              onClick={onOpen}
              icon={<Icon as={Gear} />}
              aria-label="messagingSettings"
              color={"whiteAlpha.600"}
              variant={"ghost"}
              borderRadius={"full"}
              minWidth={0}
              height={"auto"}
              marginLeft={1}
              marginTop={"-1px"}
            />
          </>
        }
      >
        {isWeb3InboxLoading || isCheckingXMTPAccess ? (
          <SubscriptionPromptSkeleton />
        ) : !web3InboxSubscription && !hasXMTPAccess ? (
          <SubscriptionPrompt onClick={onOpen} />
        ) : (
          <Messages />
        )}
      </NotificationsSection>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="4">Subscribe to messages</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8">
              Guild admins can send broadcast messages to your wallet through{" "}
              <Link href="https://web3inbox.com" colorScheme="blue" isExternal>
                Web3Inbox
                <Icon as={ArrowSquareOut} ml={1} />
              </Link>{" "}
              and{" "}
              <Link href="https://xmtp.com" colorScheme="blue" isExternal>
                XMTP
                <Icon as={ArrowSquareOut} ml={1} />
              </Link>
              . Sign a message to start receiving them!
            </Text>
            <HStack justifyContent={"space-between"} w={"full"} mb={"3"}>
              <Text as="span" fontWeight="semibold">
                Web3Inbox
              </Text>
              <Button
                isDisabled={Boolean(web3InboxSubscription)}
                variant="solid"
                colorScheme="blue"
                onClick={subscribeWeb3Inbox}
                isLoading={
                  isSigningWeb3Inbox ||
                  isRegisteringWeb3Inbox ||
                  isSubscribingWeb3Inbox
                }
                loadingText={
                  isSigningWeb3Inbox ? "Check your wallet" : "Subscribing"
                }
              >
                {Boolean(web3InboxSubscription) ? "Subscribed" : "Sign to subscribe"}
              </Button>
            </HStack>
            <Divider mb={3} />
            <HStack justifyContent={"space-between"} w={"full"} mb={"3"}>
              <Text as="span" fontWeight="semibold">
                XMTP
              </Text>
              <Button
                isDisabled={Boolean(hasXMTPAccess)}
                variant="solid"
                colorScheme="blue"
                onClick={subscribeToXMTP}
                isLoading={isCheckingXMTPAccess || isSubscribing}
                loadingText={
                  isCheckingXMTPAccess || isSubscribing
                    ? "Check your wallet"
                    : "Subscribing"
                }
              >
                {Boolean(hasXMTPAccess) ? "Subscribed" : "Enable identity"}
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default () => (
  <XMTPProvider>
    <MessagingSection />
  </XMTPProvider>
)
