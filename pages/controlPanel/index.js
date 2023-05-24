import React, {useState} from 'react';
import HeadApp from '../../components/HeadApp';
import { useFormik } from 'formik';
import * as Yup  from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const AUTENTICAR_USUARIO = gql`
mutation AutenticarUsuario($input: AuthInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Index = () => {
  const router = useRouter();
  const [mensaje,guardarMensaje] = useState(null);

  const [AutenticarUsuarioMutation] = useMutation(AUTENTICAR_USUARIO);

  const formikLogin = useFormik({
    initialValues:{
      emailInput: '',
      passwordInput: ''
    },
    validationSchema: Yup.object({
      emailInput: Yup.string().email("El correo no es válido").required("El correo es necesario"),
      passwordInput: Yup.string().required("La contraseña es necesaria")
    }),
    onSubmit: async valores => {
      const{emailInput,passwordInput} = valores;
      try {
        const {data} = await AutenticarUsuarioMutation({
          variables: {
            input: {
              email: emailInput,
              password: passwordInput
            }
          }
        });
        guardarMensaje('Procesando...');

        setTimeout(() => {
          const {token} = data.autenticarUsuario;
          localStorage.setItem('token',token);
        }, 200);

        setTimeout(() => {
          guardarMensaje(null);
          router.push('/controlPanel/home');
        }, 1500);
        
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQl error :',''))
        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
      
    }
  });
  
  const mostrarMensaje = () => {
    const spinner = <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-100" cx="12" cy="12" r="10" stroke="purple" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>;
    return (
      <span className="block w-full flex justify-center items-center p-2 m-2 bg-gray-200 text-[#631c61] font-semibold rounded-xl">
        
        {mensaje === 'Procesando...' ? (spinner) : null}
        {mensaje}
        
      </span>
    )
  }
  return ( 
    <>
      <HeadApp/>
      <div className="h-full flex justify-center">
        <form onSubmit= {formikLogin.handleSubmit} className="w-full mx-4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-1/2 my-auto h-full flex">
          <div className="bg-white shadow-lg rounded-xl my-auto w-full">
            <div className="h-1/6 flex justify-center items-center">
              <h1 className="text-3xl font-semibold">Iniciar sesión</h1>
            </div>
            <div className="h-5/6 flex flex-col">
              <div className="flex h-1/3 flex-col m-2">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="emailInput">Correo electrónico:</label>
                <input type="email" id="emailInput" name="emailInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikLogin.handleChange} onBlur = {formikLogin.handleBlur} value={formikLogin.values.emailInput}/>
                {formikLogin.touched.emailInput && formikLogin.errors.emailInput ? (
                  <span className="bg-white justify-center flex text-[#631c61]">{formikLogin.errors.emailInput}</span>
                ): null}
              </div>
              <div className="flex h-1/3 flex-col m-2">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="passwordInput">Contraseña:</label>
                <input type="password" id="passwordInput" name="passwordInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl"  onChange={formikLogin.handleChange} onBlur = {formikLogin.handleBlur} value={formikLogin.values.passwordInput}/>
                {formikLogin.touched.passwordInput && formikLogin.errors.passwordInput ? (
                  <span className="bg-white justify-center flex text-[#631c61]">{formikLogin.errors.passwordInput}</span>
                ): null}
              </div>
              <div className="flex h-1/3 justify-center m-4 items-center flex-col">
                <button className="block w-full h-10 bg-[#8d228a] transition-all hover:bg-[#631c61] rounded-xl text-white font-semibold outline-none" type="submit">Ingresar</button>
                {mensaje && mostrarMensaje() }
              </div>
            </div>
          </div>
        </form>
      </div> 
    </>
  );
}

export default Index;