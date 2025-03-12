import React ,{useEffect,useState} from 'react';

export const useMobile=(breakpoint=768)=>{
    const [isMobile, setIsMobile]=useState(window.innerWidth<breakpoint);
    const handleResize=()=>{
        const checkPonint=window.innerWidth<breakpoint;
        setIsMobile(checkPonint);
    }

    useEffect(()=>{
        handleResize();
        window.addEventListener('resize',handleResize);
        return ()=>window.removeEventListener('resize',handleResize);
    },[]);

    return isMobile;
    
}

