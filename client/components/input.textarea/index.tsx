import React, {FC} from "react";
import style from './style.module.scss';

interface IInputTextarea{
  change: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  placeholder: string,
  label?: string,
  classes?: string,
  name?: string,
}

const InputTextarea: FC<IInputTextarea> = ({change, placeholder, label, classes, name}) => {
  return (
    <div className={`${style.input_textarea__wrapper} ${classes ? classes : ''}`}>
      {label && <label className={`${style.input_textarea__label}`}>{label}</label>}
      <textarea
        onChange={change}
        className={`${style.input_textarea} `}
        placeholder={placeholder}
        maxLength={160}
        name={name ? name : 'textarea'}
      />
    </div>
  )
}

export default InputTextarea;