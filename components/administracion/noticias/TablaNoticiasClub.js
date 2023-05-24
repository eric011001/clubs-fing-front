import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Noticia from './Noticia';

const OBTENER_NOTICIAS = gql`
query ObtenerNewsMiClub {
    obtenerNewsMiClub {
      id
      publisher {
        email
        name
      }
      text
      title
    }
  }
`;

const TablaNoticiasClub = () => {
    const router = useRouter();
    const {data, loading, error} = useQuery(OBTENER_NOTICIAS);
    
    if (loading) {
        return (
            <div className="ml-6 mt-3 flex flex-grow items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-100" cx="12" cy="12" r="10" stroke="purple" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }
    console.log(data);
    const {obtenerNews} = data;
    const agregarNew = () => {
        router.push("/controlPanel/nuevaNew");
    }

    return(
        <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
            <div className="h-16 flex justify-left items-center">
                <h1 className="ml-4 text-2xl font-bold text-[#8d228a]">Lista de Noticias</h1>
            </div>
            <div className="flex-grow p-5 m-8 h-16 overflow-y-auto grid grid-cols-3 gap-4 rounded-xl">
                {obtenerNews.map(noticia => (
                    <Noticia key={noticia.id} noticia={noticia}/>
                ))}
                
            </div>
            <button onClick={() => agregarNew()} className="bg-[#8d228a] text-white w-16 h-16 rounded-xl transition-all shadow-xl absolute hover:bg-[#631c61]" style={{bottom: '3em', right: '3em'}}>
                <ion-icon name="add-circle-outline" style={{fontSize: '2em'}}></ion-icon>
            </button>
        </div>
    )
}

export default TablaNoticiasClub;