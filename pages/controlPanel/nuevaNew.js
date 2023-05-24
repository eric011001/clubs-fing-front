import React, {useState} from 'react'
import HeadApp from '../../components/HeadApp';
import Menu from '../../components/menu/Menu';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import Swal from 'sweetalert2';
const NUEVA_NOTICIA = gql`
    mutation CrearNew($input: NewInput) {
        crearNew(input: $input) {
            id
            text
            title
        }
    }
`;

const OBTENER_MI_USUARIO = gql`
query ObtenerMiUsuario {
    obtenerMiUsuario {
      role
    }
  }
`
const OBTENER_CLUBS = gql`
    query ObtenerClubs {
        obtenerClubs {
            name
            description
            id
            schedule {
                Hour
                day
            }
        }
    }
`;

const NuevaNew = () => {
    const router = useRouter();
    const [club, setClub] = useState([]);
    const [CrearNew] = useMutation(NUEVA_NOTICIA);
    const {data,loading, error} = useQuery(OBTENER_CLUBS);
    const {data: data2, loading: loading2, error: error2} = useQuery(OBTENER_MI_USUARIO);
    const formikNoticia = useFormik({
        initialValues: {
            title: '',
            text: '',
            club: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('El titulo es necesario'),
            text: Yup.string().required('El contenido es necesario'),
            club: ''
        }),
        onSubmit: async(valores) => {
            const {title, text, club} = valores;
            /*const {data} = await CrearNew({
                variables: {
                    input: {
                        title,
                        text,
                        club: club === '' ? null : club
                    }
                }
            })*/
            console.log({title, text, club: club ==='' ? null : club});
            Swal.fire({
                icon: 'success',
                title: 'Creado',
                text: 'Se creó el usuario exitosamente',
                confirmButtonColor: '#8d228a'
            });
            router.push('/controlPanel/noticias')
        }
    });

    const selectStyles = {
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#d1d5db' : '#e5e7eb',
          color: '#212529',
        }),
        control: (provided, state) => ({
          ...provided,
          borderRadius: '0.75em',
          backgroundColor: state.isFocused ? '#d1d5db' : '#e5e7eb',
          borderWidth: '0px'
        }),
        menuList: (provided, state) => ({
          ...provided,
          borderRadius: '0.75em'
        })
    };
    if (loading || loading2) {
        return (
          <div className="ml-6 mt-3 flex flex-grow items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-100" cx="12" cy="12" r="10" stroke="purple" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          </div>
        );
    }
    const {obtenerClubs} = data

    return(
        <div className='flex'>
            <HeadApp/>
            <Menu/>
            <form onSubmit={formikNoticia.handleSubmit} className="flex w-full">
                <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                    <div className="h-16 flex justify-left items-center">
                        <h1 className="ml-4 text-2xl font-bold text-[#8d228a]">Agregar noticia</h1>
                    </div>
                    <div className="flex-grow m-8 flex flex-col">
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="title">Titulo:</label>
                                <input type="text" id="title" name="title" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikNoticia.handleChange} onBlur={formikNoticia.handleBlur} value={formikNoticia.values.title}/>
                                {formikNoticia.touched.title && formikNoticia.errors.title ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikNoticia.errors.title}</span>
                                ): null}
                            </div>
                            {
                                data2.obtenerMiUsuario.role === 'SUPERADMINISTRADOR' ? (
                                    <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
                                        <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="role">Club:</label>
                                        <Select id="club" getOptionValue={(club) => club.id} getOptionLabel={(club) => club.name} options={obtenerClubs} onChange={selectedOption => {
                                            formikNoticia.handleChange('club')(selectedOption.id); 
                                            setClub(selectedOption);}} onBlur={formikNoticia.handleBlur} value={club} className="m-2" styles={selectStyles}/>
                                            {formikNoticia.touched.club && formikNoticia.errors.club ? (
                                                <span className="bg-white justify-center flex text-red-500">{formikNoticia.errors.club}</span>
                                            ): null}
                                    </div>
                                ): ''
                            }
                            
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="text">Contenido:</label>
                                <textarea type="text" id="text" name="text" className="p-2 m-2 w-auto h-20 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikNoticia.handleChange} onBlur={formikNoticia.handleBlur} value={formikNoticia.values.text}/>
                                {formikNoticia.touched.text && formikNoticia.errors.text ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikNoticia.errors.text}</span>
                                ): null}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-[#8d228a] hover:bg-[#631c61] rounded-xl text-white font-semibold transition-all">Agregar Noticia</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default NuevaNew;