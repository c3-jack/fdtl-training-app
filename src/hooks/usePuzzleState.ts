import { useCallback, useMemo, useState } from 'react'
import type { Puzzle } from '../types/puzzle'
import type { TaggedWord } from '../lib/puzzle'
import { allWords, checkGuess, shuffle } from '../lib/puzzle'

/**
 * Play-mode state machine for one puzzle. Tracks:
 * - The current shuffled order of unsolved tiles
 * - Which tiles are currently selected (max 4)
 * - Which groups have been solved (and in what order, for the result grid)
 * - The history of every guess's coloring -- used to render the NYT-style
 *   emoji recap like 🟨🟨🟩🟦 / 🟨🟨🟨🟨 ...
 * - Mistakes remaining (starts at 4)
 *
 * Transient animation flags (`shakeId`, `oneAway`) let the PlayPanel
 * trigger a shake/toast without owning that state itself.
 */
export type PlayStatus = 'playing' | 'won' | 'lost'

export function usePuzzleState(puzzle: Puzzle) {
  const wordList = useMemo(() => allWords(puzzle), [puzzle])
  const [order, setOrder] = useState<TaggedWord[]>(() => shuffle(wordList))
  const [selected, setSelected] = useState<TaggedWord[]>([])
  const [solved, setSolved] = useState<number[]>([]) // group indices, in solve order
  const [guesses, setGuesses] = useState<number[][]>([]) // each guess = array of group indices of chosen words
  const [mistakesLeft, setMistakesLeft] = useState(4)
  const [shakeId, setShakeId] = useState(0)
  const [oneAwayAt, setOneAwayAt] = useState(0)

  const status: PlayStatus =
    solved.length === 4 ? 'won' : mistakesLeft <= 0 ? 'lost' : 'playing'

  const unsolvedOrder = useMemo(
    () => order.filter((w) => !solved.includes(w.groupIndex)),
    [order, solved],
  )

  const toggle = useCallback(
    (word: TaggedWord) => {
      if (status !== 'playing') return
      setSelected((s) => {
        const idx = s.findIndex((x) => x.word === word.word)
        if (idx >= 0) return s.filter((_, i) => i !== idx)
        if (s.length >= 4) return s
        return [...s, word]
      })
    },
    [status],
  )

  const clearSelected = useCallback(() => setSelected([]), [])

  const reshuffle = useCallback(() => {
    setOrder((o) => shuffle(o))
  }, [])

  const submit = useCallback(() => {
    if (status !== 'playing' || selected.length !== 4) return
    const result = checkGuess(selected)
    const guessRecord = selected.map((w) => w.groupIndex)
    setGuesses((g) => [...g, guessRecord])

    if (result.status === 'correct') {
      setSolved((s) => [...s, result.groupIndex])
      setSelected([])
      return
    }
    setMistakesLeft((m) => m - 1)
    setShakeId((n) => n + 1)
    if (result.status === 'one-away') setOneAwayAt((n) => n + 1)
  }, [selected, status])

  const reset = useCallback(() => {
    setOrder(shuffle(wordList))
    setSelected([])
    setSolved([])
    setGuesses([])
    setMistakesLeft(4)
    setShakeId(0)
    setOneAwayAt(0)
  }, [wordList])

  return {
    status,
    unsolvedOrder,
    selected,
    solved,
    guesses,
    mistakesLeft,
    shakeId,
    oneAwayAt,
    toggle,
    clearSelected,
    reshuffle,
    submit,
    reset,
  }
}
