import { useState } from 'react';

export default () => {
  const [ellipsis, setEllipsis] = useState('');

  setTimeout(() => {
    if (ellipsis === '...') {
      setEllipsis('');
    } else {
      setEllipsis(`${ellipsis}.`);
    };
  }, 500);
  
  return (<div className="loading-display">
    <div className="container-box">
    	<div className="box">
    		<div className="spinner spinner"></div>
    	</div>
    </div>
    <h3 className="loading-text">
      Uploading Image{ellipsis}
    </h3>
    <style jsx>{`
      .container-box {
        width: 100%;
        height: 100%;
      }
      .container-box .box {
        margin: 10rem;
        display: grid;
        justify-items: center;
        align-items: center;
      }
      .container-box .box .spinner {
        height: 20rem;
        width: 20rem;
        background: rgba(0, 0, 0, .2);
        border-radius: 50%;
      }
      .loading-text {
        position: absolute;
        left: 44.5vw;
        margin: 3rem auto;
      }
      .container-box .box .spinner {
        transform: scale(0);
        background: rgba(0, 0, 0, .8);
        opacity: 1;
        animation: spinner4 800ms linear infinite;
      }
      @keyframes spinner4 {
        to {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `}</style>
  </div>)
}