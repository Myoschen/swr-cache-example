'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'

import { ENDPOINT } from '@/constants/env'
import type { User } from '@/lib/types'

async function fetchUser({ params }: { tag: string[], params: { id: string } }) {
  const resp = await fetch(`${ENDPOINT}/users/${params.id}`)
  return await resp.json() as User
}

export default function Home() {
  const { id } = useParams<{ id: string }>()
  const { data: user, error } = useSWR({ tag: ['#user', `#userId:${id}`], params: { id } }, fetchUser)

  return (
    <main className="flex min-h-screen items-center justify-center py-16">
      {user
        ? (
            <div className="flex w-full max-w-sm flex-col p-2">
              <span className="text-sm">{user.name}</span>
              <span className="text-xs font-light text-muted-foreground">{user.id}</span>
            </div>
          )
        : (
            <p className="w-full max-w-sm text-sm">
              {JSON.stringify(error, null, 2)}
            </p>
          )}
    </main>
  )
}
