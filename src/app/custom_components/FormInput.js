
import { useId } from 'react';

function FormInput(props){
  const inputId = useId();
  return(
    <>
      <label htmlFor={inputId}>{props.name ?? ""}</label><br />
      <input
        name={props.col  ?? props.name}   // use col as name so e.target.name works in handleChange
        type={props.type ?? "text"}
        className={`mb-5 border rounded ${!props.disabled ? 'text-black' : 'text-gray-400'} border-gray-300`}
        size="50"
        id={inputId}
        value={props.value }
        disabled={props.disabled ?? false}
        onChange={props.onChange ?? (()=>{})}
        placeholder={props.placeholder ?? ""}
      /><br />
    </>
  );
}

export default FormInput;
