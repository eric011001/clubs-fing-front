import React from 'react'
import HeadApp from '../../components/HeadApp';
import Menu from '../../components/menu/Menu';
import TablaClubes from '../../components/administracion/clubes/TablaClubes';


const clubes = () => {
    return(
        <div className='flex'>
            <HeadApp/>
            <Menu/>
            <TablaClubes/>
        </div>
    )
}

export default clubes;