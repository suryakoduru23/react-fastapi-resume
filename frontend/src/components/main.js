import React, { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import CarouselMain from './carouselMain'
import CreateResume from './createResume'
import ResumePreview from './resumePreview'
const Main = () => {
  const [resume, setResume] = useState({})
  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<CarouselMain />}/>
        <Route path='/create-resume' element={<CreateResume setResume={setResume}/>}/>
        <Route path='/resume-preview' element={<ResumePreview resumeValues={resume} />}/>
      </Routes>
    </div>
  )
}

export default Main
