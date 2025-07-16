// Headerbar.jsx

import React from 'react';
import saintakanri from '../assets/images/sainta-kanri.png';

const Headerbar = () => {
    return (
        <>
            <div className="headerbar-container">
                <img src={saintakanri} alt="Sainta Kanri Logo" className="headerbar-logo" />
            </div>
        </>
    )
}
export default Headerbar;

