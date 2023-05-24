import React, {useState} from 'react'
import Menu from '../../components/menu/Menu';
import HeadApp from '../../components/HeadApp';
import TablaNoticias from '../../components/administracion/noticias/TablaNoticias';
import TablaNoticiasClub from '../../components/administracion/noticias/TablaNoticiasClub';

const Noticias = () => {
    const [user, setUser] = useState(null)
    return(
        <div className="flex">
            <HeadApp/>
            <Menu user={user} setUser={setUser} isUser={true}/>
            {user && user.role === 'SUPERADMINISTRADOR' ? 
                <TablaNoticias/>:
                <TablaNoticiasClub/>
            }
        </div>
    )

}

export default Noticias;