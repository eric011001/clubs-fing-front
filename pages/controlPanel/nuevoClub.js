import React, {useState, useEffect} from 'react'
import HeadApp from '../../components/HeadApp';
import Menu from '../../components/menu/Menu';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import Swal from 'sweetalert2';
const NUEVO_CLUB = gql`
mutation CrearClub($input: ClubInput) {
    crearClub(input: $input) {
      description
      id
      name
      schedule {
        day
        Hour
      }
    }
  }
`;


const dias = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo'
]




const NuevoClub = () => {
    const router = useRouter();
    const [crearClub] = useMutation(NUEVO_CLUB);
    const [horarios, sethorarios] = useState([]);
    const [horas, setHoras] = useState([]);
    const [minutos, setMinutos] = useState([]);
    const formikClub = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        validationSchema : Yup.object({
            name: Yup.string().required('El nombre es obligatorio'),
            description: Yup.string().required('La descripción es obligatoria')
        }),
        onSubmit: (valores) => {
            const{description, name} = valores;
            if(horarios.filter(horario => horario.Hour !== '').length === 7){
                Swal.fire(
                    Swal.fire({
                        title: '¿Deseas crear un club sin horarios?',
                        text: 'Estos datos se pueden modificar luego',
                        icon: 'warning',
                        showCancelButton:true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        reverseButtons: true,
                        confirmButtonText: 'Si, crear',
                        cancelButtonText: 'No, cancelar'
                    }).then(async (result) => {
                        if(result.value){
                            try {
                                const {data} = crearClub({
                                    variables: {
                                        input: {
                                            name,
                                            description,
                                            schedule: horarios
                                        }
                                    }
                                })
                                Swal.fire({
                                    icon: 'success',
                                    title: 'creado',
                                    text: data.crearClub,
                                    confirmButtonColor: '#8d228a'
                                })
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    })
                )
            }else{
                try {
                    const {data} = crearClub({
                        variables: {
                            input: {
                                name,
                                description,
                                schedule: horarios
                            }
                        }
                    })
                    Swal.fire({
                        icon: 'success',
                        title: 'creado',
                        text: data.crearClub,
                        confirmButtonColor: '#8d228a'
                    })
                } catch (error) {
                    console.log(error);
                }
            }
        }
    })

    useEffect(() => {
      let temphora = [{value: '', label: 'Sin horario'}];
      let tempMinutos = [{value: '', label: 'Sin horario'}];
      let tempHorarios = [];
      for (let index = 0; index < 24; index++) {
        temphora.push({value: index, label: index>=10 ? index : `0${index}`})
      }
      for (let index2 = 0; index2 < 60; index2++) {
        tempMinutos.push({value: index2, label: index2>=10 ? index2 : `0${index2}`})
      }
      setHoras(temphora);
      setMinutos(tempMinutos);
      for (let index3 = 0; index3 < 7; index3++) {
        tempHorarios.push({day: index3, Hour: ''});
      }
      sethorarios(tempHorarios);
    }, [])


    const cambiaHorarios = (opcion, tipo, dia) => {
        let diaACambiar = horarios.filter(horario => horario.day === dia);
        if (tipo === "HORA") {
            if (diaACambiar[0].Hour === '') {
                sethorarios(oldHorarios => [{day: diaACambiar[0].day, Hour: `${opcion.value}:00`},...oldHorarios.filter(horario => horario.day !== dia) ])
            }else{
                let horaSeparado = diaACambiar[0].Hour.split(':')
                sethorarios(oldHorarios => [{day: diaACambiar[0].day, Hour: `${opcion.value}:${horaSeparado[1]}`}, ...oldHorarios.filter(horario => horario.day !== dia)])
            }
                
        } else {
            if (diaACambiar[0].Hour === '') {
                sethorarios(oldHorarios => [{day: diaACambiar[0].day, Hour: `00:${opcion.value}`},...oldHorarios.filter(horario => horario.day !== dia)])
            } else {
                let horaSeparado = diaACambiar[0].Hour.split(':')
                sethorarios(oldHorarios => [{day: diaACambiar[0].day, Hour: `${horaSeparado[0]}:${opcion.value}`},...oldHorarios.filter(horario => horario.day !== dia)])
            }
        }
    }
    
    return(
        <div className='flex'>
            <HeadApp/>
            <Menu/>

            <form onSubmit={formikClub.handleSubmit} className="flex w-full">
                <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                    <div className="h-16 flex justify-left items-center">
                        <h1 className="ml-4 text-2xl font-bold text-[#8d228a]">Agregar club</h1>
                    </div>
                    <div className="flex-grow m-8 flex flex-col">
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="name">Nombre:</label>
                                <input type="text" id="name" name="name" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikClub.handleChange} onBlur={formikClub.handleBlur} value={formikClub.values.name}/>
                                {formikClub.touched.name && formikClub.errors.name ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikClub.errors.name}</span>
                                ): null}
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full flex-shrink-0 flex flex-col">
                                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="description"> Descripción:</label>
                                <textarea type="text" id="description" name="description" className="p-2 m-2 w-auto h-20 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikClub.handleChange} onBlur={formikClub.handleBlur} value={formikClub.values.description}/>
                                {formikClub.touched.description && formikClub.errors.description ? (
                                    <span className="bg-white justify-center flex text-[#8d228a]">{formikClub.errors.description}</span>
                                ): null}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 ">
                            {Array.from({ length: 7 }, () => ({})).map((_,index) => (
                                <div key={index} className="w-full mr-2 sm:w-full md:w-full lg:w-full xl:w-full flex-shrink-0 flex flex-col">
                                    <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" > {dias[index]}:</label>
                                    <div className='flex'>
                                        <Select className="w-1/2 mr-2" id={`horas-${dias[index]}`}  options={horas} onChange={(selectedOption) => {cambiaHorarios(selectedOption, 'HORA', index)}}/>
                                        <Select className="w-1/2" id={`minutos-${dias[index]}`}  options={minutos} onChange={(selectedOption) => {cambiaHorarios(selectedOption, 'MINUTOS', index)}}/>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <button type="submit" className="m-2 block mt-5 h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-[#8d228a] hover:bg-[#631c61] rounded-xl text-white font-semibold transition-all">Agregar Club</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default NuevoClub;