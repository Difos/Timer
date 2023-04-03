import { FormContainer, MinutesAmountMinutes, TaskInput } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../../../context/CyclesContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()
  return (
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
  )
}
