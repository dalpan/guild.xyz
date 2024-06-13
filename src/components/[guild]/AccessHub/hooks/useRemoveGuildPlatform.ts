import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useRemoveGuildPlatform = (
  guildPlatformId: number,
  { onSuccess, onError }: UseSubmitOptions<any> = {}
) => {
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatformId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: (res) => {
      toast({
        title: "Reward removed!",
        status: "success",
      })

      mutateGuild(
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms:
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            prevGuild.guildPlatforms?.filter(
              (prevGuildPlatform) => prevGuildPlatform.id !== guildPlatformId
            ) ?? [],
          roles:
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            prevGuild.roles?.map((prevRole) => ({
              ...prevRole,
              rolePlatforms:
                prevRole.rolePlatforms?.filter(
                  (prevRolePlatform) =>
                    prevRolePlatform.guildPlatformId !== guildPlatformId
                ) ?? [],
            })) ?? [],
        }),
        { revalidate: false }
      )
      onSuccess?.(res)
    },
    onError: (error) => {
      showErrorToast(error)
      onError?.(error)
    },
  })
}

export default useRemoveGuildPlatform
