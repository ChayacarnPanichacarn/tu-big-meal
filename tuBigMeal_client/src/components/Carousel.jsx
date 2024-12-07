import {useCallback, useEffect, useState} from 'react'
import "./Carousel.css"

// import {slides} from "./Data/CarouselData.json"
import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from "react-icons/bs"
import Proptypes from 'prop-types';

function Carousel(props) {
  const [slide, setslide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const {shops} = props;

  const selectedShops = shops.filter((shop) => {
    return shop.adsImg !== undefined;
  });

  const nextSlide = useCallback(() => {
    setSlideDirection('left');
    setslide((currentSlide) => currentSlide === selectedShops.length-1 ? 0: currentSlide + 1);
  },[selectedShops.length])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const prevSlide = () => {
    setSlideDirection('right');
    setslide(slide === 0 ? selectedShops.length-1 : slide-1);
  }

  return (
    <div className="carousel">
      <BsArrowLeftCircleFill className="arrow arrow-left" onClick={prevSlide} />

      {selectedShops.map((shop, i) => (
        <img 
          src={shop.adsImg} key={i} 
          className={`slide ${slide === i ? `slide-active-${slideDirection}` : `slide-hidden`}`} >
        </img>
      ))}

      <BsArrowRightCircleFill  className="arrow arrow-right" onClick={nextSlide} />

      <span className="indicators">
        {selectedShops.map((_, idx) => (
          <button key={idx} onClick={() => {
            setSlideDirection(idx > slide? 'left':'right');
            setslide(idx)
          }} className={slide === idx ? "indicator": "indicator indicator-inactive"}>

          </button>
        ))}
      </span>
    </div>
  )
}

Carousel.propTypes = {
  shops: Proptypes.array
}

export default Carousel;
