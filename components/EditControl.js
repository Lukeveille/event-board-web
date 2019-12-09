import symbols from '../utils/symbols';
import handleUpload from '../utils/handle-upload';
import serverCall from '../utils/server-call';
import Router from 'next/router';

export default props => {
  return props.editing?
    <div>
      <a
        onClick={() => {
          props.setEditing(false);
          if (props.file) {
            handleUpload(props.file, props.setLoading).then(res => {
              const update = ({...props.update, [props.image]: `http://d2b7dtg3ypekdu.cloudfront.net${res.split('com')[1]}` });
              serverCall('DELETE', `s3/delete`, { filename: symbols(props.update.image_link.split('%2F')[1]) }).then(() => {
                serverCall('PUT', `${props.path}/${props.update.id}`, update)
                .then(response => {
                  if (response.id) {
                    props.setLoading(false);
                    Router.push(`/${response.id}`);
                  } else {
                    props.setError('error, see console');
                    console.error(response);
                  }
                })
                .catch(error => {
                  props.setError('error, see console');
                  console.error(error);
                });
              })
            })
          } else {
            serverCall('PUT', `${props.path}/${props.update.id}`, props.update);
          }
        }}
      >
        Save
      </a> - <a
        onClick={() => {
          props.setEditing(false);
          props.setCurrentEvent(props.original);
          props.setFile('')
        }}
      >
        Discard
      </a>
      <div className="cancel">
        <a
          onClick={() => {
            props.setCancelModal('block');
          }}
        >
          <h3 className="cancel-btn" style={{display: 'inline-block'}}>Cancel Event</h3>
        </a>
      </div>
      <style jsx>{`
        .cancel-btn {
          color: #d00;
        }
        .cancel-btn:hover {
          color: #b00;
          text-decoration: underline;
      `}
    </style>
    </div>
  :
  <a onClick={() => props.setEditing(true)}>Edit</a>
}