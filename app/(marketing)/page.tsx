import Heroes from '@/components/ladingpage/Heroes'
import JournalPage from '@/components/ladingpage/journal-page'
import SliderMarketing from '@/components/ladingpage/slider-marketing'
import React from 'react'

const HomePage = () => {
  return (
    <>
      <Heroes />
      <SliderMarketing />
      <JournalPage />
    </>
  )
}

export default HomePage
