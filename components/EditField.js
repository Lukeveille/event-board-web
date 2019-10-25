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
    right: '-2vw',
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
      <input
        value={props.value}
        size={props.value.length}
      /> :
      <div>
        {props.value}
      </div>}
      {props.editing?
      <i
        className={"glyphicon glyphicon-pencil"}
        style={pencil}
        onClick={() => {
          if (modify) {
            console.log(modify)
            setModify(false);
          }
        }}
      ></i> : ''}
    </div>
  )
}