import { useState } from 'react';

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
    right: '-1.5vw',
    top: props.size + 'vh',
    color: hover? '#000' : '#ddd',
    fontSize: '16px'
  }

  return (
    <div>
      {modify?
      <input value={props.children} /> :
      <div 
        style={editView}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={() => {
          if (props.editing) {
            setModify(true)
          }
        }}
      >
        {props.children}
        {props.editing?
        <i
          className={"glyphicon glyphicon-pencil"}
          style={pencil}
        ></i> : ''}
      </div>}
    </div>
  )
}