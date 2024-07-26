// sum.test.js
import { expect, test } from "bun:test"

function sum(one: number, other: number) {
    return one + other
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
})