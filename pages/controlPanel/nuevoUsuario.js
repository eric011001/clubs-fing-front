import React, { useState } from 'react'
import { gql, useQuery, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Select from "react-select";
import HeadApp from '../../components/HeadApp';
import Menu from '../../components/menu/Menu';

const NUEVO_USUARIO = gql`
    mutation CrearNuevoUsuario($input: UsuarioInput) {
        crearNuevoUsuario(input: $input) {
            id
            role
            name
            email
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
const rolOptions = [
    { value: 'SUPERADMINISTRADOR', label: 'Superadministrador'},
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'USUARIO', label: 'Usuario' }
]

const NuevoUsuario = () => {
    const router = useRouter();
    const [rol, setRol] = useState([]);
    const {data,loading,error} = useQuery(OBTENER_CLUBS);
    const [clubs, setClubs] = useState([{name: 'Sin club', id: ''}])
    const [club, setClub] = useState([])

    const [CrearNuevoUsuario] = useMutation(NUEVO_USUARIO);
    const formikUsuario = useFormik({
        initialValues: {
            name: '',
            role: '',
            password: '',
            email: '',
            club: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es obligatorio'),
            role: Yup.string().required('El rol es obligatorio'),
            password: Yup.string().required('La contraseña es necesaria'),
            email: Yup.string().required('El correo es obligatorio'),
            club: Yup.string()
        }),
        onSubmit: async(valores) => {
            const {name, role, password, email, club} = valores;
            if(role === 'SUPERADMINISTRADOR' && club !== ''){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Los superadministradores no pueden tener club',
                    confirmButtonColor: '#8d228a'
                });
                return;
            }

            const {data} = await CrearNuevoUsuario({
                variables: {
                    input: {
                        name,
                        role,
                        password,
                        email,
                        club: club === '' ? null : club
                    }
                }
            })
            Swal.fire({
                icon: 'success',
                title: 'Creado',
                text: 'Se creó el usuario exitosamente',
                confirmButtonColor: '#8d228a'
              });
              router.push('/controlPanel/usuarios')
        }
    })

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
    if(!loading){
        if(data.obtenerClubs.length>0 ){
            if (clubs.length <=1) {
                let newState = [...clubs, data.obtenerClubs]
                console.log(newState);
                setClubs(prevClubs => [...prevClubs, ...data.obtenerClubs]);
            }
        }
    }


    return(
        <div className='flex'>
            <HeadApp/>
            <Menu/>
            <form onSubmit={formikUsuario.handleSubmit} className="flex w-full">
                <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                    <div className="h-16 flex justify-left items-center">
                        <h1 className="ml-4 text-2xl font-bold text-[#8d228a]">Agregar usuario</h1>
                    </div>
                    <div className="flex-grow m-8 flex flex-col">
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="name">Nombre:</label>
                                <input type="text" id="name" name="name" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.name}/>
                                {formikUsuario.touched.name && formikUsuario.errors.name ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikUsuario.errors.name}</span>
                                ): null}
                            </div>
                            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="email">Correo:</label>
                                <input type="email" id="email" name="email" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.email}/>
                                {formikUsuario.touched.email && formikUsuario.errors.email ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikUsuario.errors.email}</span>
                                ): null}
                            </div>
                            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="role">Rol:</label>
                                <Select id="role" options={rolOptions} onChange={selectedOption => {
                                    formikUsuario.handleChange('role')(selectedOption.value); 
                                    setRol(selectedOption);}} onBlur={formikUsuario.handleBlur} value={rol} className="m-2" styles={selectStyles}/>
                                {formikUsuario.touched.role && formikUsuario.errors.role ? (
                                    <span className="bg-white justify-center flex text-red-500">{formikUsuario.errors.role}</span>
                                ): null}
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="password">Contraseña:</label>
                                <input type="password" id="password" name="password" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.password}/>
                                {formikUsuario.touched.password && formikUsuario.errors.password ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikUsuario.errors.password}</span>
                                ): null}
                            </div>
                            <div className="w-full sm:w-full md:w-full lg:w-2/3 xl:w-123 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="role">Club:</label>
                                <Select id="club" getOptionValue={(club) => club.id} getOptionLabel={(club) => club.name} options={clubs} onChange={selectedOption => {
                                    formikUsuario.handleChange('club')(selectedOption.id); 
                                    setClub(selectedOption);}} onBlur={formikUsuario.handleBlur} value={club} className="m-2" styles={selectStyles}/>
                                {formikUsuario.touched.club && formikUsuario.errors.club ? (
                                    <span className="bg-white justify-center flex text-red-500">{formikUsuario.errors.club}</span>
                                ): null}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-[#8d228a] hover:bg-[#631c61] rounded-xl text-white font-semibold transition-all">Agregar usuario</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
    

}

export default NuevoUsuario;