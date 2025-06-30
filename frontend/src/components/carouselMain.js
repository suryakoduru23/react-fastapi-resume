import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Img1 from './carousel-images/image1.png'
import Img2 from './carousel-images/image2.png'
import Img3 from './carousel-images/image3.png'
import Img4 from './carousel-images/image4.png'
const CarouselMain = () => {
    const navigate = useNavigate()
    const imgCon = [Img1,Img2,Img3,Img4]
    const prev = '<'
    const next = '>'
    let [ind,upInd] = useState(0)
    useEffect(() => {
        const imageChange = setInterval(() => {
            ind++;
            if(ind > 3)
                ind = 0;
          upInd(ind);
        }, 3000);
        return () => clearInterval(imageChange);
      }, [ind]);
  return (
    <>
            <marquee><h1>Welcome to Resume Builder</h1></marquee>
        <div className='carouselClass'>
        <div className='prev arrow' onClick={()=>{
            ind--;
            if(ind < 0)
                ind = 3;
            upInd(ind);
        }}> <p> {prev} </p>  </div>
        <div className='next arrow'onClick={()=>{
            ind++;
            if(ind > 3)
                ind = 0;
            upInd(ind);
        }}> <p> {next} </p> </div>
        <img src={imgCon[ind]} alt={`image${ind}`}/>
        </div>
        <button className="createCV btn btn-primary px-5 py-2 text-center" onClick={()=>{
            navigate('/create-resume')
        }}>Create your CV</button>
        </>
  )
}

export default CarouselMain
