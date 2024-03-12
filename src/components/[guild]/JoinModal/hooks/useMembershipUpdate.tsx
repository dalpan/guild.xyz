import type { JoinJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { atom, useAtom } from "jotai"
import useUsersPoints from "platforms/Points/useUsersPoints"
import { useFetcherWithSign } from "utils/fetcher"
import mapAccessJobState from "../utils/mapAccessJobState"
import useActiveMembershipUpdate from "./useActiveMembershipUpdate"

export type JoinData = {
  oauthData: any
}

// syncing useSubmit's isLoading into a global atom
const isGettingJobAtom = atom<boolean>(false)
const currentlyCheckedRoleIdsAtom = atom<number[]>([])

type Props = UseSubmitOptions<JoinJob> & {
  /**
   * We're setting keepPreviousData to true in useJoin, so we can display no access
   * and error states correctly. Would be nice to find a better solution for this
   * (like not parsing NO_ACCESS state and error in mapAccessJobState but storing
   * them separately).
   *
   * - Now when triggering access check after join, it'll start with a finished state
   *   (since we're keeping the progress state from join)
   * - The manual progress.mutate(undefined, { revalidate: false }) doesn't work for
   *   some reason
   */
  keepPreviousData?: boolean
}

const useMembershipUpdate = ({
  onSuccess,
  onError,
  keepPreviousData,
}: Props = {}) => {
  const guild = useGuild()
  const { isAdmin } = useGuildPermission()
  const { mutate: mutateUserPoints } = useUsersPoints()
  const fetcherWithSign = useFetcherWithSign()
  const [isGettingJob, setIsGettingJob] = useAtom(isGettingJobAtom)
  const [currentlyCheckedRoleIds, setCurrentlyCheckedRoleIds] = useAtom(
    currentlyCheckedRoleIdsAtom
  )
  const { captureEvent } = usePostHogContext()
  const posthogOptions = {
    guild: guild.urlName,
  }

  const submit = async (data?): Promise<string> => {
    setIsGettingJob(true)

    const initialPollResult: JoinJob[] = await fetcherWithSign([
      `/v2/actions/join?${new URLSearchParams({
        guildId: `${guild?.id}`,
      }).toString()}`,
      { method: "GET" },
    ]).catch(() => null as JoinJob[])

    const jobAlreadyInProgress = initialPollResult?.find((job) => !job.done)

    if (jobAlreadyInProgress) {
      return jobAlreadyInProgress?.id
    }

    const { jobId } = await fetcherWithSign([
      `/v2/actions/join`,
      { method: "POST", body: { guildId: guild?.id, ...(data ?? {}) } },
    ])
    return jobId
  }

  const { triggerPoll, ...progress } = useActiveMembershipUpdate({
    onSuccess: (res) => {
      if (res?.failed) return onError?.(res.failedErrorMsg)

      if (res?.roleAccesses?.some((role) => !role.access)) {
        // mutate guild in case the user sees more entities due to visibilities
        if (!isAdmin) guild.mutateGuild()
      }
      mutateUserPoints()

      setCurrentlyCheckedRoleIds([])
      onSuccess?.(res)
    },
    onError: (error) => {
      onError?.(error)
      setCurrentlyCheckedRoleIds([])
    },
    keepPreviousData,
  })

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: () => {
      setIsGettingJob(false)
      triggerPoll()
    },
    onError: (error) => {
      setIsGettingJob(false)
      captureEvent(`Guild join error`, { ...posthogOptions, error })
      onError?.(error)
    },
  })

  const isLoading = isGettingJob || progress.isValidating

  return {
    isLoading,
    joinProgress: mapAccessJobState(progress.data, isLoading),
    currentlyCheckedRoleIds,
    triggerMembershipUpdate: (data?) => {
      setCurrentlyCheckedRoleIds(data?.roleIds)
      useSubmitResponse.onSubmit(data)
    },
    reset: () => {
      useSubmitResponse.reset()
      progress.mutate(undefined, { revalidate: false })
    },
  }
}

export default useMembershipUpdate
