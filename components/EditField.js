import { useState, useEffect, useRef } from 'react';
import dateTimeString from '../utils/date-time-string';
import serverCall from '../utils/server-call';

export default props => {
  const [hover, setHover] = useState(false),
  [modify, setModify] = useState(false),
  [categories, setCategories] = useState(undefined),
  [temp, setTemp] = useState(undefined),
  tempPicURL = "../static/blank-user.png",
  uploadRef = useRef(<input value='' />),
  editView = {
    position: 'relative',
    display: 'inline-block',
    cursor: props.editing? 'pointer' : props.type === 'image'? 'default' : 'text'
  },
  pencil = {
    position: 'absolute',
    right: props.type === 'image'? props.value === 'profile_pic'? `25%` : `42.5%` : '-1.5em',
    top: props.type === 'image'? props.value === 'profile_pic'? `25%` : `42.5%` : props.size + 'vh',
    color: modify? '#000': hover? '#000' : '#ddd',
    fontSize: props.type === 'image'? '72px' : '16px',
    opacity: props.type === 'image' && !hover? '50%' : '100%',
    textShadow: props.type === 'image' && hover? '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' : 'none',
    display: props.file? 'none' : 'inline-block'
  },
  updateEvent = e => {
    props.setUpdate({...props.update, [props.value]: e.target.value })
  },
  keyPrompt = e => {
    if (e.keyCode === 13) {
      setModify(false);
    } else if (e.keyCode === 27) {
      props.setUpdate(temp);
      setModify(false);
    }
  };

  useEffect(() => {
    setModify(false);
  }, [props.editing]);

  useEffect(() => {
    if (!categories && props.value === 'category_name') {
      serverCall('GET', `categories`).then(res => {
        setCategories(res)
      })
    }
  }, [props.modify]);

  return (
    <div 
      style={editView}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={e => {
      if (props.editing && props.type === 'image') {
        uploadRef.current.click();
      } else if (!modify && props.editing) {
          setTemp(props.update);
          setModify(true);
        }
      }}
    >
      {modify?
        props.type === 'textarea'?
        <textarea
          style={{resize: 'none'}}
          value={props.update[props.value]}
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
            value={dateTimeString(props.update[props.value])[3]}
            onChange={e => {
              let timeString = props.update[props.value].split('T');
              timeString = `${timeString[0]}T${e.target.value}:00.000Z`;
              props.setUpdate({...props.update, [props.value]: timeString });
            }}
          />
          <input
            onKeyDown={keyPrompt}
            type="date"
            value={dateTimeString(props.update[props.value])[4]}
            onChange={e => {
              let dateString = props.update[props.value].split('T');
              dateString = `${e.target.value}T${dateString[1]}`;
              props.setUpdate({...props.update, [props.value]: dateString });
            }}
          />
        </div>
        :
        props.type === 'select'?
        <select
          value={props.update[props.value]}
          onChange={e => {
            props.setUpdate({
              ...props.update,
              category_name: e.target.value,
              category_id: categories.filter(cat => cat.name === e.target.value)[0].id
            });
          }}
          onKeyDown={keyPrompt}
        >
          {categories.map(cat => {
            return <option key={cat.name}>{cat.name}</option>
        })}
        </select>
        :
        props.type === 'username'?
        <div>
          <input 
            value={props.update.first_name}
            onChange={e => {
              props.setUpdate({...props.update,
                first_name: e.target.value,
                full_name: `${e.target.value} ${props.update.last_name}`
              })
            }}
            onKeyDown={keyPrompt}
            />
          <input 
            value={props.update.last_name}
            onChange={e => {
              props.setUpdate({...props.update,
                last_name: e.target.value,
                full_name: `${props.update.first_name} ${e.target.value}`
              })
            }}
            onKeyDown={keyPrompt}
          />
        </div>
        :
        <input
          onKeyDown={keyPrompt}
          value={props.update[props.value]}
          size={props.type === "number"? 3 : props.update[props.value].length}
          type={props.type? props.type : 'text'}
          onChange={updateEvent}
        /> 
      :
      <div>
        {
          props.type === 'time'?
          `${dateTimeString(props.update[props.value])[1]} ${dateTimeString(props.update[props.value])[0]}`
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
            {
              props.editing && props.file? 
              <div className="filename">
                <h2>{props.file? props.file.name : ''}</h2>
              </div>
              :
              props.value === 'profile_pic'? <div className="profile-pic"></div> : <img src={props.update[props.value]} alt={props.update.id} />
            }
          </div>
          :
          props.type === 'select'?
          <div>
            - {props.update[props.value]} -
          </div>
          :
          props.update[props.value]
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
          .profile-pic {
            border-radius: 15px;
            min-width: 15rem;
            min-height: 15rem;
            display: inline-block;
            background: url(${props.update.profile_pic? props.update.profile_pic : tempPicURL}) no-repeat center;
            background-size: cover;
          }
          .filename {
            margin-bottom: 1em;
            padding: 5em 7.5em;
            border: 1px solid #000;
            border-radius: 4px;
          }
          #uploader {
            display: none;
          }
        `}
      </style>
    </div>
  )
}