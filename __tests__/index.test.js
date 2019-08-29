// __tests__/fetch.test.js
import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import Index from '../pages/index'

test('loads', async () => {
  const { getByText, getByTestId } = render(<Index />)

  // axiosMock.get.mockResolvedValueOnce({
  //   data: { greeting: 'hello there' },
  // })

  fireEvent.click(getByText('All Events'))

  const categoriesTextNode = await waitForElement(() =>
    getByTestId('category-filter-text')
  )

  // expect(axiosMock.get).toHaveBeenCalledTimes(1)
  // expect(axiosMock.get).toHaveBeenCalledWith(url)
  expect(getByTestId('greeting-text')).toHaveTextContent('Tech')
  expect(getByTestId('ok-button')).toHaveAttribute('disabled')
})