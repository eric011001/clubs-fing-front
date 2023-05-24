import { useRouter } from 'next/router'
import React from 'react'

const Noticia = ({noticia}) => {
    const {id} = noticia;
    const router = useRouter();
    const editaClub = () => {
        router.push({
            pathname: "/controlPanel/editaNew/[id]",
            query: {id}
        })
    }

    return(
        <div className='cursor-pointer drop-shadow-lg h-96 overflow-hidden border-b-4 border-[#8d228a]  rounded-xl' onClick={() => editaClub()}>
            <div className=' flex- justify-center'>
                <img className='' src='https://media.wired.com/photos/62feb60bcea7c0581e825cb0/16:9/w_2400,h_1350,c_limit/Fate-of-Game-Preservation-Games-GettyImages-1170073827.jpg'/>
            </div>
            <div className='p-5 font-bold text-2xl'>
                <h3>{noticia.title}</h3>
            </div>
            <div className='p-3'>
            <p>{noticia.text}</p>
            </div>
        </div>
    )
}

export default Noticia;