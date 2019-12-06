import { useState, useEffect, useRef } from 'react';
import dateTimeString from '../utils/date-time-string';

export default props => {
  const [hover, setHover] = useState(false),
  [modify, setModify] = useState(false),
  [temp, setTemp] = useState(undefined),
  uploadRef = useRef(<input value='' />),
  editView = {
    position: 'relative',
    display: 'inline-block',
    cursor: props.editing? 'pointer' : props.type === 'image'? 'default' : 'text'
  },
  pencil = {
    position: 'absolute',
    right: props.type === 'image'? `42.5%` : '-1.5em',
    top: props.type === 'image'? `42.5%` : props.size + 'vh',
    color: modify? '#000': hover? '#000' : '#ddd',
    fontSize: props.type === 'image'? '72px' : '16px',
    opacity: props.type === 'image' && !hover? '50%' : '100%',
    textShadow: props.type === 'image' && hover? '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' : 'none',
    display: props.file? 'none' : 'inline-block'
  },
  updateEvent = e => {
    props.setCurrentEvent({...props.currentEvent, [props.value]: e.target.value })
  },
  keyPrompt = e => {
    if (e.keyCode === 13) {
      setModify(false);
    } else if (e.keyCode === 27) {
      props.setCurrentEvent(temp);
      setModify(false);
    }
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
      if (props.editing && props.type === 'image') {
        uploadRef.current.click();
      } else if (!modify && props.editing) {
          setTemp(props.currentEvent);
          setModify(true);
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
          onKeyDown={keyPrompt}
        />
        :
        props.type === 'time'?
        <div>
          <input
            onKeyDown={keyPrompt}
            type="time"
            value={dateTimeString(props.currentEvent[props.value])[3]}
            onChange={e => {
              let timeString = props.currentEvent[props.value].split('T');
              timeString = `${timeString[0]}T${e.target.value}:00.000Z`;
              props.setCurrentEvent({...props.currentEvent, [props.value]: timeString });
            }}
          />
          <input
            onKeyDown={keyPrompt}
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
          onKeyDown={keyPrompt}
          value={props.currentEvent[props.value]}
          size={props.type === "number"? 3 : props.currentEvent[props.value].length}
          type={props.type? props.type : 'text'}
          onChange={updateEvent}
        /> 
      :
      <div>
        {
          props.type === 'time'?
          `${dateTimeString(props.currentEvent[props.value])[1]} ${dateTimeString(props.currentEvent[props.value])[0]}`
          :
          props.type === 'image'?
          <div>
            <input
              type="file"
              ref={uploadRef}
              id="uploader"
              onChange={e => {
                props.setFile(e.target.files[0]);
              }}
            />
            <img src={props.currentEvent.image_link} alt={props.currentEvent.name} />
            <div className="filename">
              <h2>{props.file? props.file.name : ''}</h2>
            </div>
          </div>
          :
          props.currentEvent[props.value]
        }
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
      <style jsx>{`
          img {
            max-width: 35em;
            margin-bottom: 1em;
            display: ${props.editing && props.file? 'none' : 'inline-block'};
          }
          .filename {
            margin-bottom: 1em;
            padding: 5em 7.5em;
            border: 1px solid #000;
            border-radius: 4px;
            display: ${props.editing && props.file? 'inline-block' : 'none'}
          }
          #uploader {
            display: none;
          }
        `}
      </style>
    </div>
  )
}