import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import client from '../../config/apollo';
const OBTENER_MI_USUARIO = gql`
  query ObtenerMiUsuario {
    obtenerMiUsuario {
      email
      name
      id
      role
      club {
        name
      }
    }
  }
`;
const Menu = ({setUser, user, isUser}) => {
  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const {data,loading,error} = useQuery(OBTENER_MI_USUARIO);
  let superA = false;
  if(!loading){
    const {obtenerMiUsuario} = data;
    if(!user && isUser){
      setUser(obtenerMiUsuario)
    }
    if(!obtenerMiUsuario.name){
      router.push("/controlPanel");
      client.resetStore();
    }
    if (obtenerMiUsuario.role === 'SUPERADMINISTRADOR') {
      superA = true;
    }
  }

  const toggle = () => {
    const estado = expandido;

    setExpandido(!estado);
  }
  
  return (
    <div className="menu shadow-lg" style={{width: expandido ? '18em' : '4.5em'}}>
      <button className="toggle-button" onClick={() => toggle()}>
        <ion-icon name={!expandido ? 'menu-outline' : 'close-outline'}></ion-icon>
      </button>
      <ul>
        {
          superA  ?
          (
            <>
              <MenuItem titulo="Inicio" icono="home-outline" link="home"/>
              <MenuItem titulo="Clubes" icono="copy-outline" link="clubes"/>
              <MenuItem titulo="Noticias" icono="newspaper-outline" link="noticias"/>
              <MenuItem titulo="Usuarios" icono="person-outline" link="usuarios"/>
            </>
          ):
          (
            <>
              <MenuItem titulo="Inicio" icono="home-outline" link="home"/>
              <MenuItem titulo="Noticias" icono="newspaper-outline" link="noticias"/>
            </>
          ) 
        }
        
      </ul>
    </div>
  );
};

export default Menu