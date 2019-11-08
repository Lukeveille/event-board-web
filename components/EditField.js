import { useState } from 'react';
import dateTimeString from '../utils/date-time-string';

export default props => {
  const [hover, setHover] = useState(false),
  [modify, setModify] = useState(false),
  editView = {
    position: 'relative',
    display: 'inline-block',
    cursor: props.editing? 'pointer' : 'text'
  },
  pencil = {
    position: 'absolute',
    right: '-1.5em',
    top: props.size + 'vh',
    color: modify? '#000': hover? '#000' : '#ddd',
    fontSize: '16px'
  }

  return (
    <div 
      style={editView}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={e => {
        if (!modify && props.editing) {
          setModify(true)
        }
      }}
    >
      {modify?
      props.type === 'textarea'?
      <textarea
        style={{resize: 'none'}}
        value={props.value}
        type="number"
        cols="70"
        rows="5"
      />
      :
      props.type === 'time'?
      <div>
        <input
          type="time"
          value={dateTimeString(props.value)[3]}
        />
        <input
          type="date"
          value={dateTimeString(props.value)[4]}
        />
      </div>
      :
      <input
        value={props.value}
        size={props.type === "number"? 3 : props.value.length}
        type={props.type? props.type : 'text'}
      /> 
      :
      <div>
        {props.type === 'time'? `${dateTimeString(props.value)[1]} ${dateTimeString(props.value)[0]}` : props.value}
      </div>}
      {props.editing?
      <i
        className={"glyphicon glyphicon-pencil"}
        style={pencil}
        onClick={() => {
          if (modify) {
            setModify(false);
          }
        }}
      ></i> : ''}
    </div>
  )
}