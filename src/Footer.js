import React from 'react';
import HeartRateMonitor from "./HeartRateMonitor";

const Footer = () => {
    return (
        <footer className="row pb-3"> 
            <div className="col-md-3 text-center">
                <HeartRateMonitor />
            </div>
            
            {/*<div className="col-md-6">
            </div>*/}
            
        </footer>
    );
}

export default Footer;
