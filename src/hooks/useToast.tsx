import {
  ButtonGroup,
  ButtonProps,
  LinkProps,
  Text,
  ToastId,
  useColorModeValue,
  useToast as chakraUseToast,
  UseToastOptions,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import XLogo from "static/icons/x.svg"
import { useRef } from "react"

const useToast = (toastOptions?: UseToastOptions) =>
  chakraUseToast({
    position: "top-right",
    variant: "toastSubtle",
    isClosable: true,
    duration: 4000,
    ...toastOptions,
  })

export type ActionToastOptions = UseToastOptions & {
  buttonProps: ButtonProps & LinkProps
  secondButtonProps?: ButtonProps & LinkProps
}

const useToastWithButton = () => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const actionButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  return ({
    description,
    buttonProps,
    secondButtonProps,
    ...rest
  }: ActionToastOptions) => {
    const { onClick, ...restButtonProps } = buttonProps
    const { onClick: secondButtonOnClick, ...restSecondButtonProps } =
      secondButtonProps ?? {}

    toastIdRef.current = toast({
      duration: 8000,
      description: (
        <>
          {description && <Text>{description}</Text>}
          <ButtonGroup mt={3} mb="1" size="sm">
            <Button
              bg={actionButtonBackground}
              onClick={() => {
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                onClick?.(null)
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                toast.close(toastIdRef.current)
              }}
              borderRadius="lg"
              {...restButtonProps}
            />
            {secondButtonProps && (
              <Button
                bg={actionButtonBackground}
                onClick={() => {
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  secondButtonOnClick?.(null)
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  toast.close(toastIdRef.current)
                }}
                borderRadius="lg"
                {...restSecondButtonProps}
              />
            )}
          </ButtonGroup>
        </>
      ),
      ...rest,
    })

    return toastIdRef.current
  }
}

type TweetToastOptions = {
  title: string
  tweetText: string
}

const useToastWithTweetButton = () => {
  const toastWithButton = useToastWithButton()

  return ({ title, tweetText }: TweetToastOptions) =>
    toastWithButton({
      status: "success",
      title,
      description: "Let others know as well by sharing it on X",
      buttonProps: {
        leftIcon: <XLogo weight="fill" />,
        children: "Share",
        as: "a",
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          tweetText
        )}`,
        target: "_blank",
      },
    })
}

export default useToast
export { useToastWithButton, useToastWithTweetButton }
