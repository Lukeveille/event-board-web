import { useState, useEffect } from 'react';
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
  },
  updateEvent = e => {
    props.setCurrentEvent({...props.currentEvent, [props.value]: e.target.value })
  };

  useEffect(() => {
    setModify(false);
  }, [props.editing]);

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
        value={props.currentEvent[props.value]}
        type="number"
        cols="70"
        rows="5"
        onChange={updateEvent}
      />
      :
      props.type === 'time'?
      <div>
        <input
          type="time"
          value={dateTimeString(props.currentEvent[props.value])[3]}
          onChange={e => {
            let timeString = props.currentEvent[props.value].split('T');
            timeString = `${timeString[0]}T${e.target.value}:00.000Z`;
            props.setCurrentEvent({...props.currentEvent, [props.value]: timeString });
          }}
        />
        <input
          type="date"
          value={dateTimeString(props.currentEvent[props.value])[4]}
          onChange={e => {
            let dateString = props.currentEvent[props.value].split('T');
            dateString = `${e.target.value}T${dateString[1]}`;
            props.setCurrentEvent({...props.currentEvent, [props.value]: dateString });
          }}
        />
      </div>
      :
      <input
        value={props.currentEvent[props.value]}
        size={props.type === "number"? 3 : props.currentEvent[props.value].length}
        type={props.type? props.type : 'text'}
        onChange={updateEvent}
      /> 
      :
      <div>
        {props.type === 'time'? `${dateTimeString(props.currentEvent[props.value])[1]} ${dateTimeString(props.currentEvent[props.value])[0]}` : props.currentEvent[props.value]}
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