import React from 'react';
import logo from './logo.png';
import Tilt from 'react-parallax-tilt';
import './Logo.css'

const Logo = () => {
    return (
     <div style={{width:450, height:400}} className='ma4 mt0'>
        <Tilt className="Tilt br4 shadow-2" glareEnable={true} glareMaxOpacity={0.8} glareColor="#ffffff" glarePosition="bottom" glareBorderRadius="20px">
         <div>
            <img src={logo} alt="Logo" />
         </div>
        </Tilt>
     </div>

    );
}

export default Logo;