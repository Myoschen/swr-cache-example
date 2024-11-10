'use client'

import Link from 'next/link'
import useSWR from 'swr'

import { ENDPOINT } from '@/constants/env'
import type { User } from '@/lib/types'

async function fetchUsers() {
  const resp = await fetch(`${ENDPOINT}/users`)
  return await resp.json() as User[]
}

export default function Home() {
  const { data: users = [] } = useSWR({ tag: ['#user'] }, fetchUsers)

  return (
    <main className="flex min-h-screen items-center justify-center py-16">
      {/* list */}
      <ul className="w-full max-w-sm">
        {users.map(user => (
          <li key={user.id}>
            <Link className="flex flex-col rounded-lg p-2 transition-colors ease-out hover:bg-muted" href={`/users/${user.id}`}>
              <span className="text-sm">{user.name}</span>
              <span className="text-xs font-light text-muted-foreground">{user.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
