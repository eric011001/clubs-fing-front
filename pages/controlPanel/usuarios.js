import React from 'react';
import TablaUsuarios from '../../components/administracion/usuarios/TablaUsuarios';
import HeadApp from '../../components/HeadApp';
import Menu from '../../components/menu/Menu';

const usuarios = () => {
  return(
    <div className="flex">
      <HeadApp/>
      <Menu/>
      <TablaUsuarios/>
    </div>
  )
}

export default usuarios;