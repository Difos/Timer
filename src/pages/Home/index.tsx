import { Play, HandPalm } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountMinutes,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

// interface INewCycleFormData {
//   task: string
//   minutesAmount: number
// }

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        setamountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  function handleInterruptCycle() {
    setActiveCycleId(null)
    setCycles(
      cycles.map((cycle) => {
        if (cycle === activeCycle) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  console.log(activeCycle)

  function hadleCreateNewCycle(data: INewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...cycles, newCycle])
    setActiveCycleId(id)
    setamountSecondsPassed(0)

    reset()
  }

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(hadleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            disabled={!!activeCycle}
            placeholder="De um nome para seu projeto"
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
            <option value="Projeto 4"></option>
          </datalist>

          <label htmlFor="">Durante</label>
          <MinutesAmountMinutes
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>
        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>
        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} /> Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} /> Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
