import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react'
import Swal from 'sweetalert2';

const ELIMINA_CLUB = gql`
mutation EliminaClub($id: ID!) {
    eliminaClub(id: $id)
  }
`
const OBTENER_CLUBES = gql`

query ObtenerClubs {
    obtenerClubs {
      description
      id
      name
      schedule {
        Hour
        day
      }
    }
  }
`

const Club = ({club}) => {
    const {id, name, schedule, description} = club;
    const router = useRouter();
    const [eliminaClub] = useMutation(ELIMINA_CLUB, {
        update(cache){
            const {obtenerClubs} = cache.readQuery({ query: OBTENER_CLUBES});
            cache.writeQuery({
                query: OBTENER_CLUBES,
                data: {
                    obtenerClubs: obtenerClubs.filter((clubActual) => clubActual.is !== id)
                }
            })
        }
    });

    const editarClub = () => {

    }


    const eliminarClub = () => {
        Swal.fire({
            title: '¿Deseas eliminar este club?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton:true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if(result.value){
                try {
                    const {data} = await eliminaClub({
                        variables: {
                            id
                        }
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Elimimado',
                        text: data.eliminaClub,
                        confirmButtonColor: '#8d228a'
                    })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }
    return(
        <tr className="hover:bg-white cursor-default transition-all">
            <td className="px-4 py-2 text-center cursor-default">{name}</td>
            <td className="px-4 py-2 text-center cursor-default">{description}</td>
            <td className="px-4 py-2 text-center cursor-default">Horario</td>
            <td className="px-4 py-2 text-center cursor-default">
                <button onClick={() => editaUsuario()} className="bg-[#8d228a] text-white w-8 h-8 rounded-lg mx-2 text-xl p-1">
                    <ion-icon name="pencil"></ion-icon>
                </button>
                <button onClick={() => eliminarClub()} className="bg-[#8d228a] text-white w-8 h-8 rounded-lg mx-2 text-xl p-1">
                    <ion-icon name="trash"></ion-icon>
                </button>
            </td>
        </tr>
    )
}

export default Club;