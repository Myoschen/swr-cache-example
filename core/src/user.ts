import { faker } from '@faker-js/faker'
import { type NextFunction, type Request, type Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

// set seed
faker.seed(22)

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'name is required'),
})

type User = z.infer<typeof userSchema>

const users: User[] = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
}))

// middlewares
function validateUser(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = userSchema.omit({ id: true }).parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(e => ({ path: e.path, message: e.message }))
      res.status(StatusCodes.BAD_REQUEST).json({ errors })
      return
    }
    next(error)
  }
}

// controllers
function getUsers(_req: Request, res: Response) {
  res.status(StatusCodes.OK).json(users)
}

function getUser(req: Request, res: Response) {
  const user = users.find(u => u.id === req.params.id)

  // user not found
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'user not found' })
    return
  }

  res.status(StatusCodes.OK).json(user)
}

function createUser(req: Request, res: Response) {
  const { name } = req.body

  // insert to db
  const newUser: User = { id: faker.string.uuid(), name }
  users.push(newUser)

  res.status(StatusCodes.CREATED).json(newUser)
}

function updateUser(req: Request, res: Response) {
  const userIndex = users.findIndex(u => u.id === req.params.id)

  // user not found
  if (userIndex === -1) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'user not found' })
    return
  }

  const { name } = req.body
  users[userIndex] = { ...users[userIndex], name }
  res.status(StatusCodes.OK).json(users[userIndex])
}

function deleteUser(req: Request, res: Response) {
  const userIndex = users.findIndex(u => u.id === req.params.id)

  // user not found
  if (userIndex === -1) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'user not found' })
    return
  }

  const deletedUser = users.splice(userIndex, 1)
  res.status(StatusCodes.OK).json(deletedUser[0])
}

export const userRouter = Router()

userRouter
  .get('/', getUsers)
  .get('/:id', getUser)
  .post('/', validateUser, createUser)
  .put('/:id', validateUser, updateUser)
  .delete('/:id', deleteUser)
