import symbols from '../utils/symbols';
import handleUpload from '../utils/handle-upload';
import serverCall from '../utils/server-call';
import Router from 'next/router';

export default props => {
  const postUpdate = update => {
    console.log(update)
    serverCall('PUT', `${props.path}/${props.update.id}`, update)
    .then(response => {
      if (response.id) {
        if (props.image === 'image_link') {
          Router.push(`/${response.id}`);
        } else {
          window.location.reload();
        }
      } else {
        props.setError('error, see console');
        console.error(response);
      }
    })
    .catch(error => {
      props.setError('error, see console');
      console.error(error);
    });
  };

  return props.editing?
    <div>
      <a
        onClick={() => {
          props.setEditing(false);
          if (props.file) {
            handleUpload(props.file, props.setLoading).then(res => {
              const update = ({...props.update, [props.image]: `http://d2b7dtg3ypekdu.cloudfront.net${res.split('com')[1]}` });
              if (props.update[props.image] && props.update[props.image].includes('cloudfront')) {
                serverCall('DELETE', `s3/delete`, { 
                  filename: symbols(props.update[props.image].split('%2F')[1])
                }).then(() => postUpdate(update));
              } else {
                postUpdate(update)
              }
            });
          } else {
            serverCall('PUT', `${props.path}/${props.update.id}`, props.update);
          };
        }}
      >
        Save
      </a> - <a
        onClick={() => {
          props.setEditing(false);
          props.setUpdate(props.original);
          props.setFile('')
        }}
      >
        Discard
      </a>
    </div>
  :
  <a onClick={() => props.setEditing(true)}>Edit {props.label}</a>
};
