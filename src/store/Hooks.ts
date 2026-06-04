import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '.'

// Use these instead of plain useDispatch / useSelector
// so TypeScript knows the exact shape of your state and dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector)